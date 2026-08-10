// ════════════════════════════════════════════════════════════
// ZAB HAIR STUDIO — PAGE LOGIC
// You shouldn't need to edit this file. To finish the site,
// open content.js instead — that's where all the links, photos,
// and text go.
// ════════════════════════════════════════════════════════════

const pages = ['home','about','services','coaching','media'];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function go(id) {
  const next = document.getElementById('pg-' + id);
  if (!next) return;
  const current = document.querySelector('.pg.on');

  document.querySelectorAll('.nav-link[data-page]').forEach(l => {
    l.classList.toggle('on', l.dataset.page === id);
  });

  function activate() {
    pages.forEach(p => {
      const el = document.getElementById('pg-' + p);
      if (el) el.classList.toggle('on', p === id);
    });
    window.scrollTo(0, 0);
  }

  if (reduceMotion || !current || current === next) {
    activate();
  } else {
    current.style.transition = 'opacity .16s ease';
    current.style.opacity = '0';
    setTimeout(() => {
      current.style.opacity = '';
      current.style.transition = '';
      activate();
      next.style.opacity = '0';
      requestAnimationFrame(() => {
        next.style.transition = 'opacity .22s ease';
        requestAnimationFrame(() => { next.style.opacity = '1'; });
      });
      setTimeout(() => { next.style.opacity = ''; next.style.transition = ''; }, 260);
    }, 160);
  }

  try { history.pushState({}, '', '#' + id); } catch(e) {}
}

// Back/forward browser navigation — previously the URL hash updated
// on every go() call but nothing listened for the user pressing the
// browser's back/forward buttons, so those buttons appeared to do
// nothing. This keeps the visible page in sync with the URL.
window.addEventListener('popstate', () => {
  const h = location.hash.replace('#', '');
  go(pages.includes(h) ? h : 'home');
});

function closeMob() {
  document.getElementById('navmob').classList.remove('open');
  burg.setAttribute('aria-expanded', 'false');
}

function scrollToWork() {
  const el = document.getElementById('hm-gallery');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const burg = document.getElementById('burg');
burg.addEventListener('click', () => {
  const open = document.getElementById('navmob').classList.toggle('open');
  burg.setAttribute('aria-expanded', String(open));
});

// Close the mobile menu on Escape, or on a click/tap outside it —
// standard expectations for any dropdown-style menu that were
// previously missing (only the burger button itself could close it).
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('navmob').classList.contains('open')) {
    closeMob();
  }
});
document.addEventListener('click', e => {
  const navmob = document.getElementById('navmob');
  if (!navmob.classList.contains('open')) return;
  if (navmob.contains(e.target) || burg.contains(e.target)) return;
  closeMob();
});

const navEl = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  document.getElementById('stt').classList.toggle('show', window.scrollY > 300);
  navEl.classList.toggle('scrolled', window.scrollY > 40);
});

document.getElementById('stt').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

(function() {
  const h = location.hash.replace('#', '');
  if (pages.includes(h)) go(h);
})();


/* ══════════════════════════════════════════
   STUDIO HOURS / STATUS
   Reads from CONTENT.hours in content.js.
══════════════════════════════════════════ */

function formatTime(h, m) {
  const period = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return m === 0 ? `${h12} ${period}` : `${h12}:${String(m).padStart(2, '0')} ${period}`;
}

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

function studioStatus() {
  const hours = (typeof CONTENT !== 'undefined' && CONTENT.hours) ? CONTENT.hours : {};
  const hasAnyHours = Object.values(hours).some(v => v !== undefined && v !== null);
  if (!hasAnyHours) return { text: 'Hours — confirm with Roman', open: false };

  const now = new Date();
  const today = hours[now.getDay()];
  if (!today) return { text: 'Closed Today', open: false };

  const [oh, om] = today[0].split(':').map(Number);
  const [ch, cm] = today[1].split(':').map(Number);
  const openM = oh * 60 + om, closeM = ch * 60 + cm;
  const nowM = now.getHours() * 60 + now.getMinutes();

  if (nowM >= openM && nowM < closeM) {
    return { text: `Open Now · Until ${formatTime(ch, cm)}`, open: true };
  }
  return { text: `Closed · Opens ${formatTime(oh, om)}`, open: false };
}

