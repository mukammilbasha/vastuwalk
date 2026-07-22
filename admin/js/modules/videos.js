/* ==========================================================================
   VasthuWalk Admin module: Offer Videos
   Card grid + "Add Offer Video" modal (title, rich-text description,
   video upload read as a data URL with an inline preview).
   ========================================================================== */
window.VW_MODULES = window.VW_MODULES || [];
window.VW_MODULES.push(function (ui, D) {
  'use strict';

  var esc = ui.esc;
  var ICONS = ui.ICONS;

  ui.injectCSS('vw-videos-css',
    '.vid-pick{display:flex;align-items:center;gap:.7rem;flex-wrap:wrap;}' +
    '.vid-prev{margin-top:.6rem;border:1px solid var(--line);border-radius:10px;overflow:hidden;' +
      'background:var(--panel-2);display:grid;place-items:center;min-height:74px;padding:.4rem;}' +
    '.vid-prev video{width:100%;max-width:260px;max-height:220px;border-radius:8px;display:block;background:#000;}' +
    '.vid-prev span{font-size:.78rem;color:var(--tx-3);}' +
    '.media-b .file{display:block;font-size:.78rem;color:var(--tx-3);word-break:break-all;}'
  );

  /* ---------- helpers ---------- */
  function fmtLen(sec) {
    if (!isFinite(sec) || sec <= 0) return '';
    var m = Math.floor(sec / 60), s = Math.round(sec % 60);
    if (s === 60) { m += 1; s = 0; }
    return m + ':' + String(s).padStart(2, '0');
  }

  /* data URLs are already in memory, so metadata preload is free;
     real files stay at preload="none" so nothing is fetched on load */
  function preloadFor(src) { return /^data:/.test(src || '') ? 'metadata' : 'none'; }

  function nextId() {
    return D.videos.reduce(function (m, r) { return Math.max(m, Number(r.id) || 0); }, 0) + 1;
  }

  /* ==========================================================================
     Add / Edit modal
     ========================================================================== */
  function videoModal(rec, onDone) {
    var isEdit = !!rec;
    var picked = { src: '', file: '', length: '' };

    ui.openModal(isEdit ? 'Edit Offer Video' : 'Add Offer Video',
      '<div class="fm-fields">' +
        '<div class="fld wide"><label for="v_title">Title <i>*</i></label>' +
          '<input id="v_title" type="text" placeholder="Title" value="' + esc((rec && rec.title) || '') + '">' +
          '<span class="fld-err"></span></div>' +

        '<div class="fld wide"><label>Description</label>' +
          ui.rteHTML(rec && rec.description) + '</div>' +

        '<div class="fld wide"><label for="v_file">Video Upload</label>' +
          '<div class="vid-pick">' +
            '<label class="img-btn" for="v_file">Choose File</label>' +
            '<span class="img-name" id="v_name">' +
              (isEdit && rec.file ? esc(rec.file) : 'No file chosen') + '</span>' +
            '<input type="file" id="v_file" accept=".mp4,.webm,.mov" hidden>' +
          '</div>' +
          '<div class="vid-prev" id="v_prev">' +
            (isEdit && rec.src
              ? '<video src="' + esc(rec.src) + '"' + (rec.poster ? ' poster="' + esc(rec.poster) + '"' : '') +
                ' controls preload="' + preloadFor(rec.src) + '" playsinline></video>'
              : '<span>No video selected</span>') +
          '</div>' +
          '<span class="fld-err"></span></div>' +
      '</div>',
      '<button class="btn btn-line" id="fmCancel">Cancel</button>' +
      '<button class="btn btn-gold" id="fmSave">Save</button>');

    ui.initRTE();

    var titleEl = document.getElementById('v_title');
    var errEl = titleEl.parentNode.querySelector('.fld-err');
    titleEl.addEventListener('input', function () {
      if (!titleEl.value.trim()) return;
      titleEl.classList.remove('bad');
      errEl.textContent = '';
    });

    /* ---- file picker ---- */
    var input = document.getElementById('v_file');
    var nameEl = document.getElementById('v_name');
    var prev = document.getElementById('v_prev');

    input.addEventListener('change', function () {
      var fl = input.files && input.files[0];
      if (!fl) return;
      if (!/\.(mp4|webm|mov)$/i.test(fl.name)) {
        ui.toast('Only .mp4 .webm .mov videos are allowed');
        input.value = '';
        return;
      }
      var fr = new FileReader();
      fr.onload = function () {
        picked.src = String(fr.result);
        picked.file = fl.name;
        nameEl.textContent = fl.name;
        prev.innerHTML = '';
        var v = ui.el('<video src="' + picked.src + '" controls preload="metadata" playsinline></video>');
        v.addEventListener('loadedmetadata', function () {
          picked.length = fmtLen(v.duration);
        });
        prev.appendChild(v);
      };
      fr.onerror = function () { ui.toast('Could not read that file'); };
      fr.readAsDataURL(fl);
    });

    document.getElementById('fmCancel').addEventListener('click', ui.closeModal);

    document.getElementById('fmSave').addEventListener('click', function () {
      var title = titleEl.value.trim();
      if (!title) {
        errEl.textContent = 'Title is required.';
        titleEl.classList.add('bad');
        ui.toast('Please fix the highlighted fields');
        return;
      }
      errEl.textContent = '';
      titleEl.classList.remove('bad');

      var vals = { title: title, description: ui.rteValue() };
      if (picked.src) {
        vals.src = picked.src;
        vals.file = picked.file;
        vals.poster = '';
        if (picked.length) vals.length = picked.length;
      }

      if (isEdit) {
        Object.assign(rec, vals);
        ui.toast('Video updated');
      } else {
        D.videos.unshift({
          id: nextId(),
          title: title,
          description: vals.description,
          file: picked.file || 'uploaded.mp4',
          length: picked.length || '—',
          status: 'Active',
          created: ui.today(),
          src: picked.src || '',
          poster: ''
        });
        ui.toast('Video created');
      }
      ui.closeModal();
      if (onDone) onDone();
    });
  }

  /* ==========================================================================
     Page
     ========================================================================== */
  function videosPage() {
    var f = document.createDocumentFragment();

    var header = ui.el(ui.head('Offer Videos', 'Promotional campaign videos',
      '<button class="btn btn-gold" id="vidAdd">' + ICONS.plus + 'Upload Video</button>'));
    f.appendChild(header);

    var panel = ui.el('<div class="panel"><div class="panel-head"><h3>Published videos</h3>' +
      '<small class="vid-count"></small></div><div class="media-grid"></div></div>');
    var grid = panel.querySelector('.media-grid');
    var count = panel.querySelector('.vid-count');

    function paint() {
      count.textContent = D.videos.length + ' active';
      grid.innerHTML = '';

      if (!D.videos.length) {
        grid.appendChild(ui.el('<div class="empty" style="grid-column:1/-1;padding:2rem">' +
          '<div>🎬</div>No videos yet</div>'));
        return;
      }

      D.videos.forEach(function (v) {
        var card = ui.el('<div class="media">' +
          '<video src="' + esc(v.src) + '"' + (v.poster ? ' poster="' + esc(v.poster) + '"' : '') +
            ' controls preload="' + preloadFor(v.src) + '" playsinline></video>' +
          '<div class="media-b"><b>' + esc(v.title) + '</b>' +
            '<small class="file">' + esc(v.file) + ' · ' + esc(v.length || '—') + '</small>' +
            '<div class="row">' + ui.badge(v.status) + '<div class="row-acts">' +
              '<button class="act-btn" title="Edit">' + ICONS.edit + '</button>' +
              '<button class="act-btn danger" title="Delete">' + ICONS.del + '</button>' +
            '</div></div></div></div>');

        var acts = card.querySelectorAll('.act-btn');
        acts[0].addEventListener('click', function () {
          videoModal(v, paint);
        });
        acts[1].addEventListener('click', function () {
          ui.confirmDelete('Delete "' + v.title + '"?', function () {
            var i = D.videos.indexOf(v);
            if (i > -1) D.videos.splice(i, 1);
            paint();
            ui.toast('Video deleted');
          });
        });
        grid.appendChild(card);
      });
    }

    paint();
    f.appendChild(panel);

    header.querySelector('#vidAdd').addEventListener('click', function () {
      videoModal(null, paint);
    });

    return f;
  }

  return { pages: { videos: videosPage } };
});
