import { useEffect, useMemo, useState } from 'react'
import { bookingStatusKey, cityName, getJourneyBookingsFromDatabase, journeyDate, journeyMoney } from '../data/journeyData.js'
import './JourneyPages.css'

function BookingHistory() {
  const [status, setStatus] = useState('semua')
  const [allBookings, setAllBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isActive = true
    getJourneyBookingsFromDatabase()
      .then((data) => {
        if (isActive) setAllBookings(data)
      })
      .catch((error) => {
        console.error('Gagal memuat Booking History dari Supabase:', error)
        if (isActive) setErrorMessage('Riwayat booking gagal dimuat. Coba lagi beberapa saat.')
      })
      .finally(() => {
        if (isActive) setIsLoading(false)
      })

    return () => { isActive = false }
  }, [])

  const bookings = useMemo(() => allBookings
    .filter((booking) => status === 'semua' || bookingStatusKey(booking) === status)
    .sort((a, b) => new Date(b.paidAt || b.createdAt || 0) - new Date(a.paidAt || a.createdAt || 0)), [allBookings, status])

  return (
    <main className="journey-page page-wrap journey-history-page">
      <section className="journey-hero journey-history-hero"><p>Perjalananmu</p><h1>Booking History</h1><p>Lihat semua riwayat pemesanan tiket pesawat kamu.</p></section>
      <section className="journey-history-filter-panel">
        <label className="journey-filter">Filter Status Pemesanan<select value={status} onChange={(event) => setStatus(event.target.value)}><option value="semua">Semua Pemesanan</option><option value="selesai">Pembayaran Berhasil</option><option value="menunggu">Menunggu Pembayaran</option><option value="dibatalkan">Pembayaran Gagal / Dibatalkan</option></select></label>
      </section>
      <section className="journey-history-list" aria-live="polite">
        {isLoading ? <p className="journey-empty" role="status">Memuat riwayat pemesanan…</p> : errorMessage ? <p className="journey-message" role="alert">{errorMessage}</p> : bookings.length ? bookings.map((booking) => {
          const statusKey = bookingStatusKey(booking)
          return <article className="journey-history-card" key={booking.code}>
            <div className="journey-booking-top"><div><span className="journey-label">Kode Booking</span><h2>{booking.code}</h2></div><span className={`journey-status status-${statusKey}`}>{booking.status}</span></div>
            <div className="journey-history-route"><div><strong>{cityName(booking.from)} ({booking.from})</strong><span>Kota keberangkatan</span></div><span className="journey-history-arrow" aria-hidden="true">→</span><div><strong>{cityName(booking.to)} ({booking.to})</strong><span>Kota tujuan</span></div></div>
            <div className="journey-info"><div><span>Tanggal Penerbangan</span><strong>{journeyDate(booking.date)}</strong></div><div><span>Maskapai</span><strong>{booking.airline || '-'}</strong></div><div><span>Jumlah Penumpang</span><strong>{booking.passengers?.length || 0} orang</strong></div><div><span>Total Harga</span><strong>{journeyMoney(booking.total)}</strong></div><div><span>Status Check-in</span><strong>{booking.checkedIn ? 'Sudah Check-in' : 'Belum Check-in'}</strong></div>{booking.passengers?.some((passenger) => passenger.seat) && <div><span>Kursi</span><strong>{booking.passengers.filter((passenger) => passenger.seat).map((passenger) => passenger.seat).join(', ')}</strong></div>}</div>
          </article>
        }) : <p className="journey-empty" role="status">Belum ada riwayat pemesanan.</p>}
      </section>
    </main>
  )
}

export default BookingHistory
