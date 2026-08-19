import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { initMatchaCanvas } from './modules/matchaCanvas.js';
import { FLAVOURS, renderFlavourCards, initDragCarousel } from './modules/flavours.js';
import { MATCHA, renderMatchaGrid } from './modules/matchaGrid.js';
import { initSpotlight } from './modules/spotlight.js';

gsap.registerPlugin(ScrollTrigger);

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------
   Preloader
--------------------------------------------------------- */
function initPreloader() {
  const el = document.getElementById('preloader');
  const bar = el.querySelector('.preloader-bar span');
  gsap.to(bar, { width: '100%', duration: 1.1, ease: 'power2.inOut' });
  window.addEventListener('load', () => {
    setTimeout(() => {
      el.classList.add('is-hidden');
      document.body.classList.add('is-loaded');
      runHeroReveal();
    }, 500);
  });
  // Fallback in case 'load' already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      el.classList.add('is-hidden');
      document.body.classList.add('is-loaded');
      runHeroReveal();
    }, 700);
  }
}

/* ---------------------------------------------------------
   Custom cursor
--------------------------------------------------------- */
function initCursor() {
  if (window.matchMedia('(max-width: 860px)').matches) return;
  const dot = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  let dx = 0, dy = 0, rx = 0, ry = 0;
  let mx = 0, my = 0;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  });

  function raf() {
    dx += (mx - dx) * 0.9;
    dy += (my - dy) * 0.9;
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    dot.style.transform = `translate(${dx}px, ${dy}px) translate(-50%,-50%)`;
    ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  }
  raf();

  document.querySelectorAll('a, button, [data-magnetic], [data-magnetic-card]').forEach((el) => {
    el.addEventListener('mouseenter', () => ring.classList.add('is-active'));
    el.addEventListener('mouseleave', () => ring.classList.remove('is-active'));
  });
}

/* ---------------------------------------------------------
   Header show/hide on scroll
--------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById('siteHeader');
  let lastY = window.scrollY;
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 40);
      if (y > lastY && y > 200) header.classList.add('is-hidden');
      else header.classList.remove('is-hidden');
      lastY = y;
    },
  });
}

/* ---------------------------------------------------------
   Hero reveal
--------------------------------------------------------- */
function runHeroReveal() {
  const lines = document.querySelectorAll('#home .reveal-inner');
  gsap.set(lines, { yPercent: 110 });
  gsap.to(lines, {
    yPercent: 0,
    duration: 1.2,
    ease: 'power4.out',
    stagger: 0.09,
    delay: 0.15,
  });
}

/* ---------------------------------------------------------
   Generic scroll reveal for section headers
--------------------------------------------------------- */
function initScrollReveals() {
  gsap.utils.toArray('.section-head').forEach((el) => {
    gsap.from(el.children, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      stagger: 0.08,
      scrollTrigger: { trigger: el, start: 'top 80%' },
    });
  });

  const introEl = document.querySelector('.space-highlights-intro');
  if (introEl) {
    gsap.from(introEl, {
      y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: introEl, start: 'top 85%' },
    });
  }
  gsap.utils.toArray('.space-highlight').forEach((el, i) => {
    gsap.from(el, {
      y: 30, opacity: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.06,
      scrollTrigger: { trigger: '.space-highlights-grid', start: 'top 85%' },
    });
  });
}

/* ---------------------------------------------------------
   Tiramisu rich-layers pinned build
--------------------------------------------------------- */
// Built from the real MISÙ exploded-view product shot (see
// public/images/layers). DOM order of .t-photo already matches build
// order bottom-up: biscuit (data-layer 0, lands first, closest to the
// cup) through drizzle (data-layer 6, lands last, on top).
const LAYER_COPY = [
  { h: 'Coffee-Soaked Sponge.', d: 'Savoiardi dipped in rich espresso, flash dipped for the perfect crunch.' },
  { h: 'Mascarpone.', d: 'Whipped silky-smooth, just sweet enough, never heavy.' },
  { h: 'Coffee-Soaked Sponge, Again.', d: 'Layered again — no one ever said no to more savoiardi.' },
  { h: 'Mascarpone, Again.', d: 'A second fold of mascarpone, because why not!' },
  { h: 'A Veil of Cocoa.', d: 'Dusted fine and even, right before the final swirl.' },
  { h: 'Hand-Piped Finish.', d: 'Piped to order, never pre-made — this is what "fresh" looks like.' },
  { h: 'Chocolate Drizzle.', d: 'The last flourish. This is your MISÙ tiramisù.' },
];

