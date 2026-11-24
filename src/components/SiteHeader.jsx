import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { useAuth } from '../features/akun/context/useAuth.js'

function SiteHeader() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  async function handleLogout() {
    setLogoutError('')
    try {
      await logout()
    } catch {
      setLogoutError('Belum berhasil keluar. Periksa koneksi lalu coba lagi.')
    }
  }
  return (
    <header className="site-header" onKeyDown={(event) => { if (event.key === 'Escape') { setMenuOpen(false); event.currentTarget.querySelector('.header-menu-toggle')?.focus() } }}>
      <div className="header-inner page-wrap">
        <Link className="brand" onClick={() => setMenuOpen(false)} to="/" aria-label="Terbangin, beranda">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>terbangin<span className="brand-dot">.</span></span>
        </Link>
        <button className="header-menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="header-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span> {menuOpen ? 'Tutup' : 'Menu'}
        </button>
        <div id="header-navigation" className={`header-navigation${menuOpen ? ' is-open' : ''}`} onClick={(event) => { if (event.target.closest('a, button')) setMenuOpen(false) }}>
        <nav className="main-nav" aria-label="Navigasi utama">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/penerbangan">Cari Penerbangan</NavLink>
          <NavLink to="/my-booking">My Booking</NavLink>
          <NavLink to="/booking-history">Booking History</NavLink>
          <NavLink to="/destinasi">Destinasi</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
        </nav>
        {user ? (
          <div className="header-account">
            <Link className="header-account-name" to="/profile">Hai, {user.name.split(' ')[0]}</Link>
            <button className="header-cta header-logout" type="button" onClick={handleLogout}>Keluar</button>
            {logoutError && <span className="header-account-error" role="alert">{logoutError}</span>}
          </div>
        ) : (
          <div className="header-account">
            <Link className="header-login" to="/login">Masuk</Link>
            <Link className="header-cta" to="/register">Daftar akun</Link>
          </div>
        )}
        </div>
      </div>
    </header>
  )
}

export default SiteHeader
