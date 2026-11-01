import { useState } from 'react'
import { Link } from 'react-router'
import './Register.css'

function Register() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = form.get('password')
    const confirmation = form.get('confirmPassword')

    if (password !== confirmation) {
      setError('Konfirmasi kata sandi belum sama.')
      return
    }

    setError('')
    setRegistered(true)
  }

  return (
    <main className="register-page page-wrap">
      <section className="register-card" aria-labelledby="register-title">
        <div className="register-aside" aria-hidden="true">
          <span className="register-aside-icon">✈</span>
          <span className="eyebrow">MULAI PETUALANGAN BARU</span>
          <h2>Satu akun,<br />banyak cerita.</h2>
          <p>Simpan perjalanan dan temukan tiket untuk tujuan berikutnya.</p>
          <div className="register-aside-decoration"><i /><i /><i /></div>
        </div>

        <div className="register-form-panel">
          {registered ? (
            <div className="register-success" role="status">
              <span className="register-success-icon" aria-hidden="true">✓</span>
              <span className="eyebrow">FORMULIR TERKIRIM</span>
              <h1 id="register-title">Terima kasih sudah mendaftar!</h1>
              <p>Data pendaftaran siap diproses. Fitur pembuatan akun akan aktif setelah terhubung ke layanan akun.</p>
              <Link className="button button-primary" to="/">Kembali ke beranda</Link>
            </div>
          ) : (
            <>
              <span className="eyebrow">AKUN TERBANGIN</span>
              <h1 id="register-title">Buat akun baru</h1>
              <p className="register-intro">Isi data berikut untuk memulai perjalananmu.</p>

              <form className="register-form" onSubmit={handleSubmit}>
                <label className="register-field">
                  <span>Nama lengkap</span>
                  <input name="name" type="text" placeholder="Contoh: Joan Putra" autoComplete="name" minLength="2" required />
                </label>
                <label className="register-field">
                  <span>Email</span>
                  <input name="email" type="email" placeholder="nama@email.com" autoComplete="email" required />
                </label>
                <label className="register-field">
                  <span>Nomor telepon <small>Opsional</small></span>
                  <input name="phone" type="tel" placeholder="+62 812 3456 7890" autoComplete="tel" />
                </label>
                <label className="register-field">
                  <span>Kata sandi</span>
                  <span className="register-password-wrap">
                    <input name="password" type={showPassword ? 'text' : 'password'} placeholder="Minimal 8 karakter" autoComplete="new-password" minLength="8" required />
                    <button type="button" className="password-toggle" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</button>
                  </span>
                </label>
                <label className="register-field">
                  <span>Konfirmasi kata sandi</span>
                  <input name="confirmPassword" type={showPassword ? 'text' : 'password'} placeholder="Ulangi kata sandi" autoComplete="new-password" minLength="8" required />
                </label>
                {error && <p className="register-error" role="alert">{error}</p>}
                <label className="register-terms"><input type="checkbox" required /><span>Saya menyetujui <a href="#syarat">syarat dan ketentuan</a> serta <a href="#privasi">kebijakan privasi</a>.</span></label>
                <button className="button button-primary register-submit" type="submit">Buat akun <span aria-hidden="true">→</span></button>
              </form>
              <p className="register-login-note">Sudah punya akun? <span>Fitur masuk segera hadir</span></p>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default Register
