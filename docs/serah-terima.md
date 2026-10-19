# Serah terima: persiapan update kode TeGe TKA Sejarah

Tanggal: 19 Oktober 2026
Repo: iwaka91/TeGe_TKA_Sejarah

## Status

- Aplikasi v1.0.0 sudah dibangun dan sudah diuji di HP oleh Pak Toto (tampilan memuaskan, fitur bacakan berfungsi).
- Mockup versi 8 (Beranda baru dengan modal buku, Sertifikat dengan satu tanda tangan) ada di docs/mockup/.
- Belum ada kode baru. Kode baru baru dibangun setelah perintah "Gas kode" atau "Update Kode".

## Keputusan final untuk update kode (satu paket, versi 1.1.0)

1. **Beranda:** petunjuk "Ketuk satu buku di rak untuk mulai belajar". Rak kayu satu baris dengan buku miring 3D. Kartu "Buku dipilih" dihapus.
2. **Modal buku:** sampul keluar dengan zoom out lembut setelah buku menghadap depan (sekitar 0,5 detik). Isinya judul, periode, ringkasan singkat, jumlah tema dan soal, status, dan tombol "Mulai Belajar" (atau "Lanjutkan Belajar" bila sudah ada progres).
3. **Unduh PDF pindah ke Pengaturan:** modal dengan keterangan "untuk pengalaman belajar dengan file PDF atau print out A4", daftar Buku 1 sampai 5 dengan estimasi MB, "Unduh semua (5 buku)" dalam satu berkas ZIP sekitar 2,8 MB, dan "Bagikan link PDF" (Web Share API, cadangan salin tautan).
4. **Sertifikat PNG** per buku. Syarat: semua materi dibuka, 20 soal latihan selesai, skor minimal 70%. Isi: nama lengkap, kelas, sekolah (jika diisi), buku, tanggal, skor, nomor dan kode verifikasi, tanda tangan satu (Pengembang: Toto Gutomo, S.Pd., Gr., M.Pd., CPSS), footer "TeGe TKA Sejarah disusun oleh Toto Gutomo bersama Ikrimah Laily", dan tulisan "bukan sertifikat resmi dan bukan pengganti TKA". Tidak ada NIP.
5. **Suara efek** saat klik buku dan saat "Mulai Belajar" (Web Audio API, tanpa berkas suara). Ada saklar "Suara efek" di Pengaturan.
6. **Dialog "Lanjutkan dari halaman terakhir?"** muncul sekali per pembukaan aplikasi, hanya bila ada latihan atau simulasi yang belum selesai. Pilihan: "Lanjutkan" atau "Ke Beranda".
7. **Identitas di Pengaturan:** nama lengkap (bukan nama panggilan) dan kelas wajib; sekolah opsional. Diminta saat unduh sertifikat bila kosong. Nama sekolah tampil bila diisi. Keterangan keamanan di About: data hanya tersimpan di HP, tidak dikirim ke server, dan keluar hanya jika siswa sendiri menekan bagikan atau kirim.
8. **Rekap progres ke WhatsApp** dari Pengaturan. Nomor WA guru diketik siswa (tidak ditanam di aplikasi). Isi pesan: pengantar, nama, kelas (dan sekolah), progres Buku 1 sampai 5 (materi, latihan, simulasi, status sertifikat), dan kode verifikasi format TG-XXXX-XXXX. WhatsApp tidak bisa terkirim otomatis; siswa menekan kirim. Pesan wajib memuat catatan: "Kode verifikasi: TG-XXXX-XXXX. Kode dihitung otomatis dari isi rekap ini. Jika ada angka yang diubah, kode tidak akan cocok. Guru dapat memeriksanya di Mode Guru TeGe TKA Sejarah." Catatan yang sama ada di Mode Guru.
9. **Mode Guru** di Pengaturan dengan PIN `sejarah170845`. PIN tidak ditampilkan di layar. Keterangan di layar: "Untuk akses Mode Guru, silakan hubungi pengembang." Surel pengembang: totogutomo92@gmail.com. Mode Guru hanya untuk memeriksa rekap dan kode sertifikat.
10. **About:** tetap memuat "Guru SMA Negeri 3 Maliku" di bawah nama pembuat (aturan About). Sertifikat tidak memuatnya.

## Catatan teknis dan batasan

- Tanpa server, PIN dan kunci kode ada di dalam kode aplikasi. Ini pencegah kecurangan ringan, bukan keamanan sungguhan.
- Font Playfair Display dan Plus Jakarta Sans sudah ada di fonts/. Pemasangan lewat @font-face di css/app.css dilakukan saat update kode (kode belum diubah).
- Footer sertifikat di mockup terpotong. Perbaikan di aplikasi wajib dibuat; mockup diperbaiki pada perintah "Update Mockup" berikutnya.
- Sumber buku: sebagian tautan referensi di soal memakai "(topik terkait)" pada soal yang sumbernya kurang cocok. Pak Toto sudah memeriksa tautan.

## Langkah berikutnya

1. Perintah "Gas kode" dari Pak Toto.
2. Bangun v1.1.0 di repo ini. Naikkan versi di js/version.js dan sw.js. Ubah hanya bagian yang disebut di atas.
3. Uji di HP dan laptop, lalu kemas zip final. Jika lolos, publish di Netlify.
