/* VasthuWalk — shared social links.
   URLs mirror the values stored in the admin Settings panel.
   Replace the base domains with your real profile URLs when they go live. */
(function () {
  'use strict';

  var CONTACT = {
    email: 'vasthuwalk@gmail.com',
    phone: '7788849994'
  };

  var LINKS = [
    { name: 'Facebook',  url: 'https://www.facebook.com/',  cls: 'fb',
      path: '<path d="M14 9h3V6h-3c-2.2 0-4 1.8-4 4v2H8v3h2v7h3v-7h2.5l.5-3H13v-2c0-.6.4-1 1-1z"/>' },
    { name: 'Instagram', url: 'https://www.instagram.com/', cls: 'ig',
      path: '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.3"/>' },
    { name: 'X',         url: 'https://www.x.com/',         cls: 'x',
      path: '<path d="M17.5 3h3l-6.6 7.5L21.7 21h-6l-4.7-6.1L5.6 21h-3l7-8-7.3-10h6.1l4.3 5.7L17.5 3zm-1.1 16h1.7L7.7 4.8H5.9L16.4 19z"/>' },
    { name: 'YouTube',   url: 'https://www.youtube.com/',   cls: 'yt',
      path: '<path d="M21.6 7.2s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-.9C16 4.1 12 4.1 12 4.1s-4 0-6.8.2c-.4.1-1.3.1-2 .9-.6.6-.8 2-.8 2S2.2 8.8 2.2 10.5v1.6c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.7.8 1.7.8 2.1.9 1.6.1 6.7.2 6.7.2s4 0 6.8-.2c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.6.2-3.3v-1.6c0-1.7-.2-3.3-.2-3.3zM10 14.6V8.9l5.2 2.9-5.2 2.8z"/>' },
    { name: 'LinkedIn',  url: 'https://www.linkedin.com/',  cls: 'li',
      path: '<path d="M6.9 8.5H4V20h2.9V8.5zM5.4 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM20 13.4c0-3-1.6-4.4-3.7-4.4-1.7 0-2.5.9-2.9 1.6V8.5H10.5c0 .8 0 11.5 0 11.5h2.9v-6.4c0-.3 0-.7.1-.9.3-.7.9-1.4 1.9-1.4 1.3 0 1.8 1 1.8 2.5V20H20v-6.6z"/>' },
    { name: 'WhatsApp',  url: 'https://wa.me/91' + CONTACT.phone, cls: 'wa',
      path: '<path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.2 8.2 0 1 1 7.2 3.9zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.7.9c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.1-.2 0-.4.1-.5l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.2.2-.6.2-1.1.1-1.2l-.6-.3z"/>' }
  ];

  function markup(link) {
    return '<a class="s-ico ' + link.cls + '" href="' + link.url + '" target="_blank" rel="noopener noreferrer" aria-label="' + link.name + '">' +
           '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' + link.path + '</svg></a>';
  }

  var html = LINKS.map(markup).join('');
  document.querySelectorAll('[data-social]').forEach(function (el) { el.innerHTML = html; });

  // expose for other scripts
  window.VW_CONTACT = CONTACT;

  // let the content layer replace the social URLs from managed settings
  window.VW_SOCIAL_OVERRIDE = function (social) {
    if (!social) return;
    var map = { fb: 'facebook', ig: 'instagram', x: 'x', yt: 'youtube', li: 'linkedin' };
    document.querySelectorAll('.s-ico').forEach(function (a) {
      Object.keys(map).forEach(function (cls) {
        if (a.classList.contains(cls) && social[map[cls]]) a.href = social[map[cls]];
      });
    });
  };

  // fill any year placeholders
  document.querySelectorAll('[data-yr]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
