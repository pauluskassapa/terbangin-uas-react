import { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../context/useAuth.js'
import './AccountPages.css'

function ForgotPassword() {
  const { requestPasswordReset } = useAuth()
  const [email, setEmail] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [requestSent, setRequestSent] = useState(false)

  async function handleRequestCode(event) {
    event.preventDefault()
    setError('')
    setNotice('')
    try {
      await requestPasswordReset(email)
      setRequestSent(true)
      setNotice('Jika email terdaftar, Supabase akan mengirim tautan untuk membuat kata sandi baru. Periksa juga folder spam.')
    } catch (requestError) {
      setError(requestError.message || 'Kode pemulihan belum bisa dibuat.')
    }
  }

  return (
    <main className="account-page page-wrap">
      <section className="account-card" aria-labelledby="recovery-title">
        <div className="account-art" aria-hidden="true"><span>✦</span><i /><i /><i /></div>
        <div className="account-content">
          <>
              <span className="eyebrow">BANTUAN AKUN</span>
              <h1 id="recovery-title">Lupa kata sandi?</h1>
              <p className="account-description">Masukkan email akun. Kami akan mengirim tautan pemulihan jika email tersebut terdaftar.</p>
              <form className="account-form recovery-request-form" onSubmit={handleRequestCode}>
                <label className="register-field"><span>Email akun</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" autoComplete="email" required /></label>
                <button className="button button-primary account-submit" type="submit">Kirim tautan pemulihan</button>
              </form>
              {requestSent && notice && <p className="recovery-notice" role="status">{notice}</p>}
              {error && <p className="register-error recovery-error" role="alert">{error}</p>}
              <p className="account-switch"><Link to="/login">← Kembali ke halaman masuk</Link></p>
          </>
        </div>
      </section>
    </main>
  )
}

export default ForgotPassword
