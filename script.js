document.getElementById('year').textContent = new Date().getFullYear();
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---- Menu ----
const burger = document.getElementById('burger');
const menu = document.getElementById('menu');
function setMenu(open) {
  menu.classList.toggle('open', open);
  document.body.classList.toggle('menu-open', open);
  burger.setAttribute('aria-expanded', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
// page curtain: dark panel sweeps up, content swaps underneath, then sweeps away
const curtain = document.createElement('div');
curtain.className = 'curtain'; curtain.setAttribute('aria-hidden', 'true');
document.body.appendChild(curtain);
let curtainBusy = false;
window.pageGo = function (fn) {
  if (reduce) { fn(); return; }
  if (curtainBusy) return;
  curtainBusy = true;
  curtain.className = 'curtain in';
  setTimeout(() => {
    fn();
    curtain.className = 'curtain out';
    setTimeout(() => { curtain.className = 'curtain'; curtainBusy = false; }, 560);
  }, 560);
};
menu.querySelectorAll('a').forEach(a => a.addEventListener('click', e => {
  const id = a.getAttribute('href');
  const target = id && id.startsWith('#') ? document.querySelector(id) : null;
  if (!target) { setMenu(false); return; }
  e.preventDefault();
  window.pageGo(() => {
    menu.style.transition = 'none'; setMenu(false); void menu.offsetHeight; menu.style.transition = '';
    if (window.__closeCase) window.__closeCase();
    window.scrollTo({ top: target.getBoundingClientRect().top + scrollY, behavior: 'instant' });
  });
}));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

// ---- Picture icon trail: red icons appear along the cursor path, only over the photo ----
const photo = document.getElementById('photo');
const icons = document.getElementById('icons');
// Add your own image files to images/icons/ and list them here to use them in the trail.
const icons_src = ['images/icons/white-a.png', 'images/icons/web-b.png', 'images/icons/white-c.png', 'images/icons/web-a.png', 'images/icons/white-b.png', 'images/icons/web-c-red.png'];
icons_src.forEach(s => { const i = new Image(); i.src = s; });   // preload so nothing flickers
const MASK = [
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000000000000000000000000000000',
  '000000000000000000000000000100000000000000000000000000',
  '000000000000000000000000011111000000000000000000000000',
  '000000000000000000000000111111100000000000000000000000',
  '000000000000000000000000111111100000000000000000000000',
  '000000000000000000000000111111110000000000000000000000',
  '000000000000000000000001111111110000000000000000000000',
  '000000000000000000000001111111110000000000000000000000',
  '000000000000000000000001111111110000000000000000000000',
  '000000000000000000000001111111111000000000000000000000',
  '000000000000000000000001111111111000000000000000000000',
  '000000000000000000000001111111111000000000000000000000',
  '000000000000000000000001111111111100000000000000000000',
  '000000000000000000000001111111111100000000000000000000',
  '000000000000000000000011111111111100000000000000000000',
  '000000000000000000000111111111111000000000000000000000',
  '000000000000000000011111111111111100000000000000000000',
  '000000000000000000111111111111111111000000000000000000',
  '000000000000000011111111111111111111100000000000000000',
  '000000000000000011111111111111111111110000000000000000',
  '000000000000000111111111111111111111110000000000000000',
  '000000000000001111111111111111111111110000000000000000',
  '000000000000001111111111111111111111111000000000000000',
  '000000000000011111111111111111111111111000000000000000',
  '000000000000111111111111111111111111111100000000000000',
  '000000000000111111111111111111111111111100000000000000',
  '000000000001111111111111111111111111111100000000000000',
  '000000000011111111111111111111111111111110000000000000',
  '000000000011111111111111111111111111111110000000000000',
  '000000000111111111111111111111111111111110000000000000',
  '000000000111111111111111111111111111111111000000000000',
  '000000001111111111111111111111111111111111000000000000',
  '000000001111111111111111111111111111111111000000000000',
  '000000001111111111111111111111111111111111100000000000',
  '000000000000000011111111111111111111111111100000000000',
  '000000000000000001111111111111111111111111100000000000',
  '000000000000000001111111111111111111111111100000000000',
  '000000000000000001111111111111111111111111100000000000',
  '000000000000000001111111111111111111111111000000000000',
  '000000000000000001111111111111111111111111000000000000',
  '000000000000000001111111111111111111111110000000000000',
  '000000000000000001111111111111111111111100000000000000',
  '000000000000000001111111111111111111111100000000000000',
  '000000000000000001111111111111111111110000000000000000',
  '000000000000000000111111111111111111100000000000000000',
  '000000000000000000111111111111111111100000000000000000',
  '000000000000000000111111111111111111100000000000000000',
  '000000000000000000011111111111111111100000000000000000',
  '000000000000000000011111111111111111100000000000000000',
  '000000000000000000000000000000000000000000000000000000'
];
const MW = MASK[0].length, MH = MASK.length;
let lastPt = null, shapeIdx = 0;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
function dropIcon(x, y) {
  const img = document.createElement('img');
  img.src = icons_src[shapeIdx++ % icons_src.length];
  img.alt = '';
  img.className = 'pic';
  img.draggable = false;
  img.style.left = x + 'px';
  img.style.top = y + 'px';
  img.style.rotate = (Math.random() * 30 - 15) + 'deg';
  icons.appendChild(img);
  while (icons.children.length > 14) icons.firstChild.remove();
  setTimeout(() => img.remove(), 1800);
}
if (!reduceMotion) {
  photo.addEventListener('pointermove', e => {
    const box = photo.getBoundingClientRect();
    const x = e.clientX - box.left, y = e.clientY - box.top;
    // Icons only appear while the pointer is over the person (silhouette map of the photo)
    const gx = Math.floor(x / box.width * MW), gy = Math.floor(y / box.height * MH);
    const onBody = gx >= 0 && gy >= 0 && gx < MW && gy < MH && MASK[gy][gx] === '1';
    if (!onBody) { lastPt = null; return; }
    if (!lastPt || Math.hypot(x - lastPt.x, y - lastPt.y) > 56) {
      dropIcon(x, y);
      lastPt = { x, y };
    }
  });
  photo.addEventListener('pointerleave', () => { lastPt = null; });
}

// ---- Reveal on scroll ----
const io = new IntersectionObserver(list => {
  list.forEach(en => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in');
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 3) * 90 + 'ms';
  io.observe(el);
});

// ---- Wordmark hides once you scroll down ----
let lastSY = 0;
function onScrollMark() {
  const y = scrollY;
  document.body.classList.toggle('scrolled', y > 60);
  // menu button: only shown at the very top (with the KITKAT.PF mark)
  document.body.classList.toggle('nav-hide', y >= 80);
  lastSY = y;
}
addEventListener('scroll', onScrollMark, { passive: true });
onScrollMark();

// ---- Picture viewer: certificates, project shots, art and photos. Prev/next stay inside the clicked group. ----
const lbAll = [...document.querySelectorAll('[data-lb]')];
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbVid = document.getElementById('lbVid');
const lbCap = document.getElementById('lbCap');
let certs = [], current = 0, opener = null;
function showCert(i) {
  current = (i + certs.length) % certs.length;
  const a = certs[current];
  const isVid = a.dataset.type === 'video';
  lbVid.pause();
  if (isVid) {
    lbImg.style.display = 'none'; lbVid.style.display = 'block';
    lbVid.src = a.getAttribute('href'); lbVid.play().catch(() => {});
  } else {
    lbVid.style.display = 'none'; lbVid.removeAttribute('src'); lbVid.load();
    lbImg.style.display = ''; lbImg.src = a.getAttribute('href');
  }
  lbImg.alt = a.dataset.title || '';
  lbCap.textContent = a.dataset.title || '';
}
function openCert(group, from, force) {
  if (!force && window.openFancy && window.openFancy(group, from)) return;
  opener = from;
  certs = lbAll.filter(el => el.dataset.lb === group);
  const multi = certs.length > 1;
  document.getElementById('lbPrev').style.display = multi ? '' : 'none';
  document.getElementById('lbNext').style.display = multi ? '' : 'none';
  showCert(certs.indexOf(from));
  lb.classList.add('open');
  document.body.classList.add('viewing');
  document.body.style.overflow = 'hidden';
  document.getElementById('lbClose').focus();
}
function closeCert() {
  lbVid.pause();
  lb.classList.remove('open');
  document.body.classList.remove('viewing');
  document.body.style.overflow = '';
  if (opener) opener.focus();
}
lbAll.forEach(a => a.addEventListener('click', e => { e.preventDefault(); openCert(a.dataset.lb, a); }));
document.getElementById('lbClose').addEventListener('click', closeCert);
document.getElementById('lbPrev').addEventListener('click', () => showCert(current - 1));
document.getElementById('lbNext').addEventListener('click', () => showCert(current + 1));
lb.addEventListener('click', e => { if (e.target === lb) closeCert(); });
addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeCert();
  if (e.key === 'ArrowLeft') showCert(current - 1);
  if (e.key === 'ArrowRight') showCert(current + 1);
});


