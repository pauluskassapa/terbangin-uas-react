const STORAGE_KEY = 'terbanginJourneyBookings'

export function getJourneyBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    return Array.isArray(saved) ? saved : []
  } catch {
    return []
  }
}

export function saveJourneyBookings(bookings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings))
}

export function cityName(code) {
  return ({ CGK: 'Jakarta', DPS: 'Bali', SUB: 'Surabaya', YIA: 'Yogyakarta', BDO: 'Bandung', KNO: 'Medan', BPN: 'Balikpapan', LOP: 'Lombok', LBJ: 'Labuan Bajo', SOQ: 'Sorong' })[code] || code || '-'
}

export function journeyDate(date) {
  if (!date) return '-'
  const parsed = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsed.getTime()) ? date : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(parsed)
}

export function journeyMoney(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(value) || 0)
}

export function bookingStatusKey(booking) {
  if (booking.status === 'Pembayaran Berhasil') return 'selesai'
  if (booking.status === 'Dibatalkan') return 'dibatalkan'
  return 'menunggu'
}
