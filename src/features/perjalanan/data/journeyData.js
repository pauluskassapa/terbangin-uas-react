import { supabase } from '../../../lib/supabaseClient.js'

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

export function completeJourneyCheckIn(code, seats) {
  const bookings = getJourneyBookings()
  const bookingIndex = bookings.findIndex((booking) => booking.code === code)
  if (bookingIndex < 0) return null

  const booking = bookings[bookingIndex]
  if (booking.status !== 'Pembayaran Berhasil' || booking.checkedIn) return null
  if (!Array.isArray(seats) || !booking.passengers?.length || seats.length !== booking.passengers.length || seats.some((seat) => !seat)) return null
  if (new Set(seats).size !== seats.length) return null

  const updatedBooking = {
    ...booking,
    checkedIn: true,
    checkedInAt: new Date().toISOString(),
    passengers: booking.passengers.map((passenger, index) => ({ ...passenger, seat: seats[index] })),
  }
  bookings[bookingIndex] = updatedBooking
  saveJourneyBookings(bookings)
  return updatedBooking
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
