import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { formatRupiah } from '../../../data/penerbangan.js'
import { saveJourneyBooking } from '../../perjalanan/data/journeyData.js'
import './PaymentSuccess.css'

function PaymentSuccess() {
    const location = useLocation()
    const payment = location.state?.payment
    const [bookingId] = useState(() => crypto.randomUUID())
    const [bookingCode] = useState(() => `TRB${bookingId.replaceAll('-', '').slice(0, 8).toUpperCase()}`)
    const [saveState, setSaveState] = useState(payment?.booking ? 'saving' : 'idle')
    const [saveError, setSaveError] = useState('')
    const saveStarted = useRef(false)

    const persistBooking = useCallback(async function persistBooking() {
        if (!payment?.booking) return
        setSaveState('saving')
        setSaveError('')
        try {
            await saveJourneyBooking(payment, bookingCode, bookingId)
            setSaveState('saved')
        } catch (error) {
            console.error('Gagal menyimpan booking ke Supabase:', error)
            setSaveError('Booking belum berhasil disimpan ke database. Periksa koneksi Supabase lalu coba lagi.')
            setSaveState('error')
        }
    }, [payment, bookingCode, bookingId])

    useEffect(() => {
        if (!payment?.booking || saveStarted.current) return
        saveStarted.current = true
        persistBooking()
    }, [persistBooking, payment?.booking])

    if (!payment?.booking) {
        return (
        <main className="page-wrap payment-success-error">
            <span className="eyebrow">TERBANGIN · PAYMENT</span>
            <h1>Data pembayaran tidak ditemukan</h1>
            <p>Silakan lakukan pemesanan dan pembayaran terlebih dahulu.</p>
            <Link to="/penerbangan" className="button button-primary">
            Cari Penerbangan
            </Link>
        </main>
        )
    }

    const {
        booking,
        baggageKg,
        baggageTotal,
        paymentMethod,
        grandTotal,
        paymentDate,
    } = payment

    const { 
        flight, 
        from, 
        to, 
        formattedDate, 
        passengerCount, 
        contact, 
        passengers 
    } = booking

    const paymentMethods = {
        qris: 'QRIS',
        bank: 'Transfer Bank',
        ewallet: 'E-Wallet',
    }

    const formattedPaymentDate = paymentDate
        ? new Date(paymentDate).toLocaleString('id-ID', {
            dateStyle: 'long',
            timeStyle: 'short',
        })
        : '-'

    return (
        <main className="page-wrap payment-success-page">
            <section className="success-heading">
                <div className="success-icon">
                    <span>✓</span>
                </div>

                <span className="eyebrow">TERBANGIN · PAYMENT</span>
                <h1>Pembayaran Berhasil!</h1>
                <p>Terima kasih telah memilih penerbangan bersama TERBANGIN. Pembayaran Anda berhasil diproses.</p>
            </section>

        <section className="success-card">
            <div className="success-card-header">
                <div>
                    <span className="success-label">STATUS PEMBAYARAN</span>
                    <h2>Pembayaran Berhasil</h2>
                </div>

            <div className="success-detail-item success-booking-code">
                <span>Kode Booking · simpan untuk check-in</span>
                <strong>{bookingCode}</strong>
            </div>

                <span className="success-status">Berhasil</span>
            </div>

            <div className="success-total">
                <span>Total Pembayaran</span>
                <strong>{formatRupiah(grandTotal)}</strong>
            </div>

            <div className="success-divider" />
                <div className="success-details">
                    <div className="success-detail-item">
                        <span>Maskapai</span>
                        <strong>{flight.airline}</strong>
                    </div>

                    <div className="success-detail-item">
                        <span>Nomor Penerbangan</span>
                        <strong>{flight.number}</strong>
                    </div>

                    <div className="success-detail-item">
                        <span>Rute Penerbangan</span>
                        <strong>{from.code} → {to.code}</strong>
                    </div>

                    <div className="success-detail-item">
                        <span>Tanggal Penerbangan</span>
                        <strong>{formattedDate}</strong>
                    </div>

                    <div className="success-detail-item">
                        <span>Jumlah Penumpang</span>
                        <strong>{passengerCount} orang</strong>
                    </div>

                    <div className="success-detail-item">
                        <span>Metode Pembayaran</span>
                        <strong>{paymentMethods[paymentMethod] || paymentMethod}</strong>
                    </div>

                    <div className="success-detail-item">
                        <span>Bagasi Tambahan</span>
                        <strong>{baggageKg} kg</strong>
                    </div>

                    <div className="success-detail-item">
                        <span>Biaya Bagasi</span>
                        <strong>{formatRupiah(baggageTotal)}</strong>
                    </div>

                    <div className="success-detail-item success-detail-full">
                        <span>Waktu Pembayaran</span>
                        <strong>{formattedPaymentDate}</strong>
                    </div>
                </div>

                <div className="success-divider" />
                    <div className="success-passengers">
                        <h3>Informasi Penumpang</h3>

                        <div className="success-detail-item">
                            <span>Nama Pemesan</span>
                            <strong>{contact.name}</strong>
                        </div>

                        <div className="success-detail-item">
                            <span>Email</span>
                            <strong>{contact.email}</strong>
                        </div>

                        {passengers.map((passenger, index) => (
                            <div className="success-passenger-item" key={index}>
                                <span>Penumpang {index + 1}</span>
                                <strong>{passenger.name || '-'}</strong>
                            </div>
                        ))}
                    </div>
        </section>

        {saveState === 'saving' && <p className="success-save-message" role="status">Menyimpan booking ke database…</p>}
        {saveState === 'error' && <div className="success-save-error" role="alert"><p>{saveError}</p><button className="button button-primary" type="button" onClick={persistBooking}>Coba simpan lagi</button></div>}

        <section className="success-note">
            <p> Simpan informasi pembayaran ini sebagai bukti transaksi. Anda dapat melanjutkan ke halaman tiket untuk melihat informasi penerbangan anda.</p>
        </section>

        <div className="success-actions">
            {saveState === 'saved' ? <Link to="/my-booking" className="button button-primary">Buka My Booking</Link> : <button className="button button-primary" type="button" disabled>{saveState === 'saving' ? 'Menyimpan booking…' : 'Booking belum tersimpan'}</button>}

            <Link to="/" className="button success-home-button">
            Kembali ke Beranda
            </Link>
        </div>
        </main>
    )
}

export default PaymentSuccess
