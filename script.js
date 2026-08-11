// ════════════════════════════════════════════════════════════
// ZAB HAIR STUDIO: PAGE LOGIC
// You shouldn't need to edit this file. Everything you can
// change lives in content.js.
//
// Guiding rule of this build: nothing on the page ever tells a
// visitor that something is missing. If content.js has no value
// for a piece, that piece removes itself and the layout closes
// up. There are no "TBD" states in the visitor-facing site.
// ════════════════════════════════════════════════════════════

const PAGES = ['home','services','about','coaching','media'];
const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const C = typeof CONTENT !== 'undefined' ? CONTENT : {};

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));

/* Each feature boots independently. If one throws (a missing
   element, a browser quirk) it's logged and skipped. It can
   never take down the features wired up after it. */
function boot(name, fn) {
  try { fn(); } catch (err) { console.error(`Zab site: "${name}" failed:`, err); }
}

/* ══════════════════════════════════════════
   IMAGE PATHS
   A bare filename resolves inside images/.
   A full https:// link, or a path already
   starting with images/ or /, is used as-is.
══════════════════════════════════════════ */
function imgPath(v) {
  if (!v) return '';
  if (/^https?:\/\//i.test(v) || v.startsWith('images/') || v.startsWith('/')) return v;
  return 'images/' + v;
}

function photoEntry(key) {
  const p = C.photos && C.photos[key];
  return p && p.src ? p : null;
}

/* Fills a .shot element with its photo. If the file is missing or
   fails to load, the frame quietly falls back to its textured
   empty state instead of showing a broken-image icon. */
function fillShot(el, key, opts = {}) {
  if (!el) return;
  const entry = photoEntry(key);
  if (!entry) { el.classList.add('is-empty'); return; }
  const img = new Image();
  img.src = imgPath(entry.src);
  // Inside a gallery tile the button already carries the label,
  // so the image itself is decorative. Otherwise a screen reader
  // announces the same photo twice.
  img.alt = el.hasAttribute('data-decorative') ? '' : (entry.alt || '');
  img.draggable = false;
  img.decoding = 'async';
  if (opts.eager) { img.loading = 'eager'; img.fetchPriority = 'high'; }
  else img.loading = 'lazy';
  img.addEventListener('error', () => { img.remove(); el.classList.add('is-empty'); }, { once: true });
  el.prepend(img);
}

/* ══════════════════════════════════════════
   ROUTER
══════════════════════════════════════════ */
function go(id, push = true) {
  if (!PAGES.includes(id)) id = 'home';
  const next = document.getElementById('pg-' + id);
  const current = $('.pg.on');
  if (!next) return;

  $$('[data-page]').forEach(l => l.classList.toggle('on', l.dataset.page === id));
  document.body.classList.toggle('solid-nav', id !== 'home');

  const activate = () => {
    PAGES.forEach(p => {
      const el = document.getElementById('pg-' + p);
      if (el) el.classList.toggle('on', p === id);
    });
    window.scrollTo(0, 0);
    replayReveals();
    onScroll();
  };

  if (REDUCE || !current || current === next) {
    activate();
  } else {
    current.style.cssText = 'transition:opacity .15s ease;opacity:0';
    setTimeout(() => {
      current.style.cssText = '';
      activate();
      next.style.cssText = 'opacity:0';
      requestAnimationFrame(() => {
        next.style.cssText = 'transition:opacity .25s ease;opacity:1';
        setTimeout(() => { next.style.cssText = ''; }, 300);
      });
    }, 150);
  }

  if (push) { try { history.pushState({ page: id }, '', '#' + id); } catch (e) {} }
}

function initRouter() {
  // One delegated handler for every in-site link on the page,
  // including ones rendered later from content.js.
  document.addEventListener('click', e => {
    const link = e.target.closest('[data-page]');
    if (!link) return;
    e.preventDefault();
    go(link.dataset.page);
    if (link.hasAttribute('data-mobclose') || $('#navmob').classList.contains('open')) closeMob();
  });

  document.addEventListener('click', e => {
    const btn = e.target.closest('[data-scrollto]');
    if (!btn) return;
    const t = document.getElementById(btn.dataset.scrollto);
    if (t) t.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'start' });
  });

  window.addEventListener('popstate', () => go(location.hash.replace('#',''), false));
  const h = location.hash.replace('#','');
  if (PAGES.includes(h) && h !== 'home') go(h, false);
  else document.body.classList.toggle('solid-nav', false);
}

/* ══════════════════════════════════════════
   MOBILE MENU
══════════════════════════════════════════ */
const burg = $('#burg');
function closeMob() {
  $('#navmob').classList.remove('open');
  burg.setAttribute('aria-expanded', 'false');
  burg.setAttribute('aria-label', 'Open menu');
  document.body.style.overflow = '';
}
function initMob() {
  burg.addEventListener('click', () => {
    const open = $('#navmob').classList.toggle('open');
    burg.setAttribute('aria-expanded', String(open));
    burg.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && $('#navmob').classList.contains('open')) closeMob();
  });
}

