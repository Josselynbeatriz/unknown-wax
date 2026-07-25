/**
 * Unknown Wax — catálogo y eventos
 *
 * CÓMO AÑADIR UN MODELO NUEVO:
 * 1. Sube las fotos a assets/products/ (frente y espalda).
 * 2. Copia el bloque de PRODUCTS[0] y cambia id, catalog, name, images, etc.
 * 3. status: 'reserva' | 'disponible' | 'agotado'
 */

export const SITE = {
  instagram: 'https://www.instagram.com/unknown_wax/',
  instagramHandle: '@unknown_wax',
  currency: 'USD',
  sizes: ['S', 'M', 'L', 'XL', '2XL', '3XL'],
};

export const PRODUCTS = [
  // Catálogo pausado — añade modelos cuando tengas mockups finales en assets/products/
];

export const EVENTS = [
  { date: '02 AGO', name: 'Sesión Nocturna', place: 'Manta', tag: 'Cupo limitado' },
  { date: '16 AGO', name: 'Placa B', place: 'Manta', tag: 'Line-up por IG' },
  { date: '06 SEP', name: 'Unknown Wax b2b', place: 'Guayaquil', tag: 'Preventa pronto' },
];

export function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatMoney(amount) {
  return `$${amount}`;
}

export function getColor(product, colorName) {
  return product.colors.find((c) => c.name === colorName);
}
