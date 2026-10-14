/* ==========================================================================
   Julio Ribes — footer.js
   Año actual en el pie
   ========================================================================== */
(function () {
  "use strict";

  function initYear() {
    var el = document.querySelector("[data-year]");
    if (el) el.textContent = String(new Date().getFullYear());
  }


  document.addEventListener("DOMContentLoaded", function () {
    initYear();
  });
})();