/* ══════════════════════════════════════════
   SCROLL STATE
══════════════════════════════════════════ */
function onScroll() {
  const y = window.scrollY;
  $('#navbar').classList.toggle('solid', y > 40);
  $('#stt').classList.toggle('show', y > 600);
  // The sticky book bar only appears once the visitor has moved
  // past the hero. The hero already has its own Book button, and
  // stacking two identical CTAs on first paint looks desperate.
  $('#bookbar').classList.toggle('show', y > window.innerHeight * 0.6);
}
function initScroll() {
  let tick = false;
  window.addEventListener('scroll', () => {
    if (tick) return;
    tick = true;
    requestAnimationFrame(() => { onScroll(); tick = false; });
  }, { passive: true });
  $('#stt').addEventListener('click', () => window.scrollTo({ top: 0, behavior: REDUCE ? 'auto' : 'smooth' }));
  onScroll();
}

/* ══════════════════════════════════════════
   REVEAL ON SCROLL
══════════════════════════════════════════ */
let revealObserver;
function initReveal() {
  if (REDUCE || !('IntersectionObserver' in window)) {
    $$('.rv, .expect-cell').forEach(el => el.classList.add('in'));
    return;
  }
  revealObserver = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); revealObserver.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  observeReveals();
}
function observeReveals() {
  if (!revealObserver) { $$('.rv:not(.in), .expect-cell:not(.in)').forEach(el => el.classList.add('in')); return; }
  $$('.rv:not(.in), .expect-cell:not(.in)').forEach(el => revealObserver.observe(el));
}
// On page switch, anything already scrolled past should show immediately.
function replayReveals() {
  requestAnimationFrame(() => {
    $$('.pg.on .rv:not(.in), .pg.on .expect-cell:not(.in)').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight * 0.92) el.classList.add('in');
    });
    observeReveals();
  });
}

/* ══════════════════════════════════════════
   HOURS / LIVE STATUS
══════════════════════════════════════════ */
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
function fmt(h, m) {
  const p = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return m === 0 ? `${h12}${p}` : `${h12}:${String(m).padStart(2,'0')}${p}`;
}
function studioStatus() {
  const hours = C.hours || {};
  if (!Object.values(hours).some(v => v)) return null;
  const now = new Date();
  const today = hours[now.getDay()];
  const nowM = now.getHours() * 60 + now.getMinutes();

  if (today) {
    const [oh, om] = today[0].split(':').map(Number);
    const [ch, cm] = today[1].split(':').map(Number);
    if (nowM >= oh * 60 + om && nowM < ch * 60 + cm) return { text: `Open now until ${fmt(ch, cm)}`, open: true };
    if (nowM < oh * 60 + om) return { text: `Opens today at ${fmt(oh, om)}`, open: false };
  }
  // Closed for the day, so find the next day that isn't.
  for (let i = 1; i <= 7; i++) {
    const d = (now.getDay() + i) % 7;
    if (hours[d]) {
      const [oh, om] = hours[d][0].split(':').map(Number);
      return { text: `Closed. Opens ${i === 1 ? 'tomorrow' : DAYS[d]} at ${fmt(oh, om)}`, open: false };
    }
  }
  return { text: 'Closed', open: false };
}
function hoursSummary() {
  const hours = C.hours || {};
  const rows = [];
  for (let i = 0; i < 7; i++) {
    const e = hours[i];
    rows.push({ day: i, label: e ? `${fmt(...e[0].split(':').map(Number))}–${fmt(...e[1].split(':').map(Number))}` : 'Closed' });
  }
  const groups = [];
  rows.forEach(r => {
    const last = groups[groups.length - 1];
    if (last && last.label === r.label) last.end = r.day;
    else groups.push({ start: r.day, end: r.day, label: r.label });
  });
  return groups
    .filter(g => g.label !== 'Closed' || groups.length > 1)
    .map(g => `${g.start === g.end ? DAYS[g.start] : DAYS[g.start] + '–' + DAYS[g.end]} ${g.label}`)
    .join(',   ');
}
function applyStatus() {
  const s = studioStatus();
  $$('[data-status]').forEach(el => {
    if (!s) { el.hidden = true; return; }
    el.classList.toggle('is-open', s.open);
    const t = el.querySelector('[data-status-text]');
    if (t) t.textContent = s.text;
  });
}

/* ══════════════════════════════════════════
   LINKS: BOOKING, PHONE, SOCIAL, ADDRESS
══════════════════════════════════════════ */
function applyLinks() {
  const url = C.bookingUrl || '';
  $$('[data-book]').forEach(a => {
    if (url) a.href = url;
    else a.hidden = true;
  });

  const L = C.links || {};
  if (L.phone) {
    const tel = 'tel:' + L.phone.replace(/[^\d+]/g, '');
    $$('[data-phone-link]').forEach(a => {
      a.href = tel;
      a.hidden = false;
      if (a.closest('#bookbar')) a.textContent = 'Call';
      else if (a.textContent.trim() === '' || /call/i.test(a.textContent)) a.textContent = 'Call ' + L.phone;
    });
  }

  const S = C.social || {};
  const names = { instagram: 'Instagram', youtube: 'YouTube', tiktok: 'TikTok', facebook: 'Facebook' };
  const html = Object.keys(names).filter(k => S[k])
    .map(k => `<a href="${esc(S[k])}" target="_blank" rel="noopener noreferrer">${names[k]}</a>`).join('');
  $$('[data-soc-links]').forEach(el => { el.innerHTML = html; });
}

