import { useState } from 'react'
import { AuthContext } from './authContext.js'

const ACCOUNTS_KEY = 'terbangin_demo_accounts'
const SESSION_KEY = 'terbangin_demo_session'
const RESET_KEY = 'terbangin_demo_password_reset'
const PASSWORD_ITERATIONS = 210_000
const RESET_VALIDITY_MS = 10 * 60 * 1000
const RESET_MAX_ATTEMPTS = 5

function readJson(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || 'null')
    return value ?? fallback
  } catch {
    return fallback
  }
}

function readAccounts() {
  const value = readJson(ACCOUNTS_KEY, [])
  return Array.isArray(value) ? value : []
}

function toHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, '0')).join('')
}

function fromHex(value) {
  return new Uint8Array(value.match(/.{2}/g).map((byte) => Number.parseInt(byte, 16)))
}

async function hashPassword(password, salt = crypto.getRandomValues(new Uint8Array(16)), iterations = PASSWORD_ITERATIONS) {
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const derivedBits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
    keyMaterial,
    256,
  )
  return `pbkdf2$${PASSWORD_ITERATIONS}$${toHex(salt)}$${toHex(derivedBits)}`
}

async function verifyPassword(password, storedHash) {
  if (typeof storedHash !== 'string') return { matches: false, needsUpgrade: false }

  if (storedHash.startsWith('pbkdf2$')) {
    const [, iterations, saltHex, expectedHash] = storedHash.split('$')
    if (!iterations || !saltHex || !expectedHash) return { matches: false, needsUpgrade: false }
    const iterationCount = Number(iterations)
    if (!Number.isSafeInteger(iterationCount) || iterationCount < 1 || iterationCount > 2_000_000) {
      return { matches: false, needsUpgrade: false }
    }
    const actualHash = await hashPassword(password, fromHex(saltHex), iterationCount)
    return { matches: actualHash === `pbkdf2$${iterations}$${saltHex}$${expectedHash}`, needsUpgrade: false }
  }

  // Kompatibilitas sementara dengan akun demo yang dibuat memakai SHA-256 lama.
  const legacyDigest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
  const matches = toHex(legacyDigest) === storedHash
  return { matches, needsUpgrade: matches }
}

function getPublicAccount(account) {
  return { name: account.name, email: account.email, phone: account.phone || '' }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => readJson(SESSION_KEY, null))

  async function register({ name, email, phone = '', password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const normalizedName = name.trim()
    if (normalizedName.length < 2) throw new Error('Nama minimal terdiri dari 2 karakter.')
    if (!normalizedEmail) throw new Error('Email wajib diisi.')
    if (password.length < 8) throw new Error('Kata sandi minimal 8 karakter.')

    const accounts = readAccounts()
    if (accounts.some((account) => account.email === normalizedEmail)) {
      throw new Error('Email ini sudah terdaftar. Silakan masuk.')
    }

    const account = {
      name: normalizedName,
      email: normalizedEmail,
      phone: phone.trim(),
      passwordHash: await hashPassword(password),
    }
    const session = getPublicAccount(account)
    saveAccounts([...accounts, account])
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }

  async function login({ email, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const accounts = readAccounts()
    const accountIndex = accounts.findIndex((item) => item.email === normalizedEmail)
    const account = accounts[accountIndex]
    const verification = account
      ? await verifyPassword(password, account.passwordHash)
      : { matches: false, needsUpgrade: false }

    if (!verification.matches) throw new Error('Email atau kata sandi belum benar.')

    if (verification.needsUpgrade) {
      const upgradedAccount = { ...account, passwordHash: await hashPassword(password) }
      accounts[accountIndex] = upgradedAccount
      saveAccounts(accounts)
    }

    const session = getPublicAccount(account)
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }

  function updateProfile({ name, phone = '' }) {
    const normalizedName = name.trim()
    if (normalizedName.length < 2) throw new Error('Nama minimal terdiri dari 2 karakter.')

    const accounts = readAccounts()
    const account = accounts.find((item) => item.email === user?.email)
    if (!account) throw new Error('Data akun tidak ditemukan. Silakan masuk kembali.')

    const updated = { ...account, name: normalizedName, phone: phone.trim() }
    const session = getPublicAccount(updated)
    saveAccounts(accounts.map((item) => item.email === user.email ? updated : item))
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
    setUser(session)
  }

  function requestPasswordReset(email) {
    const normalizedEmail = email.trim().toLowerCase()
    const accountExists = readAccounts().some((account) => account.email === normalizedEmail)
    if (!accountExists) throw new Error('Email belum terdaftar. Periksa email atau buat akun baru.')

    const randomNumber = new DataView(crypto.getRandomValues(new Uint32Array(1)).buffer).getUint32(0)
    const code = String(randomNumber % 1_000_000).padStart(6, '0')
    localStorage.setItem(RESET_KEY, JSON.stringify({ email: normalizedEmail, code, createdAt: Date.now(), attempts: 0 }))
    return code
  }

  async function resetPassword({ email, code, password }) {
    const normalizedEmail = email.trim().toLowerCase()
    const reset = readJson(RESET_KEY, null)
    if (!reset || reset.email !== normalizedEmail) {
      throw new Error('Minta kode pemulihan baru untuk email ini.')
    }
    if (Date.now() - reset.createdAt > RESET_VALIDITY_MS) {
      localStorage.removeItem(RESET_KEY)
      throw new Error('Kode sudah kedaluwarsa. Minta kode pemulihan baru.')
    }
    if (reset.attempts >= RESET_MAX_ATTEMPTS) {
      localStorage.removeItem(RESET_KEY)
      throw new Error('Batas percobaan tercapai. Minta kode pemulihan baru.')
    }
    if (reset.code !== code.trim()) {
      localStorage.setItem(RESET_KEY, JSON.stringify({ ...reset, attempts: reset.attempts + 1 }))
      throw new Error(`Kode tidak cocok. Sisa percobaan: ${RESET_MAX_ATTEMPTS - reset.attempts - 1}.`)
    }
    if (password.length < 8) throw new Error('Kata sandi minimal 8 karakter.')

    const accounts = readAccounts()
    const accountIndex = accounts.findIndex((account) => account.email === normalizedEmail)
    if (accountIndex < 0) throw new Error('Akun tidak ditemukan.')

    accounts[accountIndex] = { ...accounts[accountIndex], passwordHash: await hashPassword(password) }
    saveAccounts(accounts)
    localStorage.removeItem(RESET_KEY)
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  const value = { user, register, login, updateProfile, requestPasswordReset, resetPassword, logout }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export { AuthProvider }
