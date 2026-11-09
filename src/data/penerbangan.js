export const airports = [
  { code: 'CGK', city: 'Jakarta' },
  { code: 'BDO', city: 'Bandung' },
  { code: 'SUB', city: 'Surabaya' },
  { code: 'DPS', city: 'Bali' },
  { code: 'YIA', city: 'Yogyakarta' },
  { code: 'LBJ', city: 'Labuan Bajo' },
  { code: 'LOP', city: 'Lombok' },
  { code: 'SOQ', city: 'Sorong · Raja Ampat' },
]

export const flights = [
  { id: 'ga402', airline: 'Garuda Indonesia', number: 'GA 402', mark: 'GA', color: 'garuda', departure: '08.00', arrival: '10.50', duration: '1j 50m', price: 1250000, baggage: '20 kg', perk: 'Makanan tersedia', recommendation: 1 },
  { id: 'qg680', airline: 'Citilink', number: 'QG 680', mark: 'QG', color: 'citilink', departure: '10.30', arrival: '13.25', duration: '1j 55m', price: 890000, baggage: '15 kg', perk: 'Pilih kursi', recommendation: 2 },
  { id: 'id6512', airline: 'Batik Air', number: 'ID 6512', mark: 'ID', color: 'batik', departure: '12.15', arrival: '15.10', duration: '1j 55m', price: 1050000, baggage: '20 kg', perk: 'Hiburan di pesawat', recommendation: 3 },
  { id: 'jt804', airline: 'Lion Air', number: 'JT 804', mark: 'JT', color: 'lion', departure: '14.20', arrival: '17.15', duration: '1j 55m', price: 760000, baggage: 'Kabin 7 kg', perk: 'Bagasi tambahan tersedia', recommendation: 4 },
  { id: 'iu750', airline: 'Super Air Jet', number: 'IU 750', mark: 'IU', color: 'super', departure: '16.00', arrival: '18.55', duration: '1j 55m', price: 820000, baggage: 'Kabin 7 kg', perk: 'Hiburan di aplikasi', recommendation: 5 },
  { id: 'ip120', airline: 'Pelita Air', number: 'IP 120', mark: 'IP', color: 'pelita', departure: '19.20', arrival: '22.15', duration: '1j 55m', price: 930000, baggage: '20 kg', perk: 'Makanan tersedia', recommendation: 6 },
]

export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}

export function getPassengerCount(value) {
  const count = Number(value)
  return Number.isFinite(count) ? Math.min(6, Math.max(1, Math.floor(count))) : 1
}
