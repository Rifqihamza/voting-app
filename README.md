# 🗳️ KPRS 2026 — Website E-Voting Pemilihan Ketua OSIS

KPRS 2026 adalah aplikasi **e-voting berbasis web** yang dirancang untuk mendigitalisasi proses pemilihan Ketua dan Wakil Ketua OSIS.  
Website ini dibangun menggunakan **Next.js**, **Tailwind CSS**, dan **DaisyUI**, dengan dukungan sistem login, manajemen kandidat, serta perhitungan suara secara real-time.

---

## 🚀 Fitur Utama

### 👥 Untuk Siswa (User)

- Registrasi menggunakan **NIS dan nama lengkap**
- Login dengan autentikasi aman
- Melihat daftar kandidat (ketua & wakil)
- Melihat visi & misi setiap pasangan calon
- Memberikan **1 suara** untuk kandidat pilihan
- Melihat hasil voting secara real-time (setelah vote)

### 🛠️ Untuk Admin

- Login khusus **role admin**
- CRUD data kandidat (tambah, ubah, hapus)
- Membuat dan mengatur periode pemilihan (start & end)
- Melihat total peserta, total suara masuk, dan status pemilihan di dashboard
- Menampilkan analisis data voting dan export hasil ke **Excel**

---

## 🧩 Teknologi yang Digunakan

| Teknologi                                  | Deskripsi                                |
| ------------------------------------------ | ---------------------------------------- |
| [Next.js](https://nextjs.org/)             | Framework React modern dengan App Router |
| [Tailwind CSS](https://tailwindcss.com/)   | Utility-first CSS framework              |
| [DaisyUI](https://daisyui.com/)            | Komponen UI siap pakai untuk Tailwind    |
| [NextAuth.js](https://next-auth.js.org/)   | Autentikasi user dan session management  |
| [Prisma ORM](https://www.prisma.io/)       | ORM untuk koneksi ke database PostgreSQL |
| [xlsx](https://www.npmjs.com/package/xlsx) | Export data ke format Excel              |

---

# 📊 Fitur Analisis & Export

- Halaman Analytic Dashboard menampilkan data:
- Jumlah peserta terdaftar
- Jumlah kandidat
- Total suara masuk

# Statistik hasil voting per kandidat

📤 Data dapat diexport ke file Excel (.xlsx) dengan 1 klik.

# 🧑‍💻 Kontributor

## Rifqi Hamza — Developer Utama

# 📜 Lisensi

## Proyek ini dilisensikan di bawah MIT License.