function initTiramisuLayers() {
  const section = document.getElementById('tiramisu');
  const stack = document.getElementById('tiramisuStack');
  const layers = Array.from(stack.querySelectorAll('.t-photo[data-layer]'))
    .sort((a, b) => Number(a.dataset.layer) - Number(b.dataset.layer)); // 0 = lands first
  const heading = document.getElementById('layersHeading');
  const desc = document.getElementById('layersDesc');
  const progressBar = document.getElementById('layersProgressBar');

  const containerWidth = stack.getBoundingClientRect().width || 340;
  const offsetFactors = [0.05, 0.11, 0.17, 0.23, 0.29, 0.36, 0.44];
  const rotations = [1.4, -1.2, 1.6, -1.4, 1.8, -1.6, 2];

  layers.forEach((layer, i) => {
    gsap.set(layer, {
      y: -(containerWidth * offsetFactors[i]),
      rotate: rotations[i],
      opacity: 0,
    });
  });
  heading.textContent = LAYER_COPY[0].h;
  desc.textContent = LAYER_COPY[0].d;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.6,
      onUpdate: (self) => {
        progressBar.style.width = `${self.progress * 100}%`;
        const idx = Math.min(layers.length - 1, Math.floor(self.progress * layers.length));
        const copy = LAYER_COPY[idx];
        if (copy && heading.textContent !== copy.h) {
          heading.textContent = copy.h;
          desc.textContent = copy.d;
        }
      },
    },
  });

  layers.forEach((layer, i) => {
    tl.to(layer, { y: 0, rotate: 0, opacity: 1, duration: 1, ease: 'power2.out' }, i);
  });
}

/* ---------------------------------------------------------
   Space parallax
--------------------------------------------------------- */
function initSpaceParallax() {
  if (prefersReducedMotion) return; // CSS media query freezes the photo itself
  gsap.to('.space-layer--back', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: { trigger: '.space-section', start: 'top bottom', end: 'bottom top', scrub: true },
  });
  gsap.to('.space-layer--mid', {
    yPercent: -20,
    ease: 'none',
    scrollTrigger: { trigger: '.space-section', start: 'top bottom', end: 'bottom top', scrub: true },
  });
}

/* ---------------------------------------------------------
   Matcha ritual video (real footage, seamless loop)
   The clip is a few seconds of real MISÙ product footage, not a
   loop-matched render — its start and end frames don't line up. Rather
   than let the native `loop` attribute hard-cut between them, we fade
   the video out just before it ends, jump back to frame 0 while hidden,
   then fade back in, so the repeat reads as a soft breath instead of a
   jump-cut. Also pauses off-screen to save battery.
--------------------------------------------------------- */
function initMatchaVideo() {
  const video = document.getElementById('matchaVideo');
  if (!video) return;

  if (prefersReducedMotion) {
    video.pause();
    return; // stays on its poster frame
  }

  const FADE_WINDOW = 0.4; // seconds of the clip reserved for the crossfade
  let fading = false;

  const tryPlay = () => video.play().catch(() => {});

  video.addEventListener('timeupdate', () => {
    if (!video.duration || fading) return;
    if (video.duration - video.currentTime <= FADE_WINDOW) {
      fading = true;
      video.style.opacity = '0';
    }
  });

  video.addEventListener('ended', () => {
    video.currentTime = 0;
    tryPlay();
    requestAnimationFrame(() => {
      video.style.opacity = '1';
      fading = false;
    });
  });

  // Only run while the panel is actually on screen.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => (entry.isIntersecting ? tryPlay() : video.pause()));
    },
    { threshold: 0.2 }
  );
  observer.observe(video);
}

