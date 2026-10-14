/* ==========================================================================
   Julio Ribes — slider.js
   Carrusel de reseñas (flechas, puntos, autoplay, swipe)
   ========================================================================== */
(function () {
  "use strict";

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

  document.addEventListener("DOMContentLoaded", function () {
    initSlider();
  });
})();
