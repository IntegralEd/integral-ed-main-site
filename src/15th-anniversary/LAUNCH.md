# 15th Anniversary: Launch Plan

Everything to take `/15th-anniversary/` from password-gated preview to a public,
promotable campaign. Two parts: the **go-live checklist** (technical) and the
**growth strategy** (how to promote it).

> This file is not published (the build skips `.md`).

---

## Part 1: Go-live checklist

### Blockers (must do before publish)

1. **Remove the password gate.** In `src/15th-anniversary/index.html`:
   - Delete the inline lock guard in `<head>` (the `<script>...anniv-locked...</script>` line).
   - Delete the gate dialog markup (`<div class="anniv-gate" id="anniv-gate">…</div>`).
   - Delete the `<script src="/15th-anniversary/gate.js"></script>` include.
   - The count-up animation waits for an `anniv:unlocked` event (dispatched by
     gate.js). With the gate gone, add a one-liner so the counters still fire,
     e.g. at the top of `anniversary.js` `init()` or inline:
     `document.addEventListener('DOMContentLoaded',()=>document.dispatchEvent(new CustomEvent('anniv:unlocked')))`.
     (Or have `whenUnlocked()` resolve immediately when there's no `anniv-locked` class.)
   - `gate.js` can then be deleted.

2. **Create the social share image.** `og:image`/`twitter:image` already point to
   `https://integral-ed.com/assets/images/anniversary/og-share.png`, that file
   does not exist yet. Make a **1200x630** PNG/JPG (the subway map or the hero
   reads well) and drop it at `src/assets/images/anniversary/og-share.png`.
   Without it, LinkedIn / email / ConstantContact link previews look bland.
   Validate with the LinkedIn Post Inspector and X Card Validator after deploy.

3. **Decide indexing.** The page is `noindex, nofollow`. For a lasting brand
   asset you'll want it indexable, remove the robots meta. For a short-lived
   campaign, leave it (OG previews still work with noindex). Recommendation:
   **index it** and link it from the footer once it's live.

4. **`/join-our-team/` page.** A placeholder is live (routes "Express interest"
   to the contact form). Replace its `PLACEHOLDER` block with the real openings
   + express-interest form, and remove its `noindex` when ready. The anniversary
   page already links to it (subtle line under the team carousel).

5. **Remove the preview-only feedback pill.** The page suppresses the chat widget
   (`@no-widget`) and shows a preview feedback pill (`setupFeedbackPill`). Decide
   whether to keep the chat widget on for the public page, and remove the
   feedback pill before launch.

6. **Canonical / www consistency.** `og:url` uses `integral-ed.com` (no www) but
   the rest of the site canonicalizes to `www.integral-ed.com`. Pick one, make
   sure the other 301-redirects, and make `og:url` match the canonical host.

### QA pass

- **Mobile:** tour, section nav menu (hamburger), team carousel, the modals.
- **Cross-browser:** Safari, Chrome, Firefox, Edge.
- **Accessibility:** keyboard nav through the tour, screen-reader labels, color
  contrast (Asha's recent pass helped). Announce tour step changes if time.
- **Performance:** the collateral mockups are ~0.7-1MB PNGs at 1918x1080, so
  compress them (or serve WebP). Confirm images lazy-load.
- **Flows:** Schedule -> /contact/?ref=…, "Spread the word" share, "Introduce us"
  mailto, "View as Tour", every demo embed (Career Ikigai, Storyline demos).
- **Analytics:** GA4 firing; set conversions for `anniv_tour_schedule`,
  `anniv_tour_refer`, `anniv_tour_finish`, and the contact-form submit (with the
  `?ref` value). Confirm on the real domain, not localhost.

---

## Part 2: Growth strategy

### The through-line
The page's thesis is **gratitude + word of mouth**: "We're here thanks to you."
Lead every channel with thank-you, not "look at us." This is a relationship and
**referral** play to people who already know you, not cold acquisition. The page
even closes with the two asks that matter, *schedule* and *spread the word /
introduce us*, so the promotion just needs to get the right people onto it.

### Audiences (segment everything)
1. **Current partners / clients**, the primary audience. The "thanks to you" note lands hardest here.
2. **Past / dormant clients**, re-engagement: "here's what we can do now."
3. **Prospects / broader network**, value-led: 15 years of proof.
4. **Talent**, the team section + "Join our team" CTA.

### Channels

**LinkedIn (highest-leverage)**
- **Founder post (David):** personal, thank-you framed, with a short
  screen-capture video or the subway-map GIF (native media wins on LinkedIn).
  Link to `?mode=tour`. Tag a few teammates and, with permission, a partner or two.
- **Company page** reshares it.
- **Teammate amplification:** give every teammate a 2-3 line copy kit to repost
  in their own words. Employee advocacy multiplies organic reach more than any
  single post.
- **Cadence:** launch post -> (+1 wk) a single "behind the work" project ->
  (+2-3 wk) a milestone/number angle. Three touches, three angles.

**Direct email (personal, low-design)**
- From the founder, to partners, plain and personal. One link to the page (and
  the tour). Explicitly invite a forward ("if you know someone this would help,
  send it along"), that's the referral loop the page is built for.
- Prospect variant: shorter, value-first.

**ConstantContact (designed campaign)**
- Hero = the share image / GIF. Headline "We're here thanks to you." **One**
  primary CTA (View the story / Take the tour), resist multiple CTAs.
- A/B the subject line, e.g. "Fifteen years, thanks to you" vs "A look back, and
  what's next, for Integral Ed." Use the preheader.
- Send Tue-Thu morning. Suppress unsubscribes; tag the segment; watch open/click.

### Measurement (so you can prove it worked)
- **UTM every promoted link:** `utm_source` (linkedin / email / constantcontact),
  `utm_medium`, `utm_campaign=15yr`. Then GA4 attributes traffic by channel.
  (The page already carries `?ref=` on the schedule/contact links.)
- **Watch:** sessions by channel, tour starts/finishes, Schedule clicks ->
  contact submits, Spread-the-word / Introduce-us / Join-our-team clicks, scroll
  depth, time on page.
- **Define success up front:** e.g. N partner replies, X schedule clicks, Y
  intros/referrals, Z qualified inbound. Review at +1 week and +1 month.

### Timeline
- **T-1 week:** gate removal, OG image, QA, UTM links built, ConstantContact draft
  approved, LinkedIn copy kit to the team, the 15-30s tour screen-capture recorded.
- **Launch day:** founder LinkedIn post + personal partner email + ConstantContact
  to the broader list.
- **+1 week:** teammate amplification, second LinkedIn angle, resend to non-openers.
- **+2-4 weeks:** "in case you missed it," a single proof-point post, the talent push.
- **Ongoing:** keep the page as an evergreen capabilities asset (index it, link it
  from the footer/nav).

### Nice-to-haves that punch above their weight
- **Per-stop shareable tour links** (`?mode=tour&step=…`) so a rep can drop a
  prospect straight onto the one proof point that fits them.
- **A short tour video** for LinkedIn (autoplay + dwell time = reach).
- **A one-page PDF export** partners can forward internally to a decision-maker.
