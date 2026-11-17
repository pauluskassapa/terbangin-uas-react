import { useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { airports, formatRupiah } from '../../../data/penerbangan.js'
import DestinationSpotCard from '../components/DestinationSpotCard.jsx'
import { defaultDestinationCode, destinations } from '../data/destinationData.js'
import './Destination.css'

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Destination() {
  const { code } = useParams()
  const navigate = useNavigate()

  const activeCode = code && destinations[code.toUpperCase()] ? code.toUpperCase() : defaultDestinationCode
  const destination = destinations[activeCode]

  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [originCode, setOriginCode] = useState('CGK')
  const [searchQuery, setSearchQuery] = useState('')

  const availableOrigins = useMemo(
    () => airports.filter((airport) => airport.code !== destination.code),
    [destination.code]
  )

  const filteredSpots = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return destination.spots.filter((spot) => {
      const matchesCategory =
        selectedCategory === 'Semua' || spot.category === selectedCategory
      const matchesSearch =
        !query ||
        spot.name.toLowerCase().includes(query) ||
        spot.area.toLowerCase().includes(query) ||
        spot.description.toLowerCase().includes(query)
      return matchesCategory && matchesSearch
    })
  }, [destination.spots, selectedCategory, searchQuery])

  function handleSearchFlights() {
    const params = new URLSearchParams({
      from: originCode,
      to: destination.code,
      date: getTodayDate(),
      passengers: '1',
    })
    navigate(`/penerbangan?${params.toString()}`)
  }

  return (
    <main className="destination-page">
      <section
        className="destination-hero"
        style={
          destination.heroImage
            ? { '--destination-hero-image': `url(${destination.heroImage})` }
            : undefined
        }
      >
        <div className="page-wrap destination-hero-inner">
          <div className="destination-hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-spark">✳</span> DESTINASI LIBURAN · {destination.province.toUpperCase()}
            </span>
            <h1>
              {destination.heroTitle}{' '}
              <span>{destination.heroAccent}</span>
            </h1>
            <p>{destination.tagline}</p>

            <div className="destination-highlights">
              {destination.highlights.map((item) => (
                <div key={item.label} className="destination-highlight-item">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="destination-quick-book">
            <span className="eyebrow">TERBANG KE {destination.city.toUpperCase()}</span>
            <h2>Mulai dari {formatRupiah(destination.startingPrice)}</h2>
            <p className="destination-airport-note">✈ {destination.airport}</p>

            <label className="destination-origin-field">
              <span>PILIH KOTA KEBERANGKATAN</span>
              <select
                value={originCode}
                onChange={(event) => setOriginCode(event.target.value)}
                aria-label="Pilih kota keberangkatan"
              >
                {availableOrigins.map((airport) => (
                  <option key={airport.code} value={airport.code}>
                    {airport.city} ({airport.code})
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              className="button button-primary destination-cta-btn"
              onClick={handleSearchFlights}
            >
              Cari Tiket ke {destination.city} <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </section>

      {destination.videoUrl && (
        <section className="page-wrap destination-video-section" aria-labelledby="video-preview-heading">
          <div className="destination-video-card">
            <div className="destination-video-info">
              <span className="eyebrow">▶ TRAILER DESTINASI · {destination.city.toUpperCase()}</span>
              <h2 id="video-preview-heading">{destination.videoTitle}</h2>
              <p>{destination.videoDescription}</p>
            </div>
            <div className="destination-video-frame">
              <iframe
                src={destination.videoUrl}
                title={destination.videoTitle}
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      )}

      <section className="page-wrap destination-content">
        <div className="destination-toolbar">
          <div className="destination-categories" role="tablist" aria-label="Kategori wisata">
            {destination.categories.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category}
                className={
                  selectedCategory === category
                    ? 'destination-category-btn active'
                    : 'destination-category-btn'
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="destination-search-control">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={`Cari spot di ${destination.city} (misal: Ubud, pantai)...`}
              aria-label={`Cari tempat wisata di ${destination.city}`}
            />
          </div>
        </div>

        <div className="destination-layout">
          <div>
            {filteredSpots.length > 0 ? (
              <div className="destination-spots-grid">
                {filteredSpots.map((spot, index) => (
                  <DestinationSpotCard key={spot.id} spot={spot} index={index} />
                ))}
              </div>
            ) : (
              <div className="destination-empty" role="status">
                <span aria-hidden="true">✦</span>
                <h3>Spot wisata tidak ditemukan</h3>
                <p>Coba kata kunci lain atau tampilkan semua kategori wisata.</p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => {
                    setSelectedCategory('Semua')
                    setSearchQuery('')
                  }}
                >
                  Tampilkan Semua Spot
                </button>
              </div>
            )}
          </div>

          <aside className="destination-guide-card">
            <span className="eyebrow">PANDUAN PERJALANAN</span>
            <h2>Tips Liburan ke {destination.city}</h2>
            <p className="destination-season">
              ☀ <strong>Waktu Terbaik:</strong> {destination.bestSeason}
            </p>

            <div className="destination-tips-list">
              {destination.tips.map((tip) => (
                <div key={tip.title} className="destination-tip-item">
                  <span aria-hidden="true">✦</span>
                  <div>
                    <strong>{tip.title}</strong>
                    <small>{tip.detail}</small>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="button button-primary destination-cta-btn"
              onClick={handleSearchFlights}
            >
              Lihat Jadwal Penerbangan <span aria-hidden="true">→</span>
            </button>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Destination