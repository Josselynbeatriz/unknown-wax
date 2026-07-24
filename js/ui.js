import { PRODUCTS, EVENTS, SITE, formatMoney, getColor } from './data.js';
import {
  addReservation,
  openDrawer,
  pulseCartButton,
  renderReservationsPanel,
} from './cart.js';

const selections = new Map();

function getSelection(productId) {
  if (!selections.has(productId)) {
    const product = PRODUCTS.find((p) => p.id === productId);
    const firstColor = product.colors.find((c) => c.available) || product.colors[0];
    selections.set(productId, {
      color: firstColor.name,
      size: null,
      view: 'front',
    });
  }
  return selections.get(productId);
}

export function renderProducts() {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  grid.innerHTML = PRODUCTS.map((p) => {
    const sel = getSelection(p.id);
    const color = getColor(p, sel.color);
    const frontSrc = color?.images.front || '';
    const backSrc = color?.images.back || frontSrc;

    const colorChips = p.colors
      .map(
        (c) => `
        <button type="button" class="chip${c.name === sel.color ? ' is-active' : ''}"
          data-product="${p.id}" data-color="${c.name}"
          ${c.available ? '' : 'disabled title="Próximamente"'}>
          ${c.name}${c.available ? '' : ' · pronto'}
        </button>`
      )
      .join('');

    const sizeBtns = SITE.sizes
      .map(
        (s) => `
        <button type="button" class="size-btn${sel.size === s ? ' is-active' : ''}"
          data-product="${p.id}" data-size="${s}">${s}</button>`
      )
      .join('');

    return `
      <article class="product-card" data-id="${p.id}">
        <div class="product-gallery" data-gallery="${p.id}">
          <span class="product-badge">${p.badge || p.status}</span>
          <img src="${frontSrc}" alt="${p.name}, vista frontal" data-view="front" class="${sel.view === 'back' ? 'is-hidden' : ''}">
          <img src="${backSrc}" alt="${p.name}, vista trasera" data-view="back" class="${sel.view === 'front' ? 'is-hidden' : ''}">
          <div class="gallery-tabs">
            <button type="button" class="gallery-tab${sel.view === 'front' ? ' is-active' : ''}" data-product="${p.id}" data-tab="front">Frente</button>
            <button type="button" class="gallery-tab${sel.view === 'back' ? ' is-active' : ''}" data-product="${p.id}" data-tab="back">Espalda</button>
          </div>
        </div>
        <div class="product-info">
          <p class="product-catalog mono">${p.catalog}</p>
          <h3 class="product-name">${p.name}</h3>
          <p class="product-desc">${p.description}</p>
          <p class="field-label">Color</p>
          <div class="chip-row">${colorChips}</div>
          <p class="field-label">Talla</p>
          <div class="size-row">${sizeBtns}</div>
          <div class="product-bottom">
            <div class="product-price mono">
              ${formatMoney(p.price)}
              <small>reserva · ${SITE.currency}</small>
            </div>
            <button type="button" class="reserve-btn" data-reserve="${p.id}">Reservar</button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  bindProductEvents();
  observeReveals('.product-card');
}

function bindProductEvents() {
  document.querySelectorAll('[data-color]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sel = getSelection(btn.dataset.product);
      sel.color = btn.dataset.color;
      renderProducts();
    });
  });

  document.querySelectorAll('[data-size]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sel = getSelection(btn.dataset.product);
      sel.size = btn.dataset.size;
      renderProducts();
    });
  });

  document.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sel = getSelection(btn.dataset.product);
      sel.view = btn.dataset.tab;
      renderProducts();
    });
  });

  document.querySelectorAll('[data-reserve]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.reserve;
      const sel = getSelection(id);
      const product = PRODUCTS.find((p) => p.id === id);
      const color = getColor(product, sel.color);

      if (!sel.size) {
        showInlineHint(id, 'Elige una talla antes de reservar.');
        return;
      }
      if (!color?.available) {
        showInlineHint(id, 'Este color aún no está disponible.');
        return;
      }

      addReservation(id, sel.color, sel.size, 1);
      renderReservationsPanel();
      pulseCartButton();
      openDrawer();
    });
  });
}

function showInlineHint(productId, msg) {
  const card = document.querySelector(`.product-card[data-id="${productId}"]`);
  const btn = card?.querySelector('.reserve-btn');
  if (!btn) return;
  const prev = btn.textContent;
  btn.textContent = msg;
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = prev;
    btn.disabled = false;
  }, 2200);
}

export function renderEvents() {
  const list = document.getElementById('event-list');
  if (!list) return;

  list.innerHTML = EVENTS.map(
    (e) => `
    <li class="event-item">
      <span class="event-date">${e.date}</span>
      <span>
        <span class="event-name">${e.name}</span><br>
        <span class="event-place">${e.place}</span>
      </span>
      <span class="event-tag">${e.tag}</span>
    </li>`
  ).join('');

  observeReveals('.event-item');
}

let revealObserver;

function observeReveals(selector) {
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
      },
      { threshold: 0.12 }
    );
  }
  document.querySelectorAll(selector).forEach((el) => revealObserver.observe(el));
}

export function initNav() {
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  navToggle?.addEventListener('click', () => {
    const isOpen = mainNav?.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mainNav?.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      navToggle?.setAttribute('aria-expanded', 'false');
    });
  });
}

export function initApp() {
  renderProducts();
  renderEvents();
  initNav();
}
