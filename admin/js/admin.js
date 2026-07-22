/* ==========================================================================
   VasthuWalk Admin Portal — router, icons, CRUD, table engine, charts
   ========================================================================== */
(function () {
  'use strict';

  var D = window.VW;
  var view = document.getElementById('view');
  var crumbPage = document.getElementById('crumbPage');
  var crumbRoot = document.getElementById('crumbRoot');

  /* ---------------- helpers ---------------- */
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]; }); }
  function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }
  function money(n) { return n >= 100000 ? '₹' + (n / 100000).toFixed(2) + 'L' : inr(n); }
  function today() { return new Date().toISOString().slice(0, 10); }

  function badge(v) {
    var m = {
      Active: 'b-ok', Success: 'b-ok', Delivered: 'b-ok', Published: 'b-ok',
      Pending: 'b-warn', Draft: 'b-warn', Confirmed: 'b-info', Dispatched: 'b-info',
      Inactive: 'b-mute', Failed: 'b-bad', Rejected: 'b-bad', Refunded: 'b-bad'
    };
    return '<span class="badge ' + (m[v] || 'b-mute') + '">' + esc(v) + '</span>';
  }

  /* ---------------- sidebar icons ---------------- */
  var S = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
  var NAV_ICONS = {
    grid:     '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    users:    '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    home:     '<path d="m3 10 9-7 9 7v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 21v-7h6v7"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="17" rx="2"/><path d="M3 10h18M8 2.5v4M16 2.5v4"/><circle cx="8.5" cy="14.5" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="14.5" r="1" fill="currentColor" stroke="none"/>',
    cart:     '<circle cx="9" cy="20" r="1.6"/><circle cx="18" cy="20" r="1.6"/><path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6"/>',
    tag:      '<path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h9z"/><circle cx="8" cy="8" r="1.6"/>',
    box:      '<path d="m21 8-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/><path d="M12 13v8"/>',
    layers:   '<path d="m12 2 9 5-9 5-9-5 9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 17 9 5 9-5"/>',
    refresh:  '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/>',
    alert:    '<path d="M10.3 3.9 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    chart:    '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6" rx="1"/><rect x="12" y="8" width="3" height="10" rx="1"/><rect x="17" y="5" width="3" height="13" rx="1"/>',
    image:    '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.8"/><path d="m21 16-5-5-9 9"/>',
    video:    '<rect x="2" y="5" width="14" height="14" rx="2"/><path d="m22 8-6 4 6 4z"/>',
    file:     '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    cog:      '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2 2 2 0 1 1-4 0 1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 15a2 2 0 1 1 0-4 1.7 1.7 0 0 0 1.2-2.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 10 4.1a2 2 0 1 1 4 0 1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1A1.7 1.7 0 0 0 21 11a2 2 0 1 1 0 4 1.7 1.7 0 0 0-1.6 0z"/>'
  };
  document.querySelectorAll('.side-nav a[data-ico]').forEach(function (a) {
    var k = a.dataset.ico;
    if (!NAV_ICONS[k]) return;
    var svg = '<svg class="nav-ico" viewBox="0 0 24 24" ' + S + '>' + NAV_ICONS[k] + '</svg>';
    a.insertAdjacentHTML('afterbegin', svg);
    var label = a.childNodes[1];
    if (label && label.nodeType === 3) {
      var sp = document.createElement('span');
      sp.className = 'nav-txt';
      sp.textContent = label.textContent;
      a.replaceChild(sp, label);
    }
  });

  var ICONS = {
    edit: '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    eye: '<svg viewBox="0 0 24 24" ' + S + '><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    del: '<svg viewBox="0 0 24 24" ' + S + '><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>',
    plus: '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 5v14M5 12h14"/></svg>',
    down: '<svg viewBox="0 0 24 24" ' + S + '><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
    search: '<svg viewBox="0 0 24 24" ' + S + '><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
  };

  function toast(msg) {
    var box = document.getElementById('toasts');
    var t = el('<div class="toast">' + esc(msg) + '</div>');
    box.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; t.style.transform = 'translateX(20px)'; }, 2600);
    setTimeout(function () { t.remove(); }, 3100);
  }

  function csv(rows, cols, filename) {
    var head = cols.map(function (c) { return '"' + c.label + '"'; }).join(',');
    var body = rows.map(function (r) {
      return cols.map(function (c) { return '"' + String(r[c.key] == null ? '' : r[c.key]).replace(/"/g, '""') + '"'; }).join(',');
    }).join('\n');
    var blob = new Blob([head + '\n' + body], { type: 'text/csv;charset=utf-8;' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    URL.revokeObjectURL(a.href);
    toast('Exported ' + rows.length + ' rows to ' + filename);
  }

  /* ==========================================================================
     Drawer + confirm dialog
     ========================================================================== */
  var dWrap = document.getElementById('drawerWrap');
  var dBody = document.getElementById('drawerBody');
  var dFoot = document.getElementById('drawerFoot');
  var dTitle = document.getElementById('drawerTitle');
  var dKind = document.getElementById('drawerKind');

  function closeDrawer() { dWrap.hidden = true; document.body.style.overflow = ''; }
  document.getElementById('drawerClose').addEventListener('click', closeDrawer);
  document.getElementById('drawerScrim').addEventListener('click', closeDrawer);

  function openDrawer(kind, title, bodyHTML, footHTML) {
    dKind.textContent = kind;
    dTitle.textContent = title;
    dBody.innerHTML = bodyHTML;
    dFoot.innerHTML = footHTML || '';
    dWrap.hidden = false;
    document.body.style.overflow = 'hidden';
    var first = dBody.querySelector('input,select,textarea');
    if (first) setTimeout(function () { first.focus(); }, 80);
  }

  var cWrap = document.getElementById('confirmWrap');
  var cYes = document.getElementById('confirmYes');
  var cNo = document.getElementById('confirmNo');
  function closeConfirm() { cWrap.hidden = true; }
  cNo.addEventListener('click', closeConfirm);
  cWrap.addEventListener('click', function (e) { if (e.target === cWrap) closeConfirm(); });

  function confirmDelete(text, onYes) {
    document.getElementById('confirmText').textContent = text;
    cWrap.hidden = false;
    var fresh = cYes.cloneNode(true);
    cYes.parentNode.replaceChild(fresh, cYes);
    cYes = fresh;
    cYes.addEventListener('click', function () { closeConfirm(); onYes(); });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!dWrap.hidden) closeDrawer();
    if (!cWrap.hidden) closeConfirm();
    var fm = document.getElementById('formModal');
    if (fm && !fm.hidden) { fm.hidden = true; document.body.style.overflow = ''; }
  });

  /* ---------------- form builder ---------------- */
  function inputFor(f, rec) {
    var v = rec ? rec[f.key] : (f.def != null ? f.def : '');
    var id = 'f_' + f.key;
    if (f.type === 'select') {
      return '<select id="' + id + '" data-key="' + f.key + '">' + f.options.map(function (o) {
        return '<option' + (String(o) === String(v) ? ' selected' : '') + '>' + esc(o) + '</option>';
      }).join('') + '</select>';
    }
    if (f.type === 'textarea') {
      return '<textarea id="' + id + '" data-key="' + f.key + '">' + esc(v) + '</textarea>';
    }
    return '<input id="' + id + '" data-key="' + f.key + '" type="' + (f.type || 'text') + '" value="' + esc(v) + '"' +
           (f.req ? ' required' : '') + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : '') + '>';
  }

  function buildForm(fields, rec) {
    return '<form class="drawer-form" id="drawerForm">' + fields.map(function (f) {
      return '<div class="fld' + (f.wide ? ' wide' : '') + '">' +
             '<label for="f_' + f.key + '">' + esc(f.label) + (f.req ? ' <i>*</i>' : '') + '</label>' +
             inputFor(f, rec) + '<span class="fld-err"></span></div>';
    }).join('') + '</form>';
  }

  function readForm(fields) {
    var out = {}, ok = true;
    fields.forEach(function (f) {
      var node = document.getElementById('f_' + f.key);
      if (!node) return;
      var val = node.value.trim();
      var errEl = node.parentNode.querySelector('.fld-err');
      var msg = '';
      if (f.req && !val) msg = f.label + ' is required.';
      else if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = 'Enter a valid email.';
      else if (f.type === 'number' && val && isNaN(Number(val))) msg = 'Enter a number.';
      if (msg) { ok = false; node.classList.add('bad'); } else node.classList.remove('bad');
      if (errEl) errEl.textContent = msg;
      out[f.key] = f.type === 'number' ? Number(val || 0) : val;
    });
    return ok ? out : null;
  }

  /* ==========================================================================
     Data table (with CRUD)
     ========================================================================== */
  function dataTable(opts) {
    var state = { q: '', sort: null, dir: 1, page: 1, filter: 'All' };
    var size = opts.pageSize || 10;
    var store = opts.rows;

    var wrap = el('<div class="panel"></div>');
    var toolbar = el('<div class="toolbar"></div>');

    var search = el('<div class="field">' + ICONS.search +
      '<input type="search" placeholder="Search ' + esc(opts.name) + '…" aria-label="Search"></div>');
    toolbar.appendChild(search);

    if (opts.filters && opts.filters.length) {
      var chips = el('<div class="chips"></div>');
      ['All'].concat(opts.filters).forEach(function (f) {
        var c = el('<button class="chip' + (f === 'All' ? ' on' : '') + '">' + esc(f) + '</button>');
        c.addEventListener('click', function () {
          chips.querySelectorAll('.chip').forEach(function (x) { x.classList.remove('on'); });
          c.classList.add('on'); state.filter = f; state.page = 1; render();
        });
        chips.appendChild(c);
      });
      toolbar.appendChild(chips);
    }

    var right = el('<div class="tool-right"></div>');
    var exp = el('<button class="btn btn-line">' + ICONS.down + 'Export</button>');
    exp.addEventListener('click', function () { csv(filtered(), opts.cols, opts.name.toLowerCase().replace(/\s+/g, '-') + '.csv'); });
    right.appendChild(exp);

    if (opts.fields || opts.createRoute || opts.onCreate) {
      var add = el('<button class="btn btn-gold">' + ICONS.plus + (opts.addLabel || 'New') + '</button>');
      add.addEventListener('click', function () {
        if (opts.onCreate) opts.onCreate(function () { state.page = 1; render(); });
        else if (opts.createRoute) location.hash = opts.createRoute;
        else openCreate();
      });
      right.appendChild(add);
    }
    toolbar.appendChild(right);
    wrap.appendChild(toolbar);

    var scroll = el('<div class="tbl-scroll"></div>');
    var table = el('<table class="tbl"></table>');
    var thead = el('<thead></thead>');
    var htr = el('<tr></tr>');
    opts.cols.forEach(function (c) {
      var th = el('<th>' + esc(c.label) + '<span class="sort">↕</span></th>');
      th.dataset.key = c.key;
      th.addEventListener('click', function () {
        if (state.sort === c.key) state.dir = -state.dir; else { state.sort = c.key; state.dir = 1; }
        render();
      });
      htr.appendChild(th);
    });
    htr.appendChild(el('<th class="th-act">Actions</th>'));
    thead.appendChild(htr);
    table.appendChild(thead);
    var tbody = el('<tbody></tbody>');
    table.appendChild(tbody);
    scroll.appendChild(table);
    wrap.appendChild(scroll);

    var foot = el('<div class="tfoot"><small></small><div class="pager"></div></div>');
    wrap.appendChild(foot);

    search.querySelector('input').addEventListener('input', function (e) {
      state.q = e.target.value.toLowerCase(); state.page = 1; render();
    });

    function filtered() {
      var out = store.slice();
      if (state.filter !== 'All' && opts.filterKey) {
        out = out.filter(function (r) { return r[opts.filterKey] === state.filter; });
      }
      if (state.q) {
        out = out.filter(function (r) {
          return (opts.searchKeys || Object.keys(r)).some(function (k) {
            return String(r[k]).toLowerCase().indexOf(state.q) > -1;
          });
        });
      }
      if (state.sort) {
        out.sort(function (a, b) {
          var x = a[state.sort], y = b[state.sort];
          if (typeof x === 'number' && typeof y === 'number') return (x - y) * state.dir;
          return String(x).localeCompare(String(y), undefined, { numeric: true }) * state.dir;
        });
      }
      return out;
    }

    /* ---- CRUD ---- */
    function label(rec) { return rec[opts.titleKey || opts.cols[1].key]; }

    function openCreate() {
      openDrawer('Create', 'New ' + opts.singular,
        buildForm(opts.fields, null),
        '<button class="btn btn-line" data-x>Cancel</button><button class="btn btn-gold" data-save>Create</button>');
      dFoot.querySelector('[data-x]').addEventListener('click', closeDrawer);
      dFoot.querySelector('[data-save]').addEventListener('click', function () {
        var v = readForm(opts.fields);
        if (!v) return;
        var maxId = store.reduce(function (m, r) { return Math.max(m, Number(r.id) || 0); }, 0);
        v.id = maxId + 1;
        if ('created' in (store[0] || {})) v.created = today();
        store.unshift(v);
        closeDrawer(); state.page = 1; render(); refreshCounts();
        toast(opts.singular + ' created');
      });
    }

    function openEdit(rec) {
      openDrawer('Edit', label(rec),
        buildForm(opts.fields, rec),
        '<button class="btn btn-line" data-x>Cancel</button><button class="btn btn-gold" data-save>Save changes</button>');
      dFoot.querySelector('[data-x]').addEventListener('click', closeDrawer);
      dFoot.querySelector('[data-save]').addEventListener('click', function () {
        var v = readForm(opts.fields);
        if (!v) return;
        Object.assign(rec, v);
        if ('updated' in rec) rec.updated = today();
        closeDrawer(); render();
        toast(opts.singular + ' updated');
      });
    }

    function openView(rec) {
      var rows = opts.viewRender ? opts.viewRender(rec) : ('<div class="kv-list">' + opts.cols.map(function (c) {
        return '<div class="kv"><span>' + esc(c.label) + '</span><b>' +
               (c.render ? c.render(rec) : esc(rec[c.key])) + '</b></div>';
      }).join('') + '</div>');
      openDrawer('Details', label(rec), rows,
        '<button class="btn btn-line" data-x>Close</button>' +
        ((opts.fields || opts.editRoute || opts.onEdit) ? '<button class="btn btn-gold" data-edit>Edit</button>' : ''));
      dFoot.querySelector('[data-x]').addEventListener('click', closeDrawer);
      var e2 = dFoot.querySelector('[data-edit]');
      if (e2) e2.addEventListener('click', function () {
        closeDrawer();
        if (opts.onEdit) setTimeout(function () { opts.onEdit(rec, render); }, 120);
        else if (opts.editRoute) location.hash = opts.editRoute + rec.id;
        else setTimeout(function () { openEdit(rec); }, 120);
      });
    }

    function doDelete(rec) {
      confirmDelete('Delete "' + label(rec) + '"? This cannot be undone.', function () {
        var i = store.indexOf(rec);
        if (i > -1) store.splice(i, 1);
        render(); refreshCounts();
        toast(opts.singular + ' deleted');
      });
    }

    function render() {
      var rows = filtered();
      var pages = Math.max(1, Math.ceil(rows.length / size));
      if (state.page > pages) state.page = pages;
      var slice = rows.slice((state.page - 1) * size, state.page * size);

      htr.querySelectorAll('th').forEach(function (th) {
        th.classList.remove('asc', 'desc');
        if (th.dataset.key === state.sort) th.classList.add(state.dir === 1 ? 'asc' : 'desc');
      });

      tbody.innerHTML = '';
      if (!slice.length) {
        tbody.appendChild(el('<tr><td colspan="' + (opts.cols.length + 1) + '"><div class="empty"><div>🔍</div>No matching records</div></td></tr>'));
      }
      slice.forEach(function (r) {
        var tr = el('<tr></tr>');
        opts.cols.forEach(function (c) {
          tr.appendChild(el('<td>' + (c.render ? c.render(r) : esc(r[c.key])) + '</td>'));
        });
        var tg = tr.querySelector('[data-tgl]');
        if (tg) {
          tg.addEventListener('click', function () {
            r.status = r.status === 'Active' ? 'Inactive' : 'Active';
            render();
            toast(label(r) + ' set to ' + r.status);
          });
        }
        var editable = opts.fields || opts.editRoute || opts.onEdit;
        var td = el('<td><div class="row-acts">' +
          '<button class="act-btn" title="View">' + ICONS.eye + '</button>' +
          (editable ? '<button class="act-btn" title="Edit">' + ICONS.edit + '</button>' : '') +
          (editable ? '<button class="act-btn danger" title="Delete">' + ICONS.del + '</button>' : '') +
          '</div></td>');
        var bs = td.querySelectorAll('button');
        bs[0].addEventListener('click', function () { openView(r); });
        if (editable) {
          bs[1].addEventListener('click', function () {
            if (opts.onEdit) opts.onEdit(r, render);
            else if (opts.editRoute) location.hash = opts.editRoute + r.id;
            else openEdit(r);
          });
          bs[2].addEventListener('click', function () { doDelete(r); });
        }
        tr.appendChild(td);
        tbody.appendChild(tr);
      });

      foot.querySelector('small').textContent =
        'Showing ' + (rows.length ? (state.page - 1) * size + 1 : 0) + '–' +
        Math.min(state.page * size, rows.length) + ' of ' + rows.length + ' entries';

      var pager = foot.querySelector('.pager');
      pager.innerHTML = '';
      function pgBtn(t, page, dis, on) {
        var b = el('<button class="pg' + (on ? ' on' : '') + '"' + (dis ? ' disabled' : '') + '>' + t + '</button>');
        if (!dis) b.addEventListener('click', function () { state.page = page; render(); });
        return b;
      }
      pager.appendChild(pgBtn('‹', state.page - 1, state.page === 1));
      var from = Math.max(1, state.page - 2), to = Math.min(pages, from + 4);
      from = Math.max(1, to - 4);
      for (var p = from; p <= to; p++) pager.appendChild(pgBtn(String(p), p, false, p === state.page));
      pager.appendChild(pgBtn('›', state.page + 1, state.page === pages));
    }

    render();
    return wrap;
  }

  function toggleHTML(r) {
    var on = r.status === 'Active';
    return '<button class="tgl' + (on ? ' on' : '') + '" data-tgl="1" ' +
           'aria-pressed="' + on + '" title="' + (on ? 'Active' : 'Inactive') + '"><span></span></button>';
  }

  function refreshCounts() {
    document.getElementById('cUsers').textContent = D.users.length;
    document.getElementById('cOrders').textContent = D.orders.length;
  }

  /* ==========================================================================
     Charts
     ========================================================================== */
  function barChart(series, fmt) {
    var max = Math.max.apply(null, series.map(function (s) { return s.v; }));
    return el('<div class="chart-wrap"><div class="bars">' + series.map(function (s) {
      return '<div class="bar-col"><div class="bar-fill" style="height:' + Math.round(s.v / max * 100) +
        '%" data-v="' + fmt(s.v) + '"></div><span class="bar-x">' + esc(s.m) + '</span></div>';
    }).join('') + '</div></div>');
  }

  function sparkline(series) {
    var w = 300, h = 70, max = Math.max.apply(null, series.map(function (s) { return s.v; }));
    var pts = series.map(function (s, i) {
      return [i / (series.length - 1) * w, h - (s.v / max) * (h - 8) - 4];
    });
    var line = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' ');
    return el('<div class="chart-wrap"><svg class="spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">' +
      '<path class="area" d="' + line + ' L' + w + ' ' + h + ' L0 ' + h + ' Z"/><path class="line" d="' + line + '"/></svg></div>');
  }

  function donut(parts) {
    var total = parts.reduce(function (a, p) { return a + p.v; }, 0) || 1;
    var acc = 0, stops = [];
    parts.forEach(function (p) {
      stops.push(p.c + ' ' + (acc / total * 100).toFixed(2) + '% ' + ((acc + p.v) / total * 100).toFixed(2) + '%');
      acc += p.v;
    });
    return el('<div class="panel-body"><div class="donut-wrap">' +
      '<div class="donut" style="background:conic-gradient(' + stops.join(',') + ')">' +
      '<div class="donut-hole"><b>' + total + '</b><small>Orders</small></div></div><div class="legend">' +
      parts.map(function (p) { return '<div><i style="background:' + p.c + '"></i>' + esc(p.k) + '<span>' + p.v + '</span></div>'; }).join('') +
      '</div></div></div>');
  }


  /* ==========================================================================
     Generic form modal + rich-text editor (Grah Pravesh / Vasthu Dates)
     ========================================================================== */
  var fmWrap = document.getElementById('formModal');
  var fmBody = document.getElementById('fmBody');
  var fmFoot = document.getElementById('fmFoot');
  var fmTitle = document.getElementById('fmTitle');

  function closeModal() { fmWrap.hidden = true; document.body.style.overflow = ''; }
  document.getElementById('fmClose').addEventListener('click', closeModal);
  fmWrap.addEventListener('click', function (e) { if (e.target === fmWrap) closeModal(); });

  function openModal(title, bodyHTML, footHTML) {
    fmTitle.textContent = title;
    fmBody.innerHTML = bodyHTML;
    fmFoot.innerHTML = footHTML || '';
    fmWrap.hidden = false;
    document.body.style.overflow = 'hidden';
  }

  /* ---- rich text editor (contenteditable, no dependencies) ---- */
  var RTE_TOOLS = [
    { cmd: 'undo', t: 'Undo', i: '<path d="M3 7v6h6"/><path d="M3.5 13a9 9 0 1 0 2.1-6.4L3 9"/>' },
    { cmd: 'redo', t: 'Redo', i: '<path d="M21 7v6h-6"/><path d="M20.5 13a9 9 0 1 1-2.1-6.4L21 9"/>' },
    { sep: 1 },
    { cmd: 'bold', t: 'Bold', i: '<path d="M7 5h6a3.5 3.5 0 0 1 0 7H7z"/><path d="M7 12h7a3.5 3.5 0 0 1 0 7H7z"/>' },
    { cmd: 'italic', t: 'Italic', i: '<path d="M19 4h-9M14 20H5M15 4 9 20"/>' },
    { cmd: 'underline', t: 'Underline', i: '<path d="M6 4v6a6 6 0 0 0 12 0V4"/><path d="M4 21h16"/>' },
    { cmd: 'hiliteColor', val: '#ffe9a8', t: 'Highlight', i: '<path d="m9 11-6 6v3h3l6-6"/><path d="m17 7 4 4-8 8-4-4z"/>' },
    { sep: 1 },
    { cmd: 'insertUnorderedList', t: 'Bulleted list', i: '<path d="M9 6h12M9 12h12M9 18h12"/><circle cx="4.5" cy="6" r="1.4"/><circle cx="4.5" cy="12" r="1.4"/><circle cx="4.5" cy="18" r="1.4"/>' },
    { cmd: 'insertOrderedList', t: 'Numbered list', i: '<path d="M10 6h11M10 12h11M10 18h11"/><path d="M4 6h2V3H4.5M4 12h2l-2 3h2M4 18h2v3H4"/>' },
    { cmd: 'createLink', t: 'Insert link', i: '<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>' },
    { sep: 1 },
    { cmd: 'justifyLeft', t: 'Align left', i: '<path d="M3 6h18M3 12h11M3 18h15"/>' },
    { cmd: 'justifyCenter', t: 'Align centre', i: '<path d="M3 6h18M6 12h12M5 18h14"/>' },
    { cmd: 'justifyRight', t: 'Align right', i: '<path d="M3 6h18M10 12h11M6 18h15"/>' },
    { cmd: 'justifyFull', t: 'Justify', i: '<path d="M3 6h18M3 12h18M3 18h18"/>' },
    { sep: 1 },
    { cmd: 'outdent', t: 'Decrease indent', i: '<path d="M11 6h10M11 12h10M11 18h10"/><path d="m7 9-4 3 4 3"/>' },
    { cmd: 'indent', t: 'Increase indent', i: '<path d="M11 6h10M11 12h10M11 18h10"/><path d="m3 9 4 3-4 3"/>' },
    { cmd: 'removeFormat', t: 'Clear formatting', i: '<path d="M4 7V5h16v2"/><path d="M9 20h6"/><path d="M12 5 9 20"/><path d="m17 14 5 5m0-5-5 5"/>' }
  ];

  function rteHTML(html) {
    var bar = RTE_TOOLS.map(function (t) {
      if (t.sep) return '<span class="rte-sep"></span>';
      return '<button type="button" class="rte-b" data-cmd="' + t.cmd + '"' +
             (t.val ? ' data-val="' + t.val + '"' : '') + ' title="' + t.t + '" aria-label="' + t.t + '">' +
             '<svg viewBox="0 0 24 24" ' + S + '>' + t.i + '</svg></button>';
    }).join('');
    return '<div class="rte">' +
      '<div class="rte-bar">' +
        '<select class="rte-block" title="Paragraph style">' +
          '<option value="p">Paragraph</option><option value="h2">Heading</option>' +
          '<option value="h3">Sub-heading</option><option value="blockquote">Quote</option>' +
        '</select>' + bar +
      '</div>' +
      '<div class="rte-body" id="rteBody" contenteditable="true" role="textbox" aria-multiline="true">' +
        (html || '<p><br></p>') +
      '</div>' +
      '<div class="rte-foot"><span id="rteCount">0 words</span></div>' +
    '</div>';
  }

  function initRTE() {
    var body = document.getElementById('rteBody');
    if (!body) return;
    var bar = body.parentNode.querySelector('.rte-bar');

    function count() {
      var txt = (body.innerText || '').trim();
      var n = txt ? txt.split(/\s+/).length : 0;
      var c = document.getElementById('rteCount');
      if (c) c.textContent = n + (n === 1 ? ' word' : ' words');
    }

    bar.querySelectorAll('.rte-b').forEach(function (b) {
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });
      b.addEventListener('click', function () {
        var cmd = b.dataset.cmd, val = b.dataset.val || null;
        body.focus();
        if (cmd === 'createLink') {
          var url = window.prompt('Link URL', 'https://');
          if (!url) return;
          document.execCommand('createLink', false, url);
        } else {
          try { document.execCommand(cmd, false, val); } catch (e) {}
        }
        count(); sync();
      });
    });

    var sel = bar.querySelector('.rte-block');
    sel.addEventListener('change', function () {
      body.focus();
      try { document.execCommand('formatBlock', false, sel.value); } catch (e) {}
      count(); sync();
    });

    function sync() {
      bar.querySelectorAll('.rte-b').forEach(function (b) {
        var c = b.dataset.cmd;
        if (/^(undo|redo|createLink|removeFormat|indent|outdent)$/.test(c)) return;
        try { b.classList.toggle('on', document.queryCommandState(c)); } catch (e) {}
      });
    }

    body.addEventListener('input', function () { count(); });
    body.addEventListener('keyup', sync);
    body.addEventListener('mouseup', sync);
    count();
  }

  function rteValue() {
    var b = document.getElementById('rteBody');
    if (!b) return '';
    var html = b.innerHTML.trim();
    return (html === '<br>' || html === '<p><br></p>') ? '' : html;
  }

  function stripHTML(html) {
    var d = document.createElement('div');
    d.innerHTML = html || '';
    return (d.textContent || '').replace(/\s+/g, ' ').trim();
  }

  /* ---- Date + Time + Description entry form (modal) ---- */
  function dateEntryForm(cfg, rec, onDone) {
    var isEdit = !!rec;
    openModal((isEdit ? 'Edit ' : 'Add ') + cfg.singular,
      '<div class="fm-fields">' +
        '<div class="fld"><label for="e_date">Date <i>*</i></label>' +
          '<input id="e_date" type="date" value="' + esc((rec && rec.date) || '') + '">' +
          '<span class="fld-err"></span></div>' +
        (cfg.withTime !== false
          ? '<div class="fld"><label for="e_time">Time</label>' +
            '<input id="e_time" type="time" value="' + esc((rec && rec.time) || '') + '">' +
            '<span class="fld-err"></span></div>'
          : '') +
        '<div class="fld wide"><label>Description</label>' + rteHTML(rec && rec.description) + '</div>' +
        '<div class="fld"><label for="e_status">Status</label><select id="e_status">' +
          ['Active', 'Inactive'].map(function (o) {
            return '<option' + (rec && rec.status === o ? ' selected' : '') + '>' + o + '</option>';
          }).join('') + '</select></div>' +
      '</div>',
      '<button class="btn btn-line" id="fmCancel">Cancel</button>' +
      '<button class="btn btn-gold" id="fmSave">Save</button>');

    initRTE();

    // clear the validation error as soon as a date is chosen
    var dateInput = document.getElementById('e_date');
    dateInput.addEventListener('input', function () {
      if (!dateInput.value) return;
      dateInput.classList.remove('bad');
      var e = dateInput.parentNode.querySelector('.fld-err');
      if (e) e.textContent = '';
    });

    document.getElementById('fmCancel').addEventListener('click', closeModal);
    document.getElementById('fmSave').addEventListener('click', function () {
      var d = document.getElementById('e_date');
      var errBox = d.parentNode.querySelector('.fld-err');
      if (!d.value) {
        errBox.textContent = 'Date is required.';
        d.classList.add('bad');
        toast('Please choose a date');
        return;
      }
      errBox.textContent = '';
      d.classList.remove('bad');

      var vals = {
        date: d.value,
        description: rteValue(),
        status: document.getElementById('e_status').value
      };
      var t = document.getElementById('e_time');
      if (t) vals.time = t.value;

      if (isEdit) {
        Object.assign(rec, vals);
        toast(cfg.singular + ' updated');
      } else {
        vals.id = cfg.store.reduce(function (m, r) { return Math.max(m, r.id); }, 0) + 1;
        vals.created = today();
        cfg.store.unshift(vals);
        toast(cfg.singular + ' created');
      }
      closeModal();
      if (onDone) onDone();
    });
  }

  /* ==========================================================================
     Field schemas
     ========================================================================== */
  var YN = ['Active', 'Inactive'];
  var F = {
    users: [
      { key: 'name', label: 'Full name', req: true, ph: 'e.g. Arun K' },
      { key: 'email', label: 'Email', type: 'email', req: true, ph: 'name@example.com' },
      { key: 'phone', label: 'Phone', req: true, ph: '+91 …' },
      { key: 'city', label: 'City' },
      { key: 'status', label: 'Status', type: 'select', options: YN, def: 'Active' }
    ],
    products: [
      { key: 'title', label: 'Product title', req: true, wide: true },
      { key: 'category', label: 'Category', type: 'select', options: ['Statues', 'Plant', 'Rings'] },
      { key: 'price', label: 'Price (₹)', type: 'number', req: true },
      { key: 'status', label: 'Status', type: 'select', options: YN, def: 'Active' }
    ],
    categories: [
      { key: 'name', label: 'Category name', req: true },
      { key: 'products', label: 'Products', type: 'number', def: 0 },
      { key: 'status', label: 'Status', type: 'select', options: YN, def: 'Active' }
    ],
    packages: [
      { key: 'name', label: 'Plan name', req: true },
      { key: 'duration', label: 'Duration', type: 'number', req: true },
      { key: 'unit', label: 'Unit', type: 'select', options: ['Monthly', 'Hrs', 'Days'] },
      { key: 'price', label: 'Price (₹)', type: 'number', req: true },
      { key: 'status', label: 'Status', type: 'select', options: YN, def: 'Active' }
    ],
    grah: [
      { key: 'date', label: 'Date', type: 'date', req: true },
      { key: 'month', label: 'Month', type: 'select', options: ['January','February','March','April','May','June','July','August','September','October','November','December'] },
      { key: 'time', label: 'Time', ph: '6:30 AM' },
      { key: 'nakshatra', label: 'Nakshatra', type: 'select', options: ['Rohini','Mrigashira','Uttara','Hasta','Swati','Anuradha'] },
      { key: 'status', label: 'Status', type: 'select', options: YN, def: 'Active' }
    ],
    vasthu: [
      { key: 'date', label: 'Date', type: 'date', req: true },
      { key: 'title', label: 'Title', req: true },
      { key: 'note', label: 'Note', type: 'textarea', wide: true },
      { key: 'status', label: 'Status', type: 'select', options: YN, def: 'Active' }
    ],
    banners: [
      { key: 'title', label: 'Banner title', req: true },
      { key: 'url', label: 'Link URL', ph: 'https://…', wide: true },
      { key: 'status', label: 'Status', type: 'select', options: YN, def: 'Active' }
    ],
    pages: [
      { key: 'title', label: 'Page title', req: true },
      { key: 'slug', label: 'Slug', req: true, ph: 'privacy-policy' },
      { key: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft'], def: 'Draft' }
    ],
    orders: [
      { key: 'user', label: 'Customer', req: true },
      { key: 'item', label: 'Item', wide: true },
      { key: 'city', label: 'City' },
      { key: 'amount', label: 'Amount (₹)', type: 'number', req: true },
      { key: 'status', label: 'Status', type: 'select', options: D.ORDER_STATUS, def: 'Pending' }
    ],
    subs: [
      { key: 'user', label: 'User', req: true },
      { key: 'package', label: 'Package', type: 'select', options: ['Personal Plan', 'Business Plan'] },
      { key: 'amount', label: 'Amount (₹)', type: 'number', req: true },
      { key: 'pay', label: 'Payment', type: 'select', options: ['razorpay', 'by cash'] },
      { key: 'status', label: 'Status', type: 'select', options: YN, def: 'Active' }
    ]
  };


  /* ---- date-entry module page (Grah Pravesh / Vasthu Dates) ---- */
  function datePage(cfg) {
    var f = document.createDocumentFragment();
    f.appendChild(el(head(cfg.title, cfg.sub)));

    var cols = [
      C.id,
      { key: 'date', label: 'Date', render: function (r) { return '<span class="mono strong">' + esc(r.date) + '</span>'; } }
    ];
    if (cfg.withTime) {
      cols.push({ key: 'time', label: 'Time', render: function (r) { return '<span class="mono">' + esc(r.time || '—') + '</span>'; } });
    }
    cols.push({
      key: 'description', label: 'Description', render: function (r) {
        var t = stripHTML(r.description);
        return '<span class="desc-cell" title="' + esc(t) + '">' + esc(t.slice(0, 70) + (t.length > 70 ? '…' : '')) + '</span>';
      }
    });
    cols.push(C.stat('status'));
    cols.push(C.mono('created', 'Created'));

    var table = dataTable({
      name: cfg.title, singular: cfg.singular, addLabel: cfg.addLabel, rows: cfg.store,
      filters: ['Active', 'Inactive'], filterKey: 'status', titleKey: 'date',
      searchKeys: ['date', 'time', 'description'],
      cols: cols,
      onCreate: function (refresh) { dateEntryForm(cfg, null, refresh); },
      onEdit: function (rec, refresh) { dateEntryForm(cfg, rec, refresh); },
      viewRender: function (rec) {
        return '<div class="kv-list">' +
          '<div class="kv"><span>Date</span><b class="mono">' + esc(rec.date) + '</b></div>' +
          (cfg.withTime ? '<div class="kv"><span>Time</span><b class="mono">' + esc(rec.time || '—') + '</b></div>' : '') +
          '<div class="kv"><span>Status</span><b>' + badge(rec.status) + '</b></div>' +
          '<div class="kv"><span>Created</span><b class="mono">' + esc(rec.created) + '</b></div>' +
          '</div><div class="kv-rich"><span>Description</span><div class="rich-view">' +
          (rec.description || '<em>No description</em>') + '</div></div>';
      }
    });
    f.appendChild(table);
    return f;
  }

  /* ==========================================================================
     Pages
     ========================================================================== */
  function head(title, sub, actions) {
    return '<div class="page-head"><div><h1>' + esc(title) + '</h1>' +
      (sub ? '<p>' + esc(sub) + '</p>' : '') + '</div>' +
      (actions ? '<div class="head-actions">' + actions + '</div>' : '') + '</div>';
  }
  var C = {
    id: { key: 'id', label: 'ID' },
    mono: function (k, l) { return { key: k, label: l, render: function (r) { return '<span class="mono">' + esc(r[k]) + '</span>'; } }; },
    strong: function (k, l) { return { key: k, label: l, render: function (r) { return '<span class="strong">' + esc(r[k]) + '</span>'; } }; },
    cash: function (k, l) { return { key: k, label: l, render: function (r) { return '<span class="mono">' + inr(r[k]) + '</span>'; } }; },
    stat: function (k, l) { return { key: k, label: l || 'Status', render: function (r) { return badge(r[k]); } }; }
  };

  var PAGES = {
    dashboard: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Dashboard', 'Business overview across the VasthuWalk platform')));
      var k = D.KPI;
      f.appendChild(el('<div class="kpis">' + [
        ['💰', money(k.revenue), 'Total revenue', '+12.4%', 'up'],
        ['💳', k.payments, 'Payments processed', '+8.1%', 'up'],
        ['👥', D.users.length, 'Registered users', '+21.4%', 'up'],
        ['📦', D.orders.length, 'Orders placed', '+5.2%', 'up'],
        ['🔄', k.activeSubs, 'Active subscriptions', '-2.0%', 'dn'],
        ['🛍️', D.products.length, 'Live products', '+0.0%', 'up']
      ].map(function (x) {
        return '<div class="kpi"><div class="kpi-top"><span class="kpi-ico">' + x[0] + '</span>' +
          '<span class="kpi-tr ' + x[4] + '">' + x[3] + '</span></div><div class="kpi-v">' + x[1] +
          '</div><div class="kpi-l">' + x[2] + '</div></div>';
      }).join('') + '</div>'));

      var g = el('<div class="grid-2"></div>');
      var p1 = el('<div class="panel"><div class="panel-head"><div><h3>Revenue</h3><small>Last 6 months</small></div>' +
        '<span class="badge b-ok">' + money(D.revenueSeries[D.revenueSeries.length - 1].v) + ' in Jul</span></div></div>');
      p1.appendChild(barChart(D.revenueSeries, money));
      g.appendChild(p1);

      var counts = {}; D.ORDER_STATUS.forEach(function (s) { counts[s] = 0; });
      D.orders.forEach(function (o) { counts[o.status]++; });
      var COL = { Pending: '#d08a1e', Confirmed: '#3a7ac0', Dispatched: '#7a5a2e', Delivered: '#2e9e63', Rejected: '#c0492f' };
      var p2 = el('<div class="panel"><div class="panel-head"><h3>Orders by status</h3></div></div>');
      p2.appendChild(donut(D.ORDER_STATUS.map(function (s) { return { k: s, v: counts[s], c: COL[s] }; })));
      g.appendChild(p2);
      f.appendChild(g);

      var g2 = el('<div class="grid-2"></div>');
      var p3 = el('<div class="panel"><div class="panel-head"><div><h3>User growth</h3><small>Cumulative registrations</small></div></div></div>');
      p3.appendChild(sparkline(D.userSeries));
      p3.appendChild(el('<div class="tbl-scroll"><table class="tbl"><thead><tr><th>User</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead><tbody>' +
        D.transactions.slice(0, 6).map(function (t) {
          return '<tr><td class="strong">' + esc(t.user) + '</td><td class="mono">' + inr(t.amount) +
            '</td><td>' + badge(t.status) + '</td><td class="mono">' + esc(t.date) + '</td></tr>';
        }).join('') + '</tbody></table></div>'));
      g2.appendChild(p3);

      var p4 = el('<div class="panel"><div class="panel-head"><h3>Recent activity</h3></div><div class="panel-body"></div></div>');
      p4.querySelector('.panel-body').innerHTML = D.activity.map(function (a) {
        return '<div class="act"><span class="act-i">' + a.icon + '</span><div>' + esc(a.text) + '<small>' + esc(a.time) + '</small></div></div>';
      }).join('');
      g2.appendChild(p4);
      f.appendChild(g2);
      return f;
    },

    users: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Users', D.users.length + ' registered users')));
      f.appendChild(dataTable({
        name: 'Users', singular: 'User', addLabel: 'Add User', rows: D.users,
        createRoute: '#/users/new', editRoute: '#/users/edit/',
        filters: D.USER_STATUS, filterKey: 'status', titleKey: 'name',
        searchKeys: ['name', 'firstName', 'lastName', 'email', 'username', 'phone', 'city'],
        cols: [C.id,
          { key: 'name', label: 'Name', render: function (r) {
              return '<div class="cell-user"><span class="mini-av">' +
                (r.avatar ? '<img src="' + esc(r.avatar) + '" alt="">' : esc(initials(r))) +
                '</span><span class="strong">' + esc(r.name) + '</span></div>'; } },
          { key: 'username', label: 'Username', render: function (r) {
              return '<span class="mono">@' + esc(r.username) + '</span>'; } },
          { key: 'email', label: 'Email' },
          { key: 'phone', label: 'Phone', render: function (r) {
              return '<span class="mono">+91 ' + esc(r.phone) + '</span>'; } },
          { key: 'gender', label: 'Gender' },
          C.stat('status'), C.mono('created', 'Joined')]
      }));
      return f;
    },

    orders: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Orders', D.orders.length + ' orders across the fulfilment pipeline')));
      f.appendChild(dataTable({
        name: 'Orders', singular: 'Order', addLabel: 'New Order', rows: D.orders, fields: F.orders,
        filters: D.ORDER_STATUS, filterKey: 'status', searchKeys: ['id', 'user', 'item', 'city'], titleKey: 'id',
        cols: [C.mono('id', 'Order ID'), { key: 'user', label: 'Customer' }, { key: 'item', label: 'Item' },
               { key: 'city', label: 'City' }, C.cash('amount', 'Amount'), C.stat('status'), C.mono('date', 'Date')]
      }));
      return f;
    },

    products: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Products', 'Marketplace catalog')));
      f.appendChild(dataTable({
        name: 'Products', singular: 'Product', addLabel: 'Add Product', rows: D.products,
        createRoute: '#/products/new', editRoute: '#/products/edit/',
        filters: ['Active', 'Inactive'], filterKey: 'status',
        searchKeys: ['title', 'category'], titleKey: 'title',
        cols: [C.id,
          { key: 'title', label: 'Title', render: function (r) {
              return '<div class="cell-user"><span class="mini-thumb">' +
                (r.image ? '<img src="' + esc(r.image) + '" alt="">' : '🛍️') +
                '</span><span class="strong">' + esc(r.title) + '</span></div>'; } },
          { key: 'category', label: 'Category' },
          C.cash('price', 'Price'),
          { key: 'status', label: 'Status', render: function (r) { return toggleHTML(r); } },
          C.mono('created', 'Created')]
      }));
      return f;
    },

    categories: function () {
      var f = document.createDocumentFragment();
      recountCategories();
      f.appendChild(el(head('Product Categories', 'Group products for the marketplace')));
      f.appendChild(dataTable({
        name: 'Categories', singular: 'Category', addLabel: 'Add Product category', rows: D.categories,
        createRoute: '#/categories/new', editRoute: '#/categories/edit/',
        searchKeys: ['name'], titleKey: 'name',
        cols: [C.id,
          { key: 'name', label: 'Title', render: function (r) {
              return '<div class="cell-user"><span class="mini-thumb">' +
                (r.image ? '<img src="' + esc(r.image) + '" alt="">' : '🏷️') +
                '</span><span class="strong">' + esc(r.name) + '</span></div>'; } },
          { key: 'products', label: 'Products' },
          { key: 'status', label: 'Status', render: function (r) { return toggleHTML(r); } },
          C.mono('created', 'Created')]
      }));
      return f;
    },

    packages: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Packages', 'Subscription plans offered in the app')));
      f.appendChild(dataTable({
        name: 'Packages', singular: 'Package', addLabel: 'Add Package', rows: D.packages, fields: F.packages,
        searchKeys: ['name'], titleKey: 'name',
        cols: [C.id, C.strong('name', 'Plan'), { key: 'duration', label: 'Duration' },
               { key: 'unit', label: 'Unit' }, C.cash('price', 'Price'), C.stat('status')]
      }));
      return f;
    },

    subscriptions: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Subscriptions', D.subscriptions.length + ' subscription records')));
      f.appendChild(dataTable({
        name: 'Subscriptions', singular: 'Subscription', addLabel: 'Add Subscription',
        rows: D.subscriptions, fields: F.subs,
        filters: YN, filterKey: 'status', searchKeys: ['user', 'package', 'pay'], titleKey: 'user',
        cols: [C.id, { key: 'user', label: 'User' }, { key: 'package', label: 'Package' },
               C.cash('amount', 'Amount'), { key: 'pay', label: 'Payment' }, C.mono('start', 'Start'), C.stat('status')]
      }));
      return f;
    },

    attempts: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Subscription Attempts', 'Monitor checkout conversion and failures')));
      f.appendChild(dataTable({
        name: 'Attempts', singular: 'Attempt', rows: D.attempts,
        filters: ['Success', 'Failed'], filterKey: 'result', searchKeys: ['user', 'package'], titleKey: 'user',
        cols: [C.id, { key: 'user', label: 'User' }, { key: 'package', label: 'Package' },
               C.cash('amount', 'Amount'), C.stat('result', 'Result'), C.mono('date', 'Date')]
      }));
      return f;
    },

    transactions: function () {
      var f = document.createDocumentFragment();
      var total = D.transactions.reduce(function (a, t) { return a + t.amount; }, 0);
      f.appendChild(el(head('Transactions', D.transactions.length + ' payments · ' + money(total) + ' processed')));
      f.appendChild(dataTable({
        name: 'Transactions', singular: 'Transaction', rows: D.transactions,
        filters: ['Success', 'Refunded'], filterKey: 'status', searchKeys: ['ref', 'user', 'method'], titleKey: 'ref',
        cols: [C.id, C.mono('ref', 'Reference'), { key: 'user', label: 'User' },
               C.cash('amount', 'Amount'), { key: 'method', label: 'Method' }, C.stat('status'), C.mono('date', 'Date')]
      }));
      return f;
    },

    grahpravesh: function () {
      return datePage({
        route: 'grahpravesh', store: D.grah, singular: 'Grah Pravesh',
        title: 'Grah Pravesh Dates', sub: 'Auspicious housewarming dates published to the app',
        addLabel: 'Add Grah Pravesh', withTime: true
      });
    },

    vasthudates: function () {
      return datePage({
        route: 'vasthudates', store: D.vasthuDates, singular: 'Vasthu Date',
        title: 'Vasthu Dates', sub: 'Daily Vasthu Naal entries',
        addLabel: 'Add Vasthu Date', withTime: true
      });
    },

    banners: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Banner Slider', 'Home-screen banners shown inside the app')));
      f.appendChild(dataTable({
        name: 'Banners', singular: 'Banner', addLabel: 'Add Banner', rows: D.banners, fields: F.banners,
        searchKeys: ['title'], titleKey: 'title',
        cols: [C.id, C.strong('title', 'Title'), { key: 'url', label: 'Link' }, C.stat('status'), C.mono('created', 'Created')]
      }));
      return f;
    },

    videos: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Offer Videos', 'Promotional campaign videos',
        '<button class="btn btn-gold" id="upVid">' + ICONS.plus + 'Upload Video</button>')));
      var panel = el('<div class="panel"><div class="panel-head"><h3>Published videos</h3><small>' +
        D.videos.length + ' active</small></div><div class="media-grid"></div></div>');
      var grid = panel.querySelector('.media-grid');
      D.videos.forEach(function (v) {
        var card = el('<div class="media">' +
          '<video src="' + esc(v.src) + '" poster="' + esc(v.poster) + '" controls preload="none" playsinline></video>' +
          '<div class="media-b"><b>' + esc(v.title) + '</b><small>' + esc(v.file) + ' · ' + esc(v.length) + '</small>' +
          '<div class="row">' + badge(v.status) + '<div class="row-acts">' +
          '<button class="act-btn" title="Edit">' + ICONS.edit + '</button>' +
          '<button class="act-btn danger" title="Delete">' + ICONS.del + '</button></div></div></div></div>');
        var bs = card.querySelectorAll('.act-btn');
        bs[0].addEventListener('click', function () {
          var flds = [{ key: 'title', label: 'Video title', req: true },
                      { key: 'status', label: 'Status', type: 'select', options: YN }];
          openDrawer('Edit', v.title, buildForm(flds, v),
            '<button class="btn btn-line" data-x>Cancel</button><button class="btn btn-gold" data-save>Save</button>');
          dFoot.querySelector('[data-x]').addEventListener('click', closeDrawer);
          dFoot.querySelector('[data-save]').addEventListener('click', function () {
            var val = readForm(flds); if (!val) return;
            Object.assign(v, val); closeDrawer(); route(); toast('Video updated');
          });
        });
        bs[1].addEventListener('click', function () {
          confirmDelete('Delete "' + v.title + '"?', function () {
            D.videos.splice(D.videos.indexOf(v), 1); route(); toast('Video deleted');
          });
        });
        grid.appendChild(card);
      });
      f.appendChild(panel);
      setTimeout(function () {
        var b = document.getElementById('upVid');
        if (b) b.addEventListener('click', function () { toast('File upload is handled server-side in the live system'); });
      }, 0);
      return f;
    },

    pages: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Pages', 'Static content served to the app and website')));
      f.appendChild(dataTable({
        name: 'Pages', singular: 'Page', addLabel: 'Add Page', rows: D.pages, fields: F.pages,
        searchKeys: ['title', 'slug'], titleKey: 'title',
        cols: [C.id, C.strong('title', 'Title'),
               { key: 'slug', label: 'Slug', render: function (r) { return '<span class="mono">/' + esc(r.slug) + '</span>'; } },
               C.stat('status'), C.mono('updated', 'Updated')]
      }));
      return f;
    },

    profile: profilePage,

    password: passwordPage,

    settings: function () {
      var f = document.createDocumentFragment();
      f.appendChild(el(head('Settings', 'Application configuration')));
      var panel = el('<div class="panel">' +
        '<div class="tabs"><button class="tab on">General</button><button class="tab">App Launch Audio</button><button class="tab">Mail</button></div>' +
        '<div class="form-grid">' +
        fld('Site Name', 'VasthuWalk') + fld('Contact Email', 'vasthuwalk@gmail.com', 'email') +
        fld('Contact Number', '7788849994') + fld('Help &amp; Support URL', 'www.vasthuwalk.com') +
        fld('YouTube URL', 'https://www.youtube.com/') + fld('Facebook URL', 'https://www.facebook.com/') +
        fld('X (Twitter) URL', 'https://www.x.com/') + fld('LinkedIn URL', 'https://www.linkedin.com/') +
        fld('Instagram URL', 'https://www.instagram.com/') + fld('Copyright Text', '© 2026 VasthuWalk. All rights reserved.') +
        '<div class="fld wide"><label>Site Description</label><textarea>Daily Vasthu guidance, auspicious dates and a curated marketplace.</textarea></div>' +
        '</div><div class="form-foot"><button class="btn btn-line">Reset</button>' +
        '<button class="btn btn-gold" id="saveSet">Save changes</button></div></div>');
      panel.querySelectorAll('.tab').forEach(function (t) {
        t.addEventListener('click', function () {
          panel.querySelectorAll('.tab').forEach(function (x) { x.classList.remove('on'); });
          t.classList.add('on'); toast(t.textContent + ' settings loaded');
        });
      });
      f.appendChild(panel);
      setTimeout(function () {
        var s = document.getElementById('saveSet');
        if (s) s.addEventListener('click', function () { toast('Settings saved (prototype — not persisted)'); });
      }, 0);
      return f;
    }
  };

  function fld(label, val, type) {
    return '<div class="fld"><label>' + label + '</label><input type="' + (type || 'text') + '" value="' + esc(val) + '"></div>';
  }


  /* ==========================================================================
     Add / Edit User — dedicated screen (mirrors the live admin layout)
     ========================================================================== */
  function initials(rec) {
    var a = ((rec && rec.firstName) || '?').charAt(0);
    var b = ((rec && rec.lastName) || '').charAt(0);
    return (a + b).toUpperCase();
  }

  var CITIES = ['Chennai', 'Madurai', 'Coimbatore', 'Trichy', 'Salem', 'Erode', 'Tirunelveli', 'Vellore'];

  function userForm(rec) {
    var isEdit = !!rec;
    var f = document.createDocumentFragment();

    f.appendChild(el(head(isEdit ? 'Edit User' : 'Add User',
      isEdit ? 'Update this user account' : 'Create a new user account')));

    var grid = el('<div class="user-form"></div>');
    var av = rec && rec.avatar;

    grid.appendChild(el(
      '<div class="panel uf-side">' +
        '<div class="panel-head"><h3>' + (isEdit ? 'Edit User' : 'Add User') + '</h3></div>' +
        '<div class="panel-body">' +
          '<div class="avatar-pick">' +
            '<div class="avatar-box" id="avBox">' +
              (av ? '<img src="' + esc(av) + '" alt="">' : '<span>' + initials(rec) + '</span>') +
            '</div>' +
            '<label class="avatar-edit" for="avFile" title="Upload photo">' +
              '<svg viewBox="0 0 24 24" ' + S + '><path d="M12 20h9"/>' +
              '<path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>' +
            '</label>' +
            '<input type="file" id="avFile" accept=".png,.jpg,.jpeg,.gif" hidden>' +
          '</div>' +
          '<p class="avatar-note">Only <b>.png .jpg .jpeg .gif</b> allowed</p>' +
          '<div class="radio-group"><span class="rg-label">Status</span>' +
            D.USER_STATUS.map(function (st) {
              var on = (rec ? rec.status : 'Active') === st;
              return '<label class="radio"><input type="radio" name="ustatus" value="' + st + '"' +
                     (on ? ' checked' : '') + '><span class="dot"></span>' + st + '</label>';
            }).join('') +
          '</div>' +
        '</div>' +
      '</div>'));

    function inp(id, label, val, type, ph, req) {
      return '<div class="fld"><label for="' + id + '">' + label + (req ? ' <i>*</i>' : '') + '</label>' +
             '<input id="' + id + '" type="' + (type || 'text') + '" value="' + esc(val || '') +
             '" placeholder="' + esc(ph || '') + '"><span class="fld-err"></span></div>';
    }

    var right = el(
      '<div class="panel uf-main">' +
        '<div class="panel-head"><h3>' + (isEdit ? 'Edit' : 'Add') + ' User information</h3>' +
          '<button class="btn btn-line" id="ufBack">Back</button></div>' +
        '<div class="form-grid">' +
          inp('u_first', 'First Name', rec && rec.firstName, 'text', 'First Name', true) +
          inp('u_last', 'Last Name', rec && rec.lastName, 'text', 'Last Name', true) +
          inp('u_email', 'Email', rec && rec.email, 'email', 'Email', true) +
          inp('u_username', 'Username', rec && rec.username, 'text', 'Username', true) +
          '<div class="fld"><label for="u_pass">Password' + (isEdit ? '' : ' <i>*</i>') + '</label>' +
            '<input id="u_pass" type="password" placeholder="' +
            (isEdit ? 'Leave blank to keep current' : 'Password') + '"><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="u_phone">Phone Number <i>*</i></label>' +
            '<div class="phone-wrap"><span class="cc">+91</span>' +
            '<input id="u_phone" type="tel" value="' + esc((rec && rec.phone) || '') +
            '" placeholder="Enter phone number" maxlength="10"></div><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="u_gender">Gender <i>*</i></label><select id="u_gender">' +
            D.GENDER.map(function (g) {
              return '<option' + (rec && rec.gender === g ? ' selected' : '') + '>' + g + '</option>';
            }).join('') + '</select><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="u_city">City</label><select id="u_city">' +
            CITIES.map(function (c) {
              return '<option' + (rec && rec.city === c ? ' selected' : '') + '>' + c + '</option>';
            }).join('') + '</select><span class="fld-err"></span></div>' +
        '</div>' +
        '<div class="form-foot"><button class="btn btn-line" id="ufCancel">Cancel</button>' +
        '<button class="btn btn-gold" id="ufSave">Save</button></div>' +
      '</div>');
    grid.appendChild(right);
    f.appendChild(grid);

    setTimeout(function () {
      var newAvatar = (rec && rec.avatar) || '';
      var file = document.getElementById('avFile');

      file.addEventListener('change', function () {
        var fl = file.files && file.files[0];
        if (!fl) return;
        if (!/\.(png|jpe?g|gif)$/i.test(fl.name)) {
          toast('Only .png .jpg .jpeg .gif allowed'); file.value = ''; return;
        }
        var fr = new FileReader();
        fr.onload = function () {
          newAvatar = fr.result;
          document.getElementById('avBox').innerHTML = '<img src="' + newAvatar + '" alt="">';
        };
        fr.readAsDataURL(fl);
      });

      function back() { location.hash = '#/users'; }
      document.getElementById('ufBack').addEventListener('click', back);
      document.getElementById('ufCancel').addEventListener('click', back);

      document.getElementById('ufSave').addEventListener('click', function () {
        function g(id) { return document.getElementById(id); }
        var vals = {
          firstName: g('u_first').value.trim(),
          lastName: g('u_last').value.trim(),
          email: g('u_email').value.trim(),
          username: g('u_username').value.trim(),
          phone: g('u_phone').value.trim(),
          gender: g('u_gender').value,
          city: g('u_city').value
        };
        var pass = g('u_pass').value;
        var ok = true;
        function bad(id, msg) {
          var n = g(id);
          var box = n.closest('.fld');
          var e = box ? box.querySelector('.fld-err') : null;
          if (e) e.textContent = msg || '';
          n.classList.toggle('bad', !!msg);
          if (msg) ok = false;
        }
        bad('u_first', vals.firstName ? '' : 'First name is required.');
        bad('u_last', vals.lastName ? '' : 'Last name is required.');
        bad('u_email', !vals.email ? 'Email is required.'
            : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(vals.email) ? '' : 'Enter a valid email.'));
        bad('u_username', vals.username ? '' : 'Username is required.');
        bad('u_phone', !vals.phone ? 'Phone number is required.'
            : (/^\d{10}$/.test(vals.phone) ? '' : 'Enter a 10-digit number.'));
        bad('u_pass', (!isEdit && !pass) ? 'Password is required.' : '');
        if (!ok) { toast('Please fix the highlighted fields'); return; }

        var sel = document.querySelector('input[name="ustatus"]:checked');
        vals.status = sel ? sel.value : 'Active';
        vals.name = vals.firstName + ' ' + vals.lastName;
        vals.avatar = newAvatar;

        if (isEdit) {
          Object.assign(rec, vals);
          rec.updated = today();
          toast('User updated');
        } else {
          vals.id = D.users.reduce(function (m, r) { return Math.max(m, r.id); }, 0) + 1;
          vals.created = today();
          vals.updated = today();
          D.users.unshift(vals);
          toast('User created');
        }
        refreshCounts();
        location.hash = '#/users';
      });
    }, 0);

    return f;
  }


  /* ==========================================================================
     Setting > Profile  &  Change Password
     ========================================================================== */
  function adminInitials() {
    var a = (D.admin.firstName || '?').charAt(0);
    var b = (D.admin.lastName || '').charAt(0);
    return (a + b).toUpperCase();
  }

  function paintIdentity() {
    var full = (D.admin.firstName + ' ' + D.admin.lastName).trim();
    var n = document.getElementById('whoName');
    var r = document.getElementById('whoRole');
    var av = document.getElementById('whoAv');
    if (n) n.textContent = full;
    if (r) r.textContent = D.admin.role;
    if (av) {
      av.innerHTML = D.admin.avatar
        ? '<img src="' + esc(D.admin.avatar) + '" alt="">'
        : esc(adminInitials());
    }
  }

  /* shell shared by both screens: left tab card + right content card */
  function settingShell(active, contentHTML) {
    var f = document.createDocumentFragment();
    f.appendChild(el(head('Setting', 'Manage your administrator account')));

    var tabs = [
      { k: 'profile', t: 'Profile', go: '#/profile' },
      { k: 'password', t: 'Change Password', go: '#/password' }
    ].map(function (x) {
      return '<a href="' + x.go + '" class="set-tab' + (x.k === active ? ' on' : '') + '">' + x.t + '</a>';
    }).join('');

    f.appendChild(el(
      '<div class="set-grid">' +
        '<div class="panel set-side"><div class="panel-body">' + tabs + '</div></div>' +
        '<div class="panel set-main">' + contentHTML + '</div>' +
      '</div>'));
    return f;
  }

  function profilePage() {
    var a = D.admin;
    var body =
      '<div class="prof-grid">' +
        '<div class="prof-photo">' +
          '<div class="prof-av" id="pfAv">' +
            (a.avatar ? '<img src="' + esc(a.avatar) + '" alt="">' : '<span>' + esc(adminInitials()) + '</span>') +
          '</div>' +
          '<p class="prof-name" id="pfName">' + esc((a.firstName + ' ' + a.lastName).trim()) + '</p>' +
        '</div>' +
        '<div class="form-grid prof-fields">' +
          '<div class="fld"><label for="p_first">First Name <i>*</i></label>' +
            '<input id="p_first" type="text" value="' + esc(a.firstName) + '"><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="p_last">Last Name <i>*</i></label>' +
            '<input id="p_last" type="text" value="' + esc(a.lastName) + '"><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="p_user">Username <i>*</i></label>' +
            '<input id="p_user" type="text" value="' + esc(a.username) + '"><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="p_mail">Email <i>*</i></label>' +
            '<input id="p_mail" type="email" value="' + esc(a.email) + '"><span class="fld-err"></span></div>' +
          '<div class="fld"><label for="p_phone">Phone Number</label>' +
            '<div class="phone-wrap"><span class="cc">+91</span>' +
            '<input id="p_phone" type="tel" maxlength="10" value="' + esc(a.phone) + '"></div>' +
            '<span class="fld-err"></span></div>' +
          '<div class="fld"><label for="p_img">Choose Profile Image</label>' +
            '<input id="p_img" type="file" accept=".png,.jpg,.jpeg,.gif"><span class="fld-err"></span></div>' +
        '</div>' +
      '</div>' +
      '<div class="form-foot"><button class="btn btn-gold" id="pfSave">Update</button></div>';

    var frag = settingShell('profile', body);

    setTimeout(function () {
      var pending = D.admin.avatar;
      var file = document.getElementById('p_img');
      file.addEventListener('change', function () {
        var fl = file.files && file.files[0];
        if (!fl) return;
        if (!/\.(png|jpe?g|gif)$/i.test(fl.name)) {
          toast('Only .png .jpg .jpeg .gif allowed'); file.value = ''; return;
        }
        var fr = new FileReader();
        fr.onload = function () {
          pending = fr.result;
          document.getElementById('pfAv').innerHTML = '<img src="' + pending + '" alt="">';
        };
        fr.readAsDataURL(fl);
      });

      document.getElementById('pfSave').addEventListener('click', function () {
        function g(id) { return document.getElementById(id); }
        var ok = true;
        function bad(id, msg) {
          var n = g(id), box = n.closest('.fld');
          var e = box ? box.querySelector('.fld-err') : null;
          if (e) e.textContent = msg || '';
          n.classList.toggle('bad', !!msg);
          if (msg) ok = false;
        }
        var v = {
          firstName: g('p_first').value.trim(),
          lastName: g('p_last').value.trim(),
          username: g('p_user').value.trim(),
          email: g('p_mail').value.trim(),
          phone: g('p_phone').value.trim()
        };
        bad('p_first', v.firstName ? '' : 'First name is required.');
        bad('p_last', v.lastName ? '' : 'Last name is required.');
        bad('p_user', v.username ? '' : 'Username is required.');
        bad('p_mail', !v.email ? 'Email is required.'
            : (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email) ? '' : 'Enter a valid email.'));
        bad('p_phone', (v.phone && !/^\d{10}$/.test(v.phone)) ? 'Enter a 10-digit number.' : '');
        if (!ok) { toast('Please fix the highlighted fields'); return; }

        Object.assign(D.admin, v);
        D.admin.avatar = pending || '';
        paintIdentity();
        var nm = document.getElementById('pfName');
        if (nm) nm.textContent = (v.firstName + ' ' + v.lastName).trim();
        toast('Profile updated');
      });
    }, 0);

    return frag;
  }

  function passwordPage() {
    var body =
      '<div class="pw-wrap">' +
        '<div class="fld"><label for="w_old">Old Password <i>*</i></label>' +
          '<input id="w_old" type="password" placeholder="Old Password"><span class="fld-err"></span></div>' +
        '<div class="fld"><label for="w_new">New Password <i>*</i></label>' +
          '<input id="w_new" type="password" placeholder="New Password"><span class="fld-err"></span></div>' +
        '<div class="fld"><label for="w_conf">Confirm New Password <i>*</i></label>' +
          '<input id="w_conf" type="password" placeholder="Confirm New Password"><span class="fld-err"></span></div>' +
        '<div class="pw-hint">Use at least 8 characters, with a mix of letters and numbers.</div>' +
      '</div>' +
      '<div class="form-foot"><button class="btn btn-gold" id="pwSave">Save</button></div>';

    var frag = settingShell('password', body);

    setTimeout(function () {
      document.getElementById('pwSave').addEventListener('click', function () {
        function g(id) { return document.getElementById(id); }
        var ok = true;
        function bad(id, msg) {
          var n = g(id), box = n.closest('.fld');
          var e = box ? box.querySelector('.fld-err') : null;
          if (e) e.textContent = msg || '';
          n.classList.toggle('bad', !!msg);
          if (msg) ok = false;
        }
        var oldp = g('w_old').value, np = g('w_new').value, cp = g('w_conf').value;
        bad('w_old', oldp ? '' : 'Old password is required.');
        bad('w_new', !np ? 'New password is required.'
            : (np.length < 8 ? 'Use at least 8 characters.'
            : (np === oldp ? 'New password must differ from the old one.' : '')));
        bad('w_conf', !cp ? 'Please confirm the new password.'
            : (cp !== np ? 'Passwords do not match.' : ''));
        if (!ok) { toast('Please fix the highlighted fields'); return; }

        g('w_old').value = g('w_new').value = g('w_conf').value = '';
        toast('Password updated (prototype — not persisted)');
      });
    }, 0);

    return frag;
  }


  /* ==========================================================================
     Searchable select (Product category)
     ========================================================================== */
  function selectHTML(id, options, value, placeholder) {
    return '<div class="ss" id="' + id + '" data-value="' + esc(value || '') + '">' +
      '<button type="button" class="ss-btn">' +
        '<span class="ss-val' + (value ? '' : ' ph') + '">' + esc(value || placeholder) + '</span>' +
        '<svg class="ss-caret" viewBox="0 0 24 24" ' + S + '><path d="m6 9 6 6 6-6"/></svg>' +
      '</button>' +
      '<div class="ss-pop" hidden>' +
        '<input type="text" class="ss-search" placeholder="Search…" aria-label="Search options">' +
        '<div class="ss-list">' + options.map(function (o) {
          return '<div class="ss-opt' + (o === value ? ' on' : '') + '" data-v="' + esc(o) + '">' + esc(o) + '</div>';
        }).join('') + '</div>' +
      '</div></div>';
  }

  function initSelect(id) {
    var root = document.getElementById(id);
    if (!root) return;
    var btn = root.querySelector('.ss-btn');
    var pop = root.querySelector('.ss-pop');
    var search = root.querySelector('.ss-search');
    var valEl = root.querySelector('.ss-val');

    function close() { pop.hidden = true; root.classList.remove('open'); }
    function open() {
      pop.hidden = false; root.classList.add('open');
      search.value = '';
      root.querySelectorAll('.ss-opt').forEach(function (o) { o.hidden = false; });
      search.focus();
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      if (pop.hidden) open(); else close();
    });
    pop.addEventListener('click', function (e) { e.stopPropagation(); });
    document.addEventListener('click', close);

    search.addEventListener('input', function () {
      var q = search.value.toLowerCase();
      root.querySelectorAll('.ss-opt').forEach(function (o) {
        o.hidden = o.dataset.v.toLowerCase().indexOf(q) === -1;
      });
    });

    root.querySelectorAll('.ss-opt').forEach(function (o) {
      o.addEventListener('click', function () {
        root.dataset.value = o.dataset.v;
        valEl.textContent = o.dataset.v;
        valEl.classList.remove('ph');
        root.querySelectorAll('.ss-opt').forEach(function (x) { x.classList.toggle('on', x === o); });
        root.classList.remove('bad');
        var err = root.closest('.fld').querySelector('.fld-err');
        if (err) err.textContent = '';
        close();
      });
    });

    search.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); btn.focus(); } });
  }

  function selectValue(id) {
    var r = document.getElementById(id);
    return r ? r.dataset.value : '';
  }

  /* ---------------- image picker ---------------- */
  function imageHTML(id, label, src) {
    return '<div class="fld"><label>' + label + '</label>' +
      '<div class="img-pick" id="' + id + '_box">' +
        '<div class="img-prev">' + (src ? '<img src="' + esc(src) + '" alt="">' : '<span>No image</span>') + '</div>' +
        '<label class="img-btn" for="' + id + '">Choose File</label>' +
        '<span class="img-name">' + (src ? 'Image selected' : 'No file chosen') + '</span>' +
        '<input type="file" id="' + id + '" accept=".png,.jpg,.jpeg,.gif,.webp" hidden>' +
      '</div><span class="fld-err"></span></div>';
  }

  function initImage(id, onPick) {
    var input = document.getElementById(id);
    if (!input) return;
    var box = document.getElementById(id + '_box');
    input.addEventListener('change', function () {
      var fl = input.files && input.files[0];
      if (!fl) return;
      if (!/\.(png|jpe?g|gif|webp)$/i.test(fl.name)) {
        toast('Only .png .jpg .jpeg .gif .webp allowed'); input.value = ''; return;
      }
      var fr = new FileReader();
      fr.onload = function () {
        box.querySelector('.img-prev').innerHTML = '<img src="' + fr.result + '" alt="">';
        box.querySelector('.img-name').textContent = fl.name;
        onPick(fr.result);
      };
      fr.readAsDataURL(fl);
    });
  }

  /* ==========================================================================
     Add / Edit Product
     ========================================================================== */
  function productForm(rec) {
    var isEdit = !!rec;
    var f = document.createDocumentFragment();
    var cats = D.categories.map(function (c) { return c.name; });

    f.appendChild(el(head(isEdit ? 'Edit Product' : 'Add Product',
      isEdit ? 'Update this marketplace item' : 'Create a new marketplace item')));

    f.appendChild(el(
      '<div class="panel form-page">' +
        '<div class="panel-head"><h3>' + (isEdit ? 'Edit' : 'Add') + ' Product</h3>' +
          '<button class="btn btn-line" id="pbBack">Back</button></div>' +
        '<div class="form-grid three">' +
          '<div class="fld"><label for="pr_title">Title <i>*</i></label>' +
            '<input id="pr_title" type="text" placeholder="Title" value="' + esc((rec && rec.title) || '') + '">' +
            '<span class="fld-err"></span></div>' +
          '<div class="fld"><label for="pr_price">Price <i>*</i></label>' +
            '<input id="pr_price" type="number" min="0" placeholder="Price" value="' + esc((rec && rec.price) || '') + '">' +
            '<span class="fld-err"></span></div>' +
          '<div class="fld"><label>Product category <i>*</i></label>' +
            selectHTML('pr_cat', cats, rec && rec.category, 'Select Product category') +
            '<span class="fld-err"></span></div>' +
          '<div class="fld"><label for="pr_status">Status <i>*</i></label><select id="pr_status">' +
            ['Active', 'Inactive'].map(function (o) {
              return '<option' + (rec && rec.status === o ? ' selected' : '') + '>' + o + '</option>';
            }).join('') + '</select><span class="fld-err"></span></div>' +
          '<div class="fld span3"><label>Description</label>' + rteHTML(rec && rec.description) + '</div>' +
          imageHTML('pr_img', 'Image', rec && rec.image) +
        '</div>' +
        '<div class="form-foot"><button class="btn btn-line" id="pbCancel">Cancel</button>' +
        '<button class="btn btn-gold" id="pbSave">Save</button></div>' +
      '</div>'));

    setTimeout(function () {
      initRTE();
      initSelect('pr_cat');
      var img = (rec && rec.image) || '';
      initImage('pr_img', function (d) { img = d; });

      function back() { location.hash = '#/products'; }
      document.getElementById('pbBack').addEventListener('click', back);
      document.getElementById('pbCancel').addEventListener('click', back);

      document.getElementById('pbSave').addEventListener('click', function () {
        var ok = true;
        function mark(node, msg) {
          var box = node.closest('.fld');
          var e = box ? box.querySelector('.fld-err') : null;
          if (e) e.textContent = msg || '';
          node.classList.toggle('bad', !!msg);
          if (msg) ok = false;
        }
        var t = document.getElementById('pr_title');
        var pr = document.getElementById('pr_price');
        var cat = selectValue('pr_cat');
        mark(t, t.value.trim() ? '' : 'Title is required.');
        mark(pr, !pr.value ? 'Price is required.'
              : (Number(pr.value) < 0 ? 'Price cannot be negative.' : ''));
        mark(document.getElementById('pr_cat'), cat ? '' : 'Product category is required.');
        if (!ok) { toast('Please fix the highlighted fields'); return; }

        var vals = {
          title: t.value.trim(),
          price: Number(pr.value),
          category: cat,
          status: document.getElementById('pr_status').value,
          description: rteValue(),
          image: img
        };
        if (isEdit) { Object.assign(rec, vals); toast('Product updated'); }
        else {
          vals.id = D.products.reduce(function (m, r) { return Math.max(m, r.id); }, 0) + 1;
          vals.created = today();
          D.products.unshift(vals);
          toast('Product created');
        }
        recountCategories();
        location.hash = '#/products';
      });
    }, 0);

    return f;
  }

  /* ==========================================================================
     Add / Edit Product Category
     ========================================================================== */
  function recountCategories() {
    D.categories.forEach(function (c) {
      c.products = D.products.filter(function (p) { return p.category === c.name; }).length;
    });
  }

  function categoryForm(rec) {
    var isEdit = !!rec;
    var f = document.createDocumentFragment();

    f.appendChild(el(head(isEdit ? 'Edit Product category' : 'Add Product category',
      isEdit ? 'Update this category' : 'Group products for the marketplace')));

    f.appendChild(el(
      '<div class="panel form-page">' +
        '<div class="panel-head"><h3>' + (isEdit ? 'Edit' : 'Add') + ' Product category</h3>' +
          '<button class="btn btn-line" id="cbBack">Back</button></div>' +
        '<div class="form-grid">' +
          '<div class="fld"><label for="ct_title">Title <i>*</i></label>' +
            '<input id="ct_title" type="text" placeholder="Title" value="' + esc((rec && rec.name) || '') + '">' +
            '<span class="fld-err"></span></div>' +
          imageHTML('ct_img', 'Image', rec && rec.image) +
        '</div>' +
        '<div class="form-foot"><button class="btn btn-line" id="cbCancel">Cancel</button>' +
        '<button class="btn btn-gold" id="cbSave">Save</button></div>' +
      '</div>'));

    setTimeout(function () {
      var img = (rec && rec.image) || '';
      initImage('ct_img', function (d) { img = d; });

      function back() { location.hash = '#/categories'; }
      document.getElementById('cbBack').addEventListener('click', back);
      document.getElementById('cbCancel').addEventListener('click', back);

      document.getElementById('cbSave').addEventListener('click', function () {
        var t = document.getElementById('ct_title');
        var box = t.closest('.fld').querySelector('.fld-err');
        var name = t.value.trim();
        if (!name) {
          box.textContent = 'Title is required.';
          t.classList.add('bad');
          toast('Please fix the highlighted fields');
          return;
        }
        var clash = D.categories.filter(function (c) {
          return c.name.toLowerCase() === name.toLowerCase() && c !== rec;
        }).length;
        if (clash) {
          box.textContent = 'That category already exists.';
          t.classList.add('bad');
          toast('Category name must be unique');
          return;
        }
        box.textContent = '';
        t.classList.remove('bad');

        if (isEdit) {
          var oldName = rec.name;
          rec.name = name;
          rec.image = img;
          if (oldName !== name) {
            D.products.forEach(function (p) { if (p.category === oldName) p.category = name; });
          }
          toast('Category updated');
        } else {
          D.categories.unshift({
            id: D.categories.reduce(function (m, r) { return Math.max(m, r.id); }, 0) + 1,
            name: name, products: 0, image: img, status: 'Active', created: today()
          });
          toast('Category created');
        }
        recountCategories();
        location.hash = '#/categories';
      });
    }, 0);

    return f;
  }

  /* ==========================================================================
     Router
     ========================================================================== */
  var TITLES = {
    dashboard: 'Dashboard', users: 'Users', orders: 'Orders', products: 'Products',
    categories: 'Categories', packages: 'Packages', subscriptions: 'Subscriptions',
    attempts: 'Sub. Attempts', transactions: 'Transactions', grahpravesh: 'Grah Pravesh',
    vasthudates: 'Vasthu Dates', banners: 'Banner Slider', videos: 'Offer Videos',
    pages: 'Pages', settings: 'Settings', profile: 'Profile', password: 'Change Password'
  };
  var GROUP = {
    users: 'People', grahpravesh: 'Housewarming', vasthudates: 'Housewarming',
    products: 'Commerce', categories: 'Commerce', orders: 'Commerce',
    packages: 'Revenue', subscriptions: 'Revenue', attempts: 'Revenue', transactions: 'Revenue',
    banners: 'Marketing', videos: 'Marketing', pages: 'System', settings: 'System',
    profile: 'Setting', password: 'Setting'
  };

  /* ==========================================================================
     Module API — feature modules live in js/modules/*.js and register here.
     Each module file does:
       window.VW_MODULES.push(function (ui, D) {
         return { pages: {...}, routes: [...] };
       });
     ========================================================================== */
  function injectCSS(id, css) {
    if (document.getElementById(id)) return;
    var st = document.createElement('style');
    st.id = id;
    st.textContent = css;
    document.head.appendChild(st);
  }

  var UI = {
    el: el, esc: esc, inr: inr, money: money, today: today, badge: badge,
    toast: toast, ICONS: ICONS, S: S, head: head, C: C,
    dataTable: dataTable, toggleHTML: toggleHTML, refreshCounts: refreshCounts,
    openModal: openModal, closeModal: closeModal,
    openDrawer: openDrawer, closeDrawer: closeDrawer, confirmDelete: confirmDelete,
    rteHTML: rteHTML, initRTE: initRTE, rteValue: rteValue, stripHTML: stripHTML,
    selectHTML: selectHTML, initSelect: initSelect, selectValue: selectValue,
    imageHTML: imageHTML, initImage: initImage,
    settingShell: settingShell,
    injectCSS: injectCSS,
    go: function (h) { location.hash = h; }
  };

  var MODULE_ROUTES = [];
  (window.VW_MODULES || []).forEach(function (factory) {
    var m;
    try { m = factory(UI, D); } catch (e) { console.error('module failed', e); return; }
    if (!m) return;
    if (m.pages) Object.keys(m.pages).forEach(function (k) { PAGES[k] = m.pages[k]; });
    if (m.routes) m.routes.forEach(function (r) { MODULE_ROUTES.push(r); });
    if (m.titles) Object.keys(m.titles).forEach(function (k) { TITLES[k] = m.titles[k]; });
    if (m.groups) Object.keys(m.groups).forEach(function (k) { GROUP[k] = m.groups[k]; });
  });


  function route() {
    var raw = (location.hash.replace('#/', '') || 'dashboard').split('?')[0];

    var SUB = [
      { pre: 'products', store: 'products', build: function (rec) { return productForm(rec); },
        nav: 'products', group: 'Commerce', add: 'Add Product', ed: 'Edit Product' },
      { pre: 'categories', store: 'categories', build: function (rec) { return categoryForm(rec); },
        nav: 'categories', group: 'Commerce', add: 'Add Product category', ed: 'Edit Product category' }
    ];
    var ALL_SUB = SUB.concat(MODULE_ROUTES);
    for (var si = 0; si < ALL_SUB.length; si++) {
      var cfg = ALL_SUB[si];
      if (raw === cfg.pre + '/new' || raw.indexOf(cfg.pre + '/edit/') === 0) {
        var r2 = null;
        if (raw !== cfg.pre + '/new') {
          var rid = Number(raw.split('/').pop());
          r2 = D[cfg.store].filter(function (x) { return x.id === rid; })[0];
          if (!r2) { location.hash = '#/' + cfg.pre; return; }
        }
        (function (c) {
          document.querySelectorAll('.side-nav a').forEach(function (a) {
            a.classList.toggle('on', a.getAttribute('href') === '#/' + (c.nav || c.pre));
          });
          crumbRoot.textContent = c.group || 'Admin';
          crumbPage.textContent = r2 ? (c.ed || 'Edit') : (c.add || 'Add');
        })(cfg);
        view.innerHTML = '';
        view.appendChild(cfg.build(r2));
        window.scrollTo(0, 0);
        document.body.classList.remove('side-open');
        return;
      }
    }

    if (raw === 'users/new' || raw.indexOf('users/edit/') === 0) {
      var rec = null;
      if (raw !== 'users/new') {
        var uid = Number(raw.split('/').pop());
        rec = D.users.filter(function (u) { return u.id === uid; })[0];
        if (!rec) { location.hash = '#/users'; return; }
      }
      document.querySelectorAll('.side-nav a').forEach(function (a) {
        a.classList.toggle('on', a.getAttribute('href') === '#/users');
      });
      crumbRoot.textContent = 'People';
      crumbPage.textContent = rec ? 'Edit User' : 'Add User';
      view.innerHTML = '';
      view.appendChild(userForm(rec));
      window.scrollTo(0, 0);
      document.body.classList.remove('side-open');
      return;
    }

    var key = raw;
    if (!PAGES[key]) key = 'dashboard';
    var NAV_ALIAS = { profile: 'settings', password: 'settings',
                      'settings-audio': 'settings', 'settings-mail': 'settings',
                      terms: 'pages', privacy: 'pages' };
    var navKey = NAV_ALIAS[key] || key;
    document.querySelectorAll('.side-nav a').forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('href') === '#/' + navKey);
    });
    crumbPage.textContent = TITLES[key] || 'Dashboard';
    crumbRoot.textContent = GROUP[key] || 'Overview';
    view.innerHTML = '';
    view.appendChild(PAGES[key]());
    window.scrollTo(0, 0);
    document.body.classList.remove('side-open');
  }
  window.addEventListener('hashchange', route);

  /* ==========================================================================
     Chrome
     ========================================================================== */
  document.getElementById('sideCollapse').addEventListener('click', function () {
    document.body.classList.toggle('side-min');
  });
  document.getElementById('menuBtn').addEventListener('click', function () {
    document.body.classList.toggle('side-open');
  });
  document.getElementById('sideScrim').addEventListener('click', function () {
    document.body.classList.remove('side-open');
  });

  // theme — light is the default
  var themeBtn = document.getElementById('themeBtn');
  var saved = null;
  try { saved = localStorage.getItem('vw-theme'); } catch (e) {}
  document.documentElement.setAttribute('data-theme', saved || 'light');
  themeBtn.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('vw-theme', next); } catch (e) {}
    toast(next === 'dark' ? 'Dark theme' : 'Light theme');
  });

  var bellPop = document.getElementById('bellPop');
  document.getElementById('bellList').innerHTML = D.activity.slice(0, 5).map(function (a) {
    return '<div class="pop-item"><span>' + a.icon + '</span><div>' + esc(a.text) + '<small>' + esc(a.time) + '</small></div></div>';
  }).join('');
  document.getElementById('bellBtn').addEventListener('click', function (e) {
    e.stopPropagation(); bellPop.hidden = !bellPop.hidden;
  });
  document.addEventListener('click', function () { bellPop.hidden = true; });
  bellPop.addEventListener('click', function (e) { e.stopPropagation(); });

  refreshCounts();
  paintIdentity();

  /* ---- account dropdown ---- */
  var acctPop = document.getElementById('acctPop');
  var whoBtn = document.getElementById('whoBtn');
  whoBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    acctPop.hidden = !acctPop.hidden;
    whoBtn.setAttribute('aria-expanded', String(!acctPop.hidden));
  });
  acctPop.addEventListener('click', function () {
    acctPop.hidden = true;
    whoBtn.setAttribute('aria-expanded', 'false');
  });
  document.addEventListener('click', function () {
    acctPop.hidden = true;
    whoBtn.setAttribute('aria-expanded', 'false');
  });

  /* ---- command palette ---- */
  var cmdk = document.getElementById('cmdk');
  var cmdkInput = document.getElementById('cmdkInput');
  var cmdkList = document.getElementById('cmdkList');
  var COMMANDS = Object.keys(TITLES).map(function (k) {
    return { label: TITLES[k], hint: GROUP[k] || 'Overview', go: '#/' + k };
  });
  function paintCmd(q) {
    var list = COMMANDS.filter(function (c) {
      return !q || (c.label + ' ' + c.hint).toLowerCase().indexOf(q.toLowerCase()) > -1;
    });
    cmdkList.innerHTML = list.length ? list.map(function (c, i) {
      return '<div class="cmdk-item' + (i === 0 ? ' sel' : '') + '" data-go="' + c.go + '"><span>›</span>' +
        esc(c.label) + '<small>' + esc(c.hint) + '</small></div>';
    }).join('') : '<div class="empty" style="padding:2rem"><div>🔍</div>No matches</div>';
    cmdkList.querySelectorAll('.cmdk-item').forEach(function (it) {
      it.addEventListener('click', function () { location.hash = it.dataset.go; closeCmd(); });
    });
  }
  function openCmd() { cmdk.hidden = false; cmdkInput.value = ''; paintCmd(''); cmdkInput.focus(); }
  function closeCmd() { cmdk.hidden = true; }
  document.getElementById('searchBtn').addEventListener('click', openCmd);
  cmdkInput.addEventListener('input', function () { paintCmd(cmdkInput.value); });
  cmdk.addEventListener('click', function (e) { if (e.target === cmdk) closeCmd(); });

  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmd(); return; }
    if (e.key === 'Escape') closeCmd();
    if (!cmdk.hidden && e.key === 'Enter') {
      var sel = cmdkList.querySelector('.cmdk-item.sel') || cmdkList.querySelector('.cmdk-item');
      if (sel) { location.hash = sel.dataset.go; closeCmd(); }
    }
    if (!cmdk.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      var items = Array.prototype.slice.call(cmdkList.querySelectorAll('.cmdk-item'));
      if (!items.length) return;
      var idx = items.findIndex(function (i) { return i.classList.contains('sel'); });
      items.forEach(function (i) { i.classList.remove('sel'); });
      idx = (idx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      items[idx].classList.add('sel');
      items[idx].scrollIntoView({ block: 'nearest' });
    }
  });

  document.querySelectorAll('[data-yr]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  route();
})();
