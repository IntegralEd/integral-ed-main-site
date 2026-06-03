# 15th Anniversary Page — Documentation

A private, password-gated, single-page microsite celebrating Integral Ed's 15 years
(2011–2026). It is biz-dev / client-facing (clients can see each other on the page),
short-lived, and **data-driven**: nearly all content lives in one file so non-developers
can edit copy without touching HTML/CSS/JS.

- **Live URL:** `/15th-anniversary/` (deployed by Netlify from `main`)
- **Password:** `@nniversary` (soft gate — see "Password gate" below)
- **Status:** `noindex, nofollow` (not indexed by search engines)

---

## Quick start (editing content)

**You almost never need to touch anything but one file:**

```
src/15th-anniversary/data/anniversary-data.js
```

Everything on the page — the headline, the counting numbers, the timeline, the
"subway map," the work cards, the team, the client testimonials, the service list —
is read from `window.ANNIVERSARY_DATA` in that file. Edit the values inside the quotes,
save, and the page updates on next build/deploy.

To preview locally:

```bash
npm run build      # compiles src/ → dist/
# then serve dist/ (e.g. `python3 -m http.server 8090 -d dist`) and open
# http://localhost:8090/15th-anniversary/
```

Deploy is automatic: push to `main` → Netlify runs `npm run build` and publishes `dist/`.

---

## File map

| File | Role |
|------|------|
| `index.html` | Page shell: section scaffolding + the password-gate markup. Section **copy** (headers/ledes) is here; section **content** is injected by JS. |
| `data/anniversary-data.js` | **The single content drop-zone.** `window.ANNIVERSARY_DATA` = all page data. |
| `anniversary.js` | Reads the data and renders every section; wires interactions (scroll-spy, reveals, counters, name auto-linking, hover previews, subway draw-in, work modal). |
| `anniversary.css` | All page styling (dark/light alternating sections, subway map, modal, etc.). |
| `gate.js` | Soft password gate (SHA-256 check, sessionStorage). Dispatches `anniv:unlocked`. |
| `README.md` | This file. **Not published** (the build skips `.md`). |
| `CONTENT-REVIEW.txt` | Plain-text copy + `[bracketed]` UX notes for team review. **Not published** (build skips `.txt`). |
| `data/.gitignore` | Keeps confidential source material (PDFs, CSVs) out of the **public** repo. Only `anniversary-data.js` passes through. |

---

## Page structure (top to bottom)

A sticky left rail (scroll-spy nav) sits beside a single scrolling main column.
Sections alternate dark/light for rhythm.

| # | Section id | Header | Source of content |
|---|-----------|--------|-------------------|
| 00 | `#intro` | *(hero)* "Fifteen years helping organizations learn, adapt, and grow." | `meta` (headline, subhead, counters) |
| 01 | `#history` | "How it started, and how it grew" | `timeline[]` |
| 02 | `#evolution` | "Each year, a new thing we could do" | `evolution[]` (subway map) |
| 03 | `#work` | "Work we're proud of" | `projects[]` (cards → modal) |
| 04 | `#team` | "The people behind the work" | `team.headcountByYear[]` + `team.members[]` |
| 05 | `#clients` | "Who we've grown alongside" | `clients.featured[]` + `clients.logos[]` |
| 06 | `#today` | "What we do today" | `serviceAreas[]` + CTA box |

Section headers/ledes are hardcoded in `index.html`. Section **bodies** come from data.

---

## The data model (`anniversary-data.js`)

```js
window.ANNIVERSARY_DATA = {
  meta:        { foundedYear, anniversaryYear, eyebrow, headline, subhead, counters[] },
  timeline:    [ { year, title, body, image, tag } ],
  evolution:   [ { id, year, stage, tagline, whatWeCouldDo, proof, color } ],
  projects:    [ { title, client, year, serviceArea, summary, image, href, embedUrl, videoUrl, link } ],
  team:        { headcountByYear: [ { year, total } ], members: [ { name, role, dept, since, image, href, bio } ] },
  clients:     { featured: [ { name, logo, story, quote, quoteAttribution, since } ], logos: [ { name, logo } ] },
  serviceAreas:[ { name, href } ]
};
```

### Field notes
- **`meta.counters`** — the big numbers up top. `{ value, suffix, label }`. They **count up**
  on screen (see "Count-up" below). No dollar figures, by policy.
- **`timeline`** — one entry per beat. `tag` is the little pill; `body` is the prose.
  Any **teammate's full name** written in `body` is auto-bolded + linked (see "Name auto-link").
- **`evolution`** — each entry is a "subway line": a capability we added and never retired.
  `color` is one of: `blue, teal, yellow, magenta, plum, sky` (maps to a brand color).
  `whatWeCouldDo` = the capability; `proof` = the evidence/teammate who brought it.
- **`projects`** — each card opens a **modal**. If `embedUrl` or `videoUrl` is set, the modal
  embeds it; otherwise it shows the `summary` + a link to `link`/`href`. (TODO: real demo URLs.)
