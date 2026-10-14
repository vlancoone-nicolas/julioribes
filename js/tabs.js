/* ==========================================================================
   Julio Ribes — tabs.js
   Pestañas de libros (Español / English)
   ========================================================================== */
(function () {
  "use strict";

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

  document.addEventListener("DOMContentLoaded", function () {
    initTabs();
  });
})();
