/* TeGe TKA Sejarah - logika aplikasi (HTML, CSS, JavaScript murni) */
(function () {
'use strict';

var BUKU = window.TG_BUKU, SOAL = window.TG_SOAL, MATERI = window.TG_MATERI;
var VER = window.TG_VERSION || '1.0.0';
var PDFKB = [410, 655, 681, 573, 493];
var KEY = 'tg-tka-sejarah-v1';
var MODES = { latihan: 'Latihan soal', simulasi: 'Simulasi berwaktu', ulang: 'Ulangi yang salah', tema: 'Latihan per tema', tandai: 'Soal ditandai' };
var MUTLAK = /\b(semua|seluruh|selalu|pasti|hanya|satu-satunya|tidak pernah|sepenuhnya|otomatis|mutlak|selamanya|sama sekali)\b/gi;
var DETIK_PER_SOAL = 90;

/* ---------- util ---------- */
function $(s, r) { return (r || document).querySelector(s); }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function hl(t) { return S.set.waspada ? t.replace(MUTLAK, '<mark class="w">$1</mark>') : t; }
function pad(n) { return n < 10 ? '0' + n : '' + n; }
function mmss(ms) { var s = Math.max(0, Math.round(ms / 1000)); return pad(Math.floor(s / 60)) + ':' + pad(s % 60); }
function domain(u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } }
function wiki(t) { return 'https://id.wikipedia.org/wiki/Special:Search?search=' + encodeURIComponent(t) + '&go=Go'; }
function tgl(ts) { var d = new Date(ts); return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear(); }

var I = {
  back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  gear: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/></svg>',
  spk: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16.5 9a4 4 0 0 1 0 6"/><path d="M19 6.5a8 8 0 0 1 0 11"/></svg>',
  stop: '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9H4z"/><rect x="16" y="9" width="5" height="6" rx="1"/></svg>',
  dl: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v10M8 10l4 4 4-4M5 19h14"/></svg>',
  ext: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>',
  flag: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
  chev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>',
  chevl: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg>',
  x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".6" fill="currentColor"/></svg>',
  wa: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 1-13.4 7.8L3 21l1.3-4.4A9 9 0 1 1 21 12z"/></svg>',
  bulb: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/></svg>'
};

/* ---------- penyimpanan ---------- */
var S, memOnly = false, saveT = 0;
function load() {
  var raw = null;
  try { raw = JSON.parse(localStorage.getItem(KEY)); } catch (e) { raw = null; }
  S = (raw && raw.v === 1 && raw.buku) ? raw : { v: 1, set: {}, buku: {} };
  S.set = Object.assign({ tema: 'terang', fs: 1, tampil: 'tiap', gerak: false, waspada: true, nama: '', pilih: 1 }, S.set || {});
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); }
  catch (e) { if (!memOnly) { memOnly = true; toast('Penyimpanan di HP ini tidak tersedia. Kemajuan belajar tidak akan tersimpan.'); } }
}
function saveSoon() { clearTimeout(saveT); saveT = setTimeout(save, 400); }
function bk(b) { var o = S.buku[b]; if (!o) { o = S.buku[b] = { runs: {}, flags: [], terbaik: null }; } if (!o.runs) o.runs = {}; if (!o.flags) o.flags = []; return o; }
function applyPrefs() {
  var h = document.documentElement;
  h.setAttribute('data-tema', S.set.tema === 'gelap' ? 'gelap' : 'terang');
  h.style.setProperty('--fs', String(FS[S.set.fs] ? FS[S.set.fs].v : 1));
  if (S.set.gerak) h.setAttribute('data-gerak', 'kurang'); else h.removeAttribute('data-gerak');
  var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', S.set.tema === 'gelap' ? '#3E0A15' : '#5B0F1F');
}
var FS = [{ v: 0.9, n: 'Kecil' }, { v: 1, n: 'Sedang' }, { v: 1.12, n: 'Besar' }, { v: 1.25, n: 'Lebih besar' }, { v: 1.4, n: 'Paling besar' }];

/* ---------- toast, modal ---------- */
var toastT;
function toast(msg) {
  var t = $('#toast'); if (!t) return;
  t.textContent = msg; t.hidden = false; clearTimeout(toastT);
  toastT = setTimeout(function () { t.hidden = true; }, 4200);
}
var modalEl = null, lastFocus = null, confirmCb = null;
function openModal(html) {
  closeModal();
  var o = document.createElement('div'); o.className = 'ovl';
  o.innerHTML = '<div class="dlg" role="dialog" aria-modal="true">' + html + '</div>';
  o.addEventListener('click', function (e) { if (e.target === o) closeModal(); });
  lastFocus = document.activeElement;
  document.body.appendChild(o); modalEl = o; document.body.style.overflow = 'hidden';
  var f = o.querySelector('[data-focus]') || o.querySelector('button,a'); if (f) f.focus();
}
function closeModal() {
  if (!modalEl) return;
  modalEl.remove(); modalEl = null; document.body.style.overflow = '';
  if (lastFocus && lastFocus.focus) try { lastFocus.focus(); } catch (e) { /* abaikan */ }
}
function confirmBox(msg, okLabel, cb) {
  confirmCb = cb;
  openModal('<p style="font-size:1rem">' + esc(msg) + '</p><div class="row"><button class="btn" data-act="mno" data-focus>Batal</button><button class="btn pri" data-act="mok">' + esc(okLabel) + '</button></div>');
}