function applyLocation() {
  const L = C.links || {};
  if (!L.addressLine1) return;
  const oneLine = [L.addressLine1, L.addressLine2, `${L.city}, ${L.state} ${L.zip}`].filter(Boolean).join(', ');
  const q = encodeURIComponent(oneLine);
  const dir = `https://www.google.com/maps/dir/?api=1&destination=${q}`;

  $$('[data-address-inline]').forEach(el => { el.textContent = oneLine; });
  const a = $('[data-address]');
  if (a) a.innerHTML = `${esc(L.addressLine1)}${L.addressLine2 ? ', ' + esc(L.addressLine2) : ''}<br>${esc(L.city)}, ${esc(L.state)} ${esc(L.zip)}`;

  const hl = $('[data-hours-list]');
  if (hl) hl.textContent = hoursSummary();

  if (L.parkingNote) {
    const p = $('[data-parking]');
    if (p) { p.textContent = L.parkingNote; $('[data-parking-line]').hidden = false; }
  }

  const map = $('[data-map-embed]');
  if (map) map.src = `https://www.google.com/maps?q=${q}&output=embed`;
  $$('[data-directions-link]').forEach(el => { el.href = dir; });
}

/* Keeps Google's copy of the address/phone in sync with content.js
   so editing one file can't silently leave the search listing stale. */
function applyStructuredData() {
  const L = C.links || {};
  const s = $('#ld-business');
  if (!s) return;
  let d;
  try { d = JSON.parse(s.textContent); } catch (e) { return; }
  if (L.phone) d.telephone = L.phone;
  if (L.addressLine1) {
    d.address = Object.assign(d.address || { '@type': 'PostalAddress' }, {
      streetAddress: [L.addressLine1, L.addressLine2].filter(Boolean).join(', '),
      addressLocality: L.city, addressRegion: L.state, postalCode: L.zip
    });
  }
  if (C.bookingUrl) {
    // Lets Google surface a "Book" action directly in the listing.
    d.potentialAction = {
      '@type': 'ReserveAction',
      target: { '@type': 'EntryPoint', urlTemplate: C.bookingUrl, actionPlatform: ['http://schema.org/DesktopWebPlatform','http://schema.org/MobileWebPlatform'] },
      result: { '@type': 'Reservation', name: 'Barber appointment' }
    };
  }
  const pad = t => t.split(':').map((n, i) => i === 0 ? String(n).padStart(2,'0') : n).join(':');
  const hours = C.hours || {};
  const spec = [];
  const dayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  for (let i = 0; i < 7; i++) {
    if (hours[i]) spec.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: dayNames[i], opens: pad(hours[i][0]), closes: pad(hours[i][1]) });
  }
  if (spec.length) d.openingHoursSpecification = spec;
  const svc = (C.services || []).filter(x => !x.soon);
  if (svc.length) {
    d.hasOfferCatalog = {
      '@type': 'OfferCatalog', name: 'Services',
      itemListElement: svc.map(x => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: x.name }, ...(x.price ? { price: x.price.replace(/[^0-9.]/g,''), priceCurrency: 'USD' } : {}) }))
    };
  }
  s.textContent = JSON.stringify(d);
}

/* ══════════════════════════════════════════
   FOOTER: one template, injected everywhere
══════════════════════════════════════════ */
function applyFooter() {
  const S = C.social || {};
  const socRows = [['instagram','Instagram'],['youtube','YouTube'],['tiktok','TikTok'],['facebook','Facebook']]
    .filter(([k]) => S[k])
    .map(([k,l]) => `<a href="${esc(S[k])}" target="_blank" rel="noopener noreferrer">${l}</a>`).join('');

  const html = `
    <footer>
      <div class="f-in">
        <div class="f-col">
          <a class="f-logo" href="#home" data-page="home">ZAB<span class="dot">.</span></a>
          <span class="f-motto">"I have your new style."</span>
          <span class="status-pill" data-status><span class="status-dot"></span><span data-status-text></span></span>
        </div>
        <div class="f-col">
          <p class="f-h">Visit</p>
          <a data-directions-link data-address-inline href="#" target="_blank" rel="noopener noreferrer"></a>
          <p data-hours-list></p>
          <a data-phone-link href="#" hidden></a>
        </div>
        <div class="f-col">
          <p class="f-h">Follow</p>
          ${socRows}
        </div>
      </div>
      <div class="f-bar">
        <a class="btn-fill btn-sm" data-book href="#" target="_blank" rel="noopener noreferrer">Book Now</a>
        <span class="f-copy">© ${new Date().getFullYear()} Zab Hair Studio, Newtown Square PA</span>
      </div>
    </footer>`;
  $$('[data-footer]').forEach(el => { el.innerHTML = html; });
}

