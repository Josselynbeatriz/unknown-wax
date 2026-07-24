import { initCartUI } from './cart.js';
import { initApp } from './ui.js';
import { initHeroScene } from './scene.js';
import { initHeroScroll } from './hero.js';

initApp();
initCartUI();
initHeroScene(document.getElementById('hero-canvas'));
initHeroScroll();
