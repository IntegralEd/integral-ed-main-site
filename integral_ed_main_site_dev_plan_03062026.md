# Claude Code Prompt for Integral Ed Main Site Rebuild

Build a new production-ready repo for the next version of the main Integral Ed site.

The site should position Integral Ed as a long-term strategic partner for mission-driven organizations, with strongest emphasis on **eLearning design, online learning, and blended learning**, since these represent the core of the business. Secondary practice areas should support and connect to that center of gravity.

This prompt will later be supplemented with the URL of the new repo. Treat that repo as the implementation target.

---

## Product and positioning goals

Create a new main site that does these jobs clearly:

1. Establish trust and credibility for prospective customers
2. Present Integral Ed as one company with one team and one operating model
3. Show that clients often begin with one service and then expand into a long-term relationship
4. Emphasize that eLearning design, online learning, and blended learning are the primary practice area and front door
5. Route users toward related practice areas and the CTA form to request access to the gated portfolio which serves as lead qualification gate and avoids exposing client work to bots
6. Support SEO for the main business category without duplicating the microsites

The site should feel like the umbrella brand and narrative home for the company.

The microsites are specialized practice-area destinations, but the main site is the authority brand, trust layer, and wayfinding layer.

---

## Brand and visual rules

Use the **same brand identity across the main site and all practice areas**.

Do not invent separate color palettes or accent systems by site.

The main site should inherit the same shared visual language used by the existing microsites through the vendor theme system.&#x20;

### Theme requirement

The implementation must pull vendor themes from:

`/integralthemes`

Use the same pattern that the existing microsites use to load and apply vendor themes. Do not copy the vendor themes, but make sure it's a dynamic update via integralthemes repository yml workflow. This will allow universal refinements to css to be applied universally.

If there is an established theme loader, config structure, shared CSS variable system, or shared partials/components pattern in `/integralthemes`, reuse it rather than creating a parallel styling system.

Maintain a single coherent brand identity across:

- integral-ed.com
- integralelearning.com
- integralplatforms.com
- integralcapacity.com
- edugrowthstrategy.com
- integralcareerpathways.com
- the media design microsite

The new main site should feel like the parent brand of that family.

---

## Technical goals

Create a clean, maintainable repo with:

- semantic HTML
- accessible navigation and headings
- strong on-page SEO structure
- clear component organization
- good performance
- responsive layout
- production-ready content structure

Prefer clarity and maintainability over cleverness.

Do not create placeholder lorem ipsum. Use the provided copy below.

---

## Information architecture

Build the site with this structure.

```text
/
/about
/approach
/practice-areas
/practice-areas/elearning-and-blended-learning
/practice-areas/professional-learning
/practice-areas/career-pathways-and-workforce
/practice-areas/strategy-and-growth
/practice-areas/platforms-and-systems
/practice-areas/media-and-communications
/team
/portfolio
/contact
```

If a blog or insights structure already exists in the theme system and can be cleanly reused, leave a scaffold for it but do not make it a primary launch dependency.

---

## Page strategy and rationale

### 1. Homepage

Purpose:

- clarify who Integral Ed is
- foreground eLearning and blended learning
- explain the connected service model
- build trust
- route users deeper

### 2. About

Purpose:

- tell the company story
- explain long-term partnership model
- show sector experience and values

### 3. Approach

Purpose:

- explain how clients work with Integral Ed
- describe single point of contact plus just-in-time specialist support
- explain how work expands over time

### 4. Practice Areas index

Purpose:

- introduce the family of practice areas
- show that eLearning is central
- connect users to the right depth page or microsite

### 5. Practice area synopsis pages

Purpose:

- give enough narrative and SEO value on the main site
- avoid duplicating entire microsites
- connect practices to one another
- provide CTA to contact and portfolio

### 6. Team

Purpose:

- dynamic team credibility page
- use existing active team data source pattern if available

### 7. Portfolio

Purpose:

- explain gated portfolio access
- direct users to request access to our portfolio site by specifying what they'd like to see [CTA]
- frame gated access as curated and partially confidential

### 8. Contact

Purpose:

- route all inbound interest through a single smart intake form
- support service triage and qualification

---

## UX requirements

### Global navigation

Use a clear top nav with these items:

- Home
- About
- Approach
- Practice Areas
- Team
- Portfolio
- Contact

Header CTA:

- Talk With Our Team

### Footer

Include:

- short brand statement
- links to main pages
- links to related practice microsites
- note that Integral Ed is the parent brand / umbrella brand
- contact link

### Practice-area relationship pattern

On practice-area pages, include a section titled something like:

- Related capabilities
- How this connects
- Often paired with

This should make the connected nature of the business legible.

---

