/* VasthuWalk — gallery filtering + lightbox (images & video) */
function VWGalleryInit() {
  'use strict';

  var grid = document.getElementById('galGrid');
  if (!grid) return;

  var items = Array.prototype.slice.call(grid.querySelectorAll('.gal-item'));
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.gal-tab'));

  var lb = document.getElementById('lightbox');
  var stage = document.getElementById('lbStage');
  var cap = document.getElementById('lbCap');
  var btnClose = document.getElementById('lbClose');
  var btnPrev = document.getElementById('lbPrev');
  var btnNext = document.getElementById('lbNext');

  var visible = items.slice();   // currently shown items
  var index = 0;
  var lastFocus = null;

  /* ---------- filtering ---------- */
  function applyFilter(f) {
    visible = [];
    items.forEach(function (el) {
      var show = f === 'all' || el.dataset.type === f;
      el.classList.toggle('hide', !show);
      if (show) visible.push(el);
    });
  }

  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (o) {
        o.classList.toggle('is-on', o === t);
        o.setAttribute('aria-selected', String(o === t));
      });
      applyFilter(t.dataset.filter);
    });
  });

  /* ---------- lightbox ---------- */
  function render() {
    var el = visible[index];
    if (!el) return;
    var src = el.dataset.src, title = el.dataset.title || '';
    stage.innerHTML = '';

    if (el.dataset.type === 'video') {
      var v = document.createElement('video');
      v.src = src;
      v.controls = true;
      v.autoplay = true;
      v.playsInline = true;
      v.setAttribute('playsinline', '');
      stage.appendChild(v);
    } else {
      var img = document.createElement('img');
      img.src = src;
      img.alt = title;
      stage.appendChild(img);
    }
    cap.textContent = title;

    var many = visible.length > 1;
    btnPrev.style.display = many ? '' : 'none';
    btnNext.style.display = many ? '' : 'none';
  }

  function open(el) {
    index = visible.indexOf(el);
    if (index < 0) index = 0;
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    render();
    btnClose.focus();
  }

  function close() {
    var v = stage.querySelector('video');
    if (v) { v.pause(); v.src = ''; }
    stage.innerHTML = '';
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  function step(d) {
    index = (index + d + visible.length) % visible.length;
    render();
  }

  items.forEach(function (el) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.addEventListener('click', function () { open(el); });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(el); }
    });
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { step(-1); });
  btnNext.addEventListener('click', function () { step(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });

  if (!window.__vwLbKeys) {
    window.__vwLbKeys = true;
    document.addEventListener('keydown', function (e) {
      var box = document.getElementById('lightbox');
      if (!box || box.hidden) return;
      if (e.key === 'Escape') document.getElementById('lbClose').click();
      else if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
      else if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
    });
  }
}

VWGalleryInit();
document.addEventListener('vw:content', VWGalleryInit);
