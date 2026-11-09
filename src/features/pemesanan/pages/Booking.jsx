import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router'
import { airports, flights, formatRupiah, getPassengerCount } from '../../../data/penerbangan.js'
import './Booking.css'

function Booking() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()

    const flightId = searchParams.get('flightId')
    const fromCode = searchParams.get('from') || 'CGK'
    const toCode = searchParams.get('to') || 'DPS'
    const date = searchParams.get('date')
    const passengerCount = getPassengerCount(searchParams.get('passengers'))

    const flight = flights.find((item) => item.id === flightId)
    const from = airports.find((item) => item.code === fromCode) || airports[0]
    const to = airports.find((item) => item.code === toCode) || airports[3]

    const [contact, setContact] = useState({
        name: '',
        email: '',
        phone: '',
    })

    const [passengers, setPassengers] = useState(() =>
        Array.from({ length: passengerCount }, () => ({ name: '' })),
    )

    const formattedDate = date ? new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(`${date}T00:00:00`)) : 'Tanggal belum dipilih'

    const totalPrice = flight ? flight.price * passengerCount : 0

    function handleContactChange(event) {
    const { name, value } = event.target

    setContact((previous) => ({
        ...previous,
        [name]: value,
    }))}

    function handlePassengerChange(index, value) {
        setPassengers((previous) =>
            previous.map((passenger, passengerIndex) => passengerIndex === index ? { ...passenger, name: value }
            : passenger
        ))
    }

    function handleSubmit(event) {
    event.preventDefault()

    navigate('/payment', {
        state: {
            booking: {
                flight,
                from,
                to,
                date,
                formattedDate,
                passengerCount,
                contact,
                passengers,
                totalPrice,
            },
        },
    })
    }

    if (!flight) {
    return (
        <main className="page-wrap booking-error">
            <span className="eyebrow">TERBANGIN · BOOKING</span>
            <h1>Penerbangan tidak ditemukan</h1>
            <p>Silakan pilih penerbangan terlebih dahulu.</p>
            <Link to="/penerbangan" className="button button-primary">
                Cari Penerbangan
            </Link>
        </main>
    )
    }

    return (
    <main className="page-wrap booking-page">
        <div className="booking-heading">
            <span className="eyebrow">TERBANGIN · PEMESANAN</span>
            <h1>Silahkan Lengkapi Data Pemesanan Anda</h1>
            <p>Isi informasi dan data anda untuk melanjutkan ke pembayaran.</p>
        </div>

        <div className="booking-layout">
            <form className="booking-form" onSubmit={handleSubmit}>
                <section className="booking-section">
                    <div className="booking-section-heading">
                    <div>
                        <h2>Informasi Pemesan</h2>
                        <p>Masukkan informasi kontak yang dapat dihubungi.</p>
                    </div>
                    </div>

                    <div className="booking-fields">
                        <label className="booking-field">
                            <span>Nama Lengkap</span>
                            <input type="text"name="name"value={contact.name}onChange={handleContactChange}placeholder="Masukkan nama lengkap"required/>
                        </label>

                        <label className="booking-field">
                            <span>Alamat Email</span>
                            <input type="email"name="email"value={contact.email}onChange={handleContactChange}placeholder="contoh@email.com"required/>
                        </label>

                        <label className="booking-field">
                            <span>Nomor Telepon</span>
                            <input type="tel"name="phone"value={contact.phone}onChange={handleContactChange}placeholder="Masukkan nomor telepon"required/>
                        </label>
                    </div>
                </section>

            <section className="booking-section">
                <div className="booking-section-heading">
                    <div>
                        <h2>Data Diri</h2>
                        <p>Masukkan nama lengkap sesuai KTP.</p>
                    </div>
                </div>

                <div className="booking-passengers">{passengers.map((passenger, index) => (
                    <div className="booking-passenger" key={index}>
                        <div className="booking-passenger-title">
                            <strong>Penumpang {index + 1}</strong>
                            <span>{index === 0 ? 'Penumpang utama' : 'Penumpang tambahan'}</span>
                        </div>

                        <label className="booking-field">
                            <span>Nama Lengkap</span>
                            <input type="text"value={passenger.name}onChange={(event) => handlePassengerChange(index, event.target.value)} 
                            placeholder="Masukkan nama sesuai KTP" required/>
                        </label>
                    </div>
                ))}
                </div>
            </section>

            <div className="booking-form-actions">
                <Link to={`/penerbangan/${flight.id}?${new URLSearchParams({
                    from: from.code,
                    to: to.code,
                    date: date || '',
                    passengers: String(passengerCount),
                }).toString()}`}
                className="button booking-back-button">
                    Kembali
                </Link>

                <button type="submit" className="button button-primary">
                    Lanjutkan Pembayaran
                <span aria-hidden="true">→</span>
                </button>
            </div>
            </form>

            <aside className="booking-summary">
                <div className="booking-summary-heading">
                    <span className="eyebrow">RINGKASAN</span>
                    <h2>Detail Penerbangan</h2>
                </div>

                <div className="booking-route">
                    <div className="booking-route-point">
                        <span>{from.code}</span>
                        <strong>{from.city}</strong>
                        <small>{flight.departure}</small>
                    </div>

                    <div className="booking-route-line">
                        <span>✈</span>
                        <small>{flight.duration}</small>
                    </div>

                    <div className="booking-route-point booking-route-destination">
                        <span>{to.code}</span>
                        <strong>{to.city}</strong>
                        <small>{flight.arrival}</small>
                    </div>
                </div>

                <div className="booking-summary-details">
                    <div>
                        <span>Maskapai</span>
                        <strong>{flight.airline}</strong>
                    </div>

                    <div>
                        <span>Nomor Penerbangan</span>
                        <strong>{flight.number}</strong>
                    </div>

                    <div>
                        <span>Tanggal Keberangkatan</span>
                        <strong>{formattedDate}</strong>
                    </div>

                    <div>
                        <span>Jumlah Penumpang</span>
                        <strong>{passengerCount} orang</strong>
                    </div>

                    <div>
                        <span>Bagasi</span>
                        <strong>{flight.baggage}</strong>
                    </div>
                </div>

                <div className="booking-price">
                    <div>
                        <span>Harga per penumpang</span>
                        <strong>{formatRupiah(flight.price)}</strong>
                    </div>

                    <div>
                        <span>Total ({passengerCount} penumpang)</span>
                        <strong className="booking-total">
                            {formatRupiah(totalPrice)}
                        </strong>
                    </div>
                </div>

                <p className="booking-summary-note">
                    Harga di atas merupakan total tiket penerbangan dan belum termasuk tambahan bagasi.
                </p>
            </aside>
        </div>
    </main>
    )
}

export default Booking
