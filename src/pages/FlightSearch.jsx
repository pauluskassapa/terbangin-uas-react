import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import PassengerPicker from '../components/PassengerPicker.jsx'
import { airports, flights, formatRupiah, getPassengerCount } from '../data/flightData.js'
import './FlightSearch.css'

const departurePeriods = [
  { id: 'morning', label: 'Pagi', hours: '05.00–11.00', start: 5, end: 11 },
  { id: 'afternoon', label: 'Siang', hours: '11.00–17.00', start: 11, end: 17 },
  { id: 'evening', label: 'Malam', hours: '17.00–23.00', start: 17, end: 23 },
]

function FlightSearch() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [airlineFilter, setAirlineFilter] = useState('Semua')
  const [timeFilters, setTimeFilters] = useState([])
  const [sort, setSort] = useState('recommended')
  const queryString = searchParams.toString()
  const query = new URLSearchParams(queryString)
  const [from, setFrom] = useState(query.get('from') || 'CGK')
  const [to, setTo] = useState(query.get('to') || 'DPS')
  const [date, setDate] = useState(query.get('date') || '')
  const [passengers, setPassengers] = useState(getPassengerCount(query.get('passengers')))
  const [formError, setFormError] = useState('')
  const origin = airports.find((airport) => airport.code === (query.get('from') || 'CGK')) || airports[0]
  const destination = airports.find((airport) => airport.code === (query.get('to') || 'DPS')) || airports[3]
  const searchedPassengers = getPassengerCount(query.get('passengers'))
  const airlines = ['Semua', ...new Set(flights.map((flight) => flight.airline))]

  useEffect(() => {
    const params = new URLSearchParams(queryString)
    setFrom(params.get('from') || 'CGK')
    setTo(params.get('to') || 'DPS')
    setDate(params.get('date') || '')
    setPassengers(getPassengerCount(params.get('passengers')))
    setFormError('')
  }, [queryString])

  function handleSearch(event) {
    event.preventDefault()
    if (from === to) {
      setFormError('Kota asal dan tujuan harus berbeda.')
      return
    }
    setFormError('')
    setAirlineFilter('Semua')
    setTimeFilters([])
    setSort('recommended')
    const params = new URLSearchParams({ from, to, date, passengers: String(passengers) })
    navigate(`/penerbangan?${params.toString()}`)
  }

  function getLocalDate(value) {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }
  function toggleTimeFilter(periodId) {
    setTimeFilters((currentFilters) => currentFilters.includes(periodId)
      ? currentFilters.filter((filter) => filter !== periodId)
      : [...currentFilters, periodId])
  }

  function resetFilters() {
    setAirlineFilter('Semua')
    setTimeFilters([])
    setSort('recommended')
  }

  const visibleFlights = useMemo(() => {
    const filteredFlights = flights.filter((flight) => {
      const matchesAirline = airlineFilter === 'Semua' || flight.airline === airlineFilter
      const departureHour = Number(flight.departure.split('.')[0])
      const matchesTime = timeFilters.length === 0 || departurePeriods.some((period) => (
        timeFilters.includes(period.id) && departureHour >= period.start && departureHour < period.end
      ))
      return matchesAirline && matchesTime
    })
    return [...filteredFlights].sort((first, second) => {
      if (sort === 'cheapest') return first.price - second.price
      if (sort === 'earliest') return first.departure.localeCompare(second.departure)
      return first.recommendation - second.recommendation
    })
  }, [airlineFilter, departurePeriods, sort, timeFilters])

  const formattedDate = date
    ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(`${date}T00:00:00`))
    : 'Pilih tanggal perjalanan'

  return (
    <main className="results-page page-wrap">
      <div className="results-topline"><span className="eyebrow">PENERBANGAN UNTUKMU</span><Link to="/">← Beranda</Link></div>
      <section className="route-summary">
        <div>
          <span className="route-date">{formattedDate}</span>
          <h1>{origin.city}<span className="route-arrow">→</span>{destination.city}</h1>
          <p>{origin.code} <i>·</i> Penerbangan langsung tersedia <i>·</i> {searchedPassengers} penumpang</p>
        </div>
        <div className="route-badge"><span>✈</span><strong>{visibleFlights.length}</strong><small>pilihan tiket</small></div>
      </section>

      <form className="results-search-form" onSubmit={handleSearch} aria-label="Ubah rute dan tanggal penerbangan">
        <label className="results-search-field"><span>BERANGKAT DARI</span><select value={from} onChange={(event) => setFrom(event.target.value)} aria-label="Kota asal">{airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.city} ({airport.code})</option>)}</select></label>
        <label className="results-search-field"><span>KE TUJUAN</span><select value={to} onChange={(event) => setTo(event.target.value)} aria-label="Kota tujuan">{airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.city} ({airport.code})</option>)}</select></label>
        <label className="results-search-field results-date-field"><span>TANGGAL PERGI</span><input type="date" min={getLocalDate(new Date())} value={date} onChange={(event) => setDate(event.target.value)} required /></label>
        <PassengerPicker value={passengers} onChange={setPassengers} />
        <button className="button button-primary results-search-button" type="submit">Cari lagi <span>→</span></button>
        {formError && <p className="form-error results-form-error" role="alert">{formError}</p>}
      </form>

      <div className="results-layout">
        <aside className="filter-panel">
          <div className="filter-heading"><h2>Filter</h2><button type="button" onClick={resetFilters}>Atur ulang</button></div>
          <span className="filter-label">MASKAPAI</span>
          <div className="airline-options">
            {airlines.map((airline) => (
              <button key={airline} type="button" className={airlineFilter === airline ? 'filter-option active' : 'filter-option'} onClick={() => setAirlineFilter(airline)}>
                <span className="filter-radio" />{airline}
              </button>
            ))}
          </div>
          <div className="time-filter-group">
            <span className="filter-label">WAKTU BERANGKAT</span>
            <div className="time-filter-options">
              {departurePeriods.map((period) => (
                <label className="time-filter-option" key={period.id}>
                  <input type="checkbox" checked={timeFilters.includes(period.id)} onChange={() => toggleTimeFilter(period.id)} />
                  <span><strong>{period.label}</strong><small>{period.hours}</small></span>
                </label>
              ))}
            </div>
          </div>
          <div className="filter-tip"><span>✦</span><p>Tip: tiket pagi cocok untuk memulai liburan lebih awal.</p></div>
        </aside>

        <section className="flight-list" aria-label="Daftar penerbangan tersedia">
          <div className="list-heading">
            <div><h2>Penerbangan tersedia</h2><p>Harga contoh untuk keperluan tampilan.</p></div>
            <label className="sort-select">Urutkan<select value={sort} onChange={(event) => setSort(event.target.value)}><option value="recommended">Rekomendasi</option><option value="cheapest">Harga terendah</option><option value="earliest">Berangkat paling awal</option></select></label>
          </div>
          {visibleFlights.length ? visibleFlights.map((flight) => {
            const detailParams = new URLSearchParams({ from, to, date, passengers: String(searchedPassengers) })
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
