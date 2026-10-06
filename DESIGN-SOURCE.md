# Caleb Animal Care — Design Source Audit & Build Summary

## 1. Zip folder inspection (`petsitting-master.zip`)

**Identified as:** "Pet Sitting" — free Bootstrap 4 HTML template by Colorlib (Flaticon set built 24/01/2020).
Fully unpacked to a scratch folder and audited before any new code was written.

### Folder structure & files (186 files)
```
petsitting-master/
├─ about.html  blog-single.html  blog.html  contact.html  gallery.html
├─ index.html  main.html  pricing.html  services.html  vet.html
├─ readme.txt  prepros-6.config  .DS_Store
├─ css/
│  ├─ style.css (compiled, 260 KB — primary design stylesheet)
│  ├─ bootstrap.min.css, bootstrap-datepicker.css, jquery.timepicker.css
│  ├─ animate.css, magnific-popup.css, owl.carousel.min.css,
│  │  owl.theme.default.min.css, flaticon.css, ajax-loader.gif
│  ├─ bootstrap/{bootstrap-grid.css, bootstrap-reboot.css}
│  └─ css/{bootstrap-reboot.css, mixins/_text-hide.css}
├─ scss/
│  ├─ style.scss (40 KB — source of truth: variables + mixins)
│  └─ bootstrap/ (full Bootstrap 4 SCSS: 50 partials, mixins/, utilities/)
├─ js/
│  ├─ main.js (site behaviour, 8 KB)
│  ├─ jquery-3.2.1.min.js, jquery-migrate-3.0.1.min.js, bootstrap.min.js,
│  │  popper.min.js, owl.carousel.min.js, jquery.waypoints.min.js,
│  │  jquery.stellar.min.js, scrollax.min.js, jquery.animateNumber.min.js,
│  │  jquery.easing.1.3.js, jquery.magnific-popup.min.js,
│  │  bootstrap-datepicker.js, jquery.timepicker.min.js, google-map.js
├─ fonts/flaticon/
│  ├─ font/Flaticon.{eot,woff,woff2,ttf,svg} + flaticon.css, _flaticon.scss
│  └─ license/license.pdf
└─ images/ (32 jpgs/png: bg_1–3, about-1–3, gallery-1–7, image_1–6,
   person_1–4, staff-1–8, pricing-1–3, img.jpg, loc.png)
```

### Pages / routes / layouts in the zip
Static HTML only (no router, no SSR): `index` (hero + intro services + about +
counter + FAQs + testimonials + pricing + blog + appointment), `about`, `vet`
(team grid), `services`, `pricing`, `gallery`, `blog`, `blog-single`, `contact`.
Shared chrome: top gradient bar (phone/email/socials) → white navbar (paw brand)
→ sections → dark footer. **No layouts/components as code — flat HTML.**

### Component inventory (recreated as React components)
Top bar wrap; sticky navbar + mobile collapse; hero slider (`hero-wrap`);
service cards (`.services`); about split; animated number counters;
FAQ accordion; testimony carousel; pricing cards; blog cards; appointment
form (datepicker + timepicker); gallery grid + lightbox; footer (4 cols +
social row + small nav).

### CSS custom properties / design tokens (extracted from `scss/style.scss`)
| Token | Value |
|---|---|
| `--primary` | `#00bd56` (brand green) |
| `--secondary` | `#207dff` (brand blue) |
| `--gradient` | `linear-gradient(45deg, #207dff 0%, #00bd55 100%)` (top bar, overlays, accents) |
| `--darken` | `#00043c` (deep navy text) |
| `--footer-bg` | `#1a1a1a` |
| `--body-text` | `#808080` (`lighten(#000,50%)`) |
| `--heading` | `rgba(0,0,0,.8)` |
| `--offwhite` | `#fafafa` (`.bg-light`) |
| Mixins | `transition: all .3s ease`; `border-radius: 4px` on cards/services |

### Typography
Montserrat via Google Fonts, weights **200–800** (only icon font shipped locally).
Body **15px / line-height 1.8 / 400**; subheading **12px / 600 / uppercase /
2px tracking / #00bd56**; h2 **30px / 800** (28px mobile); nav-link **14px / 700**;
navbar-brand **28px / 800** with green paw span. Meets the brief's minimums
(body ≥15px; metadata ≥11px; nav 13–14px rebuilt at 13px per brief;
buttons 12px per brief).

### Fonts / weights shipped
Only **Flaticon icon font** (eot/woff/woff2/ttf/svg). Text font Montserrat is
linked from Google — this build self-hosts Montserrat woff2 (400/500/600/700/800)
under `/public/fonts` to match zip typography without a runtime third-party call.

