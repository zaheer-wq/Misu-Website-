# MISÙ — Cinematic Redesign Prototype

A working prototype of a more dynamic, immersive, cinematic version of
[misucafe.co.za](https://www.misucafe.co.za), built to be pushed to GitHub
and deployed on Vercel.

## Creative direction (short version)

- **Cinematic, not busy.** Dark espresso backdrop, warm ambient glow, italic
  serif display type (Cormorant Garamond) over a clean sans body (Manrope) —
  matches the "soft neutral tones, glowing ambient lighting" already on your
  site, translated into motion.
- **Hero = generative matcha pour.** A canvas animation simulates a
  swirling matcha pour with warm bowl-light bloom, reacting gently to the
  cursor. It's not real CGI footage (see "About the visuals" below) — but it
  reads as premium and loops forever with zero asset weight.
- **Matcha ritual section is now built entirely around your real video.**
  Your clip is pinned full-bleed behind the *whole* section — not a panel
  within it — and scroll drives the scene: the video eases from a tight
  zoom into its full frame as the heading hands off to the flavour grid,
  all inside the same pinned frame, with a soft crossfade loop instead of
  a hard cut (see "The matcha video & scene" below).
- **"Rich Layers" scroll story — now built from your real product shot.**
  I cropped the exploded-view tiramisu photo you sent into 8 pieces (drizzle,
  piped cream, cocoa dust, 2× mascarpone disc, 2× biscuit, cup) and animate
  them from a floating "exploded" pose down into the assembled cup as you
  scroll, with the heading/copy changing per layer. It's real photography,
  not a render, so this is the closest thing to the "CGI ingredients build
  themselves" brief I can do without an actual CGI/video pipeline.
- **Draggable flavour carousel — now your real product shots.** The eight
  exploded-view tiramisù renders you sent (Classic, Biscoff, Banoffee, Bar
  One, Ferrero Rocher, White Chocolate Hazelnut, Hazelnut, Pistachio) sit
  behind each card, momentum-scrolled like a native app, not a static grid
  (see "The flavour carousel" below).
- **Matcha flavour grid — now your real product shots.** The eight matcha
  images you sent (each already carries its own flavour-name pill) replace
  the old text-only cards, rising in as the second "act" of the pinned
  matcha scene above. Each cup floats gently and independently at rest,
  and tilts toward the cursor on hover (see "The matcha flavour grid"
  below).
- **Events section — now your real packages, pricing and flavours.** What
  was a generic "Product Spotlight" cube is now an Events section built
  from the one-pager you sent: the three real packages (Tiramisù Tray,
  Luxury Perspex Box, Live Serving Experience) with their actual pricing
  and guest counts, the nine signature flavours, and the "perfect for"
  occasions — centred on the drag-to-rotate cube you liked, now re-themed
  around what a booking includes rather than flavour names (see "Events"
  below).
- **Your real logo, in white, everywhere the brand mark appears.** The
  header, the loading screen and the footer used to spell out "MISÙ" in
  the site's heading font — a close approximation, not your actual
  logotype. All three now use your real logo file, recoloured white for
  the dark background, so the mark is consistent with what's on your
  letterhead and packaging (see "Logo" below).
- **"Our Space" — now your real café interior, animated to feel like video.**
  Your interior shot sits full-bleed behind the section with a slow,
  continuous Ken Burns zoom-and-drift plus an occasional soft light glint,
  so a still photo reads as a live, cinematic pan rather than a static
  image (see "Our Space" below).
- Everything respects `prefers-reduced-motion`, and the heavy motion
  (custom cursor, canvas) is dropped below 860px for phone performance.

## About the visuals — read this before showing anyone

I can't generate true photoreal CGI video myself. The Rich Layers section
uses your real exploded-view product photo (cropped into pieces, listed
below) and the Matcha Ritual section now carries your real product video
(details below) — both are a big step up — but the hero's matcha pour and
the Events cube are still **code-generated motion** (canvas/CSS), not
rendered footage. Two ways to take this further:

1. **Swap in more real photography/video.** Drop stills or clips into
   `public/images` / `public/video`, and I can wire them into the hero
   background the same way I did for the tiramisu layers and the matcha
   video — this is usually the fastest way to a finished-feeling site.
2. **Commission real CGI.** If you want literal pouring-matcha video, or a
   fully rendered (not photographed) build-up shot, that's produced with
   tools like a 3D/CGI artist or an AI video generator (e.g. Runway, Sora) —
   outside what I can do directly here. Once you have that footage, send it
   over and I'll drop it straight into the hero in place of the canvas
   animation.

### The matcha video & scene

Source: the clip you sent of someone sipping a MISÙ iced matcha in the
café. Saved to `public/video/` as `matcha-sip.mp4` (H.264, universal
playback) with a `matcha-sip.webm` (VP9) alternate for browsers that don't
ship H.264 decoding, plus `matcha-sip-poster.jpg` (the first frame) as the
`poster` shown before playback starts and as the static fallback for
`prefers-reduced-motion`. Both were re-encoded from your original with the
audio track stripped (the video is always muted, so there's no reason to
ship those bytes) and compressed to ~520KB / ~250KB.

The video is now the backdrop for the *entire* section, not a panel
within it. `.matcha-section` in `src/style.css` is 170vh tall on desktop
(150vh on phones), and `.matcha-pin` sticks to the top of the viewport for
that whole height — same pin technique as the Rich Layers build
(`.layers-pin` / `.layers-section`) — so the video stays put, full-bleed,
while you scroll through the section. That extra scroll height drives a
scrubbed scene change, built in `initMatchaScene()` in `src/main.js`:

1. The video starts zoomed in slightly (`scale(1.16)`) and eases out to
   its full frame as you scroll — a slow cinematic push-back, not a cut.
2. The heading fades and lifts out.
3. The flavour grid fades and rises in to take over the same pinned
   frame, with an extra dark wash (`.matcha-video-dim`) fading in behind
   it so the small card pills stay legible over the moving footage.

All of that happens in the first half of the scroll-through (the GSAP
timeline is deliberately compressed to finish by ~48% of the scrub range),
so the back half is genuine dwell time — the grid sits fully settled and
hoverable well before the section unpins, instead of still animating right
up to the handoff. The section height and scrub lag were both tuned down
this round (from 230vh/210vh and a heavier scrub) specifically so the
scroll gesture needed to clear the section feels responsive rather than
"stuck."

Both "scenes" (`#matchaHead` and `#matchaGrid`) sit in the same CSS grid
cell (`.matcha-scene` / `.matcha-content`) so GSAP can cross-dissolve
between them instead of one pushing the other around. There's no internal
scrolling inside `.matcha-scene` — an earlier `overflow-y: auto` safety
net for very tall card stacks was removed, since it could trap the
scroll wheel inside the pinned section instead of letting it pass through
to the next one.

The loop is still a soft one, not a hard cut: because it's a few seconds
of real footage rather than a loop-matched render, its start and end
frames don't line up, so `initMatchaVideo()` fades the video out in the
last 0.4s of the clip, jumps back to frame 0 while hidden, then fades
back in. It also pauses via `IntersectionObserver` while off-screen. If
you send a new clip, keep the same three filenames and it'll pick it up
automatically.

`prefers-reduced-motion` drops the whole pin/scrub/zoom setup via a CSS
media query — the section falls back to its old shape: a normal-height
video banner, then the heading, then the grid, stacked in plain
document flow with no motion at all.

### The matcha flavour grid

Source: the eight flavour shots you sent (Classic Matcha, Cinnamon,
Vanilla, White Chocolate, Salted Caramel, Banana Bread, MISÙ Matcha, Crème
Brulê). Each one already has its flavour-name pill baked into the image on
a transparent background, so they're saved as-is (just trimmed of a
couple of stray transparent pixels around the edge) to `.webp` at
`public/images/matcha/` — no extra text overlay needed since the label is
part of the photo. The data list mapping each file to its flavour name
lives in `src/modules/matchaGrid.js`.

