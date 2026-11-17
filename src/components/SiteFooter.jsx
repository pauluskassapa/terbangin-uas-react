import { Link } from 'react-router'

const currentYear = new Date().getFullYear()

function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-wrap">
        <div className="travel-footer-grid">
          <div className="travel-footer-intro">
            <Link className="brand footer-brand" to="/">
              <span className="brand-mark" aria-hidden="true">T</span>
              <span>terbangin<span className="brand-dot">.</span></span>
            </Link>
            <p>Mau ke mana? Terbangin aja.</p>
            <span>Temukan penerbangan untuk perjalanan berikutnya, dari liburan singkat sampai pulang ke rumah.</span>
          </div>
          <nav className="travel-footer-links" aria-label="Tautan bantuan footer">
            <h2>Jelajahi Terbangin</h2>
            <Link to="/penerbangan">Cari penerbangan</Link>
            <Link to="/my-booking">Perjalanan saya</Link>
            <Link to="/booking-history">Riwayat pemesanan</Link>
            <Link to="/faq">Pertanyaan umum</Link>
          </nav>
          <section className="travel-footer-contact" aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title">Hubungi kami</h2>
            <dl>
              <div><dt>Telepon layanan pelanggan</dt><dd>021-XXXX-XXXX <small>(contoh)</small></dd></div>
              <div><dt>Email</dt><dd>halo@terbangin.example</dd></div>
              <div><dt>Jam layanan</dt><dd>Senin–Jumat, 09.00–17.00 WIB</dd></div>
            </dl>
          </section>
          <section className="travel-footer-office" aria-labelledby="footer-office-title">
            <h2 id="footer-office-title">Kantor pusat</h2>
            <address><strong>Terbangin Indonesia</strong><span>Gedung Terbangin, Lantai 2<br />Jl. Contoh Perjalanan No. 10<br />Jakarta, Indonesia</span></address>
            <span className="travel-footer-demo">Alamat & kontak demo</span>
          </section>
        </div>
        <div className="travel-footer-bottom">
          <span>© {currentYear} Terbangin</span>
          <p>Proyek UAS · Informasi kantor dan layanan di atas merupakan contoh.</p>
        </div>
      </div>
    </footer>
  )
}

export default SiteFooter
