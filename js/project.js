/* ===========================================================
   Project page JS — TOC, scroll spy, copy code, back link
   =========================================================== */
(function () {
  "use strict";

  var root = document.documentElement;
  document.body.classList.remove("no-js");

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Theme toggle ---------- */
  var toggle = document.getElementById("themeToggle");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
try { localStorage.setItem("theme", theme); } catch (e) {}  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      setTheme(current === "dark" ? "light" : "dark");
    });
  }

  /* ---------- Mobile nav ---------- */
  var burger = document.getElementById("navBurger");
  var rail = document.getElementById("navRail");
  var overlay = document.getElementById("navOverlay");
  var closeBtn = document.getElementById("navClose");

  function openNav() {
    rail.classList.add("open");
    overlay.classList.add("show");
    burger.classList.add("hidden");
    burger.setAttribute("aria-expanded", "true");
  }

  function closeNav() {
    rail.classList.remove("open");
    overlay.classList.remove("show");
    burger.classList.remove("hidden");
    burger.setAttribute("aria-expanded", "false");
  }

  if (burger) burger.addEventListener("click", openNav);
  if (closeBtn) closeBtn.addEventListener("click", closeNav);
  if (overlay) overlay.addEventListener("click", closeNav);
  if (rail) {
    rail.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------- Build TOC from headings ---------- */
  var article = document.querySelector(".doc-article");
  var tocList = document.getElementById("tocList");
  var tocMobileList = document.getElementById("tocMobileList");

  if (article && tocList) {
    var headings = article.querySelectorAll("h2[id]");
    headings.forEach(function (h) {
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      tocList.appendChild(li);
      if (tocMobileList) {
        var li2 = li.cloneNode(true);
        tocMobileList.appendChild(li2);
      }
    });
  }

  /* ---------- Scroll spy ---------- */
  var tocLinks = tocList ? tocList.querySelectorAll("a") : [];
  var tocMobileLinks = tocMobileList ? tocMobileList.querySelectorAll("a") : [];
  var allTocLinks = Array.prototype.slice.call(tocLinks).concat(Array.prototype.slice.call(tocMobileLinks));

  var headingEls = article ? Array.prototype.slice.call(article.querySelectorAll("h2[id]")) : [];

  if ("IntersectionObserver" in window && headingEls.length) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var id = entry.target.id;
            allTocLinks.forEach(function (link) {
              if (link.getAttribute("href") === "#" + id) {
                link.classList.add("active");
              } else {
                link.classList.remove("active");
              }
            });
          }
        });
      },
      { rootMargin: "-20% 0px -70% 0px" }
    );
    headingEls.forEach(function (h) {
      spy.observe(h);
    });
  }

  /* ---------- Mobile TOC toggle ---------- */
  var tocToggle = document.getElementById("tocToggle");
  var tocMobile = document.getElementById("tocMobile");

  if (tocToggle && tocMobile) {
    tocToggle.addEventListener("click", function () {
      tocToggle.classList.toggle("open");
      tocMobile.classList.toggle("open");
      var isOpen = tocMobile.classList.contains("open");
      tocToggle.setAttribute("aria-expanded", isOpen);
    });
  }

  /* ---------- Copy code buttons ---------- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var codeEl = btn.closest(".code-block").querySelector("code");
      if (!codeEl) return;
      var text = codeEl.textContent;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () {
          showCopied(btn);
        }).catch(function () {
          fallbackCopy(text, btn);
        });
      } else {
        fallbackCopy(text, btn);
      }
    });
  });

  function showCopied(btn) {
    var original = btn.innerHTML;
    btn.classList.add("copied");
    btn.innerHTML = "Copied";
    setTimeout(function () {
      btn.classList.remove("copied");
      btn.innerHTML = original;
    }, 2000);
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      showCopied(btn);
    } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ---------- Back link with scroll restore ---------- */
  var backLink = document.getElementById("backLink");
  if (backLink) {
    backLink.addEventListener("click", function (e) {
      // Store a flag so the homepage can restore scroll if it loads fresh
      try {
        sessionStorage.setItem("restoreWork", "1");
      } catch (e) {}
    });
  }

  /* ---------- Copyright year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();