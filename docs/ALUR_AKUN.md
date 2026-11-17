# Panduan Belajar Fitur Akun Terbangin

Dokumen ini menjelaskan alur register, login, profil, logout, dan lupa kata sandi pada frontend Terbangin.

## Peta file

- `src/main.jsx` memasang `BrowserRouter` dan `AuthProvider` di atas seluruh aplikasi.
- `src/features/akun/context/authContext.js` membuat objek konteks React bernama `AuthContext`.
- `src/features/akun/context/AuthContext.jsx` menyediakan data akun dan fungsi register/login/profil/reset/logout.
- `src/features/akun/context/useAuth.js` membuat hook kecil agar komponen dapat membaca konteks dengan `useAuth()`.
- `src/App.jsx` mendefinisikan URL halaman dan melindungi route profil.
- `src/components/SiteHeader.jsx` menampilkan tombol masuk/daftar atau nama pengguna/keluar.
- `src/features/akun/pages/Register.jsx` dan `Register.css` membentuk form pendaftaran.
- `src/features/akun/pages/Login.jsx` adalah form masuk.
- `src/features/akun/pages/Profile.jsx` menampilkan dan menyimpan nama serta nomor telepon.
- `src/features/akun/pages/ForgotPassword.jsx` membuat kode demo dan mengganti kata sandi.
- `src/features/akun/pages/AccountPages.css` memuat gaya yang dipakai halaman login, profil, dan pemulihan.

## Konsep React yang dipakai

### Provider dan context

`AuthProvider` membungkus aplikasi di `main.jsx`. Context menjadi tempat bersama untuk `user` dan fungsi akun. Karena itu, header, halaman login, dan halaman profil dapat memakai informasi masuk yang sama tanpa mengoper props melewati banyak komponen.

`useAuth()` adalah custom hook. Hook ini memanggil `useContext(AuthContext)` dan memberi pesan jelas jika dipakai di luar `AuthProvider`.

### Route

`App.jsx` memasangkan URL ke komponen. Contohnya `/register` membuka `Register`, `/forgot-password` membuka `ForgotPassword`, dan `/profile` hanya menampilkan `Profile` saat `user` tersedia. Jika belum masuk, React Router mengarahkan pengguna ke `/login`.

## Cara kerja register

1. `Register.jsx` menangani submit dengan `handleSubmit` dan mencegah browser memuat ulang halaman memakai `event.preventDefault()`.
2. `FormData` membaca nilai input berdasarkan atribut `name`.
3. Form memeriksa kecocokan kata sandi dan konfirmasi.
4. `register()` di `AuthContext.jsx` menormalkan email menjadi huruf kecil, memeriksa email duplikat, membuat hash kata sandi, menyimpan akun, lalu membuat sesi.
5. State `registered` mengganti form dengan pesan berhasil dan tautan ke profil.

HTML `required`, `type="email"`, dan `minLength` memberi validasi dasar di browser. Pemeriksaan di `register()` tetap diperlukan karena validasi tampilan saja dapat dilewati.

## Cara kerja login dan sesi

`login()` mencari email yang sudah dinormalkan. Ia memverifikasi kata sandi terhadap hash tersimpan. Jika cocok, data publik pengguna (nama, email, telepon) disimpan sebagai sesi di `localStorage` dan dimasukkan ke state React. `passwordHash` tidak pernah dimasukkan ke sesi.

Saat aplikasi dibuka ulang, `AuthProvider` membaca sesi dari `localStorage`. Tombol keluar menghapus sesi, lalu `setUser(null)` langsung memperbarui tampilan header.

## Hash kata sandi

`hashPassword()` memakai Web Crypto PBKDF2 dengan SHA-256, salt acak untuk tiap akun, dan banyak iterasi. Salt mencegah kata sandi yang sama menghasilkan hash yang sama. Akun demo lama memakai SHA-256 tanpa salt; saat berhasil login, hash lama diganti ke format PBKDF2.

## Profil

`Profile.jsx` mengisi form dari pengguna aktif. Email hanya-baca karena menjadi identitas login. `updateProfile()` memvalidasi nama, mengganti data akun yang sesuai email, lalu memperbarui sesi juga agar sapaan header langsung berubah.

## Lupa kata sandi

`requestPasswordReset()` membuat kode acak enam digit yang berlaku 10 menit. `resetPassword()` memeriksa email, waktu kedaluwarsa, batas lima percobaan, kode, dan kata sandi baru. Jika semua cocok, hash kata sandi akun diganti dan kode dihapus. Setelah itu pengguna masuk dengan kata sandi baru.

Pada versi ini kode sengaja ditampilkan di halaman sebagai **kode demo** karena belum ada server dan layanan email. Ini hanya mensimulasikan alur UI untuk tugas frontend; kode tersebut tidak membuktikan kepemilikan email.

## Batasan penting

Data akun dan sesi berada di `localStorage` browser. Akun hanya tersedia di browser/perangkat yang sama, dapat diubah pengguna melalui DevTools, dan tidak aman untuk layanan sungguhan. Hash di frontend juga tidak menggantikan autentikasi server. Agar dapat digunakan oleh banyak pengguna dengan pemulihan email sungguhan, aplikasi perlu backend, database, HTTPS, sesi/token aman, dan layanan pengiriman email. Jangan gunakan kata sandi sungguhan pada demo ini.

## Menjalankan

```powershell
npm install
npm run dev
```

Buka `/register` untuk membuat akun demo. Sesudah daftar, coba logout, login kembali, ubah profil, atau buka `/forgot-password` untuk mencoba pemulihan.
