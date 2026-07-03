# integral-ed-main-site

Marketing/brand site for **integral-ed.com**. Static site built by a small Node
script (`build.js`) into `dist/`, deployed on Netlify.

## Develop

```bash
npm run build     # build src/ -> dist/ (node build.js)
npm run dev       # serve src/ at http://localhost:8000 (python http.server)
npm run preview   # serve the built dist/ at http://localhost:8080
```

Netlify runs `npm run build` and publishes `dist/` (see `netlify.toml`).

## How the build works

- `build.js` copies `src/` → `dist/`, injecting shared partials into each page:
  `<!-- @nav -->` / `<!-- @footer -->` from `src/partials/`, plus analytics and
  the chat widget from `vendor/integralthemes/components/`.
- **Team pages** are data-driven: `build-team.js` pulls teammates from Airtable
  at build time (when `AIRTABLE_*` env vars are set), falling back to the
  snapshot in `src/team/_data/team.json`. It renders the `/team/` grid and a
  standalone `/team/<slug>/` page per teammate.
- Page-level static files co-located under `src/<page>/` (e.g. a page's own CSS/JS)
  are copied through; source/reference files (`.csv`, `.pdf`, `.docx`, `.txt`, …)
  are intentionally NOT published.
- Styling: `vendor/integralthemes/theme/theme.css` (shared theme) + `src/css/site.css`
  (site overrides).

## Structure

```
src/
  partials/        nav.html, footer.html (injected into every page)
  css/site.css     site-specific styles on top of the vendor theme
  js/              main.js, team.js
  team/            data-driven team page (+ _data/team.json snapshot)
  services/ about/ approach/ portfolio/ contact/ ...
  15th-anniversary/  campaign microsite
vendor/integralthemes/   shared brand theme + components
build.js build-team.js   the build
netlify.toml             build config + redirects
```

## Careers / "Join Our Team" — lives in a separate repo

**The careers experience is NOT in this repo.** It has its own repo and Netlify
deploy so applicant PII and write credentials stay off the public marketing site.

- **Repo:** https://github.com/IntegralEd/integral-talent
- **Deploy:** https://integral-careers.netlify.app
- **This site only redirects.** `netlify.toml` 302-redirects `/join-our-team`
  and `/join-our-team/` to `https://integral-careers.netlify.app/join-our-team/`
  (`force = true`). There is no careers page, form, or applicant data here.

To change open roles, the apply form, or careers copy, work in the
**integral-talent** repo (roles render from its `public/positions.json`, whose
editorial source of truth is an Airtable "Positions" table).

## Redirects

`netlify.toml` also keeps legacy URLs alive: `/practice-areas/*` → `/services/*`
and `/team-2026/*` → `/team/*` (301 permanent).
