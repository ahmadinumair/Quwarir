# QUWARIR — Global Islamic Financial Technology

**Invest Globally. Invest Ethically.**

QUWARIR adalah situs profil perusahaan untuk institusi teknologi finansial (FinTech) internasional yang berfokus pada investasi global sesuai prinsip Syariah, penyaringan saham halal (*Shariah stock screening*), analitik keuangan transparan, serta edukasi keuangan Islam.

---

## Fitur Utama

- **Identitas & Estetika Arsitektur Islam**
  - Logo geometris `Q` heksagonal berpadu palet warna emerald-to-mint enam tingkat (`#051F20`, `#0B2B26`, `#163832`, `#235347`, `#8EB69B`, `#DAF1DE`).
  - Bingkai lengkungan *Mihrab*, kisi geometris *Girih / Rub el Hizb*, aksen *Shamsa*, serta dinding ubin *Mashrabiya* interaktif.
- **Animasi Editorial & Responsif**
  - Efek paralaks mengikuti pergerakan kursor pada visual hero (*Motion*) dan transisi gulir editorial (*GSAP ScrollTrigger*), lengkap dengan dukungan `prefers-reduced-motion`.
- **Kerangka Penyaringan Syariah Dua Tahap**
  - Penjelasan interaktif evaluasi aktivitas usaha (*Haram Sector Exclusion*, *Bayan*) dan batas rasio keuangan (*Riba* utang/likuiditas `< 30%`, pendapatan non-halal insidental `< 5%` dengan kewajiban *Tathir*).
- **Kalkulator Zakat & Proyeksi Bagi Hasil Islami (`#calculator`)**
  - **Mode Zakat & Tathir**: Mendukung mata uang `USD`, `SAR`, `EUR`, `GBP`, dan `IDR`, pilihan basis saham (100% nilai pasar vs. proksi aset zakat 25%), standar Nisab (85g emas / 595g perak), tarif Hijriah (2,5%) atau Masehi (2,577%), serta perhitungan penyucian dividen (*Tathir*) terpisah.
  - **Mode Proyeksi Bagi Hasil (`Mudarabah` & `Musharakah`)**: Simulasi skenario profit-and-loss sesuai kaidah *Fiqh al-Muamalat* (termasuk aturan penanggungan kerugian modal dan opsi pemotongan Zakat tahunan) lengkap dengan grafik batang dan tabel rincian per tahun.
- **Cakupan Pasar Global & Ekosistem**
  - Tampilan interaktif bursa Saudi (*Tadawul*), pasar ekuitas Amerika Serikat, ekspansi internasional, serta konsep arsitektur ekosistem prospektif (*IBKR* dan *Wise*).
- **QUWARIR Research & Media Desk (Backend `@google/genai`)**
  - **Asisten Riset Multi-Turn**: Tanya jawab seputar metodologi penyaringan Syariah, pasar global, dan literasi keuangan Islam.
  - **Briefing Audio (TTS)**: Konversi naskah ringkasan institusional menjadi audio `.wav` langsung di browser.
  - **Visual Studio**: Pembuatan konsep visual editorial arsitektural dalam resolusi `1K`, `2K`, dan `4K`.
- **Formulir Korespondensi Perusahaan**
  - Validasi input sisi klien dan server (`POST /api/contact`) dengan nomor referensi otomatis.

---

## Teknologi yang Digunakan

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4
- **Animasi**: GSAP (`ScrollTrigger`), Motion (`motion/react`), Lucide React
- **Backend**: Node.js, Express 4 (`server.ts`), `tsx`
- **Integrasi AI Server-Side**: `@google/genai`

---

## Struktur Direktori Utama

```text
├── index.html                        # Titik masuk HTML, metadata & favicon SVG
├── server.ts                         # Server Express (API proxy Gemini, kontak, health check & static/Vite)
├── vite.config.ts                    # Konfigurasi build Vite & pemecahan vendor chunk
├── package.json                      # Daftar dependensi & skrip npm
├── .env.example                      # Contoh variabel lingkungan
└── src/
    ├── App.tsx                       # Root aplikasi & ErrorBoundary
    ├── index.css                     # Token tema Tailwind CSS & tipografi
    ├── hooks/
    │   └── useEditorialScrollReveal.ts
    ├── utils/
    │   └── safeFetchJson.ts
    └── components/
        ├── Navbar.tsx
        ├── QuwarirLogo.tsx
        ├── IslamicOrnaments.tsx
        ├── HeroSection.tsx
        ├── ArchitecturalInterlude.tsx
        ├── AboutSection.tsx
        ├── ServicesSection.tsx
        ├── ZakatAndProfitCalculator.tsx
        ├── MarketsSection.tsx
        ├── EcosystemAndAISection.tsx
        ├── VisionValuesSection.tsx
        ├── ContactAndFooter.tsx
        └── FloatingBriefingDock.tsx
```

---

## Prasyarat & Instalasi Lokal

1. Pastikan **Node.js** (disarankan v20 atau v22 ke atas) dan **npm** telah terpasang.
2. Pasang seluruh dependensi proyek:
   ```bash
   npm install
   ```
3. Salin file contoh konfigurasi lingkungan dan isi kunci API Gemini Anda (opsional jika hanya menjalankan tampilan profil, wajib untuk fitur *Research & Media Desk* dan *Audio Briefing*):
   ```bash
   cp .env.example .env
   ```
   Isi nilai `GEMINI_API_KEY` di dalam file `.env`.

4. Jalankan server pengembangan (berjalan pada port `3000`):
   ```bash
   npm run dev
   ```
   Buka browser dan akses `http://localhost:3000`.

---

## Build & Deploy Produksi

1. Jalankan pemeriksaan tipe TypeScript:
   ```bash
   npm run lint
   ```
2. Bangun berkas statis produksi ke folder `dist/`:
   ```bash
   npm run build
   ```
3. Jalankan server dalam mode produksi:
   ```bash
   NODE_ENV=production npm start
   ```
   Server mendengarkan di `0.0.0.0:3000` (atau sesuai variabel lingkungan `PORT`). Tersedia pula endpoint pemeriksaan kesehatan di `GET /api/health`.

> **Catatan**: Model berbayar tertentu di fitur *Visual Studio* dan penalaran lanjutan (`gemini-3-pro-image-preview`, `gemini-4-argon`, `gemini-4-carbon`) memerlukan `GEMINI_API_KEY` dari proyek dengan penagihan (*billing*) aktif.

---

## Penafian

Situs ini merupakan **profil perusahaan resmi bersifat informasional dan edukasional**. Konten, hasil simulasi kalkulator Zakat/bagi hasil, maupun contoh nama institusi atau bursa tidak merupakan nasihat investasi pribadi, layanan pialang (*brokerage*), eksekusi transaksi keuangan, ataupun penetapan fatwa kepatuhan Syariah secara otomatis.
