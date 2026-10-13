/* ==========================================================================
   Julio Ribes — script.js
   JavaScript vanilla compartido por todas las páginas.
   Cada módulo comprueba si existe su marcado antes de ejecutarse.
   ========================================================================== */
(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     1. Cabecera: estado al hacer scroll y menú móvil
     ---------------------------------------------------------------------- */
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

  /* ----------------------------------------------------------------------
     2. Enlace activo en la navegación según la página actual
     ---------------------------------------------------------------------- */
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

  /* ----------------------------------------------------------------------
     3. Aparición suave de bloques al entrar en pantalla
     ---------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.1 });

    items.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------------------
     4. Carrusel de reseñas (flechas, puntos, autoplay, swipe)
     ---------------------------------------------------------------------- */
  function initSlider() {
    var slider = document.querySelector("[data-slider]");
    if (!slider) return;

    var track = slider.querySelector(".slider__track");
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = slider.querySelector(".slider__dots");
    var prevBtn = slider.querySelector("[data-slider-prev]");
    var nextBtn = slider.querySelector("[data-slider-next]");
    var index = 0;
    var timer = null;
    var AUTOPLAY_MS = 6000;

    if (slides.length < 2) {
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
      return;
    }

    // Puntos de navegación generados a partir del número de slides
    var dots = slides.map(function (_, i) {
      var dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider__dot";
      dot.setAttribute("aria-label", "Ir a la reseña " + (i + 1));
      dot.addEventListener("click", function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      dots.forEach(function (dot, j) {
        if (j === index) {
          dot.setAttribute("aria-current", "true");
        } else {
          dot.removeAttribute("aria-current");
        }
      });
      slides.forEach(function (slide, j) {
        slide.setAttribute("aria-hidden", String(j !== index));
      });
    }

    function start() {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = window.setInterval(function () { goTo(index + 1); }, AUTOPLAY_MS);
    }

    function stop() {
      window.clearInterval(timer);
    }

    function restart() {
      stop();
      start();
    }

    prevBtn.addEventListener("click", function () { goTo(index - 1); restart(); });
    nextBtn.addEventListener("click", function () { goTo(index + 1); restart(); });
    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    // Deslizar con el dedo en pantallas táctiles
    var startX = 0;
    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX;
      stop();
    }, { passive: true });

    track.addEventListener("touchend", function (e) {
      var delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) goTo(delta < 0 ? index + 1 : index - 1);
      start();
    });

    goTo(0);
    start();
  }

  /* ----------------------------------------------------------------------
     5. Pestañas de libros (Español / English)
     ---------------------------------------------------------------------- */
  function initTabs() {
    var tablist = document.querySelector("[role='tablist']");
    if (!tablist) return;

    var tabs = Array.prototype.slice.call(tablist.querySelectorAll("[role='tab']"));

    function activate(tab) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
      tab.focus();
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener("click", function () { activate(tab); });
      tab.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight") activate(tabs[(i + 1) % tabs.length]);
        if (e.key === "ArrowLeft") activate(tabs[(i - 1 + tabs.length) % tabs.length]);
      });
    });
  }

  /* ----------------------------------------------------------------------
     6. Libros: girar la portada para ver la contraportada
     ---------------------------------------------------------------------- */
  function initBookFlip() {
    var buttons = document.querySelectorAll("[data-flip]");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        var book = btn.closest(".book");
        if (!book) return;
        var flipped = book.classList.toggle("is-flipped");
        btn.setAttribute("aria-pressed", String(flipped));
        var label = btn.querySelector("span");
        if (label) label.textContent = flipped ? "Ver portada" : "Ver contraportada";
      });
    });
  }

  /* ----------------------------------------------------------------------
     7. Año actual en el pie
     ---------------------------------------------------------------------- */
  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ----------------------------------------------------------------------
     Arranque
     ---------------------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", function () {
    initHeader();
    initActiveLink();
    initReveal();
    initSlider();
    initTabs();
    initBookFlip();
    initYear();
  });
})();
