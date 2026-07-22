/* ==========================================================================
   VasthuWalk Admin — Packages module
   List page + full-page Add / Edit Package form (with audio drag & drop)
   ========================================================================== */
window.VW_MODULES = window.VW_MODULES || [];
window.VW_MODULES.push(function (ui, D) {
  'use strict';

  var UNITS = ['Hrs', 'Days', 'Monthly', 'Yearly'];
  var DURATIONS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  var STATUSES = ['Active', 'Inactive'];
  var AUDIO_RE = /\.(mp3|wav|m4a|ogg)$/i;

  /* ---------------- module CSS ---------------- */
  ui.injectCSS('vw-pkg-css',
    '.pkg-drop{' +
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.25rem;' +
      'text-align:center;cursor:pointer;padding:.9rem .8rem;min-height:86px;' +
      'border:2px dashed var(--line-2,#c9c2b4);border-radius:12px;background:var(--bg-2,transparent);' +
      'color:var(--tx-3,#8b8578);font-size:.82rem;transition:.2s ease;' +
    '}' +
    '.pkg-drop:hover{border-color:var(--gold,#c9a227);color:var(--tx-2,#5c574c);}' +
    '.pkg-drop.over{border-color:var(--gold,#c9a227);background:rgba(201,162,39,.10);color:var(--tx,#2b2820);}' +
    '.pkg-drop.bad{border-color:var(--bad,#c0492f);}' +
    '.pkg-drop-ico{font-size:1.35rem;line-height:1;}' +
    '.pkg-drop b{color:var(--gold,#a9821f);font-weight:700;}' +
    '.pkg-drop-hint{font-size:.78rem;}' +
    '.pkg-audio{display:flex;flex-direction:column;gap:.4rem;margin-top:.45rem;}' +
    '.pkg-audio-row{display:flex;align-items:center;gap:.5rem;font-size:.8rem;}' +
    '.pkg-audio-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}' +
    '.pkg-audio audio{width:100%;height:34px;}' +
    '.pkg-audio-clear{' +
      'border:1px solid var(--line,#ddd);background:transparent;border-radius:8px;cursor:pointer;' +
      'font-size:.72rem;padding:.15rem .45rem;color:var(--tx-3,#8b8578);flex:none;' +
    '}' +
    '.pkg-desc textarea{min-height:130px;resize:vertical;font-family:inherit;}'
  );

  /* ---------------- helpers ---------------- */
  function opts(list, val) {
    return list.map(function (o) {
      return '<option' + (String(o) === String(val) ? ' selected' : '') + '>' + ui.esc(o) + '</option>';
    }).join('');
  }

  function mark(node, msg, state) {
    var box = node.closest ? node.closest('.fld') : null;
    var e = box ? box.querySelector('.fld-err') : null;
    if (e) e.textContent = msg || '';
    node.classList.toggle('bad', !!msg);
    if (msg) state.ok = false;
  }

  /* ==========================================================================
     List page
     ========================================================================== */
  function packagesPage() {
    var f = document.createDocumentFragment();
    f.appendChild(ui.el(ui.head('Packages', 'Subscription plans offered in the app')));
    f.appendChild(ui.dataTable({
      name: 'Packages', singular: 'Package', addLabel: 'Add Package', rows: D.packages,
      createRoute: '#/packages/new', editRoute: '#/packages/edit/',
      filters: ['Active', 'Inactive'], filterKey: 'status',
      searchKeys: ['name', 'unit'], titleKey: 'name',
      cols: [
        ui.C.id,
        ui.C.strong('name', 'Name'),
        { key: 'duration', label: 'Duration' },
        { key: 'unit', label: 'Unit' },
        { key: 'price', label: 'Price', render: function (r) { return '<span class="mono">' + ui.inr(r.price) + '</span>'; } },
        { key: 'status', label: 'Status', render: function (r) { return ui.toggleHTML(r); } },
        ui.C.mono('created', 'Created')
      ]
    }));
    return f;
  }

  /* ==========================================================================
     Add / Edit Package — full page form
     ========================================================================== */
  function packageForm(rec) {
    var isEdit = !!rec;
    var f = document.createDocumentFragment();

    f.appendChild(ui.el(ui.head(isEdit ? 'Edit Package' : 'Add Package',
      isEdit ? 'Update this subscription plan' : 'Create a new subscription plan')));

    f.appendChild(ui.el(
      '<div class="panel form-page">' +
        '<div class="panel-head"><h3>' + (isEdit ? 'Edit Package' : 'Add Package') + '</h3>' +
          '<button class="btn btn-line" id="pkBack">Back</button></div>' +
        '<div class="form-grid three">' +

          '<div class="fld"><label for="pk_name">Name <i>*</i></label>' +
            '<input id="pk_name" type="text" placeholder="Name" value="' + ui.esc((rec && rec.name) || '') + '">' +
            '<span class="fld-err"></span></div>' +

          '<div class="fld"><label for="pk_unit">Duration Unit</label>' +
            '<select id="pk_unit">' + opts(UNITS, (rec && rec.unit) || 'Monthly') + '</select>' +
            '<span class="fld-err"></span></div>' +

          '<div class="fld"><label for="pk_dur">Duration <i>*</i></label>' +
            '<select id="pk_dur"><option value="">Select Duration</option>' +
            opts(DURATIONS, rec && rec.duration) + '</select>' +
            '<span class="fld-err"></span></div>' +

          '<div class="fld"><label for="pk_price">Price (₹) <i>*</i></label>' +
            '<input id="pk_price" type="number" min="0" step="1" placeholder="Price" value="' +
            ui.esc(rec && rec.price != null ? rec.price : '') + '">' +
            '<span class="fld-err"></span></div>' +

          '<div class="fld"><label for="pk_audio">Upload Audio</label>' +
            '<div class="pkg-drop" id="pk_drop" tabindex="0" role="button" ' +
              'aria-label="Drag and drop audio here, or click to upload">' +
              '<span class="pkg-drop-ico">🎵</span>' +
              '<span>Drag &amp; Drop audio here</span>' +
              '<span class="pkg-drop-hint">or <b>Click to upload</b></span>' +
            '</div>' +
            '<input type="file" id="pk_audio" accept=".mp3,.wav,.m4a,.ogg,audio/*" hidden>' +
            '<div class="pkg-audio" id="pk_audio_prev" hidden></div>' +
            '<span class="fld-err"></span></div>' +

          '<div class="fld"><label for="pk_status">Status <i>*</i></label>' +
            '<select id="pk_status">' + opts(STATUSES, (rec && rec.status) || 'Active') + '</select>' +
            '<span class="fld-err"></span></div>' +

          '<div class="fld span3 pkg-desc"><label for="pk_desc">Description</label>' +
            '<textarea id="pk_desc" placeholder="Description">' +
            ui.esc((rec && rec.description) || '') + '</textarea>' +
            '<span class="fld-err"></span></div>' +

        '</div>' +
        '<div class="form-foot"><button class="btn btn-line" id="pkCancel">Cancel</button>' +
        '<button class="btn btn-gold" id="pkSave">Save</button></div>' +
      '</div>'));

    setTimeout(function () {
      var audio = (rec && rec.audio) || '';
      var audioName = (rec && rec.audioName) || (audio ? 'Selected audio' : '');

      var drop = document.getElementById('pk_drop');
      var file = document.getElementById('pk_audio');
      var prev = document.getElementById('pk_audio_prev');
      if (!drop) return;

      function paint() {
        if (!audio) { prev.hidden = true; prev.innerHTML = ''; return; }
        prev.hidden = false;
        prev.innerHTML =
          '<div class="pkg-audio-row">' +
            '<span class="pkg-audio-name" title="' + ui.esc(audioName) + '">🎧 ' + ui.esc(audioName) + '</span>' +
            '<button type="button" class="pkg-audio-clear" id="pkAudioClear">Remove</button>' +
          '</div>' +
          '<audio controls preload="metadata" src="' + audio + '"></audio>';
        var clr = document.getElementById('pkAudioClear');
        if (clr) clr.addEventListener('click', function (e) {
          e.stopPropagation();
          audio = ''; audioName = ''; file.value = '';
          paint();
          ui.toast('Audio removed');
        });
      }

      function take(fl) {
        if (!fl) return;
        if (!AUDIO_RE.test(fl.name)) {
          drop.classList.add('bad');
          ui.toast('Only .mp3 .wav .m4a .ogg allowed');
          setTimeout(function () { drop.classList.remove('bad'); }, 1600);
          file.value = '';
          return;
        }
        var fr = new FileReader();
        fr.onload = function () {
          audio = fr.result;
          audioName = fl.name;
          paint();
          ui.toast('Audio "' + fl.name + '" attached');
        };
        fr.readAsDataURL(fl);
      }

      drop.addEventListener('click', function () { file.click(); });
      drop.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); }
      });
      file.addEventListener('change', function () { take(file.files && file.files[0]); });

      ['dragenter', 'dragover'].forEach(function (evt) {
        drop.addEventListener(evt, function (e) {
          e.preventDefault(); e.stopPropagation();
          drop.classList.add('over');
        });
      });
      ['dragleave', 'dragend'].forEach(function (evt) {
        drop.addEventListener(evt, function (e) {
          e.preventDefault(); e.stopPropagation();
          drop.classList.remove('over');
        });
      });
      drop.addEventListener('drop', function (e) {
        e.preventDefault(); e.stopPropagation();
        drop.classList.remove('over');
        var dt = e.dataTransfer;
        take(dt && dt.files && dt.files[0]);
      });

      paint();

      function back() { ui.go('#/packages'); }
      document.getElementById('pkBack').addEventListener('click', back);
      document.getElementById('pkCancel').addEventListener('click', back);

      document.getElementById('pkSave').addEventListener('click', function () {
        var state = { ok: true };
        var n = document.getElementById('pk_name');
        var p = document.getElementById('pk_price');
        var du = document.getElementById('pk_dur');

        var priceRaw = p.value.trim();
        mark(n, n.value.trim() ? '' : 'Name is required.', state);
        mark(p, !priceRaw ? 'Price is required.'
              : (isNaN(Number(priceRaw)) ? 'Enter a valid number.'
              : (Number(priceRaw) < 0 ? 'Price cannot be negative.' : '')), state);
        mark(du, du.value ? '' : 'Duration is required.', state);

        if (!state.ok) { ui.toast('Please fix the highlighted fields'); return; }

        var vals = {
          name: n.value.trim(),
          duration: Number(du.value),
          unit: document.getElementById('pk_unit').value,
          price: Number(priceRaw),
          status: document.getElementById('pk_status').value,
          description: document.getElementById('pk_desc').value.trim(),
          audio: audio,
          audioName: audioName
        };

        if (isEdit) {
          Object.assign(rec, vals);
          ui.toast('Package updated');
        } else {
          vals.id = D.packages.reduce(function (m, r) { return Math.max(m, Number(r.id) || 0); }, 0) + 1;
          vals.created = ui.today();
          D.packages.unshift(vals);
          ui.toast('Package created');
        }
        ui.go('#/packages');
      });
    }, 0);

    return f;
  }

  return {
    pages: { packages: packagesPage },
    routes: [{
      pre: 'packages', store: 'packages', nav: 'packages', group: 'Revenue',
      add: 'Add Package', ed: 'Edit Package',
      build: function (rec) { return packageForm(rec); }
    }]
  };
});
