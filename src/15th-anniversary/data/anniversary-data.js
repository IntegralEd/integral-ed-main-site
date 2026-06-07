/* =============================================================================
 * Integral Ed 15th Anniversary Page Data
 * -----------------------------------------------------------------------------
 * This is the SINGLE place to add/edit the content that drives the page's
 * visualizations and overviews. David: fill in the blanks below. You do not
 * need to touch any HTML/CSS. The page reads from this file.
 *
 * Rules of thumb:
 *   - Keep the keys/structure as-is; just edit the values inside quotes.
 *   - Anything left as "" or [] simply renders empty / is skipped.
 *   - Years are numbers (2011), text is in "quotes".
 *   - To add an item, copy a { ... } block and tweak it.
 *   - Image paths are relative to the site root, e.g.
 *       "/assets/images/team/jane.jpg"
 *     Drop the files in src/assets/images/... and reference them here.
 *
 *   - Portfolio modal refs: any body copy can contain
 *       [ref:slug]Display text[/ref]
 *     where slug is a key in the `portfolio:` block below. The page wraps the
 *     display text in a clickable link that opens the modal with that project.
 *
 * NOTE: This page is for our biz-dev / client list (clients can see each
 * other), so it intentionally carries NO per-client or per-year dollar
 * figures. Keep it that way.
 * ============================================================================= */

