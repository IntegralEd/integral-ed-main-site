/* =============================================================================
 * Integral Ed — 15th Anniversary Page Data
 * -----------------------------------------------------------------------------
 * This is the SINGLE place to add/edit the content that drives the page's
 * visualizations and overviews. David: fill in the blanks below. You do not
 * need to touch any HTML/CSS — the page reads from this file.
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
 * NOTE: This page is for our biz-dev / client list (clients can see each
 * other), so it intentionally carries NO per-client or per-year dollar
 * figures. Keep it that way.
 * ============================================================================= */

window.ANNIVERSARY_DATA = {

  /* ---------------------------------------------------------------------------
   * 0) PAGE META — hero headline + the big animated counters up top
   * ------------------------------------------------------------------------- */
  meta: {
    foundedYear: 2011,
    anniversaryYear: 2026,
    eyebrow: "2011 — 2026",
    headline: "Fifteen years helping organizations learn, adapt, and grow.",
    subhead: "From one analyst with a laptop to a 21-person studio building blended, media-rich, AI-assisted learning — here's the road we've traveled together.",
    // Big numbers that count up on load. label is shown under the number.
    counters: [
      { value: 15,  suffix: "",  label: "Years growing together" },
      { value: 180, suffix: "+", label: "Engagements delivered" },   // REVIEW: rounded, no $ shown
      { value: 100, suffix: "+", label: "Partner organizations" },   // REVIEW: rounded
      { value: 21,  suffix: "",  label: "Teammates today" }
    ]
  },

  /* ---------------------------------------------------------------------------
   * 1) HISTORY — the scrolling timeline (2011 → 2026)
   *    Drafted from the Dec 2024 newsletter + our records. David: edit wording.
   * ------------------------------------------------------------------------- */
  timeline: [
    {
      year: 2011,
      title: "Integral Ed begins",
      body: "David Malbin opens the doors as a one-person analytics shop — helping education organizations make sense of their data.",
      image: "",
      tag: "Founding"
    },
    {
      year: 2014,
      title: "Curriculum takes root",
      body: "Ava Millstone joins to lead curriculum, and the work grows from analysis into building the slides, guides, and facilitator materials our partners teach from.",
      image: "",
      tag: "First hire"
    },
    {
      year: 2016,
      title: "Building the foundations",
      body: "We begin producing media-rich, asynchronous learning — the foundation that everything since has been built on.",
      image: "",
      tag: "Era"
    },
    {
      year: 2017,
      title: "eLearning comes of age",
      body: "Creative Director Asha Kelly joins and our first interactive eLearning ships — blended, branded, and built to scale.",
      image: "",
      tag: "Milestone"
    },
    {
      year: 2020,
      title: "The crisis turn to LMS",
      body: "When the world went remote, we helped partners stand up learning management systems and move whole programs online, fast.",
      image: "",
      tag: "COVID pivot"
    },
    {
      year: 2023,
      title: "Mastering the blend",
      body: "A wave of new teammates joins as we hit our stride pairing live facilitation with self-paced, media-rich modules.",
      image: "",
      tag: "Growth"
    },
    {
      year: 2024,
      title: "Learning gets agentic",
      body: "The StriveTogether Continuous Improvement Toolkit ships with scenario-based interactions and an AI-powered chatbot — learning that responds.",
      image: "",
      tag: "AI / Agentic"
    },
    {
      year: 2026,
      title: "Fifteen years on",
      body: "A 21-person studio spanning instructional design, eLearning, media, platforms, and strategy — still growing together.",
      image: "",
      tag: "Today"
    }
  ],

  /* ---------------------------------------------------------------------------
   * 2) EVOLUTION — the capability-growth visualization (stacked, additive)
   *    Each stage = a new thing the company could newly do.
   * ------------------------------------------------------------------------- */
  evolution: [
    {
      id: "data",
      year: 2011,
      stage: "Data analysis",
      tagline: "One person, one laptop.",
      whatWeCouldDo: "Turn messy program data into clear, decision-ready insight.",
      proof: "The founding service — analytics for mission-driven education orgs.",
      color: "blue"
    },
    {
      id: "curriculum",
      year: 2014,
      stage: "Curriculum",
      tagline: "Slides, guides, handouts.",
      whatWeCouldDo: "Design the curriculum and facilitator materials partners teach from.",
      proof: "Ava Millstone joins to lead curriculum and learning design.",
      color: "teal"
    },
    {
      id: "elearning",
      year: 2017,
      stage: "eLearning",
      tagline: "Interactive, blended, at scale.",
      whatWeCouldDo: "Build interactive, self-paced modules that scale beyond the room.",
      proof: "Creative Director Asha Kelly joins; our first interactive courses ship.",
      color: "yellow"
    },
    {
      id: "media-tech",
      year: 2020,
      stage: "Media + Technical",
      tagline: "Video, marketing, platforms, systems.",
      whatWeCouldDo: "Produce broadcast-quality media and stand up the platforms that deliver it.",
      proof: "COVID-era LMS pivot moves whole programs online; media design becomes a growth engine for partners.",
      color: "magenta"
    },
    {
      id: "agentic",
      year: 2024,
      stage: "Agentic feedback",
      tagline: "Chatbots & AI-assisted learning.",
      whatWeCouldDo: "Add AI-powered feedback and conversation so learning responds in real time.",
      proof: "The StriveTogether CI Toolkit ships with an AI-powered chatbot.",
      color: "plum"
    }
  ],

  /* ---------------------------------------------------------------------------
   * 3) WORK — proudest projects (3-6). Anything with a live URL/demo/video
   *    can be embedded right on the page.
   *    David: add embed/video/case-study URLs when you have them.
   * ------------------------------------------------------------------------- */
  projects: [
    {
      title: "Continuous Improvement Toolkit for Educators",
      client: "StriveTogether",
      year: 2024,
      serviceArea: "eLearning & Blended Learning",
      summary: "A flagship blend: broadcast-quality video, scenario-based interactions, and an AI-powered chatbot that coaches educators through continuous-improvement cycles. The toolkit translates StriveTogether's methodology into learning that responds.",
      image: "",                         // /assets/images/work/...
      embedUrl: "",                      // TODO: e-learning demo URL
      videoUrl: "",                      // TODO: walkthrough video URL
      link: ""                           // TODO: case study URL
    },
    {
      title: "Black Wall Street History Experience",
      client: "GLA",                     // CONFIRM full client name
      year: null,                        // CONFIRM year
      serviceArea: "eLearning & Blended Learning",
      summary: "An interactive history experience bringing the story of Tulsa's Greenwood District — “Black Wall Street” — to life for learners: archival media, narrative, and exploration that turns history into something you move through, not just read.",
      image: "",
      embedUrl: "",                      // TODO: demo URL
      videoUrl: "",
      link: ""
    },
    {
      title: "Energy Scavenger Hunt",
      client: "AFS",
      year: null,                        // CONFIRM year
      serviceArea: "Career Connected Learning",
      summary: "A gamified, exploration-based learning experience that sends learners hunting for the energy concepts hidden in the world around them — turning a technical subject into hands-on, curiosity-driven discovery.",
      image: "",
      embedUrl: "",                      // TODO: demo URL
      videoUrl: "",
      link: ""
    },
    {
      title: "KIPP Forward — a five-year partnership",
      client: "KIPP",
      year: null,                        // CONFIRM span, e.g. 2019–2024
      serviceArea: "Career Connected Learning",
      summary: "Five years alongside KIPP supporting KIPP Forward — the work of guiding students beyond high school into college, career, and the choices that shape a life. A highlight partnership built on trust, iteration, and shared mission.",
      image: "",
      embedUrl: "",
      videoUrl: "",
      link: ""
    }
    // TODO: add/confirm details + drop in demo/video/case-study URLs above.
  ],

  /* ---------------------------------------------------------------------------
   * 4) TEAM — tenure-trend chart + teammate cards
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
      { name: "Emily Kiefer",        role: "Curriculum Associate",                             dept: "Instructional Design", since: 2026, image: "",                                   href: "/team/",                    bio: "Our newest teammate." }
    ]
  },

  /* ---------------------------------------------------------------------------
   * 5) CLIENTS — featured stories + the full logo set.
   * ------------------------------------------------------------------------- */
  clients: {
    featured: [
      {
        name: "StriveTogether",
        logo: "/assets/images/client-logos/StriveTogether-Brandmark-w-tag-RGB-Grey-orange-1%20(1).png",
        story: "We translated StriveTogether's continuous-improvement methodology into an interactive toolkit for educators — video, scenario-based practice, and an AI-powered chatbot that coaches in real time.",
        quote: "Integral Ed does an amazing job of understanding who we are as an organization. They thoughtfully translate our content into interactive courses that take our work to the next level.",
        quoteAttribution: "Heidi Black, VP of Training, StriveTogether",
        since: null
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
   * 6) SERVICE AREAS — today's offerings, shown in the sticky left-nav.
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