/* ══════════════════════════════════════════
   HOME: HERO
══════════════════════════════════════════ */
function applyHero() {
  const H = C.hero || {};
  if (H.eyebrow) $('[data-hero-eyebrow]').textContent = H.eyebrow;
  if (H.headline) {
    const [first, ...rest] = H.headline.split('\n');
    $('[data-hero-headline]').innerHTML = esc(first) + (rest.length ? `<em>${esc(rest.join(' '))}</em>` : '');
  }
  if (H.sub) $('[data-hero-sub]').textContent = H.sub;

  const media = $('[data-hero-media]');
  if (!media) return;

  const tall = photoEntry(H.photo) || photoEntry('fig01');
  const wide = photoEntry(H.photoWide);   // optional, blank by default
  const poster = tall || wide;

  if (H.video && !REDUCE) {
    const v = document.createElement('video');
    ['muted','loop','playsinline','autoplay','disablepictureinpicture'].forEach(a => v.setAttribute(a, ''));
    v.muted = v.loop = v.playsInline = v.autoplay = true;
    if (poster) v.poster = imgPath(poster.src);
    v.src = imgPath(H.video);
    v.addEventListener('error', () => { v.remove(); heroPicture(media, wide, tall); }, { once: true });
    media.appendChild(v);
    v.play().catch(() => {});
  } else {
    heroPicture(media, wide, tall);
  }
}

/* Usually one photo. If content.js also names a landscape crop
   under hero.photoWide, wide screens get that one and phones
   keep the portrait. Otherwise the single photo is used
   everywhere and CSS handles the framing. */
function heroPicture(media, wide, tall) {
  if (!wide && !tall) return;
  const pic = document.createElement('picture');
  if (wide && tall && wide !== tall) {
    const src = document.createElement('source');
    src.media = '(min-width: 900px)';
    src.srcset = imgPath(wide.src);
    pic.appendChild(src);
  }
  const img = document.createElement('img');
  const main = tall || wide;
  img.src = imgPath(main.src);
  img.alt = '';
  img.loading = 'eager';
  img.fetchPriority = 'high';
  img.decoding = 'async';
  img.draggable = false;
  pic.appendChild(img);
  media.appendChild(pic);
}

function applyStats() {
  const stats = (C.stats || []).filter(s => s && s.num);
  const wrap = $('[data-stats]');
  if (!wrap) return;
  if (!stats.length) { wrap.remove(); return; }
  wrap.style.gridTemplateColumns = `repeat(${Math.min(stats.length, 4)},1fr)`;
  wrap.innerHTML = stats.map(s => `
    <div class="trust-cell">
      <span class="trust-num">${esc(s.num)}</span>
      <span class="trust-lbl">${esc(s.label)}</span>
    </div>`).join('');
}

/* ══════════════════════════════════════════
   HOME: GALLERY GRID + LIGHTBOX
══════════════════════════════════════════ */
let lbItems = [], lbIndex = 0, lbLastFocus = null;

function applyGallery() {
  const wrap = $('[data-gallery]');
  if (!wrap) return;
  const items = (C.gallery || []).filter(g => photoEntry(g.photo));
  if (!items.length) { wrap.closest('section').remove(); return; }
  lbItems = items.map(g => ({ src: imgPath(photoEntry(g.photo).src), alt: photoEntry(g.photo).alt || '', label: g.label || '' }));

  wrap.innerHTML = items.map((g, i) => `
    <button class="tile" data-lb="${i}" aria-label="View ${esc(g.label || 'photo')} larger">
      <span class="shot" data-photo="${esc(g.photo)}" data-decorative></span>
      <span class="tile-cap">${esc(g.label || '')}</span>
    </button>`).join('');

  wrap.addEventListener('click', e => {
    const t = e.target.closest('[data-lb]');
    if (t) openLb(Number(t.dataset.lb), t);
  });
}

function openLb(i, trigger) {
  if (!lbItems.length) return;
  lbLastFocus = trigger || document.activeElement;
  lbIndex = (i + lbItems.length) % lbItems.length;
  const it = lbItems[lbIndex];
  $('#lb-img').src = it.src;
  $('#lb-img').alt = it.alt;
  $('#lb-cap').innerHTML = `${esc(it.label)}<b>${lbIndex + 1} / ${lbItems.length}</b>`;
  $('#lb').classList.add('open');
  document.body.style.overflow = 'hidden';
  $('#lb-close').focus();
  $$('.lb-prev, .lb-next').forEach(b => { b.hidden = lbItems.length < 2; });
}
function closeLb() {
  $('#lb').classList.remove('open');
  document.body.style.overflow = '';
  if (lbLastFocus) lbLastFocus.focus();
}
function initLightbox() {
  $('#lb-close').addEventListener('click', closeLb);
  $('#lb-prev').addEventListener('click', () => openLb(lbIndex - 1, lbLastFocus));
  $('#lb-next').addEventListener('click', () => openLb(lbIndex + 1, lbLastFocus));
  $('#lb').addEventListener('click', e => { if (e.target.id === 'lb' || e.target.id === 'lb-img') closeLb(); });
  document.addEventListener('keydown', e => {
    if (!$('#lb').classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') openLb(lbIndex - 1, lbLastFocus);
    if (e.key === 'ArrowRight') openLb(lbIndex + 1, lbLastFocus);
  });
  // Swipe on touch devices.
  let x0 = null;
  $('#lb').addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  $('#lb').addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 55) openLb(lbIndex + (dx < 0 ? 1 : -1), lbLastFocus);
    x0 = null;
  }, { passive: true });
}

