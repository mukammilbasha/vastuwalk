/* ==========================================================================
   VasthuWalk Admin — sample dataset
   NOTE: all customer records below are ANONYMIZED SAMPLE DATA for this UI
   prototype. No real customer names, emails, phone numbers or payment IDs.
   ========================================================================== */
window.VW = (function () {
  'use strict';

  /* aggregate business figures (non-personal) */
  var KPI = {
    revenue: 709401,
    payments: 134,
    users: 68,
    orders: 118,
    activeSubs: 12,
    products: 6
  };

  var FIRST = ['Arun', 'Meena', 'Karthik', 'Priya', 'Suresh', 'Divya', 'Ganesh', 'Lakshmi',
               'Raja', 'Anitha', 'Vimal', 'Kavya', 'Mohan', 'Revathi', 'Senthil', 'Nithya',
               'Bala', 'Deepa', 'Ravi', 'Shanti'];
  var LAST = ['K', 'R', 'M', 'S', 'V', 'P', 'N', 'T', 'G', 'D'];
  var CITY = ['Chennai', 'Madurai', 'Coimbatore', 'Trichy', 'Salem', 'Erode', 'Tirunelveli', 'Vellore'];

  function name(i) { return FIRST[i % FIRST.length] + ' ' + LAST[i % LAST.length]; }
  function mail(i) { return 'user' + (100 + i) + '@example.com'; }
  function phone(i) { return '+91 9' + String(100000000 + i * 7654321).slice(0, 9); }
  function date(i, base) {
    var d = new Date(base || '2026-07-20');
    d.setDate(d.getDate() - i * 2);
    return d.toISOString().slice(0, 10);
  }

  /* ---------------- users ---------------- */
  var GENDER = ['Male', 'Female', 'Other'];
  var USER_STATUS = ['Active', 'Inactive', 'Pending', 'Banned'];
  var users = [];
  for (var i = 0; i < 68; i++) {
    var fn = FIRST[i % FIRST.length];
    var ln = LAST[i % LAST.length];
    var st = i % 11 === 0 ? 'Pending' : (i % 17 === 0 ? 'Banned' : (i % 9 === 0 ? 'Inactive' : 'Active'));
    users.push({
      id: 101 - i,
      firstName: fn,
      lastName: ln,
      name: fn + ' ' + ln,
      email: mail(i),
      username: (fn + ln).toLowerCase() + (100 + i),
      phone: String(9000000000 + i * 76543).slice(0, 10),
      gender: GENDER[i % GENDER.length],
      city: CITY[i % CITY.length],
      avatar: '',
      status: st,
      created: date(i),
      updated: date(i)
    });
  }

  /* ---------------- packages ---------------- */
  var packages = [
    { id: 1, name: 'Business Plan', duration: 6, unit: 'Monthly', price: 499, status: 'Active', created: '2026-03-17' },
    { id: 2, name: 'Personal Plan', duration: 12, unit: 'Hrs', price: 204, status: 'Active', created: '2026-03-17' }
  ];

  /* ---------------- subscriptions ---------------- */
  var PAY = ['razorpay', 'by cash'];
  var subscriptions = [];
  for (i = 0; i < 83; i++) {
    var isBiz = i % 7 === 0;
    subscriptions.push({
      id: 83 - i,
      user: name(i),
      package: isBiz ? 'Business Plan' : 'Personal Plan',
      amount: isBiz ? 499 : (i % 3 === 0 ? 204 : 196),
      pay: PAY[i % 2],
      start: date(i),
      end: date(i - 1),
      status: i < 12 ? 'Active' : 'Inactive'
    });
  }

  /* ---------------- subscription attempts ---------------- */
  var attempts = [];
  for (i = 0; i < 24; i++) {
    attempts.push({
      id: 24 - i,
      user: name(i + 3),
      package: i % 5 === 0 ? 'Business Plan' : 'Personal Plan',
      amount: i % 5 === 0 ? 499 : 196,
      result: i % 4 === 0 ? 'Failed' : 'Success',
      date: date(i)
    });
  }

  /* ---------------- products ---------------- */
  function pdesc(t, b) {
    return '<p><strong>' + t + '</strong></p><p>' + b + '</p>' +
           '<ul><li>Authentic, hand-finished</li><li>Ships across India</li></ul>';
  }
  var products = [
    { id: 1, title: 'Mystery Ring', category: 'Rings', price: 1000, status: 'Inactive', image: '',
      description: pdesc('Mystery Ring', 'A finely crafted ring said to attract steady fortune.'), created: '2026-03-20' },
    { id: 2, title: 'சிரிக்கும் குபேரன்', category: 'Statues', price: 475, status: 'Active', image: '',
      description: pdesc('Laughing Kubera', 'Placed facing the entrance to invite prosperity.'), created: '2026-03-18' },
    { id: 3, title: '7 ஓடும் குதிரைகள் ரெசின் சிலை', category: 'Statues', price: 2870, status: 'Active', image: '',
      description: pdesc('Seven Running Horses', 'Symbol of victory, growth and forward momentum.'), created: '2026-03-18' },
    { id: 4, title: 'கச்சவா யந்திரம் செம்பு ஆமை', category: 'Statues', price: 250, status: 'Active', image: '',
      description: pdesc('Copper Kachhua Yantra', 'Tortoise yantra for stability and long life.'), created: '2026-03-18' },
    { id: 5, title: 'அதிர்ஷ்டமான மூங்கில் செடி', category: 'Plant', price: 290, status: 'Active', image: '',
      description: pdesc('Lucky Bamboo (23–25 cm)', 'A living plant for the East corner.'), created: '2026-03-18' },
    { id: 6, title: 'நலம் தரும் வாஸ்து செடிகள்', category: 'Plant', price: 1199, status: 'Active', image: '',
      description: pdesc('Wellbeing Vasthu Plants', 'A curated set of plants for household harmony.'), created: '2026-03-17' }
  ];

  var categories = [
    { id: 1, name: 'Statues', products: 3, image: '', status: 'Active', created: '2026-03-17' },
    { id: 2, name: 'Plant', products: 2, image: '', status: 'Active', created: '2026-03-17' },
    { id: 3, name: 'Rings', products: 1, image: '', status: 'Active', created: '2026-03-18' }
  ];

  /* ---------------- orders ---------------- */
  var STATUS = ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Rejected'];
  var WEIGHT = [0.40, 0.18, 0.14, 0.22, 0.06];
  var orders = [];
  function pickStatus(i) {
    var r = (i * 37 % 100) / 100, acc = 0;
    for (var k = 0; k < STATUS.length; k++) { acc += WEIGHT[k]; if (r < acc) return STATUS[k]; }
    return 'Pending';
  }
  for (i = 0; i < 118; i++) {
    var pr = products[i % products.length];
    orders.push({
      id: '#ORD-' + (1000 + i * 7).toString(36).toUpperCase().padStart(6, '0'),
      user: name(i),
      email: mail(i),
      phone: phone(i),
      city: CITY[i % CITY.length],
      item: pr.title,
      amount: pr.price,
      status: pickStatus(i),
      date: date(i % 40)
    });
  }

  /* ---------------- transactions ---------------- */
  var transactions = [];
  for (i = 0; i < 134; i++) {
    transactions.push({
      id: 134 - i,
      ref: 'pay_SAMPLE' + String(100000 + i * 137).slice(0, 6),
      user: name(i),
      amount: [196, 204, 499, 250, 290, 475][i % 6],
      method: PAY[i % 2],
      status: i % 17 === 0 ? 'Refunded' : 'Success',
      date: date(i % 45)
    });
  }

  /* ---------------- housewarming ---------------- */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];
  var NAKSHATRA = ['Rohini', 'Mrigashira', 'Uttara', 'Hasta', 'Swati', 'Anuradha'];

  var grah = [];
  for (i = 0; i < 18; i++) {
    grah.push({
      id: 18 - i,
      date: '2026-' + String((i % 12) + 1).padStart(2, '0') + '-' + String(3 + (i % 25)).padStart(2, '0'),
      time: String(6 + (i % 6)).padStart(2, '0') + ':' + (i % 2 ? '30' : '00'),
      description: '<p><strong>' + NAKSHATRA[i % NAKSHATRA.length] + ' nakshatra</strong> — an auspicious ' +
                   'window for Grah Pravesh.</p><ul><li>Enter the house facing East</li>' +
                   '<li>Boil milk in the new kitchen first</li></ul>',
      status: 'Active',
      created: date(i)
    });
  }

  var vasthuDates = [];
  for (i = 0; i < 14; i++) {
    vasthuDates.push({
      id: 14 - i,
      date: '2026-' + String((i % 12) + 1).padStart(2, '0') + '-' + String(5 + (i % 22)).padStart(2, '0'),
      time: String(7 + (i % 4)).padStart(2, '0') + ':' + (i % 2 ? '15' : '45'),
      description: '<p>வாஸ்து நாள் — ' + ['Auspicious full day', 'Morning only', 'Evening only'][i % 3] +
                   '.</p><p>Suitable for laying the foundation and entering a new property.</p>',
      status: 'Active',
      created: date(i)
    });
  }

  /* ---------------- media ---------------- */
  var banners = [
    { id: 1, title: 'Grah Pravesh2', url: 'https://vasthuwalk.com/', status: 'Active', created: '2026-04-09' },
    { id: 2, title: 'Grah Praves', url: 'https://vasthuwalk.com/', status: 'Active', created: '2026-03-18' },
    { id: 3, title: 'Vaasthu Home', url: 'https://vasthuwalk.com/', status: 'Active', created: '2026-03-18' },
    { id: 4, title: 'Vaasthu Compass', url: 'https://vasthuwalk.com/', status: 'Active', created: '2026-03-18' }
  ];

  var videos = [
    { id: 1, title: 'Gold Coin Offer', file: 'offer-gold-coin.mp4', length: '0:31', status: 'Active', created: '2026-07-18',
      src: '../assets/gallery/videos/offer-gold-coin.mp4', poster: '../assets/gallery/videos/offer-gold-coin.jpg' },
    { id: 2, title: 'Festive Promotion', file: 'offer1.mp4', length: '0:10', status: 'Active', created: '2026-06-30',
      src: '../assets/gallery/videos/offer1.mp4', poster: '../assets/gallery/videos/offer1.jpg' }
  ];

  var pages = [
    { id: 1, title: 'Terms and Condition', slug: 'term-condition', updated: '2026-07-12', status: 'Published' },
    { id: 2, title: 'Privacy Policy', slug: 'privacy-policy', updated: '2026-07-12', status: 'Published' },
    { id: 3, title: 'About Us', slug: 'about-us', updated: '2026-05-02', status: 'Draft' }
  ];

  /* ---------------- signed-in admin ---------------- */
  var admin = {
    firstName: 'VasthuWalk',
    lastName: 'Admin',
    username: 'VasthuWalkadmin',
    email: 'admin@vasthu.com',
    phone: '7788849994',
    role: 'Administrator',
    avatar: ''
  };

  /* ---------------- chart series ---------------- */
  var revenueSeries = [
    { m: 'Feb', v: 42000 }, { m: 'Mar', v: 86500 }, { m: 'Apr', v: 118200 },
    { m: 'May', v: 132400 }, { m: 'Jun', v: 158900 }, { m: 'Jul', v: 171401 }
  ];
  var userSeries = [
    { m: 'Feb', v: 6 }, { m: 'Mar', v: 14 }, { m: 'Apr', v: 27 },
    { m: 'May', v: 41 }, { m: 'Jun', v: 56 }, { m: 'Jul', v: 68 }
  ];

  var activity = [
    { icon: '💳', text: 'Subscription payment received — Personal Plan', time: '12 min ago', tone: 'ok' },
    { icon: '📦', text: 'Order marked as Dispatched', time: '48 min ago', tone: 'info' },
    { icon: '👤', text: 'New user registered', time: '2 hrs ago', tone: 'ok' },
    { icon: '🎬', text: 'Offer video published — Gold Coin Offer', time: '5 hrs ago', tone: 'info' },
    { icon: '🪔', text: 'Grah Pravesh dates updated for August', time: 'Yesterday', tone: 'info' },
    { icon: '⚠️', text: 'Payment attempt failed — retry pending', time: 'Yesterday', tone: 'warn' }
  ];

  return {
    KPI: KPI, users: users, packages: packages, subscriptions: subscriptions,
    attempts: attempts, products: products, categories: categories, orders: orders,
    transactions: transactions, grah: grah, vasthuDates: vasthuDates,
    banners: banners, videos: videos, pages: pages, admin: admin,
    revenueSeries: revenueSeries, userSeries: userSeries, activity: activity,
    ORDER_STATUS: STATUS, USER_STATUS: USER_STATUS, GENDER: GENDER
  };
})();
