/* VasthuWalk — site interactions */
(function () {
  'use strict';

  /* ---- sticky header state ---- */
  var hdr = document.getElementById('hdr');
  var onScroll = function () {
    if (window.scrollY > 40) hdr.classList.add('scrolled');
    else hdr.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- mobile menu ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  var toggle = function (force) {
    var open = force !== undefined ? force : !nav.classList.contains('open');
    nav.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', function () { toggle(); });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') toggle(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') toggle(false);
  });

  /* ---- scroll reveal ---- */
  function observeReveals() {
  var items = document.querySelectorAll('.reveal:not(.in)');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en, i) {
        if (en.isIntersecting) {
          var el = en.target;
          // stagger siblings for a smoother cascade
          var delay = Math.min(i * 90, 360);
          setTimeout(function () { el.classList.add('in'); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }
  }
  observeReveals();
  document.addEventListener('vw:content', function () { setTimeout(observeReveals, 30); });

  /* ---- FAQ: keep one answer open at a time ---- */
  var faqs = document.querySelectorAll('.faq');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (!d.open) return;
      faqs.forEach(function (other) { if (other !== d) other.open = false; });
    });
  });
})();
