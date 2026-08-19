// Drag-to-rotate 3D product cube — inspired by the interactive product
// viewers referenced in the brief. Swap the cube faces for real product
// photography / turntable renders when available.

export function initSpotlight(stageEl, objectEl) {
  let rotX = -16, rotY = 30;
  let targetRotX = rotX, targetRotY = rotY;
  let isDown = false;
  let lastX = 0, lastY = 0;
  let autoSpin = true;
  let raf;

  function apply() {
    rotX += (targetRotX - rotX) * 0.12;
    rotY += (targetRotY - rotY) * 0.12;
    objectEl.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    if (autoSpin && !isDown) targetRotY += 0.08;
    raf = requestAnimationFrame(apply);
  }

  function down(e) {
    isDown = true;
    autoSpin = false;
    objectEl.classList.add('is-grabbing');
    const p = e.touches ? e.touches[0] : e;
    lastX = p.clientX; lastY = p.clientY;
  }
  function move(e) {
    if (!isDown) return;
    const p = e.touches ? e.touches[0] : e;
    const dx = p.clientX - lastX;
    const dy = p.clientY - lastY;
    targetRotY += dx * 0.4;
    targetRotX -= dy * 0.3;
    targetRotX = Math.max(-60, Math.min(60, targetRotX));
    lastX = p.clientX; lastY = p.clientY;
  }
  function up() {
    isDown = false;
    objectEl.classList.remove('is-grabbing');
    setTimeout(() => { autoSpin = true; }, 1800);
  }

  stageEl.addEventListener('mousedown', down);
  stageEl.addEventListener('touchstart', down, { passive: true });
  window.addEventListener('mousemove', move);
  window.addEventListener('touchmove', move, { passive: true });
  window.addEventListener('mouseup', up);
  window.addEventListener('touchend', up);

  raf = requestAnimationFrame(apply);
  return () => cancelAnimationFrame(raf);
}