const status = studioStatus();
document.querySelectorAll('.f-status').forEach(el => {
  el.textContent = status.text;
  el.classList.toggle('is-open', status.open);
});

// Builds a compact "Mon–Sat 8AM–6PM" style summary line for the
// Visit section on the Home page, collapsing consecutive days that
// share identical hours instead of listing all seven individually.
function hoursSummary() {
  const hours = (typeof CONTENT !== 'undefined' && CONTENT.hours) ? CONTENT.hours : {};
  const rows = [];
  for (let i = 0; i < 7; i++) {
    const entry = hours[i];
    const label = entry ? `${formatTime(...entry[0].split(':').map(Number))} – ${formatTime(...entry[1].split(':').map(Number))}` : 'Closed';
    rows.push({ day: i, label });
  }
  const groups = [];
  rows.forEach(r => {
    const last = groups[groups.length - 1];
    if (last && last.label === r.label) last.end = r.day;
    else groups.push({ start: r.day, end: r.day, label: r.label });
  });
  return groups.map(g => {
    const span = g.start === g.end ? DAY_NAMES[g.start] : `${DAY_NAMES[g.start]}–${DAY_NAMES[g.end]}`;
    return `${span}: ${g.label}`;
  }).join(' · ');
}


/* ══════════════════════════════════════════
   CONTENT INJECTION
   Reads everything from content.js (the CONTENT
   object) and fills in photos, videos, reviews,
   testimonial, IG feed grid, and the contact link.
   Anything left blank in content.js is skipped, so
   the existing "TBD" placeholders keep showing.
══════════════════════════════════════════ */

function applyContent() {
  if (typeof CONTENT === 'undefined') return;
  safeInit('hero video', applyHeroVideo);
  safeInit('photos', applyPhotos);
  safeInit('videos', applyVideos);
  safeInit('reviews', applyReviews);
  safeInit('testimonial', applyTestimonial);
  safeInit('instagram feed', applyIgFeed);
  safeInit('contact link', applyContactLink);
  safeInit('location', applyLocation);
  safeInit('structured data', applyStructuredData);
}

// Photos are looked up in the "images" folder by default — type
// just a filename (e.g. "fig02.jpg") in content.js and it resolves
// to "images/fig02.jpg". A full link (starting with "http") or a
// path that already starts with "images/" or "/" is used as-is.
function resolveImagePath(value) {
  if (!value) return '';
  if (/^https?:\/\//i.test(value) || value.startsWith('images/') || value.startsWith('/')) {
    return value;
  }
  return 'images/' + value;
}