window.ANNIVERSARY_DATA = {

  /* ---------------------------------------------------------------------------
   * 0) PAGE META: hero headline + the big animated counters up top
   * ------------------------------------------------------------------------- */
  meta: {
    foundedYear: 2011,
    anniversaryYear: 2026,
    eyebrow: "2011-2026",
    headline: "Fifteen years helping organizations learn, adapt, and grow.",
    subhead: "From one analyst with a laptop to a 21-person studio building blended, media-rich, AI-assisted learning. Here's the road we've traveled together.",
    // Big numbers that count up on load. label is shown under the number.
    counters: [
      { value: 15,  suffix: "",  label: "Years growing together" },
      { value: 180, suffix: "+", label: "Engagements delivered" },   // REVIEW: rounded, no $ shown
      { value: 100, suffix: "+", label: "Partner organizations" },   // REVIEW: rounded
      { value: 21,  suffix: "",  label: "Teammates today" }
    ]
  },

  /* ---------------------------------------------------------------------------
   * 1) HISTORY: the scrolling timeline (2011 to 2026)
   *    Drafted from the Dec 2024 newsletter + our records. David: edit wording.
   * ------------------------------------------------------------------------- */
  // NOTE: any teammate's full name written in these bodies is automatically
  // turned bold + linked to their /team/ profile (with a hover preview) by the
  // page script. Just write the name plainly, e.g. "Asha Kelly".
  //
  // Portfolio modal refs use the [ref:slug]Display text[/ref] markup. See the
  // `portfolio:` block at the bottom of this file for the available slugs.
  timeline: [
    {
      year: 2011,
      title: "Integral Ed begins",
      body: "David Malbin opens the doors as a one-person analytics shop, helping education organizations make sense of their data.",
      image: "",
      tag: "Founding"
    },
    {
      year: 2013,
      title: "Partnering with CMOs",
      body: "We begin working with charter management organizations on assessment-driven learning, data-driven instruction, and assessment reporting.",
      image: "",
      tag: "Assessment"
    },
    {
      year: 2014,
      title: "Curriculum takes root",
      body: "Ava Millstone joins to lead curriculum, and the work grows from analysis into building the slides, guides, and facilitator materials our partners teach from.",
      image: "",
      tag: "First hire"
    },
    {
      year: 2015,
      title: "The team grows",
      body: "Alicia Chipman joins, expanding our curriculum-design capacity, and April Graham joins, growing our postsecondary ideation and access work.",
      image: "",
      tag: "Team"
    },
    {
      year: 2016,
      title: "First major postsecondary mentoring project",
      body: "We deliver our first major postsecondary partnership with national nonprofit iMentor, building the [ref:identityWayfinding]Identity Exploration and Wayfinding[/ref] curriculum that anchors their multigrade mentoring program.",
      image: "",
      tag: "iMentor"
    },
    {
      year: 2017,
      title: "A breakout year",
      body: "Creative Director Asha Kelly joins, bringing design and media to our curriculum and print media; we sign our first six-figure contracts; and our NMSI partnership deepens with [ref:apForAll]AP For All Curriculum Materials[/ref], NGSS-aligned modules supporting nationwide AP-access expansion.",
      image: "",
      tag: "Milestone"
    },
    {
      year: 2018,
      title: "Our first app & LMS",
      body: "We build our first app and launch our first learning management system with [ref:ttk]The Teaching Kitchen[/ref], including mobile-adaptive training materials.",
      image: "",
      tag: "Platforms"
    },
    {
      year: 2019,
      title: "eLearning & STEM take off",
      body: "Nadia Zaid joins and we launch our first eLearning project for Early Learning Indiana, [ref:leadPaint]Lead Paint Awareness for Indiana ECE Providers[/ref]; Cara Johnson joins, bringing a fresh take on [ref:ngssScience]NGSS pedagogy[/ref] and building out our STEM specialization with [ref:nano]Nano: Virtual Reality Science Labs[/ref]; and our PLTW work deepens professional-development alignment.",
      image: "",
      tag: "eLearning"
    },
    {
      year: 2020,
      title: "The crisis turn to LMS",
      body: "When the world went remote, we helped partners stand up learning management systems and move whole programs online, fast, as Erin McIntee joins, bringing expert, complex Storyline development.",
      image: "",
      tag: "COVID pivot"
    },
    {
      year: 2021,
      title: "Media & adult learning",
      body: "Michaela Bradley joins and we build out in-house media production, while Morgan Taveras brings adult-learning expertise and character-driven design.",
      image: "",
      tag: "Growth"
    },
    {
      year: 2022,
      title: "Chat-based learning and the KIPP Forward partnership",
      body: "We begin our partnership with KIPP Forward, designing the [ref:kippIntro]Introduction to KIPP Forward[/ref] course for high-school counselors. We also start experimenting with chat-based interviews and agentic feedback to tailor last-mile customization and personalization, including the [ref:careerIkigai]Career Ikigai personalized pathway tool[/ref].",
      image: "",
      tag: "KIPP / Agentic"
    },
    {
      year: 2023,
      title: "Mastering the blend",
      body: "Mastering the blend is about designing materials for live facilitation and making the most of async modules to prepare and extend live sessions, bringing them closer to on-the-ground application.",
      image: "",
      tag: "Growth"
    },
    {
      year: 2024,
      title: "Agentic learning meets custom platforms",
      body: "The StriveTogether Continuous Improvement Toolkit ships with scenario-based interactions and an AI-powered chatbot: learning that responds. The [ref:premiumPortal]Premium Portal[/ref] for Popped! also goes live, delivering tiered free and premium media to parents of kids with dyslexia on a custom subscription platform.",
      image: "",
      tag: "AI / Platforms"
    },
    {
      year: 2025,
      title: "Technical capacity meets storytelling",
      body: "Our Technical Capacity & Storytelling practice comes online, pairing design systems, branded portals, and field-facing publications with SME interviews and narrative craft. Two examples: the [ref:bmoreGetItDocumented]B'more for Healthy Babies Get It Documented[/ref] digital hub for technical capacity, and the [ref:biasAwarenessECE]Raising Awareness of Bias in Early Childhood Education[/ref] mixed-media video series for Buncombe Partnership for Children for storytelling.",
      image: "",
      tag: "Technical Capacity & Storytelling"
    },
    {
      year: 2026,
      title: "Fifteen years on",
      body: "A 21-person studio spanning instructional design, eLearning, media, platforms, and strategy, still growing together.",
      image: "",
      tag: "Today"
    }
  ],

  /* ---------------------------------------------------------------------------
   * 2) EVOLUTION: the capability-growth visualization (stacked, additive)
   *    Each stage = a new thing the company could newly do.
   * ------------------------------------------------------------------------- */
  // These are the "subway lines" in the Evolution map: each is a capability we
  // added and never retired. They start at their year and run to today, weaving
  // together as we increasingly blend media, print, and facilitated learning.
  evolution: [
    {
      id: "data",
      year: 2011,
      stage: "Data & analysis",
      tagline: "One person, one laptop.",
      whatWeCouldDo: "Turn messy program data into clear, decision-ready insight.",
      proof: "The founding service: analytics for mission-driven education orgs.",
      color: "blue"
    },
    {
      id: "curriculum",
      year: 2014,
      stage: "Curriculum & facilitation",
      tagline: "Slides, guides, facilitator kits.",
      whatWeCouldDo: "Design the curriculum and facilitator materials partners teach from.",
      proof: "Ava Millstone joins to lead curriculum and learning design.",
      color: "teal"
    },
    {
      id: "media",
      year: 2017,
      stage: "Media & print",
      tagline: "Design, video, print media.",
      whatWeCouldDo: "Bring design, motion, and print-media craft to every learning experience.",
      proof: "Creative Director Asha Kelly joins; Michaela Bradley later builds out in-house media production.",
      color: "magenta"
    },
    {
      id: "elearning",
      year: 2019,
      stage: "eLearning & STEM",
      tagline: "Interactive, blended, at scale.",
      whatWeCouldDo: "Build interactive, self-paced modules, including STEM-specialized experiences, that scale beyond the room.",
      proof: "Nadia Zaid joins for our first eLearning build with Early Learning Indiana; Cara Johnson grows our STEM specialization with Nano.",
      color: "yellow"
    },
    {
      id: "agentic",
      year: 2023,
      stage: "Chat interactions and agentic feedback",
      tagline: "Chat-based interviews, AI-assisted learning.",
      whatWeCouldDo: "Add chat-based interviews and AI-powered feedback so learning responds in real time and tailors to each learner.",
      proof: "Career Ikigai personalized pathway tool; the StriveTogether CI Toolkit later ships with an AI-powered chatbot.",
      color: "plum"
    },
    {
      id: "apps",
      year: 2024,
      stage: "Apps & custom platforms",
      tagline: "Dashboards, custom LMS, agentic feedback.",
      whatWeCouldDo: "Design custom apps, data dashboards, and bespoke LMS builds, with agentic feedback wrapped around the learning.",
      proof: "App design for data dashboards, custom LMS, and agentic feedback join the toolkit.",
      color: "sky"
    },
    {
      id: "techCapacity",
      year: 2025,
      stage: "Technical Capacity and Storytelling",
      tagline: "TA, design systems, and narrative for the field.",
      whatWeCouldDo: "Pair technical assistance with brand-grade storytelling: design systems, branded portals, print + web ecosystems, and field-facing publications that turn partner expertise into shareable practice.",
      proof: "B'more for Healthy Babies “Get It Documented” digital hub: SME interviews synthesized into seven branded publications + a content portal integrated into BHB's site.",
      color: "orange"
    }
  ],

  /* ---------------------------------------------------------------------------
   * 3) WORK: proudest projects (3-6). Anything with a live URL/demo/video
   *    can be embedded right on the page.
   *    David: add embed/video/case-study URLs when you have them.
   * ------------------------------------------------------------------------- */
  // Each card opens the project modal (same modal used by the [ref:slug] links
  // in the timeline). Until you have a live demo/case-study URL, `href` points
  // to the most relevant service page so every card goes somewhere real. Just
  // paste the YouTube embed URL into `videoUrl` and it appears inline.
  projects: [
    {
      title: "Continuous Improvement Toolkit for Educators",
      client: "StriveTogether",
      year: 2024,
      serviceArea: "eLearning & Blended Learning",
      summary: "A flagship blend: broadcast-quality video, scenario-based interactions, and an AI-powered chatbot that coaches educators through continuous-improvement cycles. The toolkit translates StriveTogether's methodology into learning that responds.",
      image: "",                         // /assets/images/work/...
      href: "/services/elearning/",      // TODO: swap to live e-learning demo / case-study URL
      embedUrl: "",                      // optional: inline e-learning demo to embed
      videoUrl: "",                      // TODO: paste YouTube embed URL when ready
      link: ""                           // optional: case study URL
    },
    {
      title: "Black Wall Street Multi-Year Curriculum",
      client: "Greenwood Leadership Academy",
      year: null,                        // CONFIRM year if known
      serviceArea: "eLearning & Blended Learning",
      summary: "We partnered with Greenwood Leadership Academy, a Pre-K through 5th grade school of the Tulsa Public Schools. We helped to create a blended history project consisting of a multi-year learning journey for Pre-K through Grade 5 that connects scholars to the history and pride of their community. By leveraging storytelling, blended learning strategies, and innovative media tools, the Black Wall Street Multi-Year Curriculum stands as a model for culturally responsive education, empowering both students and teachers to explore and honor their community's past.",
      image: "",
      href: "/services/elearning/",
      embedUrl: "",
      videoUrl: "https://www.youtube.com/embed/L6ieouQDqbs",
      link: "https://sites.google.com/integral-ed.com/glablackwallstreet/home"
    },
    {
      title: "Energy Scavenger Hunt",
      client: "AFS",
      year: null,                        // CONFIRM year
      serviceArea: "Career Connected Learning",
      summary: "A gamified, exploration-based learning experience that sends learners hunting for the energy concepts hidden in the world around them, turning a technical subject into hands-on, curiosity-driven discovery.",
      image: "",
      href: "/services/career-pathways/", // TODO: swap to live demo URL
      embedUrl: "",
      videoUrl: "",                      // TODO: paste YouTube embed URL when ready
      link: ""
    },
    {
      title: "KIPP Forward: National Counseling Institute",
      client: "KIPP",
      year: 2022,                        // partnership began 2022 (per KIPP Forward)
      serviceArea: "Career Connected Learning",
      summary: "Since 2022, the design partner behind KIPP Forward's National Counseling Institute: asynchronous training modules, newly designed anchor graphics, and live facilitation rooted in role plays and real student case studies. The work grows equity-focused, student-centered counseling across KIPP high schools, and has since scaled into a regional train-the-trainer model.",
      image: "",
      href: "/services/career-pathways/", // TODO: swap to live case-study URL
      embedUrl: "",
      videoUrl: "",                      // TODO: paste YouTube embed URL when ready
      link: ""
    }
    // READY TO ADD: the "Nano" STEM highlight (from Cara's STEM work).
    // Uncomment and confirm details + a demo URL, then it appears as a 5th card.
    // ,{
    //   title: "Nano",
    //   client: "",                      // CONFIRM client/partner
    //   year: null,                      // CONFIRM year
    //   serviceArea: "eLearning & Blended Learning",
    //   summary: "",                     // CONFIRM short description
    //   image: "",
    //   href: "",                        // demo / case-study URL
    //   embedUrl: "", videoUrl: "", link: ""
    // }
  ],

  /* ---------------------------------------------------------------------------
   * 3b) PORTFOLIO: items referenced by [ref:slug] markup in timeline copy
   *     Each entry uses the same fields as a `projects` item, so the same
   *     modal-fill logic applies.
   *
   *     Media rules:
   *       - `videoUrl` is a YouTube embed URL: https://www.youtube.com/embed/<ID>
   *         (the player appears inline in the modal)
   *       - `embedUrl` is any other iframe-able URL (Storyline launch URL, etc.)
   *       - Leave both blank and the modal shows just title + summary + link out.
   *
   *     Content extracted from DemoPortfolio Airtable Portfolio Items table
   *     (base appOgP4MmHeJgCEUt), via the CSV snapshot in this folder.
   * ------------------------------------------------------------------------- */
  portfolio: {
    ttk: {
      title: "Mobile Adaptive Training from The Teaching Kitchen",
      client: "Lenox Hill Neighborhood House",
      year: 2018,
      serviceArea: "eLearning & Blended Learning",
      summary: "We partnered with Lenox Hill Neighborhood House, a nonprofit that provides an extensive array of effective and integrated human services. We helped design and develop a mobile app to support cooks and kitchen staff to learn “farm to institution” cooking from the Teaching Chefs of The Teaching Kitchen. Our team attended live trainings, filmed cooking demos and produced this mixed program as an app and web-accessible LMS for nonprofits across the nation. This video provides a walkthrough of our eLearning Design for the mobile app.",
      videoUrl: "https://www.youtube.com/embed/1vV-02hOXdI",
      link: ""
    },
    leadPaint: {
      title: "Lead Paint Awareness for Indiana ECE Providers",
      client: "Early Learning Indiana",
      year: 2019,
      serviceArea: "eLearning & Blended Learning",
      summary: "We partnered with Early Learning Indiana, an organization dedicated to providing the highest quality early care and education from infancy to pre-K in Indianapolis and West Lafayette-area centers. We helped Early Learning Indiana with these efforts by creating a scenario-based eLearning for child care facilities in the state of Indiana. Our team produced this scenario-based quiz designed to reduce lead toxicity in children and summatively assess the learner at the end of the quiz.",
      embedUrl: "https://integral-elearning.space/demo/lead_scenario/story.html",
      videoUrl: "",
      link: ""
    },
    nano: {
      title: "Nano: Virtual Reality Science Labs",
      client: "Lighthaus",
      year: 2019,
      serviceArea: "eLearning & Blended Learning",
      summary: "We partnered with Lighthaus Inc., a leader in top quality game-powered immersive learning. We helped support curriculum design for Nano, a VR science game with real science in its DNA by Lighthaus Inc.. We were proud to support classroom curriculum design as Lighthaus rigorously tested their beliefs about immersive science learning with innovation grants from the National Institutes of Health and the U.S. Department of Education. As an example of collateral produced through this partnership, our team generated the dynamic video, “NANO Virtual Reality Science”.",
      videoUrl: "https://www.youtube.com/embed/kNpS80n8z6k",
      link: ""
    },
    apForAll: {
      title: "AP For All Curriculum Materials",
      client: "NMSI",
      year: 2017,
      serviceArea: "K-12 Academic Curriculum, Educator Training",
      summary: "We collaborated with the National Math and Science Initiative (NMSI), a non-profit organization dedicated towards advancing STEM through strengthened STEM educators. Our team worked with subject matter experts to design and develop sets of printable materials. These materials include teacher guidance, student workbooks, pacing guides, and professional development documents for both presenters and participants. As an example of collateral produced through this partnership, our team generated these Instructor-Led Training materials consisting of a presenter handbook, student workbook, and participant workbook.",
      image: "/assets/images/anniversary/nmsi-mockup.png",
      videoUrl: "",
      link: ""
    },
    identityWayfinding: {
      title: "Identity Exploration and Wayfinding",
      client: "iMentor",
      year: 2016,
      serviceArea: "Post-Secondary Ideation",
      summary: "From 2017-2019 we partnered with iMentor to revise and align and rebuild curricula for their national 2-year and 4-year program models, including all curricular content for high-school students and their mentors. Goals and outcomes for this curriculum focused on college-fit, soft-skills, transition from high-school and college success.",
      videoUrl: "https://www.youtube.com/embed/MmePkbDCIWE",
      link: ""
    },
    premiumPortal: {
      title: "Premium Portal: Free and Premium Media for Parents of Kids with Dyslexia",
      client: "Clever Noodle (Popped!)",
      year: 2025,
      serviceArea: "Custom Platform, Digital Transformation",
      summary: "Welcome to the Clever Noodle Portal, a tailored platform we designed to support both free and premium experiences for parents. This portal integrates seamlessly with Stripe for secure payment processing and AirTable for efficient data management. It provides a user-friendly interface where parents can access a variety of educational resources and tools. The portal allows for easy tracking of progress and activities, with features that enhance interaction and engagement. Whether opting for the free version or subscribing to premium content, users benefit from a streamlined experience tailored to support educational needs.",
      videoUrl: "https://www.youtube.com/embed/GxXxpQSeyhw",
      link: ""
    },
    kippIntro: {
      title: "Introduction to KIPP Forward",
      client: "KIPP Forward",
      year: 2022,
      serviceArea: "eLearning & Blended Learning",
      summary: "We collaborated with KIPP Forward in their efforts to provide high school students with quality curriculum, guidance with college selection and transition, and access to partners that support students with their college and career journey. As an example of collateral produced through this partnership, we created this website-style course that uses attractive visuals, video, and embedded interactions to increase engagement of learners.",
      embedUrl: "https://integral-elearning.space/demo/intro_kipp_forward_rise/content/index.html",
      videoUrl: "",
      link: ""
    },
    careerIkigai: {
      title: "Career Ikigai: Personalized Pathway Tool",
      client: "Integral Ed",
      year: 2022,
      serviceArea: "Chat-Based Learning, Agentic Feedback",
      summary: "Career Ikigai is a chat-based learning experience that guides users through a structured interview to surface interests, strengths, and goals. The system synthesizes responses into personalized pathways, actionable next steps, and a formatted slide output that can be edited and shared with advisors or mentors. Designed for use in counseling, advising, and workforce programs, it can connect to localized job market data and support cohort-level insights through shared outputs and dashboards.",
      embedUrl: "https://career-ikigai.org/",
      videoUrl: "",
      link: "https://career-ikigai.org/"
    },
    ngssScience: {
      title: "Update your hypothesis about science pedagogy",
      client: "NMSI / NGSS context",
      year: 2019,
      serviceArea: "Curriculum Development, K-12 STEM",
      summary: "Most of us engaging with NGSS curriculum find ourselves wondering, “So, when do students make a hypothesis?” The answer is that sometimes they don’t, and scientists don’t always start from hypotheses either.\n\nWe can credit John Dewey for the scientific method, though maybe he didn’t mean for it to be taught dogmatically for a century. Dewey readily admitted he was a non-scientist. In fact, that may be what made his work so accessible and attractive to high-school teachers, as our public schools massively increased the number of students served, and his articulation became the “scientific method”.\n\nIn a detailed and character-driven book, How We Teach Science: What’s Changed, and Why It Matters, John Rudolph details how this dated approach has undermined public support for science. Rudolph points out that real scientists were never comfortable with teaching only the scientific method. Pretending that all science begins with a testable hypothesis, and follows a consistent set of steps, teachers have oversimplified science, which has had longterm effects on our ability to navigate scientifically complex issues like climate change.\n\nClimate science and evolution require a broader range of observation, reasoning, and inferencing, not an if-then hypothesis. Because of the enduring success of the scientific method, climate and evolution deniers can sound like academic skeptics seeking to frame these complex issues with a simplistic if-then hypothesis and explanation.\n\nThe crosscutting concepts of the NGSS as well as the Science and Engineering Practices (SEPs) are a laudable effort to replace the scientific method with a more nuanced understanding of the many and varied ways science works. NGSS synthesize several trends in science and pedagogy that have been evolving since we started teaching science in the US. In the spirit of John Dewey, here’s a non-scientist’s oversimplified synthesis of how we got here.",
      image: "/assets/images/anniversary/ngss-infographic-2019.png",
      videoUrl: "",
      link: ""
    },
    bmoreGetItDocumented: {
      title: "B'more for Healthy Babies: Get It Documented",
      client: "B'more for Healthy Babies",
      year: 2025,
      serviceArea: "Technical Capacity, Storytelling, Web + Print Design",
      summary: "We partnered with B'more for Healthy Babies to create Get It Documented, a digital hub making complex public health data clear and usable for organizations improving maternal and infant health.\n\nOur team conducted over twenty hours of interviews with BHB leaders, synthesizing a decade of lessons into seven designed publications. Each combines storytelling with technical resources to help other communities replicate successful practices.\n\nIntegral Ed also built a branded content portal integrated into BHB's site, providing easy access to reports, media, and archived resources.",
      videoUrl: "",
      link: "https://www.healthybabiesbaltimore.com/hub/home"
    },
    biasAwarenessECE: {
      title: "Raising Awareness of Bias in Early Childhood Education",
      client: "Buncombe Partnership for Children",
      year: 2023,
      serviceArea: "Video Storytelling, Educator Training",
      summary: "We joined forces with Buncombe Partnership for Children, an organization dedicated to partnering with local organizations to improve early childhood education, early care, literacy opportunities, family support, and more. We helped produce a three-part video series for Early Care and Education (ECE) providers to prompt discussion about racial biases within early childhood care centers in Asheville, N.C.\n\nWe conducted interviews on Zoom, working from low-fidelity video and audio recordings. Our approach blends mixed media and illustration, designed to foster a sense of identification and generalization without casting blame.",
      videoUrl: "https://www.youtube.com/embed/videoseries?list=PLAR-tdNHAf2ag6w7MPqxCgc419GgcK3aB",
      link: "https://www.youtube.com/playlist?list=PLAR-tdNHAf2ag6w7MPqxCgc419GgcK3aB"
    }
  },

  /* ---------------------------------------------------------------------------
   * 4) TEAM: tenure-trend chart + teammate cards
   *    headcountByYear = cumulative team size at year end (from our roster).
   *    members = current team; "since" drives tenure.
   * ------------------------------------------------------------------------- */
  team: {
    headcountByYear: [
      { year: 2011, total: 1 },
      { year: 2014, total: 2 },
      { year: 2015, total: 4 },
      { year: 2016, total: 5 },
      { year: 2017, total: 6 },
      { year: 2018, total: 7 },
      { year: 2019, total: 9 },
      { year: 2020, total: 10 },
      { year: 2021, total: 12 },
      { year: 2022, total: 14 },
      { year: 2023, total: 17 },
      { year: 2024, total: 20 },
      { year: 2026, total: 21 }
    ],
    // image + href are sourced from the live team directory (src/team/_data/team.json):
    //   photo  = /assets/team/<slug>.<jpg|png>     vanity = /team/<slug>/
    members: [
      { name: "David Malbin",        role: "Founder",                                          dept: "Back Office",          since: 2011, image: "/assets/team/davidmalbin.jpg",        href: "/team/davidmalbin/",        bio: "Started Integral Ed as a one-person analytics shop in 2011." },
      { name: "Ava Millstone",       role: "Senior Director of Curriculum",                    dept: "Instructional Design", since: 2014, image: "/assets/team/avamillstone.jpg",       href: "/team/avamillstone/",       bio: "Leads curriculum and learning design; 20+ years in the field and a PDSA devotee." },
      { name: "April Graham",        role: "Instructional Designer",                           dept: "Instructional Design", since: 2015, image: "/assets/team/aprilgraham.jpg",        href: "/team/aprilgraham/",        bio: "" },
      { name: "Alicia Chipman",      role: "Project Director",                                 dept: "Instructional Design", since: 2015, image: "/assets/team/aliciachipman.jpg",      href: "/team/aliciachipman/",      bio: "" },
      { name: "Tara Williams",       role: "Senior Director of Partnerships",                  dept: "Project Director",     since: 2016, image: "/assets/team/tarawilliams.jpg",       href: "/team/tarawilliams/",       bio: "" },
      { name: "Asha Kelly",          role: "Creative Director",                                dept: "UX / Media Design",    since: 2017, image: "/assets/team/ashakelly.jpg",          href: "/team/ashakelly/",          bio: "" },
      { name: "Jody Walls",          role: "Head of Accounting",                               dept: "Back Office",          since: 2018, image: "/assets/team/jodywalls.jpg",          href: "/team/jodywalls/",          bio: "" },
      { name: "Cara Johnson",        role: "Project Director of STEM Learning & Innovation",   dept: "eLearning / LMS",      since: 2019, image: "/assets/team/carajohnson.png",        href: "/team/carajohnson/",        bio: "" },
      { name: "Nadia Zaid",          role: "Senior Director of eLearning",                     dept: "eLearning / LMS",      since: 2019, image: "/assets/team/nadiazaid.jpg",          href: "/team/nadiazaid/",          bio: "" },
      { name: "Erin McIntee",        role: "Instructional Designer, Senior eLearning Developer", dept: "eLearning / LMS",    since: 2020, image: "/assets/team/erinmcintee.jpg",        href: "/team/erinmcintee/",        bio: "" },
      { name: "Morgan Taveras",      role: "Director of Integrated Adult Learning",            dept: "Instructional Design", since: 2021, image: "/assets/team/morgantaveras.jpg",      href: "/team/morgantaveras/",      bio: "Known for character-driven, story-first learning design." },
      { name: "Michaela Bradley",    role: "Senior Video Editor",                              dept: "UX / Media Design",    since: 2021, image: "/assets/team/michaelabradley.jpg",    href: "/team/michaelabradley/",    bio: "" },
      { name: "Whitney Henderson",   role: "Senior Advisor",                                   dept: "Project Director",     since: 2022, image: "/assets/team/whitneyhenderson.jpg",   href: "/team/whitneyhenderson/",   bio: "" },
      { name: "Dinky Cruz-Cada",     role: "Storyline Developer",                              dept: "eLearning / LMS",      since: 2022, image: "/assets/team/dinkycruzcada.jpg",      href: "/team/dinkycruzcada/",      bio: "" },
      { name: "Shanna Schlossberg",  role: "Content Specialist",                               dept: "UX / Media Design",    since: 2023, image: "/assets/team/shannaschlossberg.jpg",  href: "/team/shannaschlossberg/",  bio: "" },
      { name: "Jo Barnett",          role: "Senior Content Specialist",                        dept: "UX / Media Design",    since: 2023, image: "/assets/team/jobarnett.png",          href: "/team/jobarnett/",          bio: "" },
      { name: "Diane Takata Powell",  role: "Senior Advisor",                                   dept: "Project Director",     since: 2023, image: "/assets/team/dianetakatapowell.jpg",  href: "/team/dianetakatapowell/",  bio: "A client-turned-teammate from UnboundEd." },
      { name: "Luciana Santimaria",  role: "Senior Storyline Developer",                       dept: "eLearning / LMS",      since: 2024, image: "/assets/team/lucianasantimaria.jpg",  href: "/team/lucianasantimaria/",  bio: "" },
      { name: "Chelsea George",      role: "Curriculum Associate",                             dept: "eLearning / LMS",      since: 2024, image: "/assets/team/chelseageorge.png",      href: "/team/chelseageorge/",      bio: "" },
      { name: "Maddie Murphy",       role: "Curriculum Associate",                             dept: "eLearning / LMS",      since: 2024, image: "/assets/team/maddiemurphy.jpg",       href: "/team/maddiemurphy/",       bio: "Joined in 2024; roots with the Three Affiliated Tribes of North Dakota." },
      { name: "Emily Kiefer",        role: "Curriculum Associate",                             dept: "Instructional Design", since: 2026, image: "/assets/team/EmilyK.png",            href: "/team/emilykiefer/",        bio: "Our newest teammate." }
    ]
  },

  /* ---------------------------------------------------------------------------
   * 5) CLIENTS: featured stories + the full logo set.
   * ------------------------------------------------------------------------- */
  clients: {
    featured: [
      {
        name: "StriveTogether",
        logo: "/assets/images/client-logos/StriveTogether-Brandmark-w-tag-RGB-Grey-orange-1%20(1).png",
        story: "We translated StriveTogether's continuous-improvement methodology into an interactive toolkit for educators: video, scenario-based practice, and an AI-powered chatbot that coaches in real time.",
        quote: "Integral Ed does an amazing job of understanding who we are as an organization. They thoughtfully translate our content into interactive courses that take our work to the next level.",
        quoteAttribution: "Heidi Black, VP of Training, StriveTogether",
        since: null
      },
      {
        name: "EL Education",
        logo: "/assets/images/client-logos/EL_EDUCATION_logo_crimson_preferred%20(4).png",
        story: "A go-to partner for EL Education's professional-learning products, translating their content into polished, ready-to-use learning experiences their team can lean on.",
        quote: "You guys are our easy button!",
        quoteAttribution: "Natalie Taylor, Program Team (Professional Learning Products), EL Education",
        since: null
      },
      {
        name: "KIPP",
        logo: "/assets/images/client-logos/KIPP%20Logo.png",
        story: "Since 2022, a central partner to KIPP Forward's National Counseling Institute, with Whitney Henderson directing the work: asynchronous modules, newly designed anchor graphics, and live, role-play-rich facilitation built on real student case studies that grow equity-focused, student-centered counseling across KIPP high schools.",
        quote: "Integral Ed's responsiveness to our evolving needs, and deep commitment to educational equity have made them an exceptional partner.",
        quoteAttribution: "Sarah Gomez, M.Ed., Interim Senior Director, KIPP Forward",
        since: 2022
      },
      {
        name: "Danielson Group",
        logo: "/assets/images/client-logos/Danielson%20Group%20-%20Horiz%20Logo_Color-RGB.avif",
        story: "Since 2020, Integral Ed has been the Danielson Group's insourced eLearning team, led by Tara Williams, carrying them from fully in-person delivery into blended and asynchronous formats: building every one of their e-learning courses, standing up their LMS, and shaping guidance documents downloaded by more than a million educators nationwide.",
        quote: "They have truly been critical partners in our growth and ongoing success.",
        quoteAttribution: "Dr. Lee Kappes, CEO, Danielson Group",
        since: 2020
      }
    ],
    // Logo wall (paths copied from the homepage logo strip)
    logos: [
      { name: "AFS",            logo: "/assets/images/client-logos/AFS%20Logo.png" },
      { name: "BHB",            logo: "/assets/images/client-logos/BHB%20logo.png" },
      { name: "CLEE",           logo: "/assets/images/client-logos/CLEE-Logo%20(1).svg" },
      { name: "Danielson Group",logo: "/assets/images/client-logos/Danielson%20Group%20-%20Horiz%20Logo_Color-RGB.avif" },
      { name: "Dreamscape Learn",logo:"/assets/images/client-logos/Dreamscape%20Learn%20Logo%20Color.png" },
      { name: "Edmentum",       logo: "/assets/images/client-logos/Edmentum%20Logo.png" },
      { name: "EIF",            logo: "/assets/images/client-logos/EIF%20Logo.png" },
      { name: "EL Education",   logo: "/assets/images/client-logos/EL_EDUCATION_logo_crimson_preferred%20(4).png" },
      { name: "Formation Ventures",logo:"/assets/images/client-logos/Formation+Ventures+logo.png" },
      { name: "Hope",           logo: "/assets/images/client-logos/HopeMain-Logo.avif" },
      { name: "iMentor",        logo: "/assets/images/client-logos/imentor%20logo.png" },
      { name: "KIPP",           logo: "/assets/images/client-logos/KIPP%20Logo.png" },
      { name: "Lenox Hill Neighborhood House", logo: "/assets/images/client-logos/Lenox%20Hill%20Neighborhood%20House%20logo.png" },
      { name: "Project Lead the Way", logo: "/assets/images/client-logos/projectLeadPLTW_logo.png" },
      { name: "MMCO",           logo: "/assets/images/client-logos/MMCO%20Logo.avif" },
      { name: "NMSI",           logo: "/assets/images/client-logos/NMSI%20Logo.png" },
      { name: "STRIVE",         logo: "/assets/images/client-logos/STRIVE%20logo.png" },
      { name: "StriveTogether", logo: "/assets/images/client-logos/StriveTogether-Brandmark-w-tag-RGB-Grey-orange-1%20(1).png" },
      { name: "The Tell",       logo: "/assets/images/client-logos/TheTellLogo.png" },
      { name: "UnboundEd",      logo: "/assets/images/client-logos/UnboundEd-final-logo-purple-print-version-scaled.png" },
      { name: "Veritas Prep",   logo: "/assets/images/client-logos/veritas%20prep%20logo.jpeg" }
    ]
  },

  /* ---------------------------------------------------------------------------
   * 6) SERVICE AREAS: today's offerings, shown in the sticky left-nav.
   * ------------------------------------------------------------------------- */
  serviceAreas: [
    { name: "eLearning & Blended Learning", href: "/services/elearning/" },
    { name: "Technical Assistance",         href: "/services/capacity/" },
    { name: "Career Connected Learning",    href: "/services/career-pathways/" },
    { name: "Growth Strategy",              href: "/services/strategy-and-growth/" },
    { name: "LMS & Platforms",              href: "/services/platforms/" },
    { name: "Media & Communications",       href: "/services/media-and-communications/" }
  ]

};
