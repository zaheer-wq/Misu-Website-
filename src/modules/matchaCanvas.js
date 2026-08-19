// Generative "matcha pour" cinematic background.
// Not real CGI footage — a lightweight canvas simulation of a swirling
// matcha pour with soft bloom, built to loop forever and react to the
// pointer. Swap this module out for a real <video> element once you
// have CGI/video assets (see README).

export function initMatchaCanvas(canvasId, opts = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const isSoft = opts.soft || false;

  let width, height, dpr;
  let mouseX = 0.5, mouseY = 0.5;
  let targetMouseX = 0.5, targetMouseY = 0.5;
  let raf;
  let start = performance.now();

  const blobCount = isSoft ? 5 : 8;
  const blobs = Array.from({ length: blobCount }, (_, i) => ({
    angle: (i / blobCount) * Math.PI * 2,
    radiusFactor: 0.18 + Math.random() * 0.22,
    speed: 0.15 + Math.random() * 0.2,
    wobble: Math.random() * Math.PI * 2,
    size: 0.22 + Math.random() * 0.28,
  }));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(now) {
    const t = (now - start) / 1000;
    mouseX += (targetMouseX - mouseX) * 0.03;
    mouseY += (targetMouseY - mouseY) * 0.03;

    ctx.clearRect(0, 0, width, height);

    // base espresso backdrop
    const base = ctx.createLinearGradient(0, 0, 0, height);
    base.addColorStop(0, '#0d0906');
    base.addColorStop(1, '#1b120d');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, width, height);

    const cx = width * (0.5 + (mouseX - 0.5) * 0.06);
    const cy = height * (0.52 + (mouseY - 0.5) * 0.04);
    const minDim = Math.min(width, height);

    ctx.globalCompositeOperation = 'lighter';
    blobs.forEach((b, i) => {
      const angle = b.angle + t * b.speed + Math.sin(t * 0.3 + b.wobble) * 0.4;
      const dist = minDim * b.radiusFactor * (1 + 0.15 * Math.sin(t * 0.5 + i));
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist * 0.6;
      const r = minDim * b.size * (isSoft ? 0.5 : 0.65);

      const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
      const alpha = isSoft ? 0.10 : 0.16;
      grad.addColorStop(0, `rgba(139,166,104,${alpha})`);
      grad.addColorStop(0.5, `rgba(92,116,66,${alpha * 0.5})`);
      grad.addColorStop(1, 'rgba(92,116,66,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // central warm glow (ceramic bowl light)
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, minDim * 0.5);
    glow.addColorStop(0, isSoft ? 'rgba(201,161,90,0.10)' : 'rgba(201,161,90,0.14)');
    glow.addColorStop(1, 'rgba(201,161,90,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, minDim * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';

    // fine grain / whisked texture
    ctx.globalAlpha = 0.03;
    for (let i = 0; i < (isSoft ? 20 : 40); i++) {
      const gx = (Math.sin(i * 12.9898 + t) * 43758.5453) % width;
      const gy = (Math.cos(i * 78.233 + t) * 12345.678) % height;
      ctx.fillStyle = '#f4ead9';
      ctx.fillRect(Math.abs(gx), Math.abs(gy), 1.4, 1.4);
    }
    ctx.globalAlpha = 1;

    raf = requestAnimationFrame(draw);
  }

  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    targetMouseX = (e.clientX - rect.left) / rect.width;
    targetMouseY = (e.clientY - rect.top) / rect.height;
  }

  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pointermove', onPointerMove);
  };
}
