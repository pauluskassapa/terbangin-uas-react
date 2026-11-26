
import { Link, useLocation } from 'react-router'
import { formatRupiah } from '../../../data/penerbangan.js'
import './PaymentSuccess.css'

function PaymentSuccess() {
    const location = useLocation()
    const payment = location.state?.payment

    if (!payment?.booking) {
        return (
            <main className="page-wrap payment-success-error">
                <span className="eyebrow">TERBANGIN · PAYMENT</span>
                <h1>Data pembayaran anda tidak ditemukan</h1>
                <p>Lakukan pemesanan dan pembayaran terlebih dahulu.</p>
                <Link to="/penerbangan" className="button button-primary">
                    Cari Penerbangan
                </Link>
            </main>
        )
    }

    const {
        booking,
        bookingCode,
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
        passengers,
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
                <h1>Pembayaran Selesai!</h1>
                <p>Pembayaran tiket dan bagasi kamu telah berhasil diproses. Terima kasih telah memilih penerbangan bersama TERBANGIN.</p>
            </section>

            <section className="success-card">
                <div className="success-card-header">
                    <div>
                        <span className="success-label">STATUS PEMBAYARAN</span>
                        <h2>Pembayaran Berhasil</h2>
                    </div>

                    <span className="success-status">
                        Berhasil
                    </span>
                </div>

                <div className="success-detail-item success-booking-code">
                    <span>Kode Booking · simpan untuk check-in</span>
                    <strong>{bookingCode}</strong>
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

            <div className="success-actions">
                <Link to="/my-booking" className="button button-primary">
                    Buka My Booking
                </Link>

                <Link to="/" className="button success-home-button">
                    Kembali ke Beranda
                </Link>
            </div>
        </main>
    )
}

export default PaymentSuccess