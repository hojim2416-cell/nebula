import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import emailjs from '@emailjs/browser'
import { projectId, publicAnonKey } from '../utils/supabase/info'

emailjs.init('bDhPveLGtUCwhsvhT')

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey,
  { auth: { storageKey: 'nebula-contact', persistSession: false, autoRefreshToken: false } }
)

const REASONS = [
  'Investor inquiry',
  'Research collaboration',
  'General interest',
  'Media or press',
  'Other',
] as const

const RATE_LIMIT_KEY = 'nebula_contact_last_sent'
const RATE_LIMIT_MS = 60 * 60 * 1000 // 1 hour

type Page = 'home' | 'problem' | 'helix' | 'research' | 'progress' | 'vision' | 'about' | 'contact'

const IMG = {
  lunar: 'https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1920&auto=format&fit=crop&q=80',
  lunarSurface: 'https://images.unsplash.com/photo-1447433589675-4aaa569f3e05?w=1920&auto=format&fit=crop&q=80',
  earth: 'https://images.unsplash.com/photo-1777047023536-8e47688b77f9?w=1920&auto=format&fit=crop&q=80',
}

// ─── Helix schematic ─────────────────────────────────────────────────────────

function HelixSchematic({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 700 500" className={className} fill="none">
      <defs>
        <pattern id="sgrid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M 20 0 L 0 0 0 20" stroke="rgba(184,168,152,0.05)" strokeWidth="0.5" fill="none" />
        </pattern>
        <pattern id="lgrid" width="100" height="100" patternUnits="userSpaceOnUse">
          <path d="M 100 0 L 0 0 0 100" stroke="rgba(184,168,152,0.09)" strokeWidth="0.5" fill="none" />
        </pattern>
      </defs>

      {/* Grid */}
      <rect width="700" height="500" fill="url(#sgrid)" />
      <rect width="700" height="500" fill="url(#lgrid)" />

      {/* Center crosshairs */}
      <line x1="350" y1="30" x2="350" y2="470" stroke="rgba(184,168,152,0.1)" strokeWidth="0.5" strokeDasharray="4 5" />
      <line x1="50" y1="250" x2="650" y2="250" stroke="rgba(184,168,152,0.1)" strokeWidth="0.5" strokeDasharray="4 5" />

      {/* Construction circles */}
      <circle cx="350" cy="250" r="75" stroke="rgba(184,168,152,0.08)" strokeWidth="0.5" strokeDasharray="3 4" />
      <circle cx="350" cy="250" r="145" stroke="rgba(184,168,152,0.05)" strokeWidth="0.5" strokeDasharray="2 5" />

      {/* Body hexagon — pointy-top, r=75 */}
      {/* v0=(350,175) v1=(415,212) v2=(415,288) v3=(350,325) v4=(285,288) v5=(285,212) */}
      <polygon
        points="350,175 415,212 415,288 350,325 285,288 285,212"
        stroke="rgba(184,168,152,0.55)"
        strokeWidth="1.5"
        fill="rgba(7,7,10,0.8)"
      />
      {/* Inner body hex */}
      <polygon
        points="350,207 382,224 382,276 350,293 318,276 318,224"
        stroke="rgba(184,168,152,0.18)"
        strokeWidth="0.75"
        fill="none"
      />

      {/* Central sensor */}
      <circle cx="350" cy="250" r="20" stroke="rgba(184,168,152,0.45)" strokeWidth="1.25" fill="rgba(184,168,152,0.03)" />
      <circle cx="350" cy="250" r="7" stroke="rgba(184,168,152,0.7)" strokeWidth="1" fill="rgba(184,168,152,0.1)" />
      <circle cx="350" cy="250" r="2.5" fill="rgba(184,168,152,0.85)" />
      {/* Sensor ring dots */}
      {[0, 60, 120, 180, 240, 300].map(deg => {
        const r = deg * Math.PI / 180
        return <circle key={deg} cx={350 + 13 * Math.cos(r)} cy={250 + 13 * Math.sin(r)} r="1.5" fill="rgba(184,168,152,0.35)" />
      })}

      {/* ── Legs ── */}
      {/* attach points: edge midpoints */}
      {/* right-upper (382,194), right (415,250), right-lower (382,307) */}
      {/* left-upper  (318,194), left  (285,250), left-lower  (318,307) */}

      {/* Leg R-upper */}
      <line x1="382" y1="194" x2="453" y2="148" stroke="rgba(184,168,152,0.5)" strokeWidth="1.5" />
      <line x1="453" y1="148" x2="515" y2="112" stroke="rgba(184,168,152,0.4)" strokeWidth="1.5" />
      <circle cx="453" cy="148" r="4" stroke="rgba(184,168,152,0.55)" strokeWidth="1" fill="#07070a" />
      <circle cx="515" cy="112" r="5.5" stroke="rgba(184,168,152,0.45)" strokeWidth="1" fill="#07070a" />

      {/* Leg R-mid */}
      <line x1="415" y1="250" x2="490" y2="250" stroke="rgba(184,168,152,0.5)" strokeWidth="1.5" />
      <line x1="490" y1="250" x2="560" y2="250" stroke="rgba(184,168,152,0.4)" strokeWidth="1.5" />
      <circle cx="490" cy="250" r="4" stroke="rgba(184,168,152,0.55)" strokeWidth="1" fill="#07070a" />
      <circle cx="560" cy="250" r="5.5" stroke="rgba(184,168,152,0.45)" strokeWidth="1" fill="#07070a" />

      {/* Leg R-lower */}
      <line x1="382" y1="307" x2="453" y2="352" stroke="rgba(184,168,152,0.5)" strokeWidth="1.5" />
      <line x1="453" y1="352" x2="515" y2="388" stroke="rgba(184,168,152,0.4)" strokeWidth="1.5" />
      <circle cx="453" cy="352" r="4" stroke="rgba(184,168,152,0.55)" strokeWidth="1" fill="#07070a" />
      <circle cx="515" cy="388" r="5.5" stroke="rgba(184,168,152,0.45)" strokeWidth="1" fill="#07070a" />

      {/* Leg L-upper */}
      <line x1="318" y1="194" x2="247" y2="148" stroke="rgba(184,168,152,0.5)" strokeWidth="1.5" />
      <line x1="247" y1="148" x2="185" y2="112" stroke="rgba(184,168,152,0.4)" strokeWidth="1.5" />
      <circle cx="247" cy="148" r="4" stroke="rgba(184,168,152,0.55)" strokeWidth="1" fill="#07070a" />
      <circle cx="185" cy="112" r="5.5" stroke="rgba(184,168,152,0.45)" strokeWidth="1" fill="#07070a" />

      {/* Leg L-mid */}
      <line x1="285" y1="250" x2="210" y2="250" stroke="rgba(184,168,152,0.5)" strokeWidth="1.5" />
      <line x1="210" y1="250" x2="140" y2="250" stroke="rgba(184,168,152,0.4)" strokeWidth="1.5" />
      <circle cx="210" cy="250" r="4" stroke="rgba(184,168,152,0.55)" strokeWidth="1" fill="#07070a" />
      <circle cx="140" cy="250" r="5.5" stroke="rgba(184,168,152,0.45)" strokeWidth="1" fill="#07070a" />

      {/* Leg L-lower */}
      <line x1="318" y1="307" x2="247" y2="352" stroke="rgba(184,168,152,0.5)" strokeWidth="1.5" />
      <line x1="247" y1="352" x2="185" y2="388" stroke="rgba(184,168,152,0.4)" strokeWidth="1.5" />
      <circle cx="247" cy="352" r="4" stroke="rgba(184,168,152,0.55)" strokeWidth="1" fill="#07070a" />
      <circle cx="185" cy="388" r="5.5" stroke="rgba(184,168,152,0.45)" strokeWidth="1" fill="#07070a" />

      {/* ── Annotations ── */}
      {/* Sensor → upper-right */}
      <line x1="364" y1="237" x2="420" y2="200" stroke="rgba(184,168,152,0.22)" strokeWidth="0.75" strokeDasharray="3 3" />
      <line x1="420" y1="200" x2="480" y2="200" stroke="rgba(184,168,152,0.22)" strokeWidth="0.75" />
      <text x="485" y="204" fill="rgba(184,168,152,0.5)" fontSize="8.5" fontFamily="JetBrains Mono, monospace">SENSOR / DECISION UNIT</text>

      {/* Body → right */}
      <line x1="415" y1="230" x2="470" y2="180" stroke="rgba(184,168,152,0.15)" strokeWidth="0.75" strokeDasharray="2 4" />
      <text x="475" y="178" fill="rgba(184,168,152,0.38)" fontSize="8" fontFamily="JetBrains Mono, monospace">STRUCTURAL CHASSIS</text>

      {/* Foot R-mid → right */}
      <line x1="560" y1="250" x2="600" y2="230" stroke="rgba(184,168,152,0.18)" strokeWidth="0.75" />
      <text x="605" y="228" fill="rgba(184,168,152,0.38)" fontSize="8" fontFamily="JetBrains Mono, monospace">TERRAIN CONTACT</text>

      {/* Joint R-mid */}
      <line x1="490" y1="250" x2="510" y2="212" stroke="rgba(184,168,152,0.15)" strokeWidth="0.75" strokeDasharray="2 3" />
      <text x="515" y="210" fill="rgba(184,168,152,0.35)" fontSize="8" fontFamily="JetBrains Mono, monospace">ACTUATED JOINT</text>

      {/* Left side annotation */}
      <line x1="140" y1="250" x2="100" y2="220" stroke="rgba(184,168,152,0.15)" strokeWidth="0.75" />
      <text x="98" y="218" fill="rgba(184,168,152,0.35)" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="end">LOCOMOTION LIMB</text>

      {/* ── Title bar ── */}
      <rect x="0" y="0" width="700" height="26" fill="rgba(7,7,10,0.9)" />
      <text x="14" y="16" fill="rgba(184,168,152,0.6)" fontSize="8.5" fontFamily="JetBrains Mono, monospace" letterSpacing="1.5">HELIX — AUTONOMOUS HEXAPOD — CONCEPTUAL ARCHITECTURE — PLAN VIEW</text>
      <text x="686" y="16" fill="rgba(184,168,152,0.3)" fontSize="8.5" fontFamily="JetBrains Mono, monospace" textAnchor="end">REV 0.1 — RESEARCH PHASE</text>

      {/* ── Dimension span ── */}
      <line x1="140" y1="435" x2="560" y2="435" stroke="rgba(184,168,152,0.18)" strokeWidth="0.75" />
      <line x1="140" y1="430" x2="140" y2="440" stroke="rgba(184,168,152,0.18)" strokeWidth="0.75" />
      <line x1="560" y1="430" x2="560" y2="440" stroke="rgba(184,168,152,0.18)" strokeWidth="0.75" />
      <text x="350" y="450" fill="rgba(184,168,152,0.3)" fontSize="8" fontFamily="JetBrains Mono, monospace" textAnchor="middle">TOTAL SPAN — TBD</text>

      {/* ── Status badge ── */}
      <rect x="14" y="458" width="218" height="20" rx="2" fill="rgba(184,168,152,0.04)" stroke="rgba(184,168,152,0.12)" strokeWidth="0.75" />
      <circle cx="24" cy="468" r="3" fill="rgba(184,168,152,0.4)" />
      <text x="32" y="472" fill="rgba(184,168,152,0.5)" fontSize="8" fontFamily="JetBrains Mono, monospace">RESEARCH AND ARCHITECTURE PHASE</text>
    </svg>
  )
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function Nav({ current, go }: { current: Page; go: (p: Page) => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 70)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const items: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Problem', page: 'problem' },
    { label: 'Helix', page: 'helix' },
    { label: 'Research', page: 'research' },
    { label: 'Progress', page: 'progress' },
    { label: 'Vision', page: 'vision' },
    { label: 'About', page: 'about' },
  ]

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#07070a]/92 backdrop-blur-md border-b border-white/[0.05]' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button onClick={() => go('home')} className="font-mono text-[11px] tracking-[0.35em] text-[#e8e4dd]/90 hover:text-[#b8a898] transition-colors">
          NEBULA
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-7">
          {items.map(it => (
            <button
              key={it.page}
              onClick={() => go(it.page)}
              className={`relative font-mono text-[10px] tracking-widest transition-colors group ${current === it.page ? 'text-[#e8e4dd]' : 'text-[#555] hover:text-[#c0bcb6]'}`}
            >
              {it.label.toUpperCase()}
              <span className={`absolute -bottom-0.5 left-0 h-px bg-[#b8a898] transition-all duration-300 ${current === it.page ? 'w-full' : 'w-0 group-hover:w-full'}`} />
            </button>
          ))}
        </div>

        <a href="#" className="hidden md:block font-mono text-[10px] tracking-widest text-[#333] hover:text-[#888] transition-colors" target="_blank" rel="noopener noreferrer">
          GITHUB
        </a>

        {/* Mobile hamburger */}
        <button className="md:hidden flex flex-col gap-[5px] w-5" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span className={`h-px w-full bg-[#e8e4dd] transition-all duration-300 origin-center ${open ? 'rotate-45 translate-y-[6px]' : ''}`} />
          <span className={`h-px w-full bg-[#e8e4dd] transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`h-px w-full bg-[#e8e4dd] transition-all duration-300 origin-center ${open ? '-rotate-45 -translate-y-[6px]' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-96' : 'max-h-0'}`}>
        <div className="bg-[#07070a]/96 backdrop-blur-md border-t border-white/[0.05] px-6 pb-6 pt-4">
          {items.map(it => (
            <button
              key={it.page}
              onClick={() => { go(it.page); setOpen(false) }}
              className={`block w-full text-left py-3 font-mono text-[10px] tracking-widest border-b border-[#1a1a20] last:border-0 transition-colors ${current === it.page ? 'text-[#e8e4dd]' : 'text-[#555]'}`}
            >
              {it.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer({ go }: { go: (p: Page) => void }) {
  return (
    <footer className="border-t border-[#1a1a20] py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <span className="font-mono text-[10px] tracking-[0.35em] text-[#2a2a32]">NEBULA</span>
        <div className="flex flex-wrap gap-6">
          {(['problem', 'helix', 'research', 'progress', 'vision', 'about', 'contact'] as Page[]).map(p => (
            <button key={p} onClick={() => go(p)} className="font-mono text-[9px] tracking-widest text-[#2a2a32] hover:text-[#555] transition-colors">
              {p.toUpperCase()}
            </button>
          ))}
        </div>
        <span className="font-mono text-[9px] tracking-wider text-[#1e1e24]">© 2026 — RESEARCH PHASE</span>
      </div>
    </footer>
  )
}

// ─── Home ─────────────────────────────────────────────────────────────────────

function HomePage({ go }: { go: (p: Page) => void }) {
  return (
    <div>
      {/* 1 — Hero */}
      <section className="relative h-screen min-h-[680px] flex flex-col justify-end pb-20 overflow-hidden bg-[#07070a]">
        <div className="absolute inset-0">
          <img src={IMG.lunar} alt="Lunar surface — NASA documentary photograph" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-[#07070a]/55 to-[#07070a]/15" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070a]/65 via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/70 mb-10">NEBULA — RESEARCH PROGRAM</p>
            <h1 className="font-serif text-[56px] md:text-[80px] lg:text-[100px] leading-[0.95] text-[#e8e4dd] mb-8">
              Resources<br />beyond Earth.
            </h1>
            <p className="text-[#7a7672] text-base md:text-[17px] max-w-lg mb-12 leading-relaxed">
              Nebula is researching the autonomous systems required to find, extract, process and utilize resources beyond our planet.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => go('helix')} className="px-7 py-3 bg-[#e8e4dd] text-[#07070a] font-mono text-[10px] tracking-widest hover:bg-[#b8a898] transition-colors">
                EXPLORE HELIX
              </button>
              <button onClick={() => go('vision')} className="px-7 py-3 border border-[#e8e4dd]/20 text-[#e8e4dd]/80 font-mono text-[10px] tracking-widest hover:border-[#e8e4dd]/45 hover:text-[#e8e4dd] transition-colors">
                OUR VISION
              </button>
            </div>
          </div>
        </div>
        {/* Scroll cue */}
        <div className="absolute bottom-10 right-8 z-10 flex flex-col items-center gap-3">
          <span className="font-mono text-[8px] tracking-[0.25em] text-[#333]" style={{ writingMode: 'vertical-rl' }}>SCROLL</span>
          <div className="h-10 w-px bg-gradient-to-b from-transparent to-[#333]" />
        </div>
      </section>

      {/* 2 — The Problem */}
      <section className="py-28 border-t border-[#1a1a20]">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">01 — THE PROBLEM</p>
            <h2 className="font-serif text-4xl md:text-5xl text-[#e8e4dd] mb-7 leading-tight">
              The next resource<br />frontier is beyond Earth.
            </h2>
            <p className="text-[#666] leading-relaxed mb-10">
              Operating beyond Earth introduces interconnected challenges at every level. Finding a resource is not equivalent to being able to use it.
            </p>
            <div className="grid grid-cols-2 border border-[#1e1e24]">
              {['Resource availability', 'Accessibility', 'Extraction', 'Processing', 'Energy', 'Communication', 'Autonomy', 'Environmental resilience', 'Long-duration operation'].map((item, i) => (
                <div key={item} className={`px-4 py-2.5 border-b border-[#1e1e24] font-mono text-[10px] tracking-wider text-[#555] ${i % 2 === 0 ? 'border-r' : ''}`}>
                  {item}
                </div>
              ))}
            </div>
            <button onClick={() => go('problem')} className="mt-8 font-mono text-[10px] tracking-widest text-[#b8a898]/70 hover:text-[#b8a898] transition-colors">
              EXPLORE THE PROBLEM →
            </button>
          </div>
          <div className="relative bg-[#0f0f13]">
            <img src={IMG.lunarSurface} alt="Lunar surface close-up" className="w-full aspect-[4/3] object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#07070a]/30" />
          </div>
        </div>
      </section>

      {/* 3 — Helix */}
      <section className="py-28 border-t border-[#1a1a20]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">02 — HELIX</p>
              <h2 className="font-serif text-5xl md:text-6xl text-[#e8e4dd] mb-4">Meet Helix.</h2>
              <div className="inline-flex items-center gap-2 border border-[#b8a898]/20 px-3 py-1.5 mb-7">
                <div className="w-1.5 h-1.5 rounded-full bg-[#b8a898]/50" />
                <span className="font-mono text-[9px] tracking-widest text-[#b8a898]/55">RESEARCH AND ARCHITECTURE PHASE</span>
              </div>
              <p className="text-[#666] leading-relaxed mb-12">
                An autonomous robotic system being researched for operation in extraterrestrial environments. Currently in the research and architecture phase.
              </p>
              <div className="border border-[#1e1e24]">
                {[
                  { n: '01', title: 'Environmental resilience', desc: 'Designed around the challenges of lunar dust, vacuum and extreme thermal conditions.' },
                  { n: '02', title: 'Autonomous operation', desc: 'Designed to operate with limited continuous human intervention.' },
                  { n: '03', title: 'Autonomous recovery', desc: 'Researching systems capable of detecting failures and attempting recovery.' },
                  { n: '04', title: 'Self-repair', desc: 'Exploring mechanisms through which the system could potentially restore damaged components.' },
                  { n: '05', title: 'Machine assistance', desc: 'Exploring whether one autonomous system could diagnose, assist, or recover another.' },
                  { n: '06', title: 'Resource operations', desc: 'Researching terrain perception, resource identification, excavation and material handling.' },
                ].map(cap => (
                  <div key={cap.n} className="border-b border-[#1e1e24] last:border-b-0 px-5 py-4 hover:bg-[#0c0c0f] transition-colors">
                    <p className="font-mono text-[9px] tracking-widest text-[#b8a898]/40 mb-1">{cap.n}</p>
                    <p className="text-[#c8c4be] text-sm mb-1">{cap.title}</p>
                    <p className="text-[#4a4a52] text-xs leading-relaxed">{cap.desc}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 font-mono text-[8px] tracking-wider text-[#333] italic">Research objectives and development goals — not completed capabilities.</p>
              <button onClick={() => go('helix')} className="mt-6 font-mono text-[10px] tracking-widest text-[#b8a898]/70 hover:text-[#b8a898] transition-colors">
                FULL HELIX OVERVIEW →
              </button>
            </div>
            <div className="lg:sticky lg:top-24">
              <HelixSchematic className="w-full opacity-85" />
            </div>
          </div>
        </div>
      </section>

      {/* 4 — Research */}
      <section className="py-28 border-t border-[#1a1a20]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">03 — RESEARCH</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-14">
            <h2 className="font-serif text-4xl md:text-5xl text-[#e8e4dd]">Research underway.</h2>
            <button onClick={() => go('research')} className="font-mono text-[10px] tracking-widest text-[#b8a898]/60 hover:text-[#b8a898] transition-colors">
              VIEW ALL →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#1a1a20]">
            {['Extraterrestrial Resources', 'Autonomous Robotics', 'Lunar Environment', 'Resource Extraction', 'Resource Processing', 'Autonomous Decision Systems', 'Computational Modeling'].map(cat => (
              <div key={cat} className="bg-[#07070a] p-7 hover:bg-[#0a0a0e] transition-colors cursor-default">
                <div className="w-2 h-2 border border-[#1e1e24] mb-8" />
                <p className="text-[#3a3a44] text-sm leading-snug mb-3">{cat}</p>
                <p className="font-mono text-[8px] tracking-wider text-[#222]">UNDERWAY</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 — Progress */}
      <section className="py-28 border-t border-[#1a1a20]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">04 — PROGRESS</p>
          <h2 className="font-serif text-4xl md:text-5xl text-[#e8e4dd] mb-16">What we've learned.</h2>
          <div className="max-w-2xl">
            <p className="font-mono text-[9px] tracking-[0.3em] text-[#b8a898]/50 mb-8">SEPTEMBER 2026</p>
            <div className="space-y-0">
              {[
                { title: 'Defining the problem', desc: 'Mapping the challenges surrounding extraterrestrial resource utilization and autonomous operation.' },
                { title: 'Challenging assumptions', desc: 'Identifying assumptions that require evidence rather than acceptance.' },
                { title: 'Safety as a constraint', desc: 'Recognizing that systems intended to eventually support human activity cannot treat unresolved safety risks casually.' },
              ].map((entry, i) => (
                <div key={entry.title} className="grid grid-cols-[20px_1fr] gap-6 mb-10">
                  <div className="flex flex-col items-center pt-1.5">
                    <div className="w-2 h-2 rounded-full border border-[#2a2a32] bg-[#07070a] flex-shrink-0" />
                    {i < 2 && <div className="w-px flex-1 bg-[#1a1a20] mt-2" />}
                  </div>
                  <div>
                    <h3 className="text-[#c8c4be] text-base mb-2">{entry.title}</h3>
                    <p className="text-[#4a4a52] text-sm leading-relaxed">{entry.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => go('progress')} className="mt-2 font-mono text-[10px] tracking-widest text-[#b8a898]/70 hover:text-[#b8a898] transition-colors">
            VIEW THE FULL PROGRESS LOG →
          </button>
        </div>
      </section>

      {/* 6 — Vision */}
      <section className="relative py-40 border-t border-[#1a1a20] overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.earth} alt="Planet Earth from space" className="w-full h-full object-cover opacity-18" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-[#07070a]/75 to-[#07070a]/55" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">05 — VISION</p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-[68px] text-[#e8e4dd] mb-8 leading-tight max-w-3xl">
            The work begins with resources. The objective is expansion.
          </h2>
          <div className="flex flex-wrap items-center gap-3 mb-14 font-mono text-[10px] tracking-wider">
            {['Resources', '→', 'Infrastructure', '→', 'Presence', '→', 'Expansion'].map((item, i) => (
              <span key={i} className={item === '→' ? 'text-[#2a2a32]' : 'text-[#555]'}>{item}</span>
            ))}
          </div>
          <p className="text-[#4a4a52] leading-relaxed max-w-lg mb-20">
            The long-term objective is to expand the physical domain in which humanity can live, build and operate.
          </p>
          <div className="overflow-hidden">
            <p className="font-serif text-[18vw] leading-none text-[#e8e4dd]/[0.035] select-none -ml-2">IMPACT</p>
          </div>
          <p className="font-mono text-[9px] tracking-[0.3em] text-[#333] -mt-4">BUILD WHAT MATTERS. PUSH THE BOUNDARY. LEAVE AN IMPACT.</p>
          <button onClick={() => go('vision')} className="mt-12 font-mono text-[10px] tracking-widest text-[#b8a898]/70 hover:text-[#b8a898] transition-colors">
            READ THE VISION →
          </button>
        </div>
      </section>

      {/* 7 — People */}
      <section className="py-28 border-t border-[#1a1a20]">
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">06 — PEOPLE</p>
          <h2 className="font-serif text-4xl text-[#e8e4dd] mb-16">The team building Nebula.</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-2xl">
            {[
              { initials: 'YP', name: 'Yashasvi Pathak', role: 'FOUNDER', linkedin: 'https://www.linkedin.com/in/yashasvi-pathak-991794437/' },
              { initials: 'AS', name: 'Amir Shams Azad', role: 'CO-FOUNDER', linkedin: null },
            ].map(person => (
              <div key={person.name} className="border border-[#1a1a20] p-8 hover:border-[#252530] transition-colors">
                <div className="w-12 h-12 border border-[#222] flex items-center justify-center mb-7">
                  <span className="font-serif text-xl text-[#b8a898]/45">{person.initials}</span>
                </div>
                <h3 className="text-[#e8e4dd] text-lg mb-1">{person.name}</h3>
                <p className="font-mono text-[9px] tracking-widest text-[#444] mb-7">{person.role}</p>
                {person.linkedin ? (
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-[9px] tracking-widest text-[#b8a898]/55 hover:text-[#b8a898] transition-colors">
                    LINKEDIN →
                  </a>
                ) : (
                  <span className="font-mono text-[9px] tracking-widest text-[#222]">LINKEDIN — COMING SOON</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8 — Contact */}
      <section className="py-28 border-t border-[#1a1a20]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-4xl md:text-5xl text-[#e8e4dd] mb-4">Interested in the problem?</h2>
          <p className="text-[#555] mb-14 max-w-md leading-relaxed">We're early and thinking through hard questions. If you're thinking about similar problems, we'd like to hear from you.</p>
          <div className="grid md:grid-cols-3 border border-[#1a1a20] max-w-xl">
            <div className="p-6 md:border-r border-b md:border-b-0 border-[#1a1a20]">
              <p className="font-mono text-[8px] tracking-widest text-[#333] mb-3">EMAIL</p>
              <a href="mailto:hojim2416@gmail.com" className="text-[#c8c4be] text-sm hover:text-[#b8a898] transition-colors break-all">hojim2416@gmail.com</a>
            </div>
            <div className="p-6 md:border-r border-b md:border-b-0 border-[#1a1a20]">
              <p className="font-mono text-[8px] tracking-widest text-[#333] mb-3">LINKEDIN</p>
              <a href="https://www.linkedin.com/in/yashasvi-pathak-991794437/" target="_blank" rel="noopener noreferrer" className="text-[#c8c4be] text-sm hover:text-[#b8a898] transition-colors">Yashasvi Pathak</a>
            </div>
            <div className="p-6">
              <p className="font-mono text-[8px] tracking-widest text-[#333] mb-3">GITHUB</p>
              <span className="text-[#252530] text-sm">Coming soon</span>
            </div>
          </div>
        </div>
      </section>

      <Footer go={go} />
    </div>
  )
}

// ─── Problem Page ─────────────────────────────────────────────────────────────

function ProblemPage({ go }: { go: (p: Page) => void }) {
  const layers = [
    { n: '01', title: 'Availability', desc: 'What resources exist beyond Earth and where they are found. The lunar surface contains oxygen locked in minerals, hydrogen, metals, and helium-3. Identifying what is there is only the beginning of a much longer chain.' },
    { n: '02', title: 'Accessibility', desc: 'Whether resources can actually be reached and used. Proximity does not equal accessibility — location, terrain, depth, concentration, and physical state all determine whether a resource can be practically reached.' },
    { n: '03', title: 'Extraction', desc: 'How material can be physically removed from extraterrestrial environments. Regolith excavation in vacuum, with no air pressure, extreme temperatures, and abrasive charged dust, presents fundamentally different engineering challenges than terrestrial extraction.' },
    { n: '04', title: 'Processing', desc: 'How raw material can become useful material. Converting extracted regolith into usable forms — metals, oxygen, water — requires energy-intensive processes adapted for off-Earth conditions and severe resource constraints.' },
    { n: '05', title: 'Energy', desc: 'How resource operations can function within severe energy constraints. Solar energy varies dramatically across the lunar day-night cycle. Energy storage, distribution, and efficiency directly constrain every other operation.' },
    { n: '06', title: 'Autonomy', desc: 'How machines can operate without continuous human control. Communication delays, signal constraints, and the complexity of lunar environments mean that useful systems must make decisions independently. There are deeper unresolved questions here — systems that will eventually support human activity cannot operate on unresolved safety assumptions. Biological consequences of long-duration operation in altered gravity remain open questions.' },
    { n: '07', title: 'Environmental resilience', desc: 'Dust, vacuum, radiation, thermal extremes, terrain and mechanical degradation. Lunar dust is electrostatically charged and abrasive. Temperatures range from −173°C to +127°C within a single day-night cycle. Vacuum eliminates convective cooling. All of this actively degrades mechanical systems.' },
    { n: '08', title: 'Long-duration reliability', desc: 'How systems can remain functional for extended operations. A system that fails after two weeks provides limited value. Long-duration reliability in an environment where repair or replacement is extremely difficult is a core unsolved engineering challenge.' },
  ]

  return (
    <div className="pt-16 pb-32">
      <div className="relative py-28 bg-[#07070a] overflow-hidden">
        <div className="absolute inset-0">
          <img src={IMG.lunarSurface} alt="Lunar surface" className="w-full h-full object-cover opacity-12" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07070a]/80 to-[#07070a]/60" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">THE PROBLEM</p>
          <h1 className="font-serif text-5xl md:text-7xl text-[#e8e4dd] max-w-3xl leading-tight">
            The next resource frontier is beyond Earth.
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <p className="text-[#555] max-w-xl mb-20 leading-relaxed text-lg">
          These challenges don't exist in isolation — each constrains the others. Finding a resource is not equivalent to being able to use it.
        </p>

        <div className="border border-[#1a1a20]">
          {layers.map(layer => (
            <div key={layer.n} className="border-b border-[#1a1a20] last:border-b-0 grid md:grid-cols-[100px_220px_1fr] hover:bg-[#0a0a0d] transition-colors">
              <div className="p-6 md:border-r border-[#1a1a20]">
                <span className="font-mono text-[9px] tracking-widest text-[#b8a898]/35">{layer.n}</span>
              </div>
              <div className="px-6 py-6 md:border-r border-[#1a1a20]">
                <h3 className="font-serif text-xl text-[#e8e4dd]">{layer.title}</h3>
              </div>
              <div className="px-6 py-6 pb-8">
                <p className="text-[#4e4e58] text-sm leading-relaxed">{layer.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-[#1a1a20] pt-12">
          <button onClick={() => go('helix')} className="font-mono text-[10px] tracking-widest text-[#b8a898]/70 hover:text-[#b8a898] transition-colors">
            HOW HELIX ADDRESSES THESE CHALLENGES →
          </button>
        </div>
      </div>
      <Footer go={go} />
    </div>
  )
}

// ─── Helix Page ───────────────────────────────────────────────────────────────

function HelixPage({ go }: { go: (p: Page) => void }) {
  const areas = [
    {
      title: 'Environmental resilience',
      items: ['Lunar dust / regolith resistance', 'Vacuum operation', 'Extreme thermal conditions', 'Mechanical durability', 'Long-duration operation'],
    },
    {
      title: 'Autonomous resilience',
      items: ['Self-diagnosis', 'Fault isolation', 'Autonomous recovery', 'Redundancy design', 'Self-repair', 'Machine-to-machine assistance'],
    },
    {
      title: 'Resource operations',
      items: ['Perception', 'Terrain mapping', 'Resource identification', 'Navigation', 'Excavation', 'Material handling', 'Processing', 'Energy management', 'Autonomous planning'],
    },
  ]

  return (
    <div className="pt-16">
      {/* Hero */}
      <div className="relative min-h-[55vh] flex items-end pb-20 overflow-hidden bg-[#07070a]">
        <div className="absolute inset-0">
          <img src={IMG.lunarSurface} alt="Lunar surface" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070a] via-[#07070a]/50 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-5">NEBULA — AUTONOMOUS SYSTEMS</p>
          <h1 className="font-serif text-[80px] md:text-[120px] leading-none text-[#e8e4dd] mb-4">HELIX</h1>
          <p className="text-[#666] text-lg mb-5">Autonomous systems for extraterrestrial environments.</p>
          <div className="inline-flex items-center gap-2 border border-[#b8a898]/18 px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#b8a898]/45 animate-pulse" />
            <span className="font-mono text-[9px] tracking-widest text-[#b8a898]/50">RESEARCH AND ARCHITECTURE UNDERWAY</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20 pb-32">
        {/* Schematic */}
        <div className="mb-24 border border-[#1a1a20] p-8 bg-[#050508]">
          <HelixSchematic className="w-full max-w-3xl mx-auto" />
        </div>

        {/* Mission */}
        <div className="border-t border-[#1a1a20] py-16 grid md:grid-cols-[1fr_2fr] gap-12">
          <div>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-4">MISSION OBJECTIVE</p>
            <h2 className="font-serif text-2xl text-[#e8e4dd]">What Helix is designed to become.</h2>
          </div>
          <p className="text-[#555] leading-relaxed self-center">
            Develop an autonomous robotic architecture capable of operating in difficult extraterrestrial environments and eventually performing resource-related operations. Helix is Nebula's current primary engineering research focus.
          </p>
        </div>

        {/* Research areas */}
        {areas.map(area => (
          <div key={area.title} className="border-t border-[#1a1a20] py-16">
            <div className="grid md:grid-cols-[1fr_2fr] gap-12">
              <div>
                <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-3">RESEARCH AREA</p>
                <h3 className="font-serif text-2xl text-[#e8e4dd]">{area.title}</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a20] self-start">
                {area.items.map(item => (
                  <div key={item} className="bg-[#07070a] p-4 hover:bg-[#0a0a0e] transition-colors">
                    <p className="text-[#4a4a55] text-sm">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* Architecture placeholder */}
        <div className="border-t border-[#1a1a20] py-16">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-8">SYSTEM ARCHITECTURE</p>
          <div className="border border-[#1a1a20] flex flex-col items-center justify-center text-center p-20 bg-[#050508]">
            <p className="font-serif text-2xl text-[#252530] mb-3">System architecture currently under development.</p>
            <p className="font-mono text-[8px] tracking-widest text-[#1a1a20]">WILL BE PUBLISHED AS RESEARCH PROGRESSES</p>
          </div>
        </div>

        <p className="font-mono text-[8px] tracking-wider text-[#2a2a32] mt-4">
          All items listed are research objectives and development goals — not completed capabilities.
        </p>
      </div>
      <Footer go={go} />
    </div>
  )
}

// ─── Research Page ────────────────────────────────────────────────────────────

function ResearchPage({ go }: { go: (p: Page) => void }) {
  const categories = [
    'Extraterrestrial Resources', 'Autonomous Robotics', 'Lunar Environment',
    'Resource Extraction', 'Resource Processing', 'Autonomous Decision Systems', 'Computational Modeling',
  ]
  const types = ['Research papers', 'Technical reports', 'Literature reviews', 'Simulations', 'Datasets', 'Code', 'Experiments', 'Design documents', 'Mathematical models', 'Prototypes']

  return (
    <div className="pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-24 border-b border-[#1a1a20]">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">RESEARCH</p>
          <h1 className="font-serif text-5xl md:text-7xl text-[#e8e4dd] mb-8">Research underway.</h1>
          <p className="text-[#555] max-w-xl leading-relaxed">
            Nebula is currently investigating the scientific, engineering and computational questions required to make autonomous extraterrestrial resource operations possible. Research material will be published here as it becomes available.
          </p>
        </div>

        <div className="py-16 border-b border-[#1a1a20]">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-10">RESEARCH AREAS</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#1a1a20]">
            {categories.map(cat => (
              <div key={cat} className="bg-[#07070a] p-8 hover:bg-[#0a0a0e] transition-colors">
                <div className="w-2 h-2 border border-[#1a1a20] mb-8" />
                <p className="text-[#333] text-sm leading-snug mb-3">{cat}</p>
                <p className="font-mono text-[8px] tracking-wider text-[#1e1e24]">UNDERWAY</p>
              </div>
            ))}
          </div>
        </div>

        {/* Empty state */}
        <div className="py-24 flex justify-center">
          <div className="border border-[#1a1a20] px-16 py-16 text-center">
            <p className="font-serif text-2xl text-[#222] mb-3">No publications yet.</p>
            <p className="font-mono text-[8px] tracking-widest text-[#1a1a20]">RESEARCH MATERIAL WILL APPEAR HERE</p>
          </div>
        </div>

        {/* Format note */}
        <div className="border border-[#1a1a20] p-6">
          <p className="font-mono text-[8px] tracking-widest text-[#2a2a32] mb-5">FUTURE RESEARCH ITEMS WILL SUPPORT</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {types.map(t => (
              <div key={t} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-[#1e1e24] flex-shrink-0" />
                <span className="font-mono text-[8px] tracking-wider text-[#252530]">{t.toUpperCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer go={go} />
    </div>
  )
}

// ─── Progress Page ────────────────────────────────────────────────────────────

function ProgressPage({ go }: { go: (p: Page) => void }) {
  const entries = [
    {
      title: 'Defining the problem',
      type: 'RESEARCH DIRECTION',
      desc: 'Mapping the interconnected challenges surrounding extraterrestrial resource utilization and autonomous operation. The problem is substantially larger and more interconnected than initial framing suggested.',
    },
    {
      title: 'Challenging assumptions',
      type: 'CRITICAL REVIEW',
      desc: 'Identifying assumptions embedded in the initial framing that require evidence rather than acceptance. Several widely-cited figures in space resource literature warrant careful independent examination.',
    },
    {
      title: 'Safety as a constraint',
      type: 'ARCHITECTURAL PRINCIPLE',
      desc: 'Recognizing that systems intended to eventually support human activity cannot treat unresolved safety risks casually. Safety is being established as a non-negotiable architectural constraint from the earliest research phase, not an afterthought.',
    },
  ]

  return (
    <div className="pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-24 border-b border-[#1a1a20]">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">RESEARCH LOG</p>
          <h1 className="font-serif text-5xl md:text-7xl text-[#e8e4dd] mb-8">What we've learned.</h1>
          <p className="text-[#555] max-w-xl leading-relaxed">
            A transparent, chronological record of how our understanding changes. Not milestones — an honest account of questions discovered, assumptions challenged, and directions explored. This includes dead ends.
          </p>
        </div>

        <div className="py-20 max-w-2xl">
          <p className="font-mono text-[9px] tracking-[0.3em] text-[#b8a898]/50 mb-12">SEPTEMBER 2026</p>

          <div className="space-y-12">
            {entries.map((entry, i) => (
              <div key={entry.title} className="grid grid-cols-[20px_1fr] gap-8">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2 h-2 rounded-full border border-[#2a2a32] bg-[#07070a] flex-shrink-0" />
                  {i < entries.length - 1 && <div className="w-px flex-1 bg-[#1a1a20] mt-3" />}
                </div>
                <div className="pb-2">
                  <span className="font-mono text-[8px] tracking-widest text-[#b8a898]/35 block mb-2">{entry.type}</span>
                  <h3 className="text-[#c8c4be] text-lg mb-3">{entry.title}</h3>
                  <p className="text-[#4a4a55] text-sm leading-relaxed">{entry.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 border border-[#1a1a20] p-6 opacity-35">
            <p className="font-mono text-[8px] tracking-widest text-[#2a2a32]">FUTURE ENTRIES WILL APPEAR HERE</p>
          </div>
        </div>

        <div className="border-t border-[#1a1a20] pt-10 max-w-lg">
          <p className="font-mono text-[8px] tracking-wider text-[#2a2a32] leading-relaxed">
            This log will continuously document real progress — including failures, dead ends, and changes in understanding. It is not a curated success story.
          </p>
        </div>
      </div>
      <Footer go={go} />
    </div>
  )
}

// ─── Vision Page ──────────────────────────────────────────────────────────────

function VisionPage({ go }: { go: (p: Page) => void }) {
  const chain = [
    { n: '01', title: 'Resources', desc: 'Autonomous systems find, extract, and process extraterrestrial materials. The foundation.' },
    { n: '02', title: 'Infrastructure', desc: 'Resources enable the construction of infrastructure beyond Earth.' },
    { n: '03', title: 'Presence', desc: 'Infrastructure enables persistent human and robotic operations beyond Earth.' },
    { n: '04', title: 'Expansion', desc: 'Persistent presence enables the expansion of the physical domain of human civilization.' },
  ]

  return (
    <div className="pt-16">
      <div className="max-w-7xl mx-auto px-6 py-24 border-b border-[#1a1a20]">
        <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">VISION</p>
        <h1 className="font-serif text-5xl md:text-7xl lg:text-[84px] text-[#e8e4dd] mb-6 leading-none">
          The work begins<br />with resources.
        </h1>
        <h2 className="font-serif text-3xl md:text-5xl text-[#3a3a44]">The objective is expansion.</h2>
      </div>

      {/* Earth image */}
      <div className="relative h-[45vh] overflow-hidden bg-[#07070a]">
        <img src={IMG.earth} alt="Planet Earth from space" className="w-full h-full object-cover opacity-35" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07070a]/80 via-transparent to-[#07070a]/80" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        {/* Chain */}
        <div className="border-t border-[#1a1a20] pt-20 mb-20">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-12">THE PROGRESSION</p>
          <div className="grid md:grid-cols-4 gap-px bg-[#1a1a20] border border-[#1a1a20]">
            {chain.map(item => (
              <div key={item.n} className="bg-[#07070a] p-8 hover:bg-[#0a0a0e] transition-colors">
                <p className="font-mono text-[9px] tracking-widest text-[#b8a898]/30 mb-6">{item.n}</p>
                <h3 className="font-serif text-2xl text-[#e8e4dd] mb-4">{item.title}</h3>
                <p className="text-[#3e3e48] text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Long-form */}
        <div className="border-t border-[#1a1a20] py-20 grid md:grid-cols-[1fr_2fr] gap-16">
          <div>
            <h3 className="font-serif text-3xl text-[#e8e4dd]">A larger objective</h3>
          </div>
          <div className="space-y-6 text-[#4e4e58] leading-relaxed">
            <p>Humanity's physical presence does not necessarily have to remain confined to Earth. The constraints that have historically defined the boundaries of human civilization are beginning, for the first time, to be addressable with serious engineering.</p>
            <p>The work Nebula is engaged in — autonomous systems for extraterrestrial resource utilization — is one component of a much larger progression. Resources enable infrastructure. Infrastructure enables persistent operations. Persistent operations enable expansion.</p>
            <p>We are not claiming that Nebula will accomplish this alone, or that this progression is inevitable, or that it will happen on any particular timeline. We are claiming that the technical work required is real, that the questions are tractable, and that this direction is worth serious effort.</p>
          </div>
        </div>

        {/* IMPACT */}
        <div className="border-t border-[#1a1a20] pt-20 pb-10">
          <div className="overflow-hidden mb-0">
            <p className="font-serif text-[20vw] leading-none text-[#e8e4dd]/[0.03] select-none tracking-tight -ml-1">IMPACT</p>
          </div>
          <div className="-mt-6 md:-mt-10 relative z-10 space-y-2">
            <p className="font-serif italic text-3xl md:text-5xl text-[#e8e4dd]">Build what matters.</p>
            <p className="font-serif italic text-3xl md:text-5xl text-[#666]">Push the boundary.</p>
            <p className="font-serif italic text-3xl md:text-5xl text-[#e8e4dd]">Leave an impact.</p>
          </div>
        </div>
      </div>
      <Footer go={go} />
    </div>
  )
}

// ─── About Page ───────────────────────────────────────────────────────────────

function AboutPage({ go }: { go: (p: Page) => void }) {
  return (
    <div className="pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-24 border-b border-[#1a1a20]">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">ABOUT</p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#e8e4dd] mb-8">The people building Nebula.</h1>
          <p className="text-[#555] max-w-xl leading-relaxed">
            Nebula is an early-stage deep-tech project focused on enabling humanity to utilize resources beyond Earth and ultimately expand human presence beyond our planet.
          </p>
        </div>

        {/* Founders */}
        <div className="py-24 grid md:grid-cols-2 gap-0 border-b border-[#1a1a20]">
          <div className="md:border-r border-b md:border-b-0 border-[#1a1a20] pb-16 md:pb-0 md:pr-16">
            <div className="w-14 h-14 border border-[#1e1e24] flex items-center justify-center mb-8">
              <span className="font-serif text-xl text-[#b8a898]/40">YP</span>
            </div>
            <h2 className="font-serif text-3xl text-[#e8e4dd] mb-2">Yashasvi Pathak</h2>
            <p className="font-mono text-[9px] tracking-widest text-[#444] mb-8">FOUNDER</p>
            <p className="text-[#4a4a55] text-sm leading-relaxed mb-10">
              Founder of Nebula, focused on building the foundational research and engineering required to enable autonomous resource utilization beyond Earth.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://www.linkedin.com/in/yashasvi-pathak-991794437/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[9px] tracking-widest text-[#b8a898]/55 hover:text-[#b8a898] transition-colors border border-[#1e1e24] hover:border-[#2a2a32] px-4 py-2.5"
              >
                LINKEDIN →
              </a>
              <span className="font-mono text-[9px] tracking-widest text-[#1e1e24] border border-[#141418] px-4 py-2.5">
                GITHUB — COMING SOON
              </span>
            </div>
          </div>

          <div className="pt-16 md:pt-0 md:pl-16">
            <div className="w-14 h-14 border border-[#1e1e24] flex items-center justify-center mb-8">
              <span className="font-serif text-xl text-[#b8a898]/40">AS</span>
            </div>
            <h2 className="font-serif text-3xl text-[#e8e4dd] mb-2">Amir Shams Azad</h2>
            <p className="font-mono text-[9px] tracking-widest text-[#444] mb-8">CO-FOUNDER</p>
            <p className="text-[#4a4a55] text-sm leading-relaxed mb-10">
              Co-founder of Nebula, working alongside Yashasvi on the research and engineering challenges at the foundation of the Nebula project.
            </p>
            <span className="font-mono text-[9px] tracking-widest text-[#1e1e24] border border-[#141418] px-4 py-2.5">
              LINKEDIN — COMING SOON
            </span>
          </div>
        </div>

        {/* About section */}
        <div className="py-20 grid md:grid-cols-[1fr_2fr] gap-16">
          <div>
            <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-4">ABOUT NEBULA</p>
            <h3 className="font-serif text-2xl text-[#e8e4dd]">Early. Serious. Research-driven.</h3>
          </div>
          <div className="text-[#4a4a55] text-sm leading-relaxed space-y-5">
            <p>Nebula is a research project at its earliest stage. The current work is focused primarily on extraterrestrial resources and the development of autonomous robotic systems capable of operating in difficult off-Earth environments.</p>
            <p>The long-term objective is substantially larger: enabling the infrastructure and resource systems required for humanity to expand beyond Earth.</p>
            <p>The visual ambition of this organization can be ahead of the current technology. The written claims cannot.</p>
          </div>
        </div>
      </div>
      <Footer go={go} />
    </div>
  )
}

// ─── Contact Page ─────────────────────────────────────────────────────────────

function ContactPage({ go }: { go: (p: Page) => void }) {
  const [form, setForm] = useState({ name: '', email: '', reason: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg('')

    // Client-side rate limit
    const lastSent = localStorage.getItem(RATE_LIMIT_KEY)
    if (lastSent && Date.now() - parseInt(lastSent) < RATE_LIMIT_MS) {
      setErrorMsg('You have already submitted recently. Please wait 30 minutes before trying again.')
      setStatus('error')
      return
    }

    setStatus('loading')

    const { error } = await supabase.from('contact_submissions').insert({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      reason: form.reason,
      message: form.message.trim(),
    })

    if (error) {
      setErrorMsg('Something went wrong. Please try emailing us directly at hojim2416@gmail.com')
      setStatus('error')
    } else {
      localStorage.setItem(RATE_LIMIT_KEY, Date.now().toString())
      // Fire email notification — non-blocking, failure doesn't affect the user
      emailjs.send('service_ki2u6if', 'template_5vwsu3m', {
        from_name: form.name.trim(),
        from_email: form.email.trim(),
        reason: form.reason,
        message: form.message.trim(),
      }).catch(() => {/* silent — data is already saved in Supabase */})
      setStatus('success')
    }
  }

  return (
    <div className="pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="py-24 border-b border-[#1a1a20]">
          <p className="font-mono text-[9px] tracking-[0.35em] text-[#b8a898]/50 mb-7">CONTACT</p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#e8e4dd] mb-4">Interested in the work?</h1>
          <p className="text-[#555] max-w-md leading-relaxed">We're early and thinking through hard questions. If you're thinking about similar problems, we'd like to hear from you.</p>
        </div>

        <div className="py-20 grid md:grid-cols-2 gap-20">
          <div className="space-y-10">
            {[
              { label: 'EMAIL', content: <a href="mailto:hojim2416@gmail.com" className="font-serif text-2xl text-[#e8e4dd] hover:text-[#b8a898] transition-colors">hojim2416@gmail.com</a> },
              { label: 'LINKEDIN', content: <a href="https://www.linkedin.com/in/yashasvi-pathak-991794437/" target="_blank" rel="noopener noreferrer" className="font-serif text-2xl text-[#e8e4dd] hover:text-[#b8a898] transition-colors">Yashasvi Pathak →</a> },
              { label: 'GITHUB', content: <p className="font-serif text-2xl text-[#252530]">Coming soon</p> },
            ].map(item => (
              <div key={item.label}>
                <p className="font-mono text-[8px] tracking-widest text-[#333] mb-3">{item.label}</p>
                {item.content}
                <div className="h-px bg-[#1a1a20] mt-8" />
              </div>
            ))}
          </div>

          {status === 'success' ? (
            <div className="border border-[#1a1a20] flex flex-col items-center justify-center text-center p-16">
              <p className="font-serif text-2xl text-[#e8e4dd] mb-3">Message received.</p>
              <p className="text-[#444] text-sm">We'll be in touch.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <p className="font-mono text-[8px] tracking-widest text-[#333] mb-8">SEND A MESSAGE</p>

              <div>
                <label className="font-mono text-[8px] tracking-wider text-[#444] block mb-2">NAME</label>
                <input
                  type="text"
                  placeholder="Your name"
                  required
                  value={form.name}
                  onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
                  className="w-full bg-transparent border border-[#1e1e24] px-4 py-3 text-[#e8e4dd] text-sm focus:outline-none focus:border-[#b8a898]/35 transition-colors placeholder:text-[#252530]"
                />
              </div>

              <div>
                <label className="font-mono text-[8px] tracking-wider text-[#444] block mb-2">EMAIL</label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={form.email}
                  onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
                  className="w-full bg-transparent border border-[#1e1e24] px-4 py-3 text-[#e8e4dd] text-sm focus:outline-none focus:border-[#b8a898]/35 transition-colors placeholder:text-[#252530]"
                />
              </div>

              <div>
                <label className="font-mono text-[8px] tracking-wider text-[#444] block mb-2">REASON FOR CONTACTING</label>
                <select
                  required
                  value={form.reason}
                  onChange={e => setForm(s => ({ ...s, reason: e.target.value }))}
                  className="w-full bg-[#07070a] border border-[#1e1e24] px-4 py-3 text-sm focus:outline-none focus:border-[#b8a898]/35 transition-colors appearance-none cursor-pointer"
                  style={{ color: form.reason ? '#e8e4dd' : '#252530' }}
                >
                  <option value="" disabled style={{ color: '#252530' }}>Select a reason</option>
                  {REASONS.map(r => (
                    <option key={r} value={r} style={{ color: '#e8e4dd', background: '#07070a' }}>{r}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[8px] tracking-wider text-[#444] block mb-2">MESSAGE</label>
                <textarea
                  rows={5}
                  placeholder="What's on your mind?"
                  required
                  value={form.message}
                  onChange={e => setForm(s => ({ ...s, message: e.target.value }))}
                  className="w-full bg-transparent border border-[#1e1e24] px-4 py-3 text-[#e8e4dd] text-sm focus:outline-none focus:border-[#b8a898]/35 transition-colors resize-none placeholder:text-[#252530]"
                />
              </div>

              {status === 'error' && (
                <p className="font-mono text-[9px] tracking-wide text-[#b87878] border border-[#b87878]/20 px-4 py-3">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-3.5 bg-[#e8e4dd] text-[#07070a] font-mono text-[10px] tracking-widest hover:bg-[#b8a898] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? 'SENDING…' : 'SEND MESSAGE'}
              </button>
            </form>
          )}
        </div>
      </div>
      <Footer go={go} />
    </div>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [fading, setFading] = useState(false)

  const go = (next: Page) => {
    if (next === page) return
    setFading(true)
    setTimeout(() => {
      setPage(next)
      setFading(false)
      window.scrollTo({ top: 0 })
    }, 180)
  }

  return (
    <div className="bg-[#07070a] min-h-screen text-[#e8e4dd]">
      <Nav current={page} go={go} />
      <main className={`transition-opacity duration-200 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        {page === 'home'     && <HomePage go={go} />}
        {page === 'problem'  && <ProblemPage go={go} />}
        {page === 'helix'    && <HelixPage go={go} />}
        {page === 'research' && <ResearchPage go={go} />}
        {page === 'progress' && <ProgressPage go={go} />}
        {page === 'vision'   && <VisionPage go={go} />}
        {page === 'about'    && <AboutPage go={go} />}
        {page === 'contact'  && <ContactPage go={go} />}
      </main>
    </div>
  )
}
