import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import emailjs from "@emailjs/browser"
import helixConcept from "./assets/helix/helix-concept.png"
import helixInfographic from "./assets/helix/helix-infographic.png"
import { projectId, publicAnonKey } from "../utils/supabase/info"

emailjs.init("bDhPveLGtUCwhsvhT")

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  {
    auth: {
      storageKey: "upayex-contact",
      persistSession: false,
      autoRefreshToken: false,
    },
  },
)

const REASONS = [
  "Industrial operations inquiry",
  "Engineering collaboration",
  "Research collaboration",
  "Investor inquiry",
  "General interest",
  "Media or press",
  "Other",
] as const

const RATE_LIMIT_KEY = "upayex_contact_last_sent"
const RATE_LIMIT_MS = 10 * 60 * 1000

type Page = "home" | "technology" | "applications" | "research" | "progress" | "vision" | "about" | "contact"

const PAGES: { label: string page: Page }[] = [
  { label: "Home", page: "home" },
  { label: "Technology", page: "technology" },
  { label: "Applications", page: "applications" },
  { label: "Research", page: "research" },
  { label: "Progress", page: "progress" },
  { label: "Vision", page: "vision" },
  { label: "About", page: "about" },
  { label: "Contact", page: "contact" },
]

const META: Record<Page, { title: string description: string }> = {
  home: {
    title: "UPAYEX — Autonomous Systems for Resources Beyond Earth",
    description:
      "UPAYEX develops autonomous robotic systems for resource extraction and utilization, building commercial and engineering foundations through terrestrial industrial applications.",
  },
  technology: {
    title: "HELIX Technology — UPAYEX",
    description:
      "Meet HELIX, a modular six-wheel robotic platform under development for drilling, excavation, and material-handling operations.",
  },
  applications: {
    title: "Industrial Applications — UPAYEX",
    description:
      "UPAYEX is investigating modular robotics for mining, construction, drilling, excavation, and industrial material handling.",
  },
  research: {
    title: "Engineering Research — UPAYEX",
    description:
      "The mechanical, computational, controls, and systems research informing the HELIX architecture.",
  },
  progress: {
    title: "Engineering Progress Log — UPAYEX",
    description:
      "A transparent record of UPAYEX engineering decisions, CAD development, simulation work, and customer discovery.",
  },
  vision: {
    title: "Vision — UPAYEX",
    description:
      "Build practical robotic capability on Earth, then extend its potential toward autonomous resource operations beyond Earth.",
  },
  about: {
    title: "About UPAYEX",
    description:
      "UPAYEX is an early-stage, founder-led robotics and engineering venture founded by Yashasvi Pathak.",
  },
  contact: {
    title: "Contact UPAYEX",
    description:
      "Speak with UPAYEX about industrial operations, robotics, drilling, excavation, research, or early-stage support.",
  },
}

const IMG = {
  hero: "https://images.unsplash.com/photo-1793340626466-f2c5a1daacf5?w=2000&auto=format&fit=crop&q=86",
  mine: "https://images.unsplash.com/photo-1776012203102-a024822685cc?w=1600&auto=format&fit=crop&q=82",
  machine:
    "https://images.unsplash.com/photo-1606206873764-fd15e242df52?w=1600&auto=format&fit=crop&q=82",
  workshop:
    "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=1600&auto=format&fit=crop&q=82",
  research:
    "https://images.unsplash.com/photo-1756723901890-4d8a4b4cddaf?w=1600&auto=format&fit=crop&q=82",
  notes:
    "https://images.unsplash.com/photo-1604697501045-61eb3162c228?w=1600&auto=format&fit=crop&q=82",
  lunarSurface:
    "https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=1600&auto=format&fit=crop&q=82",
  lunar:
    "https://images.unsplash.com/photo-1614724723258-ba209d44bc06?w=2000&auto=format&fit=crop&q=86",
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9px] uppercase tracking-[0.32em] text-[#c7a77b]">
      {children}
    </p>
  )
}

function Arrow() {
  return <span aria-hidden="true">↗</span>
}

function RoverSchematic({ className = "" }: { className?: string }) {
  const wheels = [145, 350, 555]
  return (
    <svg
      viewBox="0 0 700 480"
      className={className}
      fill="none"
      role="img"
      aria-label="Conceptual side-view engineering schematic of the HELIX six-wheel rocker-bogie rover"
    >
      <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path
            d="M20 0H0V20"
            stroke="rgba(199,167,123,.08)"
            strokeWidth=".6"
          />
        </pattern>
        <linearGradient id="bodyFill" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#25221e" />
          <stop offset="1" stopColor="#0b0b0d" />
        </linearGradient>
      </defs>
      <rect width="700" height="480" fill="url(#grid)" />
      <path
        d="M50 398H650"
        stroke="rgba(232,228,221,.14)"
        strokeDasharray="4 6"
      />
      <path
        d="M95 360L145 296L245 316L350 272L455 316L555 296L605 360"
        stroke="#a48a69"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M145 296L350 340L555 296M350 272V340"
        stroke="#665844"
        strokeWidth="3"
      />
      <path
        d="M225 186H483L520 260L457 306H238L190 260Z"
        fill="url(#bodyFill)"
        stroke="#bda17d"
        strokeWidth="2"
      />
      <path
        d="M260 186L282 148H420L450 186M330 148V115H395V148"
        stroke="#76654f"
        strokeWidth="2"
      />
      <rect
        x="344"
        y="96"
        width="38"
        height="20"
        fill="#161517"
        stroke="#bda17d"
      />
      <circle cx="363" cy="106" r="5" fill="#d2b48a" />
      <path
        d="M190 230H145L110 185M520 230H570L604 190"
        stroke="#8b7559"
        strokeWidth="3"
      />
      <path
        d="M110 185L92 144M604 190L625 150"
        stroke="#8b7559"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {wheels.map((x) => (
        <g key={x}>
          <circle
            cx={x}
            cy="360"
            r="48"
            fill="#0a0a0c"
            stroke="#bda17d"
            strokeWidth="3"
          />
          <circle cx={x} cy="360" r="31" stroke="#4d4234" strokeWidth="2" />
          <circle cx={x} cy="360" r="8" fill="#bda17d" />
          {[0, 45, 90, 135].map((a) => (
            <line
              key={a}
              x1={x - 40 * Math.cos((a * Math.PI) / 180)}
              y1={360 - 40 * Math.sin((a * Math.PI) / 180)}
              x2={x + 40 * Math.cos((a * Math.PI) / 180)}
              y2={360 + 40 * Math.sin((a * Math.PI) / 180)}
              stroke="#2f2a23"
            />
          ))}
        </g>
      ))}
      <path
        d="M483 207H580V105M225 207H120V105M363 96V55"
        stroke="rgba(199,167,123,.38)"
        strokeDasharray="3 4"
      />
      <text
        x="588"
        y="101"
        fill="#8d7658"
        fontSize="9"
        fontFamily="JetBrains Mono"
      >
        MODULAR TOOL INTERFACE
      </text>
      <text
        x="112"
        y="101"
        textAnchor="end"
        fill="#8d7658"
        fontSize="9"
        fontFamily="JetBrains Mono"
      >
        PROTECTED SYSTEMS BAY
      </text>
      <text
        x="363"
        y="45"
        textAnchor="middle"
        fill="#8d7658"
        fontSize="9"
        fontFamily="JetBrains Mono"
      >
        SENSOR MAST
      </text>
      <text
        x="18"
        y="24"
        fill="#b79a75"
        fontSize="9"
        fontFamily="JetBrains Mono"
        letterSpacing="1.4"
      >
        HELIX / SIX-WHEEL ROCKER-BOGIE / ARCHITECTURE STUDY
      </text>
      <text
        x="682"
        y="24"
        textAnchor="end"
        fill="#584b3b"
        fontSize="9"
        fontFamily="JetBrains Mono"
      >
        CONCEPT — NOT VALIDATED
      </text>
      <text
        x="18"
        y="458"
        fill="#584b3b"
        fontSize="9"
        fontFamily="JetBrains Mono"
      >
        SYSTEM DIMENSIONS AND PERFORMANCE PARAMETERS: UNDER DEVELOPMENT
      </text>
    </svg>
  )
}

