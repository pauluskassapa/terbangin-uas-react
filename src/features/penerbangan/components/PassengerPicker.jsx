import './PassengerPicker.css'

function PassengerPicker({ value, onChange }) {
  return (
    <div className="passenger-picker" role="group" aria-label="Jumlah penumpang">
      <span className="passenger-label">PENUMPANG</span>
      <div className="passenger-controls">
        <button type="button" onClick={() => onChange(Math.max(1, value - 1))} disabled={value <= 1} aria-label="Kurangi jumlah penumpang">−</button>
        <output aria-live="polite">{value}</output>
        <button type="button" onClick={() => onChange(Math.min(6, value + 1))} disabled={value >= 6} aria-label="Tambah jumlah penumpang">+</button>
      </div>
    </div>
  )
}

export default PassengerPicker
