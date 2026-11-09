import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { formatRupiah } from '../data/flightData.js'
import './Payment.css'

const BAGGAGE_PRICE = 200000
const MAX_EXTRA_BAGGAGE = 20

function Payment() {
    const location = useLocation()
    const navigate = useNavigate()

    const booking = location.state?.booking

    const [baggageKg, setBaggageKg] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState('qris')

    const baggageTotal = baggageKg * BAGGAGE_PRICE
    const grandTotal = booking ? booking.totalPrice + baggageTotal : 0

    function handleSubmit(event) {
        event.preventDefault()

        navigate('/payment-success', {
            state: {
                payment: {
                    booking,
                    baggageKg,
                    baggagePrice: BAGGAGE_PRICE,
                    baggageTotal,
                    paymentMethod,
                    grandTotal,
                    paymentDate: new Date().toISOString(),
                },
            },
        })
    }

    if (!booking) {
        return (
            <main className="page-wrap payment-error">
                <span className="eyebrow">TERBANGIN · PAYMENT</span>
                <h1>Data pemesanan tidak ditemukan</h1>
                <p>Silakan lakukan pemesanan terlebih dahulu sebelum melanjutkan ke pembayaran.</p>
                <Link to="/penerbangan" className="button button-primary">
                Cari Penerbangan
                </Link>
            </main>
        )
    }

    const {
        flight,
        from,
        to,
        formattedDate,
        passengerCount,
        contact,
        passengers,
        totalPrice,
    } = booking

    return (
        <main className="page-wrap payment-page">
            <div className="payment-heading">
                <span className="eyebrow">TERBANGIN · PEMBAYARAN</span>
                <h1>Selesaikan Pembayaran</h1>
                <p>Periksa kembali pesanan, tambahkan bagasi untuk bawaan lebih anda, dan lakukan pembayaran.</p>
            </div>

            <div className="payment-layout">
                <form className="payment-form" onSubmit={handleSubmit}>
                    <section className="payment-section">
                        <div className="payment-section-heading">
                            <span className="payment-number">01</span>
                            <div>
                                <h2>Detail Pemesan</h2>
                                <p>Informasi kontak yang digunakan saat pemesanan.</p>
                            </div>
                        </div>

                        <div className="payment-contact">
                            <div>
                                <span>Nama Pemesan</span>
                                <strong>{contact.name}</strong>
                            </div>

                            <div>
                                <span>Email</span>
                                <strong>{contact.email}</strong>
                            </div>

                            <div>
                                <span>Nomor Telepon</span>
                                <strong>{contact.phone}</strong>
                            </div>
                        </div>
                    </section>

                    <section className="payment-section">
                        <div className="payment-section-heading">
                            <span className="payment-number">02</span>
                            <div>
                                <h2>Bagasi Tambahan</h2>
                                <p>Tambahkan bagasi sesuai kebutuhan barang bawaan anda.</p>
                            </div>
                        </div>

                        <div className="payment-baggage-info">
                            <div className="payment-baggage-icon">
                                ✈
                            </div>

                            <div>
                                <strong>Bagasi bawaan</strong>
                                <span>{flight.baggage}</span>
                            </div>
                        </div>

                        <div className="payment-baggage-selector">
                            <label htmlFor="extra-baggage">
                                Jumlah bagasi tambahan
                            </label>

                            <select
                                id="extra-baggage"
                                value={baggageKg}
                                onChange={(event) => setBaggageKg(Number(event.target.value))}
                                >
                                {Array.from(
                                    { length: MAX_EXTRA_BAGGAGE + 1 },
                                    (_, index) => index,).map((kg) => (
                                        <option key={kg} value={kg}>
                                            {kg} kg
                                        </option>
                                    )
                                )}
                            </select>

                            <div className="payment-baggage-price">
                                <span>Harga bagasi tambahan</span>
                                <strong>{formatRupiah(BAGGAGE_PRICE)} / kg</strong>
                            </div>

                            <div className="payment-baggage-total">
                                <span>Total biaya bagasi</span>
                                <strong>{formatRupiah(baggageTotal)}</strong>
                            </div>
                        </div>
                    </section>

                    <section className="payment-section">
                        <div className="payment-section-heading">
                            <span className="payment-number">03</span>
                            <div>
                                <h2>Metode Pembayaran</h2>
                                <p>Pilih metode pembayaran yang ingin digunakan.</p>
                            </div>
                        </div>

                        <div className="payment-methods">
                            <label className={`payment-method ${paymentMethod === 'qris' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="qris"
                                    checked={paymentMethod === 'qris'}
                                    onChange={(event) => setPaymentMethod(event.target.value)}
                                />

                                <span className="payment-method-icon">
                                    ▦
                                </span>

                                <span className="payment-method-text">
                                    <strong>QRIS</strong>
                                    <small>Pembayaran melalui kode QR</small>
                                </span>

                                <span className="payment-radio" />
                            </label>

                            <label className={`payment-method ${paymentMethod === 'bank' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="bank"
                                    checked={paymentMethod === 'bank'}
                                    onChange={(event) => setPaymentMethod(event.target.value)}
                                />

                                <span className="payment-method-icon">
                                    ▤
                                </span>

                                <span className="payment-method-text">
                                <strong>Transfer Bank</strong>
                                <small>Pembayaran melalui transfer bank</small>
                                </span>
                                <span className="payment-radio" />
                            </label>

                            <label className={`payment-method ${paymentMethod === 'ewallet' ? 'active' : ''}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="ewallet"
                                    checked={paymentMethod === 'ewallet'}
                                    onChange={(event) => setPaymentMethod(event.target.value)}
                                />

                                <span className="payment-method-icon">
                                    ▣
                                </span>

                                <span className="payment-method-text">
                                    <strong>E-Wallet</strong>
                                    <small>Pembayaran melalui dompet digital</small>
                                </span>

                                <span className="payment-radio" />
                            </label>
                        </div>
                    </section>

                    <div className="payment-actions">
                        <Link to="/" className="button payment-back-button">
                        Kembali ke Beranda
                        </Link>

                        <button type="submit" className="button button-primary">
                        Konfirmasi Pembayaran

                        <span aria-hidden="true">
                            →
                        </span>
                        </button>
                    </div>
                </form>

                <aside className="payment-summary">
                    <div className="payment-summary-heading">
                        <span className="eyebrow">RINGKASAN PESANAN</span>
                        <h2>Detail Penerbangan</h2>
                    </div>

                    <div className="payment-route">
                        <div>
                            <span>{from.code}</span>
                            <strong>{from.city}</strong>
                            <small>{flight.departure}</small>
                        </div>

                        <div className="payment-route-line">
                            <span>✈</span>
                            <small>{flight.duration}</small>
                        </div>

                        <div className="payment-route-destination">
                            <span>{to.code}</span>
                            <strong>{to.city}</strong>
                            <small>{flight.arrival}</small>
                        </div>
                    </div>

                    <div className="payment-flight-details">
                        <div>
                            <span>Maskapai</span>
                            <strong>{flight.airline}</strong>
                        </div>

                        <div>
                            <span>Nomor Penerbangan</span>
                            <strong>{flight.number}</strong>
                        </div>
                        
                        <div>
                            <span>Tanggal</span>
                            <strong>{formattedDate}</strong>
                        </div>

                        <div>
                            <span>Jumlah Penumpang</span>
                            <strong>{passengerCount} orang</strong>
                        </div>
                    </div>

                    <div className="payment-passenger-list">
                        <strong>Daftar Penumpang</strong>

                        {passengers.map((passenger, index) => (
                            <div key={index}>
                                <span>Penumpang {index + 1}</span>
                                <strong>{passenger.name}</strong>
                            </div>
                        ))}
                    </div>

                    <div className="payment-price-details">
                        <div>
                            <span>Tiket penerbangan</span>
                            <strong>{formatRupiah(totalPrice)}</strong>
                        </div>

                        <div>
                            <span>Bagasi tambahan ({baggageKg} kg)</span>
                            <strong>{formatRupiah(baggageTotal)}</strong>
                        </div>
                    </div>

                    <div className="payment-grand-total">
                        <span>Total Pembayaran</span>
                        <strong>{formatRupiah(grandTotal)}</strong>
                    </div>

                </aside>
            </div>
        </main>
    )
}

export default Payment