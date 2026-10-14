# Julio Ribes — Osteopatía · Pilates · Salud Integral · Formación

Sitio web de Julio Ribes (Gandía): centro de osteopatía y Pilates, proyecto de divulgación
Optimización Circadiana, colección de libros Salud Integral y Ciencia y formación en CIM Formación Valencia.

HTML5, CSS3 y JavaScript vanilla. Sin frameworks, sin build, sin dependencias.

## Estructura

```
├── index.html                    Inicio
├── centro.html                   Centro de Osteopatía y Pilates
├── optimizacion-circadiana.html  Optimización Circadiana
├── libros.html                   Salud Integral y Ciencia
├── formacion.html                Formación
├── sobre-julio.html              Sobre Julio
├── contacto.html                 Contacto
├── reservar.html                 Reservar cita
├── css/
│   ├── base.css                  Tokens, reset, tipografía, layout y utilidades
│   ├── layout.css                Cabecera y pie
│   ├── components.css            Botones, listas, libros, reseñas, tarjetas, contacto, FAQ
│   ├── pages.css                 Hero, cifras, bloque circadiano, CTA, galería
│   └── responsive.css            Media queries (se carga en último lugar)
├── js/
│   ├── nav.js                    Cabecera al hacer scroll, menú móvil, enlace activo
│   ├── reveal.js                 Aparición de bloques al entrar en pantalla
│   ├── slider.js                 Carrusel de reseñas
│   ├── tabs.js                   Pestañas de libros por idioma
│   ├── books.js                  Giro portada / contraportada
│   ├── faq.js                    Una sola pregunta abierta por bloque
│   └── footer.js                 Año actual
├── img/
│   ├── julio/                    Retratos y fotos de Julio
│   ├── centro/                   Instalaciones y clases
│   ├── libros/                   Portadas y contraportadas
│   └── circadiana/               Publicaciones de Instagram
├── favicon.ico
├── robots.txt · sitemap.xml · llms.txt
└── README.md
```


## Convenciones

- Nombres de clase en BEM (`.site-nav__link`, `.btn--gold`).
- Colores, tipografías y medidas definidas como custom properties en `:root`.
- Iconos como SVG inline; sin librerías de iconos.
- Cada archivo de `js/` es un módulo independiente que comprueba si existe su marcado antes de
  ejecutarse, así los mismos archivos sirven para todas las páginas. Se cargan con `defer`.
- Tipografías desde Google Fonts: Fraunces (titulares), Manrope (texto) y Allura (logotipo).

## SEO y datos estructurados

- Canónica, Open Graph y Twitter Card en cada página.
- JSON-LD por página (Person, MedicalBusiness con horarios y reseñas, Organization, Book, FAQPage,
  BreadcrumbList). Todo sale del mismo sitio para no duplicar datos.
- `robots.txt` (permite rastreadores de IA), `sitemap.xml` y `llms.txt`.

## Pendiente

- Coordenadas del centro (`geo` en el JSON-LD).
- Añadir más reseñas al carrusel: copiar un `<li class="slide">` dentro de `.slider__track`;
  los puntos de navegación se generan solos.
