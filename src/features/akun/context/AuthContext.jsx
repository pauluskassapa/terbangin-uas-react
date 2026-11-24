import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient.js'
import { AuthContext } from './authContext.js'

function requireSupabase() {
  if (!supabase) {
    throw new Error('Supabase belum dikonfigurasi. Isi VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di .env.local.')
  }
  return supabase
}

function validatePassword(password) {
  if (password.length < 8) throw new Error('Kata sandi harus minimal 8 karakter.')
  if (!/[A-Z]/.test(password)) throw new Error('Kata sandi harus memiliki minimal 1 huruf kapital.')
  if (!/[\p{P}\p{S}]/u.test(password)) throw new Error('Kata sandi harus memiliki minimal 1 simbol, seperti ! atau #.')
}

function toPublicUser(authUser) {
  if (!authUser) return null
  const metadata = authUser.user_metadata || {}
  return {
    id: authUser.id,
    email: authUser.email || '',
    name: metadata.full_name || metadata.name || authUser.email?.split('@')[0] || 'Pengguna',
    phone: metadata.phone || '',
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return undefined

    let mounted = true
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return
      setUser(toPublicUser(session?.user))
      setAuthLoading(false)
    })

    supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted) return
      setUser(toPublicUser(data.session?.user))
      setAuthLoading(false)
      if (error) console.error('Tidak dapat membaca sesi Supabase:', error.message)
    }).catch((error) => {
      if (!mounted) return
      setAuthLoading(false)
      console.error('Tidak dapat menghubungi Supabase:', error)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  async function register({ name, email, phone = '', password }) {
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedPhone = phone.trim()
    if (normalizedName.length < 2) throw new Error('Nama minimal terdiri dari 2 karakter.')
    if (!normalizedEmail) throw new Error('Email wajib diisi.')
    validatePassword(password)

    const { data, error } = await requireSupabase().auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        data: { full_name: normalizedName, phone: normalizedPhone },
        emailRedirectTo: window.location.origin,
      },
    })
    if (error) throw new Error(error.message)
    return { requiresEmailConfirmation: !data.session }
  }

  async function login({ email, password }) {
    const { data, error } = await requireSupabase().auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })
    if (error) throw new Error('Email atau kata sandi belum benar.')
    setUser(toPublicUser(data.user))
  }

  async function updateProfile({ name, phone = '' }) {
    const normalizedName = name.trim()
    if (normalizedName.length < 2) throw new Error('Nama minimal terdiri dari 2 karakter.')
    const { data, error } = await requireSupabase().auth.updateUser({
      data: { full_name: normalizedName, phone: phone.trim() },
    })
    if (error) throw new Error(error.message)
    setUser(toPublicUser(data.user))
  }

  async function requestPasswordReset(email) {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) throw new Error('Email wajib diisi.')
    const { error } = await requireSupabase().auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (error) throw new Error(error.message)
  }

  async function resetPassword({ password }) {
    validatePassword(password)
    const { data, error } = await requireSupabase().auth.updateUser({ password })
    if (error) throw new Error(error.message)
    setUser(toPublicUser(data.user))
  }

  async function logout() {
    const { error } = await requireSupabase().auth.signOut()
    if (error) throw new Error(error.message)
    setUser(null)
  }

  const value = {
    user,
    authLoading,
    isSupabaseConfigured: Boolean(supabase),
    register,
    login,
    updateProfile,
    requestPasswordReset,
    resetPassword,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider }
