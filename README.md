# VasthuWalk — Marketing Website

A modern, responsive, production-ready marketing site for VasthuWalk, built from the
investor pitch deck narrative and the live product screenshots.

## Structure

```
website/
├── index.html              # marketing site (all sections)
├── login.html              # admin login page
├── terms.html              # public Terms & Conditions
├── privacy.html            # public Privacy Policy
├── css/
│   ├── styles.css          # design system + responsive layout
│   ├── login.css           # login page + shared social-icon styles
│   ├── gallery.css         # gallery grid + lightbox
│   └── legal.css           # terms / privacy pages
├── js/
│   ├── main.js             # sticky header, mobile menu, reveal, FAQ accordion
│   ├── social.js           # shared social links + contact details
│   ├── gallery.js          # gallery filtering + image/video lightbox
│   └── login.js            # password reveal + inline validation
├── assets/
│   ├── img/
│   │   ├── logo.png        # VasthuWalk logo
│   │   └── phones/         # mobile app screens in phone mockups
│   └── gallery/
│       ├── videos/         # offer campaign videos + poster frames
│       └── shots/          # app screens used in the gallery
└── admin/                  # admin portal prototype
    ├── index.html          # shell (sidebar, topbar, palette, toasts)
    ├── css/admin.css       # admin design system (light + dark)
    └── js/
        ├── data.js         # ANONYMIZED sample dataset
        ├── admin.js        # core: router, table engine, charts, UI API
        └── modules/        # feature modules (self-registering)
            ├── packages.js      ├── videos.js
            ├── subscriptions.js ├── pages.js
            ├── banners.js       └── settings.js
```

### Plugin architecture

`admin.js` exposes a `UI` API and a module registry, so each feature lives in its own
file and cannot collide with the others:

```js
window.VW_MODULES.push(function (ui, D) {
  return {
    pages:  { mymodule: function () { /* DocumentFragment */ } },
    routes: [{ pre: 'mymodule', store: 'mymodule', build: function (rec) { … } }],
    titles: { … }, groups: { … }
  };
});
```

`ui` provides `dataTable`, `openModal`, `openDrawer`, `confirmDelete`,
`rteHTML/initRTE/rteValue`, `selectHTML/initSelect/selectValue`,
`imageHTML/initImage`, `toggleHTML`, `badge`, `toast`, `injectCSS`, `go` and more.
Declaring `routes` automatically gives a module `#/<name>/new` and `#/<name>/edit/<id>`.

## Admin portal (`admin/`)

Reached from `login.html`. A single-page prototype covering **all 15 modules** of the
live system, with hash routing (`#/users`, `#/orders`, …).

**Modules:** Dashboard · Users · Grah Pravesh · Vasthu Dates · Products · Categories ·
Orders · Packages · Subscriptions · Subscription Attempts · Transactions ·
Banner Slider · Offer Videos · Pages · Settings

**Advanced features**

| Feature | Notes |
|---|---|
| **Full CRUD** | Create / Read / Update / Delete on 10 modules — see below |
| Slide-over drawer | Create & edit forms, plus a read-only detail view |
| Form validation | Required fields, email + number checks, inline error messages |
| Confirm dialog | Delete asks first and names the record |
| Analytics dashboard | 6 KPI cards, revenue bar chart, orders donut, user-growth sparkline, activity feed |
| Command palette | `Ctrl/⌘ + K`, arrow keys + Enter to jump to any module |
| Data tables | Per-column sort, live search, status filter chips, pagination |
| CSV export | Exports the current filtered view |
| Light / dark theme | **Light is the default**; toggle persists to `localStorage` |
| Sidebar icons | Custom line-art SVG per module |
| Collapsible sidebar | Full ↔ icon rail; slide-out drawer on mobile |
| Notifications | Dropdown panel with recent activity |
| Toasts | Feedback on every action |
| Video management | Real offer videos play inline; edit & delete supported |
| Responsive | Verified 1440 / 1280 / 1024 / 820 / 390 / 360 |

### User management (`#/users`)

Rebuilt to mirror the live admin's **Add User** screen:

- **Dedicated full-page form** at `#/users/new` and `#/users/edit/<id>` (not a drawer)
- **Left card** — avatar upload with live preview (`.png .jpg .jpeg .gif` only) and a
  **Status radio group**: Active · Inactive · Pending · Banned
- **Right card** — "Add User information": First Name, Last Name, Email, Username,
  Password, Phone Number (with a `+91` prefix, 10-digit check), Gender, City
- **Back / Cancel / Save** buttons in the same positions as the live screen
- On edit, the password field shows *"Leave blank to keep current"*
- List view shows an avatar chip, `@username`, `+91` phone, gender and status badge

### Packages · Subscriptions · Banners · Videos · Pages · Settings

Built as independent modules, each matching its live screen:

