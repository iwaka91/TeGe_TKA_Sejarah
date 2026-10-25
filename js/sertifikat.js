/* TeGe TKA Sejarah - menggambar sertifikat penyelesaian (PNG) dengan canvas.
   Tata letak mengikuti mockup Sertifikat (842 x 595), semua posisi tetap
   sehingga bagian bawah (kode dan keterangan) tidak pernah terpotong. */
(function () {
'use strict';

var W = 842, H = 595;
var MAROON = '#5B0F1F', MAROON_M = '#7A1528', GOLD = '#B8893A', GOLD_L = '#E8C987';
var BG = '#F6EBD5', CARD = '#FFF8E8', INK = '#2A1A16', MUT = '#6B5448', BD = '#E2CFA6';
var SERIF = '"Playfair Display", Georgia, "Times New Roman", serif';
var SANS = '"Plus Jakarta Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';
var BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

function tglTeks(ms) { var d = new Date(ms); return d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear(); }

/* pastikan huruf sudah termuat sebelum menggambar */
function siapkanFont() {
  if (typeof document === 'undefined' || !document.fonts || !document.fonts.load) return Promise.resolve();
  var contoh = 'AaBb Éé 0123';
  var daftar = ['700 38px "Playfair Display"', 'italic 600 34px "Playfair Display"', '400 14px "Plus Jakarta Sans"', '700 14px "Plus Jakarta Sans"'];
  return Promise.all(daftar.map(function (s) { return document.fonts.load(s, contoh); })).then(function () { }, function () { });
}

function huruf(ctx, gaya, ukuran, fam) { ctx.font = gaya + ' ' + ukuran + 'px ' + fam; }
function lebarTeks(ctx, t) { return ctx.measureText(t).width; }

/* kecilkan huruf sampai muat; bila masih lebar, potong dengan "..." */
function muatkan(ctx, t, gaya, awal, minim, fam, maks) {
  var u = awal;
  huruf(ctx, gaya, u, fam);
  while (u > minim && lebarTeks(ctx, t) > maks) { u -= 1; huruf(ctx, gaya, u, fam); }
  if (lebarTeks(ctx, t) > maks) {
    while (t.length > 1 && lebarTeks(ctx, t + '...') > maks) t = t.slice(0, -1);
    t = t.replace(/\s+$/, '') + '...';
  }
  return t;
}
function tengah(ctx, t, cx, y) { ctx.textAlign = 'center'; ctx.fillText(t, cx, y); }
function teksSpasi(ctx, t, cx, y, sp) {
  var i, ws = [], total = 0;
  for (i = 0; i < t.length; i++) { ws[i] = lebarTeks(ctx, t.charAt(i)); total += ws[i] + (i < t.length - 1 ? sp : 0); }
  var x = cx - total / 2; ctx.textAlign = 'left';
  for (i = 0; i < t.length; i++) { ctx.fillText(t.charAt(i), x, y); x += ws[i] + sp; }
}
function kotak(ctx, x, y, w, h, tl, tr, br, bl) {
  ctx.beginPath();
  ctx.moveTo(x + tl, y); ctx.lineTo(x + w - tr, y); ctx.arcTo(x + w, y, x + w, y + tr, tr);
  ctx.lineTo(x + w, y + h - br); ctx.arcTo(x + w, y + h, x + w - br, y + h, br);
  ctx.lineTo(x + bl, y + h); ctx.arcTo(x, y + h, x, y + h - bl, bl);
  ctx.lineTo(x, y + tl); ctx.arcTo(x, y, x + tl, y, tl); ctx.closePath();
}

/* bungkus teks berisi bagian tebal; segmen: [{ t: 'teks', b: true|false }] */
function bungkus(ctx, segmen, maks, ukuran) {
  var kata = [], baris = [], cur = [], lebar = 0;
  segmen.forEach(function (s) { s.t.split(/\s+/).forEach(function (w) { if (w) kata.push({ t: w, b: !!s.b }); }); });
  huruf(ctx, '400', ukuran, SANS); var sp = lebarTeks(ctx, ' ');
  kata.forEach(function (k) {
    huruf(ctx, k.b ? '700' : '400', ukuran, SANS);
    var w = lebarTeks(ctx, k.t), tambah = cur.length ? sp + w : w;
    if (cur.length && lebar + tambah > maks) { baris.push({ kata: cur, lebar: lebar }); cur = [{ t: k.t, b: k.b, w: w }]; lebar = w; }
    else { cur.push({ t: k.t, b: k.b, w: w }); lebar += tambah; }
  });
  if (cur.length) baris.push({ kata: cur, lebar: lebar });
  return { baris: baris, sp: sp };
}
function gambarBaris(ctx, bar, sp, x, y, ukuran, tengahX) {
  var mulai = tengahX != null ? tengahX - bar.lebar / 2 : x;
  ctx.textAlign = 'left';
  bar.kata.forEach(function (k, i) {
    huruf(ctx, k.b ? '700' : '400', ukuran, SANS);
    ctx.fillText(k.t, mulai, y); mulai += k.w + (i < bar.kata.length - 1 ? sp : 0);
  });
}

/* d: { buku, judul, warna, nama, kelas, sekolah, benar, total, tgl (ms), nomor, kode, cover (Image atau null) } */
function gambar(canvas, d, skala) {
  skala = skala || 2;
  canvas.width = W * skala; canvas.height = H * skala;
  var ctx = canvas.getContext('2d'), cx = W / 2, i;
  ctx.setTransform(skala, 0, 0, skala, 0, 0);
  ctx.imageSmoothingEnabled = true; if ('imageSmoothingQuality' in ctx) ctx.imageSmoothingQuality = 'high';
  ctx.textBaseline = 'alphabetic';

  /* latar dan bingkai */
  ctx.fillStyle = BG; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = MAROON; ctx.lineWidth = 3; ctx.strokeRect(11.5, 11.5, W - 23, H - 23);
  ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5; ctx.strokeRect(18.75, 18.75, W - 37.5, H - 37.5);
  ctx.lineWidth = 4; ctx.beginPath();
  ctx.moveTo(26, 58); ctx.lineTo(26, 26); ctx.lineTo(58, 26);
  ctx.moveTo(W - 58, 26); ctx.lineTo(W - 26, 26); ctx.lineTo(W - 26, 58);
  ctx.moveTo(26, H - 58); ctx.lineTo(26, H - 26); ctx.lineTo(58, H - 26);
  ctx.moveTo(W - 58, H - 26); ctx.lineTo(W - 26, H - 26); ctx.lineTo(W - 26, H - 58);
  ctx.stroke();

  /* logo dan nama aplikasi */
  huruf(ctx, '700', 18, SERIF);
  var nm = 'TeGe TKA Sejarah', wNm = lebarTeks(ctx, nm), gx = cx - (38 + 10 + wNm) / 2;
  kotak(ctx, gx + 1, 33, 36, 36, 10, 10, 10, 10); ctx.fillStyle = MAROON; ctx.fill();
  ctx.strokeStyle = GOLD; ctx.lineWidth = 2; ctx.stroke();
  huruf(ctx, '700', 14, SERIF); ctx.fillStyle = GOLD_L; tengah(ctx, 'TG', gx + 19, 56);
  huruf(ctx, '700', 18, SERIF); ctx.fillStyle = MAROON; ctx.textAlign = 'left'; ctx.fillText(nm, gx + 48, 57);

  /* judul */
  var judul = 'SERTIFIKAT PENYELESAIAN', ju = 38;
  huruf(ctx, '700', ju, SERIF);
  while (ju > 24 && lebarTeks(ctx, judul) + 3 * (judul.length - 1) > 700) { ju -= 1; huruf(ctx, '700', ju, SERIF); }
  ctx.fillStyle = MAROON; teksSpasi(ctx, judul, cx, 113, 3);
  var g = ctx.createLinearGradient(cx - 110, 0, cx + 110, 0);
  g.addColorStop(0, 'rgba(184,137,58,0)'); g.addColorStop(0.5, GOLD); g.addColorStop(1, 'rgba(184,137,58,0)');
  ctx.fillStyle = g; ctx.fillRect(cx - 110, 129, 220, 2);

  /* penerima */
  huruf(ctx, '400', 13, SANS); ctx.fillStyle = MUT; tengah(ctx, 'diberikan kepada', cx, 152);
  var nama = muatkan(ctx, d.nama, 'italic 600', 34, 20, SERIF, 700);
  ctx.fillStyle = INK; tengah(ctx, nama, cx, 195);
  var kelas = String(d.kelas || '').replace(/^\s*kelas\s+/i, '');
  var barisKelas = 'Kelas ' + kelas + (d.sekolah ? ' · ' + d.sekolah : '');
  barisKelas = muatkan(ctx, barisKelas, '700', 14, 10, SANS, 700);
  ctx.fillStyle = INK; tengah(ctx, barisKelas, cx, 221);

  /* sampul dan kalimat penyelesaian */
  var kiri = cx - (70 + 16 + 520) / 2, atas = 240, cw = 70, ch = 98;
  ctx.save(); kotak(ctx, kiri, atas, cw, ch, 3, 6, 6, 3); ctx.clip();
  if (d.cover) { ctx.drawImage(d.cover, kiri, atas, cw, ch); }
  else {
    var gc = ctx.createLinearGradient(kiri, atas, kiri + cw, atas + ch); gc.addColorStop(0, d.warna || MAROON); gc.addColorStop(1, '#1A0D08');
    ctx.fillStyle = gc; ctx.fillRect(kiri, atas, cw, ch);
    huruf(ctx, '700', 9, SANS); ctx.fillStyle = GOLD_L; tengah(ctx, 'BUKU ' + d.buku, kiri + cw / 2, atas + ch / 2 + 3);
  }
  ctx.restore();
  kotak(ctx, kiri + 0.5, atas + 0.5, cw - 1, ch - 1, 3, 6, 6, 3); ctx.strokeStyle = GOLD; ctx.lineWidth = 1; ctx.stroke();
  var ukK = 14, lh = 21.7;
  var bk = bungkus(ctx, [
    { t: 'telah menyelesaikan ' },
    { t: 'Buku ' + d.buku + ': ' + d.judul, b: true },
    { t: ' dalam program persiapan TKA Sejarah: membaca seluruh materi singkat dan mengerjakan ' + d.total + ' soal latihan dengan hasil yang memenuhi syarat penyelesaian.' }
  ], 520, ukK);
  var tinggiK = bk.baris.length * lh, awalK = atas + Math.max(0, (ch - tinggiK) / 2);
  ctx.fillStyle = INK;
  for (i = 0; i < bk.baris.length; i++) gambarBaris(ctx, bk.baris[i], bk.sp, kiri + cw + 16, awalK + i * lh + 15, ukK);
  var bawahRow = Math.max(atas + ch, awalK + tinggiK);

  /* skor, tanggal, nomor */
  var pct = d.total ? Math.round(d.benar * 100 / d.total) : 0;
  var kotakData = [['SKOR', d.benar + ' / ' + d.total + ' · ' + pct + '%'], ['TANGGAL', tglTeks(d.tgl)], ['NOMOR', d.nomor]];
  var bw = 176, bg = 12, bx = cx - (3 * bw + 2 * bg) / 2, by = bawahRow + 12;
  kotakData.forEach(function (k, n) {
    var x = bx + n * (bw + bg);
    kotak(ctx, x + 0.75, by + 0.75, bw - 1.5, 52, 10, 10, 10, 10); ctx.fillStyle = CARD; ctx.fill();
    ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5; ctx.stroke();
    huruf(ctx, '700', 9.5, SANS); ctx.fillStyle = MAROON_M;
    ctx.textAlign = 'left'; var lab = k[0], lx = x + 10;
    for (var j = 0; j < lab.length; j++) { ctx.fillText(lab.charAt(j), lx, by + 18); lx += lebarTeks(ctx, lab.charAt(j)) + 1.2; }
    var v = muatkan(ctx, k[1], '700', 20, 12, SERIF, bw - 20);
    ctx.fillStyle = INK; ctx.textAlign = 'left'; ctx.fillText(v, x + 10, by + 43);
  });

  /* tanda tangan (satu) */
  var sx = 472, sw = 260, sy = 486;
  ctx.fillStyle = INK; ctx.fillRect(sx, sy, sw, 1.5);
  huruf(ctx, '700', 13, SANS); tengah(ctx, 'Toto Gutomo, S.Pd., Gr., M.Pd., CPSS', sx + sw / 2, sy + 19);
  huruf(ctx, '400', 11.5, SANS); ctx.fillStyle = MUT; tengah(ctx, 'Pengembang TeGe TKA Sejarah', sx + sw / 2, sy + 33);

  /* kaki: kode, keterangan, hak cipta (selalu di dalam bingkai) */
  ctx.fillStyle = BD; ctx.fillRect(70, 531, W - 140, 1);
  var uk = 9.5;
  var seg = [{ t: 'Kode verifikasi: ' }, { t: d.kode, b: true }, { t: ' · Guru dapat memeriksanya di Mode Guru.' }];
  var tot = 0; seg.forEach(function (s) { huruf(ctx, s.b ? '700' : '400', uk, SANS); s.w = lebarTeks(ctx, s.t); tot += s.w; });
  var fx = cx - tot / 2; ctx.fillStyle = MUT; ctx.textAlign = 'left';
  seg.forEach(function (s) { huruf(ctx, s.b ? '700' : '400', uk, SANS); ctx.fillText(s.t, fx, 544); fx += s.w; });
  huruf(ctx, '400', uk, SANS);
  tengah(ctx, 'Sertifikat penyelesaian latihan, bukan sertifikat resmi dan bukan pengganti TKA.', cx, 556);
  tengah(ctx, 'TeGe TKA Sejarah disusun oleh Toto Gutomo bersama Ikrimah Laily · TeGe TKA Sejarah ©2026 | totogutomo.com', cx, 568);
  return canvas;
}

window.TG_SERT = { W: W, H: H, gambar: gambar, siapkanFont: siapkanFont, tglTeks: tglTeks };
})();
