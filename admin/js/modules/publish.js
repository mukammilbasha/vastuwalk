/* ==========================================================================
   VasthuWalk Admin — Publisher
   Mirrors the content the public website consumes into localStorage, so edits
   made here show up on the site (same origin) without a backend.

   In production this is replaced by your API: each save POSTs to Laravel and
   the site reads the same resources over HTTP. See website/api/README.md.
   ========================================================================== */
window.VW_MODULES = window.VW_MODULES || [];
window.VW_MODULES.push(function (ui, D) {
  'use strict';

  var KEY = 'vw-content-';

  /* map the admin dataset -> the exact shape website/js/content.js expects */
  function shape() {
    return {
      'packages': D.packages.map(function (p) {
        return { id: p.id, name: p.name, price: p.price, duration: p.duration,
                 unit: p.unit, status: p.status };
      }),
      'offer-videos': D.videos.map(function (v) {
        return { id: v.id, title: v.title, length: v.length, status: v.status,
                 src: String(v.src || '').replace(/^\.\.\//, ''),
                 poster: String(v.poster || '').replace(/^\.\.\//, '') };
      }),
      'products': D.products.map(function (p, i) {
        var SHOTS = ['assets/gallery/shots/product-1.jpg',
                     'assets/gallery/shots/product-2.jpg',
                     'assets/gallery/shots/product-3.jpg'];
        return { id: p.id, title: p.title, price: p.price, category: p.category,
                 status: p.status, image: p.image || SHOTS[i % SHOTS.length] };
      }),
      'banners': D.banners.map(function (b) {
        return { id: b.id, title: b.title, url: b.url, status: b.status, image: b.image || '' };
      }),
      'pages': D.pages.map(function (p) {
        return { id: p.id, title: p.title, slug: p.slug, status: p.status,
                 updated: p.updated, body: p.body || '' };
      }),
      'settings': {
        contact_email: 'vasthuwalk@gmail.com',
        contact_number: '7788849994',
        copyright: '© 2026 VasthuWalk. All rights reserved.',
        play_store: 'https://play.google.com/store/apps/details?id=com.vasthuwalk.app',
        social: {
          facebook: 'https://www.facebook.com/', instagram: 'https://www.instagram.com/',
          x: 'https://www.x.com/', youtube: 'https://www.youtube.com/',
          linkedin: 'https://www.linkedin.com/'
        }
      }
    };
  }

  var last = '';
  function publish(quiet) {
    var payload = shape();
    var stamp = JSON.stringify(payload);
    if (stamp === last) return false;
    last = stamp;
    try {
      Object.keys(payload).forEach(function (k) {
        localStorage.setItem(KEY + k, JSON.stringify(payload[k]));
      });
      localStorage.setItem(KEY + 'updated', new Date().toISOString());
      if (!quiet) ui.toast('Published to website');
      dot(true);
      return true;
    } catch (e) {
      if (!quiet) ui.toast('Could not publish (storage full?)');
      return false;
    }
  }

  /* auto-publish shortly after any interaction that could have mutated data */
  var timer = null;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(function () { publish(true); }, 900);
  }
  document.addEventListener('click', schedule, true);
  document.addEventListener('change', schedule, true);
  window.addEventListener('beforeunload', function () { publish(true); });

  /* topbar indicator + manual control */
  ui.injectCSS('vw-publish-css',
    '.pub-wrap{position:relative}' +
    '.pub-btn{display:flex;align-items:center;gap:.45rem;background:transparent;border:1px solid var(--line);' +
      'color:var(--tx-2);height:38px;padding:0 .8rem;border-radius:11px;cursor:pointer;font-size:.84rem;' +
      'font-weight:600;transition:.22s var(--t)}' +
    '.pub-btn:hover{background:var(--hover);color:var(--gold-lt);border-color:var(--line-2)}' +
    '.pub-dot{width:8px;height:8px;border-radius:50%;background:var(--ok);flex:none}' +
    '.pub-dot.stale{background:var(--warn)}' +
    '@media(max-width:1200px){.pub-btn span{display:none}.pub-btn{padding:0 .7rem;width:38px;justify-content:center}}');

  function dot(fresh) {
    var d = document.querySelector('.pub-dot');
    if (d) d.classList.toggle('stale', !fresh);
  }

  function mountButton() {
    if (document.getElementById('pubBtn')) return;
    var actions = document.querySelector('.top-actions');
    if (!actions) return;
    var wrap = ui.el(
      '<div class="pub-wrap"><button class="pub-btn" id="pubBtn" title="Publish content to the public website">' +
      '<span class="pub-dot"></span><span>Publish</span></button></div>');
    actions.insertBefore(wrap, actions.firstChild);
    wrap.querySelector('#pubBtn').addEventListener('click', function () {
      if (!publish(false)) ui.toast('Website is already up to date');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { mountButton(); publish(true); });
  } else {
    mountButton();
    publish(true);
  }

  return {};   // no pages/routes — this module only publishes
});
