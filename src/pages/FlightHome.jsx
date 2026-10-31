import { useState } from 'react'
import { useNavigate } from 'react-router'
import { airports } from '../data/flightData.js'

function getLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function FlightHome() {
  const navigate = useNavigate()
  const [from, setFrom] = useState('CGK')
  const [to, setTo] = useState('DPS')
  const [date, setDate] = useState(() => getLocalDate(new Date()))
  const [error, setError] = useState('')

  function handleSearch(event) {
    event.preventDefault()
    if (from === to) {
      setError('Kota asal dan tujuan harus berbeda.')
      return
    }
    setError('')
    const params = new URLSearchParams({ from, to, date })
    navigate(`/penerbangan?${params.toString()}`)
  }

  function swapAirports() {
    setFrom(to)
    setTo(from)
    setError('')
  }

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="page-wrap home-hero-inner">
          <div className="home-copy">
            <span className="eyebrow"><span className="eyebrow-spark">✳</span> PERJALANAN SERU DIMULAI DI SINI</span>
            <h1>Mau ke mana?<br /><span>Terbangin aja.</span></h1>
            <p>Temukan penerbangan yang pas untuk cerita perjalananmu berikutnya.</p>
            <div className="home-note"><span>✦</span> Harga transparan, perjalanan lebih tenang.</div>
          </div>
          <div className="home-illustration" aria-hidden="true">
            <div className="illustration-sun" /><div className="illustration-orbit orbit-a" /><div className="illustration-orbit orbit-b" />
            <span className="illustration-plane">✈</span><span className="illustration-spark spark-a">✳</span><span className="illustration-spark spark-b">✦</span>
            <div className="illustration-label"><span>YOUR NEXT</span><strong>ADVENTURE</strong></div>
          </div>
        </div>
      </section>

      <section className="search-card page-wrap" aria-labelledby="search-heading">
        <div className="search-card-heading">
          <div><span className="eyebrow">MULAI PERJALANANMU</span><h2 id="search-heading">Cari penerbangan</h2></div>
          <span className="one-way"><i /> Sekali jalan</span>
        </div>
        <form className="home-search-form" onSubmit={handleSearch}>
          <label className="home-field"><span className="field-label">BERANGKAT DARI</span><span className="home-field-control"><b>↗</b><select value={from} onChange={(event) => setFrom(event.target.value)} aria-label="Kota asal">{airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.city} ({airport.code})</option>)}</select></span></label>
          <button className="swap-button" type="button" onClick={swapAirports} aria-label="Tukar kota asal dan tujuan">⇄</button>
          <label className="home-field"><span className="field-label">TUJUAN</span><span className="home-field-control"><b className="down-icon">↘</b><select value={to} onChange={(event) => setTo(event.target.value)} aria-label="Kota tujuan">{airports.map((airport) => <option key={airport.code} value={airport.code}>{airport.city} ({airport.code})</option>)}</select></span></label>
          <label className="home-field date-field"><span className="field-label">TANGGAL PERGI</span><span className="home-field-control"><b className="calendar-icon">▦</b><input type="date" min={getLocalDate(new Date())} value={date} onChange={(event) => setDate(event.target.value)} required /></span></label>
          <button className="button button-primary search-submit" type="submit">Cari tiket <span>→</span></button>
        </form>
        {error && <p className="form-error" role="alert">{error}</p>}
      </section>

      <section className="home-intro page-wrap">
        <span className="eyebrow">LANGKAH PERTAMA MENUJU CERITA BARU</span>
        <div className="home-intro-row"><h2>Tujuanmu sudah<br />menunggu.</h2><p>Dari pantai tropis sampai kota penuh cerita, perjalanan impianmu dimulai dari satu tiket. Cari rute dan pilih jadwal yang cocok untukmu.</p></div>
        <div className="home-destinations"><span>INDONESIA, SIAP DIJELAJAHI</span><div><span>✦ Bali</span><span>✦ Yogyakarta</span><span>✦ Labuan Bajo</span><span>✦ Lombok</span></div></div>
      </section>
    </main>
  )
}

export default FlightHome
