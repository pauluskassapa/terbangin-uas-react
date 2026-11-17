import { Link, useParams, useSearchParams } from 'react-router'
import { airports, flights, formatRupiah, getPassengerCount } from '../../../data/penerbangan.js'
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

  const parsedDate = date ? new Date(`${date}T00:00:00`) : null
  const formattedDate = parsedDate && !Number.isNaN(parsedDate.getTime())
    ? new Intl.DateTimeFormat('id-ID', { dateStyle: 'long' }).format(parsedDate)
    : 'Tanggal perjalanan'
  const totalPrice = flight.price * passengers
  const bookingParams = new URLSearchParams({ flightId: flight.id, from: from.code, to: to.code, date: date || '', passengers: String(passengers) })

  return (
    <main className="flight-detail-page page-wrap">
      <Link className="detail-back-link" to={`/penerbangan?${routeParams.toString()}`}>← Kembali ke hasil pencarian</Link>
      <div className="detail-page-heading">
        <span className="detail-page-label">Detail penerbangan</span>
        <h1>{from.city} <span aria-hidden="true">→</span> {to.city}</h1>
        <p>{formattedDate} <span>·</span> {passengers} penumpang <span>·</span> Sekali jalan</p>
      </div>

      <div className="detail-layout">
        <section className="flight-detail-card" aria-label="Jadwal dan fasilitas penerbangan">
          <div className="detail-airline">
            <span className="detail-airline-mark">{flight.mark}</span>
            <div><h2>{flight.airline}</h2><span>{flight.number} · Ekonomi</span></div>
            <span className="detail-direct">Langsung</span>
          </div>
          <div className="detail-itinerary">
            <div className="detail-endpoint"><span className="detail-endpoint-label">Berangkat</span><span className="detail-time">{flight.departure}</span><strong>{from.code}</strong><span>{from.city}</span></div>
            <div className="detail-route-line"><span>{flight.duration}</span><i aria-hidden="true" /><small>Tanpa transit</small></div>
            <div className="detail-endpoint detail-arrival"><span className="detail-endpoint-label">Tiba</span><span className="detail-time">{flight.arrival}</span><strong>{to.code}</strong><span>{to.city}</span></div>
          </div>
          <div className="detail-facilities">
            <h2>Informasi tiket</h2>
            <dl className="detail-amenities">
              <div><dt>Bagasi sesuai tiket</dt><dd>{flight.baggage}</dd></div>
              <div><dt>Kelas penerbangan</dt><dd>Ekonomi</dd></div>
              <div><dt>Layanan maskapai</dt><dd>{flight.perk}</dd></div>
            </dl>
          </div>
          <p className="airport-reminder"><span aria-hidden="true">i</span> Siapkan waktu untuk check-in. Disarankan tiba di bandara 2 jam sebelum keberangkatan.</p>
        </section>

        <aside className="detail-price-card" aria-labelledby="price-summary-heading">
          <div className="detail-price-heading">
            <h2 id="price-summary-heading">Ringkasan harga</h2>
            <p>{flight.airline} · {flight.number}</p>
          </div>
          <div className="detail-price-content">
            <dl className="detail-price-breakdown">
              <div><dt>Harga per penumpang</dt><dd>{formatRupiah(flight.price)}</dd></div>
              <div><dt>Jumlah penumpang</dt><dd>{passengers} orang</dd></div>
              <div><dt>Pajak dan biaya</dt><dd>Termasuk</dd></div>
            </dl>
            <div className="detail-total"><span>Total untuk {passengers} penumpang</span><strong>{formatRupiah(totalPrice)}</strong></div>
            <Link className="button button-primary detail-book-button" to={`/penerbangan/${flight.id}/kursi?${bookingParams.toString()}`}>Pilih kursi <span aria-hidden="true">→</span></Link>
            <p className="detail-next-step">Pilih tempat duduk sebelum mengisi data pemesanan.</p>
          </div>
        </aside>
      </div>
      <p className="detail-demo-note">Jadwal dan harga menggunakan data contoh.</p>
    </main>
  )
}

export default FlightDetails
