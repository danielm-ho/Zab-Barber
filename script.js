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

function closeMob() {
  document.getElementById('navmob').classList.remove('open');
}

function scrollToWork() {
  const el = document.getElementById('hm-gallery');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.getElementById('burg').addEventListener('click', () => {
  document.getElementById('navmob').classList.toggle('open');
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
  applyPhotos();
  applyVideos();
  applyReviews();
  applyTestimonial();
  applyIgFeed();
  applyContactLink();
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

function applyPhotos() {
  if (!CONTENT.photos) return;
  document.querySelectorAll('[data-photo]').forEach(el => {
    const entry = CONTENT.photos[el.dataset.photo];
    if (!entry || !entry.src) return;
    const img = document.createElement('img');
    img.src = resolveImagePath(entry.src);
    img.alt = entry.alt || '';
    img.loading = 'lazy';
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

function applyVideos() {
  if (!CONTENT.videos) return;

  document.querySelectorAll('[data-video]').forEach(el => {
    const entry = CONTENT.videos[el.dataset.video];
    if (!entry || !entry.url) return;
    const url = entry.url.trim();
    const platform = detectPlatform(url);
    if (!platform) return;

    const tag = el.querySelector('.shot-tag');

    if (platform === 'youtube') {
      const id = getYouTubeId(url);
      if (!id) return;
      el.style.backgroundImage = `url(https://img.youtube.com/vi/${id}/hqdefault.jpg)`;
      el.style.backgroundSize = 'cover';
      el.style.backgroundPosition = 'center';
      el.style.cursor = 'pointer';
      if (tag) tag.style.display = 'none';
      el.addEventListener('click', function loadVid() {
        el.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1" title="video" frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%"></iframe>`;
        el.removeEventListener('click', loadVid);
      }, { once: true });

    } else if (platform === 'instagram') {
      el.innerHTML = `<div class="ig-embed"><blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"></blockquote></div>`;
      loadEmbedScript('instagram');
      watchInstagramEmbed(el.querySelector('.ig-embed'));

    } else if (platform === 'tiktok') {
      el.innerHTML = `<blockquote class="tiktok-embed" cite="${url}" style="margin:0;width:100%"><section></section></blockquote>`;
      loadEmbedScript('tiktok');
    }
  });

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

applyContent();