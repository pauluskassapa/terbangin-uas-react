import { useState } from 'react'
import { Link } from 'react-router'
import { cityName, completeJourneyCheckIn, getJourneyBookings, journeyDate } from '../data/journeyData.js'
import './JourneyPages.css'

const seatOptions = Array.from({ length: 18 }, (_, index) => index + 1)
  .flatMap((row) => ['A', 'B', 'C', 'D', 'E', 'F'].map((column) => `${row}${column}`))
const occupiedSeats = new Set(['1A', '1B', '2F', '3C', '4D', '4E', '5A', '6F', '7B', '7C', '9D', '10A', '10B', '12E', '14F', '15C', '16D', '17A'])

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
          <form className="journey-checkin-form" onSubmit={handleCheckIn}>
            {(result.passengers || []).map((passenger, index) => <label key={`${passenger.name}-${index}`}>Penumpang {index + 1} · {passenger.name || 'Tanpa nama'}
              <select required value={selectedSeats[index] || ''} onChange={(event) => setSelectedSeats((current) => current.map((seat, seatIndex) => seatIndex === index ? event.target.value : seat))}>
                <option value="">Pilih kursi</option>
                {seatOptions.map((seat) => <option key={seat} value={seat} disabled={occupiedSeats.has(seat) || selectedSeats.some((selected, selectedIndex) => selectedIndex !== index && selected === seat)}>{seat}{occupiedSeats.has(seat) ? ' · Terisi' : ''}</option>)}
              </select>
            </label>)}
            <button className="button button-primary" type="submit">Konfirmasi Check-in</button>
          </form>
        </section>}
      </section>
      <section className="journey-section"><div className="journey-section-heading"><p>Informasi Perjalanan</p><h2>Siapkan perjalananmu</h2></div><div className="journey-link-grid"><Link to="/my-booking#my-booking-search"><span>✓</span><h3>Online Check-in</h3><p>Cari booking yang sudah dibayar untuk memilih kursi dan menyimpan status check-in.</p></Link><Link to="/booking-history"><span>▤</span><h3>Booking History</h3><p>Lihat riwayat pemesanan dan status perjalanan.</p></Link></div></section>
    </main>
  )
}

export default MyBooking
