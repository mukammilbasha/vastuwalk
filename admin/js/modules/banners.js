/* ==========================================================================
   VasthuWalk Admin — Banner Slider module
   Registers: #/banners (list), #/banners/new, #/banners/edit/<id>
   ========================================================================== */
window.VW_MODULES = window.VW_MODULES || [];
window.VW_MODULES.push(function (ui, D) {
  'use strict';

  ui.injectCSS('vw-banners-css',
    '.bn-form .form-grid{align-items:start;}' +
    '.bn-thumb{font-size:1rem;}'
  );

  /* accepts "https://vasthuwalk.com/", "vasthuwalk.com", "sub.domain.co.in/path?x=1" */
  var URL_RE = /^(?:(?:https?|ftp):\/\/)?(?:[\w-]+(?::[^\s@]*)?@)?(?:localhost|(?:[\w-]+\.)+[a-z]{2,})(?::\d{2,5})?(?:[/?#][^\s]*)?$/i;

  function isURL(v) { return URL_RE.test(String(v).trim()); }

  /* ---------------- list page ---------------- */
  function bannersPage() {
    var f = document.createDocumentFragment();
    f.appendChild(ui.el(ui.head('Banner Slider', 'Home-screen banners shown inside the app')));
    f.appendChild(ui.dataTable({
      name: 'Banners',
      singular: 'Banner',
      addLabel: 'Add Banner Slider',
      rows: D.banners,
      createRoute: '#/banners/new',
      editRoute: '#/banners/edit/',
      filters: ['Active', 'Inactive'],
      filterKey: 'status',
      searchKeys: ['title', 'url'],
      titleKey: 'title',
      cols: [
        ui.C.id,
        { key: 'title', label: 'Title', render: function (r) {
            return '<div class="cell-user"><span class="mini-thumb bn-thumb">' +
              (r.image ? '<img src="' + ui.esc(r.image) + '" alt="">' : '🖼️') +
              '</span><span class="strong">' + ui.esc(r.title) + '</span></div>';
          } },
        { key: 'url', label: 'Link', render: function (r) {
            return ui.esc(r.url || '—');
          } },
        { key: 'status', label: 'Status', render: function (r) { return ui.toggleHTML(r); } },
        ui.C.mono('created', 'Created')
      ]
    }));
    return f;
  }

  /* ---------------- add / edit form ---------------- */
  function bannerForm(rec) {
    var isEdit = !!rec;
    var f = document.createDocumentFragment();

    f.appendChild(ui.el(ui.head(isEdit ? 'Edit Banner Slider' : 'Add Banner Slider',
      isEdit ? 'Update this home-screen banner' : 'Create a new home-screen banner')));

    f.appendChild(ui.el(
      '<div class="panel form-page bn-form">' +
        '<div class="panel-head"><h3>' + (isEdit ? 'Edit' : 'Add') + ' Banner Slider</h3>' +
          '<button class="btn btn-line" id="bnBack">Back</button></div>' +
        '<div class="form-grid">' +
          '<div class="fld"><label for="bn_title">Title <i>*</i></label>' +
            '<input id="bn_title" type="text" placeholder="Title" value="' +
            ui.esc((rec && rec.title) || '') + '"><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="bn_status">Status <i>*</i></label><select id="bn_status">' +
            ['Active', 'Inactive'].map(function (o) {
              return '<option' + (rec && rec.status === o ? ' selected' : '') + '>' + o + '</option>';
            }).join('') + '</select><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="bn_url">URL</label>' +
            '<input id="bn_url" type="text" placeholder="URL" value="' +
            ui.esc((rec && rec.url) || '') + '"><span class="fld-err"></span></div>' +
          ui.imageHTML('bn_img', 'Image', rec && rec.image) +
        '</div>' +
        '<div class="form-foot"><button class="btn btn-line" id="bnCancel">Cancel</button>' +
        '<button class="btn btn-gold" id="bnSave">Save</button></div>' +
      '</div>'));

    setTimeout(function () {
      var img = (rec && rec.image) || '';
      ui.initImage('bn_img', function (d) { img = d; });

      function back() { ui.go('#/banners'); }
      var b = document.getElementById('bnBack');
      var c = document.getElementById('bnCancel');
      if (b) b.addEventListener('click', back);
      if (c) c.addEventListener('click', back);

      function mark(node, msg) {
        var box = node.closest('.fld');
        var e = box ? box.querySelector('.fld-err') : null;
        if (e) e.textContent = msg || '';
        node.classList.toggle('bad', !!msg);
        return !msg;
      }

      var titleEl = document.getElementById('bn_title');
      var urlEl = document.getElementById('bn_url');
      if (!titleEl || !urlEl) return;

      titleEl.addEventListener('input', function () {
        if (titleEl.value.trim()) mark(titleEl, '');
      });
      urlEl.addEventListener('input', function () {
        if (!urlEl.value.trim() || isURL(urlEl.value)) mark(urlEl, '');
      });

      var save = document.getElementById('bnSave');
      if (!save) return;
      save.addEventListener('click', function () {
        var ok = true;
        var title = titleEl.value.trim();
        var url = urlEl.value.trim();

        if (!mark(titleEl, title ? '' : 'Title is required.')) ok = false;
        if (!mark(urlEl, (!url || isURL(url)) ? '' : 'Enter a valid URL.')) ok = false;
        if (!ok) { ui.toast('Please fix the highlighted fields'); return; }

        var vals = {
          title: title,
          url: url,
          status: document.getElementById('bn_status').value,
          image: img
        };

        if (isEdit) {
          Object.assign(rec, vals);
          ui.toast('Banner updated');
        } else {
          vals.id = D.banners.reduce(function (m, r) { return Math.max(m, Number(r.id) || 0); }, 0) + 1;
          vals.created = ui.today();
          D.banners.unshift(vals);
          ui.toast('Banner created');
        }
        ui.go('#/banners');
      });
    }, 0);

    return f;
  }

  return {
    pages: { banners: bannersPage },
    routes: [{
      pre: 'banners',
      store: 'banners',
      nav: 'banners',
      group: 'Marketing',
      add: 'Add Banner Slider',
      ed: 'Edit Banner Slider',
      build: function (rec) { return bannerForm(rec); }
    }]
  };
});