## SEO strategy

Primary domain SEO emphasis should center on:

- eLearning design
- online learning
- blended learning
- strategic consulting for nonprofits and education organizations
- professional learning design
- digital learning development

The main site should be optimized for these themes because they represent the majority of the business.

Secondary pages can support related phrases tied to the supporting practice areas.

Avoid competing directly with microsites by making the main site pages synopsis pages that connect the ecosystem rather than duplicating every specialized claim.

### Homepage SEO target themes

- eLearning design
- online learning development
- blended learning design
- instructional design partner
- learning development for nonprofits and education organizations

### Suggested homepage title tag

Integral Ed | Full Service Learning and Media Design for Mission-Driven Organizations

### Suggested homepage meta description

Integral Ed helps schools, nonprofits, and workforce organizations design and deploy eLearning, blended learning, and branded curriculum products, with connected support across strategy, media, platforms, and growth.

---

## Media and asset placeholder rules

Create clear placeholders for media assets that will be manually added from the current site and related materials.

Where assets are needed, use descriptive filenames and comments so they can be swapped in later.

Examples:

- `/public/assets/home/hero-team-photo.jpg`
- `/public/assets/home/client-logo-strip.png`
- `/public/assets/home/featured-work-collage.jpg`
- `/public/assets/practice/elearning-module-screenshot-01.jpg`
- `/public/assets/practice/blended-learning-workshop-photo-01.jpg`
- `/public/assets/portfolio/portfolio-preview-grid.jpg`

For each placeholder, include a short implementation comment explaining what belongs there.

Example comment:

`Replace with screenshot collage from current site and selected microsite examples showing Storyline, Rise, blended learning, and facilitator-facing work.`

Do not fabricate specific project screenshots. Use placeholders and comments only.

---

## Contact form requirements

The Contact page should be built around a Web3Forms intake form.

Use a multiselect field for service interests.

Fields:

- Name
- Organization
- Role
- Email (required)
- What are you exploring?
- Service areas of interest (multi-select)
- Timeline
- Message

Service areas of interest options:

- eLearning and blended learning
- Professional learning
- Career pathways and workforce development
- Strategy and growth
- Platforms and systems
- Media and communications
- Not sure yet

Include explanatory helper text that signals users do not need to know exactly what they need yet.

---

## Portfolio page behavior

The portfolio page should not expose the full gated portfolio.

It should:

- explain why examples are gated
- signal confidentiality and curation
- preview the kind of work available
- invite users to request access

Primary CTA:

- Request Portfolio Access

Secondary CTA:

- Talk With Our Team

Explain next steps as a tailored list of relevant projects framed in our gated portfolio environment.

---

## Homepage copy

Use this copy as launch-ready draft content. You may improve spacing, hierarchy, and front-end readability, but do not substantially rewrite the positioning.

### Homepage hero

**Headline** Design online learning that actually works.

**Subhead** Integral Ed helps schools, nonprofits, and workforce organizations design eLearning, online learning, and blended learning experiences that are clear, engaging, and built for real users. Our clients often begin with one project and stay with us for years as their programs, platforms, and communications evolve.

**Primary CTA** Explore Practice Areas

**Secondary CTA** Talk With Our Team

### Homepage trust section

**Section heading** Trusted by mission-driven organizations

**Body copy** For more than fifteen years, we have partnered with organizations across education, workforce development, and the nonprofit sector. We bring executive judgment, practical execution, and a collaborative working style that helps teams move from ideas to market-ready learning that sparks changes in understanding and behavior.

### Homepage core offer section

**Section heading** Where most partnerships begin

**Body copy** Many partnerships begin with a small scope of work that addresses an immediate need. During that work we learn a client organization’s mission, voice, and strategic priorities. At the same time, clients discover the broader ways we can support their goals.

A single project often expands naturally as the work unfolds.

For example, we may begin by building an eLearning module and then help the organization evaluate platforms and develop sales enablement materials that support launch. In other cases we begin by producing strategic communications or media, and then take over eLearning development to help the team meet a critical deadline. Some engagements begin with short‑term capacity, such as stepping into an executive role or filling a leadership gap, and grow into larger efforts like helping the organization shift from in‑person facilitated learning to blended or online delivery.

**Support points**

- Custom eLearning design and development
- Blended learning experiences
- Asynchronous professional learning
- Scenario-based and interactive learning
- Course and curriculum adaptation for digital delivery
- Learning media and instructional assets

### Homepage connected practice model

**Section heading** One partner, connected capabilities

**Body copy** Our clients do not need to assemble and manage multiple vendors.

Each partnership has a clear point of contact who can bring in the right support at the right time, whether that means instructional design, platform planning, communications, workforce alignment, or executive-facing materials. We start where the need is most urgent and build from there.

