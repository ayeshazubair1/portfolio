/* ===========================================================
   Main JS — loader, theme, nav, scroll reveals, headline
   =========================================================== */
(function () {
  "use strict";

  var root = document.documentElement;

  // Enable JS enhancements
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

/* ---------- Headline typing ---------- */
var headline = document.getElementById("headline");
var letters = [];

function prepareHeadline() {
  if (!headline || prefersReducedMotion) return;

  // Full text for screen readers
  var label = document.createElement("span");
  label.className = "sr-only";
  label.textContent = headline.textContent.replace(/\s+/g, " ").trim();

  // Split each word into letters (hidden until typed)
  headline.querySelectorAll(".word").forEach(function (word) {
    var text = word.textContent;
    word.textContent = "";
    word.setAttribute("aria-hidden", "true");
    text.split("").forEach(function (ch) {
      var span = document.createElement("span");
      span.className = "ch";
      span.textContent = ch;
      word.appendChild(span);
      letters.push(span);
    });
  });
  headline.appendChild(label);
}

function startHeadline() {
  if (!headline || !letters.length) return;
  var i = 0;
  var prev = null;

  function typeNext() {
    if (prev) prev.classList.remove("cur");
    var el = letters[i];
    el.classList.add("on", "cur");
    prev = el;
    i++;

    if (i < letters.length) {
      var newWord = letters[i].parentNode !== el.parentNode;
      setTimeout(typeNext, newWord ? 220 : 70);   // pause between words / between letters
    } else {
      setTimeout(function () { el.classList.remove("cur"); }, 2500);  // cursor leaves after 2.5s
    }
  }

  setTimeout(typeNext, 350);   // start just as the loader fades
}

prepareHeadline();

/* ---------- Loader ---------- */
var loader = document.getElementById("loader");
if (loader && !prefersReducedMotion) {
  requestAnimationFrame(function () {
    setTimeout(function () {
      loader.classList.add("done");
      startHeadline();
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 600);
    }, 750);
  });
} else if (loader) {
  loader.classList.add("done");
  startHeadline();
  setTimeout(function () {
    if (loader.parentNode) loader.parentNode.removeChild(loader);
  }, 100);
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

  if (burger) {
    burger.addEventListener("click", openNav);
  }
  if (closeBtn) {
    closeBtn.addEventListener("click", closeNav);
  }
  if (overlay) {
    overlay.addEventListener("click", closeNav);
  }

  // Close nav when a link is clicked
  if (rail) {
    rail.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
  }

  /* ---------- Active nav highlighting ---------- */
  var navLinks = document.querySelectorAll(".nav-list a");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href").substring(1);
    var el = document.getElementById(id);
    if (el) sections.push(el);
  });

  if ("IntersectionObserver" in window && sections.length) {
    var navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            navLinks.forEach(function (link) {
              link.classList.remove("active");
              if (link.getAttribute("href") === "#" + entry.target.id) {
                link.classList.add("active");
              }
            });
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(function (sec) {
      navObserver.observe(sec);
    });
  }

  /* ---------- Scroll reveals ---------- */
  var revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* ---------- Stagger setup ---------- */
  document.querySelectorAll("[data-stagger]").forEach(function (el) {
    el.style.setProperty("--stagger", el.getAttribute("data-stagger"));
  });

  /* ---------- Copyright year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();