function Nav({ current, go }: { current: Page go: (p: Page) => void }) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 border-b transition-all duration-500 ${
        scrolled || open
          ? "border-white/[.08] bg-[#08090a]/95 backdrop-blur-xl"
          : "border-transparent bg-gradient-to-b from-black/70 to-transparent"
      }`}
      aria-label="Primary navigation"
    >
      <div className="mx-auto flex h-[72px] max-w-[1480px] items-center justify-between px-5 md:px-8">
        <button
          onClick={() => go("home")}
          className="group flex items-center gap-3"
          aria-label="UPAYEX home"
        >
          <span className="grid h-7 w-7 place-items-center border border-[#c7a77b]/50 text-[10px] font-semibold text-[#c7a77b] transition-colors group-hover:bg-[#c7a77b] group-hover:text-[#08090a]">
            U
          </span>
          <span className="font-mono text-[12px] tracking-[.32em] text-[#ece8e0]">
            UPAYEX
          </span>
        </button>
        <div className="hidden items-center gap-5 lg:flex xl:gap-7">
          {PAGES.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => go(page)}
              className={`relative py-2 font-mono text-[9px] uppercase tracking-[.16em] transition-colors ${
                current === page
                  ? "text-[#ece8e0]"
                  : "text-[#77746e] hover:text-[#ece8e0]"
              }`}
            >
              {label}
              <span
                className={`absolute inset-x-0 -bottom-[19px] h-px bg-[#c7a77b] transition-transform ${
                  current === page ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`h-px w-5 bg-[#ece8e0] transition-transform ${
              open ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-5 bg-[#ece8e0] transition-transform ${
              open ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>
      <div
        className={`overflow-hidden transition-all duration-500 lg:hidden ${
          open ? "max-h-[600px] border-t border-white/[.06]" : "max-h-0"
        }`}
      >
        <div className="grid grid-cols-2 gap-px bg-white/[.06] p-px">
          {PAGES.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => {
                go(page)
                setOpen(false)
              }}
              className={`bg-[#090a0b] px-6 py-5 text-left font-mono text-[10px] uppercase tracking-[.16em] ${
                current === page ? "text-[#c7a77b]" : "text-[#8b8882]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

function Footer({ go }: { go: (p: Page) => void }) {
  return (
    <footer className="border-t border-white/[.08] bg-[#060708] px-5 py-12 md:px-8">
      <div className="mx-auto grid max-w-[1480px] gap-10 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-7 w-7 place-items-center border border-[#c7a77b]/40 font-mono text-[10px] text-[#c7a77b]">
              U
            </span>
            <span className="font-mono text-[11px] tracking-[.3em]">
              UPAYEX
            </span>
          </div>
          <p className="max-w-lg text-sm leading-6 text-[#6e6b66]">
            Autonomous robotic systems for resource extraction and
            utilization—building capability on Earth for operations beyond it.
          </p>
        </div>
        <div className="md:text-right">
          <div className="mb-5 flex flex-wrap gap-x-5 gap-y-3 md:justify-end">
            {PAGES.slice(1).map(({ label, page }) => (
              <button
                key={page}
                onClick={() => go(page)}
                className="font-mono text-[8px] uppercase tracking-[.16em] text-[#5d5a55] hover:text-[#c7a77b]"
              >
                {label}
              </button>
            ))}
          </div>
          <p className="font-mono text-[8px] tracking-[.16em] text-[#3d3c39]">
            © 2026 UPAYEX / ENGINEERING DEVELOPMENT
          </p>
        </div>
      </div>
    </footer>
  )
}

function SectionCTA({
  title,
  copy,
  action,
  go,
}: {
  title: string
  copy: string
  action: { label: string page: Page }
  go: (p: Page) => void
}) {
  return (
    <section className="border-t border-white/[.08] px-5 py-24 md:px-8">
      <div className="mx-auto flex max-w-[1480px] flex-col justify-between gap-10 md:flex-row md:items-end">
        <div>
          <Label>Continue the system</Label>
          <h2 className="mt-5 max-w-3xl font-serif text-4xl leading-[1.02] md:text-6xl">
            {title}
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#74716b]">
            {copy}
          </p>
        </div>
        <button
          onClick={() => go(action.page)}
          className="group flex w-fit items-center gap-8 border border-[#c7a77b]/35 px-6 py-4 font-mono text-[9px] tracking-[.18em] text-[#d5c1a5] transition-colors hover:bg-[#c7a77b] hover:text-[#090a0b]"
        >
          {action.label}
          <Arrow />
        </button>
      </div>
    </section>
  )
}

function HomePage({ go }: { go: (p: Page) => void }) {
  const pathway = [
    [
      "01",
      "Terrestrial applications",
      "Develop commercially relevant robotics around real drilling, excavation, and material-handling problems.",
    ],
    [
      "02",
      "Revenue & operations",
      "Build customer understanding, operational experience, and a sustainable engineering foundation.",
    ],
    [
      "03",
      "Engineering maturity",
      "Advance architecture, simulation, validation, reliability, and increasingly autonomous capability.",
    ],
    [
      "04",
      "Beyond Earth",
      "Apply mature systems toward extraterrestrial resource extraction, utilization, and supporting infrastructure.",
    ],
  ]
  return (
    <>
      <section className="relative flex min-h-[860px] items-end overflow-hidden px-5 pb-16 pt-32 md:px-8 md:pb-24">
        <img
          src={IMG.lunar}
          alt="NASA photograph of Earth above the lunar surface"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,7,8,.96)_0%,rgba(6,7,8,.72)_48%,rgba(6,7,8,.18)_100%),linear-gradient(0deg,#08090a_0%,transparent_55%)]" />
        <div className="absolute right-8 top-28 hidden border-l border-white/15 pl-4 font-mono text-[8px] leading-6 tracking-[.2em] text-white/45 md:block">
          ULTIMATE OBJECTIVE
          <br />
          EXTRATERRESTRIAL RESOURCES
          <br />
          CURRENT STATE / EARLY DEVELOPMENT
        </div>
        <div className="relative mx-auto w-full max-w-[1480px]">
          <div className="max-w-5xl">
            <Label>UPAYEX / Autonomous resource systems</Label>
            <h1 className="mt-8 font-serif text-[clamp(4rem,8.2vw,8.6rem)] leading-[.86] tracking-[-.035em] text-[#f0ece4]">
              Autonomous systems for
              <br />
              <em className="text-[#d5b083]">resources beyond Earth.</em>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-7 text-[#aaa69f] md:text-lg">
              UPAYEX is developing modular robotic systems for resource
              extraction and utilization, building commercial and engineering
              foundations through terrestrial industrial applications.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                onClick={() => go("technology")}
                className="bg-[#e8e4dc] px-6 py-4 font-mono text-[9px] tracking-[.18em] text-[#090a0b] transition-colors hover:bg-[#c7a77b]"
              >
                EXPLORE HELIX
              </button>
              <button
                onClick={() => go("vision")}
                className="border border-white/20 px-6 py-4 font-mono text-[9px] tracking-[.18em] text-[#e8e4dc] hover:border-[#c7a77b]/70"
              >
                OUR MISSION <span className="ml-5">↗</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/[.08] bg-[#0a0b0c] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <Label>One mission / two horizons</Label>
              <h2 className="mt-5 font-serif text-5xl leading-[1.02] md:text-6xl">
                The market is the starting point.
                <br />
                <span className="text-[#77736d]">
                  The mission reaches further.
                </span>
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#7b7872] lg:justify-self-end">
              Terrestrial industry is where UPAYEX intends to build revenue,
              operational understanding, and engineering maturity.
              Extraterrestrial resource extraction and utilization is the
              long-term technological destination.
            </p>
          </div>
          <div className="mt-16 grid gap-px bg-white/[.08] lg:grid-cols-4">
            {pathway.map(([n, title, text], i) => (
              <article key={n} className="relative min-h-72 bg-[#08090a] p-7">
                <p className="font-mono text-[9px] text-[#c7a77b]">{n}</p>
                <h3 className="mt-16 font-serif text-3xl">{title}</h3>
                <p className="mt-4 text-sm leading-6 text-[#6f6c66]">{text}</p>
                {i < 3 && (
                  <span className="absolute -right-3 top-8 z-10 hidden h-6 w-6 place-items-center bg-[#c7a77b] font-mono text-xs text-[#08090a] lg:grid">
                    →
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-28 md:px-8">
        <div className="mx-auto grid max-w-[1480px] gap-14 lg:grid-cols-[.62fr_1.38fr] lg:items-center">
          <div>
            <Label>Primary robotic system</Label>
            <h2 className="mt-6 font-serif text-6xl md:text-8xl">
              HELIX<span className="text-[#c7a77b]">.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-[#7b7872]">
              A modular robotic platform under development for drilling,
              excavation, and material handling—initially directed toward
              terrestrial industry, with a longer-term path toward
              extraterrestrial operations.
            </p>
            <p className="mt-8 font-mono text-[8px] leading-5 tracking-[.12em] text-[#8d7658]">
              PRELIMINARY CONCEPT VISUALIZATION / NOT PHYSICAL HARDWARE
            </p>
            <button
              onClick={() => go("technology")}
              className="mt-9 font-mono text-[9px] tracking-[.18em] text-[#c7a77b]"
            >
              VIEW HELIX <span className="ml-6">→</span>
            </button>
          </div>
          <figure className="overflow-hidden border border-white/[.1] bg-[#050607]">
            <img
              src={helixConcept}
              alt="Preliminary conceptual visualization of the HELIX modular robotic platform"
              className="aspect-[16/9] w-full object-cover"
            />
            <figcaption className="border-t border-white/[.08] px-5 py-4 font-mono text-[7px] leading-5 tracking-[.1em] text-[#5f5b55]">
              CONCEPTUAL REFERENCE — FEATURES, POWER CONFIGURATION, AND
              PERFORMANCE ARE SUBJECT TO ENGINEERING DEVELOPMENT AND VALIDATION.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/[.08] px-5 py-32 md:px-8">
        <img
          src={IMG.machine}
          alt="Industrial robotic arm in a manufacturing environment"
          className="absolute inset-0 h-full w-full object-cover opacity-20 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090a] via-[#08090a]/90 to-[#08090a]/45" />
        <div className="relative mx-auto max-w-[1480px]">
          <Label>Current position</Label>
          <h2 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.02] md:text-7xl">
            Architecture, simulation, and discovery.
            <br />
            <span className="text-[#7b7872]">Not deployment.</span>
          </h2>
          <p className="mt-8 max-w-xl text-sm leading-7 text-[#89857f]">
            UPAYEX is at an early development stage: refining HELIX, building
            computational foundations, and speaking with professionals across
            mining, drilling, construction, automation, and equipment
            operations.
          </p>
          <button
            onClick={() => go("progress")}
            className="mt-10 border-b border-[#c7a77b]/50 pb-2 font-mono text-[9px] tracking-[.18em] text-[#c7a77b]"
          >
            READ THE DEVELOPMENT LOG
          </button>
        </div>
      </section>
      <SectionCTA
        title="Build capability on Earth. Extend it beyond Earth."
        copy="See the deliberate progression from commercial industrial robotics to autonomous extraterrestrial resource operations."
        action={{ label: "READ THE VISION", page: "vision" }}
        go={go}
      />
      <Footer go={go} />
    </>
  )
}

function TechnologyPage({ go }: { go: (p: Page) => void }) {
  const features = [
    [
      "01",
      "All-terrain mobility",
      "The proposed six-wheel configuration is intended to provide traction, stability, and terrain negotiation. Suspension geometry and mobility performance remain subject to engineering development and validation.",
    ],
    [
      "02",
      "Ground anchoring & stabilization",
      "Proposed ground-engaging anchors would reduce unwanted rover movement during reaction-force-intensive drilling or excavation. Holding capacity will depend on ground conditions, geometry, loads, and mechanical validation.",
    ],
    [
      "03",
      "Modular payloads",
      "Interchangeable interfaces are being explored for drilling, excavation, scooping, material collection, and material-handling tools. These tools are not all manufactured or operational.",
    ],
    [
      "04",
      "Drilling & excavation",
      "HELIX is intended to investigate mechanisms for accessing, excavating, and collecting material in demanding environments.",
    ],
    [
      "05",
      "Sensing & perception",
      "A future sensing architecture may support terrain awareness, localization, obstacle detection, and autonomous operations. The sensor suite is not finalized.",
    ],
    [
      "06",
      "Power & energy",
      "Power architecture, storage, and energy management are active engineering considerations. Solar panels shown in the concept are not a finalized or validated configuration.",
    ],
    [
      "07",
      "Modularity & maintainability",
      "The architecture is intended to accommodate different tools, configurations, access requirements, and operational needs without treating every mission as the same machine.",
    ],
  ]
  const anchorSteps = [
    ["01", "Reach", "The rover reaches the intended work location."],
    [
      "02",
      "Engage",
      "Ground-engaging mechanisms deploy into a proposed anchoring position.",
    ],
    [
      "03",
      "Stabilize",
      "The system establishes a more stable working configuration.",
    ],
    [
      "04",
      "Operate",
      "Drilling or excavation proceeds while reaction forces are managed.",
    ],
    ["05", "Retract", "Anchors retract before the rover relocates."],
  ]
  return (
    <>
      <header className="px-5 pb-16 pt-40 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <Label>Technology / Primary system</Label>
          <div className="mt-8 grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <h1 className="font-serif text-7xl leading-[.9] md:text-[9rem]">
              Meet
              <br />
              HELIX<span className="text-[#c7a77b]">.</span>
            </h1>
            <div>
              <p className="text-lg leading-8 text-[#8a8781]">
                A modular robotic platform intended for drilling, excavation,
                and material-handling operations—beginning with terrestrial
                industry and developing toward extraterrestrial resource
                operations.
              </p>
              <p className="mt-6 font-mono text-[8px] uppercase leading-5 tracking-[.15em] text-[#8d7658]">
                Current state: architecture development, CAD design,
                computational modeling, simulation, and customer discovery.
              </p>
            </div>
          </div>
        </div>
      </header>

      <section className="border-y border-white/[.08] bg-[#050607] px-3 py-8 md:px-8">
        <figure className="mx-auto max-w-[1480px] overflow-hidden border border-white/[.1]">
          <img
            src={helixConcept}
            alt="Preliminary conceptual visualization of the HELIX six-wheel modular robotic platform"
            className="aspect-[16/9] w-full object-cover"
          />
          <figcaption className="flex flex-col justify-between gap-3 border-t border-white/[.08] bg-[#090a0b] px-5 py-4 font-mono text-[8px] leading-5 tracking-[.11em] text-[#77716a] md:flex-row">
            <span>
              HELIX — PRELIMINARY CONCEPTUAL VISUALIZATION OF A MODULAR ROBOTIC
              PLATFORM UNDER DEVELOPMENT.
            </span>
            <span className="text-[#c7a77b]">NOT A MANUFACTURED PROTOTYPE</span>
          </figcaption>
        </figure>
      </section>

      <section className="px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <div className="mb-12 max-w-3xl">
            <Label>Operating concept / visual reference</Label>
            <h2 className="mt-5 font-serif text-5xl md:text-6xl">
              Designed around demanding operations.
            </h2>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#77736d]">
              The infographic communicates a proposed architecture and intended
              operating concept. It is not evidence of tested performance,
              finalized subsystems, or commercial readiness.
            </p>
          </div>
          <figure className="overflow-hidden border border-white/[.1] bg-[#060708]">
            <img
              src={helixInfographic}
              alt="Concept infographic showing proposed HELIX mobility, modular payloads, sensing, power, drilling, anchoring, and terrestrial-to-lunar development pathway"
              className="w-full object-contain"
            />
            <figcaption className="border-t border-white/[.08] px-5 py-4 font-mono text-[7px] leading-5 tracking-[.1em] text-[#5f5b55]">
              CONCEPT INFOGRAPHIC — ALL CONFIGURATIONS, TERRAIN CLAIMS, SENSOR
              ARRANGEMENTS, ANCHORING PERFORMANCE, POWER SYSTEMS, AND
              APPLICATIONS REQUIRE ENGINEERING VALIDATION.
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y border-white/[.08] bg-[#0b0c0d] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
            <div>
              <Label>Proposed architecture</Label>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl">
                Seven systems under investigation.
              </h2>
              <p className="mt-6 text-sm leading-7 text-[#6f6c66]">
                Each feature is an engineering direction, not a completed
                capability.
              </p>
            </div>
            <div className="border-t border-white/[.1]">
              {features.map(([n, title, text]) => (
                <article
                  key={n}
                  className="grid gap-5 border-b border-white/[.1] py-7 md:grid-cols-[50px_220px_1fr]"
                >
                  <span className="font-mono text-[9px] text-[#c7a77b]">
                    {n}
                  </span>
                  <h3 className="font-serif text-2xl">{title}</h3>
                  <p className="text-sm leading-7 text-[#74716b]">{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
            <div>
              <Label>Ground anchoring / proposed sequence</Label>
              <h2 className="mt-5 font-serif text-5xl">
                Stabilize before applying load.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-[#74716b]">
              The concept aims to create a more stable base during drilling or
              excavation. It has not been tested, and reliable grip cannot be
              assumed across soil or regolith types.
            </p>
          </div>
          <div className="mt-12 grid gap-px bg-white/[.08] md:grid-cols-5">
            {anchorSteps.map(([n, title, text], i) => (
              <article key={n} className="relative min-h-64 bg-[#090a0b] p-6">
                <span className="font-mono text-[9px] text-[#c7a77b]">{n}</span>
                <h3 className="mt-16 font-serif text-3xl">{title}</h3>
                <p className="mt-4 text-xs leading-6 text-[#68655f]">{text}</p>
                {i < 4 && (
                  <span className="absolute -right-3 top-7 z-10 hidden h-6 w-6 place-items-center bg-[#c7a77b] text-[#08090a] md:grid">
                    →
                  </span>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
      <SectionCTA
        title="The first proving ground is terrestrial industry."
        copy="See the real-world operating problems UPAYEX is investigating as its initial commercial pathway."
        action={{ label: "EXPLORE APPLICATIONS", page: "applications" }}
        go={go}
      />
      <Footer go={go} />
    </>
  )
}

function ApplicationsPage({ go }: { go: (p: Page) => void }) {
  const apps = [
    {
      n: "01",
      title: "Mining",
      text: "Investigating robotic drilling, excavation, and collection tasks in difficult, equipment-intensive operating environments.",
      tags: ["DRILLING", "EXCAVATION", "COLLECTION"],
    },
    {
      n: "02",
      title: "Construction",
      text: "Exploring specialized excavation and drilling tasks where modular robotic equipment may improve access or repeatability.",
      tags: ["SITE WORK", "SPECIALIZED TOOLS", "AUTOMATION"],
    },
    {
      n: "03",
      title: "Industrial drilling",
      text: "Studying repetitive, difficult, or remotely operated drilling tasks and the equipment constraints around them.",
      tags: ["TOOL CONTROL", "REMOTE WORK", "REPEATABILITY"],
    },
    {
      n: "04",
      title: "Material handling",
      text: "Examining mechanisms for collecting, transporting, and handling bulk or fragmented material between operations.",
      tags: ["COLLECT", "TRANSPORT", "TRANSFER"],
    },
  ]
  return (
    <>
      <header className="relative min-h-[650px] overflow-hidden px-5 pb-20 pt-40 md:px-8">
        <img
          src={IMG.mine}
          alt="Aerial view of an open-pit terrestrial mine"
          className="absolute inset-0 h-full w-full object-cover opacity-45 grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#08090a_0%,rgba(8,9,10,.83)_50%,rgba(8,9,10,.35)_100%),linear-gradient(0deg,#08090a,transparent_65%)]" />
        <div className="relative mx-auto max-w-[1480px]">
          <Label>Applications / Commercial pathway</Label>
          <h1 className="mt-8 max-w-4xl font-serif text-6xl leading-[.95] md:text-8xl">
            Building robotic capability
            <br />
            <em className="text-[#c7a77b]">for real-world operations.</em>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-[#a19d96]">
            Terrestrial industry is UPAYEX's initial commercial pathway: a place
            to understand real operating requirements, develop relevant robotic
            capability, and build the foundation for the longer mission. This is
            active customer discovery—not commercial deployment.
          </p>
        </div>
      </header>
      <section className="px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-px bg-white/[.08] md:grid-cols-2">
            {apps.map((app) => (
              <article
                key={app.n}
                className="group bg-[#08090a] p-8 transition-colors hover:bg-[#0d0e0f] md:p-12"
              >
                <div className="flex justify-between">
                  <span className="font-mono text-[9px] text-[#c7a77b]">
                    {app.n}
                  </span>
                  <span className="text-[#353330] transition-colors group-hover:text-[#c7a77b]">
                    ↗
                  </span>
                </div>
                <h2 className="mt-20 font-serif text-4xl md:text-5xl">
                  {app.title}
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-[#74716b]">
                  {app.text}
                </p>
                <div className="mt-10 flex flex-wrap gap-2">
                  {app.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border border-white/[.08] px-3 py-2 font-mono text-[7px] tracking-[.14em] text-[#56534e]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-white/[.08] bg-[#0b0c0d] px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
            <div>
              <Label>Problems under investigation</Label>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl">
                Understand the operation before designing the machine.
              </h2>
              <p className="mt-6 max-w-lg text-sm leading-7 text-[#6f6c66]">
                These are areas for customer discovery and engineering study,
                not problems UPAYEX claims to have solved.
              </p>
            </div>
            <div className="grid gap-px bg-white/[.08] sm:grid-cols-2">
              {[
                "Difficult working environments",
                "Repetitive and demanding operations",
                "Equipment accessibility",
                "Operational safety",
                "Drilling and excavation efficiency",
                "Automation opportunities",
                "Reliability and maintainability",
                "Integration with existing workflows",
              ].map((problem, i) => (
                <div
                  key={problem}
                  className="flex min-h-28 items-end justify-between bg-[#090a0b] p-5"
                >
                  <span className="max-w-[15rem] text-sm leading-6 text-[#9b968e]">
                    {problem}
                  </span>
                  <span className="font-mono text-[8px] text-[#5b554e]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-white/[.08] bg-[#0b0c0d] px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-2">
          <div>
            <Label>Commercial pathway / under evaluation</Label>
            <h2 className="mt-5 max-w-xl font-serif text-4xl md:text-5xl">
              Useful equipment must fit how industry works.
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-px bg-white/[.08]">
            {[
              "Direct equipment sales",
              "Equipment leasing",
              "Robotics as a service",
              "Maintenance & support",
            ].map((x) => (
              <div
                key={x}
                className="bg-[#0b0c0d] p-5 font-mono text-[8px] uppercase leading-5 tracking-[.12em] text-[#77736d]"
              >
                {x}
              </div>
            ))}
          </div>
          <p className="text-xs leading-6 text-[#56534e] lg:col-start-2">
            These are potential future models being considered. UPAYEX does not
            claim that any are currently operational or generating revenue.
          </p>
        </div>
      </section>
      <SectionCTA
        title="Tell us how the work actually happens."
        copy="Operators, engineers, and equipment specialists can help define which problems are worth solving."
        action={{ label: "START A CONVERSATION", page: "contact" }}
        go={go}
      />
      <Footer go={go} />
    </>
  )
}

function ResearchPage({ go }: { go: (p: Page) => void }) {
  const areas = [
    "Mechanical robotics",
    "Drilling & excavation mechanics",
    "Modular robotic systems",
    "Mobility & suspension",
    "Electronics & actuation",
    "Embedded systems",
    "Programming & controls",
    "Perception & navigation",
    "Computational modeling",
    "Simulation & systems engineering",
    "Environmental resilience",
    "Resource extraction",
    "Lunar robotics",
  ]
  return (
    <>
      <header className="px-5 pb-20 pt-40 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <Label>Research</Label>
          <h1 className="mt-8 max-w-5xl font-serif text-6xl leading-[.95] md:text-8xl">
            Research drives
            <br />
            <em className="text-[#c7a77b]">the architecture.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-[#7d7973]">
            UPAYEX is building the mechanical, computational, and systems
            foundations needed to make useful robotic operations possible.
            Published material will appear only when supported by project work.
          </p>
        </div>
      </header>
      <figure className="relative h-[34vh] min-h-72 overflow-hidden border-y border-white/[.08]">
        <img
          src={IMG.research}
          alt="Engineering workstation with a digital design and fabrication system"
          className="h-full w-full object-cover opacity-55 grayscale-[35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090a]/75 via-transparent to-[#08090a]/45" />
        <figcaption className="absolute bottom-5 left-5 font-mono text-[7px] tracking-[.13em] text-white/55 md:left-8">
          ENGINEERING DEVELOPMENT / REPRESENTATIVE WORKING ENVIRONMENT
        </figcaption>
      </figure>
      <section className="border-y border-white/[.08] px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <Label>Active domains</Label>
          <div className="mt-10 grid gap-px bg-white/[.08] sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, i) => (
              <div
                key={area}
                className="flex min-h-36 flex-col justify-between bg-[#08090a] p-6 hover:bg-[#0d0e0f]"
              >
                <span className="font-mono text-[8px] text-[#4c4944]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm text-[#b5b0a8]">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1480px] gap-16 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <Label>Publication state</Label>
            <h2 className="mt-5 font-serif text-4xl">
              Research in development.
            </h2>
          </div>
          <div className="border border-white/[.08] bg-[#0a0b0c] p-8 md:p-12">
            <p className="font-serif text-3xl text-[#8b8780]">
              No publications are being claimed at this stage.
            </p>
            <p className="mt-6 max-w-xl text-sm leading-7 text-[#65625d]">
              As work matures, this page is structured to support technical
              reports, engineering notes, simulation results, CAD documentation,
              experimental findings, references, and publications.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-3 font-mono text-[7px] tracking-[.12em] text-[#56534e] md:grid-cols-3">
              {[
                "TECHNICAL REPORTS",
                "ENGINEERING NOTES",
                "SIMULATION RESULTS",
                "CAD DOCUMENTATION",
                "EXPERIMENTAL FINDINGS",
                "REFERENCES",
              ].map((x) => (
                <span key={x} className="border-t border-white/[.08] pt-3">
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
      <SectionCTA
        title="Evidence should change the design."
        copy="Follow the dated record of what UPAYEX has investigated, learned, and changed."
        action={{ label: "OPEN THE PROGRESS LOG", page: "progress" }}
        go={go}
      />
      <Footer go={go} />
    </>
  )
}

type ProgressEntry = {
  date: string
  area: string
  title: string
  summary: string
  objective: string
  work: string
  evidence: string
  findings: string
  uncertainties: string
  next: string
}
const progressEntries: ProgressEntry[] = [
  {
    date: "11 NOV 2026",
    area: "SIMULATION / CUSTOMER DISCOVERY",
    title: "Simulation foundations and industry outreach",
    summary:
      "Computational groundwork progresses in parallel with conversations about real industrial workflows.",
    objective:
      "Build a usable simulation foundation while testing whether the problem framing matches operational reality.",
    work: "Developing computational and simulation foundations for the robotic system. In parallel, attempting to engage professionals in mining, drilling, construction, automation, and equipment operations.",
    evidence:
      "Simulation and computational work in development, together with documented outreach and discovery notes. No customer, pilot, or partnership claim is attached to this entry.",
    findings:
      "Architecture cannot be evaluated in isolation from operating workflows, maintenance constraints, and the economics of existing equipment.",
    uncertainties:
      "The first narrowly defined customer problem and the evidence needed to prioritize it remain unresolved.",
    next: "Continue model development and structured outreach. Record evidence without treating conversations as customers, pilots, or partnerships.",
  },
  {
    date: "LATE OCT — NOV 2026",
    area: "ARCHITECTURE / ENGINEERING",
    title: "Architecture and engineering refinement",
    summary:
      "The selected direction is being decomposed into mobility, tooling, protection, and system requirements.",
    objective:
      "Turn a consolidated concept into an architecture that can be evaluated subsystem by subsystem.",
    work: "Refining the modular robotic architecture, mobility concepts, mechanical configuration, drilling and excavation mechanisms, and broader system requirements.",
    evidence:
      "Architecture studies, evolving design requirements, and internal engineering documentation. Detailed confidential assemblies are not published.",
    findings:
      "Modularity affects far more than tooling; packaging, maintenance access, control boundaries, and utility interfaces must be considered together.",
    uncertainties:
      "Tool interface design, environmental envelope, load cases, and the optimal division between mobile units and support infrastructure.",
    next: "Continue CAD refinement and connect architecture decisions to computational models and customer-discovery evidence.",
  },
  {
    date: "26 OCT 2026",
    area: "CAD / DESIGN",
    title: "Initial CAD architecture",
    summary:
      "An initial consolidated CAD model established the selected design direction after multiple concept explorations.",
    objective:
      "Translate the selected modular rover direction into a coherent initial CAD assembly.",
    work: "Developed the first consolidated CAD model for the chosen direction. Earlier sketches and concept explorations preceded this model.",
    evidence:
      "A consolidated CAD assembly exists for the selected direction. Public concept visuals are illustrative and are not substitutes for the underlying engineering model.",
    findings:
      "Consolidation made packaging conflicts and mechanical dependencies easier to identify than isolated concept studies.",
    uncertainties:
      "Detailed mechanism selection, structural loads, actuation, manufacturability, and validated dimensions.",
    next: "Refine the architecture and use the model to define questions for simulation and subsystem analysis.",
  },
  {
    date: "11 OCT 2026",
    area: "PROJECT DIRECTION",
    title: "Focused development begins",
    summary:
      "UPAYEX began a serious, organized development effort around the robotic system.",
    objective:
      "Define the problem, narrow the system direction, and organize the engineering work.",
    work: "Explored the problem space, compared potential architectures, clarified the role of modularity, and organized the initial engineering work.",
    evidence:
      "Dated project planning, architecture exploration, and research notes marking the start of the focused development phase.",
    findings:
      "The initial commercial problem must be grounded in terrestrial operations while preserving a pathway to increasingly demanding autonomy.",
    uncertainties:
      "Which industrial task should become the first narrow commercial target and what system architecture best supports it.",
    next: "Select a primary architecture direction and represent it in consolidated CAD.",
  },
].reverse()

function ProgressPage({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <header className="px-5 pb-20 pt-40 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <Label>Engineering record / earliest to latest</Label>
          <h1 className="mt-8 font-serif text-6xl leading-[.92] md:text-8xl">
            Progress,
            <br />
            <em className="text-[#c7a77b]">documented.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-[#7d7973]">
            A developing record of engineering decisions, research, design
            iterations, simulation, and customer discovery—not percentages or
            invented milestones.
          </p>
        </div>
      </header>
      <figure className="relative h-[32vh] min-h-64 overflow-hidden border-y border-white/[.08]">
        <img
          src={IMG.notes}
          alt="Technical working papers and engineering notes on a desk"
          className="h-full w-full object-cover opacity-45 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090a]/85 via-[#08090a]/30 to-[#08090a]/70" />
        <figcaption className="absolute bottom-5 left-5 font-mono text-[7px] tracking-[.13em] text-white/50 md:left-8">
          DEVELOPMENT RECORD / REPRESENTATIVE DOCUMENTATION IMAGE
        </figcaption>
      </figure>
      <section className="border-t border-white/[.08] px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-8 grid grid-cols-[140px_1fr] font-mono text-[7px] tracking-[.15em] text-[#494641] md:grid-cols-[200px_1fr]">
            <span>DATE / AREA</span>
            <span>ENTRY / EVIDENCE</span>
          </div>
          {progressEntries.map((entry, i) => (
            <details
              key={entry.date}
              open={i === progressEntries.length - 1}
              className="group border-t border-white/[.1]"
            >
              <summary className="grid cursor-pointer list-none grid-cols-[100px_1fr_20px] gap-5 py-8 md:grid-cols-[200px_1fr_30px]">
                <div>
                  <p className="font-mono text-[9px] text-[#c7a77b]">
                    {entry.date}
                  </p>
                  <p className="mt-2 hidden font-mono text-[7px] leading-5 tracking-[.1em] text-[#55514c] md:block">
                    {entry.area}
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-2xl md:text-4xl">
                    {entry.title}
                  </h2>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6f6c66]">
                    {entry.summary}
                  </p>
                </div>
                <span className="font-mono text-lg text-[#7a746b] transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <div className="grid gap-px bg-white/[.08] md:grid-cols-2">
                <LogCell label="OBJECTIVE" text={entry.objective} />
                <LogCell label="WORK PERFORMED" text={entry.work} />
                <LogCell label="SUPPORTING EVIDENCE" text={entry.evidence} />
                <LogCell
                  label="FINDINGS / WHAT CHANGED"
                  text={entry.findings}
                />
                <LogCell
                  label="REMAINING UNCERTAINTIES"
                  text={entry.uncertainties}
                />
                <div className="bg-[#0c0d0e] p-6 md:col-span-2">
                  <Label>Next step</Label>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-[#96918a]">
                    {entry.next}
                  </p>
                </div>
              </div>
            </details>
          ))}
          <div className="border-t border-white/[.1] py-8 font-mono text-[8px] leading-5 tracking-[.1em] text-[#4f4c47]">
            FUTURE ENTRIES WILL INCLUDE DATES, OBJECTIVES, WORK, EVIDENCE,
            FINDINGS, UNCERTAINTIES, AND NEXT STEPS.
          </div>
        </div>
      </section>
      <SectionCTA
        title="The destination is further out. The work begins here."
        copy="See how terrestrial engineering capability connects to the long-term technological direction."
        action={{ label: "READ THE VISION", page: "vision" }}
        go={go}
      />
      <Footer go={go} />
    </>
  )
}

function LogCell({ label, text }: { label: string text: string }) {
  return (
    <div className="bg-[#090a0b] p-6 md:p-8">
      <p className="font-mono text-[7px] tracking-[.15em] text-[#8d7658]">
        {label}
      </p>
      <p className="mt-4 text-sm leading-7 text-[#74716b]">{text}</p>
    </div>
  )
}

function VisionPage({ go }: { go: (p: Page) => void }) {
  const stages = [
    [
      "01",
      "Terrestrial industrial applications",
      "Develop commercially relevant systems and understand real operational requirements in mining, construction, drilling, excavation, and material handling.",
    ],
    [
      "02",
      "Commercial & engineering maturity",
      "Build revenue, operational experience, technical capability, and a sustainable engineering foundation.",
    ],
    [
      "03",
      "Increasing autonomy",
      "Continue research, simulation, testing, and development of more capable autonomous robotic platforms.",
    ],
    [
      "04",
      "Lunar resource utilization",
      "Pursue autonomous systems for lunar resource exploration, extraction, collection, handling, processing, and supporting infrastructure.",
    ],
  ]
  return (
    <>
      <header className="relative flex min-h-[820px] items-end overflow-hidden px-5 pb-20 pt-40 md:px-8">
        <img
          src={IMG.lunar}
          alt="NASA photograph of Earth rising above the lunar surface"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,8,9,.95),rgba(7,8,9,.45)_62%,rgba(7,8,9,.15)),linear-gradient(0deg,#08090a,transparent_55%)]" />
        <div className="relative mx-auto w-full max-w-[1480px]">
          <Label>Vision / long-term direction</Label>
          <h1 className="mt-8 max-w-5xl font-serif text-6xl leading-[.93] md:text-8xl">
            From terrestrial engineering
            <br />
            to <em className="text-[#d4b286]">extraterrestrial resources.</em>
          </h1>
          <p className="mt-8 max-w-xl text-base leading-7 text-[#a19d96]">
            Build commercially relevant robotic systems on Earth. Use the
            resulting revenue, experience, and engineering maturity to pursue
            autonomous resource operations beyond Earth.
          </p>
          <p className="mt-6 font-mono text-[8px] uppercase tracking-[.14em] text-[#8f8a82]">
            Lunar operations are a long-term ambition—not an existing
            deployment.
          </p>
        </div>
      </header>
      <section className="px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <Label>The progression</Label>
          <div className="mt-10 grid gap-px bg-white/[.08] lg:grid-cols-4">
            {stages.map(([n, t, d]) => (
              <article key={n} className="min-h-[360px] bg-[#090a0b] p-7">
                <p className="font-mono text-[9px] text-[#c7a77b]">STAGE {n}</p>
                <div className="mt-24 h-px bg-gradient-to-r from-[#c7a77b]/60 to-transparent" />
                <h2 className="mt-8 font-serif text-3xl">{t}</h2>
                <p className="mt-5 text-sm leading-7 text-[#6f6c66]">{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-white/[.08] bg-[#0b0c0d] px-5 py-24 md:px-8">
        <div className="mx-auto grid max-w-[1480px] gap-14 lg:grid-cols-2">
          <h2 className="font-serif text-5xl leading-[1.02] md:text-6xl">
            One underlying capability:
            <br />
            <span className="text-[#77736d]">
              machines that perform useful work in demanding environments.
            </span>
          </h2>
          <div className="space-y-6 text-sm leading-7 text-[#75716b]">
            <p>
              Terrestrial industry provides the immediate context for
              understanding customers, equipment, maintenance, safety, and
              operational economics.
            </p>
            <p>
              Increasingly autonomous and remote operations demand stronger
              mobility, fault handling, environmental protection, and systems
              engineering.
            </p>
            <p>
              The Moon is an eventual application of that capability—not the
              product UPAYEX is offering today.
            </p>
          </div>
        </div>
      </section>
      <SectionCTA
        title="Ambition is useful only when the present state is clear."
        copy="Learn who is building UPAYEX and how the company describes its current stage."
        action={{ label: "ABOUT UPAYEX", page: "about" }}
        go={go}
      />
      <Footer go={go} />
    </>
  )
}

function AboutPage({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <header className="px-5 pb-20 pt-40 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <Label>About UPAYEX</Label>
          <h1 className="mt-8 max-w-5xl font-serif text-6xl leading-[.96] md:text-8xl">
            An engineering venture built around{" "}
            <em className="text-[#c7a77b]">difficult problems.</em>
          </h1>
        </div>
      </header>
      <figure className="relative h-[34vh] min-h-72 overflow-hidden border-y border-white/[.08]">
        <img
          src={IMG.workshop}
          alt="Close view of precision engineering equipment in a workshop"
          className="h-full w-full object-cover opacity-50 grayscale-[30%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090a]/75 via-transparent to-[#08090a]/55" />
        <figcaption className="absolute bottom-5 left-5 font-mono text-[7px] tracking-[.13em] text-white/50 md:left-8">
          FOUNDER-LED / ENGINEERING-FIRST
        </figcaption>
      </figure>
      <section className="border-y border-white/[.08] px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1480px] gap-16 lg:grid-cols-2">
          <div>
            <Label>Company</Label>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#8b8780]">
              UPAYEX is an early-stage, founder-led robotics and engineering
              company focused on autonomous robotic systems for resource
              extraction and utilization.
            </p>
          </div>
          <div className="space-y-5 text-sm leading-7 text-[#6f6c66]">
            <p>
              The immediate direction is terrestrial: learning from mining,
              construction, drilling, excavation, and material-handling
              operations.
            </p>
            <p>
              The current work is architecture development, CAD, computational
              modeling, simulation foundations, and customer discovery.
            </p>
            <p>
              The long-term direction is to extend mature robotic capability
              toward increasingly autonomous resource operations beyond Earth.
            </p>
          </div>
        </div>
      </section>
      <section className="px-5 py-24 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <Label>Founder</Label>
          <div className="mt-10 grid border border-white/[.08] lg:grid-cols-[.65fr_1.35fr]">
            <div className="flex min-h-80 items-center justify-center border-b border-white/[.08] bg-[#0b0c0d] lg:border-b-0 lg:border-r">
              <div className="grid h-32 w-32 place-items-center border border-[#c7a77b]/35 font-serif text-5xl text-[#c7a77b]">
                YP
              </div>
            </div>
            <div className="p-8 md:p-14">
              <p className="font-mono text-[8px] tracking-[.18em] text-[#8d7658]">
                FOUNDER / UPAYEX
              </p>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl">
                Yashasvi Pathak
              </h2>
              <p className="mt-7 max-w-2xl text-sm leading-7 text-[#74716b]">
                Leading UPAYEX's early development across problem definition,
                robotic architecture, engineering work, and customer discovery.
                The company is currently a sole-founder venture.
              </p>
              <a
                href="https://www.linkedin.com/in/yashasvi-pathak-991794437/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 inline-flex items-center gap-8 border border-white/[.12] px-5 py-3 font-mono text-[8px] tracking-[.15em] text-[#bcb7ae] hover:border-[#c7a77b] hover:text-[#c7a77b]"
              >
                LINKEDIN <Arrow />
              </a>
            </div>
          </div>
        </div>
      </section>
      <SectionCTA
        title="The best next step is a useful conversation."
        copy="UPAYEX welcomes perspectives from people who understand industrial operations and hard engineering problems."
        action={{ label: "CONTACT UPAYEX", page: "contact" }}
        go={go}
      />
      <Footer go={go} />
    </>
  )
}

function ContactPage({ go }: { go: (p: Page) => void }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    reason: "",
    message: "",
  })
  const [status, setStatus] =
    useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    const lastSent = localStorage.getItem(RATE_LIMIT_KEY)
    if (lastSent && Date.now() - Number(lastSent) < RATE_LIMIT_MS) {
      setErrorMsg(
        "A message was recently submitted from this browser. Please wait 10 minutes before trying again.",
      )
      setStatus("error")
      return
    }
    setStatus("loading")
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      reason: form.reason,
      message: form.message.trim(),
    })
    if (error) {
      setErrorMsg(
        "Something went wrong. Please email us directly at hojim2416@gmail.com.",
      )
      setStatus("error")
      return
    }
    localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString())
    emailjs
      .send("service_ki2u6if", "template_5vwsu3m", {
        from_name: form.name.trim(),
        from_email: form.email.trim(),
        reason: form.reason,
        message: form.message.trim(),
      })
      .catch(() => {})
    setStatus("success")
  }
  return (
    <>
      <header className="px-5 pb-20 pt-40 md:px-8">
        <div className="mx-auto max-w-[1480px]">
          <Label>Contact</Label>
          <h1 className="mt-8 max-w-5xl font-serif text-6xl leading-[.94] md:text-8xl">
            Bring an operating problem
            <br />
            <em className="text-[#c7a77b]">into the room.</em>
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-[#7d7973]">
            We welcome conversations with people working across industrial
            operations, robotics, drilling, excavation, and related engineering
            fields.
          </p>
        </div>
      </header>
      <figure className="relative h-[28vh] min-h-56 overflow-hidden border-y border-white/[.08]">
        <img
          src={IMG.lunarSurface}
          alt="Detailed NASA photograph of the lunar surface"
          className="h-full w-full object-cover opacity-45 grayscale"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090a]/85 via-[#08090a]/20 to-[#08090a]/70" />
        <figcaption className="absolute bottom-5 left-5 font-mono text-[7px] tracking-[.13em] text-white/50 md:left-8">
          START A CONVERSATION / INDUSTRIAL REALITY TO LONG-TERM MISSION
        </figcaption>
      </figure>
      <section className="border-t border-white/[.08] px-5 py-20 md:px-8">
        <div className="mx-auto grid max-w-[1480px] gap-16 lg:grid-cols-[.75fr_1.25fr]">
          <aside>
            <Label>Direct channels</Label>
            <div className="mt-8 border-t border-white/[.08]">
              <ContactLink label="EMAIL" href="mailto:hojim2416@gmail.com">
                hojim2416@gmail.com
              </ContactLink>
              <ContactLink
                label="LINKEDIN"
                href="https://www.linkedin.com/in/yashasvi-pathak-991794437/"
              >
                Yashasvi Pathak
              </ContactLink>
            </div>
            <p className="mt-10 max-w-sm text-xs leading-6 text-[#56534e]">
              Especially relevant: industrial operators, mining professionals,
              drilling engineers, construction-equipment specialists, robotics
              engineers, researchers, collaborators, and early-stage supporters.
            </p>
          </aside>
          {status === "success" ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center border border-[#c7a77b]/25 bg-[#0b0c0d] p-10 text-center">
              <span className="grid h-14 w-14 place-items-center border border-[#c7a77b]/40 text-[#c7a77b]">
                ✓
              </span>
              <h2 className="mt-8 font-serif text-4xl">Message received.</h2>
              <p className="mt-4 text-sm text-[#74716b]">
                Thank you. We'll be in touch.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="border border-white/[.08] bg-[#0a0b0c] p-6 md:p-10"
            >
              <div className="mb-10 flex items-center justify-between">
                <Label>Send a message</Label>
                <span className="font-mono text-[7px] tracking-[.12em] text-[#45423e]">
                  ALL FIELDS REQUIRED
                </span>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="NAME">
                  <input
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                  />
                </Field>
                <Field label="EMAIL">
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    placeholder="you@company.com"
                  />
                </Field>
              </div>
              <Field label="REASON FOR CONTACTING">
                <select
                  required
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                >
                  <option value="" disabled>
                    Select a reason
                  </option>
                  {REASONS.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </Field>
              <Field label="MESSAGE">
                <textarea
                  rows={6}
                  required
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  placeholder="Tell us about the operation, question, or opportunity."
                />
              </Field>
              {status === "error" && (
                <p className="mb-5 border border-[#a76060]/40 bg-[#a76060]/5 px-4 py-3 font-mono text-[8px] leading-5 text-[#c98585]">
                  {errorMsg}
                </p>
              )}
              <button
                disabled={status === "loading"}
                className="w-full bg-[#e8e4dc] px-6 py-4 font-mono text-[9px] tracking-[.18em] text-[#090a0b] hover:bg-[#c7a77b] disabled:opacity-50"
              >
                {status === "loading" ? "SENDING…" : "SEND MESSAGE"}{" "}
                <span className="ml-8">→</span>
              </button>
            </form>
          )}
        </div>
      </section>
      <Footer go={go} />
    </>
  )
}

function ContactLink({
  label,
  href,
  children,
}: {
  label: string
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      className="group flex items-center justify-between border-b border-white/[.08] py-6"
    >
      <span>
        <span className="mb-2 block font-mono text-[7px] tracking-[.15em] text-[#55514c]">
          {label}
        </span>
        <span className="text-base text-[#bbb6ad] group-hover:text-[#c7a77b]">
          {children}
        </span>
      </span>
      <Arrow />
    </a>
  )
}
function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <label className="mb-6 block">
      <span className="mb-3 block font-mono text-[7px] tracking-[.15em] text-[#6a665f]">
        {label}
      </span>
      <span className="form-control">{children}</span>
    </label>
  )
}

export default function App() {
  const initial = window.location.hash.replace("#/", "") as Page
  const [page, setPage] = useState<Page>(
    PAGES.some((p) => p.page === initial) ? initial : "home",
  )
  const [fading, setFading] = useState(false)
  const go = (next: Page) => {
    if (next === page) return
    setFading(true)
    setTimeout(() => {
      setPage(next)
      window.location.hash = `/${next}`
      window.scrollTo({ top: 0 })
      setFading(false)
    }, 160)
  }
  useEffect(() => {
    const meta = META[page]
    document.title = meta.title
    let desc = document.querySelector('meta[name="description"]')
    if (!desc) {
      desc = document.createElement("meta")
      desc.setAttribute("name", "description")
      document.head.appendChild(desc)
    }
    desc.setAttribute("content", meta.description)
    document.documentElement.lang = "en"
  }, [page])
  useEffect(() => {
    const onHash = () => {
      const p = window.location.hash.replace("#/", "") as Page
      if (PAGES.some((x) => x.page === p)) {
        setPage(p)
        window.scrollTo({ top: 0 })
      }
    }
    window.addEventListener("hashchange", onHash)
    return () => window.removeEventListener("hashchange", onHash)
  }, [])
  const content: Record<Page, React.ReactNode> = {
    home: <HomePage go={go} />,
    technology: <TechnologyPage go={go} />,
    applications: <ApplicationsPage go={go} />,
    research: <ResearchPage go={go} />,
    progress: <ProgressPage go={go} />,
    vision: <VisionPage go={go} />,
    about: <AboutPage go={go} />,
    contact: <ContactPage go={go} />,
  }
  return (
    <div className="min-h-screen bg-[#08090a] text-[#e8e4dd]">
      <Nav current={page} go={go} />
      <main
        className={`transition-opacity duration-200 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        {content[page]}
      </main>
    </div>
  )
}