| Module | Form style | Notable |
|---|---|---|
| **Packages** | Full page + Back | Name · Duration Unit · Duration · Price (₹) · **audio drag-and-drop** with `<audio>` preview · Status · Description textarea |
| **Subscriptions** | "Add New" **modal** | Searchable **User** and **Package** dropdowns; picking a package auto-fills the amount |
| **Banner Slider** | Full page + Back | Title · Status · URL · Image; working status toggles in the list |
| **Offer Videos** | **Modal** | Title · rich-text Description · video upload with inline preview and auto-detected duration |
| **Pages** | Full page + Back | List CRUD **plus** dedicated `#/terms` and `#/privacy` editors seeded with the real Tamil policy text |
| **Settings** | Three tabs | **General** (5 logo slots + site + social URLs) · **App Launch Audio** (player + dashed drop zone) · **Mail** (SMTP settings) |

### Products / Product Categories

Both are **full-page forms** matching the live admin:

- **Add / Edit Product** (`#/products/new`, `#/products/edit/<id>`) —
  Title\* · Price\* · **Product category\*** (searchable dropdown with a filter box) ·
  Status\* · **Description** (rich-text editor with alignment + indent tools) ·
  **Image** (file picker with thumbnail preview), **Back** top-right, Cancel / Save.
- **Add / Edit Product category** (`#/categories/new`, `#/categories/edit/<id>`) —
  Title\* · Image, **Back** top-right, Cancel / Save. Rejects duplicate names.

Extras beyond the live screens:

- **Status toggle switch** directly in both list tables — flip Active/Inactive without
  opening the form.
- Renaming a category **re-tags its products** automatically, and the category
  "Products" count recalculates after any product change.

### Account menu · Profile · Change Password

The topbar avatar opens an account dropdown: **Profile · Change Password · Setting · Log Out**.

Both account screens share the live admin's layout — page titled **Setting**, a left tab
card (Profile / Change Password) and a right form card:

- **Profile** (`#/profile`) — circular avatar with the admin's name beneath, then
  First Name\* · Last Name\* · Username\* · Email\* · Phone Number (`+91`) ·
  Choose Profile Image, with an **Update** button.
  Saving repaints the topbar name and avatar immediately.
- **Change Password** (`#/password`) — Old Password\* · New Password\* ·
  Confirm New Password\*, with a **Save** button. Validates: all required,
  minimum 8 characters, new ≠ old, and confirm must match.

### Grah Pravesh / Vasthu Dates (`#/grahpravesh`, `#/vasthudates`)

Rebuilt to mirror the live **Add Grah Pravesh** dialog:

- **Centred modal** with title + ✕ close (not a drawer)
- **Date** (required, native picker) · **Time** (native picker) · **Status**
- **Description** — a self-contained WYSIWYG editor: paragraph/heading/quote select,
  undo · redo · bold · italic · underline · highlight · bulleted & numbered lists ·
  link · clear formatting, with a live **word count**
- Saved HTML renders formatted in the row's detail view; the table shows a plain-text
  preview of the description

The editor is built on `contenteditable` + `execCommand` — **no TinyMCE or any other
external dependency**, so the folder stays self-contained. When you wire this to the
backend, the field stores an HTML string, same as TinyMCE produces.

### CRUD coverage

Create / edit / delete are wired on: **Users · Products · Categories · Packages ·
Orders · Subscriptions · Grah Pravesh · Vasthu Dates · Banners · Pages · Offer Videos**

Transactions and Subscription Attempts are **view-only by design** — financial records
should never be hand-edited from an admin UI.

Edits mutate the in-memory arrays in `data.js`, so changes are live during the session
(row counts and the sidebar badges update) and reset on reload.

> **All charts and tables use `admin/js/data.js` — anonymized sample data.**
> No real customer names, emails, phone numbers or payment IDs appear anywhere.
> Only non-personal business aggregates (revenue, counts) are real.
> Swap `data.js` for live API calls when wiring this into the backend.

> **Authentication is not implemented.** `login.html` navigates to the portal without
> verifying credentials — it is a UI prototype. Do **not** deploy `admin/` publicly
> until it sits behind real server-side auth.

## Content layer — admin edits reach the website

The site no longer hardcodes its content. `js/content.js` renders the **pricing cards,
gallery tiles, legal-page bodies and contact/social links** from managed data, trying in
order: **admin bridge → API (`api/*.json`) → the markup already on the page**.

A failed request never blanks the site — it falls back to what is already rendered.

The admin portal has a **Publish** button (and auto-publishes on change) that mirrors its
data to `localStorage`, so on a shared origin the website picks the edits up on reload.
That bridge is a **demo mechanism**; in production set `BRIDGE: false` and point
`API_BASE` at Laravel. Full endpoint contract: **[`api/README.md`](api/README.md)**.

What is managed vs. fixed:

