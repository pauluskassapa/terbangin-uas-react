import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import './Faq.css'

const faqCategories = [
  { id: 'Semua', label: 'Semua Topik' },
  { id: 'Pemesanan', label: 'Pemesanan' },
  { id: 'Pembayaran', label: 'Pembayaran' },
  { id: 'Bagasi', label: 'Bagasi & Check-in' },
  { id: 'Akun', label: 'Akun & Tiket' },
]

const faqItems = [
  {
    id: 'faq-1',
    category: 'Pemesanan',
    question: 'Bagaimana cara memesan tiket pesawat di Terbangin?',
    answer:
      'Pilih kota keberangkatan, kota tujuan, tanggal pergi, dan jumlah penumpang di halaman Beranda atau Cari Penerbangan. Setelah menemukan jadwal maskapai yang sesuai, klik "Lihat detail" lalu pilih "Lanjutkan pemesanan" untuk mengisi data pemesan dan penumpang.',
  },
  {
    id: 'faq-2',
    category: 'Pemesanan',
    question: 'Berapa batas maksimal penumpang dalam satu kali pemesanan?',
    answer:
      'Dalam satu transaksi pemesanan di Terbangin, kamu dapat memesan tiket untuk 1 hingga 6 penumpang sekaligus. Pastikan nama lengkap setiap penumpang diisi sesuai dengan identitas resmi (KTP/Paspor).',
  },
  {
    id: 'faq-3',
    category: 'Pembayaran',
    question: 'Metode pembayaran apa saja yang tersedia?',
    answer:
      'Terbangin mendukung tiga metode pembayaran utama yang praktis dan instan: QRIS (kode QR semua bank & dompet digital), Transfer Bank, serta E-Wallet. Semua harga yang ditampilkan pada ringkasan sudah transparan dan termasuk pajak.',
  },
  {
    id: 'faq-4',
    category: 'Bagasi',
    question: 'Apakah tiket sudah termasuk bagasi kabin dan bagasi tercatat?',
    answer:
      'Setiap penerbangan sudah mencakup bagasi kabin 7 kg dan kuota bagasi dasar sesuai kebijakan masing-masing maskapai (misalnya 15 kg atau 20 kg). Jika membawa barang lebih banyak, kamu bisa membeli bagasi tambahan hingga 20 kg dengan tarif Rp200.000 per kg pada halaman pembayaran.',
  },
  {
    id: 'faq-5',
    category: 'Bagasi',
    question: 'Kapan saya harus tiba di bandara sebelum keberangkatan?',
    answer:
      'Kami sangat menyarankan penumpang penerbangan domestik untuk tiba di bandara minimal 2 jam sebelum jadwal keberangkatan agar proses pemeriksaan dokumen, check-in, dan penitipan bagasi berjalan tenang.',
  },
  {
    id: 'faq-6',
    category: 'Akun',
    question: 'Apakah saya harus membuat akun untuk memesan tiket?',
    answer:
      'Kamu dapat menjelajahi jadwal penerbangan kapan saja, namun membuat akun Terbangin memudahkanmu menyimpan data profil, nomor telepon kontak, dan mengelola riwayat perjalanan dengan lebih cepat.',
  },
  {
    id: 'faq-7',
    category: 'Akun',
    question: 'Bagaimana cara mengubah nama atau nomor telepon di profil saya?',
    answer:
      'Setelah masuk ke akunmu, klik sapaan namamu di pojok kanan atas untuk membuka halaman Profil Saya. Di sana kamu dapat memperbarui nama lengkap dan nomor telepon, lalu klik "Simpan perubahan".',
  },
  {
    id: 'faq-8',
    category: 'Pemesanan',
    question: 'Apakah jadwal penerbangan dapat diubah (reschedule) atau dibatalkan?',
    answer:
      'Ketentuan perubahan jadwal (reschedule) dan pengembalian dana (refund) mengikuti kebijakan masing-masing maskapai. Pastikan memeriksa kembali rute, tanggal keberangkatan, dan ejaan nama penumpang sebelum mengonfirmasi pembayaran.',
  },
]

