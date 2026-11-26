import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { formatRupiah } from '../../../data/penerbangan.js'
import { supabase } from '../../../lib/supabaseClient.js'
import './Payment.css'

const BAGGAGE_PRICE = 200000
const MAX_EXTRA_BAGGAGE = 20

const BANK_ACCOUNTS = {
    BCA: '880812345678901',
    BRI: '880212345678901',
    BNI: '880812345678902',
    Mandiri: '880812345678903',
}

const EWALLET_CODES = {
    GoPay: 'GP-TRB-2026-123456',
    OVO: 'OVO-TRB-2026-123456',
    DANA: 'DANA-TRB-2026-123456',
    ShopeePay: 'SP-TRB-2026-123456',
}

function Payment() {
    const location = useLocation()
    const navigate = useNavigate()

    const booking = location.state?.booking

    const [baggageKg, setBaggageKg] = useState(0)
    const [paymentMethod, setPaymentMethod] = useState('qris')
    const [selectedBank, setSelectedBank] = useState('')
    const [selectedEwallet, setSelectedEwallet] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState('')

    if (!booking) {
        return (
            <main className="page-wrap payment-error">
                <span className="eyebrow">TERBANGIN · PAYMENT</span>
                <h1>Data pemesanan tidak ditemukan</h1>
                <p>Silakan pilih penerbangan terlebih dahulu sebelum melanjutkan ke pembayaran.</p>

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

    const baggageTotal = baggageKg * BAGGAGE_PRICE
    const grandTotal = totalPrice + baggageTotal

    async function handleSubmit(event) {
        event.preventDefault()

        if (paymentMethod === 'bank' && !selectedBank) {
            setSubmitError('Silakan pilih bank terlebih dahulu.')
            return
        }

        if (paymentMethod === 'ewallet' && !selectedEwallet) {
            setSubmitError('Silakan pilih E-Wallet terlebih dahulu.')
            return
        }

        if (!supabase) {
            setSubmitError('Koneksi Supabase belum tersedia. Periksa konfigurasi .env.local.')
            return
        }

        setIsSubmitting(true)
        setSubmitError('')

        try {
            const bookingId = crypto.randomUUID()
            const bookingCode = `TRB${Date.now().toString().slice(-7)}`
            const paymentDate = new Date().toISOString()

            const { error: bookingError } = await supabase
                .from('bookings')
                .insert({
                    id: bookingId,
                    booking_code: bookingCode,

                    contact_name: contact.name.trim(),
                    contact_email: contact.email.trim(),
                    contact_phone: contact.phone.trim(),

                    airline: flight.airline,
                    flight_number: flight.number,

                    from_code: from.code,
                    to_code: to.code,
                    flight_date: booking.date || null,

                    passenger_count: passengerCount,

                    ticket_total: totalPrice,
                    baggage_kg: baggageKg,
                    baggage_total: baggageTotal,
                    grand_total: grandTotal,
                })

            if (bookingError) {
                throw bookingError
            }

            const passengerData = passengers.map((passenger) => ({
                booking_id: bookingId,
                passenger_name: passenger.name.trim(),
            }))

            const { error: passengerError } = await supabase
                .from('booking_passengers')
                .insert(passengerData)

            if (passengerError) {
                throw passengerError
            }

            const { error: paymentError } = await supabase
                .from('booking_payments')
                .insert({
                    booking_id: bookingId,
                    payment_method: paymentMethod,
                    payment_status: 'simulated_success',
                    payment_mode: 'simulation',
                    amount: grandTotal,
                })

            if (paymentError) {
                throw paymentError
            }

            navigate('/payment-success', {
                state: {
                    payment: {
                        booking,
                        bookingId,
                        bookingCode,
                        baggageKg,
                        baggagePrice: BAGGAGE_PRICE,
                        baggageTotal,
                        paymentMethod,
                        selectedBank,
                        selectedEwallet,
                        grandTotal,
                        paymentDate,
                        paymentMode: 'simulation',
                    },
                },
            })

        } catch (error) {
            console.error('Payment error:', error)

            setSubmitError(error.message || 'Terjadi kesalahan saat menyimpan pembayaran.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="page-wrap payment-page">
            <div className="payment-heading">
                <span className="eyebrow">TERBANGIN · PEMBAYARAN</span>
                <h1>Selesaikan Pembayaran</h1>
                <p>Periksa kembali pesanan, tambahkan bagasi untuk bawaan Anda, dan pilih metode pembayaran.</p>
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
                                <p>Tambahkan bagasi sesuai kebutuhan barang bawaan Anda.</p>
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
                                onChange={(event) =>
                                    setBaggageKg(Number(event.target.value))
                                }
                            >
                                {Array.from(
                                    { length: MAX_EXTRA_BAGGAGE + 1 },
                                    (_, index) => index
                                ).map((kg) => (
                                    <option key={kg} value={kg}>
                                        {kg} kg
                                    </option>
                                ))}
                            </select>

                            <div className="payment-baggage-price">
                                <span>Harga bagasi tambahan</span>
                                <strong>
                                    {formatRupiah(BAGGAGE_PRICE)} / kg
                                </strong>
                            </div>

                            <div className="payment-baggage-total">
                                <span>Total biaya bagasi</span>
                                <strong>
                                    {formatRupiah(baggageTotal)}
                                </strong>
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
                            <label className={`payment-method ${
                                paymentMethod === 'qris' ? 'active' : ''
                            }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="qris"
                                    checked={paymentMethod === 'qris'}
                                    onChange={(event) =>
                                        setPaymentMethod(event.target.value)
                                    }
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

                            <label
                                className={`payment-method ${
                                    paymentMethod === 'bank' ? 'active' : ''
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="bank"
                                    checked={paymentMethod === 'bank'}
                                    onChange={
                                        (event) => setPaymentMethod(event.target.value)
                                    }
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

                            <label
                                className={`payment-method ${
                                    paymentMethod === 'ewallet' ? 'active' : ''
                                }`}
                            >
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="ewallet"
                                    checked={paymentMethod === 'ewallet'}
                                    onChange={
                                        (event) => setPaymentMethod(event.target.value)
                                    }
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

                        {paymentMethod === 'bank' && (
                            <div className="payment-method-detail">
                                <h3>Transfer Bank</h3>

                                <p className="payment-method-description">
                                    Pilih bank yang ingin anda gunakan untuk melakukan pembayaran.
                                </p>

                                <label htmlFor="bank-select">
                                    Pilih Bank
                                </label>

                                <select
                                    id="bank-select"
                                    value={selectedBank}
                                    onChange={
                                        (event) =>setSelectedBank(event.target.value)
                                    }
                                >
                                    <option value="">-- Pilih Bank --</option>
                                    <option value="BCA">BCA</option>
                                    <option value="BRI">BRI</option>
                                    <option value="BNI">BNI</option>
                                    <option value="Mandiri">Mandiri</option>
                                </select>

                                {selectedBank && (
                                    <>
                                        <div className="payment-info">
                                            <span>Virtual Account TERBANGIN</span>
                                            <strong>{BANK_ACCOUNTS[selectedBank]}</strong>
                                        </div>

                                        <div className="payment-info">
                                            <span>Total Pembayaran</span>
                                            <strong>{formatRupiah(grandTotal)}</strong>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {paymentMethod === 'ewallet' && (
                            <div className="payment-method-detail">
                                <h3>E-Wallet</h3>

                                <p className="payment-method-description">
                                    Pilih dompet digital yang ingin anda gunakan untuk melakukan pembayaran.
                                </p>

                                <label htmlFor="ewallet-select">
                                    Pilih E-Wallet
                                </label>

                                <select
                                    id="ewallet-select"
                                    value={selectedEwallet}
                                    onChange={
                                        (event) =>setSelectedEwallet(event.target.value)
                                    }
                                >
                                    <option value="">-- Pilih E-Wallet --</option>
                                    <option value="GoPay">GoPay</option>
                                    <option value="OVO">OVO</option>
                                    <option value="DANA">DANA</option>
                                    <option value="ShopeePay">ShopeePay</option>
                                </select>

                                {selectedEwallet && (
                                    <>
                                        <div className="payment-info">
                                            <span>Kode Pembayaran</span>
                                            <strong>{EWALLET_CODES[selectedEwallet]}</strong>
                                        </div>

                                        <div className="payment-info">
                                            <span>Total Pembayaran</span>
                                            <strong>{formatRupiah(grandTotal)}</strong>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                        {paymentMethod === 'qris' && (
                            <div className="payment-method-detail payment-qris-detail">
                                <div className="payment-qris-container">
                                    <h3>QRIS TERBANGIN</h3>
                                    <img
                                        src="/images/payment/qris.jpeg"
                                        alt="QRIS TERBANGIN"
                                        className="payment-qris-image"
                                    />

                                    <p>Scan QR untuk melakukan pembayaran</p>

                                    <div className="payment-info">
                                        <span>Total Pembayaran</span>
                                        <strong>{formatRupiah(grandTotal)}</strong>
                                    </div>
                                </div>
                            </div>
                        )}
                    </section>

                    {submitError && (
                        <p
                            className="payment-error-message"
                            role="alert"
                        >
                            {submitError}
                        </p>
                    )}

                    <div className="payment-actions">
                        <Link
                            to="/"
                            className="button payment-back-button"
                        >
                            Kembali ke Beranda
                        </Link>

                        <button
                            type="submit"
                            className="button button-primary"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Menyimpan Pembayaran...'
                                : 'Konfirmasi Pembayaran'}

                            <span aria-hidden="true">→</span>
                        </button>
                    </div>
                </form>

                <aside className="payment-summary">
                    <div className="payment-summary-heading">
                        <span className="eyebrow">
                            RINGKASAN PESANAN
                        </span>
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