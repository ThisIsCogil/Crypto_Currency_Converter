# 💱 CryptoConverter

**CryptoConverter** adalah aplikasi web interaktif yang memungkinkan pengguna untuk melakukan konversi antar berbagai mata uang fiat dan mata uang kripto secara real-time. 
Aplikasi ini menggunakan data harga terkini dari [CoinGecko API](https://www.coingecko.com/) dan kurs fiat dari [ExchangeRate API](https://www.exchangerate-api.com/) untuk 
memberikan hasil konversi yang akurat dan up-to-date.

---

## ✨ Fitur Utama

* 🔄 **Konversi Dua Arah**: Mendukung konversi antar fiat-to-fiat, crypto-to-crypto, dan fiat-to-crypto.
* 📈 **Harga Kripto Realtime**: Menampilkan harga terkini dari berbagai kripto populer seperti BTC, ETH, DOGE, XRP, MATIC, AVAX, dan lainnya.
* 🌍 **Dukungan Multi-Mata Uang Fiat**: Termasuk USD, EUR, IDR, JPY, INR, CNY, dan masih banyak lagi.
* 💸 **Formatting Pintar**: Menampilkan hasil konversi dengan pemisah ribuan (`10,000.00`) dan format presisi untuk kripto.
* 🔃 **Tombol Swap Mata Uang**: Tukar posisi mata uang asal dan tujuan dengan animasi interaktif.
* ⏱️ **Update Otomatis**: Harga diperbarui secara berkala setiap 30 detik.
* 🗓️ **Waktu Update Dinamis**: Menampilkan waktu pembaruan terakhir secara real-time (contoh: "Last updated: 20s ago").
* 👟 **Kartu Kripto Interaktif**: Klik kartu kripto untuk langsung mengkonversi ke mata uang tersebut.
* 🎨 **Efek Visual Ringan**: Termasuk efek ketik logo dan animasi ringan pada ikon kripto.

---

## 💪 Teknologi yang Digunakan

* HTML5, CSS3, JavaScript (Vanilla)
* [CoinGecko API](https://www.coingecko.com/en/api) untuk harga kripto
* [ExchangeRate API](https://www.exchangerate-api.com/) untuk kurs fiat
* DOM Manipulation untuk interaktivitas dinamis
* Animasi ringan untuk UX yang lebih menarik

---

## 📦 Struktur File

```
├── icon.png
├── manifest.json
├── popup.html
├── popup.js
└── style.css
```

---

## 📌 Catatan

* API dapat mengalami limitasi atau keterlambatan pada permintaan data jika terlalu sering dipanggil.
* Pastikan koneksi internet aktif untuk mengambil data dari API eksternal.

---

## 🧑‍💻 Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request untuk peningkatan, bugfix, atau penambahan fitur baru.
