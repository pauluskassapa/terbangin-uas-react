import { createContext, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const ACCOUNTS_KEY = 'terbangin_demo_accounts'
const SESSION_KEY = 'terbangin_demo_session'

function readAccounts() {
  try {
    const value = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '[]')
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password)
  const digest = await crypto.subtle.digest('SHA-256', bytes)
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  async function register({ name, email, phone, password }) {
    const accounts = readAccounts()
    const normalizedEmail = email.trim().toLowerCase()
    if (accounts.some((account) => account.email === normalizedEmail)) {
      throw new Error('Email ini sudah terdaftar. Silakan masuk.')
    }

    const account = {
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash: await hashPassword(password),
    }
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify([...accounts, account]))
    const session = { name: account.name, email: account.email, phone: account.phone }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }

  async function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const account = readAccounts().find((item) => item.email === normalizedEmail)
    if (!account || account.passwordHash !== await hashPassword(password)) {
      throw new Error('Email atau kata sandi belum benar.')
    }

    const session = { name: account.name, email: account.email, phone: account.phone }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }

  function updateProfile({ name, phone }) {
    const accounts = readAccounts()
    const account = accounts.find((item) => item.email === user?.email)
    if (!account) throw new Error('Data akun tidak ditemukan. Silakan masuk kembali.')

    const updated = { ...account, name: name.trim(), phone: phone.trim() }
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts.map((item) => item.email === user.email ? updated : item)))
    const session = { name: updated.name, email: updated.email, phone: updated.phone }
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value = useMemo(() => ({ user, register, login, updateProfile, logout }), [user])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth harus digunakan di dalam AuthProvider.')
  return context
}

export { AuthProvider, useAuth }
