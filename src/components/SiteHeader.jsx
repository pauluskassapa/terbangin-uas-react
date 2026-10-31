import { Link, NavLink } from 'react-router'

function SiteHeader() {
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
        </nav>
        <Link className="header-cta" to="/penerbangan">Jelajahi tiket <span aria-hidden="true">↗</span></Link>
      </div>
    </header>
  )
}

export default SiteHeader
