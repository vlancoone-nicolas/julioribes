/* ==========================================================================
   Julio Ribes — whatsapp.js
   Rediseña el botón flotante de WhatsApp que inyecta el widget de reservas.
   No modifica el widget: localiza su botón flotante y le aplica nuestro icono
   y estilo. Si el botón es un iframe, lo oculta y muestra uno propio.
   ========================================================================== */
(function () {
  "use strict";

  var WA_URL = "https://wa.me/34691201649";
  var ICON =
    '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
    '<path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>' +
    "</svg>";

  // Un botón flotante: elemento fijo, pequeño, en la esquina inferior derecha
  // y fuera de nuestra propia estructura (cabecera, contenido, pie).
  function isFloatingButton(el) {
    if (el.closest("header, main, footer, .wa-float")) return false;
    if (getComputedStyle(el).position !== "fixed") return false;
    var r = el.getBoundingClientRect();
    if (r.width < 40 || r.width > 100 || r.height < 40 || r.height > 100) return false;
    return r.right > window.innerWidth * 0.6 && r.bottom > window.innerHeight * 0.6;
  }

  function ownButton() {
    var box = document.createElement("div");
    box.className = "wa-float";
    box.innerHTML = '<a class="wa-float__link" href="' + WA_URL + '" target="_blank" rel="noopener" aria-label="Escribir por WhatsApp">' + ICON + "</a>";
    document.body.appendChild(box);
  }

  function restyle() {
    var all = document.body.querySelectorAll("*");
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (el.hasAttribute("data-wa-styled") || !isFloatingButton(el)) continue;
      el.setAttribute("data-wa-styled", "");

      if (el.tagName === "IFRAME") {
        el.style.display = "none";
        if (!document.querySelector(".wa-float")) ownButton();
        continue;
      }

      // El elemento con la acción (enlace o botón) puede ser el propio
      // contenedor fijo o estar dentro de él. Conservamos su comportamiento
      // y sustituimos solo su aspecto.
      var link = el.matches("a, button") ? el : el.querySelector("a, button") || el;
      link.innerHTML = ICON;
      link.setAttribute("aria-label", "Escribir por WhatsApp");
      link.classList.add("wa-float__link");
      link.style.cssText = "";
      el.classList.add("wa-float");
      el.style.cssText = "";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    restyle();
    var pending = null;
    new MutationObserver(function () {
      // Los widgets suelen insertar varios nodos seguidos: agrupamos la revisión.
      clearTimeout(pending);
      pending = setTimeout(restyle, 50);
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style", "class"] });
    window.addEventListener("load", restyle);
  });
})();
