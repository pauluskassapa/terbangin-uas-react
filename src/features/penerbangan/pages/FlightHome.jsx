import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import PassengerPicker from '../components/PassengerPicker.jsx'
import { airports } from '../../../data/penerbangan.js'
import './FlightHome.css'
import baliPhoto from '../assets/destination-bali.jpg'
import jogjaPhoto from '../assets/destination-yogyakarta.jpg'
import bajoPhoto from '../assets/destination-labuan-bajo.jpg'
import lombokPhoto from '../assets/destination-lombok.jpg'

const popularDestinations = [
  { code: 'DPS', name: 'Bali', airport: 'I Gusti Ngurah Rai', photo: baliPhoto },
  { code: 'YIA', name: 'Yogyakarta', airport: 'Yogyakarta International Airport', photo: jogjaPhoto },
  { code: 'LBJ', name: 'Labuan Bajo', airport: 'Komodo', photo: bajoPhoto },
  { code: 'LOP', name: 'Lombok', airport: 'Zainuddin Abdul Madjid', photo: lombokPhoto },
]

function getLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function FlightHome() {
  const navigate = useNavigate()
  const [today] = useState(() => getLocalDate(new Date()))
  const [from, setFrom] = useState('CGK')
  const [to, setTo] = useState('DPS')
  const [date, setDate] = useState('')
  const [passengers, setPassengers] = useState(1)
  const [errors, setErrors] = useState({})
  const destinationRef = useRef(null)
  const dateRef = useRef(null)

  function handleSearch(event) {
    event.preventDefault()
    const nextErrors = {}
    if (from === to) nextErrors.route = 'Pilih kota tujuan yang berbeda dari kota asal.'
    const parsed = new Date(`${date}T00:00:00`)
    if (!date) nextErrors.date = 'Pilih tanggal keberangkatan dulu.'
    else if (Number.isNaN(parsed.getTime()) || getLocalDate(parsed) !== date) nextErrors.date = 'Tanggal keberangkatan tidak valid.'
    else if (date < getLocalDate(new Date())) nextErrors.date = 'Tanggal keberangkatan tidak boleh sebelum hari ini.'
    setErrors(nextErrors)
    if (nextErrors.route || nextErrors.date) {
      if (nextErrors.route) destinationRef.current?.focus()
      else dateRef.current?.focus()
      return
    }
    const params = new URLSearchParams({ from, to, date, passengers: String(passengers) })
    navigate(`/penerbangan?${params.toString()}`)
  }

  function swapAirports() {
    setFrom(to)
    setTo(from)
    setErrors((current) => ({ ...current, route: '' }))
  }

  function selectDestination(code) {
    navigate(`/destinasi/${code}`)
  }

  return (
    <main className="home-page">
      <section className="home-lead page-wrap" aria-labelledby="home-title">
        <div className="home-lead-copy">
          <span className="home-lead-label">Tiket pesawat domestik</span>
          <h1 id="home-title">Mau ke mana?<br /><span>Terbangin aja.</span></h1>
          <p>Pilih tujuan, temukan jadwal yang pas, dan bandingkan harga tiket untuk perjalananmu.</p>
        </div>
        <div className="home-lead-photo">
          <img src={bajoPhoto} alt="Pemandangan laut dan pulau dari sebuah dermaga" fetchPriority="high" width="900" height="675" />
          <span className="home-photo-caption">Jelajahi pilihan tujuan di Indonesia</span>
        </div>
      </section>

      <section id="flight-search" className="home-booking page-wrap" aria-labelledby="search-heading">
        <div className="home-booking-heading">
          <h2 id="search-heading">Cari penerbangan</h2>
          <span>Sekali jalan · Ekonomi</span>
        </div>
        <form className="home-flight-form" onSubmit={handleSearch} noValidate>
          <div className="home-airports">
          <label className="home-input-group">
            <span>Berangkat dari <b className="home-airport-code" aria-hidden="true">{from}</b></span>
            <select value={from} onChange={(event) => { setFrom(event.target.value); setErrors((current) => ({ ...current, route: '' })) }}>
              {airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.city} ({airport.code})</option>)}
            </select>
          </label>
          <button className="home-swap" type="button" onClick={swapAirports} aria-label="Tukar kota asal dan tujuan">⇄</button>
          <label className="home-input-group">
            <span>Tujuan <b className="home-airport-code" aria-hidden="true">{to}</b></span>
            <select ref={destinationRef} value={to} aria-invalid={Boolean(errors.route)} aria-describedby={errors.route ? 'home-route-error' : undefined} onChange={(event) => { setTo(event.target.value); setErrors((current) => ({ ...current, route: '' })) }}>
              {airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.city} ({airport.code})</option>)}
            </select>
          </label>
          {errors.route && <p id="home-route-error" className="home-field-error" role="alert">{errors.route}</p>}
          </div>
          <label className="home-input-group home-date">
            <span>Tanggal pergi</span>
            <input ref={dateRef} aria-invalid={Boolean(errors.date)} aria-describedby={errors.date ? 'home-date-error' : undefined} type="date" min={today} value={date} onChange={(event) => { setDate(event.target.value); setErrors((current) => ({ ...current, date: '' })) }} required />
            {errors.date && <small id="home-date-error" className="home-field-error" role="alert">{errors.date}</small>}
          </label>
          <PassengerPicker value={passengers} onChange={setPassengers} />
          <div className="home-form-bottom">
            <p>Pilih kota asal, tujuan, dan tanggal keberangkatan.</p>
            <button className="button button-primary home-find-button" type="submit">Cari penerbangan</button>
          </div>
        </form>
      </section>

      <section className="home-route-options page-wrap" aria-labelledby="destinations-heading">
        <div className="home-route-heading">
          <h2 id="destinations-heading">Mau singgah di mana?</h2>
          <p>Klik kota untuk mengisi tujuan pencarian.</p>
        </div>
        <div className="home-destination-list">
          {popularDestinations.map((destination) => (
            <button
              className="home-destination"
              key={destination.code}
              type="button"
              aria-pressed={to === destination.code}
              aria-label={`Pilih tujuan ${destination.name}`}
              onClick={() => selectDestination(destination.code)}
            >
              <span className="home-destination-image">
                <img src={destination.photo} alt="" loading="lazy" width="900" height="675" />
                <span className="home-destination-code">{destination.code}</span>
              </span>
              <span className="home-destination-info">
                <span className="home-destination-name"><strong>{destination.name}</strong><small>{destination.airport}</small></span>
                <span className="home-destination-action">{to === destination.code ? 'Dipilih' : 'Pilih tujuan'} <span aria-hidden="true">→</span></span>
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  )
}

export default FlightHome
