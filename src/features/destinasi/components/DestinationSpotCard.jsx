function DestinationSpotCard({ spot, index }) {
  return (
    <article className="destination-spot-card">
      <div className="destination-spot-top">
        <span className="destination-spot-number">{String(index + 1).padStart(2, '0')}</span>
        <span className="destination-spot-badge">{spot.category}</span>
        <span className="destination-spot-rating" aria-label={`Rating ${spot.rating}`}>
          ★ {spot.rating}
        </span>
      </div>

      <div className="destination-spot-body">
        <small className="destination-spot-area">📍 {spot.area}</small>
        <h3>{spot.name}</h3>
        <p>{spot.description}</p>
      </div>

      <div className="destination-spot-footer">
        <span>🕒 Waktu terbaik: <strong>{spot.bestTime}</strong></span>
      </div>
    </article>
  )
}

export default DestinationSpotCard
