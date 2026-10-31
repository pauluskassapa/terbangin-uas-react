import { Link, Route, Routes } from 'react-router'
import SiteFooter from './components/SiteFooter.jsx'
import SiteHeader from './components/SiteHeader.jsx'
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
  return (
    <>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<RoutePlaceholder title="Beranda penerbangan" />} />
        <Route path="/penerbangan" element={<RoutePlaceholder title="Hasil pencarian penerbangan" />} />
        <Route path="/penerbangan/:flightId" element={<RoutePlaceholder title="Detail penerbangan" />} />
        <Route path="*" element={<RoutePlaceholder title="Halaman tidak ditemukan" />} />
      </Routes>
      <SiteFooter />
    </>
  )
}

export default App
