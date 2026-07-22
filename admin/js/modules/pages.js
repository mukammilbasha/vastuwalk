/* ==========================================================================
   VasthuWalk Admin — Pages module
   Registers: #/pages (list), #/pages/new, #/pages/edit/<id>
              #/terms  (Terms and Condition editor)
              #/privacy (Privacy Policy editor)
   ========================================================================== */
window.VW_MODULES = window.VW_MODULES || [];
window.VW_MODULES.push(function (ui, D) {
  'use strict';

  ui.injectCSS('vw-pages-css',
    '.pg-form .form-grid{align-items:start;}' +
    '.head-actions a.btn{text-decoration:none;}' +
    '.doc-panel .panel-body{padding-bottom:.4rem;}' +
    '.doc-panel .fld{gap:.55rem;}' +
    '.doc-panel .rte{width:100%;}' +
    '.pg-cell{color:var(--tx-2);}'
  );

  /* ---------------- seed content (already live in the app) ---------------- */
  var SEED = {
    'term-condition':
      '<ul><li>Vasthu Walk App மூலம் வாஸ்து நாள், வாஸ்து பார்வை, கிரக பிரவேச நாள் மற்றும் வாஸ்து பொருட்கள் பற்றிய பயனுள்ள தகவல்கள் பெறலாம்.</li>' +
      '<li>அனைத்து சேவைகளும் உங்கள் வாழ்க்கையை மேம்படுத்த உதவும் வழிகாட்டுதலாக வழங்கப்படுகின்றன.</li>' +
      '<li>உங்கள் விவரங்கள் பாதுகாப்பாக கையாளப்படும்.</li>' +
      '<li>Premium சேவைகள் விரைவான மற்றும் தனிப்பட்ட வாஸ்து ஆலோசனைகளை வழங்கும்.</li>' +
      '<li>கிரக பிரவேசம் மற்றும் வாஸ்து நாட்கள் பாரம்பரிய அறிவின் அடிப்படையில் தேர்வு செய்யப்படுகின்றன.</li>' +
      '<li>வாஸ்து பொருட்கள் உங்கள் இடத்தின் நல்ல ஆற்றலை அதிகரிக்க உதவுகின்றன.</li>' +
      '<li>அப்பில் உள்ள உள்ளடக்கம் பாதுகாக்கப்பட்டதாகும்.</li>' +
      '<li>சேவைகளை மேலும் மேம்படுத்த, விதிமுறைகள் அவ்வப்போது புதுப்பிக்கப்படலாம்.</li></ul>',

    'privacy-policy':
      '<ul><li>எங்கள் பயன்பாட்டைப் பயன்படுத்தும் போது, உங்கள் அனுபவத்தை மேம்படுத்துவதற்காக சில தனிப்பட்ட தகவல்கள் சேகரிக்கப்படலாம்.</li></ul>' +
      '<p><strong>சேகரிக்கப்படும் தகவல்கள்:</strong></p>' +
      '<ul><li>உங்கள் பெயர்</li>' +
      '<li>தொடர்பு விவரங்கள் (மொபைல் எண், மின்னஞ்சல்)</li>' +
      '<li>இடம் (Location)</li>' +
      '<li>வாஸ்து தொடர்பான விவரங்கள்</li></ul>' +
      '<p><strong>தகவல்களின் பயன்பாடு:</strong></p>' +
      '<ul><li>வாஸ்து ஆலோசனை மற்றும் சேவைகள் வழங்குதல்</li>' +
      '<li>கிரகப் பிரவேச நாள் பரிந்துரை</li>' +
      '<li>வாடிக்கையாளர் ஆதரவு (Customer Support)</li>' +
      '<li>சேவைகளை மேம்படுத்துதல்</li></ul>' +
      '<p><strong>தகவல் பாதுகாப்பு:</strong> உங்கள் தகவல்கள் பாதுகாப்பாக சேமிக்கப்படுகின்றன.</p>'
  };

  /* find (or create) the D.pages record for a slug and make sure it has a body */
  function docRecord(slug, title) {
    var rec = null;
    for (var i = 0; i < D.pages.length; i++) {
      if (String(D.pages[i].slug).toLowerCase() === slug) { rec = D.pages[i]; break; }
    }
    if (!rec) {
      rec = {
        id: D.pages.reduce(function (m, r) { return Math.max(m, Number(r.id) || 0); }, 0) + 1,
        title: title, slug: slug, updated: ui.today(), status: 'Published'
      };
      D.pages.push(rec);
    }
    if (!rec.body) rec.body = SEED[slug] || '';
    return rec;
  }

  /* seed both legal documents up-front so the list preview is populated */
  docRecord('term-condition', 'Terms and Condition');
  docRecord('privacy-policy', 'Privacy Policy');

  /* ==========================================================================
     Single-document editor (Terms and Condition / Privacy Policy)
     ========================================================================== */
  function docPage(cfg) {
    var rec = docRecord(cfg.slug, cfg.title);
    var f = document.createDocumentFragment();

    f.appendChild(ui.el(ui.head(cfg.title, cfg.sub)));

    f.appendChild(ui.el(
      '<div class="panel doc-panel">' +
        '<div class="panel-head"><h3>' + ui.esc(cfg.title) + '</h3>' +
          '<small>Last updated ' + ui.esc(rec.updated || '—') + '</small></div>' +
        '<div class="panel-body">' +
          '<div class="fld"><label>' + ui.esc(cfg.title) + '</label>' +
            ui.rteHTML(rec.body) + '</div>' +
        '</div>' +
        '<div class="form-foot"><button class="btn btn-gold" id="docSave">Save</button></div>' +
      '</div>'));

    setTimeout(function () {
      ui.initRTE();
      var save = document.getElementById('docSave');
      if (!save) return;
      save.addEventListener('click', function () {
        rec.body = ui.rteValue();
        rec.updated = ui.today();
        var st = document.querySelector('.doc-panel .panel-head small');
        if (st) st.textContent = 'Last updated ' + rec.updated;
        ui.toast(cfg.title + ' saved');
      });
    }, 0);

    return f;
  }

  function termsPage() {
    return docPage({
      slug: 'term-condition',
      title: 'Terms and Condition',
      sub: 'Terms shown to every user inside the VasthuWalk app'
    });
  }

  function privacyPage() {
    return docPage({
      slug: 'privacy-policy',
      title: 'Privacy Policy',
      sub: 'How user data is collected, used and protected'
    });
  }

  /* ==========================================================================
     Pages list
     ========================================================================== */
  function preview(html) {
    var t = ui.stripHTML(html || '');
    if (!t) return '<span class="pg-cell">—</span>';
    var short = t.length > 60 ? t.slice(0, 60) + '…' : t;
    return '<span class="pg-cell" title="' + ui.esc(t) + '">' + ui.esc(short) + '</span>';
  }

  function pagesPage() {
    var f = document.createDocumentFragment();
    f.appendChild(ui.el(ui.head('Pages', 'Static content served to the app and website',
      '<a class="btn btn-line" href="#/terms">Terms and Condition</a>' +
      '<a class="btn btn-line" href="#/privacy">Privacy Policy</a>')));

    f.appendChild(ui.dataTable({
      name: 'Pages',
      singular: 'Page',
      addLabel: 'Add Page',
      rows: D.pages,
      createRoute: '#/pages/new',
      editRoute: '#/pages/edit/',
      searchKeys: ['title', 'slug'],
      titleKey: 'title',
      cols: [
        ui.C.id,
        ui.C.strong('title', 'Title'),
        { key: 'slug', label: 'Slug', render: function (r) {
            return '<span class="mono">/' + ui.esc(r.slug) + '</span>';
          } },
        { key: 'body', label: 'Content', render: function (r) { return preview(r.body); } },
        ui.C.stat('status'),
        ui.C.mono('updated', 'Updated')
      ]
    }));
    return f;
  }

  /* ==========================================================================
     Add / Edit Page
     ========================================================================== */
  function slugify(s) {
    return String(s || '').toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function pageForm(rec) {
    var isEdit = !!rec;
    var f = document.createDocumentFragment();

    f.appendChild(ui.el(ui.head(isEdit ? 'Edit Page' : 'Add Page',
      isEdit ? 'Update this static page' : 'Create a new static page')));

    f.appendChild(ui.el(
      '<div class="panel form-page pg-form">' +
        '<div class="panel-head"><h3>' + (isEdit ? 'Edit' : 'Add') + ' Page</h3>' +
          '<button class="btn btn-line" id="pgBack">Back</button></div>' +
        '<div class="form-grid three">' +
          '<div class="fld"><label for="pg_title">Title <i>*</i></label>' +
            '<input id="pg_title" type="text" placeholder="Title" value="' +
            ui.esc((rec && rec.title) || '') + '"><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="pg_slug">Slug <i>*</i></label>' +
            '<input id="pg_slug" type="text" placeholder="privacy-policy" value="' +
            ui.esc((rec && rec.slug) || '') + '"><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="pg_status">Status</label><select id="pg_status">' +
            ['Published', 'Draft'].map(function (o) {
              var sel = rec ? rec.status === o : o === 'Published';
              return '<option' + (sel ? ' selected' : '') + '>' + o + '</option>';
            }).join('') + '</select><span class="fld-err"></span></div>' +
          '<div class="fld span3"><label>Content</label>' +
            ui.rteHTML(rec && rec.body) + '</div>' +
        '</div>' +
        '<div class="form-foot"><button class="btn btn-line" id="pgCancel">Cancel</button>' +
        '<button class="btn btn-gold" id="pgSave">Save</button></div>' +
      '</div>'));

    setTimeout(function () {
      ui.initRTE();

      var titleEl = document.getElementById('pg_title');
      var slugEl = document.getElementById('pg_slug');
      if (!titleEl || !slugEl) return;

      /* auto-suggest the slug from the title until the user edits the slug */
      var slugTouched = isEdit && !!(rec && rec.slug);
      slugEl.addEventListener('input', function () { slugTouched = true; });
      titleEl.addEventListener('input', function () {
        if (!slugTouched) slugEl.value = slugify(titleEl.value);
      });

      function mark(node, msg) {
        var box = node.closest('.fld');
        var e = box ? box.querySelector('.fld-err') : null;
        if (e) e.textContent = msg || '';
        node.classList.toggle('bad', !!msg);
        return !msg;
      }

      titleEl.addEventListener('input', function () {
        if (titleEl.value.trim()) mark(titleEl, '');
      });
      slugEl.addEventListener('input', function () {
        if (slugEl.value.trim()) mark(slugEl, '');
      });

      function back() { ui.go('#/pages'); }
      var b = document.getElementById('pgBack');
      var c = document.getElementById('pgCancel');
      if (b) b.addEventListener('click', back);
      if (c) c.addEventListener('click', back);

      var save = document.getElementById('pgSave');
      if (!save) return;
      save.addEventListener('click', function () {
        var ok = true;
        var title = titleEl.value.trim();
        var slug = slugEl.value.trim();

        var slugMsg = '';
        if (!slug) slugMsg = 'Slug is required.';
        else if (!/^[a-z0-9-]+$/.test(slug)) slugMsg = 'Use lowercase letters, numbers and hyphens only.';
        else {
          var clash = D.pages.filter(function (p) {
            return p !== rec && String(p.slug).toLowerCase() === slug.toLowerCase();
          }).length;
          if (clash) slugMsg = 'That slug is already in use.';
        }

        if (!mark(titleEl, title ? '' : 'Title is required.')) ok = false;
        if (!mark(slugEl, slugMsg)) ok = false;
        if (!ok) { ui.toast('Please fix the highlighted fields'); return; }

        var vals = {
          title: title,
          slug: slug,
          status: document.getElementById('pg_status').value,
          body: ui.rteValue(),
          updated: ui.today()
        };

        if (isEdit) {
          Object.assign(rec, vals);
          ui.toast('Page updated');
        } else {
          vals.id = D.pages.reduce(function (m, r) { return Math.max(m, Number(r.id) || 0); }, 0) + 1;
          D.pages.unshift(vals);
          ui.toast('Page created');
        }
        ui.go('#/pages');
      });
    }, 0);

    return f;
  }

  return {
    pages: {
      pages: pagesPage,
      terms: termsPage,
      privacy: privacyPage
    },
    titles: { terms: 'Terms and Condition', privacy: 'Privacy Policy' },
    groups: { terms: 'System', privacy: 'System' },
    routes: [{
      pre: 'pages',
      store: 'pages',
      nav: 'pages',
      group: 'System',
      add: 'Add Page',
      ed: 'Edit Page',
      build: function (rec) { return pageForm(rec); }
    }]
  };
});
