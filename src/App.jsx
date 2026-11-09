import { Link, Navigate, Route, Routes } from 'react-router'
import { useAuth } from './auth/AuthContext.jsx'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
import FlightDetails from './pages/FlightDetails.jsx'
import FlightHome from './pages/FlightHome.jsx'
import FlightSearch from './pages/FlightSearch.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Profile from './pages/Profile.jsx'
import Faq from './pages/Faq.jsx'
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
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" replace />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="*" element={<RoutePlaceholder title="Halaman tidak ditemukan" />} />
      </Routes>
      <SiteFooter />
    </>
  )
}

export default App
