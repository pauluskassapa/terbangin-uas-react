import { Link } from 'react-router'

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-wrap footer-inner">
        <Link className="brand footer-brand" to="/">
          <span className="brand-mark" aria-hidden="true">T</span>
          <span>terbangin<span className="brand-dot">.</span></span>
        </Link>
        <p>Mau ke mana? TERBANGIN aja.</p>
        <span>© 2026 Terbangin</span>
      </div>
    </footer>
  )
}

export default SiteFooter