### Homepage long-term partnerships section

**Section heading** Built for long-term partnership

**Body copy** We often begin with a course, a launch, a training, or a strategic project. Over time, that work can expand into a broader partnership that supports new audiences, new channels, and new growth goals.

That is one reason our work spans eLearning, professional learning, career pathways, strategy, systems, and communications. These are not isolated services. They are connected parts of how organizations learn, grow, and reach people.

### Homepage practice areas intro

**Section heading** Explore our practice areas

**Intro copy** Start with the need in front of you. We will help you connect it to the larger picture.

### Homepage featured work / proof section

**Section heading** Selected work across learning, strategy, and media

**Body copy** Our portfolio includes interactive eLearning, blended professional learning, workforce development tools, career exploration experiences, executive communications, and custom systems that support implementation. Many examples are available through our gated portfolio.

### Homepage portfolio CTA section

**Section heading** Need to see examples?

**Body copy** We maintain a curated portfolio of selected client work, including interactive demos, sample media, and project examples across practice areas.

**Primary CTA** Request Portfolio Access

### Homepage final CTA section

**Section heading** Bring us the project you are trying to move forward

**Body copy** You do not need a perfect scope before reaching out. Tell us what you are building, where your team is stuck, or what you want to improve. We will help you find the right starting point.

**CTA** Talk With Our Team

---

## Practice areas index copy

### Page intro

**Headline** Practice areas that work together

**Body copy** Integral Ed is organized around a set of connected practice areas. eLearning and blended learning are at the center of much of our work, but clients often need more than one kind of support. We help organizations connect learning design, implementation, communications, systems, and growth so that good ideas can actually scale.

---

## Practice area copy

## 1. eLearning and blended learning

**Headline** eLearning and blended learning

**Intro** This is the center of gravity for much of our work.

We design digital learning experiences that help organizations teach clearly, engage real users, and deliver learning in formats that fit the context. That includes fully asynchronous modules, blended programs, scenario-based learning, interactive tools, and media-rich courses for educators, students, job seekers, and adult learners.

**When this is the right fit**

- You need custom eLearning rather than a generic course shell
- You are translating in-person learning into online or blended formats
- You want learning that is interactive, usable, and instructionally sound
- You need a partner who can connect instructional design, media, and implementation

**How this connects** This work often connects directly to professional learning, platforms and systems, and media and communications.

**CTA** Talk With Our Team

**Optional external link label** Explore the eLearning microsite

---

## 2. Professional learning

**Headline** Professional learning

**Intro** We design professional learning that respects educators and adult learners.

Our work includes asynchronous and blended professional learning, facilitator supports, implementation tools, case-based learning, and practical experiences that help people apply new ideas in real settings. We build for usability, reflection, and transfer into practice.

**When this is the right fit**

- You need training for educators, counselors, mentors, or staff
- You want to move beyond slide decks into usable learning experiences
- You need blended or asynchronous PD that can scale
- You want professional learning tied to implementation, not just exposure

**How this connects** Professional learning often grows out of eLearning design and can connect to media, systems, and strategic communications.

**CTA** Talk With Our Team

---

## 3. Career pathways and workforce development

**Headline** Career pathways and workforce development

**Intro** We support organizations that help people navigate education, work, and opportunity.

That includes career exploration, advising tools, mentoring resources, workforce development training, pathway communications, and learning experiences that help users make informed decisions about their future. We design with real learners and real constraints in mind.

**When this is the right fit**

- You support students, job seekers, mentors, or workforce participants
- You need pathway content, advising tools, or career-connected learning
- You want learning and communications that help people take action
- You need a partner who understands both educational design and user experience

**How this connects** This practice often overlaps with eLearning, strategy and growth, and platforms and systems.

**CTA** Talk With Our Team

**Optional external link label** Explore the career pathways microsite

---

## 4. Strategy and growth

**Headline** Strategy and growth

**Intro** Some organizations need more than deliverables. They need help clarifying what to build, how to position it, and how to grow.

We support strategy, market-facing communications, growth planning, proposal and pitch materials, and the connective work required to move new initiatives forward. This is especially useful when learning products, services, or programs are expanding into new channels or audiences.

**When this is the right fit**

- You are entering a new market or service area
- You need to clarify an offer before launching or scaling it
- You need strategy materials, executive-facing collateral, or growth support
- You want a partner that understands both delivery and go-to-market communication

**How this connects** This work often connects to media and communications, career pathways, and core eLearning offerings.

**CTA** Talk With Our Team

**Optional external link label** Explore the growth strategy microsite

---

## 5. Platforms and systems

**Headline** Platforms and systems

