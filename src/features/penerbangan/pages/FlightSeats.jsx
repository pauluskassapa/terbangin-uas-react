import { useState } from 'react'
import { Link, useParams, useSearchParams, useNavigate } from 'react-router'
import { airports, flights, getPassengerCount, formatRupiah } from '../../../data/penerbangan.js'
import './FlightSeats.css'

const columns = ['A', 'B', 'C', 'D', 'E', 'F']
const rows = Array.from({ length: 18 }, (_, index) => index + 1)
// Contoh okupansi untuk denah demo, bukan data penjualan maskapai.
const occupied = new Set(['1A', '1B', '2F', '3C', '4D', '4E', '5A', '6F', '7B', '7C', '9D', '10A', '10B', '12E', '14F', '15C', '16D', '17A'])

function SeatPicker({ flight, from, to, date, count, query }) {
  const navigate = useNavigate()
  const [selected, setSelected] = useState([])
  const [message, setMessage] = useState('')
  const detailUrl = `/penerbangan/${flight.id}?${query}`

  function toggleSeat(seat) {
    if (occupied.has(seat)) return
    if (selected.includes(seat)) {
      setSelected((current) => current.filter((item) => item !== seat))
      setMessage('')
    } else if (selected.length < count) {
      setSelected((current) => [...current, seat])
      setMessage('')
    } else {
      setMessage(`Sudah memilih ${count} kursi. Klik kursi pilihanmu untuk melepasnya sebelum memilih kursi lain.`)
    }
  }

  function continueBooking() {
    if (selected.length !== count) return
    const params = new URLSearchParams({ flightId: flight.id, from: from.code, to: to.code, date, passengers: String(count), seats: selected.join(',') })
    navigate(`/booking?${params}`)
  }

  return (
    <main className="seat-page page-wrap">
      <Link className="seat-back" to={detailUrl}>← Kembali ke detail penerbangan</Link>
      <header className="seat-heading">
        <span>{flight.airline} · {flight.number} · Ekonomi</span>
        <h1>Mau duduk di mana?</h1>
        <p>{from.city} → {to.city} · {new Date(`${date}T00:00:00`).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
      </header>
      <div className="seat-layout">
        <section className="seat-map-panel" aria-label="Denah kursi pesawat">
          <div className="seat-legend"><span><i />Tersedia</span><span><i className="chosen" />Pilihanmu</span><span><i className="taken" />Terpesan (demo)</span></div>
          <p className="seat-map-hint">Klik kursi untuk memilih atau membatalkan pilihan. A dan F berada di sisi jendela.</p>
          <div className="seat-aircraft-area">
            <div className="seat-wing seat-wing-left" aria-hidden="true" />
            <div className="seat-wing seat-wing-right" aria-hidden="true" />
            <div className="seat-aircraft">
              <div className="seat-cockpit" aria-hidden="true"><i /><i /></div>
              <p className="seat-front">Depan pesawat</p>
              <div className="seat-column-labels" aria-hidden="true">{columns.map((letter) => <span key={letter}>{letter}</span>)}</div>
              <div className="seat-rows">
                {rows.map((row) => <div className="seat-row" key={row}>
                  {columns.map((letter) => {
                    const seat = `${row}${letter}`
                    const taken = occupied.has(seat)
                    const chosen = selected.includes(seat)
                    return <button key={seat} type="button" className={`seat-chair${chosen ? ' chosen' : ''}`} disabled={taken} aria-pressed={chosen} aria-label={`Kursi ${seat}${taken ? ', terpesan dalam demo' : ''}${letter === 'A' || letter === 'F' ? ', jendela' : letter === 'C' || letter === 'D' ? ', dekat lorong' : ', tengah'}`} onClick={() => toggleSeat(seat)}>{seat}</button>
                  })}
                  <span className="seat-row-number" aria-hidden="true">{row}</span>
                </div>)}
              </div>
              <div className="seat-rear" aria-hidden="true">Belakang pesawat</div>
            </div>
          </div>
        </section>
        <aside className="seat-summary" aria-labelledby="seat-summary-title">
          <div className="seat-summary-heading"><h2 id="seat-summary-title">Kursi pilihanmu</h2><p role="status" aria-live="polite">{selected.length} dari {count} kursi dipilih</p></div>
          <div className="seat-summary-body">
            <ol className="seat-passengers">{Array.from({ length: count }, (_, index) => <li key={index}><span>Penumpang {index + 1}</span><strong>{selected[index] || 'Belum dipilih'}</strong></li>)}</ol>
            {selected.length > 0 && <button className="seat-clear" type="button" onClick={() => { setSelected([]); setMessage('') }}>Hapus pilihan kursi</button>}
            <p className="seat-feedback" role="status" aria-live="polite">{message || (selected.length < count ? `Pilih ${count - selected.length} kursi lagi untuk melanjutkan.` : 'Pilihan lengkap. Kamu bisa melanjutkan pemesanan.')}</p>
            <div className="seat-total"><span>Total tiket · {count} penumpang</span><strong>{formatRupiah(flight.price * count)}</strong><small>Tidak ada biaya pilih kursi pada demo ini.</small></div>
            <button className="button button-primary seat-continue" type="button" disabled={selected.length !== count} onClick={continueBooking}>Lanjutkan pemesanan →</button>
            <p className="seat-demo-note">Denah dan kursi terpesan merupakan contoh. Pilihan ini belum mengunci kursi dan belum terhubung ke pembayaran.</p>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default function FlightSeats() {
  const { flightId } = useParams()
  const [params] = useSearchParams()
  const flight = flights.find((item) => item.id === flightId)
  const from = airports.find((item) => item.code === params.get('from'))
  const to = airports.find((item) => item.code === params.get('to'))
  const date = params.get('date') || ''
  const parsed = new Date(`${date}T00:00:00`)
  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(parsed.getTime()) && `${parsed.getFullYear()}-${String(parsed.getMonth() + 1).padStart(2, '0')}-${String(parsed.getDate()).padStart(2, '0')}` === date
  if (!flight || !from || !to || from.code === to.code || !validDate) return <main className="seat-page page-wrap"><h1>Pilih penerbangan terlebih dahulu</h1><p>Rute atau tanggal penerbangan belum lengkap.</p><Link className="button button-primary" to="/">Cari penerbangan</Link></main>
  const query = params.toString()
  return <SeatPicker key={`${flightId}?${query}`} flight={flight} from={from} to={to} date={date} count={getPassengerCount(params.get('passengers'))} query={query} />
}