/* ══════════════════════════════════════════
   SERVICES
══════════════════════════════════════════ */
function priceHtml(s) {
  if (s.price) return `<span class="menu-price">${esc(s.price)}</span>`;
  return `<span class="menu-price is-tba">See rates</span>`;
}

function applyMenu() {
  const services = (C.services || []).filter(s => s && s.name);
  $$('[data-menu]').forEach(wrap => {
    const limit = wrap.dataset.menuLimit ? Number(wrap.dataset.menuLimit) : services.length;
    const list = services.slice(0, limit);
    if (!list.length) { wrap.closest('section')?.remove(); return; }
    wrap.innerHTML = list.map(s => `
      <div class="menu-row${s.soon ? ' is-soon' : ''}">
        <div class="menu-main">
          <h3 class="menu-name">${esc(s.name)}${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ''}${s.soon ? '<span class="tag tag--mute">Coming Soon</span>' : ''}</h3>
          ${s.desc ? `<p class="menu-desc">${esc(s.desc)}</p>` : ''}
        </div>
        <div class="menu-meta">
          ${s.soon ? '' : priceHtml(s)}
          ${s.duration ? `<span class="menu-dur">${esc(s.duration)}</span>` : ''}
        </div>
        ${s.soon ? '' : `<a class="btn-out btn-sm" data-book href="#" target="_blank" rel="noopener noreferrer">Book</a>`}
      </div>`).join('');
  });
}

function applyServiceCards() {
  const wrap = $('[data-service-cards]');
  if (!wrap) return;
  const services = (C.services || []).filter(s => s && s.name);
  if (!services.length) { wrap.remove(); return; }
  wrap.innerHTML = services.map(s => `
    <article class="sv-card${s.soon ? ' is-soon' : ''}">
      ${s.photo && photoEntry(s.photo) ? `<div class="shot shot--tall" data-photo="${esc(s.photo)}"></div>` : '<div class="shot shot--tall is-empty"></div>'}
      <div class="sv-card-body">
        <h2 class="sv-card-name">${esc(s.name)}${s.tag ? `<span class="tag">${esc(s.tag)}</span>` : ''}${s.soon ? '<span class="tag tag--mute">Coming Soon</span>' : ''}</h2>
        ${s.desc ? `<p class="sv-card-desc">${esc(s.desc)}</p>` : ''}
        <div class="sv-card-foot">
          <div class="sv-card-price">
            ${s.soon ? '<span class="sv-note">Not bookable yet</span>' : priceHtml(s)}
            ${s.duration ? `<span class="menu-dur">${esc(s.duration)}</span>` : ''}
          </div>
          ${s.soon ? '' : `<a class="btn-dk btn-sm" data-book href="#" target="_blank" rel="noopener noreferrer">Book →</a>`}
        </div>
      </div>
    </article>`).join('');

  // If every service already carries a price, the "rates live on
  // Square" note is redundant, so drop it.
  if (services.filter(s => !s.soon).every(s => s.price)) $('[data-rates-note]')?.remove();
}

/* ══════════════════════════════════════════
   HOME: HOW IT GOES, THE STANDARD, REVIEWS
══════════════════════════════════════════ */
function applyExpect() {
  const list = C.expect || [];
  const wrap = $('[data-expect]');
  if (!wrap) return;
  if (!list.length) { $('[data-expect-sect]').remove(); return; }
  wrap.style.gridTemplateColumns = `repeat(${Math.min(list.length, 3)},1fr)`;
  wrap.innerHTML = list.map(e => `
    <div class="expect-cell">
      <span class="expect-num">${esc(e.step)}</span>
      <h3 class="expect-h">${esc(e.h)}</h3>
      <p class="expect-p">${esc(e.p)}</p>
    </div>`).join('');
}

function applyStandard() {
  const list = C.standard || [];
  const wrap = $('[data-standard]');
  if (!wrap) return;
  if (!list.length) { $('[data-standard-sect]').remove(); return; }
  wrap.innerHTML = list.map(s => `
    <div class="std-cell">
      <p class="std-eye">${esc(s.eye)}</p>
      <h3 class="std-h">${esc(s.h)}</h3>
      <p class="std-p">${esc(s.p)}</p>
    </div>`).join('');
}

const STAR = '<svg viewBox="0 0 24 24"><polygon points="12 2 15 9 22 9.3 16.5 13.8 18.4 21 12 17 5.6 21 7.5 13.8 2 9.3 9 9"/></svg>';

/* Stars only render when content.js actually gives a rating.
   Painting five stars on every quote by default would be
   inventing a rating nobody left. */
function stars(n) {
  const v = Number(n);
  if (!v || v < 1) return '';
  const c = Math.min(5, Math.round(v));
  return `<div class="rev-stars" aria-label="${c} out of 5">${STAR.repeat(c)}</div>`;
}

