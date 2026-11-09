import { useState } from 'react'
import { Link } from 'react-router'
import { cityName, getJourneyBookings, journeyDate } from '../data/journeyData.js'
import './JourneyPages.css'

function MyBooking() {
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [result, setResult] = useState(null)

  function handleSubmit(event) {
    event.preventDefault()
    const booking = getJourneyBookings().find((item) => item.code?.trim().toLowerCase() === code.trim().toLowerCase())
    const emailMatches = booking && (booking.passengers || []).some((passenger) => passenger.email?.trim().toLowerCase() === email.trim().toLowerCase())
    if (!booking) {
      setResult(null)
      setMessage('Booking tidak ditemukan. Periksa kembali kode booking.')
    } else if (!emailMatches && booking.email?.trim().toLowerCase() !== email.trim().toLowerCase()) {
      setResult(null)
      setMessage('Email tidak sesuai dengan data pemesanan.')
    } else {
      setResult(booking)
      setMessage('')
    }
  }

  return (
    <main className="journey-page page-wrap">
      <section className="journey-hero"><p>Perjalananmu</p><h1>Atur perjalananmu dengan mudah.</h1><p>Lihat detail pemesanan, cek status penerbangan, dan siapkan perjalananmu sebelum berangkat.</p></section>
      <section className="journey-section">
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
          <div className="journey-info"><div><span>Tanggal</span><strong>{journeyDate(result.date)}</strong></div><div><span>Maskapai</span><strong>{result.airline || '-'}</strong></div><div><span>Penumpang</span><strong>{result.passengers?.length || 0} orang</strong></div><div><span>Status perjalanan</span><strong>{result.checkedIn ? 'Sudah Check-in' : 'Siap Berangkat'}</strong></div></div>
          <div className="journey-actions"><span className="journey-coming-soon">Online Check-in · minggu depan</span><Link className="button journey-secondary" to="/booking-history">Booking History</Link></div>
        </article>}
      </section>
      <section className="journey-section"><div className="journey-section-heading"><p>Informasi Perjalanan</p><h2>Siapkan perjalananmu</h2></div><div className="journey-link-grid"><article className="journey-link-disabled"><span>✓</span><h3>Online Check-in</h3><p>Fitur check-in dan pilih kursi akan dikerjakan minggu depan.</p><small>Segera hadir</small></article><Link to="/booking-history"><span>▤</span><h3>Booking History</h3><p>Lihat riwayat pemesanan dan status perjalanan.</p></Link></div></section>
    </main>
  )
}

export default MyBooking
