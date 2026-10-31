import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { airports, flights, formatRupiah } from '../data/flightData.js'
import './FlightSearch.css'

function FlightSearch() {
  const [searchParams] = useSearchParams()
  const [airlineFilter, setAirlineFilter] = useState('Semua')
  const [sort, setSort] = useState('recommended')
  const from = searchParams.get('from') || 'CGK'
  const to = searchParams.get('to') || 'DPS'
  const date = searchParams.get('date') || ''
  const origin = airports.find((airport) => airport.code === from) || airports[0]
  const destination = airports.find((airport) => airport.code === to) || airports[3]
  const airlines = ['Semua', ...new Set(flights.map((flight) => flight.airline))]

  const visibleFlights = useMemo(() => {
    const filteredFlights = flights.filter((flight) => airlineFilter === 'Semua' || flight.airline === airlineFilter)
    return [...filteredFlights].sort((first, second) => {
      if (sort === 'cheapest') return first.price - second.price
      if (sort === 'earliest') return first.departure.localeCompare(second.departure)
      return first.recommendation - second.recommendation
    })
  }, [airlineFilter, sort])

  const formattedDate = date
    ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(`${date}T00:00:00`))
    : 'Pilih tanggal perjalanan'

  return (
    <main className="results-page page-wrap">
      <div className="results-topline"><span className="eyebrow">PENERBANGAN UNTUKMU</span><Link to="/">← Ubah pencarian</Link></div>
      <section className="route-summary">
        <div>
          <span className="route-date">{formattedDate}</span>
          <h1>{origin.city}<span className="route-arrow">→</span>{destination.city}</h1>
          <p>{origin.code} <i>·</i> Penerbangan langsung tersedia <i>·</i> 1 penumpang</p>
        </div>
        <div className="route-badge"><span>✈</span><strong>{visibleFlights.length}</strong><small>pilihan tiket</small></div>
      </section>

      <div className="results-layout">
        <aside className="filter-panel">
          <div className="filter-heading"><h2>Filter</h2><button type="button" onClick={() => setAirlineFilter('Semua')}>Atur ulang</button></div>
          <span className="filter-label">MASKAPAI</span>
          <div className="airline-options">
            {airlines.map((airline) => (
              <button key={airline} type="button" className={airlineFilter === airline ? 'filter-option active' : 'filter-option'} onClick={() => setAirlineFilter(airline)}>
                <span className="filter-radio" />{airline}
              </button>
            ))}
          </div>
          <div className="filter-tip"><span>✦</span><p>Tip: tiket pagi cocok untuk memulai liburan lebih awal.</p></div>
        </aside>

        <section className="flight-list" aria-label="Daftar penerbangan tersedia">
          <div className="list-heading">
            <div><h2>Penerbangan tersedia</h2><p>Harga contoh untuk keperluan tampilan.</p></div>
            <label className="sort-select">Urutkan<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Rekomendasi</option><option value="cheapest">Harga terendah</option><option value="earliest">Berangkat paling awal</option></select></label>
          </div>
          {visibleFlights.length ? visibleFlights.map((flight) => {
            const detailParams = new URLSearchParams({ from, to, date })
            return (
              <article className="flight-card" key={flight.id}>
                <div className="flight-airline"><span className={`airline-logo ${flight.color}`}>{flight.mark}</span><div><strong>{flight.airline}</strong><span>{flight.number} · Ekonomi</span></div></div>
                <div className="flight-times"><div><strong>{flight.departure}</strong><span>{origin.code} · {origin.city}</span></div><div className="flight-duration"><span>Langsung</span><i /><small>{flight.duration}</small></div><div><strong>{flight.arrival}</strong><span>{destination.code} · {destination.city}</span></div></div>
                <div className="flight-purchase"><strong>{formatRupiah(flight.price)}</strong><span>per penumpang</span><Link className="button button-primary" to={`/penerbangan/${flight.id}?${detailParams.toString()}`}>Lihat detail <b>→</b></Link></div>
                <div className="flight-perks"><span>✓ Bagasi {flight.baggage}</span><span>✓ {flight.perk}</span></div>
              </article>
            )
          }) : <div className="empty-state"><span>✈</span><h3>Tidak ada penerbangan</h3><p>Coba atur ulang filter.</p></div>}
        </section>
      </div>
    </main>
  )
}

export default FlightSearch