// Hero video — optional. If CONTENT.hero.video is set (and the
// visitor hasn't asked for reduced motion), swaps the hero .shot
// for a muted looping <video> instead of the FIG. 01 photo. Falls
// back to the normal photo path automatically: if left blank, if
// the visitor prefers reduced motion, or if the video fails to
// load (via the error handler below).
function applyHeroVideo() {
  const heroUrl = CONTENT.hero && CONTENT.hero.video;
  if (!heroUrl || reduceMotion) return;
  const el = document.querySelector('.hm-hero-shot');
  if (!el) return;
  const vid = document.createElement('video');
  // Set both the attribute and the property for muted/autoplay/loop/
  // playsinline: some WebKit/Safari versions specifically check the
  // HTML attribute at play()-time for muted-autoplay policy compliance
  // rather than trusting a property set immediately after creation.
  vid.setAttribute('muted', '');
  vid.setAttribute('loop', '');
  vid.setAttribute('playsinline', '');
  vid.setAttribute('autoplay', '');
  vid.setAttribute('disablepictureinpicture', '');
  vid.muted = true;
  vid.loop = true;
  vid.playsInline = true;
  vid.autoplay = true;
  vid.setAttribute('aria-hidden', 'true');
  const posterEntry = CONTENT.photos && CONTENT.photos.fig01;
  if (posterEntry && posterEntry.src) vid.poster = resolveImagePath(posterEntry.src);
  vid.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
  vid.addEventListener('error', () => { vid.remove(); el.dataset.heroVideoFailed = 'true'; }, { once: true });
  vid.src = resolveImagePath(heroUrl);
  el.prepend(vid);
  // Belt-and-suspenders: a <video> inserted into the DOM after page
  // load doesn't always honor the declarative autoplay attribute as
  // reliably as one present in the initial HTML. Explicitly calling
  // play() covers that gap; the catch is required because play()
  // returns a rejected promise (not a thrown error) if the browser
  // still blocks it, and an unhandled rejection would otherwise show
  // up as a console error for something that isn't actually broken —
  // the poster frame / fallback photo still displays either way.
  vid.play().catch(() => {});
  el.dataset.heroVideoApplied = 'true';
  const tag = el.querySelector('.shot-tag');
  if (tag) tag.style.display = 'none';
}

function applyPhotos() {
  if (!CONTENT.photos) return;
  document.querySelectorAll('[data-photo]').forEach(el => {
    // Skip the hero shot if a video already loaded successfully there.
    if (el.dataset.heroVideoApplied === 'true') return;
    const entry = CONTENT.photos[el.dataset.photo];
    if (!entry || !entry.src) return;
    const img = document.createElement('img');
    img.src = resolveImagePath(entry.src);
    img.alt = entry.alt || '';
    img.draggable = false;
    // The hero shot is the page's LCP element — it should load
    // immediately and at high priority. Every other photo can stay
    // lazy since it's below the fold when the page first paints.
    const isHero = el.classList.contains('hm-hero-shot');
    img.loading = isHero ? 'eager' : 'lazy';
    if (isHero) img.setAttribute('fetchpriority', 'high');
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
    el.prepend(img);
    const tag = el.querySelector('.shot-tag');
    if (tag) tag.style.display = 'none';
  });
}

function getYouTubeId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function detectPlatform(url) {
  if (/youtu\.?be/i.test(url)) return 'youtube';
  if (/instagram\.com/i.test(url)) return 'instagram';
  if (/tiktok\.com/i.test(url)) return 'tiktok';
  return null;
}

function loadEmbedScript(platform) {
  const srcMap = {
    instagram: 'https://www.instagram.com/embed.js',
    tiktok: 'https://www.tiktok.com/embed.js'
  };
  const src = srcMap[platform];
  if (!src) return;
  if (document.querySelector(`script[src="${src}"]`)) {
    if (platform === 'instagram' && window.instgrm) window.instgrm.Embeds.process();
    return;
  }
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  document.body.appendChild(s);
}

// Renders one video element's embed. Split out from applyVideos()
// so it can be called lazily (see below) instead of for every video
// on the site the moment the page loads — several of these pull in
// third-party embed scripts (Instagram, TikTok) that are otherwise
// dead weight until the visitor actually scrolls to them.
function renderVideoEmbed(el) {
  const entry = CONTENT.videos[el.dataset.video];
  if (!entry || !entry.url) return;
  const url = entry.url.trim();
  const platform = detectPlatform(url);
  if (!platform) return;

  const tag = el.querySelector('.shot-tag');
  const label = (entry.title || 'Play video') + ' — press Enter to play';

  if (platform === 'youtube') {
    const id = getYouTubeId(url);
    if (!id) return;
    el.style.backgroundImage = `url(https://img.youtube.com/vi/${id}/hqdefault.jpg)`;
    el.style.backgroundSize = 'cover';
    el.style.backgroundPosition = 'center';
    el.style.cursor = 'pointer';
    if (tag) tag.style.display = 'none';
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', label);
    const load = () => {
      el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" title="${(entry.title || 'Video').replace(/"/g,'&quot;')}" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%"></iframe>`;
    };
    el.addEventListener('click', load, { once: true });
    el.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); load(); el.removeEventListener('keydown', onKey); }
    });

  } else if (platform === 'instagram') {
    el.innerHTML = `<div class="ig-embed"><blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"></blockquote></div>`;
    el.setAttribute('aria-label', entry.title || 'Instagram reel');
    loadEmbedScript('instagram');
    watchInstagramEmbed(el.querySelector('.ig-embed'));

  } else if (platform === 'tiktok') {
    el.innerHTML = `<blockquote class="tiktok-embed" cite="${url}" style="margin:0;width:100%"><section></section></blockquote>`;
    el.setAttribute('aria-label', entry.title || 'TikTok video');
    loadEmbedScript('tiktok');
  }
}