function Faq() {
  const [selectedCategory, setSelectedCategory] = useState('Semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [openId, setOpenId] = useState(faqItems[0].id)

  const filteredFaqs = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    return faqItems.filter((item) => {
      const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory
      const matchesSearch =
        !normalizedQuery ||
        item.question.toLowerCase().includes(normalizedQuery) ||
        item.answer.toLowerCase().includes(normalizedQuery)
      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, searchQuery])

  function toggleFaq(id) {
    setOpenId((currentId) => (currentId === id ? null : id))
  }

  return (
    <main className="faq-page">
      <section className="faq-hero">
        <div className="page-wrap faq-hero-inner">
          <div className="faq-hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-spark">✳</span> PUSAT BANTUAN · TERBANGIN
            </span>
            <h1>
              Ada pertanyaan?
              <br />
              <span>Kami siap bantu.</span>
            </h1>
            <p>
              Temukan jawaban cepat seputar pemesanan tiket, metode pembayaran, aturan bagasi, hingga pengelolaan akun perjalananmu.
            </p>
          </div>

          <div className="faq-search-box">
            <label htmlFor="faq-search-input" className="faq-search-label">
              CARI PERTANYAAN
            </label>
            <div className="faq-search-control">
              <span aria-hidden="true">⌕</span>
              <input
                id="faq-search-input"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Ketik kata kunci, misal: bagasi, QRIS, penumpang..."
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-wrap faq-content">
        <div className="faq-categories" role="tablist" aria-label="Kategori pertanyaan">
          {faqCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selectedCategory === category.id}
              className={selectedCategory === category.id ? 'faq-category-btn active' : 'faq-category-btn'}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="faq-layout">
          <div className="faq-list">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, index) => {
                const isOpen = openId === item.id
                return (
                  <article
                    key={item.id}
                    className={isOpen ? 'faq-item open' : 'faq-item'}
                  >
                    <button
                      type="button"
                      className="faq-question"
                      aria-expanded={isOpen}
                      onClick={() => toggleFaq(item.id)}
                    >
                      <span className="faq-number">{String(index + 1).padStart(2, '0')}</span>
                      <span className="faq-question-text">
                        <small>{item.category}</small>
                        <strong>{item.question}</strong>
                      </span>
                      <span className="faq-toggle-icon" aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="faq-answer">
                        <p>{item.answer}</p>
                      </div>
                    )}
                  </article>
                )
              })
            ) : (
              <div className="faq-empty" role="status">
                <span aria-hidden="true">✈</span>
                <h3>Pertanyaan tidak ditemukan</h3>
                <p>Coba gunakan kata kunci lain atau pilih kategori Semua Topik.</p>
                <button
                  type="button"
                  className="button button-primary"
                  onClick={() => {
                    setSelectedCategory('Semua')
                    setSearchQuery('')
                  }}
                >
                  Atur ulang pencarian
                </button>
              </div>
            )}
          </div>

          <aside className="faq-support-card">
            <span className="eyebrow">BUTUH BANTUAN LEBIH?</span>
            <h2>Siap terbang tanpa ragu</h2>
            <p>
              Jika kamu belum menemukan jawaban yang dicari, pastikan memeriksa kembali detail rute atau langsung mulai pencarian tiketmu.
            </p>
            <div className="faq-support-points">
              <div>
                <span>✦</span>
                <div>
                  <strong>Harga Transparan</strong>
                  <small>Termasuk pajak & biaya layanan dasar</small>
                </div>
              </div>
              <div>
                <span>✦</span>
                <div>
                  <strong>Bagasi Fleksibel</strong>
                  <small>Tambah bagasi hingga 20 kg saat pembayaran</small>
                </div>
              </div>
              <div>
                <span>✦</span>
                <div>
                  <strong>Konfirmasi Instan</strong>
                  <small>Dukungan QRIS, Transfer Bank, & E-Wallet</small>
                </div>
              </div>
            </div>
            <Link to="/penerbangan" className="button button-primary faq-cta-button">
              Cari tiket sekarang <span aria-hidden="true">→</span>
            </Link>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Faq
