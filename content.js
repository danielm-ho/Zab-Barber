// ════════════════════════════════════════════════════════════
// ZAB HAIR STUDIO — EDIT ME
// ════════════════════════════════════════════════════════════
// This is the ONLY file you should ever need to open to finish
// the site. Fill in the blanks below, save the file, and refresh
// the page in your browser. Nothing else needs to be touched —
// you never have to open index.html, style.css, or script.js.
//
// PHOTOS
//   Drop the photo file into the "images" folder (right next to
//   this file), then type just the filename into "src" — e.g.
//   src: "fig02.jpg". The site automatically looks for it inside
//   the images folder, so that's all you need to do.
//   → Tip: naming files to match the label on the site (fig01.jpg,
//     fig02.jpg, etc.) makes it easy to keep track of which photo
//     is which.
//   → Hosting a photo somewhere else instead (Google Photos,
//     Instagram, Imgur)? Paste the full link (starting with
//     "https://") into "src" instead of a filename, and it'll be
//     used as-is.
//   → Leave "src" as "" (empty) to keep showing the "photo TBD"
//     placeholder — nothing will break.
//
// VIDEOS
//   Paste the video's normal page link (the one from your
//   browser's address bar) into "url". Works for YouTube,
//   Instagram Reels, and TikTok — the site automatically detects
//   which platform it is, so you don't need to do anything else.
//   Leave "url" as "" to keep the placeholder.
//
// Every entry below is labeled with the exact tag you'll see on
// the live site (e.g. "FIG. 02", "REEL 03") so you always know
// which one you're filling in, and which page it's on.
// ════════════════════════════════════════════════════════════

