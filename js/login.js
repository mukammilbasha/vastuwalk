/* VasthuWalk — login page: password reveal + client-side validation.
   Authentication itself is intentionally server-side. See README. */
(function () {
  'use strict';

  var form = document.getElementById('loginForm');
  var email = document.getElementById('email');
  var pass = document.getElementById('password');
  var peek = document.getElementById('peek');

  /* ---- show / hide password ---- */
  peek.addEventListener('click', function () {
    var shown = pass.type === 'text';
    pass.type = shown ? 'password' : 'text';
    peek.classList.toggle('on', !shown);
    peek.setAttribute('aria-label', shown ? 'Show password' : 'Hide password');
    pass.focus();
  });

  /* ---- inline validation ---- */
  function setErr(input, msg) {
    var el = document.querySelector('.err[data-for="' + input.id + '"]');
    if (el) el.textContent = msg || '';
    input.closest('.input-wrap').classList.toggle('invalid', !!msg);
    return !msg;
  }

  function checkEmail() {
    var v = email.value.trim();
    if (!v) return setErr(email, 'Email is required.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return setErr(email, 'Enter a valid email address.');
    return setErr(email, '');
  }

  function checkPass() {
    if (!pass.value) return setErr(pass, 'Password is required.');
    return setErr(pass, '');
  }

  email.addEventListener('blur', checkEmail);
  pass.addEventListener('blur', checkPass);
  email.addEventListener('input', function () { if (email.value) setErr(email, ''); });
  pass.addEventListener('input', function () { if (pass.value) setErr(pass, ''); });

  form.addEventListener('submit', function (e) {
    var ok = checkEmail() & checkPass();
    if (!ok) {
      e.preventDefault();
      (email.value ? pass : email).focus();
      return;
    }
    // prototype: never put credentials in the URL — navigate directly
    e.preventDefault();
    form.classList.add('sending');
    setTimeout(function () { window.location.href = 'admin/index.html'; }, 450);
  });
})();
