import { useState } from 'react'
import { Link } from 'react-router'
import { cityName, completeJourneyCheckIn, getJourneyBookings, journeyDate } from '../data/journeyData.js'
import '../../penerbangan/pages/FlightSeats.css'
import './JourneyPages.css'

const seatColumns = ['A', 'B', 'C', 'D', 'E', 'F']
const seatRows = Array.from({ length: 18 }, (_, index) => index + 1)
const occupiedSeats = new Set(['1A', '1B', '2F', '3C', '4D', '4E', '5A', '6F', '7B', '7C', '9D', '10A', '10B', '12E', '14F', '15C', '16D', '17A'])

function seatPosition(seat) {
  if (!seat) return 'Belum dipilih'
  const column = seat.slice(-1)
  return column === 'A' || column === 'F' ? 'Jendela' : column === 'C' || column === 'D' ? 'Dekat lorong' : 'Tengah'
}

function CheckInSeatPicker({ passengers, selectedSeats, onSeatClick, onClear, onSubmit }) {
  const selectedCount = selectedSeats.filter(Boolean).length

  return (
    <form className="seat-layout" onSubmit={onSubmit}>
      <section className="seat-map-panel" aria-label="Denah kursi pesawat">
        <div className="seat-legend"><span><i />Tersedia</span><span><i className="chosen" />Pilihanmu</span><span><i className="taken" />Terpesan (demo)</span></div>
        <p className="seat-map-hint">Klik kursi untuk memilih atau membatalkan pilihan. A/F: jendela · B/E: tengah · C/D: dekat lorong.</p>
        <div className="seat-selection-strip" aria-label="Pilihan kursi per penumpang">
          {passengers.map((passenger, index) => <span key={`${passenger.name}-${index}`} className={selectedSeats[index] ? 'filled' : ''}>P{index + 1}<strong>{selectedSeats[index] || '—'}</strong>{selectedSeats[index] && <small>{seatPosition(selectedSeats[index])}</small>}</span>)}
        </div>
        <div className="seat-aircraft-area">
          <div className="seat-aircraft">
            <p className="seat-front">Depan Pesawat</p>
            <div className="seat-column-labels" aria-hidden="true">{seatColumns.map((column) => <span key={column}>{column}</span>)}</div>
            <div className="seat-rows">
              {seatRows.map((row) => <div className="seat-row" key={row}>
                {seatColumns.map((column) => {
                  const seat = `${row}${column}`
                  const taken = occupiedSeats.has(seat)
                  const passengerIndex = selectedSeats.indexOf(seat)
                  const chosen = passengerIndex >= 0
                  return <button key={seat} type="button" className={`seat-chair${chosen ? ' chosen' : ''}`} disabled={taken} aria-pressed={chosen} aria-label={`Kursi ${seat}${chosen ? `, penumpang ${passengerIndex + 1}` : ''}${taken ? ', terpesan dalam demo' : ''}`} onClick={() => onSeatClick(seat)}>{seat}{chosen && <span className="seat-passenger-badge" aria-hidden="true">{passengerIndex + 1}</span>}</button>
                })}
                <span className="seat-row-number" aria-hidden="true">{row}</span>
              </div>)}
            </div>
            <div className="seat-rear" aria-hidden="true">Belakang Pesawat</div>
          </div>
        </div>
      </section>
      <aside className="seat-summary" aria-labelledby="checkin-seat-summary-title">
        <div className="seat-summary-heading"><h2 id="checkin-seat-summary-title">Kursi pilihanmu</h2><p role="status" aria-live="polite">{selectedCount} dari {passengers.length} kursi dipilih</p></div>
        <div className="seat-summary-body">
          <ol className="seat-passengers">{passengers.map((passenger, index) => <li key={`${passenger.name}-${index}`}><span>Penumpang {index + 1}<br /><small>{passenger.name || 'Tanpa nama'}</small></span><span className="seat-passenger-choice"><strong>{selectedSeats[index] || 'Belum dipilih'}</strong>{selectedSeats[index] && <small>{seatPosition(selectedSeats[index])}</small>}</span></li>)}</ol>
          {selectedCount > 0 && <button className="seat-clear" type="button" onClick={onClear}>Hapus pilihan kursi</button>}
          <p className="seat-feedback" role="status" aria-live="polite">{selectedCount < passengers.length ? `Pilih ${passengers.length - selectedCount} kursi lagi untuk melanjutkan.` : 'Pilihan lengkap. Kamu bisa menyelesaikan check-in.'}</p>
          <div className="seat-total"><span>Biaya pilih kursi</span><strong>Gratis</strong><small>Kursi demo tidak menambah biaya tiket.</small></div>
          <button className="button button-primary seat-continue" type="submit" disabled={selectedCount !== passengers.length}>Konfirmasi Check-in →</button>
          <p className="seat-demo-note">Denah dan kursi terpesan merupakan contoh untuk demo.</p>
        </div>
      </aside>
    </form>
  )
}

