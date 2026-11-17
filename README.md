# Terbangin UAS

Website pemesanan tiket pesawat yang dibangun dengan React, Vite, dan React Router.

## Menjalankan project

```bash
npm install
npm run dev
```

Untuk membuat build produksi:

```bash
npm run build
```

## Pembagian fitur

| Folder | Bagian | Penanggung jawab |
| --- | --- | --- |
| `src/features/penerbangan` | Beranda, pencarian, detail penerbangan | Paulus |
| `src/features/perjalanan` | Perjalanan dan riwayat booking | Alexander |
| `src/features/akun` | Daftar, masuk, profil akun | Joan |
| `src/features/pemesanan` | Booking, pembayaran, pembayaran berhasil | Defrigo |
| `src/features/bantuan` | FAQ | Daniel |

Komponen navigasi bersama ada di `src/components`, data penerbangan yang digunakan lintas fitur ada di `src/data`, dan pengaturan route ada di `src/App.jsx`.
