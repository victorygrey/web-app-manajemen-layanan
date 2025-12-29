# Sistem Manajemen Layanan (Web App)

> **Catatan Penting:** Ini adalah **contoh program** (demo/prototype) untuk keperluan pembelajaran dan demonstrasi. Aplikasi ini **bukan** menggunakan Laravel versi 10 atau framework backend lainnya, melainkan aplikasi web statis berbasis **Alpine.js** dengan penyimpanan data menggunakan **localStorage** browser.

## 📋 Deskripsi

Sistem Manajemen Layanan adalah aplikasi web sederhana untuk mengelola layanan bisnis seperti:
- Jasa Travel / Umroh
- Servis Laptop
- Penukaran Uang
- Jasa IT Support

Aplikasi ini dirancang sebagai **contoh program** untuk demonstrasi fitur-fitur dasar manajemen layanan, termasuk manajemen pelanggan, transaksi, dan laporan.

## 🚀 Teknologi yang Digunakan

- **Alpine.js 3.x** - Framework JavaScript minimalis untuk interaktivitas
- **Chart.js 4.4.0** - Library untuk visualisasi data (grafik statistik)
- **SheetJS (xlsx)** - Export data ke format Excel
- **jsPDF + autotable** - Export data ke format PDF
- **HTML5 & CSS3** - Struktur dan styling
- **localStorage** - Penyimpanan data di browser (client-side)

## ✨ Fitur

### 🔐 Autentikasi
- Login dengan role **Admin** dan **User**
- Session management menggunakan localStorage
- Auto-logout saat refresh (opsional)

### 👥 Manajemen Pelanggan (CRUD)
- ✅ Tambah pelanggan baru
- ✅ Edit data pelanggan
- ✅ Hapus pelanggan
- ✅ Pencarian pelanggan
- ✅ Filter berdasarkan jenis layanan

### 💰 Transaksi
- Input transaksi baru (hanya Admin)
- Riwayat transaksi dengan filter
- Status transaksi: Pending, Selesai, Batal
- Pencarian transaksi

### 📊 Dashboard Statistik
- Ringkasan total pelanggan
- Total transaksi
- Total pendapatan (hanya transaksi selesai)
- Grafik pendapatan per bulan menggunakan Chart.js

### 📄 Laporan & Export
- Filter laporan berdasarkan rentang tanggal
- Export ke **Excel** (.xlsx)
- Export ke **PDF** (.pdf)

## 📁 Struktur Proyek

```
web-app-manajemen-layanan-two/
│
├── index.html          # Halaman utama (Single Page Application)
├── assets/
│   ├── app.js          # Logika aplikasi (Alpine.js components)
│   └── styles.css      # Styling aplikasi
└── README.md           # Dokumentasi proyek
```

## 🛠️ Cara Instalasi & Menjalankan

### Opsi 1: Langsung Buka File (Paling Mudah)
1. Clone atau download repository ini
2. Buka file `index.html` langsung di browser
3. Aplikasi siap digunakan!

### Opsi 2: Menggunakan Local Server (Disarankan)

#### Dengan Python:
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Dengan Node.js (http-server):
```bash
# Install http-server global
npm install -g http-server

# Jalankan server
http-server -p 8000
```

#### Dengan PHP:
```bash
php -S localhost:8000
```

Setelah server berjalan, buka browser dan akses:
```
http://localhost:8000
```

## 🔑 Kredensial Login

### Admin
- **Username:** `admin`
- **Password:** `admin123`
- **Akses:** Full access (CRUD pelanggan, input transaksi, dll)

### User
- **Username:** `user`
- **Password:** `user123`
- **Akses:** Read-only (hanya melihat data)

## 📖 Cara Penggunaan

### 1. Login
- Masukkan username dan password sesuai kredensial di atas
- Role akan otomatis terdeteksi berdasarkan kombinasi username/password

### 2. Dashboard
- Setelah login, Anda akan melihat dashboard dengan statistik ringkasan
- Grafik pendapatan per bulan akan otomatis terupdate

### 3. Data Pelanggan
- Klik menu **"Data Pelanggan"** di sidebar
- Admin dapat menambah, edit, atau hapus pelanggan
- User hanya dapat melihat data pelanggan

### 4. Transaksi
- Klik menu **"Transaksi"** di sidebar
- Admin dapat input transaksi baru di panel kiri
- Riwayat transaksi ditampilkan di panel kanan
- Gunakan filter untuk mencari transaksi tertentu

### 5. Laporan
- Klik menu **"Laporan"** di sidebar
- Pilih rentang tanggal (opsional)
- Klik **"Export Excel"** atau **"Export PDF"** untuk mengunduh laporan

## ⚠️ Catatan Penting

1. **Data Penyimpanan:** Semua data disimpan di **localStorage browser**, artinya:
   - Data hanya tersimpan di browser yang digunakan
   - Data akan hilang jika localStorage di-clear
   - Data tidak tersinkronisasi antar browser/device

2. **Ini Adalah Contoh Program:**
   - Tidak menggunakan database server
   - Tidak menggunakan backend framework (Laravel, dll)
   - Cocok untuk pembelajaran dan demonstrasi
   - **Tidak disarankan untuk produksi** tanpa modifikasi signifikan

3. **Browser Compatibility:**
   - Disarankan menggunakan browser modern (Chrome, Firefox, Edge, Safari terbaru)
   - Pastikan JavaScript diaktifkan

## 🎨 Tampilan

Aplikasi menggunakan tema dark mode dengan desain modern dan responsif. Interface dirancang untuk kemudahan penggunaan dengan navigasi yang intuitif.

## 📝 Lisensi

Proyek ini adalah contoh program untuk keperluan pembelajaran dan demonstrasi. Silakan gunakan dan modifikasi sesuai kebutuhan.

## 🤝 Kontribusi

Karena ini adalah contoh program, silakan fork dan modifikasi sesuai kebutuhan Anda. Jika menemukan bug atau ingin menambahkan fitur, silakan buat issue atau pull request.

## 📧 Support

Untuk pertanyaan atau masukan, silakan buat issue di repository ini.

---

**Dibuat dengan ❤️ menggunakan Alpine.js**

