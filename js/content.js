/* ==========================================================================
   VasthuWalk — content layer
   Hydrates the public site from managed content instead of hardcoded HTML.

   Resolution order for each resource:
     1. LOCAL BRIDGE   localStorage['vw-content-<key>']  (admin portal edits)
     2. API            <API_BASE>/<key>.json
     3. FALLBACK       whatever is already in the HTML (never blanks the page)

   Point API_BASE at your Laravel API and set BRIDGE=false for production.
   ========================================================================== */
window.VWContent = (function () {
  'use strict';

  var CFG = {
    API_BASE: 'api',   // e.g. 'https://www.vasthuwalk.com/api'
    BRIDGE: true       // read admin-portal edits from localStorage (demo only)
  };

  var KEYS = ['packages', 'offer-videos', 'products', 'banners', 'pages', 'settings'];

  function fromBridge(key) {
    if (!CFG.BRIDGE) return null;
    try {
      var raw = localStorage.getItem('vw-content-' + key);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function fromAPI(key) {
    return fetch(CFG.API_BASE + '/' + key + '.json', { cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) { return j && j.data ? j.data : null; })
      .catch(function () { return null; });
  }

  function get(key) {
    var local = fromBridge(key);
    if (local) return Promise.resolve({ data: local, source: 'admin' });
    return fromAPI(key).then(function (d) {
      return d ? { data: d, source: 'api' } : { data: null, source: 'static' };
    });
  }

  function loadAll() {
    return Promise.all(KEYS.map(function (k) {
      return get(k).then(function (r) { return [k, r]; });
    })).then(function (pairs) {
      var out = {};
      pairs.forEach(function (p) { out[p[0]] = p[1]; });
      return out;
    });
  }

  /* ---------------- helpers ---------------- */
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
  function live(list) { return (list || []).filter(function (x) { return x.status !== 'Inactive'; }); }
  function $(sel, root) { return (root || document).querySelector(sel); }

  /* ---------------- renderers ---------------- */

  // Pricing cards  <- packages
  function renderPricing(pkgs) {
    var grid = $('.price-grid');
    if (!grid || !pkgs || !pkgs.length) return 0;
    var order = live(pkgs).slice().sort(function (a, b) { return a.price - b.price; });
    if (!order.length) return 0;

    var store = (window.__VW_STORE__ || '#');
    grid.innerHTML = order.map(function (p, i) {
      var featured = i === order.length - 1;
      var per = p.unit === 'Monthly' ? '/ monthly' : (p.unit === 'Hrs' ? '/ access' : '/ ' + esc(String(p.unit || '')).toLowerCase());
      var blurb = featured ? 'For builders, architects &amp; consultants' : 'For individuals &amp; homeowners';
      var feats = featured
        ? ['Valid for a ' + p.duration + '-month period', 'Everything in Personal',
           'Extended professional access', 'Priority marketplace offers', 'Renewal &amp; plan history']
        : ['Full ' + p.duration + '-hour premium access', 'Precise degree calculations',
           'Core direction guidance', 'Manayadi Sasthiram', 'Grahapravesam dates'];
      return '<div class="price' + (featured ? ' feat-price' : '') + ' reveal">' +
        (featured ? '<span class="price-badge">Most Popular</span>' : '') +
        '<div class="price-top"><h3>' + esc(p.name) + '</h3>' +
        '<p class="price-for">' + blurb + '</p></div>' +
        '<div class="price-amt">' + inr(p.price) + '<span>' + per + '</span></div>' +
        '<ul class="price-list">' + feats.map(function (f) { return '<li>✓ ' + f + '</li>'; }).join('') + '</ul>' +
        '<a href="' + store + '" target="_blank" rel="noopener" class="btn ' +
        (featured ? 'btn-gold' : 'btn-outline') + ' w-full">Get ' +
        esc(p.name.replace(/\s*Plan$/i, '')) + '</a></div>';
    }).join('');
    return order.length;
  }

  // Gallery tiles <- offer videos + products + banners
  function renderGallery(videos, products, banners) {
    var grid = document.getElementById('galGrid');
    if (!grid) return 0;
    var tiles = [];

    // keep tiles the admin does not manage (e.g. app screens baked into the page)
    var keep = Array.prototype.slice
      .call(grid.querySelectorAll('.gal-item'))
      .filter(function (t) { return t.dataset.type === 'screen'; })
      .map(function (t) { return t.outerHTML; });

    live(videos).forEach(function (v) {
      if (!v.src) return;
      tiles.push('<figure class="gal-item is-video reveal" data-type="video" data-src="' +
        esc(v.src) + '" data-title="' + esc(v.title) + '">' +
        '<img src="' + esc(v.poster || '') + '" alt="' + esc(v.title) + '" loading="lazy">' +
        '<span class="play" aria-hidden="true"></span>' +
        '<figcaption>' + esc(v.title) + '<small>' + esc(v.length || '') + '</small></figcaption></figure>');
    });

    live(banners).forEach(function (b) {
      if (!b.image) return;   // banners without artwork have nothing to show
      tiles.push('<figure class="gal-item reveal" data-type="banner" data-src="' +
        esc(b.image) + '" data-title="' + esc(b.title) + '">' +
        '<img src="' + esc(b.image) + '" alt="' + esc(b.title) + '" loading="lazy">' +
        '<figcaption>' + esc(b.title) + '</figcaption></figure>');
    });

    live(products).forEach(function (p) {
      if (!p.image) return;
      tiles.push('<figure class="gal-item reveal" data-type="product" data-src="' +
        esc(p.image) + '" data-title="' + esc(p.title) + '">' +
        '<img src="' + esc(p.image) + '" alt="' + esc(p.title) + '" loading="lazy">' +
        '<figcaption>' + esc(p.title) + '<small>' + inr(p.price) + '</small></figcaption></figure>');
    });

    if (!tiles.length && !keep.length) return 0;
    grid.innerHTML = tiles.concat(keep).join('');

    // keep only the filter tabs that still have tiles
    var present = {};
    grid.querySelectorAll('.gal-item').forEach(function (t) { present[t.dataset.type] = true; });
    document.querySelectorAll('.gal-tab').forEach(function (tab) {
      var f = tab.dataset.filter;
      if (f !== 'all' && !present[f]) tab.remove();
    });
    return tiles.length;
  }

  // Legal page body <- pages
  function renderLegalBody(pages) {
    var host = document.querySelector('[data-page-body]');
    if (!host || !pages) return 0;
    var slug = host.getAttribute('data-page-body');
    var rec = pages.filter(function (p) { return p.slug === slug; })[0];
    if (!rec || !rec.body) return 0;
    host.innerHTML = rec.body;
    var stamp = document.querySelector('[data-page-updated]');
    if (stamp && rec.updated) stamp.textContent = rec.updated;
    return 1;
  }

  // Contact + social <- settings
  function renderSettings(s) {
    if (!s) return 0;
    var n = 0;
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      if (!s.contact_email) return;
      a.href = 'mailto:' + s.contact_email;
      if (/@/.test(a.textContent)) a.textContent = s.contact_email;
      n++;
    });
    if (s.contact_number) {
      var pretty = '+91 ' + String(s.contact_number).replace(/(\d{5})(\d{5})/, '$1 $2');
      document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
        a.href = 'tel:+91' + s.contact_number;
        if (/\d/.test(a.textContent)) a.textContent = pretty;
        n++;
      });
    }
    if (s.social && window.VW_SOCIAL_OVERRIDE) window.VW_SOCIAL_OVERRIDE(s.social);
    if (s.play_store) {
      window.__VW_STORE__ = s.play_store;
      document.querySelectorAll('a[href*="play.google.com"]').forEach(function (a) { a.href = s.play_store; n++; });
    }
    return n;
  }

  /* ---------------- boot ---------------- */
  function hydrate() {
    return loadAll().then(function (c) {
      var val = function (k) { return c[k] && c[k].data; };
      window.__VW_STORE__ = (val('settings') || {}).play_store || window.__VW_STORE__;

      var report = {
        settings: renderSettings(val('settings')),
        pricing: renderPricing(val('packages')),
        gallery: renderGallery(val('offer-videos'), val('products'), val('banners')),
        legal: renderLegalBody(val('pages')),
        sources: Object.keys(c).reduce(function (o, k) { o[k] = c[k].source; return o; }, {})
      };

      document.dispatchEvent(new CustomEvent('vw:content', { detail: report }));
      window.__VW_CONTENT__ = report;
      return report;
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hydrate);
  } else {
    hydrate();
  }

  return { cfg: CFG, get: get, loadAll: loadAll, hydrate: hydrate };
})();