function applyReviews() {
  const list = (C.reviews || []).filter(r => r && r.quote);
  const sect = $('[data-reviews-sect]');
  if (!sect) return;
  // No real reviews yet? The section stays hidden entirely. A
  // "reviews coming soon" placeholder reads worse than having
  // no reviews section at all.
  if (!list.length) { sect.remove(); return; }
  sect.hidden = false;
  $('[data-reviews]').innerHTML = list.map(r => `
    <figure class="rev-card">
      ${stars(r.stars)}
      <blockquote class="rev-q">"${esc(r.quote)}"</blockquote>
      <figcaption class="rev-n">${esc(r.name || 'Verified client')}${r.source ? ', ' + esc(r.source) : ''}</figcaption>
    </figure>`).join('');

  const g = $('[data-google-reviews]');
  if (g && C.googleReviewsUrl) { g.href = C.googleReviewsUrl; g.hidden = false; }
}

/* ══════════════════════════════════════════
   ABOUT
══════════════════════════════════════════ */
function applyAbout() {
  const A = C.about || {};
  const scenes = (A.scenes || []).filter(s => (s.paras || []).length);

  const band = $('.ab-band');
  if (band && A.bandPhoto) band.dataset.photo = A.bandPhoto;

  const stack = $('[data-portrait-stack]');
  if (stack) {
    const withPhoto = scenes.filter(s => photoEntry(s.photo));
    stack.innerHTML = withPhoto.map((s, i) =>
      `<div class="shot shot--port ab-portrait-img${i === 0 ? ' on' : ''}" data-scene-img="${esc(s.photo)}" data-photo="${esc(s.photo)}"></div>`).join('');
    if (!withPhoto.length) stack.closest('.ab-portrait').remove();
  }

  const text = $('[data-about-text]');
  if (text) {
    text.innerHTML = scenes.map(s => `
      <div class="ab-scene" data-scene="${esc(s.photo)}">
        ${s.paras.map(p => `<p>${esc(p)}</p>`).join('')}
        ${s.quote ? `<div class="ab-quote"><p>"${esc(s.quote.text)}"</p><span>${esc(s.quote.by)}</span></div>` : ''}
      </div>`).join('')
      + `<div class="ab-creds">${(A.creds || []).map(c => `
          <div><div class="cred-lbl">${esc(c.lbl)}</div><div class="cred-v">${esc(c.v)}</div>${c.note ? `<div class="cred-n">${esc(c.note)}</div>` : ''}</div>`).join('')}</div>`
      + `<div class="ab-cta">
          <a class="btn-fill" data-book href="#" target="_blank" rel="noopener noreferrer">Book an Appointment</a>
          <a class="btn-out" href="#media" data-page="media">Watch His Tutorials</a>
        </div>`;
  }

  const grid = $('[data-about-grid]');
  if (grid) {
    const keys = (A.grid || []).filter(k => photoEntry(k));
    if (!keys.length) grid.closest('.sect').remove();
    else grid.innerHTML = keys.map(k => `<div class="shot shot--sq" data-photo="${esc(k)}"></div>`).join('');
  }
}

/* As each block of the story scrolls through the middle of the
   viewport, the pinned portrait crossfades to its photo. */
function initAboutScroll() {
  const scenes = $$('.ab-scene'), imgs = $$('.ab-portrait-img');
  if (!scenes.length || !imgs.length || !('IntersectionObserver' in window)) return;
  const ob = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const k = en.target.dataset.scene;
      imgs.forEach(i => i.classList.toggle('on', i.dataset.sceneImg === k));
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
  scenes.forEach(s => ob.observe(s));
}

/* ══════════════════════════════════════════
   COACHING
══════════════════════════════════════════ */
function applyCoaching() {
  const K = C.coaching || {};
  if (K.intro) $('[data-co-intro]').textContent = K.intro;
  const note = $('[data-co-note]');
  if (K.note) note.textContent = K.note; else note.remove();
  const hero = $('.co-hero .shot');
  if (hero && K.heroPhoto) hero.dataset.photo = K.heroPhoto;
  else if (hero) hero.closest('.co-hero').remove();

  const rows = $('[data-co-rows]');
  const list = (K.offerings || []).filter(o => o && o.h);
  if (rows) {
    rows.innerHTML = list.map((o, i) => `
      <div class="co-row rv">
        <div class="co-num">${String(i + 1).padStart(2,'0')}</div>
        <div class="shot shot--sq" data-photo="${esc(o.photo || '')}"></div>
        <div>
          <p class="co-eye">${esc(o.eye || '')}</p>
          <h2 class="co-h">${esc(o.h)}${o.soon ? ' <span class="tag tag--mute">In Progress</span>' : ''}</h2>
          <p class="co-p">${esc(o.p || '')}</p>
          ${o.soon ? `
            <form class="wl" data-waitlist novalidate>
              <label class="vis-hidden" for="wl-${i}">Email address</label>
              <input id="wl-${i}" type="email" name="email" placeholder="you@email.com" required>
              <button class="btn-fill" type="submit">Join Waitlist</button>
            </form>
            <p class="wl-msg" data-wl-msg role="status"></p>`
          : `<div class="co-actions"><a class="tlink" data-contact-cta href="#">Ask about availability →</a></div>`}
        </div>
      </div>`).join('');
  }

  // Testimonial stays hidden until there's a real one.
  const t = C.testimonial || {};
  const sect = $('[data-testimonial-sect]');
  if (t.quote && sect) {
    sect.hidden = false;
    $('[data-testimonial]').innerHTML = `
      ${stars(t.stars)}
      <blockquote class="rev-q">"${esc(t.quote)}"</blockquote>
      <figcaption class="rev-n">${esc(t.name || 'Coaching client')}</figcaption>`;
  } else if (sect) sect.remove();
}

