import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/useAuth.js'
import './AccountPages.css'

function ForgotPassword() {
  const { requestPasswordReset, resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [demoCode, setDemoCode] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  function handleRequestCode(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    try {
      const code = requestPasswordReset(email)
      setDemoCode(code)
      setNotice('Ini simulasi lokal. Kode tidak dikirim ke email; kode demo ditampilkan di bawah.')
    } catch (requestError) {
      setDemoCode('')
      setError(requestError.message || 'Kode pemulihan belum bisa dibuat.')
    }
  }

  async function handleReset(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = form.get('password')
    if (password !== form.get('confirmPassword')) {
      setError('Konfirmasi kata sandi belum sama.')
      return
    }

    setError('')
    try {
      await resetPassword({ email, code: form.get('code'), password })
      setSuccess(true)
      setDemoCode('')
      setNotice('Kata sandi berhasil diubah. Silakan masuk dengan kata sandi baru.')
    } catch (resetError) {
      setError(resetError.message || 'Kata sandi belum berhasil diubah.')
    }
  }

  return (
    <main className="account-page page-wrap">
      <section className="account-card" aria-labelledby="recovery-title">
        <div className="account-art" aria-hidden="true"><span>✦</span><i /><i /><i /></div>
        <div className="account-content">
          {success ? (
            <div className="recovery-success" role="status">
              <span className="register-success-icon" aria-hidden="true">✓</span>
              <span className="eyebrow">PEMULIHAN SELESAI</span>
              <h1 id="recovery-title">Kata sandi diperbarui</h1>
              <p className="account-description">{notice}</p>
              <Link className="button button-primary" to="/login">Kembali ke halaman masuk</Link>
            </div>
          ) : (
            <>
              <span className="eyebrow">BANTUAN AKUN</span>
              <h1 id="recovery-title">Lupa kata sandi?</h1>
              <p className="account-description">Masukkan email akun, lalu gunakan kode demo untuk membuat kata sandi baru.</p>
              <form className="account-form recovery-request-form" onSubmit={handleRequestCode}>
                <label className="register-field"><span>Email akun</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" autoComplete="email" required /></label>
                <button className="button button-primary account-submit" type="submit">Buat kode demo</button>
              </form>
              {notice && <p className="recovery-notice" role="status">{notice}</p>}
              {demoCode && (
                <>
                  <div className="recovery-demo-code"><span>KODE DEMO · BERLAKU 10 MENIT</span><strong>{demoCode}</strong></div>
                  <form className="account-form recovery-reset-form" onSubmit={handleReset}>
                    <label className="register-field"><span>Kode pemulihan</span><input name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" minLength="6" maxLength="6" placeholder="6 digit kode" required /></label>
                    <label className="register-field"><span>Kata sandi baru</span><span className="register-password-wrap"><input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength="8" pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}" title="Minimal 8 karakter, 1 huruf kapital, dan 1 simbol." placeholder="Buat kata sandi baru" required /><button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</button></span><small className="password-requirements">Minimal 8 karakter, 1 huruf kapital, dan 1 simbol.</small></label>
                    <label className="register-field"><span>Konfirmasi kata sandi</span><input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength="8" placeholder="Ulangi kata sandi" required /></label>
                    <button className="button button-primary account-submit" type="submit">Simpan kata sandi baru</button>
                  </form>
                </>
              )}
              {error && <p className="register-error recovery-error" role="alert">{error}</p>}
              <p className="account-switch"><Link to="/login">← Kembali ke halaman masuk</Link></p>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default ForgotPassword