// ---- About: lyrics-style highlight. Grey = not read, red = being read, ink = read ----
(function () {
  const p = document.getElementById('lyrics');
  if (!p) return;
  const chars = [];
  const full = [];
  p.querySelectorAll('p').forEach(para => {
    const text = para.textContent.trim().replace(/\s+/g, ' ');
    full.push(text);
    const vis = document.createElement('span'); vis.setAttribute('aria-hidden', 'true');
    const words = text.split(' ');
    words.forEach((word, wi) => {
      const w = document.createElement('span'); w.className = 'w';
      for (const ch of word) { const c = document.createElement('span'); c.textContent = ch; w.appendChild(c); chars.push(c); }
      vis.appendChild(w);
      if (wi < words.length - 1) vis.appendChild(document.createTextNode(' '));
    });
    const sr = document.createElement('span'); sr.className = 'sr'; sr.textContent = text;
    para.textContent = ''; para.append(sr, vis);
  });

  const OFF = 'rgb(201,197,190)', INK = [21, 20, 26], RED = [224, 38, 43];
  const mix = (a, b, t) => 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',') + ')';
  const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
  const TRAIL = 60;   // characters behind the frontier that fade from red back to ink

  function paint() {
    const vh = innerHeight, r = p.getBoundingClientRect();
    const prog = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.35 + r.height)));
    const pos = prog * (chars.length + TRAIL);
    for (let i = 0; i < chars.length; i++) {
      const d = pos - i;
      let col;
      if (d < 0) col = OFF;
      else {
        col = mix(RED, INK, smooth(18, TRAIL, d));
        if (d < 3) col = d < 0.01 ? OFF : mix([201, 197, 190], RED, smooth(0, 3, d));
      }
      const c = chars[i];
      if (c._c !== col) { c.style.color = col; c._c = col; }
    }
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    chars.forEach(c => c.style.color = 'rgb(21,20,26)');
    return;
  }
  let ticking = false;
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; paint(); }); } }
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  paint();
})();

