import { SITE, PRODUCTS, findProduct, formatMoney } from './data.js';

/** @type {{ key: string, id: string, color: string, size: string, qty: number }[]} */
let reservations = [];

function lineKey(id, color, size) {
  return `${id}::${color}::${size}`;
}

export function getReservations() {
  return reservations;
}

export function reservationCount() {
  return reservations.reduce((n, r) => n + r.qty, 0);
}

export function reservationTotal() {
  return reservations.reduce((sum, r) => {
    const p = findProduct(r.id);
    return sum + (p ? p.price * r.qty : 0);
  }, 0);
}

export function addReservation(id, color, size, qty = 1) {
  const key = lineKey(id, color, size);
  const existing = reservations.find((r) => r.key === key);
  if (existing) existing.qty += qty;
  else reservations.push({ key, id, color, size, qty });
}

export function changeReservationQty(key, delta) {
  const item = reservations.find((r) => r.key === key);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) reservations = reservations.filter((r) => r.key !== key);
}

export function buildInstagramMessage() {
  if (reservations.length === 0) return '';

  const lines = reservations.map((r) => {
    const p = findProduct(r.id);
    return `· ${p.name} (${p.catalog}) — ${r.color}, talla ${r.size} × ${r.qty} — ${formatMoney(p.price * r.qty)}`;
  });

  return [
    'Hola Unknown Wax, quiero reservar:',
    '',
    ...lines,
    '',
    `Total estimado: ${formatMoney(reservationTotal())}`,
    '',
    'Gracias.',
  ].join('\n');
}

export function confirmViaInstagram(onCopied) {
  const message = buildInstagramMessage();
  if (!message) return;

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(message).then(onCopied).catch(() => onCopied());
  } else {
    onCopied();
  }

  window.open(SITE.instagram, '_blank', 'noopener,noreferrer');
}

export function renderReservationsPanel() {
  const countEl = document.getElementById('cart-count');
  const itemsEl = document.getElementById('cart-items');
  const totalEl = document.getElementById('cart-total');
  const confirmBtn = document.getElementById('confirm-btn');

  if (countEl) countEl.textContent = String(reservationCount());

  if (!itemsEl) return;

  if (reservations.length === 0) {
    itemsEl.innerHTML =
      '<p class="cart-empty">No tienes reservas pendientes. Elige talla y color en el catálogo.</p>';
  } else {
    itemsEl.innerHTML = reservations
      .map((r) => {
        const p = findProduct(r.id);
        return `
          <div class="cart-item" data-key="${r.key}">
            <div>
              <p class="cart-item-name">${p.name}</p>
              <p class="cart-item-meta">${p.catalog} · ${r.color} · Talla ${r.size}<br>${formatMoney(p.price)} c/u</p>
            </div>
            <div class="cart-item-qty">
              <button class="qty-btn" type="button" data-dec="${r.key}" aria-label="Quitar una">−</button>
              <span class="mono">${r.qty}</span>
              <button class="qty-btn" type="button" data-inc="${r.key}" aria-label="Añadir una">+</button>
            </div>
          </div>
        `;
      })
      .join('');

    itemsEl.querySelectorAll('[data-inc]').forEach((btn) => {
      btn.addEventListener('click', () => {
        changeReservationQty(btn.dataset.inc, 1);
        renderReservationsPanel();
      });
    });
    itemsEl.querySelectorAll('[data-dec]').forEach((btn) => {
      btn.addEventListener('click', () => {
        changeReservationQty(btn.dataset.dec, -1);
        renderReservationsPanel();
      });
    });
  }

  if (totalEl) totalEl.textContent = formatMoney(reservationTotal());
  if (confirmBtn) confirmBtn.disabled = reservations.length === 0;
}

export function openDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const toggle = document.getElementById('cart-toggle');
  drawer?.classList.add('is-open');
  backdrop?.classList.add('is-open');
  drawer?.setAttribute('aria-hidden', 'false');
  toggle?.setAttribute('aria-expanded', 'true');
}

export function closeDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const toggle = document.getElementById('cart-toggle');
  drawer?.classList.remove('is-open');
  backdrop?.classList.remove('is-open');
  drawer?.setAttribute('aria-hidden', 'true');
  toggle?.setAttribute('aria-expanded', 'false');
}

export function pulseCartButton() {
  document.getElementById('cart-toggle')?.classList.add('is-pulse');
  setTimeout(() => {
    document.getElementById('cart-toggle')?.classList.remove('is-pulse');
  }, 480);
}

export function initCartUI() {
  const drawer = document.getElementById('cart-drawer');
  const backdrop = document.getElementById('cart-backdrop');
  const toggle = document.getElementById('cart-toggle');
  const closeBtn = document.getElementById('cart-close');
  const confirmBtn = document.getElementById('confirm-btn');
  const note = document.getElementById('cart-note');

  toggle?.addEventListener('click', () => {
    drawer?.classList.contains('is-open') ? closeDrawer() : openDrawer();
  });
  closeBtn?.addEventListener('click', closeDrawer);
  backdrop?.addEventListener('click', closeDrawer);

  confirmBtn?.addEventListener('click', () => {
    confirmViaInstagram(() => {
      if (note) {
        note.textContent =
          'Mensaje copiado. Pégalo en Instagram al escribirnos. Abrimos tu perfil ahora.';
      }
      showToast('Reserva copiada. Pégala en Instagram.');
    });
  });

  renderReservationsPanel();
}

function showToast(text) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

export { showToast };
