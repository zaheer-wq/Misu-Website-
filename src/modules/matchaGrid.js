// Real MISÙ matcha flavour shots — each image already has the flavour
// name baked into its own pill/badge, exported with a transparent
// background, so the grid just needs to place them, not re-label them.
export const MATCHA = [
  { slug: 'classic-matcha', name: 'Classic Matcha', w: 344, h: 338 },
  { slug: 'cinnamon', name: 'Cinnamon', w: 344, h: 346 },
  { slug: 'vanilla', name: 'Vanilla', w: 344, h: 340 },
  { slug: 'white-chocolate', name: 'White Chocolate', w: 344, h: 336 },
  { slug: 'salted-caramel', name: 'Salted Caramel', w: 350, h: 336 },
  { slug: 'banana-bread', name: 'Banana Bread', w: 344, h: 346 },
  { slug: 'misu-matcha', name: 'MISÙ Matcha', w: 344, h: 351 },
  { slug: 'creme-brule', name: 'Crème Brulê', w: 344, h: 349 },
];

export function renderMatchaGrid(gridEl) {
  gridEl.innerHTML = MATCHA.map((m) => `
    <div class="matcha-flavour-card" data-magnetic-card>
      <img
        class="matcha-flavour-img"
        src="/images/matcha/${m.slug}.webp"
        width="${m.w}"
        height="${m.h}"
        alt="${m.name} iced matcha"
      />
    </div>
  `).join('');
}