const CONTENT = {

  // ── CONTACT LINK ─────────────────────────────────────────
  links: {
    // Powers the "Get in Touch" button at the bottom of the
    // Coaching page. Leave blank to leave it unlinked for now.
    contactEmail: "", // e.g. "roman@zabhairstudio.com"
  },

  // ── STUDIO HOURS ─────────────────────────────────────────
  // Controls the small status line in the footer ("Open Now",
  // "Closed", etc). Use 24-hour time as ["HH:MM","HH:MM"], or
  // null for a day the studio is closed.
  //   Example open 10am–6pm:   1: ["10:00","18:00"],
  hours: {
    0: null, // Sunday
    1: ["8:00","18:00"], // Monday
    2: ["8:00","18:00"], // Tuesday
    3: ["8:00","18:00"], // Wednesday
    4: ["8:00","18:00"], // Thursday
    5: ["8:00","18:00"], // Friday
    6: ["8:00","18:00"], // Saturday
  },

  // ── PHOTOS ───────────────────────────────────────────────
  // "alt" is a short description used for accessibility (screen
  // readers, search engines) — the defaults below are fine to
  // leave as-is.
  photos: {

    // — Home page —
    fig01: { src: "fig01.jpg", alt: "Roman cutting hair in the chair" },     // Hero shot
    fig02: { src: "fig02.jpg", alt: "Skin fade haircut" },                   // Featured Cuts gallery
    fig03: { src: "fig03.jpg", alt: "French crop with taper haircut" },      // Featured Cuts gallery
    fig04: { src: "fig04.jpg", alt: "Side part haircut" },                   // Featured Cuts gallery
    fig05: { src: "fig05.jpg", alt: "Beard trim and line-up" },              // Featured Cuts gallery
    fig06: { src: "fig06.jpg", alt: "Shear work on a haircut" },             // Featured Cuts gallery
    fig07: { src: "fig07.jpg", alt: "Hot towel shave" },                     // Featured Cuts gallery
    fig08: { src: "fig10.jpg", alt: "Roman, studio portrait" },              // "From Ukraine to the Main Line" story teaser

    // — About page —
    fig09: { src: "fig09.jpg", alt: "Roman, full portrait" },                // Top full-bleed band
    fig10: { src: "fig10.jpg", alt: "Roman, portrait" },                     // Portrait next to his bio
    fig11: { src: "fig11.jpg", alt: "In the studio" },                       // Behind the Chair grid
    fig12: { src: "fig12.jpg", alt: "Tools of the trade" },                  // Behind the Chair grid
    fig13: { src: "fig13.jpg", alt: "Mid-haircut" },                         // Behind the Chair grid
    fig14: { src: "fig14.jpg", alt: "Finished haircut look" },               // Behind the Chair grid

    // — Services page —
    fig15: { src: "fig04.jpg", alt: "Haircut service" },
    fig16: { src: "fig16.jpg", alt: "Beard trim service" },
    fig17: { src: "fig17.jpg", alt: "Haircut and beard combo service" },
    fig18: { src: "fig18.jpg", alt: "Hot towel shave service" },
    fig19: { src: "fig19.jpg", alt: "Facial treatment" },

    // — Coaching page —
    fig20: { src: "fig20.jpg", alt: "Roman teaching a coaching session" },   // Top hero
    fig21: { src: "fig21.jpg", alt: "Barber foundations coaching session" },
    fig22: { src: "fig22.jpg", alt: "One-on-one barber coaching" },
    fig23: { src: "fig23.jpg", alt: "Filming the online course" },
  },

  // ── VIDEOS ───────────────────────────────────────────────
  // "title" only matters for the videos marked "additional /
  // to be selected" below — set it at the same time you add the
  // link, and it'll replace the placeholder caption. For videos
  // that already have a caption written (like CLIP 01), "title"
  // is optional — leave it blank to keep the existing caption.
  videos: {

    // — YouTube (@Zab_barber1994) —
    clip01: { url: "https://www.youtube.com/watch?v=iDRlpMs5E0E&t=1383s", title: "The Most Popular Haircut - French Crop with Taper - Tutorial by Zab Barber" }, // CLIP 01 — Featured video + YouTube list #1 — "French Crop with Taper"
    clip02: { url: "https://www.youtube.com/watch?v=1G8Y3Vm0CgA&t=128s", title: "Mid Taper Fade with Textured Top - Tutorial by Zab Barber" }, // CLIP 02 — YouTube list #2 — "Barber Live!"
    clip03: { url: "https://www.youtube.com/watch?v=8i-REVvrT0s", title: "Skin Fade Step by Step Tutorial" }, // CLIP 03 — YouTube list #3 — additional video, set your own title
    clip04: { url: "https://www.youtube.com/watch?v=KoV3Gq5HAJA", title: "Modern Mullet with Taper Fade - Tutorial by Zab Barber" }, // CLIP 04 — YouTube list #4 — additional video, set your own title

    // — Instagram Reels (@zab_barber) —
    // reel01 / reel02 / reel03 each appear in TWO places: the
    // Home page teaser AND the Media page. Fill one in once and
    // it updates both automatically.
    reel01: { url: "https://www.instagram.com/reel/DVZIGKPiUca/", title: "I have your new style" }, // REEL 01 — "French Crop Tutorial"
    reel02: { url: "https://www.instagram.com/reel/DYQhpoOJE7T/", title: "Cut with Meta Glasses" }, // REEL 02 — "Skin Fade, Start to Finish"
    reel03: { url: "https://www.instagram.com/reel/DaA8IokpLgz/", title: "A week in the life" }, // REEL 03 — "Barber Live Session"
    reel04: { url: "https://www.instagram.com/reel/DTjazq3iUAG/", title: "The magic of powder" }, // REEL 04 — Media page only — additional reel, set your own title

    // — TikTok (@barber_zab) —
    tt01: { url: "https://www.tiktok.com/@barber_zab/video/7566087745639042334", title: "Buzz" }, // TT 01 — set your own title
    tt02: { url: "https://www.tiktok.com/@barber_zab/video/7499295601243229471", title: "Quality Assured" }, // TT 02 — set your own title
  },    

  // ── HOME PAGE REVIEWS ────────────────────────────────────
  // Fill in up to 3. Any card left with an empty "quote" keeps
  // showing the "Pending" placeholder — fill in one, two, or all
  // three, whatever you have.
  reviews: [
    { quote: "", name: "" },
    { quote: "", name: "" },
    { quote: "", name: "" },
  ],

  // ── COACHING PAGE — MENTEE TESTIMONIAL ───────────────────
  testimonial: { quote: "", name: "" },

  // ── MEDIA PAGE — INSTAGRAM FEED GRID ─────────────────────
  // 6 photos for the small grid at the bottom of the Media page.
  // Same rule as above: a filename (e.g. "ig1.jpg") is pulled from
  // the images folder, or paste a full "https://" link instead.
  // Leave any slot "" to keep it blank.
  igFeed: ["ig1.jpg", "ig2.jpg", "ig3.jpg", "ig4.jpg", "ig5.jpg", "ig6.jpg"],

};