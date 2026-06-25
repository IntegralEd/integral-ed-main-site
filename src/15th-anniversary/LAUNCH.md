# 15th Anniversary: Launch Checklist

Working doc for taking `/15th-anniversary/` live and promoting it. This file is
not published (the build skips `.md`).

**Status (2026-06-25):** the page is built, public, indexable, mobile-clean,
analytics-wired, and the share images are done. What's left is mostly *your*
GA4 setup and the promotion. Boxes below are the open items.

---

## A. Pre-launch (engineering) — essentially done

- [x] Password gate removed
- [x] Preview feedback pill removed (JS + CSS)
- [x] Page set to `index, follow`
- [x] Social share images created: `og-share.png` (1200x630) + `share-square-1200.png` (1200x1200)
- [x] Canonical + OG host aligned to `https://www.integral-ed.com`
- [x] Heavy images compressed (collateral and cards, ~4.2MB to ~1.8MB)
- [x] End-to-end smoke test passed (sections, tour, modals, links, mobile, no console errors, GA4 firing)
- [ ] **Confirm the non-www to www redirect resolves in production** (visit `https://integral-ed.com/15th-anniversary/`, confirm it 301s to `www`, and that the og image loads at the `www` URL). One-time check after deploy.
- [ ] `/join-our-team/` now 302-redirects to the careers app (`integral-careers.netlify.app`). Commit `netlify.toml` when you're ready for that to go live, and click the "Join our team" link on the page once to confirm it lands correctly.

## B. GA4 key events (your task, ~15 min)

