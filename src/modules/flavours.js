export const FLAVOURS = [
  { name: 'Classic', slug: 'classic', desc: 'Espresso-soaked savoiardi, mascarpone, cocoa dust.', a: '#8a5a34', b: '#4a3220', w: 695, h: 1100 },
  { name: 'Biscoff', slug: 'biscoff', desc: 'Caramelised Lotus biscuit crumble folded through mascarpone.', a: '#a97b4f', b: '#5c3d24', w: 700, h: 759 },
  { name: 'Banoffee', slug: 'banoffee', desc: 'Banana, toffee, mascarpone — finished with cocoa snow.', a: '#b98a44', b: '#5c4420', w: 700, h: 735 },
  { name: 'Bar One', slug: 'bar-one', desc: 'Chocolate-caramel Bar One folded through mascarpone.', a: '#9c6a3a', b: '#4f2f18', w: 700, h: 708 },
  { name: 'Ferrero Rocher', slug: 'ferrero-rocher', desc: 'Whole Ferrero Rocher and hazelnut praline through chocolate mascarpone.', a: '#8a6a3a', b: '#4a3218', w: 700, h: 733 },
  { name: 'White Chocolate Hazelnut', slug: 'white-chocolate-hazelnut', desc: 'White chocolate and toasted hazelnut through silky mascarpone.', a: '#c9a877', b: '#6b5232', w: 700, h: 719 },
  { name: 'Hazelnut', slug: 'hazelnut', desc: 'Roasted hazelnut praline through mascarpone cream.', a: '#7a5636', b: '#43301d', w: 700, h: 710 },
  { name: 'Pistachio', slug: 'pistachio', desc: 'Sicilian pistachio cream, delicate and nutty.', a: '#6b8a52', b: '#3f5330', w: 700, h: 723 },
];

export function renderFlavourCards(trackEl) {
  trackEl.innerHTML = FLAVOURS.map((f, i) => `
    <div class="flavour-card" style="--card-a:${f.a}; --card-b:${f.b}" data-magnetic-card>
      <img class="flavour-card-photo" src="/images/flavours/${f.slug}.webp" width="${f.w}" height="${f.h}" alt="${f.name} tiramisù" loading="lazy" />
      <span class="fc-index">0${i + 1}</span>
      <h3>${f.name}</h3>
      <p>${f.desc}</p>
    </div>
  `).join('');
}

// Draggable, momentum-based horizontal carousel.
export function initDragCarousel(wrapperEl, trackEl) {
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let current = 0;
  let velocity = 0;
  let lastX = 0;
  let raf;

  const maxScroll = () => Math.max(0, trackEl.scrollWidth - wrapperEl.clientWidth);

  function setPos(x) {
    current = Math.min(0, Math.max(-maxScroll(), x));
    trackEl.style.transform = `translateX(${current}px)`;
  }

  function pointerDown(e) {
    isDown = true;
    wrapperEl.classList.add('is-dragging');
    startX = (e.touches ? e.touches[0].clientX : e.clientX);
    scrollStart = current;
    velocity = 0;
    lastX = startX;
    cancelAnimationFrame(raf);
  }
  function pointerMove(e) {
    if (!isDown) return;
    const x = (e.touches ? e.touches[0].clientX : e.clientX);
    const delta = x - startX;
    setPos(scrollStart + delta);
    velocity = x - lastX;
    lastX = x;
  }
  function pointerUp() {
    if (!isDown) return;
    isDown = false;
    wrapperEl.classList.remove('is-dragging');
    momentum();
  }
  function momentum() {
    if (Math.abs(velocity) < 0.5) return;
    velocity *= 0.94;
    setPos(current + velocity);
    raf = requestAnimationFrame(momentum);
  }
  function onWheel(e) {
    if (Math.abs(e.deltaX) < Math.abs(e.deltaY)) return; // let vertical scroll pass
    e.preventDefault();
    setPos(current - e.deltaX);
  }

  wrapperEl.addEventListener('mousedown', pointerDown);
  wrapperEl.addEventListener('touchstart', pointerDown, { passive: true });
  window.addEventListener('mousemove', pointerMove);
  window.addEventListener('touchmove', pointerMove, { passive: true });
  window.addEventListener('mouseup', pointerUp);
  window.addEventListener('touchend', pointerUp);
  wrapperEl.addEventListener('wheel', onWheel, { passive: false });

  window.addEventListener('resize', () => setPos(current));
}
