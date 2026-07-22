# VasthuWalk — Website Content API

The public website no longer hardcodes its content. `js/content.js` fetches these
resources and renders the pricing cards, gallery tiles, legal pages and contact details.

## Resolution order

For each resource `content.js` tries, in order:

1. **Local bridge** — `localStorage['vw-content-<key>']`, written by the admin portal.
   Demo only; set `BRIDGE: false` in `js/content.js` for production.
2. **API** — `GET <API_BASE>/<key>.json`
3. **Static fallback** — the markup already in the page. **A failed request never
   blanks the site**; it just keeps what is already rendered.

Point it at your backend by editing the top of `js/content.js`:

```js
var CFG = {
  API_BASE: 'https://www.vasthuwalk.com/api',
  BRIDGE: false
};
```

## Endpoints to implement in Laravel

All are **read-only GET**, return `application/json`, and must allow CORS from the
website's origin (`Access-Control-Allow-Origin`). Envelope:

```json
{ "updated": "2026-07-23", "data": [ ... ] }
```

| Endpoint | Drives | Source table |
|---|---|---|
| `GET /api/packages.json` | Pricing cards | `packages` |
| `GET /api/offer-videos.json` | Gallery video tiles | `offer_videos` |
| `GET /api/products.json` | Gallery product tiles | `products` |
| `GET /api/banners.json` | Gallery banner tiles | `banner_sliders` |
| `GET /api/pages.json` | `terms.html`, `privacy.html` | `pages` |
| `GET /api/settings.json` | Footer contact + social links | `settings` |

### Shapes

```jsonc
// packages.json  — only status:"Active" is shown; sorted by price
{ "id": 1, "name": "Business Plan", "price": 499, "duration": 6, "unit": "Monthly", "status": "Active" }

// offer-videos.json — src/poster are URLs or site-relative paths
{ "id": 1, "title": "Gold Coin Offer", "length": "0:31", "status": "Active",
  "src": "assets/gallery/videos/offer-gold-coin.mp4",
  "poster": "assets/gallery/videos/offer-gold-coin.jpg" }

// products.json — items without an image are skipped
{ "id": 2, "title": "சிரிக்கும் குபேரன்", "price": 475, "category": "Statues",
  "status": "Active", "image": "assets/gallery/shots/product-1.jpg" }

// banners.json — items without an image are skipped
{ "id": 1, "title": "Grah Pravesh", "url": "https://vasthuwalk.com/",
  "status": "Active", "image": "" }

// pages.json — matched to the page by slug; body is HTML
{ "id": 1, "title": "Terms and Condition", "slug": "term-condition",
  "status": "Published", "updated": "2026-07-22", "body": "<ul><li>…</li></ul>" }

// settings.json — an object, not an array
{ "contact_email": "vasthuwalk@gmail.com", "contact_number": "7788849994",
  "play_store": "https://play.google.com/store/apps/details?id=com.vasthuwalk.app",
  "social": { "facebook": "…", "instagram": "…", "x": "…", "youtube": "…", "linkedin": "…" } }
```

### Rules the renderer applies

- Anything with `status: "Inactive"` is **hidden** from the site.
- Products and banners **without an `image`** are skipped (nothing to display).
- Gallery filter tabs with no matching tiles are **removed automatically**.
- Tiles marked `data-type="screen"` in the HTML (the app-screen shots) are **not
  admin-managed** and are always preserved.
- `pages.json` bodies are injected as HTML — **sanitise on the server**, since this
  content comes from a rich-text editor.

## Regenerating the stub files

```bash
node deck_build/gen_api.js     # rebuilds website/api/*.json from the admin dataset
```

## The admin bridge (demo)

`admin/js/modules/publish.js` mirrors the admin dataset into `localStorage` under
`vw-content-*` on every change (debounced), plus a manual **Publish** button in the
topbar. Because the admin and the site share an origin, the site picks the edits up on
its next load. **This is a demo mechanism only** — in production the admin saves to the
database and the site reads the API above.
