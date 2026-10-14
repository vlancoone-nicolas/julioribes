/* ==========================================================================
   Julio Ribes — nav.js
   Cabecera: estado al hacer scroll y menú móvil · Enlace activo en la navegación según la página actual
   ========================================================================== */
(function () {
  "use strict";

  function initHeader() {
    var header = document.querySelector(".site-header");
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    var toggle = header.querySelector(".nav-toggle");
    var nav = header.querySelector(".site-nav");
    if (!toggle || !nav) return;

    var closeNav = function () {
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
    };

    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
    });

    nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 880) closeNav();
    });
  }

  function initActiveLink() {
    var current = window.location.pathname.split("/").pop() || "index.html";
    var links = document.querySelectorAll(".site-nav__link, .site-footer__links a");

    links.forEach(function (link) {
      var href = link.getAttribute("href") || "";
      var target = href.split("#")[0] || "index.html";
      if (target === current) {
        link.setAttribute("aria-current", "page");
      }
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initActiveLink();
  });
})();
