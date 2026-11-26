import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/useAuth.js'
import './AccountPages.css'

function ResetPassword() {
  const { user, authLoading, resetPassword } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const password = form.get('password')
    if (password !== form.get('confirmPassword')) {
      setError('Konfirmasi kata sandi belum sama.')
      return
    }

    setError('')
    try {
      await resetPassword({ password })
      setSaved(true)
    } catch (resetError) {
      setError(resetError.message || 'Kata sandi belum berhasil diperbarui.')
    }
  }

  return (
    <main className="account-page page-wrap">
      <section className="account-card" aria-labelledby="reset-title">
        <div className="account-art" aria-hidden="true"><span>✦</span><i /><i /><i /></div>
        <div className="account-content">
          {authLoading ? (
            <p className="account-description" role="status">Memeriksa tautan pemulihan…</p>
          ) : saved ? (
            <div className="recovery-success" role="status">
              <span className="register-success-icon" aria-hidden="true">✓</span>
              <span className="eyebrow">PEMULIHAN SELESAI</span>
              <h1 id="reset-title">Kata sandi diperbarui</h1>
              <p className="account-description">Kata sandi akunmu sudah diganti.</p>
              <Link className="button button-primary" to="/profile">Lanjut ke profil</Link>
            </div>
          ) : user ? (
            <>
              <span className="eyebrow">BANTUAN AKUN</span>
              <h1 id="reset-title">Buat kata sandi baru</h1>
              <p className="account-description">Buat kata sandi baru untuk akun {user.email}.</p>
              <form className="account-form" onSubmit={handleSubmit}>
                <label className="register-field">
                  <span>Kata sandi baru</span>
                  <span className="register-password-wrap">
                    <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength="8" pattern="(?=.*[A-Z])(?=.*[^A-Za-z0-9\s]).{8,}" title="Minimal 8 karakter, 1 huruf kapital, dan 1 simbol." placeholder="Buat kata sandi baru" required />
                    <button className="password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</button>
                  </span>
                  <small className="password-requirements">Minimal 8 karakter, 1 huruf kapital, dan 1 simbol.</small>
                </label>
                <label className="register-field"><span>Konfirmasi kata sandi</span><input name="confirmPassword" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength="8" placeholder="Ulangi kata sandi" required /></label>
                {error && <p className="register-error" role="alert">{error}</p>}
                <button className="button button-primary account-submit" type="submit">Simpan kata sandi baru</button>
              </form>
            </>
          ) : (
            <div className="recovery-success" role="status">
              <span className="eyebrow">TAUTAN TIDAK AKTIF</span>
              <h1 id="reset-title">Minta tautan baru</h1>
              <p className="account-description">Tautan pemulihan mungkin sudah kedaluwarsa atau pernah digunakan. Minta tautan baru untuk melanjutkan.</p>
              <Link className="button button-primary" to="/forgot-password">Kirim ulang tautan</Link>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default ResetPassword