/* The waitlist opens a pre-filled email rather than pretending to
   submit to a backend that doesn't exist yet. When Roman connects
   Mailchimp, only this function needs to change. */
function initWaitlist() {
  document.addEventListener('submit', e => {
    const form = e.target.closest('[data-waitlist]');
    if (!form) return;
    e.preventDefault();
    const input = form.querySelector('input');
    const msg = form.parentElement.querySelector('[data-wl-msg]');
    const val = (input.value || '').trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(val)) {
      msg.textContent = 'Enter a valid email address.';
      msg.classList.add('show');
      input.focus();
      return;
    }
    const to = (C.links && C.links.contactEmail) || '';
    if (to) {
      window.location.href = `mailto:${to}?subject=${encodeURIComponent('Online course waitlist')}&body=${encodeURIComponent('Please add me to the waitlist: ' + val)}`;
      msg.textContent = "Thanks. Your email app should be opening now.";
    } else {
      msg.textContent = `Thanks. DM @zab_barber on Instagram and we'll add ${val} to the list.`;
    }
    msg.classList.add('show');
    form.reset();
  });
}

/* No contact email set yet? Rather than leave a dead "Get in
   Touch" button, the CTA points at Instagram instead, where
   Roman already has 4,000+ followers and answers DMs. A working
   second choice beats a broken first one. */
function applyContactCta() {
  const email = (C.links || {}).contactEmail;
  const ig = (C.social || {}).instagram;
  $$('[data-contact-cta]').forEach(a => {
    if (email) {
      a.href = 'mailto:' + email + '?subject=' + encodeURIComponent('Coaching enquiry');
    } else if (ig) {
      a.href = ig;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = a.classList.contains('tlink') ? 'Ask on Instagram →' : 'Message on Instagram';
    } else {
      a.remove();
    }
  });
}

/* ══════════════════════════════════════════
   MEDIA
══════════════════════════════════════════ */
function initTabs() {
  const tabs = $$('.tab');
  if (!tabs.length) return;
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => { t.classList.remove('on'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('on'); tab.setAttribute('aria-selected','true');
      $$('.tabpanel').forEach(p => p.classList.toggle('on', p.id === 'panel-' + tab.dataset.tab));
    });
    tab.addEventListener('keydown', e => {
      const i = tabs.indexOf(tab);
      if (e.key === 'ArrowRight') tabs[(i + 1) % tabs.length].focus();
      if (e.key === 'ArrowLeft') tabs[(i - 1 + tabs.length) % tabs.length].focus();
    });
  });
  const f = (C.igFollowers || '').trim();
  const el = $('[data-ig-followers]');
  if (el) el.textContent = f ? `${f} followers` : '@zab_barber';
}

function applyIgFeed() {
  const wrap = $('[data-igfeed]');
  if (!wrap) return;
  const list = (C.igFeed || []).filter(Boolean);
  const url = (C.social && C.social.instagram) || '#';
  if (!list.length) { $('[data-igfeed-sect]').remove(); return; }
  wrap.innerHTML = list.map(src =>
    `<a class="ig-cell" href="${esc(url)}" target="_blank" rel="noopener noreferrer" aria-label="View on Instagram" style="background-image:url('${esc(imgPath(src))}')"></a>`).join('');
}

/* ══════════════════════════════════════════
   PHOTOS AND VIDEOS
══════════════════════════════════════════ */
function applyPhotos() {
  $$('[data-photo]').forEach(el => {
    if (el.dataset.filled) return;
    el.dataset.filled = '1';
    fillShot(el, el.dataset.photo);
  });
  $$('[data-photo-bg]').forEach(el => {
    const e = photoEntry(el.dataset.photoBg);
    if (e) el.innerHTML = `<img src="${esc(imgPath(e.src))}" alt="" loading="lazy" decoding="async">`;
  });
}

function ytId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}
function platform(url) {
  if (/youtu\.?be/i.test(url)) return 'youtube';
  if (/instagram\.com/i.test(url)) return 'instagram';
  if (/tiktok\.com/i.test(url)) return 'tiktok';
  return null;
}
function loadEmbedScript(p) {
  const src = { instagram: 'https://www.instagram.com/embed.js', tiktok: 'https://www.tiktok.com/embed.js' }[p];
  if (!src) return;
  if (document.querySelector(`script[src="${src}"]`)) {
    if (p === 'instagram' && window.instgrm) window.instgrm.Embeds.process();
    return;
  }
  const s = document.createElement('script');
  s.src = src; s.async = true;
  document.body.appendChild(s);
}

