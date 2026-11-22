import type { PortfolioContent } from "@/lib/portfolio-types";

/**
 * ============================================================================
 * PORTFOLIO CONTENT CONFIGURATION (SINGLE SOURCE OF TRUTH)
 * ============================================================================
 * Edit this file to update any front-page text, proof metrics, core strengths,
 * projects, links, media deliverables, or education entries.
 *
 * Tips:
 * - Images placed inside `/public` can be referenced as `/filename.png`.
 * - Items appear in the exact order listed here (top to bottom).
 * - To feature a project card at the top of Selected Work, set `featured: true`
 *   and provide an `imageUrl`.
 * - Save this file, push to GitHub, and Vercel will automatically rebuild.
 * ============================================================================
 */
export const portfolioData: PortfolioContent = {
  // --------------------------------------------------------------------------
  // 1. FRONT PAGE HERO, BUTTONS & PROFILE TEXT
  // --------------------------------------------------------------------------
  profile: {
    name: "George Tragkas",
    location: "Based in Greece",
    kickerTagline: "Economics · Front-End · Organic Growth",
    headline: "Economics, front-end engineering, and organic social growth.",
    subheadline:
      "Self-taught front-end developer holding a B.Sc. in Economics (UNIPI) and an M.Sc. in International Negotiations (AUEB) — turning analytical structure into web products, browser tools, and high-reach content.",
    primaryCtaLabel: "Explore Selected Work",
    primaryCtaHref: "#projects",
    resumeLabel: "Resume",
    resumeUrl:
      "https://drive.google.com/drive/folders/1r2muCN9AXZ5uaYmPtvd8hbW6ZDv2DK2q?usp=sharing",
    assessmentLabel: "Personal Assessment",
    assessmentUrl:
      "https://drive.google.com/file/d/16hjfc_AhMmSNzIQLl1ORHUXyMZSqEVIS/view?usp=sharing",
    heroImage: "/screenshot.png",
    heroImageTitle: "Instagram Organic Growth 2025",
    heroImageSubtitle: "Analytics Overview · 28.1M Views",
    heroImageExternalUrl: "https://www.instagram.com/georgiostragkas_/",
    heroCaption:
      "2025 Instagram Organic Funnel: 28.1M views · 83.1K profile visits · 217 Linktree visits · 111 Gumroad visits.",
    footerLocation: "Athens, Greece",
  },

  // --------------------------------------------------------------------------
  // 2. HERO PROOF METRICS (4-COLUMN STRIP UNDER THE HERO)
  // --------------------------------------------------------------------------
  metrics: [
    {
      value: "28.1M",
      label: "Organic Instagram Views (2025)",
    },
    {
      value: "83.1K",
      label: "Organic Profile Visits",
    },
    {
      value: "26",
      label: "Shipped Projects & Research",
      useProjectCount: true, // Automatically stays synced with the `projects` array below
    },
    {
      value: "B.Sc. + M.Sc.",
      label: "Economics (UNIPI) & Negotiations (AUEB)",
    },
  ],

  // --------------------------------------------------------------------------
  // 3. SECTION HEADINGS & SUBTITLES
  // --------------------------------------------------------------------------
  sectionHeadings: {
    strengthsTitle: "Core Strengths",
    strengthsSubtitle:
      "Three disciplines combined to research markets, build focused web software, and earn organic distribution.",
    projectsTitle: "Selected Work",
    projectsSubtitle:
      "Web apps, Chrome extensions, landing websites, and academic research.",
    mediaTitle: "Marketing & Visual Media",
    mediaSubtitle:
      "Campaign deliverables from the Meta Social Media Marketing Professional Certificate alongside selected visual assets.",
    linksTitle: "Digital Presence & Links",
    linksSubtitle:
      "Active social channels, digital products, and curated resources.",
    educationTitle: "Education & Credentials",
    educationSubtitle:
      "Academic degrees in economics and negotiations paired with engineering and marketing training.",
    archiveTitle: "Project Archive",
    archiveSubtitle:
      "Complete index of shipped web applications, Chrome extensions, websites, economics research, and templates.",
  },

  // --------------------------------------------------------------------------
  // 4. CORE STRENGTHS (3 PILLARS)
  // --------------------------------------------------------------------------
  strengths: [
    {
      number: "01",
      title: "Front-End & Product Execution",
      summary:
        "Self-taught developer shipping focused web applications, Chrome extensions, and fast landing websites with clean interfaces and practical utility.",
      proof: "University Database · Fiotiatora · 2 Chrome Extensions",
    },
    {
      number: "02",
      title: "Economics & Negotiation Strategy",
      summary:
        "Academic foundation in economics (UNIPI) and international negotiations (AUEB), applied to startup financing research, customer preference studies, and structured decision frameworks.",
      proof: "M.Sc. Thesis on Crowdfunding · Airbnb Preferences Research",
    },
    {
      number: "03",
      title: "Organic Growth & Social Systems",
      summary:
        "Meta Social Media Marketing certified practitioner building repeatable content funnels across audience personas, creative briefs, ads, and publishing calendars.",
      proof: "28.1M Organic Views · 83.1K Profile Visits in 2025",
    },
  ],

  // --------------------------------------------------------------------------
  // 5. PROJECTS (FEATURED VISUAL CARDS + FULL ARCHIVE INDEX)
  // Categories: "web-app" | "extension" | "website" | "finance" |
  //             "negotiations" | "real-estate" | "other"
  // --------------------------------------------------------------------------
  projects: [
    {
      id: "proj_lattly",
      title: "Lattly",
      year: "2024",
      category: "website",
      url: "https://tragkas.github.io/lattly/",
      description: "Minimalist landing website concept and interactive showcase.",
      imageUrl: "/lattly.gif",
      featured: true,
    },
    {
      id: "proj_startxub",
      title: "Startxub",
      year: "2024",
      category: "website",
      url: "https://tragkas.github.io/startxub/",
      description:
        "Startup ecosystem hub website built for clarity and fast navigation.",
      imageUrl: "/startxub.gif",
      featured: true,
    },
    {
      id: "proj_reset",
      title: "Your Personal Reset Button",
      year: "2024",
      category: "website",
      url: "https://resetbutton.carrd.co/",
      description:
        "Focused single-page digital product and personal reset experience.",
      imageUrl: "/reset.gif",
      featured: true,
    },
    {
      id: "proj_plumber",
      title: "Your Plumber",
      year: "2024",
      category: "website",
      url: "https://plumber-project-tawny.vercel.app/",
      description:
        "Local service landing page designed for direct customer inquiries.",
      imageUrl: "/plumber.gif",
      featured: true,
    },
    {
      id: "proj_linktree",
      title: "Airbnb Link Tree",
      year: "2024",
      category: "website",
      url: "https://airbnb-link-tree.vercel.app/",
      description:
        "Custom hospitality link hub tailored for short-term rental guests.",
      imageUrl: "/linktree.gif",
      featured: true,
    },
    {
      id: "proj_chrome_ext",
      title: "Chrome Extension Showcase",
      year: "2025",
      category: "extension",
      url: "https://chromewebstore.google.com/detail/bookmark-organizer/cbooolhmbfhplnkfedjohjinljbdjjcg?authuser=0&hl=en",
      description:
        "Product showcase and onboarding page for browser bookmark tools.",
      imageUrl: "/chrome.gif",
      featured: true,
    },
    {
      id: "proj_uni_db",
      title: "University Database",
      year: "2025",
      category: "web-app",
      url: "https://tragkas.github.io/uni-list/",
      description:
        "Searchable directory helping students compare university programs.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_fiotiatora",
      title: "Fiotiatora",
      year: "2025",
      category: "web-app",
      url: "https://fotiatora.vercel.app/",
      description:
        "Interactive web application built with modern front-end architecture.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_bookmark_search",
      title: "Free Extension - Bookmark Search",
      year: "2025",
      category: "extension",
      url: "https://chromewebstore.google.com/detail/bookmarks-search/jhhkfgmpoidofjjffbhllclflnbflhek",
      description:
        "Published Chrome extension for instant keyboard-first bookmark search.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_bookmark_manager",
      title: "Free Extension - Bookmark Manager",
      year: "2025",
      category: "extension",
      url: "https://chromewebstore.google.com/detail/bookmark-organizer/cbooolhmbfhplnkfedjohjinljbdjjcg?authuser=0&hl=en",
      description:
        "Published Chrome extension for structuring and organizing saved links.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_pitch_deck",
      title: "Free Startup Pitch Deck",
      year: "2024",
      category: "finance",
      url: "https://www.canva.com/design/DAFzf78TIbE/7k1yl8R-ONhc9b73dqHbbg/view?utm_content=DAFzf78TIbE&utm_campaign=designshare&utm_medium=link&utm_source=publishsharelink&mode=preview",
      description:
        "Open-access investor narrative and financial framing template.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_filo_filo",
      title: "Filo Filo",
      year: "2024",
      category: "website",
      url: "https://filofilo.gr/",
      description:
        "Brand website built for clarity, storytelling, and online discovery.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_airbnb_research",
      title: "Airbnb Customer Preferences Research",
      year: "2024",
      category: "real-estate",
      url: "https://drive.google.com/file/d/1gg3kcbGe1joklsd2MqbxcisPCYgHkTUj/view?usp=sharing",
      description:
        "Empirical research examining short-term rental guest decision factors.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_gmb_form",
      title: "Google My Business Profile Setup Form",
      year: "2024",
      category: "other",
      url: "https://github.com/tragkas/google-my-business-form",
      description:
        "Operational checklist and onboarding form for local search visibility.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_msc_pres",
      title: "M.Sc. Thesis: Presentation",
      year: "2023",
      category: "finance",
      url: "https://drive.google.com/file/d/1gNMXbkgEdYnmzXxRwzyK_oHjaGXagNr_/view?usp=drive_link",
      description:
        "Executive defense deck summarizing startup crowdfunding findings.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_msc_thesis",
      title: "M.Sc. Thesis: The role of crowdfunding in startup financing",
      year: "2023",
      category: "finance",
      url: "https://drive.google.com/file/d/15mJWRxRfo5xt7QJ8uTwZz8dP6Sbc9Ow6/view?usp=sharing",
      description:
        "Published AUEB master's thesis on alternative capital formation.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_osint",
      title:
        "Russia and Ukraine: Presentation using Open-source intelligence",
      year: "2023",
      category: "negotiations",
      url: "https://drive.google.com/file/d/1gI65aHoHWusjBCIXKvx7RIYF4ro7_kMV/view?usp=sharing",
      description:
        "Geopolitical negotiation analysis grounded in OSINT verification.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_random_date",
      title: "Random Date Ideas",
      year: "2023",
      category: "website",
      url: "https://tragkas.github.io/random-date/",
      description:
        "Lightweight interactive generator built with vanilla web standards.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_random_movie",
      title: "Random Movie Ideas",
      year: "2023",
      category: "website",
      url: "https://tragkas.github.io/random-movie/",
      description: "Fast single-purpose film discovery utility.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_free_resumes",
      title: "Free Resumes",
      year: "2023",
      category: "other",
      url: "https://github.com/tragkas/free-beige-black-white-resume",
      description: "Minimalist open-source resume templates.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_dispute",
      title: "Dispute Resolution Method",
      year: "2023",
      category: "negotiations",
      url: "https://github.com/tragkas/dispute-resolution-method",
      description:
        "Structured framework for principled negotiation and conflict resolution.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_risk_tolerance",
      title: "Investor's Risk Tolerance",
      year: "2023",
      category: "finance",
      url: "https://github.com/tragkas/investors-risk-tolerance",
      description:
        "Behavioral finance assessment model for portfolio allocation.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_discord",
      title: "Discord Server Template",
      year: "2022",
      category: "other",
      url: "https://discord.new/NNqa7yXtZcWB",
      description: "Pre-structured community workspace architecture.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_army",
      title: "Army Packing List",
      year: "2021",
      category: "other",
      url: "https://drive.google.com/file/d/1yMYKVh3pv9-HM-g_anlJxw1A7VnQbjTF/view?usp=sharing",
      description:
        "Practical preparation checklist widely shared for mandatory service.",
      imageUrl: "",
      featured: false,
    },
    {
      id: "proj_gtainside",
      title: "GTAinside | 230K+ Downloads",
      year: "2020",
      category: "other",
      url: "https://www.gtainside.com/user/iuser",
      description: "Community mods reaching over 230,000 organic downloads.",
      imageUrl: "",
      featured: false,
    },
  ],

  // --------------------------------------------------------------------------
  // 6. DIGITAL PRESENCE & RESOURCE LINKS
  // Groups: "social" | "channel" | "resource"
  // --------------------------------------------------------------------------
  links: [
    {
      id: "link_linkedin",
      label: "LinkedIn",
      group: "social",
      url: "https://www.linkedin.com/in/georgiostragkas",
      imageUrl: "/linkedin-pictue.png",
      description: "Professional background, certifications, and network.",
    },
    {
      id: "link_youtube",
      label: "YouTube",
      group: "channel",
      url: "https://www.youtube.com/@georgiostragkas",
      imageUrl: "/youtube-picture.png",
      description: "Long-form video projects and visual experiments.",
    },
    {
      id: "link_instagram",
      label: "Instagram",
      group: "social",
      url: "https://www.instagram.com/georgiostragkas_/",
      imageUrl: "/instagram-picture.png",
      description: "28.1M organic views in 2025 across short-form content.",
    },
    {
      id: "link_pinterest",
      label: "Pinterest",
      group: "channel",
      url: "https://gr.pinterest.com/georgiostragkas/",
      imageUrl: "/pinterest-picture.png",
      description: "Curated visual boards and aesthetic references.",
    },
    {
      id: "link_wealth",
      label: "Ladders of Wealth Creation",
      group: "resource",
      url: "https://roadmap.sh/r/ladders-of-wealth-creation",
      imageUrl: "",
      description:
        "Visual mental model roadmap on compounding skills and capital.",
    },
  ],

  // --------------------------------------------------------------------------
  // 7. VISUAL MEDIA GALLERY
  // Categories: "social-marketing" | "project-preview" | "analytics" | "other"
  // --------------------------------------------------------------------------
  media: [
    {
      id: "media_persona",
      title: "Customer Persona",
      category: "social-marketing",
      src: "/persona-pictue.jpg",
      alt: "Customer Persona deliverable from Meta Social Media Marketing Certificate",
      linkUrl:
        "https://drive.google.com/file/d/1QLGs4WzjNvMX3MrxqB2cmx2WZxHFMEgj/view?usp=drive_link",
    },
    {
      id: "media_brief",
      title: "Creative Brief",
      category: "social-marketing",
      src: "/brief-picture.jpg",
      alt: "Creative Brief deliverable from Meta Social Media Marketing Certificate",
      linkUrl:
        "https://drive.google.com/file/d/1fis9sjzQ059m2sFCpkjYbkNEQmpDm3Pl/view?usp=drive_link",
    },
    {
      id: "media_instaccount",
      title: "Instagram Account Setup",
      category: "social-marketing",
      src: "/instaccount-picture.jpg",
      alt: "Instagram Account setup deliverable",
      linkUrl:
        "https://drive.google.com/file/d/1TokCqboiu0WgQe-lNwRvLM7MKAS3VfYe/view?usp=drive_link",
    },
    {
      id: "media_instapost",
      title: "Instagram Post",
      category: "social-marketing",
      src: "/instapost-picture.jpg",
      alt: "Instagram Post creative asset",
      linkUrl:
        "https://drive.google.com/file/d/1ImXeyV0KyIgv5XBU_tKAk2tERjRXEM3s/view?usp=drive_link",
    },
    {
      id: "media_instaad",
      title: "Instagram Ad",
      category: "social-marketing",
      src: "/instaad-picture.jpg",
      alt: "Instagram Ad campaign deliverable",
      linkUrl:
        "https://drive.google.com/file/d/1x6TSADoxyinHkR4tF6khC_ZM8mr6l87y/view?usp=drive_link",
    },
    {
      id: "media_calendar",
      title: "Content Calendar",
      category: "social-marketing",
      src: "/calendar-picture.jpg",
      alt: "Social Media Content Calendar spreadsheet",
      linkUrl:
        "https://docs.google.com/spreadsheets/d/1O4d72MQh496CKAUfM6_IanppkKx5Duj6/edit?usp=drive_link&ouid=118413621441124305970&rtpof=true&sd=true",
    },
  ],

  // --------------------------------------------------------------------------
  // 8. EDUCATION & CREDENTIALS
  // --------------------------------------------------------------------------
  education: [
    {
      title: "M.Sc. in International Negotiations",
      institution: "Athens University of Economics and Business (AUEB)",
      period: "2022 – 2023",
      description:
        "Focused on negotiations in international, political, and economic spheres; thesis on startup crowdfunding.",
    },
    {
      title: "B.Sc. in Economics",
      institution: "University of Piraeus (UNIPI)",
      period: "2015 – 2020",
      description:
        "Quantitative economics, financial analysis, and market dynamics foundation.",
    },
    {
      title: "Full-Stack Engineer Career Path",
      institution: "Codecademy, Online",
      period: "2023 – 2024",
      description:
        "End-to-end web application development spanning front-end interfaces and back-end APIs.",
    },
    {
      title: "Startup School",
      institution: "Y Combinator, Online",
      period: "Nov 2023",
      description:
        "Early-stage startup execution, product iteration, and founder fundamentals.",
    },
    {
      title: "Small Business Operations",
      institution: "SBA & SCORE, Online",
      period: "Nov 2023",
      description:
        "Small Business Administration & SCORE Startup Roadmap programs for launching and scaling operations.",
    },
    {
      title: "Google & LinkedIn Certificates",
      institution: "Online Credentials",
      period: "2023",
      description: "Verified product, marketing, and analytical coursework.",
      linkUrl:
        "https://drive.google.com/drive/folders/1x9of6OykdtCjcPSGtncqbUyyskjGvjOH?usp=drive_link",
      linkLabel: "Google Certificates",
    },
    {
      title: "LinkedIn Learning Certificates",
      institution: "Online Credentials",
      period: "2023",
      description:
        "Additional business and professional development credentials.",
      linkUrl:
        "https://drive.google.com/drive/folders/1reB2vNQst4CVb96Zj5f-xd1HKvhk5NSl?usp=drive_link",
      linkLabel: "LinkedIn Certificates",
    },
    {
      title: "ECPE & ECCE English Certificates",
      institution: "Hellenic American Union, Greece",
      period: "May 2019",
      description: "C2-level English proficiency certification.",
    },
  ],
};
