import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { supabase } from '../../../lib/supabaseClient.js'
import { destinations } from '../data/destinationData.js'
import './Destination.css'
import './SavedSpots.css'

const destinationList = Object.values(destinations)
const SAVED_SPOTS_STORAGE_KEY = 'terbangin_saved_spots'

const spotLookupMap = new Map()
destinationList.forEach((destination) => {
  const allPlaces = [
    ...(destination.spots || []),
    ...(destination.culinary || []),
    ...(destination.souvenirs || []),
  ]
  allPlaces.forEach((spot) => {
    spotLookupMap.set(`${destination.code}:${spot.id}`, {
      ...spot,
      bestTime: spot.bestTime || spot.openHours || 'Pagi - Malam',
      city: destination.city,
      destinationCode: destination.code,
      fallbackImage: destination.heroImage,
    })
  })
})

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatSavedTime(timestamp) {
  if (!timestamp) return 'Tersimpan'
  const date = new Date(timestamp)
  if (Number.isNaN(date.getTime())) return 'Tersimpan'
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function readAllLocalSavedSpots() {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVED_SPOTS_STORAGE_KEY) || '{}')
    const rows = []
    Object.entries(raw).forEach(([destinationCode, ids]) => {
      if (!Array.isArray(ids)) return
      ids.forEach((spotId) => {
        const detail = spotLookupMap.get(`${destinationCode}:${spotId}`)
        rows.push({
          id: `${destinationCode}-${spotId}`,
          destination_code: destinationCode,
          spot_id: spotId,
          spot_name: detail?.name || spotId,
          created_at: null,
        })
      })
    })
    return rows
  } catch {
    return []
  }
}

function removeLocalSavedSpot(destinationCode, spotId) {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVED_SPOTS_STORAGE_KEY) || '{}')
    if (Array.isArray(raw[destinationCode])) {
      raw[destinationCode] = raw[destinationCode].filter((id) => id !== spotId)
      localStorage.setItem(SAVED_SPOTS_STORAGE_KEY, JSON.stringify(raw))
    }
  } catch {
    // Abaikan jika storage browser tidak tersedia
  }
}