// ---- Contact: copy email + mailto form ----
(function () {
  const EMAIL = 'grefalkate@gmail.com';
  const status = document.getElementById('status');
  const copyBtn = document.getElementById('copyMail');
  if (copyBtn) copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      copyBtn.textContent = 'Copied';
    } catch (e) {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('mail'));
      const sel = getSelection(); sel.removeAllRanges(); sel.addRange(range);
      copyBtn.textContent = 'Press copy';
    }
    setTimeout(() => copyBtn.textContent = 'Copy', 2000);
  });

  const form = document.getElementById('form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.name.value.trim(), email = form.email.value.trim(), msg = form.msg.value.trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || !msg) {
      status.textContent = 'Please add your name, a valid email and a short message.';
      return;
    }
    const body = 'Name: ' + name + '\nEmail: ' + email + '\nPhone: ' + form.phone.value.trim() +
                 '\nReason: ' + form.reason.value + '\n\n' + msg;
    const subject = 'Portfolio message from ' + name;
    const gmail = 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(EMAIL) + '&su=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    const btn = form.querySelector('button[type=submit]');
    const label = btn.innerHTML;
    btn.disabled = true; btn.textContent = 'Sending...';
    status.textContent = '';
    const fallback = () => {
      status.innerHTML = 'Could not send it directly. <a href="' + gmail + '" target="_blank" rel="noopener" style="text-decoration:underline">Open Gmail with your message</a> or write to ' + EMAIL + '.';
    };
    fetch('https://formsubmit.co/ajax/' + EMAIL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, phone: form.phone.value.trim(), reason: form.reason.value, message: msg, _subject: subject, _replyto: email, _template: 'table', _captcha: 'false' })
    }).then(r => r.json()).then(d => {
      if (d && (d.success === true || d.success === 'true')) {
        status.textContent = 'Message sent. Thank you, ' + name + '! I will reply soon.';
        form.reset();
      } else fallback();
    }).catch(fallback).finally(() => { btn.disabled = false; btn.innerHTML = label; });
  });
})();

// ---- Contact: background video (pauses when off screen) ----
(function () {
  const v = document.getElementById('skyVideo');
  if (!v) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) { v.removeAttribute('autoplay'); v.pause(); return; }
  new IntersectionObserver(es => {
    if (es[0].isIntersecting) { const pr = v.play(); if (pr && pr.catch) pr.catch(() => {}); }
    else v.pause();
  }).observe(v);
})();

// ---- About: click the photo to show or hide the details ----
(function () {
  const btn = document.getElementById('photoBtn');
  const facts = document.getElementById('facts');
  if (!btn || !facts) return;
  btn.addEventListener('click', () => {
    const open = !facts.classList.contains('open');
    facts.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    if (open) setTimeout(() => facts.scrollIntoView({ block: 'nearest', behavior: 'smooth' }), 120);
  });
})();