### Icon sets used in zip
Font Awesome 4.7 (`fa-phone`, `fa-paper-plane`, `fa-bars`, socials) and Flaticon
(`pawprint-1`, `pawprint`, `blind`, `dog-eating`, `grooming`, `stethoscope`,
`customer-service`, `emergency-call`, `veterinarian`). Per the brief ("Lucide
only") the rebuild maps these concepts to Lucide: PawPrint, HeartPulse,
Stethoscope, Calendar, MapPin, Phone, Clock, CheckCircle, User, ShoppingCart,
Bell, FileText, Scissors, Syringe, Bone, Bird, Wheat, Ambulance.

### Loading screen in zip (`#ftco-loader`)
Fixed 96×96 white card (`radius 16px`, `shadow 0 24px 64px rgba(0,0,0,.24)`),
fullscreen variant white; SVG circle spinner: rotate **2s linear infinite**,
dash **1.5s ease-in-out infinite**; shown instantly, hidden with opacity
**0.4s ease-out** fade after 1ms timer.
**Brief override/rebuild:** keeps the zip's 0.4s ease-out fade + white stage,
but shows the Caleb Animal Care wordmark, a paw print that draws stroke-by-stroke
(SVG dash animation), and a thin progress bar — total <1.8s, per brief.

### Cookie consent banner
**Not present in zip.** Built per brief fallback spec (bottom-fixed banner,
Accept All / Manage Preferences modal, Necessary locked, localStorage,
Kenya DPA 2019, link to `/legal/cookie-policy`).

### CAPTCHA
**Not present in zip.** Built per brief: reCAPTCHA v3 invisible on all forms,
server verification in every API route, v2-fallback flag when score <0.5,
secret in env only.

### Privacy / Terms / 404 / 500
**None exist in zip.** Built per brief: `/legal/privacy-policy`,
`/legal/terms`, `/legal/cookie-policy`, branded `not-found.tsx`
("This page could not be found." + Book an Appointment CTA + pet image),
branded `error.tsx` ("Something went wrong. Please try again." + Try Again).

### API routes / packages / env vars in zip
None (static jQuery site). All API routes, `package.json` deps, and env vars
are new, exactly per the pinned stack in the brief and documented in
`.env.example`.

### Zip animation timings (reproduced)
Scroll reveal: waypoint at **95%** viewport, `.ftco-animate` opacity 0 →
fadeInUp/Left/Right, **100ms** pre-delay then **k × 50ms stagger**; counter
numbers **7000ms** with thousands separator; carousel loop with 1/2/3 items at
0/600/1000px breakpoints, 30px margin; link/card transitions **0.3s ease**;
lightbox zoom **300ms**. Where the brief states explicit timings (hero words
0.09s/word, service card stagger 70ms, product stagger 60ms, steps 300ms
ease-out, hover zoom 1.04 / 250ms) those are applied as the named-feature spec.

## 2. What the zip does NOT define (brief fallbacks applied)
Loading wordmark/paw/progress bar; cookie consent; CAPTCHA; legal pages;
error pages; booking system; home-visit page; pet portal; shop + M-Pesa;
newsletter; library/MDX; testimonial rotation timing (5s, per brief);
3D paw particles; WhatsApp button (#25D366 brand green consistent with zip's
green-centric palette); emergency red (warm red `#D64545`-family token, matches
zip accent use on `emergency-call` icon contexts).

## 3. Imagery decision
Zip photos are generic Western pet-sitting shots. The brief mandates East
African vets/owners/animals from Pexels/Unsplash only, so all imagery is newly
sourced (see `image-credits.md`); zip imagery is not reused.

## 4. Reproduction checklist
| Zip element | Rebuilt as |
|---|---|
| Top gradient bar (45° blue→green) | `TopBar` (gradient token, phone/email/socials) |
| White navbar + paw brand + collapse | `Navbar` sticky, 13px links, mobile drawer |
| `.services` card (radius 4, soft shadow, .3s) | `ServiceCard` + hover zoom 1.04/250ms (brief) |
| Subheading/h2 heading-section | `SectionHeading` |
| Counter band | `StatsBand` (7s count-up, zip timing) |
| Testimony owl loop centre | `Testimonials` (5s rotate, pause-on-hover — brief) |
| Appointment form | 4-step `/book` + `/home-visit` (brief) |
| Footer `#1a1a1a` | `Footer` token-matched |
| `#ftco-loader` spinner | `LoadingScreen` wordmark/paw/progress + 0.4s fade |