function renderEmbed(el) {
  const entry = (C.videos || {})[el.dataset.video];
  if (!entry || !entry.url) return;
  const url = entry.url.trim();
  const p = platform(url);
  if (!p) return;

  if (p === 'youtube') {
    const id = ytId(url);
    if (!id) return;
    el.style.cssText += `background-image:url(https://img.youtube.com/vi/${id}/hqdefault.jpg);background-size:cover;background-position:center;cursor:pointer`;
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    el.setAttribute('aria-label', (entry.title || 'Video') + ', play video');
    const load = () => {
      el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" title="${esc(entry.title || 'Video')}" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%"></iframe>`;
    };
    el.addEventListener('click', load, { once: true });
    el.addEventListener('keydown', function k(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); el.removeEventListener('keydown', k); }
    });

  } else if (p === 'instagram') {
    el.innerHTML = `<div class="ig-embed"><blockquote class="instagram-media" data-instgrm-permalink="${esc(url)}" data-instgrm-version="14"></blockquote></div>`;
    el.setAttribute('aria-label', entry.title || 'Instagram reel');
    loadEmbedScript('instagram');
    watchIg(el.querySelector('.ig-embed'));

  } else {
    el.innerHTML = `<blockquote class="tiktok-embed" cite="${esc(url)}" style="margin:0;width:100%"><section></section></blockquote>`;
    el.setAttribute('aria-label', entry.title || 'TikTok video');
    loadEmbedScript('tiktok');
  }
}

function applyVideos() {
  const V = C.videos || {};
  const targets = $$('[data-video]').filter(el => V[el.dataset.video] && V[el.dataset.video].url);
  // Third-party embed scripts stay unloaded until a visitor
  // actually scrolls near a video.
  if ('IntersectionObserver' in window) {
    const ob = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { renderEmbed(en.target); ob.unobserve(en.target); } });
    }, { rootMargin: '250px' });
    targets.forEach(el => ob.observe(el));
  } else targets.forEach(renderEmbed);

  $$('[data-video-caption]').forEach(el => {
    const e = V[el.dataset.videoCaption];
    if (e && e.title) el.textContent = e.title;
    else el.remove();
  });
}

/* Instagram renders its embed at a fixed natural width no matter
   how small the box is. Measure what it actually produced, then
   scale it to fit exactly. */
function fitIg(w) {
  const f = w.querySelector('iframe');
  if (!f) return false;
  const nat = f.offsetWidth, avail = w.clientWidth;
  if (!nat || !avail) return false;
  f.style.transformOrigin = 'top left';
  f.style.transform = `scale(${avail / nat})`;
  f.style.opacity = '1';
  return true;
}
function watchIg(w) {
  if (!w) return;
  let n = 0;
  const t = setInterval(() => { if (fitIg(w) || ++n > 40) clearInterval(t); }, 250);
}
let igTimer;
window.addEventListener('resize', () => {
  clearTimeout(igTimer);
  igTimer = setTimeout(() => $$('.ig-embed').forEach(fitIg), 200);
});

/* ══════════════════════════════════════════
   FLOURISHES
══════════════════════════════════════════ */
function initMagnetic() {
  if (REDUCE || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener('mousemove', e => {
    const shot = e.target.closest('.shot');
    if (!shot) return;
    const r = shot.getBoundingClientRect();
    shot.style.setProperty('--magx', (((e.clientX - r.left) / r.width - .5) * 12).toFixed(1));
    shot.style.setProperty('--magy', (((e.clientY - r.top) / r.height - .5) * 12).toFixed(1));
  }, { passive: true });
}

function initLogoBuzz() {
  $$('.nav-logo, .f-logo').forEach(l => {
    l.addEventListener('click', () => {
      l.classList.remove('buzz');
      void l.offsetWidth;
      l.classList.add('buzz');
    });
    l.addEventListener('animationend', () => l.classList.remove('buzz'));
  });
}

/* ══════════════════════════════════════════
   BOOT. Order matters: render content first,
   then wire up behaviour against it.
══════════════════════════════════════════ */
boot('hero',            applyHero);
boot('stats',           applyStats);
boot('gallery',         applyGallery);
boot('menu',            applyMenu);
boot('service cards',   applyServiceCards);
boot('what to expect',  applyExpect);
boot('the standard',    applyStandard);
boot('reviews',         applyReviews);
boot('about',           applyAbout);
boot('coaching',        applyCoaching);
boot('instagram feed',  applyIgFeed);
boot('footer',          applyFooter);

boot('links',           applyLinks);
boot('location',        applyLocation);
boot('status',          applyStatus);
boot('contact cta',     applyContactCta);
boot('structured data', applyStructuredData);

boot('photos',          applyPhotos);
boot('videos',          applyVideos);

boot('router',          initRouter);
boot('mobile menu',     initMob);
boot('scroll',          initScroll);
boot('reveal',          initReveal);
boot('lightbox',        initLightbox);
boot('about scroll',    initAboutScroll);
boot('tabs',            initTabs);
boot('waitlist',        initWaitlist);
boot('magnetic',        initMagnetic);
boot('logo buzz',       initLogoBuzz);

// Keep the live status honest on a long-open tab.
setInterval(() => boot('status refresh', applyStatus), 60000);
