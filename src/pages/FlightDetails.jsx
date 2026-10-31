import { Link, useParams, useSearchParams } from 'react-router'
import { airports, flights, formatRupiah, getPassengerCount } from '../data/flightData.js'
import './FlightDetails.css'

function FlightDetails() {
  const { flightId } = useParams()
  const [searchParams] = useSearchParams()
  const flight = flights.find((item) => item.id === flightId)
  const fromCode = searchParams.get('from') || 'CGK'
  const toCode = searchParams.get('to') || 'DPS'
  const from = airports.find((airport) => airport.code === fromCode) || airports[0]
  const to = airports.find((airport) => airport.code === toCode) || airports[3]
  const date = searchParams.get('date')
  const passengers = getPassengerCount(searchParams.get('passengers'))
  const routeParams = new URLSearchParams({ from: from.code, to: to.code, date: date || '', passengers: String(passengers) })

  if (!flight) {
    return (
      <main className="flight-detail-page page-wrap detail-not-found">
        <span className="eyebrow">PENERBANGAN TIDAK DITEMUKAN</span>
        <h1>Tiket ini tidak tersedia.</h1>
        <p>Pilih penerbangan lain dari daftar hasil pencarian.</p>
        <Link className="button button-primary" to={`/penerbangan?${routeParams.toString()}`}>Kembali ke hasil</Link>
      </main>
    )
  }

  const formattedDate = date
    ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(new Date(`${date}T00:00:00`))
    : 'Tanggal perjalanan'
  const totalPrice = flight.price * passengers
  const bookingParams = new URLSearchParams({ flightId: flight.id, from: from.code, to: to.code, date: date || '', passengers: String(passengers) })

  return (
    <main className="flight-detail-page page-wrap">
      <Link className="detail-back-link" to={`/penerbangan?${routeParams.toString()}`}>← Kembali ke hasil pencarian</Link>
      <div className="detail-page-heading">
        <div><span className="eyebrow">RINCIAN PERJALANAN</span><h1>Detail penerbangan</h1><p>{formattedDate} <span>·</span> {from.city} menuju {to.city} <span>·</span> {passengers} penumpang</p></div>
        <span className="detail-selection">✦ PILIHANMU</span>
      </div>

      <div className="detail-layout">
        <section className="flight-detail-card">
          <div className="detail-airline">
            <span className="detail-airline-mark">{flight.mark}</span>
            <div><strong>{flight.airline}</strong><span>{flight.number} · Ekonomi</span></div>
          </div>
          <div className="detail-itinerary">
            <div className="detail-endpoint"><span className="detail-time">{flight.departure}</span><strong>{from.code}</strong><span>{from.city}</span></div>
            <div className="detail-route-line"><span>✈</span><i /><small>{flight.duration} · Langsung</small></div>
            <div className="detail-endpoint detail-arrival"><span className="detail-time">{flight.arrival}</span><strong>{to.code}</strong><span>{to.city}</span></div>
          </div>
          <div className="detail-separator" />
          <h2>Fasilitas penerbangan</h2>
          <div className="detail-amenities"><span>✓ Bagasi tercatat {flight.baggage}</span><span>✓ Bagasi kabin 7 kg</span><span>✓ {flight.perk}</span></div>
          <p className="airport-reminder"><span>i</span> Disarankan tiba di bandara 2 jam sebelum keberangkatan.</p>
        </section>

        <aside className="detail-price-card">
          <span className="eyebrow">RINGKASAN HARGA</span>
          <h2>Harga tiket</h2>
          <div className="detail-price-row"><span>Tiket · {passengers} penumpang</span><strong>{formatRupiah(totalPrice)}</strong></div>
          <div className="detail-price-row"><span>Pajak dan biaya</span><strong>Termasuk</strong></div>
          <div className="detail-price-separator" />
          <div className="detail-price-row detail-total"><span>Total</span><strong>{formatRupiah(totalPrice)}</strong></div>
          <Link className="button button-primary detail-book-button" to={`/booking?${bookingParams.toString()}`}>Lanjutkan pemesanan <span>→</span></Link>
          <p>Harga contoh. Detail pemesanan dilanjutkan pada halaman booking.</p>
        </aside>
      </div>
    </main>
  )
}

export default FlightDetails
