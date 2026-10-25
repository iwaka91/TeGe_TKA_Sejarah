/* TeGe TKA Sejarah - alat bantu: kode verifikasi, berkas ZIP, suara efek.
   Catatan: aplikasi ini tanpa server, jadi kunci kode ada di dalam kode ini.
   Kode verifikasi adalah pencegah kecurangan ringan, bukan keamanan sungguhan. */
(function () {
'use strict';

var KUNCI = 'tg-tka-sejarah|kunci-ringan|v1';
var ABJAD = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
var PIN_HASH = '0XHTQVBYDB';

/* ---------- hash 128-bit (cyrb128) ---------- */
function cyrb128(str) {
  var h1 = 1779033703, h2 = 3144134277, h3 = 1013904242, h4 = 2773480762;
  for (var i = 0, k; i < str.length; i++) {
    k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }
  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
  h1 ^= (h2 ^ h3 ^ h4); h2 ^= h1; h3 ^= h1; h4 ^= h1;
  return [h1 >>> 0, h2 >>> 0, h3 >>> 0, h4 >>> 0];
}
/* ubah hash menjadi n huruf/angka (tanpa huruf yang mudah tertukar), n paling banyak 25 */
function huruf(str, n) {
  var w = cyrb128(KUNCI + '|' + str), bits = '', out = '', i;
  for (i = 0; i < 4; i++) { var s = w[i].toString(2); bits += new Array(33 - s.length).join('0') + s; }
  for (i = 0; i < n && i < 25; i++) out += ABJAD.charAt(parseInt(bits.substr(i * 5, 5), 2));
  return out;
}
function rapi(s) {
  var t = String(s == null ? '' : s);
  if (t.normalize) t = t.normalize('NFC');
  return t.replace(/[​-‏‪-‮⁠﻿]/g, '').replace(/[\s ]+/g, ' ').trim();
}
function norm(s) { return rapi(s).toLowerCase(); }
function grup(a, ukuran) { var o = []; for (var i = 0; i < a.length; i += ukuran) o.push(a.substr(i, ukuran)); return o; }

/* ---------- kode rekap: TG-XXXX-XXXX ---------- */
function kodeRekap(badan) {
  var baris = String(badan).split(/\r?\n/).map(norm).filter(Boolean).join('\n');
  var a = huruf('rekap|' + baris, 8);
  return 'TG-' + a.substr(0, 4) + '-' + a.substr(4, 4);
}
/* cari rekap di teks tempelan (boleh ada awalan dari WhatsApp), lalu periksa kodenya */
function periksaRekap(teks) {
  var t = String(teks || '').replace(/\r/g, '');
  var mulai = t.search(/rekap belajar tege tka sejarah/i);
  if (mulai < 0) return { ada: false, alasan: 'awal' };
  t = t.slice(mulai);
  var m = /kode verifikasi:\s*(TG-[0-9A-Z]{4}-[0-9A-Z]{4})/i.exec(t);
  if (!m) return { ada: false, alasan: 'kode' };
  var badan = t.slice(0, m.index), tulis = m[1].toUpperCase(), hitung = kodeRekap(badan);
  return { ada: true, cocok: tulis === hitung, tulis: tulis, hitung: hitung, badan: badan };
}

/* ---------- kode sertifikat: TG<buku>-XXXX-XXXX-XXXX-XXXX-XXXX ---------- */
function kodeSert(d) {
  var s = ['sert', d.buku, norm(d.nama), norm(d.kelas), norm(d.sekolah), d.benar, d.total, d.tgl, norm(d.nomor).toUpperCase()].join('|');
  var a = huruf(s, 20);
  return 'TG' + d.buku + '-' + grup(a, 4).join('-');
}
function samaKode(a, b) {
  var x = String(a || '').toUpperCase().replace(/[^0-9A-Z]/g, ''), y = String(b || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
  return x.length > 0 && x === y;
}

/* ---------- PIN Mode Guru (hanya hash yang disimpan) ---------- */
function hashPin(pin) { return huruf('pin|' + String(pin == null ? '' : pin).trim(), 10); }
function cekPin(pin) { return hashPin(pin) === PIN_HASH; }

/* ---------- berkas ZIP (tanpa kompresi; PDF sudah terkompresi) ---------- */
var tabelCrc = null;
function crc32(u8) {
  if (!tabelCrc) {
    tabelCrc = [];
    for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); tabelCrc[n] = c >>> 0; }
  }
  var crc = 0xFFFFFFFF;
  for (var i = 0; i < u8.length; i++) crc = tabelCrc[(crc ^ u8[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}
function u16(v) { return [v & 255, (v >>> 8) & 255]; }
function u32(v) { return [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255]; }
function utf8(s) {
  if (typeof TextEncoder !== 'undefined') return new TextEncoder().encode(s);
  var e = unescape(encodeURIComponent(s)), a = new Uint8Array(e.length);
  for (var i = 0; i < e.length; i++) a[i] = e.charCodeAt(i);
  return a;
}
/* files: [{ nama: 'a.pdf', data: Uint8Array }] -> Blob */
function buatZip(files, waktu) {
  var d = waktu || new Date();
  var jam = ((d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1)) & 0xFFFF;
  var tgl = (((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate()) & 0xFFFF;
  var bagian = [], pusat = [], offset = 0;
  files.forEach(function (f) {
    var nama = utf8(f.nama), crc = crc32(f.data), ukuran = f.data.length;
    var lokal = new Uint8Array([].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(jam), u16(tgl), u32(crc), u32(ukuran), u32(ukuran), u16(nama.length), u16(0)));
    bagian.push(lokal, nama, f.data);
    pusat.push(new Uint8Array([].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(jam), u16(tgl), u32(crc), u32(ukuran), u32(ukuran), u16(nama.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset))), nama);
    offset += lokal.length + nama.length + ukuran;
  });
  var ukPusat = 0; pusat.forEach(function (p) { ukPusat += p.length; });
  var akhir = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(files.length), u16(files.length), u32(ukPusat), u32(offset), u16(0)));
  return new Blob(bagian.concat(pusat, [akhir]), { type: 'application/zip' });
}

/* ---------- suara efek (Web Audio API, tanpa berkas suara) ---------- */
var ctx = null;
function audio() {
  try {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    if (!ctx) ctx = new AC();
    if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
    return ctx;
  } catch (e) { return null; }
}
function nada(c, jenis, f0, f1, t0, dur, vol) {
  var o = c.createOscillator(), g = c.createGain();
  o.type = jenis; o.frequency.setValueAtTime(f0, t0);
  if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0 + dur + 0.03);
}
function desis(c, t0, dur, vol) {
  var n = Math.max(1, Math.floor(c.sampleRate * dur)), buf = c.createBuffer(1, n, c.sampleRate), x = buf.getChannelData(0);
  for (var i = 0; i < n; i++) x[i] = (Math.random() * 2 - 1) * (1 - i / n);
  var s = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
  s.buffer = buf; f.type = 'bandpass'; f.frequency.value = 1500; f.Q.value = 0.8;
  g.gain.setValueAtTime(vol, t0); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(f); f.connect(g); g.connect(c.destination);
  s.start(t0);
}
/* ketukan kayu lembut + desis halaman, saat buku di rak diketuk */
function sfxBuku() {
  var c = audio(); if (!c) return;
  try { var t = c.currentTime; nada(c, 'sine', 210, 95, t, 0.14, 0.2); desis(c, t + 0.03, 0.16, 0.07); } catch (e) { /* abaikan */ }
}
/* tiga nada naik singkat, saat Mulai Belajar */
function sfxMulai() {
  var c = audio(); if (!c) return;
  try { var t = c.currentTime; [523.25, 659.25, 783.99].forEach(function (f, i) { nada(c, 'triangle', f, f, t + i * 0.09, 0.22, 0.11); }); } catch (e) { /* abaikan */ }
}

window.TG_ALAT = {
  rapi: rapi, norm: norm,
  kodeRekap: kodeRekap, periksaRekap: periksaRekap,
  kodeSert: kodeSert, samaKode: samaKode,
  hashPin: hashPin, cekPin: cekPin,
  buatZip: buatZip, crc32: crc32,
  sfxBuku: sfxBuku, sfxMulai: sfxMulai
};
})();