The grid is a fixed, centered layout — 4 columns × 2 rows on desktop
(`.matcha-grid` in `src/style.css`, `grid-template-columns: repeat(4, ...)`
with `justify-content: center`), collapsing to 2 columns × 4 rows on phones,
so all 8 flavours always read as one deliberate block rather than an
auto-fit grid reflowing card sizes.

The grid's entrance (fading and rising in as a whole, over the video) is
driven by the pinned scene timeline described above, in
`initMatchaScene()`. It's at rest once on screen — no idle animation loop —
and `initMatchaGridMotion()` in `src/main.js` only kicks in on hover: a
card lifts and scales slightly and tilts toward your cursor (a lightweight
3D effect, `perspective` on `.matcha-grid` in `src/style.css`), with the
cup image itself drifting slightly opposite for a bit of parallax, then
eases back to rest on mouse-leave. All of it is skipped under
`prefers-reduced-motion`, same as the rest of the site. To add a ninth
flavour, drop a same-style export into `public/images/matcha/` and add one
line to the `MATCHA` array (you'll also want to adjust the grid's column
count to fit).

Below 720px wide, the pin/scrub scene is kept (it's the whole interactive
point of this section) but reshaped to actually fit a fixed `100svh`
frame: `#matchaHead` sheds the generic `.section-head` component's
110px/50px padding and shrinks its heading, and — the bigger change —
`.matcha-grid` switches from a 4×2 layout to a single horizontally
scrollable row of cards (`overflow-x: auto` + `scroll-snap`), so its
height stays constant (~150px) no matter how many flavours there are,
instead of growing with the row count. Swiping through flavours over the
video becomes a left-right gesture on mobile instead of a static grid —
arguably closer to the flavour carousel elsewhere on the page than a
downgrade. Because this is real native horizontal scrolling (not a
transform-drag like the flavour carousel), the browser handles the touch
axis correctly on its own: a horizontal swipe scrolls the row, a vertical
one passes straight through to the page — no JS axis-locking needed here.
`prefers-reduced-motion` still gets the full static/unpinned fallback
(see the media query below this one) since that's a real accessibility
requirement, not a device-width one.