// ---- Footer wordmark: about 70% of the width, on one line ----
(function () {
  const p = document.querySelector('.foot-word');
  if (!p) return;
  const inner = p.firstElementChild;
  function fit() {
    p.style.fontSize = '100px';
    const w = inner.getBoundingClientRect().width, avail = p.clientWidth;
    if (w > 0 && avail > 0) p.style.fontSize = Math.floor(100 * avail * 0.7 / w) + 'px';
  }
  fit();
  addEventListener('resize', fit);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
})();


// ---- Intro: flip photos inside the box, then reveal the page. Click anywhere or press Esc to skip. ----
(function () {
  const intro = document.getElementById('intro');
  if (!intro) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { intro.remove(); return; }
  const img = document.getElementById('iimg');
  const pics = ['hero', 'about', 'repair', 'hands', 'grad'].map(n => 'images/intro/' + n + '.jpg');
  pics.forEach(s => { const i = new Image(); i.src = s; });
  document.body.classList.add('intro-on');

  // ---- Intro sound effects (synthesised, no audio files). Browsers only allow sound after a tap/key press. ----
  let ac = null;
  try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
  const unlock = () => { if (ac && ac.state === 'suspended') ac.resume(); };
  ['pointerdown', 'keydown', 'touchstart'].forEach(ev => addEventListener(ev, unlock, { passive: true }));
  unlock();
  function noise(dur) {
    const b = ac.createBuffer(1, Math.max(1, ac.sampleRate * dur | 0), ac.sampleRate), d = b.getChannelData(0);
    for (let k = 0; k < d.length; k++) d[k] = Math.random() * 2 - 1;
    const s = ac.createBufferSource(); s.buffer = b; return s;
  }
  function sfx(kind) {
    if (!ac || ac.state !== 'running') return;
    const t = ac.currentTime, g = ac.createGain(); g.connect(ac.destination);
    if (kind === 'whoosh') {            // wipe of a word / curtain going up
      const s = noise(1.0), f = ac.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 0.8;
      f.frequency.setValueAtTime(400, t); f.frequency.exponentialRampToValueAtTime(3200, t + 0.7);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.18, t + 0.25); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
      s.connect(f); f.connect(g); s.start(t); s.stop(t + 1.0);
    } else if (kind === 'pop') {        // the box opening between KIT and KAT
      const o = ac.createOscillator(); o.type = 'sine';
      o.frequency.setValueAtTime(190, t); o.frequency.exponentialRampToValueAtTime(48, t + 0.28);
      g.gain.setValueAtTime(0.5, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
      o.connect(g); o.start(t); o.stop(t + 0.36);
      const s = noise(0.08), f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2500;
      const g2 = ac.createGain(); g2.gain.setValueAtTime(0.18, t); g2.gain.exponentialRampToValueAtTime(0.0001, t + 0.07);
      s.connect(f); f.connect(g2); g2.connect(ac.destination); s.start(t); s.stop(t + 0.09);
    } else if (kind === 'shutter') {    // each photo change
      const s = noise(0.06), f = ac.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 4200; f.Q.value = 1.2;
      g.gain.setValueAtTime(0.28, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
      s.connect(f); f.connect(g); s.start(t); s.stop(t + 0.06);
      const o = ac.createOscillator(); o.type = 'square'; o.frequency.setValueAtTime(900, t + 0.018); o.frequency.exponentialRampToValueAtTime(260, t + 0.07);
      const g3 = ac.createGain(); g3.gain.setValueAtTime(0.0001, t); g3.gain.setValueAtTime(0.07, t + 0.018); g3.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);
      o.connect(g3); g3.connect(ac.destination); o.start(t); o.stop(t + 0.09);
    } else if (kind === 'reveal') {     // intro lifting away
      const o = ac.createOscillator(); o.type = 'triangle';
      o.frequency.setValueAtTime(330, t); o.frequency.exponentialRampToValueAtTime(990, t + 0.5);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.1, t + 0.15); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.7);
      o.connect(g); o.start(t); o.stop(t + 0.75);
      sfx('whoosh');
    }
  }
  let sfxTimers = [];

  let n = 0, timer = null;
  let start, stopFlip, end, begun = false;
  // The animation waits for the first tap, because browsers only allow sound after a tap.
  function begin() {
    if (begun) return; begun = true;
    unlock();
    intro.classList.add('go');
    sfxTimers = [setTimeout(() => sfx('whoosh'), 250)];
    start = setTimeout(() => {
      timer = setInterval(() => { n = (n + 1) % pics.length; img.src = pics[n]; }, 330);
    }, 1500);
    stopFlip = setTimeout(() => clearInterval(timer), 5900);
    end = setTimeout(finish, 7500);
  }
  function finish() {
    clearTimeout(start); clearTimeout(stopFlip); clearTimeout(end); clearInterval(timer); sfxTimers.forEach(clearTimeout);
    document.body.classList.remove('intro-on');
    intro.remove();
  }
  function skip() {
    if (intro.classList.contains('done')) return;
    clearInterval(timer); sfxTimers.forEach(clearTimeout);
    intro.classList.add('done');
    document.body.classList.add('intro-skipped');
    document.body.classList.remove('intro-on');
    setTimeout(finish, 720);
  }
  // tapping the page only unlocks sound; use the Skip button (or Esc) to skip
  document.getElementById('introSkip').addEventListener('click', e => { e.stopPropagation(); skip(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' || e.key === 'Enter') skip(); });
  begin();
})();

// ---- Projects: hover (or tap) a row to reveal its details and photo ----
(function () {
  const rows = [...document.querySelectorAll('.pj')];
  const set = r => rows.forEach(x => x.classList.toggle('active', x === r));
  let lx = -1, ly = -1;
  rows.forEach(r => {
    r.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse') return;
      if (e.clientX === lx && e.clientY === ly) return; // layout shift, not a real move
      lx = e.clientX; ly = e.clientY;
      if (!r.classList.contains('active')) set(r);
    });
    r.addEventListener('focus', () => set(r));
    r.querySelector('.pj-head').addEventListener('click', () => set(r));
  });
})();

