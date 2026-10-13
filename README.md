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
├── styles.css                    Hoja de estilos única (tokens, componentes, responsive)
├── script.js                     Menú móvil, cabecera, reveal, carrusel, pestañas, giro de portadas
└── assets/                       Fotografías y portadas
```


## Convenciones

- Nombres de clase en BEM (`.site-nav__link`, `.btn--gold`).
- Colores, tipografías y medidas definidas como custom properties en `:root`.
- Iconos como SVG inline; sin librerías de iconos.
- Cada módulo de `script.js` comprueba si existe su marcado antes de ejecutarse, así el mismo
  archivo sirve para todas las páginas.
- Tipografías desde Google Fonts: Fraunces (titulares), Manrope (texto) y Allura (logotipo).

## Pendiente

- Enlace a la página de autor en Amazon (ahora apunta a la búsqueda por autor).
- Añadir más reseñas al carrusel: copiar un `<li class="slide">` dentro de `.slider__track`;
  los puntos de navegación se generan solos.
