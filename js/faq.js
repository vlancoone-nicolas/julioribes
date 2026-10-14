/* ==========================================================================
   Julio Ribes — faq.js
   Preguntas frecuentes: solo una respuesta abierta por bloque
   ========================================================================== */
(function () {
  "use strict";

  function initFaq() {
    var lists = document.querySelectorAll(".faq__list");
    lists.forEach(function (list) {
      list.addEventListener("toggle", function (event) {
        var opened = event.target;
        if (!opened.open) return;
        list.querySelectorAll(".faq__item[open]").forEach(function (item) {
          if (item !== opened) item.open = false;
        });
      }, true);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initFaq();
  });
})();