/* ---------- bacakan (Web Speech API) ---------- */
var tts = { on: false, q: [], i: 0, voice: null };
function ttsBtnState() {
  document.querySelectorAll('[data-act="tts"]').forEach(function (b) {
    b.setAttribute('aria-pressed', tts.on ? 'true' : 'false');
    b.setAttribute('aria-label', tts.on ? 'Berhenti membacakan' : 'Bacakan halaman ini');
    b.innerHTML = tts.on ? I.stop : I.spk;
  });
}
function ttsStop() {
  if (!tts.on) { return; }
  tts.on = false;
  try { window.speechSynthesis.cancel(); } catch (e) { /* abaikan */ }
  ttsBtnState();
}
function pageText() {
  var root = $('#page'); if (!root) return '';
  var box = document.createElement('div');
  box.style.cssText = 'position:fixed;left:-99999px;top:0;width:640px;';
  var c = root.cloneNode(true);
  c.removeAttribute('id');
  c.querySelectorAll('.no-tts,button,svg,textarea,input,script,style,nav').forEach(function (e) { e.remove(); });
  box.appendChild(c); document.body.appendChild(box);
  var t = c.innerText || c.textContent || '';
  box.remove();
  return t.replace(/[↗›✓✗]/g, ' ').replace(/https?:\/\/\S+/g, ' ');
}
function chunks(text) {
  var parts = text.split(/\n+/).map(function (s) { return s.trim(); }).filter(Boolean), out = [];
  parts.forEach(function (p) {
    var sent = p.match(/[^.!?;:]+[.!?;:]*\s*/g) || [p], cur = '';
    sent.forEach(function (s) {
      s = s.trim(); if (!s) return;
      if ((cur + ' ' + s).length > 190 && cur) { out.push(cur); cur = s; } else { cur = cur ? cur + ' ' + s : s; }
    });
    if (cur) out.push(cur);
  });
  return out;
}
function pickVoice() {
  var vs = window.speechSynthesis.getVoices() || [];
  var id = vs.filter(function (v) { return /^(id|in)([-_]|$)/i.test(v.lang); });
  return { all: vs.length, voice: id[0] || null };
}
function ttsStart() {
  if (!('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') { toast('Peramban ini belum mendukung fitur bacakan.'); return; }
  var go = function () {
    var v = pickVoice();
    if (v.all > 0 && !v.voice) { toast('Suara bahasa Indonesia belum tersedia di HP ini. Pasang suara Indonesia lewat pengaturan teks-ke-suara HP, lalu coba lagi.'); return; }
    var q = chunks(pageText());
    if (!q.length) { toast('Tidak ada teks untuk dibacakan.'); return; }
    tts.q = q; tts.i = 0; tts.voice = v.voice; tts.on = true; ttsBtnState();
    try { window.speechSynthesis.cancel(); } catch (e) { /* abaikan */ }
    next();
  };
  var next = function () {
    if (!tts.on) return;
    if (tts.i >= tts.q.length) { tts.on = false; ttsBtnState(); return; }
    var u = new SpeechSynthesisUtterance(tts.q[tts.i++]);
    u.lang = 'id-ID'; if (tts.voice) u.voice = tts.voice; u.rate = 0.95;
    u.onend = next;
    u.onerror = function (e) { if (e && (e.error === 'canceled' || e.error === 'interrupted')) return; tts.on = false; ttsBtnState(); toast('Bacakan berhenti karena ada kendala pada suara HP.'); };
    window.speechSynthesis.speak(u);
  };
  if ((window.speechSynthesis.getVoices() || []).length === 0) {
    var done = false, f = function () { if (done) return; done = true; go(); };
    window.speechSynthesis.addEventListener('voiceschanged', f, { once: true });
    setTimeout(f, 900);
  } else go();
}

/* ---------- logika soal ---------- */
function temaOf(b, no) { var m = MATERI[b]; for (var i = 0; i < m.length; i++) if (m[i].qs.indexOf(no) >= 0) return i; return 0; }
function nilai(q, sel) {
  if (q.tipe === 'PG') return sel === q.kunci[0];
  if (q.tipe === 'MC') return (sel || []).slice().sort().join('') === q.kunci.slice().sort().join('');
  var ok = true; q.kunci.forEach(function (v, i) { if (!sel || sel[i] !== v) ok = false; }); return ok;
}
function lengkap(q, sel) {
  if (q.tipe === 'PG') return !!sel;
  if (q.tipe === 'MC') return !!(sel && sel.length);
  var ok = !!sel; q.kunci.forEach(function (v, i) { if (!sel || !sel[i]) ok = false; }); return ok;
}
function stats(run) {
  var s = { benar: 0, salah: 0, kosong: 0, total: run.order.length };
  run.order.forEach(function (no) { var a = run.ans[no]; if (!a || !a.lock) s.kosong++; else if (a.ok) s.benar++; else s.salah++; });
  s.pct = s.total ? Math.round(s.benar * 100 / s.total) : 0;
  return s;
}
function startRun(b, mode, order) {
  var r = { order: order, idx: 0, ans: {}, mulai: Date.now(), selesai: false };
  if (mode === 'simulasi') r.batas = order.length * DETIK_PER_SOAL * 1000;
  bk(b).runs[mode] = r; save(); return r;
}
function range(n) { var a = []; for (var i = 1; i <= n; i++) a.push(i); return a; }
function finishRun(b, mode) {
  var run = bk(b).runs[mode]; if (!run || run.selesai) return;
  run.selesai = true; run.akhir = Date.now();
  var s = stats(run);
  if (mode === 'latihan') { var t = bk(b).terbaik; if (!t || s.benar > t.benar) bk(b).terbaik = { benar: s.benar, total: s.total, tgl: Date.now() }; }
  save();
}
function remaining(run) { return run.batas ? run.mulai + run.batas - Date.now() : null; }

/* ---------- komponen tampilan ---------- */
function appbar(o) {
  var left = o.back ? '<a class="ib" href="' + o.back + '" aria-label="Kembali">' + I.back + '</a>' : (o.backAct ? '<button class="ib" data-act="back" aria-label="Kembali">' + I.back + '</button>' : '');
  var prog = typeof o.prog === 'number' ? '<div class="bar-prog" aria-hidden="true"><i style="width:' + o.prog + '%"></i></div>' : '';
  return '<div class="barwrap no-tts"><header class="bar">' + left +
    '<div class="bt"><div class="bt1">' + esc(o.title) + '</div>' + (o.sub ? '<div class="bt2">' + esc(o.sub) + '</div>' : '') + '</div>' +
    (o.timer ? '<span class="tm" id="tm" role="timer" aria-label="Sisa waktu">' + o.timer + '</span>' : '') +
    '<button class="ib" data-act="tts" aria-pressed="false" aria-label="Bacakan halaman ini">' + I.spk + '</button>' +
    (o.gear === false ? '' : '<a class="ib" href="#/pengaturan" aria-label="Pengaturan">' + I.gear + '</a>') +
    '</header>' + prog + '</div>';
}
function page(inner) { return '<main id="page" class="wrap">' + inner + '</main>'; }
function linkItem(url, label, sub) {
  return '<a class="lk" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer"><span class="t">' + esc(label) + '<small>' + esc(sub) + '</small></span><span class="go">Buka Sumber ' + I.ext + '</span></a>';
}
function pdfLink(b, cls) {
  return '<a class="btn ' + (cls || '') + '" href="pdf/TeGe-TKA-Sejarah-Buku-' + b + '.pdf" download="TeGe-TKA-Sejarah-Buku-' + b + '.pdf">' + I.dl + ' Simpan PDF</a>';
}
function bacaan(b, ti, extraSources) {
  var t = MATERI[b][ti], h = '<div class="links">';
  (extraSources || []).forEach(function (r) { h += linkItem(r.url, (r.umum ? 'Rujukan umum: ' : '') + r.label, domain(r.url)); });
  t.wiki.forEach(function (w) { h += linkItem(wiki(w), 'Wikipedia: ' + w, 'id.wikipedia.org (bacaan awal, cek rujukannya)'); });
  return h + '</div>';
}

/* ---------- tampilan: Beranda ---------- */
function slotHtml(m) {
  var sel = S.set.pilih === m.no;
  return '<div class="slot"><button class="bkb" data-act="pilihbuku" data-n="' + m.no + '" aria-pressed="' + sel + '" aria-label="Buku ' + m.no + ': ' + esc(m.judul) + '">' +
    '<div class="bkw"><div class="bk" style="--c:' + m.warna + '"><div class="f pg"></div><div class="f sp">BUKU ' + m.no + '</div>' +
    '<div class="f fr" style="background-image:url(assets/cover-' + m.no + '.webp)"></div></div></div></button></div>';
}
function pickHtml() {
  var m = BUKU[S.set.pilih - 1];
  return '<div class="lbl">Buku ' + m.no + ' dipilih</div><h3>' + esc(m.judul) + '</h3><div class="per">' + esc(m.periode) + ' · PDF sekitar ' + (PDFKB[m.no - 1] / 1000).toFixed(1).replace('.', ',') + ' MB</div>' +
    '<div class="row"><a class="btn pri" href="#/buku/' + m.no + '">Buka Buku</a>' + pdfLink(m.no, '') + '</div>';
}
function viewHome() {
  var dots = BUKU.map(function (m) { return '<i class="' + (m.no === S.set.pilih ? 'on' : '') + '"></i>'; }).join('');
  return { title: 'TeGe TKA Sejarah', html:
    '<div class="home"><div class="home-bg" aria-hidden="true"></div>' +
    '<header class="hhead"><div class="logo" aria-hidden="true">TG</div><div class="ht"><div class="ht1">TeGe TKA Sejarah</div><div class="ht2">Persiapan TKA untuk Siswa SMA</div></div>' +
    '<a class="ib ring" href="#/pengaturan" aria-label="Pengaturan">' + I.gear + '</a></header>' +
    '<div class="hbody">' +
    '<section class="glass intro"><h1>Belajar sejarah, selangkah demi selangkah</h1><p>100 soal dari 5 buku. Pilih satu buku di rak, mulai dari materi singkat.</p>' +
    '<div class="steps"><div class="stp"><span class="n">1</span><b>Materi singkat</b>Ringkasan tema dan bacaan</div><div class="stp"><span class="n">2</span><b>Latihan soal</b>20 soal tiap buku</div><div class="stp"><span class="n">3</span><b>Pembahasan</b>Kunci, alasan, strategi</div></div></section>' +
    '<section><div class="shelf-h"><h2>Rak Buku</h2><span>Geser untuk melihat 5 buku</span></div>' +
    '<div class="shelf"><div class="shelf-in"><div class="rak" id="rak" role="group" aria-label="Rak lima buku">' + BUKU.map(slotHtml).join('') + '</div></div><div class="plank"></div>' +
    '<button class="arr l" data-act="rak" data-d="-1" aria-label="Geser rak ke kiri">' + I.chevl + '</button><button class="arr r" data-act="rak" data-d="1" aria-label="Geser rak ke kanan">' + I.chev + '</button></div>' +
    '<div class="dots" id="dots" aria-hidden="true">' + dots + '</div></section>' +
    '<section class="glass pick" id="pick" aria-live="polite">' + pickHtml() + '</section>' +
    '</div></div>', after: function () {
      var rak = $('#rak'); if (!rak) return;
      var slot = rak.clientWidth / 3, p = S.set.pilih;
      if (p > 3) rak.scrollLeft = (p - 3) * slot;
      var t; rak.addEventListener('scroll', function () { rak.classList.add('swiping'); clearTimeout(t); t = setTimeout(function () { rak.classList.remove('swiping'); }, 180); }, { passive: true });
    } };
}

/* ---------- tampilan: Buku ---------- */
function viewBuku(b) {
  var m = BUKU[b - 1], bd = bk(b), L = bd.runs.latihan, Sm = bd.runs.simulasi, h = '', stat = 'Belum dikerjakan', lab = 'Mulai latihan 20 soal', done = false, sl = null;
  if (L) { var s = stats(L); if (L.selesai) { done = true; lab = 'Ulangi latihan dari awal'; stat = 'Selesai: ' + s.benar + ' dari ' + s.total + ' benar (' + s.pct + '%)'; } else { lab = 'Lanjutkan latihan'; stat = (s.benar + s.salah) + ' dari ' + s.total + ' soal dijawab'; } }
  var simLab = 'Mulai simulasi berwaktu (' + (20 * DETIK_PER_SOAL / 60) + ' menit)';
  if (Sm) { if (Sm.selesai) simLab = 'Ulangi simulasi berwaktu'; else if (remaining(Sm) > 0) simLab = 'Lanjutkan simulasi (sisa ' + mmss(remaining(Sm)) + ')'; else simLab = 'Lihat hasil simulasi'; sl = Sm; }
  var salahN = done ? stats(L).salah + stats(L).kosong : 0;
  var temaH = MATERI[b].map(function (t, i) { return '<li><a class="tema-item" href="#/buku/' + b + '/materi/' + i + '"><span class="no">' + (i + 1) + '</span><span style="flex:1"><b>' + esc(t.judul) + '</b><small>' + t.qs.length + ' soal terkait</small></span>' + I.chev + '</a></li>'; }).join('');
  h += appbar({ back: '#/', title: 'Buku ' + b, sub: m.pendek });
  h += page(
    '<section class="card bhero"><img src="assets/cover-' + b + '.webp" alt="Sampul Buku ' + b + '" width="84" height="119"><div style="flex:1;min-width:0"><h1>' + esc(m.judul) + '</h1><div class="per">' + esc(m.periode) + '</div>' + pdfLink(b, 'sm') + '</div></section>' +
    '<section class="card"><div class="step-h"><span class="step-n">1</span><h2>Materi singkat</h2></div><p class="stat">Baca ringkasan tiap tema dan bacaan sumbernya sebelum berlatih.</p><ol class="tema-list">' + temaH + '</ol></section>' +
    '<section class="card"><div class="step-h"><span class="step-n">2</span><h2>Latihan soal</h2></div>' +
    '<p class="stat">' + esc(stat) + (bd.terbaik ? ' · Skor terbaik ' + bd.terbaik.benar + '/' + bd.terbaik.total : '') + '</p>' +
    '<div class="row"><button class="btn pri" data-act="mulai" data-mode="latihan" data-b="' + b + '">' + esc(lab) + '</button>' +
    '<button class="btn" data-act="mulai" data-mode="simulasi" data-b="' + b + '">' + esc(simLab) + '</button></div>' +
    (salahN > 0 ? '<div class="row" style="margin-top:10px"><button class="btn" data-act="ulang" data-b="' + b + '">Ulangi yang salah (' + salahN + ')</button></div>' : '') +
    (bd.flags.length ? '<div class="row" style="margin-top:10px"><button class="btn" data-act="tandai" data-b="' + b + '">' + I.flag + ' Soal ditandai (' + bd.flags.length + ')</button></div>' : '') +
    '</section>' +
    '<section class="card"><div class="step-h"><span class="step-n">3</span><h2>Pembahasan</h2></div>' +
    '<p class="stat">Muncul ' + (S.set.tampil === 'tiap' ? 'setiap selesai menjawab' : 'setelah semua soal selesai') + ' (bisa diubah di Pengaturan). Setelah selesai, semua jawaban bisa ditinjau kembali.</p>' +
    (done ? '<div class="row"><a class="btn" href="#/buku/' + b + '/hasil/latihan">Lihat hasil dan tinjau pembahasan</a></div>' : '') +
    (sl && sl.selesai ? '<div class="row" style="margin-top:10px"><a class="btn" href="#/buku/' + b + '/hasil/simulasi">Lihat hasil simulasi</a></div>' : '') +
    '</section>' +
    '<section class="card"><h3>Kata kunci waspada</h3><p class="stat" style="margin-top:6px">Kata mutlak sering membuat sebuah pernyataan keliru. Periksa dulu apakah bacaan benar-benar mendukungnya.</p><div class="kw"><span>semua</span><span>seluruh</span><span>selalu</span><span>pasti</span><span>hanya</span><span>satu-satunya</span><span>tidak pernah</span><span>sepenuhnya</span><span>otomatis</span></div></section>');
  return { title: 'Buku ' + b + ' - TeGe TKA Sejarah', html: h };
}

/* ---------- tampilan: Materi ---------- */
function viewMateri(b, i) {
  var t = MATERI[b][i]; if (!t) return null;
  var src = [], seen = {};
  t.qs.forEach(function (no) { var r = SOAL[b][no - 1].rujukan; if (!seen[r.url]) { seen[r.url] = 1; src.push(r); } });
  var prev = i > 0 ? '<a class="btn" href="#/buku/' + b + '/materi/' + (i - 1) + '">' + I.chevl + ' Tema sebelumnya</a>' : '';
  var next = i < MATERI[b].length - 1 ? '<a class="btn" href="#/buku/' + b + '/materi/' + (i + 1) + '">Tema berikutnya ' + I.chev + '</a>' : '';
  var h = appbar({ back: '#/buku/' + b, title: 'Materi singkat', sub: 'Buku ' + b + ' · Tema ' + (i + 1) + ' dari ' + MATERI[b].length });
  h += page(
    '<article class="card mat"><div class="lbl">Tema ' + (i + 1) + '</div><h1>' + esc(t.judul) + '</h1><p>' + esc(t.ringkas) + '</p><ul>' +
    t.poin.map(function (p) { return '<li>' + esc(p) + '</li>'; }).join('') + '</ul>' +
    '<div class="lbl">Kata kunci</div><div class="kw" style="margin-bottom:12px">' + t.kunci.map(function (k) { return '<span>' + esc(k) + '</span>'; }).join('') + '</div>' +
    '<div class="tips"><b>Tips menjawab:</b> ' + esc(t.tips) + '</div></article>' +
    '<section class="card rujuk"><h4>Sumber bacaan untuk belajar mandiri</h4><p class="ket-pend">Tautan membuka situs lain dan membutuhkan internet. Sumber di buku disusun oleh penyusun; bacaan tambahan membantu memperdalam tema ini.</p>' + bacaan(b, i, src) + '</section>' +
    '<div class="row"><button class="btn pri" data-act="tema" data-b="' + b + '" data-i="' + i + '">Latihan soal tema ini (' + t.qs.length + ' soal)</button></div>' +
    (prev || next ? '<div class="row">' + prev + next + '</div>' : ''));
  return { title: t.judul + ' - TeGe TKA Sejarah', html: h };
}

/* ---------- tampilan: Soal ---------- */
var rv = { b: 0, mode: '', idx: 0, filter: 'semua' };
function opsiHtml(q, ans, fb, lock) {
  var h = '', labels = q.label === 'tepat' ? ['Tepat', 'Tidak tepat'] : ['Benar', 'Salah'];
  if (q.tipe === 'BS') {
    var sel = ans.sel || [];
    q.pernyataan.forEach(function (t, i) {
      var rowc = 'bsr', why = '';
      if (lock && fb) { rowc += sel[i] === q.kunci[i] ? ' ok' : ' bad'; why = '<div class="why">' + esc(q.analisis[i]) + '</div>'; }
      var btns = ['B', 'S'].map(function (v, k) {
        var c = '';
        if (lock && fb) { if (q.kunci[i] === v) c = sel[i] === v ? 'ok' : 'miss'; else if (sel[i] === v) c = 'bad'; }
        else if (sel[i] === v) c = 'sel';
        return '<button class="' + c + '" ' + (lock ? 'disabled' : 'data-act="bs" data-i="' + i + '" data-v="' + v + '"') + ' aria-pressed="' + (sel[i] === v) + '">' + (lock && fb && c === 'ok' ? '✓ ' : '') + (lock && fb && c === 'bad' ? '✗ ' : '') + labels[k] + '</button>';
      }).join('');
      h += '<div class="' + rowc + '"><div class="pt"><b>' + (i + 1) + '.</b><span>' + hl(esc(t)) + '</span></div><div class="tf" role="group" aria-label="Pernyataan ' + (i + 1) + '">' + btns + '</div>' + why + '</div>';
    });
    return '<div class="opts">' + h + '</div>';
  }
  var mc = q.tipe === 'MC';
  q.opsi.forEach(function (t, i) {
    var k = 'ABCDE'[i], chosen = mc ? (ans.sel || []).indexOf(k) >= 0 : ans.sel === k, inKey = q.kunci.indexOf(k) >= 0, c = 'opt' + (mc ? ' mc' : ''), tag = '';
    if (lock) {
      c += ' lock';
      if (fb) {
        if (inKey && chosen) { c += ' ok'; tag = '✓ Jawabanmu benar'; }
        else if (inKey) { c += mc ? ' miss' : ' ok'; tag = mc ? 'Seharusnya dipilih' : '✓ Kunci jawaban'; }
        else if (chosen) { c += ' bad'; tag = '✗ Jawabanmu'; }
      } else if (chosen) { c += ' sel'; tag = 'Jawabanmu'; }
    } else if (chosen) c += ' sel';
    h += '<button class="' + c + '" ' + (lock ? 'disabled' : 'data-act="pilih" data-i="' + i + '"') + ' role="' + (mc ? 'checkbox' : 'radio') + '" aria-checked="' + chosen + '"><span class="k">' + k + '</span><span class="t">' + hl(esc(t)) + (tag ? '<span class="tag">' + tag + '</span>' : '') + '</span></button>';
  });
  return '<div class="opts" role="' + (mc ? 'group' : 'radiogroup') + '">' + h + '</div>';
}
function bahasHtml(b, q, ans) {
  var key, ana = '', more = '', ti = temaOf(b, q.no);
  if (q.tipe === 'BS') {
    var lb = q.label === 'tepat' ? ['Tepat', 'Tidak tepat'] : ['Benar', 'Salah'];
    key = q.kunci.map(function (v, i) { return (i + 1) + ' ' + (v === 'B' ? lb[0] : lb[1]); }).join(' · ');
    ana = q.analisis.map(function (t, i) { return '<li class="' + (ans.sel && ans.sel[i] === q.kunci[i] ? 'ok' : 'no') + '"><b>' + (i + 1) + '</b><span>' + esc(t) + '</span></li>'; }).join('');
    ana = '<ul class="ana">' + ana + '</ul>';
  } else {
    key = q.kunci.join(', ');
    var mc = q.tipe === 'MC', first = '', rest = '';
    q.analisis.forEach(function (t, i) {
      var k = 'ABCDE'[i], inKey = q.kunci.indexOf(k) >= 0, chosen = mc ? (ans.sel || []).indexOf(k) >= 0 : ans.sel === k;
      var li = '<li class="' + (inKey ? 'ok' : 'no') + '"><b>' + k + '</b><span>' + esc(t) + '</span></li>';
      if (mc || inKey || chosen) first += li; else rest += li;
    });
    ana = '<ul class="ana">' + first + '</ul>' + (rest ? '<details class="more"><summary>Lihat pilihan lainnya</summary><ul class="ana">' + rest + '</ul></details>' : '');
  }
  var r = q.rujukan;
  return '<section class="card bahas" id="bahas"><div class="bh-h"><h3>Pembahasan</h3><span class="badge">' + (ans.ok ? '✓ Jawabanmu benar' : (ans.lock ? '✗ Perlu dipelajari' : 'Belum dijawab')) + '</span></div>' +
    '<div class="kunci">Kunci jawaban: <b>' + esc(key) + '</b></div>' + ana +
    '<div class="strat"><h4>' + I.bulb + ' Strategi menjawab soal sejenis</h4><ol>' + q.strategi.map(function (s) { return '<li>' + hl(esc(s)) + '</li>'; }).join('') + '</ol></div>' +
    '<div class="rujuk"><h4>Sumber bacaan</h4><div class="links">' + linkItem(r.url, (r.umum ? 'Rujukan umum: ' : '') + r.label, domain(r.url)) +
    '</div><details class="more"><summary>Bacaan tambahan untuk topik ini</summary>' + bacaan(b, ti, []) + '</details></div></section>';
}
function viewSoal(b, mode, review) {
  var bd = bk(b), run = bd.runs[mode];
  if (!run) { return { redirect: '#/buku/' + b }; }
  if (!review && run.selesai) { return { redirect: '#/buku/' + b + '/hasil/' + mode }; }
  if (!review && run.batas && remaining(run) <= 0) { finishRun(b, mode); return { redirect: '#/buku/' + b + '/hasil/' + mode }; }
  var list = run.order, idx = run.idx;
  if (review) {
    list = run.order.filter(function (no) { var a = run.ans[no]; if (rv.filter === 'salah') return !a || !a.lock || !a.ok; if (rv.filter === 'tandai') return bd.flags.indexOf(no) >= 0; return true; });
    if (!list.length) { rv.filter = 'semua'; list = run.order; }
    if (rv.idx >= list.length) rv.idx = list.length - 1; if (rv.idx < 0) rv.idx = 0;
    idx = rv.idx;
  }
  var no = list[idx], q = SOAL[b][no - 1], ans = run.ans[no] || {}, lock = !!ans.lock;
  var rem = remaining(run), sim = mode === 'simulasi';
  var fb = review || (lock && S.set.tampil === 'tiap' && !sim);
  var ti = temaOf(b, no), flagged = bd.flags.indexOf(no) >= 0;
  var tipeLab = q.tipe === 'PG' ? 'Pilihan Ganda' : (q.tipe === 'MC' ? 'Pilihan Ganda Kompleks' : (q.label === 'tepat' ? 'Tepat / Tidak Tepat' : 'Benar / Salah'));
  var jml = list.length, answered = run.order.filter(function (n) { return run.ans[n] && run.ans[n].lock; }).length;
  var grid = run.order.map(function (n, k) {
    var a = run.ans[n], c = '';
    if (a && a.lock) c = (review || (S.set.tampil === 'tiap' && !sim)) ? (a.ok ? 'g' : 's') : 'd';
    var cur = review ? (n === no) : (k === idx);
    var tgt = review ? 'data-act="rjump" data-no="' + n + '"' : 'data-act="jump" data-i="' + k + '"';
    return '<button class="' + c + (cur ? ' cur' : '') + (bd.flags.indexOf(n) >= 0 ? ' f' : '') + '" ' + tgt + ' aria-label="Soal ' + (k + 1) + (c === 'g' ? ', benar' : c === 's' ? ', salah' : c === 'd' ? ', sudah dijawab' : ', belum dijawab') + '">' + (k + 1) + '</button>';
  }).join('');
  var last = idx === jml - 1;
  var body = '<div class="qh"><div class="chips"><span class="chip k">Tema ' + (ti + 1) + ' · ' + esc(MATERI[b][ti].judul) + '</span><span class="chip">' + tipeLab + '</span></div><h2>' + esc(q.judul) + '</h2></div>' +
    '<section class="stim"><span class="lbl">Stimulus</span>' + hl(esc(q.stimulus)) + '</section>' +
    '<p class="tanya">' + hl(esc(q.tanya)) + '</p>' +
    (S.set.waspada && !review ? '<p class="legend">Kata bergaris bawah putus-putus adalah kata mutlak. Periksa dulu apakah bacaan mendukungnya.</p>' : '') +
    opsiHtml(q, ans, fb, lock || review);
  if (!lock && !review) {
    body += '<button class="btn pri" data-act="jawab" ' + (lengkap(q, ans.sel) ? '' : 'disabled') + '>' + (S.set.tampil === 'tiap' && !sim ? 'Periksa jawaban' : 'Simpan jawaban') + '</button>';
  } else if (lock && !fb && !review) {
    body += '<p class="ket-pend">Jawaban tersimpan. Pembahasan muncul setelah semua soal selesai.</p>';
  }
  body += '<section class="card"><label class="lbl" for="alasan">Alasan saya</label><textarea id="alasan" data-act="alasan" placeholder="Tulis alasan memilih jawaban ini (boleh dikosongkan). Tersimpan di HP ini." >' + esc(ans.alasan || '') + '</textarea></section>';
  if (fb) body += bahasHtml(b, q, ans);
  body += '<div class="row no-tts"><button class="btn sm" data-act="flag" aria-pressed="' + flagged + '">' + I.flag + ' ' + (flagged ? 'Ditandai untuk ditinjau' : 'Tandai untuk ditinjau') + '</button></div>';
  var nav = '<div class="qnav no-tts"><button class="btn" data-act="' + (review ? 'rprev' : 'prev') + '" ' + (idx === 0 ? 'disabled' : '') + '>' + I.chevl + ' Sebelumnya</button>';
  if (review) nav += '<button class="btn" data-act="rnext" ' + (last ? 'disabled' : '') + '>Berikutnya ' + I.chev + '</button>';
  else if (last) nav += '<button class="btn pri" data-act="selesai">Selesai</button>';
  else nav += '<button class="btn pri" data-act="next">Berikutnya ' + I.chev + '</button>';
  nav += '</div>';
  var filt = '';
  if (review) {
    filt = '<div class="seg no-tts" role="group" aria-label="Filter soal">' + [['semua', 'Semua'], ['salah', 'Yang salah'], ['tandai', 'Ditandai']].map(function (f) { return '<button data-act="rfilter" data-f="' + f[0] + '" aria-pressed="' + (rv.filter === f[0]) + '">' + f[1] + '</button>'; }).join('') + '</div>';
  }
  var grids = '<details class="card nomor no-tts"><summary><span>Nomor soal</span><span class="mut" style="font-weight:400">' + answered + ' dari ' + run.order.length + ' dijawab</span></summary><div class="grid">' + grid + '</div>' +
    (!review ? '<div class="row" style="margin-top:10px"><button class="btn sm" data-act="selesai">Selesaikan sekarang</button></div>' : '') + '</details>';
  var titl = review ? 'Tinjau · ' + MODES[mode] : MODES[mode];
  var h = appbar({ back: review ? '#/buku/' + b + '/hasil/' + mode : '#/buku/' + b, title: 'Soal ' + (idx + 1) + ' dari ' + jml, sub: 'Buku ' + b + ' · ' + titl, prog: Math.round((idx + 1) * 100 / jml), timer: (!review && rem !== null) ? mmss(rem) : '' });
  h += page(filt + body + nav + grids);
  return { title: 'Soal ' + (idx + 1) + ' - Buku ' + b, html: h, after: function () {
    if (!review && rem !== null) startTimer(b, mode);
  } };
}
var timerH = 0;
function startTimer(b, mode) {
  clearInterval(timerH);
  timerH = setInterval(function () {
    var run = bk(b).runs[mode]; if (!run || run.selesai) { clearInterval(timerH); return; }
    var r = remaining(run), el = $('#tm');
    if (r <= 0) { clearInterval(timerH); finishRun(b, mode); toast('Waktu habis. Jawabanmu dikumpulkan.'); go('#/buku/' + b + '/hasil/' + mode); return; }
    if (el) { el.textContent = mmss(r); el.classList.toggle('low', r < 120000); }
  }, 1000);
}

/* ---------- tampilan: Hasil ---------- */
function shareText(b, mode, run) {
  var s = stats(run), salah = run.order.filter(function (n) { var a = run.ans[n]; return !a || !a.lock || !a.ok; });
  var t = 'Hasil TeGe TKA Sejarah\n' + (S.set.nama ? 'Nama: ' + S.set.nama + '\n' : '') + 'Buku ' + b + ': ' + BUKU[b - 1].judul + '\nMode: ' + MODES[mode] + '\nSkor: ' + s.benar + ' dari ' + s.total + ' (' + s.pct + '%)\n' + (salah.length ? 'Soal yang perlu diulang: ' + salah.join(', ') + '\n' : '') + 'Tanggal: ' + tgl(run.akhir || Date.now());
  return t;
}
function viewHasil(b, mode) {
  var run = bk(b).runs[mode];
  if (!run) return { redirect: '#/buku/' + b };
  if (!run.selesai) return { redirect: '#/buku/' + b + '/soal/' + mode };
  var s = stats(run), msg = s.pct >= 85 ? 'Bagus sekali. Pertahankan, lalu coba buku lain.' : s.pct >= 65 ? 'Sudah baik. Pelajari pembahasan soal yang salah.' : 'Tidak apa-apa. Baca ulang materi singkat, lalu ulangi soal yang salah.';
  var grid = run.order.map(function (n, k) { var a = run.ans[n], c = (!a || !a.lock) ? '' : (a.ok ? 'g' : 's'); return '<a class="' + c + (bk(b).flags.indexOf(n) >= 0 ? ' f' : '') + '" href="#/buku/' + b + '/tinjau/' + mode + '/' + k + '" aria-label="Soal ' + (k + 1) + (c === 'g' ? ', benar' : c === 's' ? ', salah' : ', belum dijawab') + '">' + (k + 1) + '</a>'; }).join('');
  var waktu = run.batas ? '<p class="mut">Waktu terpakai: ' + mmss(Math.min(run.akhir - run.mulai, run.batas)) + ' dari ' + mmss(run.batas) + '</p>' : '';
  var h = appbar({ back: '#/buku/' + b, title: 'Hasil', sub: 'Buku ' + b + ' · ' + MODES[mode] });
  h += page(
    '<section class="card skor"><div class="lbl">' + MODES[mode] + '</div><div class="big">' + s.benar + '<span style="font-size:1.4rem"> / ' + s.total + '</span></div><div class="pct">' + s.pct + '% benar</div><p>' + msg + '</p>' + waktu +
    (s.kosong ? '<p class="mut">' + s.kosong + ' soal belum dijawab dihitung salah.</p>' : '') + '</section>' +
    '<section class="card"><h3>Ringkasan per soal</h3><p class="stat">Hijau benar, merah salah, titik oranye soal yang kamu tandai. Ketuk nomor untuk melihat pembahasan.</p><div class="grid">' + grid + '</div></section>' +
    '<section class="card"><label class="lbl" for="nama">Nama (untuk laporan ke guru)</label><input type="text" id="nama" data-act="nama" value="' + esc(S.set.nama) + '" placeholder="Nama dan kelas" autocomplete="name" style="margin:8px 0 10px"><a class="btn" href="https://wa.me/?text=' + encodeURIComponent(shareText(b, mode, run)) + '" target="_blank" rel="noopener noreferrer" data-act="wa" data-b="' + b + '" data-mode="' + mode + '" style="width:100%">' + I.wa + ' Bagikan hasil ke guru lewat WhatsApp</a></section>' +
    '<div class="row"><a class="btn pri" href="#/buku/' + b + '/tinjau/' + mode + '/0">Tinjau jawaban dan pembahasan</a>' +
    (s.salah + s.kosong > 0 ? '<button class="btn" data-act="ulang" data-b="' + b + '" data-from="' + mode + '">Ulangi yang salah (' + (s.salah + s.kosong) + ')</button>' : '') + '</div>' +
    '<div class="row"><button class="btn" data-act="mulai" data-mode="' + (mode === 'latihan' || mode === 'simulasi' ? mode : 'latihan') + '" data-b="' + b + '" data-force="1">Coba lagi dari awal</button><a class="btn" href="#/buku/' + b + '">Kembali ke Buku ' + b + '</a></div>');
  return { title: 'Hasil - Buku ' + b, html: h };
}

/* ---------- tampilan: Pengaturan & About ---------- */
var deferredInstall = null;
function viewPengaturan() {
  var st = S.set, ua = navigator.userAgent || '', ios = /iPhone|iPad|iPod/i.test(ua);
  function seg(key, vals) { return '<div class="seg" role="group">' + vals.map(function (v) { return '<button data-act="set" data-k="' + key + '" data-v="' + v[0] + '" aria-pressed="' + (String(st[key]) === String(v[0])) + '">' + v[1] + '</button>'; }).join('') + '</div>'; }
  function radio(v, t, sm) { return '<button class="radio" role="radio" aria-checked="' + (st.tampil === v) + '" data-act="set" data-k="tampil" data-v="' + v + '"><i></i><span><b>' + t + '</b><small>' + sm + '</small></span></button>'; }
  function tog(k, t, sm) { return '<button class="tog" role="switch" aria-checked="' + (!!st[k]) + '" data-act="toggle" data-k="' + k + '"><span><b>' + t + '</b><small>' + sm + '</small></span><span class="sw" aria-hidden="true"></span></button>'; }
  var h = appbar({ backAct: true, title: 'Pengaturan', gear: false });
  h += page(
    '<section class="card"><div class="lbl" style="margin-bottom:8px">Tema</div>' + seg('tema', [['terang', 'Terang'], ['gelap', 'Gelap']]) + '</section>' +
    '<section class="card"><div class="lbl" style="margin-bottom:8px">Ukuran huruf</div><div class="fsrow"><button class="btn" data-act="fs" data-d="-1" aria-label="Perkecil huruf" style="font-size:.85rem">A</button><input type="range" min="0" max="4" step="1" value="' + st.fs + '" data-act="fsr" aria-label="Ukuran huruf"><button class="btn" data-act="fs" data-d="1" aria-label="Perbesar huruf" style="font-size:1.25rem">A</button></div><p class="mut" style="margin-top:6px;font-size:.85rem">Ukuran ' + FS[st.fs].n.toLowerCase() + '</p></section>' +
    '<section class="card"><div class="lbl" style="margin-bottom:8px">Pembahasan muncul</div><div style="display:flex;flex-direction:column;gap:8px" role="radiogroup">' +
    radio('tiap', 'Setiap selesai menjawab', 'Pilihan bawaan') + radio('akhir', 'Setelah semua soal selesai', 'Seperti di buku cetak') + '</div><p class="mut" style="margin-top:8px;font-size:.8rem">Simulasi berwaktu selalu menampilkan pembahasan di akhir.</p></section>' +
    '<section class="card"><div class="lbl" style="margin-bottom:4px">Tampilan dan bantuan</div>' +
    tog('gerak', 'Kurangi gerakan', 'Buku di rak berhenti melayang') + tog('waspada', 'Tandai kata mutlak', 'Garis putus-putus pada kata seperti semua, selalu, pasti') + '</section>' +
    '<section class="card"><div class="lbl" style="margin-bottom:8px">Pasang di layar utama</div>' +
    (deferredInstall ? '<button class="btn pri" data-act="pasang" style="width:100%">Pasang aplikasi</button>' : '<p style="font-size:.88rem">' + (ios ? 'Di Safari, ketuk tombol Bagikan lalu pilih Tambahkan ke Layar Utama.' : 'Di Chrome, buka menu titik tiga lalu pilih Pasang aplikasi atau Tambahkan ke layar utama.') + '</p>') +
    '<p class="mut" style="margin-top:8px;font-size:.8rem">Setelah dibuka sekali dengan internet, aplikasi bisa dipakai tanpa sinyal.</p></section>' +
    '<section class="card"><div class="lbl" style="margin-bottom:8px">Data belajar di HP ini</div><p style="font-size:.85rem;margin-bottom:10px">Kemajuan, alasan, dan tanda soal tersimpan di HP ini saja, tanpa akun.</p><div class="row"><button class="btn sm" data-act="cadang">Cadangkan</button><button class="btn sm" data-act="pulih">Pulihkan</button><button class="btn sm" data-act="hapus" style="color:var(--bad)">Hapus data</button></div><input type="file" id="berkas" accept="application/json,.json" hidden></section>' +
    '<button class="about-btn" data-act="about">' + I.info + '<span style="flex:1">About</span>' + I.chev + '</button>');
  return { title: 'Pengaturan - TeGe TKA Sejarah', html: h };
}
function aboutHtml() {
  return '<button class="ib x" data-act="mno" aria-label="Tutup">' + I.x + '</button>' +
    '<div class="c"><div class="logo" style="width:60px;height:60px;font-size:1.3rem">TG</div><h2 style="font-size:1.35rem">TeGe TKA Sejarah</h2><p class="mut">Persiapan TKA untuk Siswa SMA · Versi ' + esc(VER) + '</p></div><hr>' +
    '<div><div class="lbl" style="text-align:center;margin-bottom:8px">Disusun oleh</div>' +
    '<div class="orang" style="margin-bottom:10px"><b>Toto Gutomo, S.Pd., Gr., M.Pd., CPSS</b><span class="mut" style="font-size:.85rem">Guru SMA Negeri 3 Maliku</span></div>' +
    '<div class="orang"><b>Ikrimah Laily, S.Pd, Gr</b><span class="mut" style="font-size:.85rem">Guru SMA Negeri 1 Maliku</span></div></div><hr>' +
    '<div><div class="lbl" style="margin-bottom:6px">Teknologi</div><p>Dibangun dengan HTML, CSS, dan JavaScript. Berjalan di browser HP dan laptop, bisa dipasang ke layar utama dan dipakai tanpa sinyal. Suara bacaan memakai suara bawaan HP. Huruf: Lato dan Playfair Display (lisensi SIL OFL).</p></div>' +
    '<div><div class="lbl" style="margin-bottom:6px">Lisensi</div><p>Soal dan pembahasan © 2026 Toto Gutomo dan Ikrimah Laily, berlisensi Creative Commons BY-NC-ND 4.0: boleh dibagikan utuh untuk keperluan non-komersial dengan menyebut penyusun, tidak boleh diubah. Bacaan pada tautan sumber adalah milik masing-masing penerbit. Latihan ini orisinal berdasarkan kerangka TKA Sejarah dan bukan naskah resmi TKA.</p></div><hr>' +
    '<div class="c"><p class="tagline">Ngoding Pakai Vibe, Ngajar Pakai Hati</p><a class="btn" href="https://totogutomo.com" target="_blank" rel="noopener" style="width:100%">totogutomo.com</a></div>';
}

/* ---------- router ---------- */
var navCount = 0, cur = null;
function go(h) { if (location.hash === h) render(); else location.hash = h; }
function parse() {
  var p = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  if (!p.length) return { r: 'home' };
  if (p[0] === 'pengaturan') return { r: 'set' };
  if (p[0] === 'buku') {
    var b = parseInt(p[1], 10);
    if (!(b >= 1 && b <= 5)) return { r: 'home' };
    if (!p[2]) return { r: 'buku', b: b };
    if (p[2] === 'materi') return { r: 'materi', b: b, i: parseInt(p[3], 10) || 0 };
    if (p[2] === 'soal' && MODES[p[3]]) return { r: 'soal', b: b, mode: p[3] };
    if (p[2] === 'hasil' && MODES[p[3]]) return { r: 'hasil', b: b, mode: p[3] };
    if (p[2] === 'tinjau' && MODES[p[3]]) return { r: 'tinjau', b: b, mode: p[3], i: parseInt(p[4], 10) || 0 };
    return { r: 'buku', b: b };
  }
  return { r: 'home' };
}
function render(keepScroll) {
  var y = window.scrollY, rt = parse(), v;
  ttsStop(); clearInterval(timerH);
  switch (rt.r) {
    case 'set': v = viewPengaturan(); break;
    case 'buku': v = viewBuku(rt.b); break;
    case 'materi': v = viewMateri(rt.b, rt.i) || { redirect: '#/buku/' + rt.b }; break;
    case 'soal': v = viewSoal(rt.b, rt.mode, false); break;
    case 'hasil': v = viewHasil(rt.b, rt.mode); break;
    case 'tinjau':
      if (rv.b !== rt.b || rv.mode !== rt.mode || cur !== 'tinjau') { rv = { b: rt.b, mode: rt.mode, idx: rt.i, filter: 'semua' }; }
      v = viewSoal(rt.b, rt.mode, true); break;
    default: v = viewHome();
  }
  cur = rt.r;
  if (v.redirect) { history.replaceState(null, '', v.redirect); render(); return; }
  document.title = v.title || 'TeGe TKA Sejarah';
  $('#app').innerHTML = v.html;
  if (v.after) v.after();
  window.scrollTo(0, keepScroll ? y : 0);
}
function rerender() { render(true); }

/* ---------- aksi ---------- */
function currentRun() { var rt = parse(); if (rt.r !== 'soal' && rt.r !== 'tinjau') return null; return { b: rt.b, mode: rt.mode, run: bk(rt.b).runs[rt.mode], review: rt.r === 'tinjau' }; }
function curNo(c) {
  var run = c.run;
  if (c.review) { var list = run.order.filter(function (no) { var a = run.ans[no]; if (rv.filter === 'salah') return !a || !a.lock || !a.ok; if (rv.filter === 'tandai') return bk(c.b).flags.indexOf(no) >= 0; return true; }); return list[rv.idx] || list[0]; }
  return run.order[run.idx];
}
function backup() {
  var d = new Date(), blob = new Blob([JSON.stringify({ app: 'TeGe TKA Sejarah', ver: VER, tgl: d.toISOString(), data: S })], { type: 'application/json' });
  var a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'tege-tka-sejarah-cadangan-' + d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + '.json';
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 3000);
  toast('Cadangan disimpan sebagai berkas. Simpan di tempat aman.');
}
function restore(file) {
  var rd = new FileReader();
  rd.onload = function () {
    try {
      var o = JSON.parse(rd.result);
      if (!o || o.app !== 'TeGe TKA Sejarah' || !o.data || o.data.v !== 1 || typeof o.data.buku !== 'object') throw new Error('format');
      confirmBox('Data belajar di HP ini akan diganti dengan isi cadangan. Lanjutkan?', 'Pulihkan', function () { S = o.data; load0(S); save(); applyPrefs(); toast('Data berhasil dipulihkan.'); render(); });
    } catch (e) { toast('Berkas cadangan tidak dikenali.'); }
  };
  rd.readAsText(file);
}
function load0(o) { o.set = Object.assign({ tema: 'terang', fs: 1, tampil: 'tiap', gerak: false, waspada: true, nama: '', pilih: 1 }, o.set || {}); S = o; }