// ---- Art Lab: "View full gallery" opens the card-stack viewer directly ----
(function () {
  const b = document.getElementById('galBtn');
  if (!b) return;
  b.addEventListener('click', () => {
    const first = document.querySelector('[data-lb="artall"]');
    if (first && window.openFancy) window.openFancy('artall', first);
  });
})();

// ---- Behind the scenes: sliding photos; the looped copies open the matching original ----
document.querySelectorAll('.bts-track .dup').forEach(d => d.addEventListener('click', e => {
  e.preventDefault();
  document.querySelectorAll('[data-lb="work"]')[+d.dataset.i].click();
}));

// ---- About: photos scattered over the facts. Hold a photo and swipe it away to uncover them. ----
(function () {
  const zone = document.getElementById('scatter');
  if (!zone) return;
  const cards = [...zone.querySelectorAll('.pc')];
  const facts = zone.querySelector('.facts-static');
  const reset = zone.querySelector('.scatter-reset');
  const rnd = (a, b) => a + Math.random() * (b - a);
  let gone = 0, z = 50, lastW = 0;

  function updateFacts() {
    const p = gone / cards.length;
    facts.style.opacity = Math.min(1, Math.max(0, (p - 0.35) / 0.5));
    reset.hidden = gone === 0;
  }
  function place() {
    const zw = zone.clientWidth; lastW = zw;
    const cw = Math.max(112, Math.min(200, zw * 0.19));
    const ch = cw * 1.22;
    zone.style.setProperty('--cw', cw + 'px');
    const cols = Math.max(2, Math.round(zw / (cw * 0.8)));
    const rows = Math.ceil(cards.length / cols);
    const step = ch * (zw < 600 ? 0.58 : 0.64);
    const zh = Math.max(facts.offsetHeight + 40, (rows - 1) * step + ch + 8);
    zone.style.minHeight = zh + 'px';
    const order = cards.slice().sort(() => Math.random() - 0.5);
    order.forEach((c, i) => {
      const col = i % cols, row = Math.floor(i / cols);
      const x = (cols > 1 ? col * (zw - cw) / (cols - 1) : 0) + rnd(-cw * 0.1, cw * 0.1);
      const y = row * step + rnd(-ch * 0.06, ch * 0.06);
      c._p = { x: Math.max(-cw * 0.05, Math.min(zw - cw * 0.95, x)), y: Math.max(0, y), r: rnd(-14, 14) };
      c.dataset.gone = '';
      c.style.transition = 'none';
      c.style.opacity = 1;
      c.style.visibility = '';
      c.style.display = '';
      c.style.zIndex = i + 1;
      c.style.transform = `translate(${c._p.x}px,${c._p.y}px) rotate(${c._p.r}deg)`;
    });
    gone = 0; updateFacts();
  }
  let d = null, moved = false;
  zone.addEventListener('pointerdown', e => {
    const c = e.target.closest('.pc');
    if (!c || c.dataset.gone) return;
    d = { c, x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
    moved = false;
    c.style.zIndex = ++z;
    c.style.transition = 'none';
    try { c.setPointerCapture(e.pointerId); } catch (_) {}
  });
  zone.addEventListener('pointermove', e => {
    if (!d) return;
    d.dx = e.clientX - d.x; d.dy = e.clientY - d.y;
    if (Math.hypot(d.dx, d.dy) > 5) moved = true;
    if (!moved) return;
    const p = d.c._p;
    d.c.style.transform = `translate(${p.x + d.dx}px,${p.y + d.dy}px) rotate(${p.r + d.dx * 0.05}deg)`;
  });
  function end(e) {
    if (!d) return;
    const { c, dx, dy } = d; d = null;
    const p = c._p;
    c.style.transition = 'transform .45s cubic-bezier(.2,.8,.2,1), opacity .45s';
    if (moved && Math.hypot(dx, dy) > 80) {
      const len = Math.hypot(dx, dy) || 1;
      c.dataset.gone = '1';
      c.style.transform = `translate(${p.x + dx / len * 900}px,${p.y + dy / len * 900}px) rotate(${p.r + dx * 0.2}deg)`;
      c.style.opacity = 0;
      gone++; updateFacts();
      setTimeout(() => { if (c.dataset.gone) c.style.display = 'none'; }, 470);
    } else {
      c.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.r}deg)`;
    }
  }
  zone.addEventListener('pointerup', end);
  zone.addEventListener('pointercancel', end);
  zone.addEventListener('dragstart', e => e.preventDefault());
  reset.addEventListener('click', place);
  const wrap = document.getElementById('scatterWrap');
  const closeBtn = wrap.querySelector('.scatter-close');
  document.addEventListener('scatter:open', () => {
    wrap.classList.add('open');
    document.getElementById('about').classList.add('collage-open');
    if (gone === 0 || Math.abs(zone.clientWidth - lastW) > 30) place();
    setTimeout(() => wrap.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120);
  });
  closeBtn.addEventListener('click', () => {
    wrap.classList.remove('open');
    const ab = document.getElementById('about');
    ab.classList.remove('collage-open');
    ab.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  let t;
  addEventListener('resize', () => { clearTimeout(t); t = setTimeout(() => { if (gone === 0 && Math.abs(zone.clientWidth - lastW) > 30) place(); }, 200); });
  place();
})();

// ---- About: pile of polaroids. Hold the top one and swipe it away; click it to open the full collage. ----
(function () {
  const pile = document.getElementById('pile');
  if (!pile) return;
  const cards = [...pile.querySelectorAll('.pc')];
  let order = cards.slice();
  const rnd = (a, b) => a + Math.random() * (b - a);
  const pose = new Map();
  cards.forEach((c, i) => pose.set(c, { x: i === 0 ? 0 : rnd(-26, 26), y: i === 0 ? 0 : rnd(-18, 18), r: i === 0 ? 3 : rnd(-11, 11) }));
  function layout() {
    order.forEach((c, i) => {
      const p = pose.get(c);
      c.style.zIndex = order.length - i;
      c.style.transition = 'transform .5s cubic-bezier(.2,.8,.2,1), opacity .4s';
      c.style.transform = `translate(${p.x}px,${p.y}px) rotate(${p.r}deg)`;
      c.style.opacity = i < 7 ? 1 : 0;
      c.classList.toggle('top', i === 0);
    });
  }
  function fling(dx, dy) {
    const top = order[0];
    const len = Math.hypot(dx, dy) || 1;
    top.style.transition = 'transform .35s ease-in, opacity .35s';
    top.style.transform = `translate(${dx / len * 700}px,${dy / len * 700}px) rotate(${pose.get(top).r + dx * 0.15}deg)`;
    top.style.opacity = 0;
    setTimeout(() => {
      order.push(order.shift());
      pose.set(top, { x: rnd(-26, 26), y: rnd(-18, 18), r: rnd(-11, 11) });
      top.style.transition = 'none';
      top.style.zIndex = 0;
      layout();
    }, 320);
  }
  let drag = null, moved = false;
  pile.addEventListener('pointerdown', e => {
    const top = order[0];
    if (!top.contains(e.target)) return;
    drag = { x: e.clientX, y: e.clientY, dx: 0, dy: 0 };
    moved = false;
    top.style.transition = 'none';
    try { pile.setPointerCapture(e.pointerId); } catch (_) {}
  });
  pile.addEventListener('pointermove', e => {
    if (!drag) return;
    drag.dx = e.clientX - drag.x; drag.dy = e.clientY - drag.y;
    if (Math.hypot(drag.dx, drag.dy) > 6) moved = true;
    if (!moved) return;
    const top = order[0], p = pose.get(top);
    top.style.transform = `translate(${p.x + drag.dx}px,${p.y + drag.dy}px) rotate(${p.r + drag.dx * 0.06}deg)`;
  });
  const end = e => {
    if (!drag) return;
    const { dx, dy } = drag; drag = null;
    if (moved && Math.hypot(dx, dy) > 70) fling(dx, dy);
    else { layout(); if (!moved && e.type === 'pointerup') document.dispatchEvent(new Event('scatter:open')); }
  };
  pile.addEventListener('pointerup', end);
  pile.addEventListener('pointercancel', end);
  pile.addEventListener('dragstart', e => e.preventDefault());
  pile.addEventListener('keydown', e => { if (e.key === 'ArrowRight') fling(1, 0.2); if (e.key === 'ArrowLeft') fling(-1, 0.2); });
  layout();
})();

// ---- Case study pages (open from a project, hash #case-xxx) ----
(function () {
  const wrap = document.getElementById('cases');
  if (!wrap) return;
  const arts = [...wrap.querySelectorAll('.case')];
  let lastY = 0, opener = null;
  function show(id, push) {
    const a = document.getElementById('case-' + id);
    if (!a) return;
    if (wrap.hidden) { lastY = scrollY; opener = document.activeElement; }
    arts.forEach(x => { x.hidden = x !== a; x.querySelectorAll('video').forEach(v => { if (x !== a) v.pause(); }); });
    wrap.hidden = false;
    wrap.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    if (push && location.hash !== '#case-' + id) { try { history.pushState(null, '', '#case-' + id); } catch (_) {} }
  }
  function hide(push) {
    if (wrap.hidden) return;
    wrap.querySelectorAll('video').forEach(v => v.pause());
    wrap.hidden = true;
    document.body.style.overflow = '';
    window.scrollTo(0, lastY);
    if (push && location.hash.startsWith('#case-')) { try { history.pushState(null, '', location.pathname + location.search); } catch (_) {} }
  }
  document.querySelectorAll('[data-case]').forEach(b => b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); window.pageGo(() => show(b.dataset.case, true)); }));
  document.getElementById('casesClose').addEventListener('click', () => window.pageGo(() => hide(true)));
  window.__closeCase = () => { if (!wrap.hidden) hide(true); };
  document.getElementById('casesClose').addEventListener('keydown', e => { if (e.key === 'Enter') window.pageGo(() => hide(true)); });
  document.getElementById('casesMenu').addEventListener('click', () => document.getElementById('burger').click());
  addEventListener('keydown', e => { if (e.key === 'Escape' && !wrap.hidden && !document.getElementById('lightbox').classList.contains('open')) hide(true); }, true);
  addEventListener('hashchange', () => {
    const m = location.hash.match(/^#case-(\w+)$/);
    if (m) show(m[1], false); else hide(false);
  });
  const m0 = location.hash.match(/^#case-(\w+)$/);
  if (m0) show(m0[1], false);
})();

// ---- Fancy viewers: card stack for Design & art, tilted vertical flow for certificates ----
(function () {
  const all = [...document.querySelectorAll('[data-lb]')];
  const ov = document.createElement('div');
  ov.className = 'fv'; ov.hidden = true;
  ov.innerHTML = '<button class="fv-close" type="button" aria-label="Close">×</button><div class="fv-stage"></div><div class="fv-side fv-l"></div><div class="fv-side fv-r"></div><div class="fv-foot"></div>';
  document.body.appendChild(ov);
  const stage = ov.querySelector('.fv-stage'), left = ov.querySelector('.fv-l'), right = ov.querySelector('.fv-r'), foot = ov.querySelector('.fv-foot');
  let mode = '', items = [], cards = [], i = 0, busy = false, opener = null, lock = 0;
  const pad = n => String(n).padStart(2, '0');

  function build() {
    stage.innerHTML = '';
    cards = items.map(a => {
      const c = document.createElement('div'); c.className = 'fv-card';
      const im = document.createElement('img'); im.src = a.getAttribute('href'); im.alt = a.dataset.title || ''; im.draggable = false;
      const fit = () => {
        const ar = im.naturalWidth / im.naturalHeight || 1.4;
        const st = getComputedStyle(ov);
        const mw = mode === 'stack' ? Math.min(innerWidth * 0.86, 820) : Math.min(innerWidth * (innerWidth < 720 ? 0.84 : 0.6), 1160);
        const mh = mode === 'stack' ? Math.min(innerHeight * (innerWidth < 720 ? 0.64 : 0.78), 860) : Math.min(innerHeight * (innerWidth < 720 ? 0.28 : 0.54), 640);
        let w = mw, hh = w / ar; if (hh > mh) { hh = mh; w = hh * ar; }
        c.style.width = w + 'px'; c.style.height = hh + 'px';
      };
      im.addEventListener('load', fit); if (im.complete) fit();
      c.appendChild(im); stage.appendChild(c); return c;
    });
  }
  function info() {
    const a = items[i], t = a.dataset.title || '';
    if (mode === 'stack') {
      left.innerHTML = '<span>Design</span><span>&amp; art</span>';
      right.innerHTML = '<span>' + pad(i + 1) + ' / ' + pad(items.length) + '</span>';
      foot.textContent = t + '  ·  click, scroll or swipe for the next';
    } else {
      const time = a.querySelector('time');
      left.innerHTML = '<b class="n">' + pad(i + 1) + '</b><i></i><h3>' + t + '</h3><p>' + (time ? time.textContent : '') + '</p>';
      right.innerHTML = '<span>Training</span><span>&amp;</span><span>certificates</span>';
      foot.textContent = 'Scroll, swipe or use the arrow keys  ·  click the middle one to zoom';
    }
  }
  const OUT = 'translate(0,72vh) rotate(-9deg)';
  function render(skip) {
    const n = cards.length;
    cards.forEach((c, k) => {
      if (c === skip) return;
      if (mode === 'stack') {
        const rel = (k - i + n) % n;
        c.style.zIndex = n - rel;
        c.style.transform = 'translateY(' + (-rel * 26) + 'px) scale(' + (1 - rel * 0.05) + ')';
        c.style.opacity = rel > 3 ? 0 : 1 - rel * 0.22;
        c.style.pointerEvents = rel === 0 ? 'auto' : 'none';
      } else {
        const rel = k - i, ar = Math.abs(rel);
        const mob = innerWidth < 720;
        const step = ((cards[i] && cards[i].offsetHeight) || 300) * (mob ? 0.62 : 0.7);
        c.style.zIndex = 10 - ar;
        c.style.transform = 'translateY(' + (rel * step) + 'px) ' + (rel ? 'rotateX(' + (rel < 0 ? 52 : -52) + 'deg) scale(' + (1 - Math.min(ar, 2) * 0.04) + ')' : '');
        c.style.opacity = ar > 2 ? 0 : ar === 2 ? 0.45 : ar === 1 ? 0.85 : 1;
        c.style.pointerEvents = ar > 2 ? 'none' : 'auto';
      }
    });
    info();
  }
  function go(d) {
    if (busy || !cards.length) return;
    const n = cards.length;
    if (mode === 'stack') {
      busy = true;
      if (d > 0) {
        const old = cards[i];
        old.style.zIndex = 99; old.style.transform = OUT; old.style.opacity = 0;
        i = (i + 1) % n; render(old);
        setTimeout(() => { old.style.transition = 'none'; render(); void old.offsetWidth; old.style.transition = ''; busy = false; }, 520);
      } else {
        i = (i - 1 + n) % n;
        const c = cards[i];
        c.style.transition = 'none'; c.style.zIndex = 99; c.style.transform = OUT; c.style.opacity = 0; void c.offsetWidth; c.style.transition = '';
        render(); setTimeout(() => { busy = false; }, 520);
      }
    } else {
      const ni = i + d;
      if (ni < 0 || ni >= n) return;
      i = ni; render(); busy = true; setTimeout(() => { busy = false; }, 380);
    }
  }
  window.openFancy = function (group, from) {
    if (group === 'art' || group === 'artall') mode = 'stack';
    else if (group === 'certs') mode = 'flow';
    else return false;
    items = all.filter(el => el.dataset.lb === group);
    i = Math.max(0, items.indexOf(from));
    opener = from; ov.className = 'fv fv-' + mode; ov.hidden = false;
    build(); cards.forEach(c => { c.style.transition = 'none'; });
    render(); void ov.offsetWidth; cards.forEach(c => { c.style.transition = ''; });
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => ov.classList.add('on'));
    return true;
  };
  function close() {
    ov.classList.remove('on'); ov.hidden = true; stage.innerHTML = '';
    document.body.style.overflow = '';
    if (opener) opener.focus && opener.focus();
  }
  ov.querySelector('.fv-close').addEventListener('click', close);
  stage.addEventListener('click', e => {
    const c = e.target.closest('.fv-card'); if (!c || moved) return;
    const k = cards.indexOf(c);
    if (mode === 'stack') { if (k === i) go(1); }
    else if (k === i) openCert('certs', items[i], true);
    else go(k - i);
  });
  addEventListener('keydown', e => {
    if (ov.hidden) return;
    if (e.key === 'Escape') { close(); e.stopImmediatePropagation(); }
    else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') go(1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') go(-1);
  }, true);
  ov.addEventListener('wheel', e => {
    e.preventDefault();
    const now = Date.now(); if (now - lock < 450 || Math.abs(e.deltaY) < 8) return;
    lock = now; go(e.deltaY > 0 ? 1 : -1);
  }, { passive: false });
  let sx = 0, sy = 0, moved = false, down = false;
  ov.addEventListener('pointerdown', e => { down = true; moved = false; sx = e.clientX; sy = e.clientY; });
  ov.addEventListener('pointerup', e => {
    if (!down) return; down = false;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    if (Math.hypot(dx, dy) > 40) { moved = true; setTimeout(() => { moved = false; }, 50); go((mode === 'flow' ? dy : (Math.abs(dy) > Math.abs(dx) ? dy : dx)) < 0 ? 1 : -1); }
  });
})();
