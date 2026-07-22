/* ==========================================================================
   VasthuWalk Admin module: Setting
     · General Setting      #/settings
     · App Launch Audio     #/settings-audio
     · Mail Setting         #/settings-mail
   ========================================================================== */
window.VW_MODULES = window.VW_MODULES || [];
window.VW_MODULES.push(function (ui, D) {
  'use strict';

  var esc = ui.esc;
  var LOGO = '../assets/img/logo.png';
  var AUDIO_SRC = '../assets/gallery/videos/offer1.mp4';
  var AUDIO_NAME = '1775652480_vlc-record-2026-04-07-12h42m45s-Vastu Puja & Vastu Shanti Mantra _ Vastu Mantra for Removing Vastu Dosha.mp3-.mp3';

  /* ---- module-level state (survives tab switches, not reloads) ---- */
  var settings = {
    logo: LOGO,
    darkLogo: LOGO,
    miniLogo: LOGO,
    darkMiniLogo: LOGO,
    favicon: LOGO,

    siteName: 'VasthuWalk',
    siteDesc: 'Daily Vasthu guidance, auspicious dates and a curated marketplace.',
    contactEmail: 'vasthuwalk@gmail.com',
    contactNumber: '7788849994',

    youtube: 'https://www.youtube.com/',
    facebook: 'https://www.facebook.com/',
    twitter: 'https://www.x.com/',
    linkedin: 'https://www.linkedin.com/',
    instagram: 'https://www.instagram.com/',
    copyright: '© 2026 VasthuWalk. All rights reserved.',
    helpUrl: 'www.vasthuwalk.com',

    audioSrc: AUDIO_SRC,
    audioName: AUDIO_NAME,

    mailMailer: 'smtp',
    mailHost: 'mail.vrikshatech.in',
    mailPort: '587',
    mailUsername: 'mailer@vrikshatech.in',
    mailPassword: 'vw$Mailer2026',
    mailEncryption: 'tls',
    mailFromAddress: 'vasthuwalk@noreply.com',
    mailFromName: 'vasthuwalk'
  };

  /* ---------------------------------------------------------------- CSS -- */
  ui.injectCSS('vw-settings-css',
    '.vw-set-2col{display:grid;grid-template-columns:1fr 1fr;gap:1.2rem 1.6rem;padding:1.2rem;}' +
    '.vw-set-col{display:flex;flex-direction:column;gap:.9rem;min-width:0;}' +
    '.vw-set-2col .fld{min-width:0;}' +
    '.vw-set-2col .fld input,.vw-set-2col .fld textarea,.vw-set-2col .fld select{max-width:100%;}' +
    '.vw-prev{position:relative;overflow:visible;background:#fff;}' +
    '.vw-prev img{object-fit:contain;border-radius:9px;background:#fff;padding:3px;}' +
    '.vw-img-x{position:absolute;top:-7px;right:-7px;width:19px;height:19px;border:0;padding:0;' +
      'border-radius:50%;background:var(--bad);color:#fff;font-size:.72rem;line-height:1;' +
      'cursor:pointer;display:grid;place-items:center;box-shadow:0 1px 4px rgba(0,0,0,.3);}' +
    '.vw-img-x:hover{filter:brightness(1.15);}' +
    '.vw-set-2col .img-pick{gap:.6rem;}' +
    '.vw-set-2col .img-name{max-width:100%;overflow-wrap:anywhere;}' +
    /* audio */
    '.vw-audio-wrap{padding:1.2rem;display:flex;flex-direction:column;gap:.9rem;max-width:760px;}' +
    '.vw-audio-wrap audio{width:100%;max-width:520px;}' +
    '.vw-audio-name{font-size:.84rem;font-weight:700;color:#3a7ac0;overflow-wrap:anywhere;}' +
    '.vw-drop{border:2px dashed #3a7ac0;border-radius:12px;background:rgba(58,122,192,.06);' +
      'color:#3a7ac0;font-size:.9rem;font-weight:600;text-align:center;padding:1.7rem 1rem;' +
      'cursor:pointer;transition:.2s var(--t);}' +
    '.vw-drop:hover{background:rgba(58,122,192,.12);}' +
    '.vw-drop.over{background:rgba(58,122,192,.2);border-color:#1f5f9e;}' +
    '.vw-drop small{display:block;font-weight:500;opacity:.8;margin-top:.3rem;font-size:.76rem;}' +
    '@media (max-width:900px){.vw-set-2col{grid-template-columns:1fr;}}' +
    '@media (max-width:600px){.vw-set-2col{padding:1rem .9rem;}.vw-audio-wrap{padding:1rem .9rem;}}'
  );

  /* ------------------------------------------------------------- shell -- */
  var TABS = [
    { k: 'settings', t: 'General Setting', go: '#/settings' },
    { k: 'settings-audio', t: 'App Launch Audio', go: '#/settings-audio' },
    { k: 'settings-mail', t: 'Mail Setting', go: '#/settings-mail' }
  ];

  function shell(active, contentHTML) {
    var f = document.createDocumentFragment();
    f.appendChild(ui.el(ui.head('Setting', 'Application configuration')));
    var tabs = TABS.map(function (x) {
      return '<a href="' + x.go + '" class="set-tab' + (x.k === active ? ' on' : '') + '">' + esc(x.t) + '</a>';
    }).join('');
    f.appendChild(ui.el(
      '<div class="set-grid">' +
        '<div class="panel set-side"><div class="panel-body">' + tabs + '</div></div>' +
        '<div class="panel set-main">' + contentHTML + '</div>' +
      '</div>'));
    return f;
  }

  /* ------------------------------------------------------------ fields -- */
  function id(k) { return 'st_' + k; }

  function inp(k, label, type, ph) {
    return '<div class="fld"><label for="' + id(k) + '">' + esc(label) + '</label>' +
      '<input id="' + id(k) + '" data-sk="' + k + '" type="' + (type || 'text') +
      '" value="' + esc(settings[k]) + '" placeholder="' + esc(ph || label) + '">' +
      '<span class="fld-err"></span></div>';
  }

  function area(k, label) {
    return '<div class="fld"><label for="' + id(k) + '">' + esc(label) + '</label>' +
      '<textarea id="' + id(k) + '" data-sk="' + k + '" placeholder="' + esc(label) + '">' +
      esc(settings[k]) + '</textarea><span class="fld-err"></span></div>';
  }

  function imgFld(k, label) {
    var src = settings[k];
    return '<div class="fld"><label>' + esc(label) + '</label>' +
      '<div class="img-pick" id="' + id(k) + '_box" data-sk="' + k + '">' +
        '<div class="img-prev vw-prev">' +
          (src
            ? '<img src="' + esc(src) + '" alt="' + esc(label) + '">' +
              '<button type="button" class="vw-img-x" title="Remove ' + esc(label) + '" aria-label="Remove ' + esc(label) + '">&times;</button>'
            : '<span>No image</span>') +
        '</div>' +
        '<label class="img-btn" for="' + id(k) + '">Choose File</label>' +
        '<span class="img-name">' + (src ? 'No file chosen' : 'No file chosen') + '</span>' +
        '<input type="file" id="' + id(k) + '" accept=".png,.jpg,.jpeg,.gif,.webp,.svg,.ico" hidden>' +
      '</div><span class="fld-err"></span></div>';
  }

  /* wire every [data-sk] input/textarea so edits live-persist into `settings` */
  function bindInputs(root) {
    (root || document).querySelectorAll('input[data-sk],textarea[data-sk],select[data-sk]').forEach(function (n) {
      if (n.type === 'file') return;
      n.addEventListener('input', function () {
        settings[n.dataset.sk] = n.value;
        n.classList.remove('bad');
        var box = n.closest('.fld');
        var e = box ? box.querySelector('.fld-err') : null;
        if (e) e.textContent = '';
      });
    });
  }

  function bindImage(k, label) {
    var box = document.getElementById(id(k) + '_box');
    if (!box) return;
    var input = document.getElementById(id(k));
    var prev = box.querySelector('.img-prev');
    var name = box.querySelector('.img-name');

    function paint(src, fileName) {
      settings[k] = src || '';
      if (src) {
        prev.innerHTML = '<img src="' + src + '" alt="' + esc(label) + '">' +
          '<button type="button" class="vw-img-x" title="Remove ' + esc(label) + '" aria-label="Remove ' + esc(label) + '">&times;</button>';
        wireX();
      } else {
        prev.innerHTML = '<span>No image</span>';
      }
      name.textContent = fileName || 'No file chosen';
    }

    function wireX() {
      var x = prev.querySelector('.vw-img-x');
      if (!x) return;
      x.addEventListener('click', function () {
        input.value = '';
        paint('', 'No file chosen');
        ui.toast(label + ' removed');
      });
    }
    wireX();

    input.addEventListener('change', function () {
      var fl = input.files && input.files[0];
      if (!fl) return;
      if (!/\.(png|jpe?g|gif|webp|svg|ico)$/i.test(fl.name)) {
        ui.toast('Only .png .jpg .jpeg .gif .webp .svg .ico allowed');
        input.value = '';
        return;
      }
      var fr = new FileReader();
      fr.onload = function () { paint(fr.result, fl.name); };
      fr.readAsDataURL(fl);
    });
  }

  /* -------------------------------------------------------- validation -- */
  var RE_MAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  var RE_URL = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(:\d+)?(\/[^\s]*)?$/i;

  function marker() {
    var ok = true;
    function mark(k, msg) {
      var n = document.getElementById(id(k));
      if (!n) return;
      var box = n.closest('.fld');
      var e = box ? box.querySelector('.fld-err') : null;
      if (e) e.textContent = msg || '';
      n.classList.toggle('bad', !!msg);
      if (msg) ok = false;
    }
    mark.ok = function () { return ok; };
    return mark;
  }

  function readAll() {
    document.querySelectorAll('input[data-sk],textarea[data-sk],select[data-sk]').forEach(function (n) {
      if (n.type === 'file') return;
      settings[n.dataset.sk] = n.value;
    });
  }

  /* ============================================================ GENERAL == */
  var IMG_FIELDS = [
    ['logo', 'Logo'], ['darkLogo', 'Dark Logo'], ['miniLogo', 'Mini Logo'],
    ['darkMiniLogo', 'Dark Mini Logo'], ['favicon', 'Favicon']
  ];
  var URL_FIELDS = [
    ['youtube', 'Youtube Url'], ['facebook', 'Facebook URL'], ['twitter', 'Twitter URL'],
    ['linkedin', 'LinkedIn URL'], ['instagram', 'Instagram URL']
  ];

  function generalPage() {
    var left = IMG_FIELDS.map(function (x) { return imgFld(x[0], x[1]); }).join('') +
      inp('siteName', 'Site Name') +
      area('siteDesc', 'Site Description') +
      inp('contactEmail', 'Contact Email', 'email') +
      inp('contactNumber', 'Contact Number');

    var right = URL_FIELDS.map(function (x) { return inp(x[0], x[1], 'text', x[1]); }).join('') +
      inp('copyright', 'Copyright Text') +
      inp('helpUrl', 'Help & Support URL');

    var body =
      '<div class="panel-head"><h3>General Setting</h3></div>' +
      '<div class="vw-set-2col">' +
        '<div class="vw-set-col">' + left + '</div>' +
        '<div class="vw-set-col">' + right + '</div>' +
      '</div>' +
      '<div class="form-foot"><button class="btn btn-gold" id="stSaveGeneral">Save</button></div>';

    var frag = shell('settings', body);

    setTimeout(function () {
      bindInputs();
      IMG_FIELDS.forEach(function (x) { bindImage(x[0], x[1]); });

      var btn = document.getElementById('stSaveGeneral');
      if (!btn) return;
      btn.addEventListener('click', function () {
        readAll();
        var mark = marker();
        mark('contactEmail', !settings.contactEmail ? 'Contact email is required.'
          : (RE_MAIL.test(settings.contactEmail) ? '' : 'Enter a valid email.'));
        URL_FIELDS.concat([['helpUrl', 'Help & Support URL']]).forEach(function (x) {
          var v = (settings[x[0]] || '').trim();
          mark(x[0], (v && !RE_URL.test(v)) ? 'Enter a valid URL.' : '');
        });
        if (!mark.ok()) { ui.toast('Please fix the highlighted fields'); return; }
        ui.toast('General settings saved');
      });
    }, 0);

    return frag;
  }

  /* ============================================================== AUDIO == */
  var AUDIO_OK = /\.(mp3|wav|m4a|ogg)$/i;

  function audioPage() {
    var body =
      '<div class="panel-head"><h3>App Launch Audio</h3></div>' +
      '<div class="vw-audio-wrap">' +
        '<div class="fld">' +
          '<label for="stAudio">App Launch Mantra</label>' +
          '<audio id="stAudio" controls preload="metadata" src="' + esc(settings.audioSrc) + '"></audio>' +
          '<span class="vw-audio-name" id="stAudioName">' + esc(settings.audioName) + '</span>' +
          '<span class="fld-err" id="stAudioErr"></span>' +
        '</div>' +
        '<div class="vw-drop" id="stDrop" role="button" tabindex="0">' +
          'Drag &amp; Drop your audio file here, or click to select' +
          '<small>Accepted formats: .mp3 .wav .m4a .ogg</small>' +
        '</div>' +
        '<input type="file" id="stAudioFile" accept=".mp3,.wav,.m4a,.ogg" hidden>' +
      '</div>' +
      '<div class="form-foot"><button class="btn btn-gold" id="stSaveAudio">Save</button></div>';

    var frag = shell('settings-audio', body);

    setTimeout(function () {
      var drop = document.getElementById('stDrop');
      var file = document.getElementById('stAudioFile');
      var player = document.getElementById('stAudio');
      var nameEl = document.getElementById('stAudioName');
      var errEl = document.getElementById('stAudioErr');
      if (!drop || !file || !player) return;

      function accept(fl) {
        if (!fl) return;
        if (!AUDIO_OK.test(fl.name)) {
          if (errEl) errEl.textContent = 'Only .mp3 .wav .m4a .ogg files are allowed.';
          ui.toast('Please fix the highlighted fields');
          return;
        }
        if (errEl) errEl.textContent = '';
        var fr = new FileReader();
        fr.onload = function () {
          settings.audioSrc = fr.result;
          settings.audioName = fl.name;
          player.src = fr.result;
          player.load();
          nameEl.textContent = fl.name;
          ui.toast('Audio file selected');
        };
        fr.readAsDataURL(fl);
      }

      drop.addEventListener('click', function () { file.click(); });
      drop.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); file.click(); }
      });
      file.addEventListener('change', function () { accept(file.files && file.files[0]); });

      ['dragenter', 'dragover'].forEach(function (ev) {
        drop.addEventListener(ev, function (e) {
          e.preventDefault(); e.stopPropagation();
          drop.classList.add('over');
        });
      });
      ['dragleave', 'dragend'].forEach(function (ev) {
        drop.addEventListener(ev, function (e) {
          e.preventDefault(); e.stopPropagation();
          drop.classList.remove('over');
        });
      });
      drop.addEventListener('drop', function (e) {
        e.preventDefault(); e.stopPropagation();
        drop.classList.remove('over');
        var dt = e.dataTransfer;
        accept(dt && dt.files && dt.files[0]);
      });

      var btn = document.getElementById('stSaveAudio');
      if (btn) btn.addEventListener('click', function () {
        if (!settings.audioName) {
          if (errEl) errEl.textContent = 'Choose an audio file.';
          ui.toast('Please fix the highlighted fields');
          return;
        }
        ui.toast('App launch audio settings saved');
      });
    }, 0);

    return frag;
  }

  /* =============================================================== MAIL == */
  function mailPage() {
    var body =
      '<div class="panel-head"><h3>Mail Setting</h3></div>' +
      '<div class="vw-set-2col">' +
        '<div class="vw-set-col">' +
          inp('mailMailer', 'Mail Mailer') +
          inp('mailPort', 'Mail Port') +
          '<div class="fld"><label for="' + id('mailPassword') + '">Mail Password</label>' +
            '<input id="' + id('mailPassword') + '" data-sk="mailPassword" type="password" value="' +
            esc(settings.mailPassword) + '" placeholder="Mail Password"><span class="fld-err"></span></div>' +
          inp('mailFromAddress', 'Mail From Address', 'text') +
        '</div>' +
        '<div class="vw-set-col">' +
          inp('mailHost', 'Mail Host') +
          inp('mailUsername', 'Mail Username') +
          inp('mailEncryption', 'Mail Encryption') +
          inp('mailFromName', 'Mail From Name') +
        '</div>' +
      '</div>' +
      '<div class="form-foot"><button class="btn btn-gold" id="stSaveMail">Save</button></div>';

    var frag = shell('settings-mail', body);

    setTimeout(function () {
      bindInputs();
      var btn = document.getElementById('stSaveMail');
      if (!btn) return;
      btn.addEventListener('click', function () {
        readAll();
        var mark = marker();
        var port = (settings.mailPort || '').trim();
        mark('mailPort', !port ? 'Mail port is required.'
          : (/^\d+$/.test(port) ? '' : 'Mail port must be numeric.'));
        var from = (settings.mailFromAddress || '').trim();
        mark('mailFromAddress', (from && !RE_MAIL.test(from)) ? 'Enter a valid email.' : '');
        if (!mark.ok()) { ui.toast('Please fix the highlighted fields'); return; }
        ui.toast('Mail settings saved');
      });
    }, 0);

    return frag;
  }

  return {
    pages: {
      settings: generalPage,
      'settings-audio': audioPage,
      'settings-mail': mailPage
    },
    titles: { 'settings-audio': 'App Launch Audio', 'settings-mail': 'Mail Setting' },
    groups: { 'settings-audio': 'System', 'settings-mail': 'System' }
  };
});
