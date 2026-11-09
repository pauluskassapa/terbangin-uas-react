import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/AuthContext.jsx'
import './AccountPages.css'

function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (user) return <Navigate to="/profile" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      await login({ email: form.get('email'), password: form.get('password') })
      navigate('/profile', { replace: true })
    } catch (loginError) {
      setError(loginError.message || 'Belum berhasil masuk. Coba lagi.')
    }
  }

  return (
    <main className="account-page page-wrap">
      <section className="account-card" aria-labelledby="login-title">
        <div className="account-art" aria-hidden="true"><span>✈</span><i /><i /><i /></div>
        <div className="account-content">
          <span className="eyebrow">SENANG MELIHATMU KEMBALI</span>
          <h1 id="login-title">Masuk ke akunmu</h1>
          <p className="account-description">Masuk untuk mengelola profil dan melanjutkan perjalananmu.</p>
          <form className="account-form" onSubmit={handleSubmit}>
            <label className="register-field"><span>Email</span><input name="email" type="email" placeholder="nama@email.com" autoComplete="email" required /></label>
            <label className="register-field"><span>Kata sandi</span><span className="register-password-wrap"><input name="password" type={showPassword ? 'text' : 'password'} placeholder="Masukkan kata sandi" autoComplete="current-password" required /><button type="button" className="password-toggle" onClick={() => setShowPassword((value) => !value)}>{showPassword ? 'Sembunyikan' : 'Tampilkan'}</button></span></label>
            {error && <p className="register-error" role="alert">{error}</p>}
            <button className="button button-primary account-submit" type="submit">Masuk <span aria-hidden="true">→</span></button>
          </form>
          <p className="account-switch">Belum punya akun? <Link to="/register">Daftar sekarang</Link></p>
        </div>
      </section>
    </main>
  )
}

export default Login
