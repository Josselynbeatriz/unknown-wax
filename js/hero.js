/**
 * Brazo del tocadiscos — gira al hacer scroll
 */

export function initHeroScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const hero = document.querySelector('.hero');
  const tonearm = document.getElementById('tonearm');
  if (!hero || !tonearm) return;

  const ARM_REST = -22;
  const ARM_PLAY = 2;

  function update() {
    const rect = hero.getBoundingClientRect();
    const start = window.innerHeight * 0.15;
    const end = window.innerHeight * 0.95;
    const scrolled = start - rect.top;
    const progress = Math.min(1, Math.max(0, scrolled / end));
    const angle = ARM_REST + progress * (ARM_PLAY - ARM_REST);
    tonearm.style.transform = `rotate(${angle}deg)`;
  }

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      update();
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
