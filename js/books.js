/* ==========================================================================
   Julio Ribes — books.js
   Libros: girar la portada para ver la contraportada
   ========================================================================== */
(function () {
  "use strict";

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

  document.addEventListener("DOMContentLoaded", function () {
    initBookFlip();
  });
})();