/* ---------------------------------------------------------
   Matcha flavour grid — hover-only motion
   Each card is real product photography with the flavour name already
   baked into the shot. The grid's entrance (as a whole) is driven by the
   pinned scroll scene in initMatchaScene() below; the cards themselves
   sit still at rest and only animate on hover — a lift + slight scale
   plus a mouse-tracked tilt/parallax, all reverting on mouseleave.
--------------------------------------------------------- */
function initMatchaGridMotion(gridEl) {
  const cards = gridEl.querySelectorAll('.matcha-flavour-card');
  if (!cards.length) return;
  if (prefersReducedMotion) return;

  cards.forEach((card) => {
    const img = card.querySelector('.matcha-flavour-img');

    card.addEventListener('mouseenter', () => {
      gsap.to(card, { y: -10, scale: 1.045, duration: 0.45, ease: 'power3.out' });
    });

    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(card, { rotateY: px * 14, rotateX: -py * 14, duration: 0.4, ease: 'power2.out' });
      gsap.to(img, { x: px * 8, y: py * 8, duration: 0.4, ease: 'power2.out' });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
      gsap.to(img, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ---------------------------------------------------------
   Matcha section scene — video pinned full-bleed for the whole
   section, scroll scrubs it from a tight zoom into its full frame as
   the heading hands off to the flavour grid in the same pinned frame.
   Same sticky-pin technique as the Rich Layers build (.layers-pin /
   .layers-section), just with two "acts" instead of seven.
--------------------------------------------------------- */
function initMatchaScene() {
  const section = document.getElementById('matcha');
  const video = document.getElementById('matchaVideo');
  const head = document.getElementById('matchaHead');
  const grid = document.getElementById('matchaGrid');
  const dim = document.getElementById('matchaVideoDim');
  if (!section || !video || !head || !grid) return;

  if (prefersReducedMotion) return; // CSS media query drops the pin/scrub entirely

  gsap.set(grid, { autoAlpha: 0, y: 30 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.35,
    },
  });

  // Everything happens in the first ~half of the scroll-through; the
  // back half is deliberate dwell time with the grid fully settled and
  // hoverable, not still-animating right up to the moment the section
  // unpins.
  tl.to(video, { scale: 1, duration: 0.4, ease: 'none' }, 0)
    .to(head, { autoAlpha: 0, y: -30, duration: 0.22, ease: 'power1.in' }, 0.14)
    .to(grid, { autoAlpha: 1, y: 0, duration: 0.26, ease: 'power2.out' }, 0.22);

  if (dim) tl.to(dim, { opacity: 0.45, duration: 0.28, ease: 'none' }, 0.18);
}

/* ---------------------------------------------------------
   Magnetic buttons
--------------------------------------------------------- */
function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ---------------------------------------------------------
   Boot
--------------------------------------------------------- */
function boot() {
  document.getElementById('year').textContent = new Date().getFullYear();

  initPreloader();
  initCursor();
  initHeader();
  initScrollReveals();
  initSpaceParallax();
  initMagnetic();
  initMatchaVideo();

  initMatchaCanvas('matchaCanvas', { soft: false });

  const track = document.getElementById('flavourTrack');
  const carousel = document.getElementById('flavourCarousel');
  renderFlavourCards(track);
  initDragCarousel(carousel, track);

  const matchaGrid = document.getElementById('matchaGrid');
  renderMatchaGrid(matchaGrid);
  initMatchaGridMotion(matchaGrid);

  initSpotlight(document.getElementById('spotlightStage'), document.getElementById('spotlightObject'));

  // Delay layers/scroll setup slightly so layout has settled (fonts/images).
  requestAnimationFrame(() => {
    initTiramisuLayers();
    initMatchaScene();
    ScrollTrigger.refresh();
  });

  if (prefersReducedMotion) {
    document.documentElement.style.scrollBehavior = 'auto';
  }
}

document.addEventListener('DOMContentLoaded', boot);