**Intro** Good learning needs the right delivery environment.

We help organizations think through the platforms, systems, and implementation choices that support online learning, blended learning, and user access. That may include LMS selection support, digital workflow design, portal thinking, and practical decisions about how users will actually experience the content.

**When this is the right fit**

- You are choosing or refining an LMS or delivery platform
- You need a better structure for digital access and user experience
- You want implementation support tied to learning goals
- You need systems thinking without unnecessary complexity

**How this connects** Platforms and systems often support eLearning, professional learning, and gated or managed content experiences.

**CTA** Talk With Our Team

**Optional external link label** Explore the platforms microsite

---

## 6. Media and communications

**Headline** Media and communications

**Intro** Learning and strategy often need stronger storytelling.

We create media and communications assets that help organizations explain their work clearly, engage audiences, and support adoption. That includes video, motion graphics, decks, sales materials, interface graphics, and other assets that sit alongside learning and growth initiatives.

**When this is the right fit**

- You need media that supports a learning, launch, or growth effort
- You want executive decks or communications materials that are clearer and more usable
- You need visual and narrative support for a complex idea
- You want creative work tied to organizational goals, not decoration

**How this connects** This work frequently supports eLearning, strategy and growth, and professional learning.

**CTA** Talk With Our Team

**Optional external link label** Explore the media microsite

---

## About page copy

### Headline

A long-term partner for mission-driven learning and growth

### Body

Integral Ed works with schools, nonprofits, workforce organizations, and adjacent mission-driven teams that need more than a narrow vendor.

For more than fifteen years, we have helped organizations design learning experiences, strengthen communications, support implementation, and grow into new channels. Much of our work begins with eLearning, online learning, or blended learning. Over time, clients often rely on us more broadly because the needs around learning are rarely isolated. They touch systems, facilitation, messaging, strategy, and user experience.

We work as a connected team. Clients have a clear point of contact and access to the right expertise when it is needed. That means less fragmentation, better judgment, and work that stays aligned as priorities evolve.

### Values block

Use the company values in a concise format:

- Clear
- Kind
- Curious

These values should be presented as operating values, not decorative slogans.

---

## Approach page copy

### Headline

How we work

### Intro

We are structured to support complex work without making the process harder for clients.

### Sections

**Start with the real need** Some clients come to us for a course. Others come with a program idea, a training problem, a platform decision, or a communications challenge. We start with the real need in front of the team.

**Build the right team around it** Each engagement has a clear point of contact. From there, we bring in the right mix of instructional design, development, media, strategy, or systems support.

**Work in ways that are practical** We design for real users, real constraints, and actual implementation. We care about what gets used, not just what gets delivered.

**Grow with the partnership** Many of our client relationships expand over time. A single project can become a broader collaboration as organizations refine their programs, reach new audiences, or build new capacity.

---

## Portfolio page copy

### Headline

A curated portfolio of selected work

### Body

Our portfolio includes interactive demos, sample media, and project examples across eLearning, blended learning, professional learning, workforce development, communications, and digital systems.

Some examples are public. Many are curated or gated because they reflect client-specific work, implementation details, or materials that are more useful in the context of a real conversation.

If you would like access, tell us a bit about what you are exploring and we will point you to the most relevant examples.

### CTA labels

- Request Portfolio Access
- Talk With Our Team

---

## Contact page copy

### Headline

Tell us what you are building

### Intro

You do not need a perfect scope before reaching out.

Tell us what your organization is trying to launch, improve, translate, or scale. Let us know which service areas seem most relevant, or just tell us where the challenge sits right now.

---

## Implementation notes for Claude Code

1. Build reusable components for:

   - header
   - footer
   - hero
   - trust/logo strip
   - practice area cards
   - CTA bands
   - media placeholder blocks
   - connected capabilities section

2. Use descriptive content collections or JSON data where appropriate for:

   - practice areas
   - microsite links
   - footer navigation
   - form option lists

3. Create an obvious place in the codebase for future repo URL insertion and environment setup.

4. Add comments marking where current-site assets need to be ported.

5. Do not over-animate the site. Keep motion restrained and professional.

6. Keep the site readable and credible for education and nonprofit buyers. It should feel thoughtful, modern, and stable.

7. If you need to make judgment calls, prioritize:

   - clarity
   - trust
   - strong hierarchy
   - SEO for eLearning and blended learning
   - connected ecosystem logic

---

## Final instruction

Produce the repo so that it is ready for content and asset refinement, not as a throwaway mockup. The output should be implementation-ready and should respect the existing theme architecture in `/integralthemes`.

New Repository is at: [https://github.com/IntegralEd/integral-ed-main-site](https://github.com/IntegralEd/integral-ed-main-site)

