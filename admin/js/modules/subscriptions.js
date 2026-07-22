/* ==========================================================================
   VasthuWalk Admin — Subscriptions module
   Modal-based create/edit with searchable User + Package dropdowns.
   Registers: pages.subscriptions
   ========================================================================== */
(function () {
  'use strict';

  window.VW_MODULES = window.VW_MODULES || [];

  window.VW_MODULES.push(function (ui, D) {

    /* keep the searchable-select popup from being clipped by the scrolling
       modal body, and give the required-field markers the right tone */
    ui.injectCSS('vw-subs-css',
      '#fmBody:has(.sub-form .ss.open){overflow:visible;}' +
      '.sub-form .ss-list{max-height:190px;}' +
      '.sub-form .fld i{color:var(--bad);font-style:normal;}' +
      '.sub-form input[readonly]{opacity:.8;cursor:default;}'
    );

    var PAY = ['razorpay', 'by cash'];
    var YN = ['Active', 'Inactive'];

    function esc(s) { return ui.esc(s); }

    function optionsHTML(list, value) {
      return list.map(function (o) {
        return '<option' + (String(o) === String(value) ? ' selected' : '') + '>' + esc(o) + '</option>';
      }).join('');
    }

    function priceOf(pkgName) {
      var p = D.packages.filter(function (x) { return x.name === pkgName; })[0];
      return p ? Number(p.price) : 0;
    }

    /* ---- mark / clear validation on a searchable select ---- */
    function markSelect(id, msg) {
      var root = document.getElementById(id);
      if (!root) return;
      root.classList.toggle('bad', !!msg);
      var box = root.closest('.fld');
      var err = box ? box.querySelector('.fld-err') : null;
      if (err) err.textContent = msg || '';
    }

    /* ==========================================================================
       Add / Edit Subscription (modal)
       ========================================================================== */
    function openForm(rec, onDone) {
      var isEdit = !!rec;
      var userNames = D.users.map(function (u) { return u.name; });
      var pkgNames = D.packages.map(function (p) { return p.name; });

      ui.openModal(isEdit ? 'Edit Subscription' : 'Add New',
        '<div class="fm-fields sub-form">' +
          '<div class="fld"><label>User <i>*</i></label>' +
            ui.selectHTML('sub_user', userNames, rec && rec.user, 'Select User') +
            '<span class="fld-err"></span></div>' +

          '<div class="fld"><label>Package <i>*</i></label>' +
            ui.selectHTML('sub_pkg', pkgNames, rec && rec.package, 'Select Package') +
            '<span class="fld-err"></span></div>' +

          '<div class="fld"><label for="sub_pay">Payment Type</label>' +
            '<select id="sub_pay">' + optionsHTML(PAY, rec && rec.pay) + '</select>' +
            '<span class="fld-err"></span></div>' +

          '<div class="fld"><label for="sub_start">Start Date</label>' +
            '<input id="sub_start" type="date" value="' + esc((rec && rec.start) || '') + '">' +
            '<span class="fld-err"></span></div>' +

          '<div class="fld"><label for="sub_status">Status</label>' +
            '<select id="sub_status">' + optionsHTML(YN, (rec && rec.status) || 'Active') + '</select>' +
            '<span class="fld-err"></span></div>' +

          '<div class="fld"><label for="sub_amount">Amount</label>' +
            '<input id="sub_amount" type="text" readonly value="' +
              esc(rec ? ui.inr(rec.amount) : '—') + '">' +
            '<span class="fld-err"></span></div>' +
        '</div>',
        '<button class="btn btn-line" id="subCancel">Cancel</button>' +
        '<button class="btn btn-gold" id="subSave">Save</button>');

      ui.initSelect('sub_user');
      ui.initSelect('sub_pkg');

      /* auto-fill amount from the chosen package price */
      var amountEl = document.getElementById('sub_amount');
      var pkgRoot = document.getElementById('sub_pkg');
      pkgRoot.querySelectorAll('.ss-opt').forEach(function (o) {
        o.addEventListener('click', function () {
          var pr = priceOf(o.dataset.v);
          amountEl.value = pr ? ui.inr(pr) : '—';
        });
      });

      document.getElementById('subCancel').addEventListener('click', ui.closeModal);

      document.getElementById('subSave').addEventListener('click', function () {
        var user = ui.selectValue('sub_user');
        var pkg = ui.selectValue('sub_pkg');
        var ok = true;

        if (!user) { markSelect('sub_user', 'User is required.'); ok = false; }
        else markSelect('sub_user', '');
        if (!pkg) { markSelect('sub_pkg', 'Package is required.'); ok = false; }
        else markSelect('sub_pkg', '');

        if (!ok) { ui.toast('Please fix the highlighted fields'); return; }

        var start = document.getElementById('sub_start').value || ui.today();
        var vals = {
          user: user,
          package: pkg,
          amount: priceOf(pkg),
          pay: document.getElementById('sub_pay').value,
          start: start,
          status: document.getElementById('sub_status').value
        };

        if (isEdit) {
          Object.assign(rec, vals);
          ui.toast('Subscription updated');
        } else {
          vals.id = D.subscriptions.reduce(function (m, r) {
            return Math.max(m, Number(r.id) || 0);
          }, 0) + 1;
          vals.end = '';
          D.subscriptions.unshift(vals);
          ui.toast('Subscription created');
        }

        ui.closeModal();
        if (onDone) onDone();
      });
    }

    /* ==========================================================================
       List page
       ========================================================================== */
    function subscriptionsPage() {
      var f = document.createDocumentFragment();
      f.appendChild(ui.el(ui.head('Subscriptions', D.subscriptions.length + ' subscription records')));

      f.appendChild(ui.dataTable({
        name: 'Subscriptions',
        singular: 'Subscription',
        addLabel: 'Add New',
        rows: D.subscriptions,
        filters: ['Active', 'Inactive'],
        filterKey: 'status',
        searchKeys: ['user', 'package', 'pay'],
        titleKey: 'user',
        cols: [
          ui.C.id,
          { key: 'user', label: 'User' },
          { key: 'package', label: 'Package' },
          { key: 'amount', label: 'Amount', render: function (r) {
              return '<span class="mono">' + ui.inr(r.amount) + '</span>'; } },
          { key: 'pay', label: 'Payment' },
          { key: 'start', label: 'Start', render: function (r) {
              return '<span class="mono">' + esc(r.start) + '</span>'; } },
          { key: 'status', label: 'Status', render: function (r) { return ui.badge(r.status); } }
        ],
        onCreate: function (refresh) { openForm(null, refresh); },
        onEdit: function (rec, refresh) { openForm(rec, refresh); }
      }));

      return f;
    }

    return { pages: { subscriptions: subscriptionsPage } };
  });
})();