function MyBooking() {
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)
  const [selectedSeats, setSelectedSeats] = useState([])

  function handleSubmit(event) {
    event.preventDefault()
    const booking = getJourneyBookings().find((item) => item.code?.trim().toLowerCase() === code.trim().toLowerCase())
    const emailMatches = booking && (booking.passengers || []).some((passenger) => passenger.email?.trim().toLowerCase() === email.trim().toLowerCase())
    if (!booking) {
      setResult(null)
      setSelectedSeats([])
      setMessage('Booking tidak ditemukan. Periksa kembali kode booking.')
    } else if (!emailMatches && booking.email?.trim().toLowerCase() !== email.trim().toLowerCase()) {
      setResult(null)
      setSelectedSeats([])
      setMessage('Email tidak sesuai dengan data pemesanan.')
    } else {
      setResult(booking)
      setSelectedSeats(booking.passengers?.map((passenger) => passenger.seat || '') || [])
      setMessage('')
    }
  }

  function handleCheckIn(event) {
    event.preventDefault()
    const updatedBooking = completeJourneyCheckIn(result.code, selectedSeats)
    if (!updatedBooking) {
      setMessage('Check-in belum dapat diselesaikan. Pastikan semua penumpang memilih kursi yang berbeda.')
      return
    }
    setResult(updatedBooking)
    setMessage('Check-in berhasil. Kursi dan status perjalanan sudah disimpan.')
  }

  function handleSeatClick(seat) {
    if (occupiedSeats.has(seat)) return
    if (!selectedSeats.includes(seat) && !selectedSeats.includes('')) {
      setMessage(`Sudah memilih ${selectedSeats.length} kursi. Klik kursi pilihanmu untuk melepasnya sebelum memilih kursi lain.`)
      return
    }
    setSelectedSeats((current) => {
      if (current.includes(seat)) return current.map((selected) => selected === seat ? '' : selected)
      const next = [...current]
      const emptyIndex = next.indexOf('')
      if (emptyIndex < 0) return current
      next[emptyIndex] = seat
      return next
    })
    setMessage('')
  }

  return (
    <main className="journey-page page-wrap">
      <section className="journey-hero"><p>Perjalananmu</p><h1>Atur perjalananmu dengan mudah.</h1><p>Lihat detail pemesanan, cek status penerbangan, dan siapkan perjalananmu sebelum berangkat.</p></section>
      <section className="journey-section" id="my-booking-search">
        <div className="journey-section-heading"><p>My Booking</p><h2>Cari pemesanan</h2><span>Masukkan kode booking dan email yang digunakan saat pemesanan.</span></div>
        <form className="journey-form" onSubmit={handleSubmit}>
          <label>Kode Booking<input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Contoh: TRB123" required /></label>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Masukkan email" required /></label>
          <button className="button button-primary" type="submit">Lihat Booking</button>
        </form>
        {message && <p className="journey-message" role="alert">{message}</p>}
        {result && <article className="journey-booking-card" aria-live="polite">
          <div className="journey-booking-top"><div><span>Kode Booking</span><h3>{result.code}</h3></div><strong className={`journey-status status-${result.status === 'Pembayaran Berhasil' ? 'selesai' : result.status === 'Dibatalkan' ? 'dibatalkan' : 'menunggu'}`}>{result.status}</strong></div>
          <div className="journey-route"><strong>{cityName(result.from)} ({result.from})</strong><span aria-hidden="true">✈</span><strong>{cityName(result.to)} ({result.to})</strong></div>
          <div className="journey-info"><div><span>Tanggal</span><strong>{journeyDate(result.date)}</strong></div><div><span>Maskapai</span><strong>{result.airline || '-'}</strong></div><div><span>Penumpang</span><strong>{result.passengers?.length || 0} orang</strong></div><div><span>Status perjalanan</span><strong>{result.checkedIn ? 'Sudah Check-in' : 'Siap Berangkat'}</strong></div>{result.checkedIn && <div><span>Kursi</span><strong>{result.passengers.map((passenger) => passenger.seat).join(', ')}</strong></div>}</div>
          <div className="journey-actions">{result.checkedIn ? <span className="journey-checkin-success">✓ Check-in berhasil</span> : <span className="journey-coming-soon">{result.status === 'Pembayaran Berhasil' ? 'Check-in tersedia untuk booking ini.' : 'Selesaikan pembayaran sebelum check-in.'}</span>}<Link className="button journey-secondary" to="/booking-history">Booking History</Link></div>
        </article>}

        {result && result.status === 'Pembayaran Berhasil' && !result.checkedIn && <section className="journey-checkin" aria-labelledby="journey-checkin-title">
          <div className="journey-section-heading"><p>Online Check-in</p><h2 id="journey-checkin-title">Pilih kursi penumpang</h2><span>Pilih satu kursi berbeda untuk setiap penumpang. Kursi abu-abu sudah terisi pada demo.</span></div>
          <CheckInSeatPicker passengers={result.passengers || []} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} onClear={() => setSelectedSeats((result.passengers || []).map(() => ''))} onSubmit={handleCheckIn} />
        </section>}
      </section>
      <section className="journey-section"><div className="journey-section-heading"><p>Informasi Perjalanan</p><h2>Siapkan perjalananmu</h2></div><div className="journey-link-grid"><Link to="/my-booking#my-booking-search"><span>✓</span><h3>Online Check-in</h3><p>Cari booking yang sudah dibayar untuk memilih kursi dan menyimpan status check-in.</p></Link><Link to="/booking-history"><span>▤</span><h3>Booking History</h3><p>Lihat riwayat pemesanan dan status perjalanan.</p></Link></div></section>
    </main>
  )
}

export default MyBooking