### The tiramisu photo layers

Source: the 6 individually-exported layer photos you sent (each already
isolated with real alpha transparency, no cropping by me needed). Saved as
`.webp` at `public/images/layers/` — `drizzle`, `cream-swirl`, `cocoa-dust`,
`cream-disc`, `biscuit`, `cup`. A real tiramisù has two layers of sponge and
two of mascarpone, so `cream-disc.webp` and `biscuit.webp` are each reused
twice in the stack (see the `<img>` list in `index.html`, `data-layer="0"`
and `"2"` are both biscuits, `"1"` and `"3"` are both cream). The stack is a
plain vertical flex column (`.tiramisu-photo-stack` in `src/style.css`) —
each layer's `width` and the negative `margin-bottom` that controls how much
it overlaps the layer below are hand-tuned in the `.t-drizzle` / `.t-swirl` /
`.t-dust` / `.t-cream` / `.t-biscuit` / `.t-cup` rules. If you send sharper
or differently-cropped source shots, drop them into
`public/images/layers/` with the same filenames and those width/overlap
numbers may need a small nudge to match the new proportions.

Same story as the matcha scene above: below 720px wide, the pin/scrub
build animation is kept rather than dropped — the exploded-to-assembled
cup build is the point on mobile too. To make it actually fit a fixed
`100svh` frame, the paragraph description is hidden (`.layers-desc {
display: none }`), the heading shrinks, and the cup stack itself shrinks
further (`min(170px, 42vw)` vs. desktop's `min(300px, 58vw)`). Verified
against iPhone SE (375×667), a standard 390×844 phone, and a compact
Android size (360×740) — the assembled cup comfortably clears the
viewport with room to spare on all three. `prefers-reduced-motion` gets
its own full unpin below (a real accessibility need, unlike phone width).

### The flavour carousel

Source: the eight exploded-view tiramisù renders you sent, one per flavour
— Classic, Biscoff, Banoffee, Bar One, Ferrero Rocher, White Chocolate
Hazelnut, Hazelnut, Pistachio. Each was trimmed to its content (no stray
transparent margin) and saved to `.webp` at `public/images/flavours/`. This
replaces the earlier placeholder menu (which had invented flavours like
Blueberry and Strawberry with no photo behind them) with your actual
lineup — the data list mapping each file to its name and description lives
in `src/modules/flavours.js`.

Each `.flavour-card` in the draggable carousel now carries its real photo
pinned to the top of the card (`object-fit: contain`, so nothing is
cropped — some of these renders are nearly square, others tall, and this
keeps every layer of each tower visible), with the flavour name and
description on a dark scrim beneath, same as before. The card's brand-colour
gradient (`--card-a` / `--card-b`) still shows through behind the photo, so
each card keeps its own accent tone. To add a ninth flavour, drop a
same-style trimmed `.webp` into `public/images/flavours/` and add one line
to the `FLAVOURS` array with its name, description, and pixel dimensions
(used to reserve layout space and avoid a jump as it loads).

The drag/swipe is axis-locked on touch devices (`initDragCarousel()` in
`src/modules/flavours.js`): the first few pixels of a touch move decide
whether the gesture reads as horizontal or vertical. Horizontal locks the
carousel drag and blocks page scroll for the rest of that gesture (via
`preventDefault()`); vertical immediately releases the carousel and lets
the page scroll as normal. `touch-action: pan-y` on `.flavour-carousel` in
`src/style.css` backs this up at the CSS layer. Mouse drag on desktop is
unaffected — it never had a scroll conflict to begin with.

### Our Space

Source: the interior shot of the Claremont store you sent. Saved to
`.webp` at `public/images/space/cafe-interior.webp`.

Rather than swap in a static photo, `.space-photo` in `src/style.css` runs
a slow, continuous "Ken Burns" animation — a 26-second zoom-and-drift
(`scale(1.12) → scale(1.24)` with a slight diagonal pan) that loops back
and forth forever, so the still photo reads as a live, panning video shot
rather than a frozen image. A second layer, `.space-photo-shine`, adds an
occasional soft diagonal glint that sweeps across the room roughly every
11 seconds — a glossy, catch-the-light touch that reads as "lux" without
needing real video. On top of both, `.space-vignette` darkens the top and
bottom of the frame (radial + linear gradients) so the heading and address
stay legible against a busy photo, and the text itself now sits in the
bottom third of the frame — a more cinematic, poster-style composition
than the old dead-centre placement.

This sits alongside the pre-existing scroll parallax (`initSpaceParallax()`
in `src/main.js`, unchanged) — the photo layer still drifts vertically
against the section as you scroll past it, so you get both the constant
ambient motion and the scroll-linked depth shift at once. Under
`prefers-reduced-motion`, the Ken Burns and shine animations are dropped
via a CSS media query and the scroll parallax is skipped in JS, leaving a
calm, static, slightly-zoomed still frame. To swap in a different room
shot, replace `public/images/space/cafe-interior.webp` with the same
filename — a wider or more evenly-lit shot will give the zoom/pan more
room to move without ever showing an edge.

The pinned photo (`.space-hero`, still 100vh) is now followed, inside the
same `<section id="space">`, by a short highlights block
(`.space-highlights`) on the `--espresso-light` tone used elsewhere on the
page — a deliberate step down in brightness/energy after the cinematic
hero, not a repeat of it. It's built from the brand positioning lines you
sent (the "sweet escape," "soft neutral tones," "visually immersive,"
"indulgence and sophistication," and "lounge seating" copy), rewritten to
fit the site's short, restrained sentence style rather than dropped in
verbatim — an italic serif intro line, then four short lines in a
4-column grid (2 columns on tablet, 1 on phone), each marked with a small
gold ✦ rather than the illustrated icons in your reference, to keep the
mark language consistent with the rest of the site instead of introducing
a new, lighter icon style. Both the intro and the four lines fade/rise in
on scroll (`initScrollReveals()` in `src/main.js`), matching how every
other section heading on the page reveals.

### Events

This section replaces the old "Product Spotlight" — a generic cube with
placeholder flavour names and no real content behind it. Everything in the
three package cards, the "Need more coverage?" line, the nine signature
flavours, and the seven "perfect for" occasions is pulled directly from
the `misu_events.pdf` one-pager you sent (Tiramisù Tray R1,600 / serves
30–35, Luxury Perspex Box R6,200 / serves 80–90, Live Serving Experience
R6,660 all-inclusive / serves 45), rewritten only where needed to fit the
site's short-sentence style — no pricing or copy was invented.

You said you liked the interactive block, so the drag-to-rotate cube
(`spotlight.js`, unchanged) stays — same stage element IDs, same physics
— just re-themed with labels that describe what a booking actually
includes (Tiramisù Tray, Perspex Box, Live Serving, Weddings, Corporate,
Custom Art) instead of flavour names, and resized slightly (200px down
from 220px) so the longer labels fit each face without wrapping awkwardly.
It originally sat beside an AI-rendered "unpacking tray" image; that's
been removed on request, so the cube is now centred in the row on its
own and its face text is sized up slightly (1.05rem → 1.25rem) to carry
that extra visual weight by itself.

The "Enquire About Events" button is a plain `mailto:info@misucafe.co.za`
link — it opens the visitor's own email client with your address ready to
go, the same pattern used for the footer contact details.

### Franchise

A new section straight after Events, built from the franchise one-pager
copy you sent — no invented claims, no placeholder numbers. The head
(eyebrow "For The Modern Entrepreneur", "Designed to be experienced.")
and the italic line beneath it use your shorter pitch; the two-column
body below pairs your fuller business-case paragraphs with a "Why MISÙ"
card built from your five bullet points (Luxury Grab-and-Go Model, Low
Overheads, Trend-Driven Menu, Scalable Concept, Proven Systems &
Support), each split into a bold title and its one-line description so
they scan quickly. It closes on your "ready to own a refined,
future-focused café concept" line and a single CTA.

The "Join the MISÙ Franchise" button links straight out to your Typeform
application (`https://form.typeform.com/to/Ix5bfp4M`) in a new tab —
unlike the Events and footer contact links, this one leaves the site, so
it opens a new tab rather than navigating away from the page. Both the
top nav and the "Bring MISÙ Home" teaser card at the bottom of the page
now point at `#franchise` instead of the placeholder `#` they used
before this section existed.

### Logo

The header, the loading screen and the footer previously spelled out
"MISÙ" using the site's own display font (Cormorant Garamond) — a
typographic stand-in, not your actual logo. All three now use the real
logo file you sent (`MISU_LOGO_2.png`), recoloured white so it reads
against the site's dark backgrounds.

The recolour was done by treating the logo's brown ink as a solid fill
and its white background as fully transparent, then rebuilding the alpha
channel from how far each pixel sits between those two colours — that
preserves your original anti-aliased letter edges (no jagged or fuzzy
edges) rather than just thresholding black-or-white. The result is saved
at `public/images/brand/misu-logo-white.webp`. If you'd rather see it in
your brand brown on a lighter surface somewhere, or want a version with
the "Tiramisù & Matcha Café" tagline included, send a note and I'll
generate that variant the same way.

Also removed: the "Order Now" button that sat in the header — the nav
now closes with just the brand mark on the left and the section links on
the right.

## SEO

Everything that can be done in code is done. Realistically though: no
amount of on-page work guarantees a #1 ranking — that also depends on
things outside this codebase (backlinks, reviews, how much competing
cafés have invested in SEO, Google's local-pack algorithm). Below is what's
in place, and what's worth doing next outside the code.

**In the code:**

- `<title>` and meta description rewritten to lead with the actual search
  terms people use — "tiramisù", "matcha", "Claremont", "Cape Town" —
  instead of just the brand name. Same copy reused for Open Graph and
  Twitter card tags, so links shared on WhatsApp/Instagram/X/LinkedIn show
  a proper preview card instead of a bare URL.
- `public/og-image.jpg` — a 1200×630 branded share image generated from
  your real logo and site colours, referenced by the Open Graph/Twitter
  tags above.
- JSON-LD structured data (`<script type="application/ld+json">` in
  `index.html`) describing MISÙ as a `CafeOrCoffeeShop` — name, address,
  cuisine, socials. This is what lets Google show a rich result (map
  pin, hours, rating) instead of a plain blue link, *if* it's also backed
  by a Google Business Profile (see below — that's the part I can't do
  for you).
- `robots.txt` and `sitemap.xml` in `public/`, so search engines are
  explicitly told the site is indexable and where the page lives.
- `site.webmanifest` plus a full favicon/app-icon set (`favicon.ico`,
  16/32px PNGs, Apple touch icon, Android icons) generated from your
  actual logo — a site with a proper favicon and "Add to Home Screen"
  icon reads as more trustworthy to both users and search engines than
  one with the default blank-page icon.
- `lang="en-ZA"` on `<html>` (was generic `en`) — a small local-relevance
  signal for South African search results.
- Image alt text was already solid throughout (each photo describes what
  it actually shows) — left as-is, just double-checked.

**Not in the code — worth doing next, roughly in order of impact:**

1. **Google Business Profile.** For a physical café, this matters more
   than anything on the website itself — it's what actually shows the pin,
   hours, reviews, and photos in Maps and the local "3-pack" above normal
   search results. If you don't have one live yet at
   business.google.com, this is the single highest-leverage thing you can
   do this week.
2. **Give me your phone number and real opening hours** and I'll add them
   to the JSON-LD block (`telephone` and `openingHoursSpecification`) — I
   deliberately left them out rather than guess.
3. **Reviews.** Google (and Instagram/TikTok mentions) reward businesses
   with a steady stream of recent, genuine reviews. Worth a small sign or
   till-side prompt asking happy customers to leave one.
4. **Backlinks.** Getting listed on Cape Town food blogs, "best desserts
   in Claremont" roundups, and halaal/dessert directories (you're already
   listed on Hungry For Halaal) all help. Local backlinks tend to matter
   more for local search than generic ones.
5. **Keep publishing.** A static homepage that never changes gives
   search engines little reason to recrawl it often. Once there's a
   real content stream — new flavour drops, events, Instagram posts — it's
   worth linking back to the site from those.

## Brand colours

I couldn't pull your exact hex codes (only text/structure from your live
site), so I approximated a warm neutral cinematic palette from the
description on misucafe.co.za. All colours are CSS variables at the top of
`src/style.css` — update them there once and the whole site follows:

```css
--espresso: #171009;   /* background */
--cream: #f4ead9;      /* primary text */
--matcha: #8ba668;     /* matcha accent */
--gold: #c9a15a;       /* ambient glow / CTA accents */
--blush: #d99b86;      /* strawberry / warm accent */
```

## What's built vs. what's next

This prototype is the **homepage only** — Tiramisù, Matcha, Our Space,
Events and Franchise are all anchor links to sections on this one page,
not separate pages. Once you're happy with the direction, the natural
next step is turning each nav item into its own page using the same
visual language.

The footer newsletter form ("Join") validates the email address and shows
an inline confirmation, but there's no backend behind it yet — nothing is
actually captured or emailed anywhere. `initFooterForm()` in `src/main.js`
is written so the submit handler is the only place that needs to change:
swap its body for a `fetch()` call to a real email service (Mailchimp,
Klaviyo, Formspree, etc.) once you've picked one.

## Run it locally

```bash
npm install
npm run dev       # http://localhost:5173
```

## Deploy — GitHub + Vercel

```bash
git init
git add .
git commit -m "Initial cinematic homepage prototype"
git branch -M main
git remote add origin <your-empty-github-repo-url>
git push -u origin main
```

Then on [vercel.com](https://vercel.com):

1. **Add New → Project**, import the GitHub repo you just pushed.
2. Vercel auto-detects Vite (there's also a `vercel.json` in this repo
   pinning build command `npm run build` and output dir `dist`, so you
   shouldn't need to change anything).
3. Deploy. You'll get a `*.vercel.app` preview URL immediately — point your
   `misucafe.co.za` domain at it from the Vercel project's Domains tab
   whenever you're ready to go live.

## Project structure

```
index.html              markup for every homepage section
src/style.css            all styling + design tokens (brand colours at top)
src/main.js               boots every interaction (scroll, cursor, drag, etc.)
src/modules/
  matchaCanvas.js         generative matcha-pour canvas animation
  flavours.js              flavour data + draggable carousel
  matchaGrid.js            ceremonial matcha grade data
  spotlight.js             drag-to-rotate 3D cube (used in Events)
public/images/layers/         the 8 cropped tiramisu photo pieces
public/images/matcha/          the 8 matcha flavour shots
public/images/flavours/        the 8 tiramisu flavour carousel shots
public/images/space/           the café interior shot for "Our Space"
public/images/brand/           the white logo used in the header, preloader and footer
public/video/                  the matcha-sip video (mp4 + webm + poster)
public/images, public/video   drop more real product photos/video here
```