function applyVideos() {
  if (!CONTENT.videos) return;

  const targets = Array.from(document.querySelectorAll('[data-video]')).filter(el => {
    const entry = CONTENT.videos[el.dataset.video];
    return entry && entry.url;
  });

  // Lazy-load embeds: elements start out of view (their parent page
  // is display:none, or they're simply below the fold), so nothing
  // fires until the visitor actually navigates to that page and
  // scrolls near the video. Falls back to rendering everything up
  // front on very old browsers without IntersectionObserver.
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          renderVideoEmbed(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px' });
    targets.forEach(el => observer.observe(el));
  } else {
    targets.forEach(renderVideoEmbed);
  }

  document.querySelectorAll('[data-video-caption]').forEach(el => {
    const entry = CONTENT.videos[el.dataset.videoCaption];
    if (entry && entry.title) el.textContent = entry.title;
  });
}

// Instagram always renders its embed at its own natural width (never
// narrower than ~326px), no matter how small the box around it is.
// So instead of guessing a scale factor, we wait for Instagram to
// actually render the iframe, measure how wide it really came out,
// then scale it down by exactly the right amount to fill the box —
// anchored to the top-left so the video shows, not the caption.
function fitInstagramEmbed(wrapper) {
  const iframe = wrapper.querySelector('iframe');
  if (!iframe) return false;
  const naturalWidth = iframe.offsetWidth;
  const availableWidth = wrapper.clientWidth;
  if (!naturalWidth || !availableWidth) return false;
  iframe.style.transformOrigin = 'top left';
  iframe.style.transform = `scale(${availableWidth / naturalWidth})`;
  iframe.style.opacity = '1';
  return true;
}

function watchInstagramEmbed(wrapper) {
  if (!wrapper) return;
  let attempts = 0;
  const timer = setInterval(() => {
    attempts++;
    if (fitInstagramEmbed(wrapper) || attempts > 40) clearInterval(timer); // give up after ~10s
  }, 250);
}

let igResizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(igResizeTimer);
  igResizeTimer = setTimeout(() => {
    document.querySelectorAll('.ig-embed').forEach(fitInstagramEmbed);
  }, 200);
});

function applyReviews() {
  if (!CONTENT.reviews) return;
  let anyFilled = false;
  document.querySelectorAll('[data-review]').forEach(card => {
    const entry = CONTENT.reviews[card.dataset.review];
    if (!entry || !entry.quote) return;
    anyFilled = true;
    const tag = card.querySelector('.sv-card-tag');
    const quote = card.querySelector('.hm-rev-quote');
    const name = card.querySelector('.hm-rev-name');
    if (tag) tag.remove();
    if (quote) quote.textContent = `"${entry.quote}"`;
    if (name) name.textContent = `— ${entry.name || 'Verified Client'}`;
  });
  if (anyFilled) {
    const badge = document.querySelector('.rev-pending-badge');
    if (badge) badge.style.display = 'none';
  }
}

