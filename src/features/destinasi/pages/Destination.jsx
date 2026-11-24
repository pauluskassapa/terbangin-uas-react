import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { airports, formatRupiah } from '../../../data/penerbangan.js'
import DestinationSpotCard from '../components/DestinationSpotCard.jsx'
import { defaultDestinationCode, destinations } from '../data/destinationData.js'
import './Destination.css'

const destinationList = Object.values(destinations)

function getTodayDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function Destination() {
  const { code } = useParams()
  const activeCode = code && destinations[code.toUpperCase()] ? code.toUpperCase() : defaultDestinationCode
  const destination = destinations[activeCode]

  return <DestinationContent key={activeCode} destination={destination} />
}

function DestinationContent({ destination }) {
  const navigate = useNavigate()

  const availableOrigins = useMemo(
    () => airports.filter((airport) => airport.code !== destination.code),
    [destination.code]
  )

  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [originCode, setOriginCode] = useState(() =>
    availableOrigins.some((airport) => airport.code === 'CGK')
      ? 'CGK'
      : availableOrigins[0]?.code || 'CGK'
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [activePhoto, setActivePhoto] = useState(null)

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

  const searchHint = destination.spots[0]?.area?.split('·')[0]?.trim() || destination.city

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
      <nav className="destination-switcher-bar" aria-label="Pilih destinasi wisata">
        <div className="page-wrap destination-switcher-inner">
          <span className="destination-switcher-label">JELAJAHI KOTA</span>
          <div className="destination-switcher-list">
            {destinationList.map((item) => {
              const isActive = item.code === destination.code
              return (
                <Link
                  key={item.code}
                  to={`/destinasi/${item.code}`}
                  className={`destination-switcher-item${isActive ? ' is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <img src={item.heroImage} alt="" aria-hidden="true" />
                  <span className="destination-switcher-text">
                    <strong>{item.city}</strong>
                    <small>{item.code}</small>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

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

      {destination.gallery?.length > 0 && (
        <section
          className="page-wrap destination-gallery-section"
          aria-labelledby="gallery-heading"
        >
          <div className="destination-gallery-header">
            <div>
              <span className="eyebrow">✦ GALERI VISUAL · {destination.city.toUpperCase()}</span>
              <h2 id="gallery-heading">Galeri Suasana {destination.city}</h2>
            </div>
            <p>Klik foto untuk melihat tampilan penuh sudut-sudut terbaik di {destination.city}.</p>
          </div>

          <div className="destination-bento-grid">
            {destination.gallery.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`destination-bento-item is-${item.layout || 'normal'}`}
                onClick={() => setActivePhoto(item)}
                aria-label={`Perbesar foto ${item.title}`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = destination.heroImage
                  }}
                />
                <div className="destination-bento-overlay">
                  <span className="destination-bento-location">📍 {item.location}</span>
                  <strong>{item.title}</strong>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {activePhoto && (
        <div
          className="destination-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="destination-lightbox-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="destination-lightbox-close"
              onClick={() => setActivePhoto(null)}
              aria-label="Tutup pratinjau foto"
            >
              ✕ Tutup
            </button>
            <img
              src={activePhoto.image}
              alt={activePhoto.title}
              onError={(event) => {
                event.currentTarget.onerror = null
                event.currentTarget.src = destination.heroImage
              }}
            />
            <div className="destination-lightbox-caption">
              <span>📍 {activePhoto.location}</span>
              <strong>{activePhoto.title}</strong>
            </div>
          </div>
        </div>
      )}

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
              placeholder={`Cari spot di ${destination.city} (misal: ${searchHint})...`}
              aria-label={`Cari tempat wisata di ${destination.city}`}
            />
          </div>
        </div>

        <div className="destination-layout">
          <div>
            {filteredSpots.length > 0 ? (
              <div className="destination-spots-grid">
                {filteredSpots.map((spot, index) => (
                  <DestinationSpotCard
                    key={spot.id}
                    spot={spot}
                    index={index}
                    fallbackImage={destination.heroImage}
                  />
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