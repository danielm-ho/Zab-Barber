// ════════════════════════════════════════════════════════════
// ZAB HAIR STUDIO: EDIT ME
// ════════════════════════════════════════════════════════════
// This is the only file you need to open. Fill in the blanks
// below, save, and refresh the page in your browser. You never
// have to touch index.html, style.css, or script.js.
//
// ANYTHING LEFT BLANK DISAPPEARS.
//   The site never shows "TBD" or "coming soon" to a visitor.
//   Leave a review, a price, a photo, or a video empty and that
//   piece quietly hides itself. The layout closes up around it.
//   Nothing ever looks unfinished.
//
// PHOTOS
//   Drop the file into the "images" folder next to this one,
//   then type just the filename, like src: "fig02.jpg". You can
//   also paste a full "https://..." link to use a photo hosted
//   somewhere else.
//
// VIDEOS
//   Paste the video's normal page link from your browser address
//   bar. YouTube, Instagram Reels, and TikTok are detected
//   automatically.
// ════════════════════════════════════════════════════════════

const CONTENT = {

  // ── HERO ─────────────────────────────────────────────────
  // "photo" is the hero shot. On desktop the site nudges it to
  // the right so Roman never sits behind the headline, so a
  // centred portrait works fine here.
  //
  // "photoWide" is optional. If you ever shoot a proper
  // landscape hero, put it here and wide screens will use it
  // while phones keep the portrait. Leave it blank to use one
  // photo everywhere.
  hero: {
    photo: "fig01",
    photoWide: "",
    video: "",            // optional. e.g. "hero-loop.mp4". Falls back to the photo.
    eyebrow: "Newtown Square, PA",
    headline: "Sharp.\nEvery Time.",
    sub: "Fades, tapers, and beard work from a barber who trained in Europe and finishes every cut with shears. One chair, one barber, no rushing you out.",
  },

  // ── BOOKING ──────────────────────────────────────────────
  // One place to change the booking link for the whole site.
  bookingUrl: "https://zab-hair-studio.square.site/",

  // ── CONTACT & LOCATION ───────────────────────────────────
  links: {
    // Powers "Get in Touch" on the Coaching page. Leave blank and
    // that button points at Instagram instead.
    contactEmail: "",       // e.g. "roman@zabhairstudio.com"

    // Powers every "Call" link and the phone button on mobile.
    // Leave blank and those links hide themselves.
    phone: "",              // e.g. "(610) 555-0123"

    addressLine1: "4885 West Chester Pike",
    addressLine2: "Suite 120",
    city: "Newtown Square",
    state: "PA",
    zip: "19073",

    parkingNote: "Free lot parking right out front.",
  },

  // ── STUDIO HOURS ─────────────────────────────────────────
  // Drives the live open/closed line in the header, footer, and
  // Visit section. Use 24-hour ["HH:MM","HH:MM"], or null for a
  // day the studio is closed.
  hours: {
    0: null,                // Sunday
    1: ["8:00","18:00"],    // Monday
    2: ["8:00","18:00"],    // Tuesday
    3: ["8:00","18:00"],    // Wednesday
    4: ["8:00","18:00"],    // Thursday
    5: ["8:00","18:00"],    // Friday
    6: ["8:00","18:00"],    // Saturday
  },

  // ── NUMBERS STRIP (under the hero) ───────────────────────
  // Any row with a blank "num" hides itself. Don't put a star
  // rating here until the Google reviews are actually live.
  stats: [
    { num: "7",         label: "Years Cutting" },
    { num: "15,000+",   label: "Clients So Far" },
    { num: "1",         label: "Chair. Always Roman." },
    { num: "Main Line", label: "Newtown Square, PA" },
  ],

  // ── SERVICES ─────────────────────────────────────────────
  // Shown on the Services page, and the first four appear as a
  // price list on the home page. Leave "price" blank and it
  // reads "See rates" instead of leaving an empty gap. Set
  // "soon: true" for anything you don't take bookings for yet.
  services: [
    {
      name: "Haircut",
      tag: "Signature",
      price: "",            // e.g. "$45"
      duration: "45 min",   // blank to hide
      photo: "fig02",
      desc: "Skin fades, tapers, French crops, side parts. Cut clean and finished with shears so it holds its shape.",
    },
    {
      name: "Beard Trim",
      tag: "",
      price: "",
      duration: "20 min",
      photo: "fig07",
      desc: "Sharp edges, even length, shaped to your face. No patchy spots left behind.",
    },
    {
      name: "Haircut + Beard",
      tag: "Most Popular",
      price: "",
      duration: "60 min",
      photo: "fig04",
      desc: "Hair and beard done together in one sitting so they actually match.",
    },
    {
      name: "Hot Towel Shave",
      tag: "",
      price: "",
      duration: "30 min",
      photo: "fig18",
      desc: "Straight razor, hot towel, done properly. Most shops around here stopped offering this.",
    },
    {
      name: "Kids' Cut",
      tag: "",
      price: "",
      duration: "30 min",
      photo: "fig14",
      desc: "Quick, patient, and cut properly. Roman does kids the same as anyone else.",
    },
    {
      name: "Facials",
      tag: "",
      price: "",
      duration: "",
      photo: "",
      soon: true,
      desc: "Roman is adding facial treatments soon. Not bookable yet.",
    },
  ],

  // ── HOW IT GOES (for first-time clients) ─────────────────
  // Set to [] to remove the section.
  expect: [
    { step: "01", h: "Book online", p: "Pick a time on Square. You get a confirmation right away and a reminder before your appointment. No phone tag." },
    { step: "02", h: "Talk it through", p: "Roman asks what you want before he touches anything. He'll tell you what your hair will actually hold and what still looks right in three weeks." },
    { step: "03", h: "Leave sharp",     p: "Cut, detailed, styled. You'll walk out knowing how to get it looking the same at home." },
  ],

  // ── WHY PEOPLE COME BACK ─────────────────────────────────
  standard: [
    { eye: "The details",   h: "Nothing rushed",    p: "Roman works on the parts most barbers hurry through. Those are the parts that decide whether your cut still looks good in week three." },
    { eye: "Trained abroad", h: "Learned in Ukraine", p: "He learned to cut where the standard is different, then brought it here. That training shows up in every fade he does." },
    { eye: "Shears first",  h: "Not just clippers", p: "Most barbers do everything with clippers. Roman finishes with shears, which is how you get texture and shape clippers can't give you." },
    { eye: "One barber",    h: "You get Roman",     p: "One chair, one barber. No junior stylist, no rotating staff. Same hands every time you book." },
  ],

  // ── PHOTOS ───────────────────────────────────────────────
  // "alt" is a short description used by screen readers and
  // search engines. The defaults are fine to leave as they are.
  photos: {
    fig01: { src: "fig01.jpg", alt: "Roman Zablotskyi, barber, studio portrait" },
    fig02: { src: "fig02.jpg", alt: "High skin fade with a side part" },
    fig03: { src: "fig03.jpg", alt: "Textured crop with a taper" },
    fig04: { src: "fig04.jpg", alt: "Side part with a clean taper" },
    fig05: { src: "fig05.jpg", alt: "Fade and beard line-up" },
    fig06: { src: "fig06.jpg", alt: "Scissor work on long hair" },
    fig07: { src: "fig07.jpg", alt: "Hot towel steam during a beard service" },
    fig09: { src: "fig09.jpg", alt: "Roman Zablotskyi in the studio" },
    fig10: { src: "fig10.jpg", alt: "Roman Zablotskyi, portrait" },
    fig11: { src: "fig11.jpg", alt: "Roman working at the studio station" },
    fig13: { src: "fig13.jpg", alt: "Roman cutting a young client's hair" },
    fig14: { src: "fig14.jpg", alt: "Finished kids' haircut" },
    fig17: { src: "fig17.jpg", alt: "Shear work on long hair" },
    fig18: { src: "fig18.jpg", alt: "Hot towel shave in progress" },
    fig23: { src: "fig23.jpg", alt: "Detailing the neckline with clippers" },
    ig4:   { src: "ig4.jpg",   alt: "Inside Zab Hair Studio" },
    ig5:   { src: "ig5.jpg",   alt: "The chair at Zab Hair Studio" },
  },

  // ── THE WORK (home page grid) ────────────────────────────
  // Eight photos fill the grid exactly on desktop, four rows of
  // two on a phone. Add or remove freely, but multiples of four
  // keep the bottom row from ending short.
  gallery: [
    { photo: "fig02", label: "High Skin Fade" },
    { photo: "fig05", label: "Fade & Beard Line-Up" },
    { photo: "fig03", label: "Textured Crop + Taper" },
    { photo: "fig17", label: "Shear Work, Long Hair" },
    { photo: "fig18", label: "Hot Towel Shave" },
    { photo: "fig04", label: "Side Part" },
    { photo: "fig14", label: "Kids' Cut" },
    { photo: "fig07", label: "Beard & Steam" },
  ],

  // ── ABOUT PAGE ───────────────────────────────────────────
  about: {
    bandPhoto: "fig09",
    // Each block is paired with a photo. As you scroll the text,
    // the portrait beside it changes to match.
    scenes: [
      { photo: "fig10", paras: [
        "Roman didn't start in a barbershop. His wife gave him a clipper kit for his birthday and he taught himself off Instagram, one video at a time. He was living in Ukraine then. A few years later he had his own shop.",
        "Then he came to the U.S. as a refugee and started over. New country, no client list, same standard. Seven years in, he's still doing it on his own.",
      ]},
      { photo: "fig11", paras: [
        "What people notice is the finish. He works with shears where most barbers reach for clippers, and he doesn't call a cut done until it's right. Over 15,000 clients have sat in his chair, including pro athletes and touring musicians.",
      ], quote: { text: "I have your new style.", by: "What he tells every client before he picks up the clippers" }},
      { photo: "fig13", paras: [
        "He teaches the same way he cuts. Barbers he trained back in Ukraine are still working today, and he's taking on students here one at a time.",
      ]},
    ],
    creds: [
      { lbl: "Years Cutting",  v: "7" },
      { lbl: "Clients So Far", v: "15,000+" },
      { lbl: "Based In",       v: "Newtown Square, PA", note: "Main Line Philadelphia" },
      { lbl: "Off the Clock",  v: "Music & Soccer" },
    ],
    grid: ["fig11", "fig23", "fig13", "fig14"],
  },

  // ── COACHING PAGE ────────────────────────────────────────
  coaching: {
    heroPhoto: "fig17",
    intro: "Roman cuts hair and he teaches it. Same standard either way.",
    note: "Barbers he trained in Ukraine are still working today.",
    offerings: [
      { eye: "Foundation", h: "For Beginners", photo: "fig06",
        p: "Just picking up clippers? Roman starts you on technique, posture, and pattern. Learn it right the first time and you won't spend years unlearning bad habits." },
      { eye: "Refinement", h: "For Working Barbers", photo: "fig23",
        p: "Already cutting but stuck at the same level? Work with Roman on consistency and speed. He'll find the gaps in your technique and show you how to close them." },
      { eye: "Self-Paced", h: "Online Course", photo: "fig11", soon: true,
        p: "A full course you can take from anywhere, not just if you live near Newtown Square. Still filming. Get on the list and you'll hear first." },
    ],
  },

  // ── VIDEOS ───────────────────────────────────────────────
  videos: {
    // YouTube (@Zab_barber1994)
    clip01: { url: "https://www.youtube.com/watch?v=iDRlpMs5E0E&t=1383s", title: "The Most Popular Haircut: French Crop with Taper" },
    clip02: { url: "https://www.youtube.com/watch?v=1G8Y3Vm0CgA&t=128s",  title: "Mid Taper Fade with Textured Top" },
    clip03: { url: "https://www.youtube.com/watch?v=8i-REVvrT0s",         title: "Skin Fade, Step by Step" },
    clip04: { url: "https://www.youtube.com/watch?v=KoV3Gq5HAJA",         title: "Modern Mullet with Taper Fade" },

    // Instagram Reels (@zab_barber)
    reel01: { url: "https://www.instagram.com/reel/DVZIGKPiUca/", title: "I have your new style" },
    reel02: { url: "https://www.instagram.com/reel/DYQhpoOJE7T/", title: "Cut with Meta Glasses" },
    reel03: { url: "https://www.instagram.com/reel/DaA8IokpLgz/", title: "A week in the life" },
    reel04: { url: "https://www.instagram.com/reel/DTjazq3iUAG/", title: "The magic of powder" },

    // TikTok (@barber_zab)
    tt01: { url: "https://www.tiktok.com/@barber_zab/video/7566087745639042334", title: "Buzz" },
    tt02: { url: "https://www.tiktok.com/@barber_zab/video/7499295601243229471", title: "Quality Assured" },
  },

  // ── REVIEWS ──────────────────────────────────────────────
  // Add as many as you like. Leave the array empty and the whole
  // reviews section disappears, with no "coming soon" badge.
  // "source" and "stars" are both optional. Leave "stars" off and
  // no star row is drawn, which is the honest default until you
  // are copying a real rating across.
  reviews: [
    // { quote: "Best fade I've had in ten years on the Main Line.", name: "Mike D.", source: "Google", stars: 5 },
  ],

  // Send visitors to your Google listing to read or leave a
  // review. Blank hides the button.
  googleReviewsUrl: "",

  // ── COACHING TESTIMONIAL ─────────────────────────────────
  // Blank quote hides the section.
  testimonial: { quote: "", name: "" },

  // ── MEDIA PAGE, INSTAGRAM GRID ───────────────────────────
  igFeed: ["ig1.jpg", "ig2.jpg", "ig3.jpg", "ig4.jpg", "ig5.jpg", "ig6.jpg"],
  igFollowers: "4,274",   // blank to hide

  // ── SOCIAL ───────────────────────────────────────────────
  social: {
    instagram: "https://www.instagram.com/zab_barber/",
    instagramStudio: "https://www.instagram.com/zab_hair_studio/",
    youtube: "https://www.youtube.com/@Zab_barber1994",
    tiktok: "https://www.tiktok.com/@barber_zab",
    facebook: "https://www.facebook.com/roman.zablotskyi.2025/",
  },
};
