import { Link, NavLink } from 'react-router'
import { useAuth } from '../auth/AuthContext.jsx'

function SiteHeader() {
  const { user, logout } = useAuth()
  return (
    <header className="site-header">
      <div className="header-inner page-wrap">
        <Link className="brand" to="/" aria-label="Terbangin, beranda">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>terbangin<span className="brand-dot">.</span></span>
        </Link>
        <nav className="main-nav" aria-label="Navigasi utama">
          <NavLink to="/" end>Beranda</NavLink>
          <NavLink to="/penerbangan">Cari Penerbangan</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
        </nav>
        {user ? (
          <div className="header-account">
            <Link className="header-account-name" to="/profile">Hai, {user.name.split(' ')[0]}</Link>
            <button className="header-cta header-logout" type="button" onClick={logout}>Keluar</button>
          </div>
        ) : (
          <div className="header-account">
            <Link className="header-login" to="/login">Masuk</Link>
            <Link className="header-cta" to="/register">Daftar akun <span aria-hidden="true">↗</span></Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default SiteHeader