function applyTestimonial() {
  if (!CONTENT.testimonial || !CONTENT.testimonial.quote) return;
  const card = document.querySelector('[data-testimonial]');
  if (!card) return;
  const quote = card.querySelector('.co-test-q');
  const name = card.querySelector('.co-test-n');
  if (quote) quote.textContent = `"${CONTENT.testimonial.quote}"`;
  if (name) name.textContent = `— ${CONTENT.testimonial.name || 'Coaching Client'}`;
}

function applyIgFeed() {
  if (!CONTENT.igFeed) return;
  let anyFilled = false;
  document.querySelectorAll('[data-igfeed]').forEach(cell => {
    const src = CONTENT.igFeed[cell.dataset.igfeed];
    if (!src) return;
    anyFilled = true;
    cell.style.backgroundImage = `url(${resolveImagePath(src)})`;
    cell.style.backgroundSize = 'cover';
    cell.style.backgroundPosition = 'center';
  });
  if (anyFilled) {
    const note = document.querySelector('.ig-note');
    if (note) note.style.display = 'none';
  }
}

function applyContactLink() {
  const btn = document.getElementById('contact-cta');
  if (btn && CONTENT.links && CONTENT.links.contactEmail) {
    btn.href = 'mailto:' + CONTENT.links.contactEmail;
  }
}

/* ══════════════════════════════════════════
   LOCATION / ADDRESS / MAP
   Reads CONTENT.links (addressLine1/2, city,
   state, zip, phone) and fills in the footer
   address, the Home page "Visit" section, the
   Get Directions links, and the embedded map.
══════════════════════════════════════════ */

/* ══════════════════════════════════════════
   STRUCTURED DATA SYNC
   The <head> ships with a static LocalBusiness JSON-LD
   block (address/phone) for search engines. Since that
   markup can't read content.js on its own, this patches
   its telephone and address fields from CONTENT.links at
   runtime — otherwise editing content.js would silently
   stop being "the only file you need to touch": the visible
   site would update but Google's copy of the address/phone
   would quietly go stale.
══════════════════════════════════════════ */
function applyStructuredData() {
  const L = CONTENT.links || {};
  const script = document.querySelector('script[type="application/ld+json"]');
  if (!script) return;
  let data;
  try { data = JSON.parse(script.textContent); } catch (err) { return; }

  if (L.phone) data.telephone = L.phone;
  if (L.addressLine1) {
    data.address = data.address || { '@type': 'PostalAddress' };
    data.address.streetAddress = [L.addressLine1, L.addressLine2].filter(Boolean).join(', ');
    data.address.addressLocality = L.city || data.address.addressLocality;
    data.address.addressRegion = L.state || data.address.addressRegion;
    data.address.postalCode = L.zip || data.address.postalCode;
  }
  script.textContent = JSON.stringify(data);
}

function applyLocation() {
  const L = CONTENT.links || {};
  if (!L.addressLine1) return; // nothing to show yet

  const oneLine = [L.addressLine1, L.addressLine2, `${L.city}, ${L.state} ${L.zip}`].filter(Boolean).join(', ');
  const mapsQuery = encodeURIComponent(oneLine);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;
  const embedUrl = `https://www.google.com/maps?q=${mapsQuery}&output=embed`;

  // Footer address (every page)
  document.querySelectorAll('[data-address-inline]').forEach(el => {
    el.textContent = oneLine;
  });

  // Home page "Visit the Studio" block
  const addrEl = document.querySelector('[data-address]');
  if (addrEl) {
    addrEl.innerHTML = `${L.addressLine1}${L.addressLine2 ? ', ' + L.addressLine2 : ''}<br>${L.city}, ${L.state} ${L.zip}`;
  }
  const hoursEl = document.querySelector('[data-hours-list]');
  if (hoursEl) hoursEl.textContent = hoursSummary();

  const mapEl = document.querySelector('[data-map-embed]');
  if (mapEl) mapEl.src = embedUrl;

  document.querySelectorAll('[data-directions-link]').forEach(el => {
    el.href = directionsUrl;
  });

  if (L.phone) {
    const telHref = 'tel:' + L.phone.replace(/[^\d+]/g, '');
    document.querySelectorAll('[data-phone-link]').forEach(el => {
      el.href = telHref;
      el.textContent = 'Call ' + L.phone;
      el.style.display = '';
    });
  }
}