document.addEventListener('click', function (e) {
  var el = e.target.closest('[data-act]'); if (!el) return;
  var act = el.getAttribute('data-act'), d = el.dataset, c;
  switch (act) {
    case 'tts': if (tts.on) ttsStop(); else ttsStart(); break;
    case 'back': if (navCount > 0) history.back(); else go('#/'); break;
    case 'goto': go(d.to); break;
    case 'pilihbuku': S.set.pilih = parseInt(d.n, 10); save();
      document.querySelectorAll('.bkb').forEach(function (x) { x.setAttribute('aria-pressed', x.getAttribute('data-n') === d.n ? 'true' : 'false'); });
      var pk = $('#pick'); if (pk) pk.innerHTML = pickHtml();
      document.querySelectorAll('#dots i').forEach(function (x, i) { x.classList.toggle('on', i + 1 === S.set.pilih); });
      break;
    case 'rak': var rak = $('#rak'); if (rak) rak.scrollBy({ left: parseInt(d.d, 10) * rak.clientWidth / 3, behavior: 'smooth' }); break;
    case 'mulai': {
      var b = parseInt(d.b, 10), mode = d.mode, old = bk(b).runs[mode];
      var begin = function () { startRun(b, mode, range(20)); go('#/buku/' + b + '/soal/' + mode); };
      if (mode === 'simulasi' && old && !old.selesai && remaining(old) > 0) { go('#/buku/' + b + '/soal/simulasi'); break; }
      if (mode === 'simulasi' && old && !old.selesai && remaining(old) <= 0) { finishRun(b, 'simulasi'); go('#/buku/' + b + '/hasil/simulasi'); break; }
      if (old && !old.selesai) { go('#/buku/' + b + '/soal/' + mode); break; }
      if (old && old.selesai && !d.force) { confirmBox('Mulai dari awal? Jawaban sebelumnya diganti. Skor terbaik tetap tersimpan.', 'Mulai dari awal', begin); break; }
      if (old && old.selesai && d.force) { confirmBox('Coba lagi dari awal? Jawaban sebelumnya diganti. Skor terbaik tetap tersimpan.', 'Coba lagi', begin); break; }
      begin(); break; }
    case 'ulang': {
      var bb = parseInt(d.b, 10), from = bk(bb).runs[d.from || 'latihan'];
      if (!from) break;
      var ord = from.order.filter(function (n) { var a = from.ans[n]; return !a || !a.lock || !a.ok; });
      if (!ord.length) { toast('Tidak ada soal yang salah. Mantap!'); break; }
      startRun(bb, 'ulang', ord); go('#/buku/' + bb + '/soal/ulang'); break; }
    case 'tandai': { var bt = parseInt(d.b, 10), fl = bk(bt).flags.slice().sort(function (x, y) { return x - y; }); if (!fl.length) break; startRun(bt, 'tandai', fl); go('#/buku/' + bt + '/soal/tandai'); break; }
    case 'tema': { var bm = parseInt(d.b, 10), ti = parseInt(d.i, 10); startRun(bm, 'tema', MATERI[bm][ti].qs.slice()); go('#/buku/' + bm + '/soal/tema'); break; }
    case 'pilih': c = currentRun(); if (!c || c.review) break; {
      var no = curNo(c), q = SOAL[c.b][no - 1], a = c.run.ans[no] || (c.run.ans[no] = {}); if (a.lock) break;
      var k = 'ABCDE'[parseInt(d.i, 10)];
      if (q.tipe === 'MC') { a.sel = a.sel || []; var p = a.sel.indexOf(k); if (p >= 0) a.sel.splice(p, 1); else a.sel.push(k); }
      else a.sel = k;
      save(); rerender(); }
      break;
    case 'bs': c = currentRun(); if (!c || c.review) break; {
      var n2 = curNo(c), a2 = c.run.ans[n2] || (c.run.ans[n2] = {}); if (a2.lock) break;
      a2.sel = a2.sel || []; a2.sel[parseInt(d.i, 10)] = d.v; save(); rerender(); }
      break;
    case 'jawab': c = currentRun(); if (!c || c.review) break; {
      var n3 = curNo(c), q3 = SOAL[c.b][n3 - 1], a3 = c.run.ans[n3] || (c.run.ans[n3] = {});
      if (a3.lock || !lengkap(q3, a3.sel)) break;
      a3.lock = true; a3.ok = nilai(q3, a3.sel); save(); rerender();
      var bh = $('#bahas'); if (bh) bh.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
      break;
    case 'next': c = currentRun(); if (c && c.run.idx < c.run.order.length - 1) { c.run.idx++; save(); render(); } break;
    case 'prev': c = currentRun(); if (c && c.run.idx > 0) { c.run.idx--; save(); render(); } break;
    case 'jump': c = currentRun(); if (c) { c.run.idx = parseInt(d.i, 10); save(); render(); } break;
    case 'rnext': rv.idx++; render(); break;
    case 'rprev': rv.idx--; render(); break;
    case 'rjump': c = currentRun(); if (c) { var li = c.run.order.filter(function (no2) { var a4 = c.run.ans[no2]; if (rv.filter === 'salah') return !a4 || !a4.lock || !a4.ok; if (rv.filter === 'tandai') return bk(c.b).flags.indexOf(no2) >= 0; return true; }); var ix = li.indexOf(parseInt(d.no, 10)); if (ix < 0) { rv.filter = 'semua'; ix = parseInt(d.no, 10) - 1; } rv.idx = ix; render(); } break;
    case 'rfilter': rv.filter = d.f; rv.idx = 0; render(); break;
    case 'flag': c = currentRun(); if (c) { var nf = curNo(c), fl2 = bk(c.b).flags, pi = fl2.indexOf(nf); if (pi >= 0) fl2.splice(pi, 1); else fl2.push(nf); save(); rerender(); } break;
    case 'selesai': c = currentRun(); if (c && !c.review) {
      var un = c.run.order.filter(function (n) { return !(c.run.ans[n] && c.run.ans[n].lock); }).length;
      var fin = function () { finishRun(c.b, c.mode); go('#/buku/' + c.b + '/hasil/' + c.mode); };
      if (un > 0) confirmBox(un + ' soal belum dijawab dan akan dihitung salah. Tetap selesai?', 'Selesai', fin); else fin(); }
      break;
    case 'wa': break;
    case 'set': S.set[d.k] = (d.k === 'fs') ? parseInt(d.v, 10) : d.v; save(); applyPrefs(); rerender(); break;
    case 'toggle': S.set[d.k] = !S.set[d.k]; save(); applyPrefs(); rerender(); break;
    case 'fs': S.set.fs = Math.max(0, Math.min(4, S.set.fs + parseInt(d.d, 10))); save(); applyPrefs(); rerender(); break;
    case 'cadang': backup(); break;
    case 'pulih': { var f = $('#berkas'); if (f) f.click(); } break;
    case 'hapus': confirmBox('Hapus semua data belajar di HP ini (jawaban, alasan, tanda, dan pengaturan)? Tindakan ini tidak bisa dibatalkan.', 'Hapus semua', function () { try { localStorage.removeItem(KEY); } catch (er) { /* abaikan */ } load(); applyPrefs(); toast('Data belajar dihapus.'); render(); }); break;
    case 'pasang': if (deferredInstall) { deferredInstall.prompt(); deferredInstall = null; } break;
    case 'about': openModal(aboutHtml()); break;
    case 'mno': closeModal(); confirmCb = null; break;
    case 'mok': { var cb = confirmCb; closeModal(); confirmCb = null; if (cb) cb(); } break;
    case 'perbarui': if (waitingSW) waitingSW.postMessage('SKIP_WAITING'); break;
    case 'tutupupd': { var u = $('#upd'); if (u) u.hidden = true; } break;
  }
});
document.addEventListener('input', function (e) {
  var el = e.target; if (!el.getAttribute) return;
  var act = el.getAttribute('data-act');
  if (act === 'alasan') {
    var c = currentRun(); if (!c) return; var no = curNo(c), a = c.run.ans[no] || (c.run.ans[no] = {}); a.alasan = el.value; saveSoon();
  } else if (act === 'nama') { S.set.nama = el.value.slice(0, 60); saveSoon(); var wa = $('[data-act="wa"]'); var rt = parse(); if (wa && rt.r === 'hasil') wa.href = 'https://wa.me/?text=' + encodeURIComponent(shareText(rt.b, rt.mode, bk(rt.b).runs[rt.mode])); }
  else if (act === 'fsr') { S.set.fs = parseInt(el.value, 10); save(); applyPrefs(); var tx = el.parentNode.nextElementSibling; if (tx) tx.textContent = 'Ukuran ' + FS[S.set.fs].n.toLowerCase(); }
});
document.addEventListener('change', function (e) {
  if (e.target && e.target.id === 'berkas' && e.target.files && e.target.files[0]) { restore(e.target.files[0]); e.target.value = ''; }
});
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { if (modalEl) closeModal(); else ttsStop(); } });
window.addEventListener('hashchange', function () { navCount++; render(); });
window.addEventListener('pagehide', function () { clearTimeout(saveT); save(); try { window.speechSynthesis.cancel(); } catch (e) { /* abaikan */ } });
window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferredInstall = e; if (cur === 'set') rerender(); });

/* ---------- offline & versi baru ---------- */
var waitingSW = null, refreshing = false;
function showUpdate(sw) { waitingSW = sw; var u = $('#upd'); if (u) u.hidden = false; }
function initSW() {
  if (!('serviceWorker' in navigator) || location.protocol === 'file:') return;
  navigator.serviceWorker.register('sw.js').then(function (reg) {
    if (reg.waiting && navigator.serviceWorker.controller) showUpdate(reg.waiting);
    reg.addEventListener('updatefound', function () {
      var nw = reg.installing; if (!nw) return;
      nw.addEventListener('statechange', function () { if (nw.state === 'installed' && navigator.serviceWorker.controller) showUpdate(nw); });
    });
    var chk = function () { try { reg.update(); } catch (e) { /* abaikan */ } };
    chk(); document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') chk(); });
  }).catch(function () { /* tanpa mode offline */ });
  navigator.serviceWorker.addEventListener('controllerchange', function () { if (refreshing) return; refreshing = true; location.reload(); });
}

/* ---------- mulai ---------- */
load(); applyPrefs(); render(); initSW();
})();
