import { supabase } from '../../../lib/supabaseClient.js'

const STORAGE_KEY = 'terbanginJourneyBookings'
const BOOKING_SELECT = 'id, booking_code, contact_name, contact_email, contact_phone, airline, flight_number, from_code, to_code, flight_date, passenger_count, grand_total, checked_in, checked_in_at, created_at, booking_passengers(id, passenger_name, seat), booking_payments(payment_method, payment_status, created_at)'

function normalizeJourneyBooking(data) {
  const payment = [...(data.booking_payments || [])]
    .sort((first, second) => new Date(second.created_at || 0) - new Date(first.created_at || 0))[0]
  const status = payment?.payment_status === 'simulated_success'
    ? 'Pembayaran Berhasil'
    : payment?.payment_status === 'failed'
      ? 'Pembayaran Gagal'
      : 'Menunggu Pembayaran'

  return {
    id: data.id,
    code: data.booking_code,
    status,
    paymentStatus: payment?.payment_status || 'pending',
    paymentMethod: payment?.payment_method || '',
    paidAt: payment?.payment_status === 'simulated_success' ? payment.created_at : null,
    createdAt: data.created_at,
    date: data.flight_date,
    from: data.from_code,
    to: data.to_code,
    airline: data.airline,
    flightNumber: data.flight_number,
    contactName: data.contact_name,
    email: data.contact_email,
    phone: data.contact_phone,
    passengerCount: data.passenger_count,
    total: Number(data.grand_total) || 0,
    checkedIn: Boolean(data.checked_in),
    checkedInAt: data.checked_in_at,
    passengers: (data.booking_passengers || []).map((passenger) => ({
      id: passenger.id,
      name: passenger.passenger_name,
      seat: passenger.seat,
    })),
  }
}

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

export async function saveJourneyBooking(payment, bookingCode, bookingId) {
  if (!supabase) {
    throw new Error('Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.')
  }

  const { booking } = payment
  const { data: existing, error: lookupError } = await supabase
    .from('bookings')
    .select('id, booking_passengers(id), booking_payments(id)')
    .eq('booking_code', bookingCode)
    .maybeSingle()
  if (lookupError) throw lookupError
  const savedBookingId = existing?.id || bookingId

  if (!existing) {
    const { error: bookingError } = await supabase.from('bookings').insert({
      id: savedBookingId,
      booking_code: bookingCode,
      contact_name: booking.contact.name.trim(),
      contact_email: booking.contact.email.trim().toLowerCase(),
      contact_phone: booking.contact.phone.trim(),
      airline: booking.flight.airline,
      flight_number: booking.flight.number,
      from_code: booking.from.code,
      to_code: booking.to.code,
      flight_date: booking.date || null,
      passenger_count: booking.passengerCount,
      ticket_total: booking.totalPrice,
      baggage_kg: payment.baggageKg,
      baggage_total: payment.baggageTotal,
      grand_total: payment.grandTotal,
      checked_in: false,
    })
    if (bookingError) throw bookingError
  }

  if (!existing?.booking_passengers?.length) {
    const passengerRows = booking.passengers.map((passenger) => ({
      booking_id: savedBookingId,
      passenger_name: passenger.name.trim(),
      seat: null,
    }))
    const { error: passengersError } = await supabase.from('booking_passengers').insert(passengerRows)
    if (passengersError) throw passengersError
  }

  if (!existing?.booking_payments?.length) {
    const { error: paymentError } = await supabase.from('booking_payments').insert({
      booking_id: savedBookingId,
      payment_method: payment.paymentMethod,
      payment_status: 'simulated_success',
      payment_mode: 'simulation',
      amount: payment.grandTotal,
    })
    if (paymentError) throw paymentError
  }

  const localBooking = {
    id: savedBookingId,
    code: bookingCode,
    status: 'Pembayaran Berhasil',
    createdAt: payment.paymentDate,
    paidAt: payment.paymentDate,
    date: booking.date,
    from: booking.from.code,
    to: booking.to.code,
    airline: booking.flight.airline,
    flightNumber: booking.flight.number,
    contactName: booking.contact.name,
    email: booking.contact.email,
    phone: booking.contact.phone,
    passengers: booking.passengers.map((passenger, index) => ({ id: `${savedBookingId}-${index}`, name: passenger.name, seat: null })),
    total: payment.grandTotal,
    checkedIn: false,
  }
  saveJourneyBookings([localBooking, ...getJourneyBookings()])
}

export async function findJourneyBooking(code, email) {
  if (!supabase) {
    throw new Error('Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.')
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_SELECT)
    .eq('booking_code', code.trim().toUpperCase())
    .eq('contact_email', email.trim().toLowerCase())
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return normalizeJourneyBooking(data)
}

export async function getJourneyBookingsFromDatabase() {
  if (!supabase) {
    throw new Error('Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.')
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_SELECT)
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data || []).map(normalizeJourneyBooking)
}

export async function getJourneyBookingByCode(code) {
  if (!supabase) {
    throw new Error('Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.')
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(BOOKING_SELECT)
    .eq('booking_code', code)
    .maybeSingle()
  if (error) throw error
  return data ? normalizeJourneyBooking(data) : null
}

export async function completeJourneyCheckIn(booking, seats) {
  if (!supabase) {
    throw new Error('Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY.')
  }
  if (booking.status !== 'Pembayaran Berhasil' || booking.checkedIn) return null
  if (!Array.isArray(seats) || !booking.passengers?.length || seats.length !== booking.passengers.length || seats.some((seat) => !seat)) return null
  if (new Set(seats).size !== seats.length) return null

  const passengerUpdates = await Promise.all(booking.passengers.map((passenger, index) =>
    supabase.from('booking_passengers')
      .update({ seat: seats[index] })
      .eq('id', passenger.id)
      .eq('booking_id', booking.id)
  ))
  const passengerError = passengerUpdates.find((result) => result.error)?.error
  if (passengerError) throw passengerError

  const { data, error } = await supabase.from('bookings')
    .update({ checked_in: true, checked_in_at: new Date().toISOString() })
    .eq('id', booking.id)
    .eq('checked_in', false)
    .select('id')
    .maybeSingle()
  if (error) throw error
  if (!data) return null
  return getJourneyBookingByCode(booking.code)
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
  if (booking.status === 'Dibatalkan' || booking.status === 'Pembayaran Gagal') return 'dibatalkan'
  return 'menunggu'
}
