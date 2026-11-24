import { useState } from 'react'

function DestinationSpotCard({ spot, index, fallbackImage }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <article
      className={`destination-spot-card is-interactive${isOpen ? ' is-open' : ''}`}
      onClick={() => setIsOpen((prev) => !prev)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          setIsOpen((prev) => !prev)
        }
      }}
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
    >
      <div className="destination-spot-photo-wrap">
        <img
          src={spot.image || fallbackImage}
          alt={spot.name}
          loading="lazy"
          onError={(event) => {
            if (fallbackImage && event.currentTarget.src !== fallbackImage) {
              event.currentTarget.src = fallbackImage
            }
          }}
        />
        <div className="destination-spot-photo-badges">
          <span className="destination-spot-number">{String(index + 1).padStart(2, '0')}</span>
          <span className="destination-spot-badge">{spot.category}</span>
          <span className="destination-spot-rating" aria-label={`Rating ${spot.rating}`}>
            ★ {spot.rating}
          </span>
        </div>
        <span className="destination-spot-photo-area">📍 {spot.area}</span>
      </div>

      <div className="destination-spot-interactive-body">
        <div className="destination-spot-title-row">
          <h3>{spot.name}</h3>
          <span className="destination-spot-trigger">
            {isOpen ? 'Tutup ▴' : 'Detail ▾'}
          </span>
        </div>

        <div className={`destination-spot-collapse${isOpen ? ' is-expanded' : ''}`}>
          <div className="destination-spot-collapse-inner">
            <p>{spot.description}</p>
          </div>
        </div>

        <div className="destination-spot-footer">
          <span>🕒 Waktu terbaik: <strong>{spot.bestTime}</strong></span>
        </div>
      </div>
    </article>
  )
}

export default DestinationSpotCard

