/* ==========================================================================
   Julio Ribes — whatsapp.js
   Corrige el dibujo del logotipo de WhatsApp que pinta el widget de reservas
   (botón flotante, cabecera del chat y botón de enviar). No modifica el
   widget: solo sustituye el icono por el logotipo oficial, conservando su
   color y su tamaño. Funciona aunque el widget use Shadow DOM.
   Este archivo se carga sin defer, antes que el widget, para poder registrar
   las zonas de Shadow DOM en el momento en que se crean.
   ========================================================================== */
(function () {
  "use strict";

  var PATH =
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z";
  var SVG_NS = "http://www.w3.org/2000/svg";
  var ICON_RATIO = 0.54; // tamaño del logotipo respecto al círculo que lo contiene

  /* ----------------------------------------------------------------------
     1. Registrar las zonas de Shadow DOM (abiertas o cerradas) al crearse
     ---------------------------------------------------------------------- */
  var roots = [];
  var nativeAttach = Element.prototype.attachShadow;
  if (nativeAttach) {
    Element.prototype.attachShadow = function (init) {
      var root = nativeAttach.call(this, init);
      roots.push(root);
      watch(root);
      return root;
    };
  }

  /* ----------------------------------------------------------------------
     2. Localizar iconos dentro de botones redondos y sustituirlos
     ---------------------------------------------------------------------- */
  function roundAncestor(el) {
    var node = el.parentElement;
    for (var i = 0; node && i < 4; i++) {
      var r = node.getBoundingClientRect();
      if (r.width >= 28 && r.width <= 120 && Math.abs(r.width - r.height) < 4) {
        var radius = getComputedStyle(node).borderTopLeftRadius;
        var px = radius.indexOf("%") > -1 ? (parseFloat(radius) / 100) * r.width : parseFloat(radius);
        if (px >= r.width * 0.4) return node;
      }
      node = node.parentElement;
    }
    return null;
  }

  function visible(paint) {
    return paint && paint !== "none" && paint.indexOf("url(") !== 0 && paint !== "rgba(0, 0, 0, 0)";
  }

  // Color realmente pintado por el icono original: primer relleno visible
  // y, si todo es contorno, el color del trazo.
  function iconColor(el) {
    if (el.tagName.toLowerCase() === "img") return "#fff";
    var shapes = el.querySelectorAll("path, circle, ellipse, rect, polygon, use");
    var i, cs;
    for (i = 0; i < shapes.length; i++) {
      cs = getComputedStyle(shapes[i]);
      if (visible(cs.fill)) return cs.fill;
    }
    for (i = 0; i < shapes.length; i++) {
      cs = getComputedStyle(shapes[i]);
      if (visible(cs.stroke)) return cs.stroke;
    }
    return "#fff";
  }

  function officialIcon(size, color) {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    svg.setAttribute("data-wa-fixed", "");
    svg.style.cssText = "display:block;flex:none;margin:auto;width:" + size + "px;height:" + size + "px";
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", PATH);
    path.setAttribute("fill", color);
    svg.appendChild(path);
    return svg;
  }

  function fix(root) {
    var icons = root.querySelectorAll("svg:not([data-wa-fixed]), img:not([data-wa-fixed])");
    for (var i = 0; i < icons.length; i++) {
      var icon = icons[i];
      // En la página solo tocamos lo que está fuera de nuestra propia estructura.
      if (root === document && icon.closest("header, main, footer")) continue;
      if (icon.closest("svg[data-wa-fixed]")) continue;
      var circle = roundAncestor(icon);
      if (!circle) continue;
      var size = Math.round(circle.getBoundingClientRect().width * ICON_RATIO);
      icon.replaceWith(officialIcon(size, iconColor(icon)));
    }
  }

  function fixAll() {
    fix(document);
    for (var i = 0; i < roots.length; i++) fix(roots[i]);
  }

  /* ----------------------------------------------------------------------
     3. Repetir cuando el widget añade o redibuja elementos
     ---------------------------------------------------------------------- */
  var pending = null;
  function schedule() {
    clearTimeout(pending);
    pending = setTimeout(fixAll, 30);
  }

  function watch(target) {
    new MutationObserver(schedule).observe(target, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
  }

  document.addEventListener("DOMContentLoaded", function () {
    watch(document.body);
    fixAll();
  });
  window.addEventListener("load", fixAll);
})();