The page already fires the events below (verified live). GA4 just needs them
flagged as **key events** (GA4's term for conversions) so they show up as goals.

**Events are firing now**, but new events can take up to 24h to appear in
standard reports. To see them immediately, use **Admin > DebugView** or the
**Realtime** report while clicking through the page.

### Steps
1. Open GA4 property **G-ZYXGKC3ZQ5**.
2. Go to **Admin > Data display > Events** (you'll see the `anniv_*` events listed once they've fired at least once).
3. For each event below, toggle **"Mark as key event"** on.
4. If an event isn't listed yet, click through the page to trigger it (tour, CTAs), wait a few minutes, refresh.

### Mark these as key events
| Event | Fires when | Why it matters |
|---|---|---|
| `anniv_tour_schedule` | "Schedule a conversation" clicked from the tour finale | Primary: new conversation |
| `anniv_schedule_click` | "Schedule a conversation" clicked from the scroll CTA | Primary: new conversation |
| `anniv_tour_refer` | "Introduce us / refer" clicked in the tour | Primary: referral |
| `anniv_join_click` | "Join our team" clicked | Talent pipeline |
| `anniv_tour_finish` | Tour completed | Engagement (optional but useful) |
| `anniv_tour_share` | "Spread the word" share clicked | Amplification (optional) |

### Also (contact-form conversion)
The schedule/refer CTAs send people to `/contact/?ref=15th-anniversary` (and
`?ref=15th-anniversary-tour`). To count actual submissions, mark your contact
form's submit event as a key event too. If the form doesn't emit one, add a
`form_submit` (or custom) event on the contact page's success state, then mark it.

### Optional, makes the data far more useful
- **Custom dimensions** (Admin > Custom definitions > Create, event-scoped) for the params the events carry, so you can break results down:
  - `section` (on join/skip/project events) — where on the page they acted
  - `source` (on `anniv_schedule_click`) — which CTA
  - `item` (on `anniv_project_open`) — which work sample drew interest
- **Funnel exploration** (Explore > Funnel): `page_view` to `anniv_tour_start` to `anniv_tour_finish` to `anniv_tour_schedule`. Shows where people drop.
- **Traffic by channel:** make sure every promoted link carries UTMs (see section D) so GA4 attributes sessions to LinkedIn / email / ConstantContact.

## C. Launch day

- [ ] Confirm latest deploy is live (`og-share.png`, page content, redirects).
- [ ] Run the page URL through **LinkedIn Post Inspector** (and X Card Validator) to refresh the cached unfurl before posting.
- [ ] Founder LinkedIn post (see D) with the screencast + tour link.
- [ ] Company page reshares the founder post.
- [ ] Personal partner emails (plain, forward-friendly).
- [ ] ConstantContact send to the broader list.
- [ ] Spot-check the page on a phone and in one non-Chrome browser.

---

## D. Promotion

**Through-line:** gratitude and word of mouth ("We're here thanks to you").
Lead every channel with thank-you, not "look at us." This is a relationship and
referral play to people who already know you.

**Audiences:** (1) current partners, (2) dormant/past clients, (3) broader
network/prospects, (4) talent.

**LinkedIn (highest leverage)**
- [ ] Founder post (David), personal and thank-you framed, with the screencast and a link to `?mode=tour`. Tag a few teammates; with permission, a partner or two.
- [ ] Company page reshare.
- [ ] Teammate amplification: give every teammate a 2 to 3 line copy kit to repost in their own words.
- [ ] Cadence: launch post, then (+1 wk) one "behind the work" project, then (+2 to 3 wk) a milestone/number angle.

**Direct email (personal, low-design)**
- [ ] From David, to partners. One link to the page/tour. Explicitly invite a forward ("if you know someone this would help, send it along").
- [ ] Shorter, value-first variant for prospects.

**ConstantContact (designed campaign)**
- [ ] Hero = the share image. Headline "We're here thanks to you." ONE primary CTA ("Take the tour").
- [ ] A/B the subject line ("Fifteen years, thanks to you" vs "A look back, and what's next").
- [ ] Send Tue to Thu morning. Tag the segment; watch open/click.

**UTMs (so GA4 can attribute):** add to every promoted link:
`?utm_source=linkedin|email|constantcontact&utm_medium=social|email&utm_campaign=15yr`
(The page already carries `?ref=` on its own CTAs; UTMs are for the inbound links.)

---

## E. Screencast spec

**One asset, 20 to 30 seconds, screen-capture of the tour.** Record at 1080x1080
(square) or 1080x1350 (portrait) for the most feed space; export MP4 (H.264).

**Recommendation: make the silent/captioned version the primary.** Social feeds
autoplay muted, so on-screen text carries the message and a music bed adds
polish. Record a voiced version too *only if* you'll also use it where sound-on
is likely (email embed, the website, a conference loop). Captions are
non-negotiable either way (burn them in; don't rely on platform auto-captions).

### Shot list / on-screen text beats (silent version)
1. Hero: **"15 years ago: one person, one laptop."**
2. Counters: **"Today: a 20-person studio. 250+ projects."**
3. Services/evolution: **"Learning. Media. Strategy. Woven together."**
4. "So what" band: **"We don't advertise. We grew through you."**
5. CTA: **"Here's to the next fifteen."**
6. End card: the logo + `integral-ed.com/15th-anniversary`

### Suggested voiceover script (~30s, if you record a voiced cut)
> "Fifteen years ago, Integral Ed was one person and a laptop. Today we're a
> twenty-person studio building learning, media, and strategy for mission-driven
> organizations. We didn't get here with ads. We got here because partners like
> you trusted us, came back, and sent others our way. So this is a thank-you.
> Take a couple minutes, walk through the work we've done together, and here's to
> the next fifteen."

Keep it warm and unscripted-sounding; David's own voice beats a polished read.

### Music
Pick one calm, warm, non-distracting bed (no lyrics). Keep it under the VO if
voiced; bring it up if silent. Fade out on the end card.

---

## F. Define success up front
Set targets before launch so you can judge it at +1 week and +1 month, e.g.:
- N partner replies / new conversations (`anniv_tour_schedule` + `anniv_schedule_click` + contact submits)
- X referrals/intros (`anniv_tour_refer`)
- Y talent inquiries (`anniv_join_click`)
- Engagement: tour starts vs finishes, scroll depth, time on page
