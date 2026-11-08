import { useState } from 'react'
import { useAuth } from '../auth/AuthContext.jsx'
import './AccountPages.css'

function Profile() {
  const { user, updateProfile } = useAuth()
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    try {
      updateProfile({ name: form.get('name'), phone: form.get('phone') })
      setSaved(true)
      setError('')
    } catch (updateError) {
      setError(updateError.message || 'Profil belum berhasil diperbarui.')
      setSaved(false)
    }
  }

  return (
    <main className="account-page profile-page page-wrap">
      <section className="profile-heading">
        <span className="eyebrow">AKUN TERBANGIN</span>
        <h1>Profil saya</h1>
        <p>Kelola informasi dasar akunmu.</p>
      </section>
      <section className="profile-card" aria-labelledby="profile-form-title">
        <div className="profile-avatar" aria-hidden="true">{user.name.trim().charAt(0).toUpperCase()}</div>
        <div className="profile-form-content">
          <h2 id="profile-form-title">Informasi pribadi</h2>
          <p className="account-description">Email akun menjadi identitas masuk dan belum bisa diubah.</p>
          <form className="account-form" onSubmit={handleSubmit}>
            <label className="register-field"><span>Nama lengkap</span><input name="name" type="text" defaultValue={user.name} autoComplete="name" minLength="2" required /></label>
            <label className="register-field"><span>Email</span><input type="email" value={user.email} readOnly /></label>
            <label className="register-field"><span>Nomor telepon</span><input name="phone" type="tel" defaultValue={user.phone} placeholder="+62 812 3456 7890" autoComplete="tel" /></label>
            {error && <p className="register-error" role="alert">{error}</p>}
            {saved && <p className="profile-saved" role="status">Profil berhasil diperbarui.</p>}
            <button className="button button-primary account-submit" type="submit">Simpan perubahan <span aria-hidden="true">→</span></button>
          </form>
        </div>
      </section>
    </main>
  )
}

export default Profile
