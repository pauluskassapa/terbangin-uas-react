# Terbangin UAS

Website pemesanan tiket pesawat yang dibangun dengan React, Vite, dan React Router.

## Menjalankan project

```bash
npm install
npm run dev
```

## Menyiapkan Supabase

1. Buat project Supabase, lalu isi `.env.local` memakai `.env.example` sebagai acuan (`VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY`).
2. Di Supabase Dashboard, buka **SQL Editor**, tempel dan jalankan `supabase/migrations/202611270001_initial_schema.sql`.
3. Pastikan URL yang dipakai terdaftar di **Authentication → URL Configuration → Site URL / Redirect URLs** supaya alur konfirmasi email dan reset kata sandi kembali ke aplikasi.

Migrasi ini membuat tabel akun booking, penumpang, pembayaran demo, dan spot tersimpan beserta foreign key, indeks, dan RLS. Aplikasi saat ini berjalan sebagai demo tanpa mengikat data booking ke akun pengguna; policy migrasi memberi akses publik agar alur demo dapat berjalan. Karena itu, gunakan hanya data contoh dan jangan simpan data penumpang nyata sebelum kebijakan akses berbasis kepemilikan ditambahkan.

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
