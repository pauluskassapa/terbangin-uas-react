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
  const bookingUrl = `/booking?${bookingParams.toString()}`

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
          <ol className="detail-itinerary" aria-label="Alur perjalanan">
            <li className="detail-stop">
              <div className="detail-stop-time"><strong>{flight.departure}</strong><span>Berangkat</span></div>
              <span className="detail-stop-dot" aria-hidden="true" />
              <div className="detail-stop-place"><strong>{from.city}</strong><span>Bandara {from.code}</span></div>
            </li>
            <li className="detail-flight-leg"><span aria-hidden="true">✈</span><div><strong>{flight.duration} di udara</strong><span>Penerbangan langsung · Tanpa transit</span></div></li>
            <li className="detail-stop detail-stop-arrival">
              <div className="detail-stop-time"><strong>{flight.arrival}</strong><span>Tiba</span></div>
              <span className="detail-stop-dot" aria-hidden="true" />
              <div className="detail-stop-place"><strong>{to.city}</strong><span>Bandara {to.code}</span></div>
            </li>
          </ol>
          <div className="detail-facilities">
            <h2>Informasi tiket</h2>
            <dl className="detail-amenities">
              <div><dt><svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="7" width="14" height="13" rx="2" /><path d="M9 7V4h6v3M9 11v5m6-5v5" /></svg>Bagasi sesuai tiket</dt><dd>{flight.baggage}</dd></div>
              <div><dt><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3v12a3 3 0 0 0 3 3h10M10 4v9h8v3M8 18v3m10-3v3" /></svg>Kelas penerbangan</dt><dd>Ekonomi</dd></div>
              <div><dt><svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4 17h16M6 15a6 6 0 0 1 12 0M12 7V4m-2 0h4M3 20h18" /></svg>Layanan maskapai</dt><dd>{flight.perk}</dd></div>
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
            <p className="detail-price-calculation">{formatRupiah(flight.price)} × {passengers} penumpang</p>
            <div className="detail-total"><span>Total untuk {passengers} penumpang</span><strong>{formatRupiah(totalPrice)}</strong></div>
            <Link className="button button-primary detail-book-button" to={bookingUrl}>Lanjutkan pemesanan <span aria-hidden="true">→</span></Link>
            <p className="detail-next-step">Lengkapi data dan pembayaran. Pilih kursi saat online check-in.</p>
          </div>
        </aside>
      </div>
      <div className="detail-mobile-action">
        <div><span>Total · {passengers} penumpang</span><strong>{formatRupiah(totalPrice)}</strong></div>
        <Link className="button button-primary" to={bookingUrl}>Lanjutkan pemesanan <span aria-hidden="true">→</span></Link>
      </div>
      <p className="detail-demo-note">Jadwal dan harga menggunakan data contoh.</p>
    </main>
  )
}

export default FlightDetails
