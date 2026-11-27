import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { cityName, completeJourneyCheckIn, getJourneyBookingByCode, journeyDate } from '../data/journeyData.js'
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

function OnlineCheckIn() {
  const [searchParams] = useSearchParams()
  const code = searchParams.get('code')
  const [booking, setBooking] = useState(null)
  const [isLoadingBooking, setIsLoadingBooking] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [step, setStep] = useState('review')
  const [selectedSeats, setSelectedSeats] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    let isActive = true
    if (!code) {
      return () => { isActive = false }
    }

    getJourneyBookingByCode(code)
      .then((data) => {
        if (!isActive) return
        setBooking(data)
        setSelectedSeats(data?.passengers?.map((passenger) => passenger.seat || '') || [])
      })
      .catch((error) => {
        console.error('Gagal memuat booking untuk check-in:', error)
        if (isActive) setLoadError('Detail booking gagal dimuat. Coba lagi beberapa saat.')
      })
      .finally(() => {
        if (isActive) setIsLoadingBooking(false)
      })

    return () => { isActive = false }
  }, [code])

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

  async function handleCheckIn(event) {
    event.preventDefault()
    try {
      const updatedBooking = await completeJourneyCheckIn(booking, selectedSeats)
      if (!updatedBooking) {
        setMessage('Check-in belum dapat diselesaikan. Pastikan semua penumpang memilih kursi yang berbeda.')
        return
      }
      setBooking(updatedBooking)
      setMessage('Check-in berhasil. Kursi dan status perjalanan sudah disimpan.')
    } catch (error) {
      console.error('Gagal menyimpan check-in ke Supabase:', error)
      setMessage('Check-in gagal disimpan ke database. Coba lagi.')
    }
  }

  const eligible = booking?.status === 'Pembayaran Berhasil'
  const isLoading = Boolean(code) && isLoadingBooking

  return (
    <main className="journey-page page-wrap">
      <section className="journey-hero"><p>Online Check-in</p><h1>Siapkan kursi perjalananmu.</h1><p>Periksa detail booking sebelum memilih kursi untuk setiap penumpang.</p></section>
      {isLoading ? <section className="journey-section"><p className="journey-empty" role="status">Memuat detail booking…</p></section> : loadError ? <section className="journey-section"><p className="journey-message" role="alert">{loadError}</p><Link className="button button-primary" to="/my-booking">Kembali ke My Booking</Link></section> : !booking ? <section className="journey-section"><div className="journey-section-heading"><p>Booking tidak ditemukan</p><h2>Periksa booking dari My Booking</h2><span>Kode booking tidak tersedia. Cari tiketmu terlebih dahulu untuk memulai check-in.</span></div><Link className="button button-primary" to="/my-booking">Kembali ke My Booking</Link></section> : <section className="journey-section">
        <div className="journey-section-heading"><p>Periksa Booking</p><h2>Detail penerbangan</h2><span>Pastikan rute dan tanggal penerbangan ini sesuai.</span></div>
        <article className="journey-booking-card journey-checkin-summary">
          <div className="journey-booking-top"><div><span>Kode Booking</span><h3>{booking.code}</h3></div><strong className={`journey-status ${eligible ? 'status-selesai' : 'status-menunggu'}`}>{booking.status}</strong></div>
          <div className="journey-route"><strong>{cityName(booking.from)} ({booking.from})</strong><span aria-hidden="true">✈</span><strong>{cityName(booking.to)} ({booking.to})</strong></div>
          <div className="journey-info"><div><span>Tanggal</span><strong>{journeyDate(booking.date)}</strong></div><div><span>Maskapai</span><strong>{booking.airline || '-'}</strong></div><div><span>Penumpang</span><strong>{booking.passengers?.length || 0} orang</strong></div><div><span>Status check-in</span><strong>{booking.checkedIn ? 'Sudah Check-in' : eligible ? 'Belum Check-in' : 'Belum bisa check-in'}</strong></div>{booking.checkedIn && <div><span>Kursi</span><strong>{booking.passengers.map((passenger) => passenger.seat).join(', ')}</strong></div>}</div>
        </article>
        {booking.checkedIn ? <p className="journey-checkin-success" role="status">✓ Check-in sudah selesai untuk booking ini.</p> : !eligible ? <p className="journey-message" role="status">Selesaikan pembayaran terlebih dahulu sebelum check-in.</p> : step === 'review' ? <div className="journey-checkin-review-actions"><Link className="button journey-secondary" to="/my-booking">Kembali ke My Booking</Link><button className="button button-primary" type="button" onClick={() => setStep('seats')}>Lanjut pilih kursi →</button></div> : <section className="journey-checkin" aria-labelledby="journey-checkin-title">
          <div className="journey-section-heading"><p>Langkah 1 · Pilih Kursi</p><h2 id="journey-checkin-title">Pilih kursi penumpang</h2><span>Pilih satu kursi berbeda untuk setiap penumpang.</span></div>
          {message && <p className="journey-message" role="alert">{message}</p>}
          <button className="journey-checkin-back" type="button" onClick={() => setStep('review')}>← Kembali ke detail booking</button>
          <CheckInSeatPicker passengers={booking.passengers || []} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} onClear={() => setSelectedSeats((booking.passengers || []).map(() => ''))} onSubmit={handleCheckIn} />
        </section>}
      </section>}
    </main>
  )
}

export default OnlineCheckIn