/* ══════════════════════════════════════════
   ABOUT PAGE — SCROLL-LINKED PHOTO CROSSFADE
   As each .ab-scene paragraph block scrolls near
   the vertical center of the viewport, the pinned
   portrait crossfades to the matching photo.
══════════════════════════════════════════ */
function initAboutScrollytelling() {
  const scenes = document.querySelectorAll('.ab-scene');
  const images = document.querySelectorAll('.ab-portrait-img');
  if (!scenes.length || !images.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const key = entry.target.dataset.scene;
        images.forEach(img => img.classList.toggle('on', img.dataset.sceneImg === key));
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  scenes.forEach(scene => observer.observe(scene));
}

/* ══════════════════════════════════════════
   MAGNETIC CORNER BRACKETS
   Desktop only (fine pointer + hover support). The
   existing corner-bracket hover decoration on .shot
   elements nudges slightly toward the pointer instead
   of snapping to fixed corners. Uses the regular system
   cursor throughout — this only moves the CSS brackets,
   nothing about the pointer itself changes.
   Skipped under prefers-reduced-motion.
══════════════════════════════════════════ */
function initMagneticBrackets() {
  if (reduceMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.querySelectorAll('.shot').forEach(shot => {
    let rafId = null, pendingX = 0, pendingY = 0;
    shot.addEventListener('mousemove', e => {
      pendingX = e.clientX; pendingY = e.clientY;
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        const r = shot.getBoundingClientRect();
        const relX = ((pendingX - r.left) / r.width - 0.5) * 2;   // -1..1
        const relY = ((pendingY - r.top) / r.height - 0.5) * 2;   // -1..1
        shot.style.setProperty('--magx', (relX * 6).toFixed(1));
        shot.style.setProperty('--magy', (relY * 6).toFixed(1));
        rafId = null;
      });
    });
    shot.addEventListener('mouseleave', () => {
      shot.style.setProperty('--magx', 0);
      shot.style.setProperty('--magy', 0);
    });
  });
}

/* ══════════════════════════════════════════
   LOGO EASTER EGG
   Clicking "ZAB." still navigates home as usual, but
   also triggers a quick clipper-buzz wiggle — a small,
   purely decorative wink. Bound to the whole wordmark
   (not just the "." character) since that's a far more
   reliable click target than a single punctuation glyph.
══════════════════════════════════════════ */
function initLogoBuzz() {
  document.querySelectorAll('.nav-logo').forEach(logo => {
    logo.addEventListener('click', () => {
      logo.classList.remove('buzz');
      void logo.offsetWidth; // restart animation from scratch
      logo.classList.add('buzz');
    });
    logo.addEventListener('animationend', () => logo.classList.remove('buzz'));
  });
}

// Each piece of the site initializes independently and is wrapped
// so that if any single one throws (a missing element, an unusual
// browser quirk, etc.) it's logged to the console and skipped —
// it can NOT take down every feature that happens to be wired up
// after it. Previously these ran as one unguarded chain, so a
// single failure partway through silently prevented everything
// listed after it (including all of applyContent — photos, videos,
// address, reviews) from ever running.
function safeInit(name, fn) {
  try {
    fn();
  } catch (err) {
    console.error(`Zab site: "${name}" failed to initialize —`, err);
  }
}

safeInit('about scrollytelling', initAboutScrollytelling);
safeInit('magnetic brackets', initMagneticBrackets);
safeInit('logo buzz', initLogoBuzz);
safeInit('content injection', applyContent);