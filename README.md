# Unknown Wax

Sitio web estático para **Unknown Wax**, sello independiente de house y minimal en Ecuador. Incluye catálogo de camisetas, carrito de reservas, agenda de eventos y confirmación por Instagram.

> Proyecto construido de forma iterativa con **IA asistida (Cursor)** y revisión manual de producto, UX y calidad técnica.

## Demo

| Recurso | Enlace |
|---------|--------|
| **Sitio en vivo** | [Abrir demo](https://unknown-wax.netlify.app) · si tu URL es distinta, actualiza este enlace |
| **Portafolio / case study** | [portfolio.html](https://unknown-wax.netlify.app/portfolio.html) |
| **Código fuente** | [github.com/Josselynbeatriz/unknown-wax](https://github.com/Josselynbeatriz/unknown-wax) |

## Qué resuelve

- Presencia web para marca musical + ropa de edición limitada
- Catálogo con tallas, colores y estados (`reserva`, `disponible`, `agotado`)
- Flujo de reserva sin backend: carrito → portapapeles → Instagram
- Agenda de eventos editable desde un solo archivo de datos

## Stack

- HTML semántico
- CSS modular (`tokens`, `layout`, `components`)
- JavaScript ES modules
- Three.js (fondo de partículas en hero)
- Netlify (deploy + headers de seguridad básicos)

## Estructura del proyecto

```
├── index.html          # Sitio Unknown Wax
├── portfolio.html      # Portafolio profesional + case study
├── css/
│   ├── tokens.css
│   ├── layout.css
│   ├── components.css
│   └── portfolio.css
├── js/
│   ├── main.js
│   ├── data.js         # Catálogo y eventos (editable)
│   ├── cart.js         # Reservas + drawer
│   ├── ui.js           # Productos y eventos
│   ├── scene.js        # Three.js
│   └── hero.js
├── assets/products/
└── netlify.toml
```

## Construcción asistida por IA

### Herramienta

**Cursor** — agente de IA para generación y refactorización de código.

### Proceso

1. **Definir el problema** — marca, catálogo, reservas sin backend complejo
2. **Generar base con IA** — layout, tokens, módulos JS
3. **Iterar por componentes** — `data.js`, `cart.js`, `scene.js`
4. **Revisión humana** — copy de marca, flujo UX, accesibilidad, pruebas manuales
5. **Deploy** — GitHub + Netlify con headers de seguridad

### Qué aceleró la IA

- Estructura HTML/CSS inicial
- Lógica del carrito y drawer
- Escena Three.js con respeto a `prefers-reduced-motion`
- Configuración de deploy (`netlify.toml`)

### Qué validé manualmente

- Tono y narrativa de la marca
- Flujo de reserva → Instagram
- Accesibilidad (`skip-link`, ARIA en drawer)
- Catálogo data-driven en `js/data.js`

## Funcionalidades destacadas

- Catálogo editable sin framework pesado
- Carrito de reservas con persistencia en `localStorage`
- Animación de hero (turntable + partículas)
- Confirmación de pedido copiada al portapapeles
- Headers de seguridad en Netlify (`X-Frame-Options`, `X-Content-Type-Options`)

## Cómo añadir un producto

1. Sube fotos a `assets/products/`
2. Copia un bloque en `js/data.js` dentro de `PRODUCTS`
3. Cambia `id`, `name`, `images`, `price`, etc.

## Autora

**Josselyn Beatriz González**  
Constructora de soluciones digitales con IA · Pentester Mentor Junior (CertiProf)

- GitHub: [@Josselynbeatriz](https://github.com/Josselynbeatriz)
- Email: edmjosselyngonzalez@gmail.com
- Portafolio: [portfolio.html](./portfolio.html)

## Licencia

Proyecto de portafolio. Uso del código sujeto a autorización de la autora.
