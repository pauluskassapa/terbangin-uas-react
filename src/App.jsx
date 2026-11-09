import { Link, Navigate, Route, Routes } from 'react-router'
import { useAuth } from './features/akun/context/AuthContext.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import FlightDetails from './features/penerbangan/pages/FlightDetails.jsx'
import FlightHome from './features/penerbangan/pages/FlightHome.jsx'
import FlightSearch from './features/penerbangan/pages/FlightSearch.jsx'
import Register from './features/akun/pages/Register.jsx'
import Login from './features/akun/pages/Login.jsx'
import Profile from './features/akun/pages/Profile.jsx'
import MyBooking from './features/perjalanan/pages/MyBooking.jsx'
import BookingHistory from './features/perjalanan/pages/BookingHistory.jsx'
import Booking from './features/pemesanan/pages/Booking.jsx'
import Payment from './features/pemesanan/pages/Payment.jsx'
import PaymentSuccess from './features/pemesanan/pages/PaymentSuccess.jsx'
import Faq from './features/bantuan/pages/Faq.jsx'
import './App.css'

function RoutePlaceholder({ title }) {
  return (
    <main className="page-wrap placeholder-page">
      <span className="eyebrow">TERBANGIN · PENERBANGAN</span>
      <h1>{title}</h1>
      <p>Halaman ini kita bangun di langkah berikutnya.</p>
      <Link className="button button-primary" to="/">Kembali ke beranda</Link>
    </main>
  )
}

function App() {
  const { user } = useAuth()
  return (
    <>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<FlightHome />} />
        <Route path="/penerbangan" element={<FlightSearch />} />
        <Route path="/penerbangan/:flightId" element={<FlightDetails />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/my-booking" element={<MyBooking />} />
        <Route path="/booking-history" element={<BookingHistory />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="*" element={<RoutePlaceholder title="Halaman tidak ditemukan" />} />
      </Routes>
      <SiteFooter />
    </>
  )
}

export default App