function SavedSpots() {
  const [savedRows, setSavedRows] = useState(() => (supabase ? [] : readAllLocalSavedSpots()))
  const [isLoading, setIsLoading] = useState(Boolean(supabase))
  const [selectedCity, setSelectedCity] = useState('ALL')
  const [removingKey, setRemovingKey] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!supabase) return

    let isCancelled = false

    async function fetchAllSavedSpots() {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('saved_spots')
        .select('id, destination_code, spot_id, spot_name, created_at')
        .order('created_at', { ascending: false })

      if (isCancelled) return

      if (error) {
        setErrorMessage('Gagal memuat daftar tempat tersimpan dari Supabase.')
      } else {
        setSavedRows(data || [])
        setErrorMessage('')
      }
      setIsLoading(false)
    }

    fetchAllSavedSpots()

    return () => {
      isCancelled = true
    }
  }, [])

  const enrichedSpots = useMemo(() => {
    const seen = new Set()
    const items = []

    savedRows.forEach((row) => {
      const lookupKey = `${row.destination_code}:${row.spot_id}`
      if (seen.has(lookupKey)) return
      seen.add(lookupKey)

      const detail = spotLookupMap.get(lookupKey)
      const destination = destinations[row.destination_code]

      items.push({
        key: lookupKey,
        rowId: row.id,
        destinationCode: row.destination_code,
        spotId: row.spot_id,
        city: destination?.city || row.destination_code,
        name: detail?.name || row.spot_name,
        area: detail?.area || destination?.province || 'Indonesia',
        category: detail?.category || 'Wisata',
        rating: detail?.rating || '4.8',
        bestTime: detail?.bestTime || 'Pagi - Sore',
        description: detail?.description || 'Spot wisata pilihan yang kamu simpan untuk perjalanan berikutnya.',
        image: detail?.image || destination?.heroImage,
        fallbackImage: destination?.heroImage,
        savedLabel: formatSavedTime(row.created_at),
      })
    })

    return items
  }, [savedRows])

  const citySummary = useMemo(() => {
    const counts = new Map()
    enrichedSpots.forEach((spot) => {
      if (!counts.has(spot.destinationCode)) {
        counts.set(spot.destinationCode, {
          code: spot.destinationCode,
          city: spot.city,
          count: 0,
        })
      }
      counts.get(spot.destinationCode).count += 1
    })
    return Array.from(counts.values())
  }, [enrichedSpots])

  const activeCityFilter = useMemo(() => {
    if (selectedCity === 'ALL') return 'ALL'
    return citySummary.some((city) => city.code === selectedCity) ? selectedCity : 'ALL'
  }, [citySummary, selectedCity])

  const visibleSpots = useMemo(() => {
    if (activeCityFilter === 'ALL') return enrichedSpots
    return enrichedSpots.filter((spot) => spot.destinationCode === activeCityFilter)
  }, [enrichedSpots, activeCityFilter])

  function removeSpotFromState(destinationCode, spotId) {
    setSavedRows((prev) => {
      const next = prev.filter(
        (row) => !(row.destination_code === destinationCode && row.spot_id === spotId)
      )
      const hasRemainingInSelectedCity = next.some(
        (row) => row.destination_code === selectedCity
      )
      if (selectedCity !== 'ALL' && !hasRemainingInSelectedCity) {
        setSelectedCity('ALL')
      }
      return next
    })
  }

  async function handleRemoveSpot(spot) {
    if (removingKey === spot.key) return
    setErrorMessage('')

    if (!supabase) {
      removeLocalSavedSpot(spot.destinationCode, spot.spotId)
      removeSpotFromState(spot.destinationCode, spot.spotId)
      return
    }

    setRemovingKey(spot.key)
    try {
      const { error } = await supabase
        .from('saved_spots')
        .delete()
        .eq('destination_code', spot.destinationCode)
        .eq('spot_id', spot.spotId)

      if (error) throw error

      removeSpotFromState(spot.destinationCode, spot.spotId)
    } catch {
      setErrorMessage('Gagal menghapus spot dari Supabase. Coba ulangi beberapa saat lagi.')
    } finally {
      setRemovingKey(null)
    }
  }

  return (
    <main className="destination-page saved-spots-page">
      <nav className="destination-switcher-bar" aria-label="Pilih destinasi wisata">
        <div className="page-wrap destination-switcher-inner">
          <span className="destination-switcher-label">JELAJAHI KOTA</span>
          <div className="destination-switcher-list">
            {destinationList.map((item) => (
              <Link
                key={item.code}
                to={`/destinasi/${item.code}`}
                className="destination-switcher-item"
              >
                <img src={item.heroImage} alt="" aria-hidden="true" />
                <span className="destination-switcher-text">
                  <strong>{item.city}</strong>
                  <small>{item.code}</small>
                </span>
              </Link>
            ))}
            <Link
              to="/destinasi/tersimpan"
              className="destination-switcher-item is-saved-link is-active"
              aria-current="page"
            >
              <span className="destination-switcher-text">
                <strong>♥ Tersimpan</strong>
                <small>{enrichedSpots.length}</small>
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <section className="saved-spots-hero">
        <div className="page-wrap saved-spots-hero-inner">
          <div className="saved-spots-hero-copy">
            <span className="eyebrow">♥ WISHLIST DESTINASI · TERBANGIN</span>
            <h1>
              Tempat Wisata <span>Tersimpan.</span>
            </h1>
            <p>
              Kumpulkan spot favoritmu dari berbagai kota untuk merencanakan liburan berikutnya, lalu cari tiket pesawatnya langsung dari sini.
            </p>
          </div>

          <div className="saved-spots-stats">
            <div className="saved-spots-stat-card">
              <span>TOTAL SPOT</span>
              <strong>{enrichedSpots.length} Spot</strong>
            </div>
            <div className="saved-spots-stat-card">
              <span>KOTA TUJUAN</span>
              <strong>{citySummary.length} Kota</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="page-wrap saved-spots-content">
        <div className="saved-spots-toolbar">
          <div className="destination-categories" role="tablist" aria-label="Filter kota tersimpan">
            <button
              type="button"
              role="tab"
              aria-selected={activeCityFilter === 'ALL'}
              className={
                activeCityFilter === 'ALL'
                  ? 'destination-category-btn active'
                  : 'destination-category-btn'
              }
              onClick={() => setSelectedCity('ALL')}
            >
              Semua Kota ({enrichedSpots.length})
            </button>
            {citySummary.map((city) => (
              <button
                key={city.code}
                type="button"
                role="tab"
                aria-selected={activeCityFilter === city.code}
                className={
                  activeCityFilter === city.code
                    ? 'destination-category-btn active'
                    : 'destination-category-btn'
                }
                onClick={() => setSelectedCity(city.code)}
              >
                {city.city} ({city.count})
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <p className="destination-save-error" role="alert">
            {errorMessage}
          </p>
        )}

        {isLoading ? (
          <div className="saved-spots-loading" role="status">
            Memuat tempat wisata tersimpan dari Supabase...
          </div>
        ) : visibleSpots.length > 0 ? (
          <div className="saved-spots-grid">
            {visibleSpots.map((spot) => {
              const flightParams = new URLSearchParams({
                from: spot.destinationCode === 'CGK' ? 'SUB' : 'CGK',
                to: spot.destinationCode,
                date: getTodayDate(),
                passengers: '1',
              })

              return (
                <article key={spot.key} className="saved-spot-card">
                  <div className="saved-spot-photo">
                    <img
                      src={spot.image || spot.fallbackImage}
                      alt={spot.name}
                      loading="lazy"
                      onError={(event) => {
                        if (spot.fallbackImage && event.currentTarget.src !== spot.fallbackImage) {
                          event.currentTarget.src = spot.fallbackImage
                        }
                      }}
                    />
                    <div className="saved-spot-badges">
                      <span className="saved-spot-city-pill">
                        {spot.city} · {spot.destinationCode}
                      </span>
                      <span className="destination-spot-badge">{spot.category}</span>
                      <span className="destination-spot-rating">★ {spot.rating}</span>
                    </div>
                    <div className="saved-spot-photo-bottom">
                      <span>📍 {spot.area}</span>
                      <small>{spot.savedLabel}</small>
                    </div>
                  </div>

                  <div className="saved-spot-body">
                    <h3>{spot.name}</h3>
                    <p>{spot.description}</p>

                    <div className="saved-spot-meta">
                      <span>
                        🕒 Waktu terbaik: <strong>{spot.bestTime}</strong>
                      </span>
                    </div>

                    <div className="saved-spot-actions">
                      <Link
                        to={`/destinasi/${spot.destinationCode}`}
                        className="saved-spot-action-link"
                      >
                        Lihat {spot.city} →
                      </Link>
                      <Link
                        to={`/penerbangan?${flightParams.toString()}`}
                        className="saved-spot-ticket-link"
                      >
                        ✈ Tiket
                      </Link>
                      <button
                        type="button"
                        className="saved-spot-remove-btn"
                        disabled={removingKey === spot.key}
                        onClick={() => handleRemoveSpot(spot)}
                      >
                        {removingKey === spot.key ? 'Menghapus...' : '✕ Hapus'}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="destination-empty" role="status">
            <span aria-hidden="true">♡</span>
            <h3>Belum ada spot wisata tersimpan</h3>
            <p>
              Jelajahi destinasi liburan favoritmu lalu tekan tombol <strong>♡ Simpan</strong> pada spot wisata yang ingin kamu kunjungi.
            </p>
            <Link className="button button-primary" to="/destinasi">
              Jelajahi Destinasi →
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}

export default SavedSpots