| Website element | Source |
|---|---|
| Pricing cards | `packages` |
| Gallery — videos / products / banners | `offer-videos`, `products`, `banners` |
| Terms & Privacy body | `pages` (matched by slug) |
| Footer email, phone, social links, store link | `settings` |
| Gallery **App Screens** tiles | Not admin-managed — always preserved |

## Sections

1. **Hero** — headline, Google Play badge, user trust signals, app mockups
2. **Value strip** — key capabilities at a glance
3. **How It Works** — 3 steps from download to daily guidance
4. **Why VasthuWalk** — before vs. with VasthuWalk
5. **Features** — 6 core capabilities
6. **The App** — mobile screens showcase
7. **Gallery** — offer videos + app screens, filter tabs & lightbox
8. **Testimonials** — social proof *(placeholder — see below)*
9. **Pricing** — Personal (₹196) and Business (₹499) plans
10. **FAQ** — 8 questions, single-open accordion
11. **About** — credibility *(placeholder)* + what's coming next
12. **CTA + Footer** — social icons appear once, in the footer

## ⚠️ Placeholders to replace before launch

| Where | What to replace |
|---|---|
| `#reviews` section | 3 testimonials marked `[Customer name]` / `[City]`. **Do not publish these as real reviews** — swap in genuine, permission-granted quotes or delete the section. |
| `#about` section | `[Name / expertise of your Vasthu authority]` and `[X years]` — the credibility claim is the point of the section. |
| `js/social.js` | Social URLs are base domains, not real profiles. |

## App availability

Live on Google Play: `com.vasthuwalk.app`
There is **no iOS listing** — the hero shows "iOS version coming soon". Remove that
line and add an App Store badge once the iOS app ships.

## Removed deliberately

The **admin dashboard showcase** was removed. Those screenshots contained real
customer names, email addresses, phone numbers and payment IDs — publishing them on
a public marketing site exposed personal data of users who never consented to it.
That material belongs in the investor deck only (`../Vasthuwalk_Investor_Pitch_Deck.pdf`).

Business metrics (revenue, payment counts, user counts) were also removed from the
hero: they are persuasive to investors but read as "unproven" to a customer.

## Design system

| Token | Value | Use |
|---|---|---|
| `--espresso` | `#20130a` | dark backgrounds |
| `--gold` / `--gold-lt` | `#c9a227` / `#e8c874` | accents, highlights |
| `--cream` | `#faf5ea` | light backgrounds |
| `--gg` | gold gradient | buttons, headings, stats |

- **Display font:** Fraunces (serif) — headings
- **Body font:** Plus Jakarta Sans — copy and UI

## Running it

No build step or dependencies. Open `index.html` directly, or serve the folder:

```bash
cd website
python -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Upload the whole `website/` folder to any static host (Netlify, Vercel, GitHub Pages,
Cloudflare Pages, or standard cPanel hosting). No server-side runtime is required.

## Responsive coverage

Verified with zero horizontal overflow and zero console errors at:

| Breakpoint | Widths tested |
|---|---|
| Desktop | 1440px, 1280px |
| Tablet | 1024px (landscape), 820px (portrait) |
| Mobile | 390px, 360px |

## Login page (`login.html`)

Split-screen layout: form on the left, brand panel on the right. On tablet and below
the brand panel collapses into a compact banner above the form.

Includes show/hide password, inline validation, remember-me, and social links.

> **Important — this login does NOT authenticate anyone.**
> In the prototype the form validates the fields, then navigates straight to
> `admin/index.html` so you can walk through the portal. Credentials are deliberately
> **not** embedded in the JavaScript — anything in client-side code is readable by
> every visitor, so hard-coding an admin password there would publish it.
>
> To make this real, install the page as the Laravel view
> (`resources/views/auth/login.blade.php`), keep the markup/classes, restore
> `method="post" action="https://www.vasthuwalk.com/login"` on the `<form>`, add
> `@csrf` inside it, and delete the redirect at the end of `js/login.js`.
> Laravel then handles validation, throttling and sessions.
> Until that is done, keep `admin/` off any public host.

## Contact & social

Pulled from the admin **Settings** panel (`/admin/setting`) and centralised in
`js/social.js` — edit that one file to update them everywhere:

- Email `vasthuwalk@gmail.com` · Phone `7788849994`
- Facebook, Instagram, X, YouTube, LinkedIn, WhatsApp

> The five social URLs in Settings are currently base domains (e.g. `facebook.com`)
> rather than real profile links. Update them in `js/social.js` (and in the admin
> Settings panel) once the actual profiles exist.

## Notes / next steps

- Fonts load from Google Fonts; self-host them if you need full offline support.
- App Store / Play Store badges can be dropped into the hero and CTA once live.
- The traction numbers (₹7.09L, 134 payments, 68+ users, 118 orders) are pulled from
  the live admin dashboard — update them as the platform grows.