- **`team.members`** — `since` drives the tenure badge; `image`/`href` mirror the live team
  directory (`/assets/team/<slug>.<jpg|png>`, `/team/<slug>/`).
- **`clients.featured`** — testimonial cards: logo + `story` + pull-`quote` + `quoteAttribution`.
- **`clients.logos`** — the logo wall (paths reuse the homepage logo strip).

---

## How to make common edits

**Change a counting number** → `meta.counters[n].value` (and `.suffix`, `.label`).

**Add/edit a timeline beat** → copy a `{ year, title, body, image, tag }` block in `timeline`.
Write teammate names in full to auto-link them.

**Add an Evolution stream (subway line)** → add an `evolution` entry with a `color`
(`blue|teal|yellow|magenta|plum|sky`). If you need a new color, add `.evo-<name> { --evo-c: #hex; }`
in `anniversary.css` near the other `.evo-*` rules.

**Add a Work card** → add a `projects` entry. To make its modal launch a live demo, set
`embedUrl` (inline iframe) or `videoUrl`; otherwise set `link`/`href` for the "Explore" button.

**Add a teammate** → add a `team.members` entry (and a row to `team.headcountByYear` if it
shifts the chart). `image`/`href` should match the live team directory slug.

**Add a featured client testimonial** → add a `clients.featured` entry:
`{ name, logo, story, quote, quoteAttribution, since }`. Mention the Integral Ed lead by name
in `story` and it auto-links to their profile.

---

## Interactions (in `anniversary.js`)

- **Name auto-link** — `buildNameIndex()` builds a regex from the team roster; `linkNames()`
  wraps any teammate's name in body copy as a bold link to their `/team/` profile. Full names
  always match; an unambiguous first name (≥4 chars, not a stop-word) also matches.
- **Hover preview** — hovering/focusing a linked name shows a small photo + role card.
- **Count-up** — the hero numbers animate from 0 to target. **They wait for the gate to unlock**
  (gate.js dispatches `anniv:unlocked`) so the animation isn't wasted behind the password screen.
- **Subway map** — the Evolution lines draw themselves in (stroke-dash animation) when the
  section scrolls into view; hovering a line spotlights it.
- **Work modal** — clicking/Enter on a work card opens a modal (embed/video/image + write-up +
  link). Closes on ✕, backdrop click, or Esc; restores focus.
- **Scroll-spy** — the left rail highlights the section currently in view.
- **Reveal-on-scroll** — `.reveal` elements fade/slide in. All motion respects
  `prefers-reduced-motion`.

---

## Password gate (`gate.js`)

> **This is light-touch privacy, not real security.** The HTML still ships in the response;
> the gate only deters casual browsing. For anything truly sensitive, use Netlify-level auth.

- Password: `@nniversary`. The file stores only the **SHA-256 hash**, not the password.
- On success it sets `sessionStorage['anniv-unlocked'] = '1'`, removes the `anniv-locked`
  class, hides the gate, and dispatches `anniv:unlocked`.
- `index.html` has an inline guard that adds `anniv-locked` immediately to prevent a flash
  of content before `gate.js` runs.

**To change the password:**
```bash
printf '%s' 'yourpassword' | shasum -a 256
```
Paste the hash into `HASH` in `gate.js`.

---

## Build & deploy

- `netlify.toml`: `command = "npm run build"`, `publish = "dist"`. Push to `main` → auto-deploy.
- `build.js` copies `src/ → dist/`. Page-level static files are copied **except**:
  - `.html` and `.md` (handled/skipped), and
  - source/reference extensions that must never publish:
    `.csv, .pdf, .xlsx, .xls, .docx, .doc, .numbers, .key, .txt`.
  This is why `README.md` and `CONTENT-REVIEW.txt` live in the repo but never reach the public site.

---

## Security & content rules (important)

- **This repo is PUBLIC.** `data/.gitignore` blocks everything in `data/` except
  `anniversary-data.js` and `.gitignore` — so the newsletters, transaction lists,
  recommendation letters, and roster CSVs are readable locally for authoring but
  **never committed**. Stage files by name; don't `git add -A` the data folder.
- **No dollar figures on the page.** Because clients can see each other, the page carries
  no per-client or per-year amounts. "First six-figure contracts" is fine as a narrative
  beat; specific numbers are not.
- **Airtable token** (used by the unrelated team page build) is only read from
  `process.env` — never hardcode it.
- The `data/` folder currently holds the source material these testimonials/beats were drawn
  from (recommendation letters, newsletters, transaction list). They stay local-only.

---

## Open TODOs

- **Work modal demo URLs** — the four work cards currently link to the relevant service page.
  Provide `embedUrl`/`videoUrl`/`link` per project to make the modals launch real demos.
- **Project years/clients** — a couple of `year`/`client` fields are still marked CONFIRM.
- Optional 5th work card ("Nano" STEM highlight) is stubbed (commented out) in `projects`.
