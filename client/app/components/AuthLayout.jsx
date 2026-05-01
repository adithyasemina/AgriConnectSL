'use client';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0A0A0A] text-white antialiased">
      <style>{`
        @keyframes ac-float-slow {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-30px) translateX(15px) rotate(8deg); }
        }
        @keyframes ac-float-med {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(-10px) rotate(-6deg); }
        }
        @keyframes ac-drift {
          0% { transform: translate(0, 0) scale(1); opacity: 0.25; }
          50% { transform: translate(40px, -30px) scale(1.1); opacity: 0.4; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.25; }
        }
        @keyframes ac-drift-rev {
          0% { transform: translate(0, 0) scale(1); opacity: 0.2; }
          50% { transform: translate(-50px, 40px) scale(1.15); opacity: 0.35; }
          100% { transform: translate(0, 0) scale(1); opacity: 0.2; }
        }
        @keyframes ac-grid-pan {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }
        @keyframes ac-fade-up {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .ac-leaf-1 { animation: ac-float-slow 14s ease-in-out infinite; }
        .ac-leaf-2 { animation: ac-float-med 10s ease-in-out infinite; }
        .ac-leaf-3 { animation: ac-float-slow 18s ease-in-out infinite reverse; }
        .ac-leaf-4 { animation: ac-float-med 12s ease-in-out infinite reverse; }
        .ac-orb-1 { animation: ac-drift 16s ease-in-out infinite; }
        .ac-orb-2 { animation: ac-drift-rev 20s ease-in-out infinite; }
        .ac-grid { animation: ac-grid-pan 30s linear infinite; }
        .ac-fade-up { animation: ac-fade-up 0.7s ease-out both; }
      `}</style>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="ac-grid absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,210,190,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,190,0.4) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="ac-orb-1 absolute -top-40 -left-32 h-[28rem] w-[28rem] rounded-full bg-[#00D2BE]/25 blur-[120px]" />
        <div className="ac-orb-2 absolute -bottom-40 -right-32 h-[32rem] w-[32rem] rounded-full bg-emerald-500/20 blur-[140px]" />
        <div className="absolute left-1/2 top-1/3 h-[20rem] w-[20rem] -translate-x-1/2 rounded-full bg-[#00D2BE]/10 blur-[100px]" />

        <FloatingLeaves />
      </div>

      <div className="relative z-10 flex h-screen flex-col overflow-hidden lg:flex-row">
        <aside className="relative hidden overflow-hidden p-8 lg:flex lg:w-1/2 xl:p-10">
          <LeftPanel />
        </aside>

        <section className="flex h-full w-full items-center justify-center overflow-y-auto px-4 py-6 sm:px-6 lg:w-1/2 lg:p-8">
          <div className="w-full max-w-md ac-fade-up">
            <div className="mb-6 flex items-center justify-center gap-2 lg:hidden">
              <BrandMark />
              <span className="text-lg font-bold tracking-tight">
                Agri<span className="text-[#00D2BE]">Connect</span>
              </span>
            </div>

            <div className="mb-5 text-center lg:text-left">
              <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl lg:text-4xl">
                {title}
              </h1>
              <p className="mt-2 text-sm text-gray-400 sm:text-base">
                {subtitle}
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-[#00D2BE]/20 via-transparent to-emerald-500/10 opacity-60 blur-xl" />
              <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-7">
                {children}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function BrandMark() {
  return (
    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#00D2BE] to-emerald-600 shadow-lg shadow-[#00D2BE]/30">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 4 13H2a9 9 0 0 0 9 9v-2zm0-16a7 7 0 0 1 7 7h2a9 9 0 0 0-9-9v2z" />
        <path d="M12 12a4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-4 4 4 4 0 0 0 4 4z" />
      </svg>
    </div>
  );
}

function LeftPanel() {
  return (
    <div className="relative mx-auto flex h-full w-full max-w-lg flex-col justify-center">
      <div className="mb-6 flex items-center gap-3">
        <span className="text-2xl font-bold tracking-tight">
          Agri<span className="text-[#00D2BE]">Connect</span>
        </span>
      </div>

      <div className="relative mx-auto mb-6 aspect-square w-full max-w-sm">
        <TerraceIllustration />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold leading-tight tracking-tight xl:text-3xl">
          The All in One Platform built for{' '}
          <span className="bg-gradient-to-r from-[#00D2BE] to-emerald-300 bg-clip-text text-transparent">
            Sri Lankan farmers
          </span>
        </h2>

        <p className="text-sm leading-relaxed text-gray-400 xl:text-base">
          Connect directly with buyers, fair prices, transparent trade.
          From paddy fields to tea estates — your harvest, your terms.
        </p>

        <div className="flex flex-wrap gap-x-6 gap-y-3 pt-1">
          <Stat value="12K+" label="Farmers" />
          <Stat value="₨2.4Cr" label="Traded" />
          <Stat value="9" label="Provinces" />
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xl font-bold text-[#00D2BE]">{value}</span>
      <span className="text-xs uppercase tracking-wider text-gray-500">{label}</span>
    </div>
  );
}

function TerraceIllustration() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full drop-shadow-[0_0_40px_rgba(0,210,190,0.15)]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ac-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00D2BE" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#00D2BE" stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id="ac-hill-1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00D2BE" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#00D2BE" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="ac-hill-2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient id="ac-hill-3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00D2BE" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0A0A0A" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="ac-sun" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#00D2BE" stopOpacity="1" />
          <stop offset="100%" stopColor="#00D2BE" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect x="0" y="0" width="400" height="280" fill="url(#ac-sky)" />
      <circle cx="280" cy="120" r="60" fill="url(#ac-sun)" />
      <circle cx="280" cy="120" r="22" fill="#00D2BE" opacity="0.9" />
      <circle cx="280" cy="120" r="22" fill="none" stroke="#00D2BE" strokeWidth="0.5" opacity="0.4">
        <animate attributeName="r" values="22;38;22" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="4s" repeatCount="indefinite" />
      </circle>

      <path d="M 0 220 Q 60 180 120 200 T 240 195 T 400 210 L 400 280 L 0 280 Z" fill="url(#ac-hill-1)" />
      <path d="M 0 250 Q 80 215 160 235 T 320 230 T 400 245 L 400 320 L 0 320 Z" fill="url(#ac-hill-2)" />

      <g opacity="0.85">
        <path d="M 0 285 Q 100 270 200 280 T 400 275" fill="none" stroke="#00D2BE" strokeWidth="1.5" opacity="0.7" />
        <path d="M 0 305 Q 100 288 200 300 T 400 295" fill="none" stroke="#00D2BE" strokeWidth="1.5" opacity="0.55" />
        <path d="M 0 325 Q 100 308 200 320 T 400 315" fill="none" stroke="#00D2BE" strokeWidth="1.5" opacity="0.4" />
        <path d="M 0 345 Q 100 328 200 340 T 400 335" fill="none" stroke="#00D2BE" strokeWidth="1.5" opacity="0.3" />
      </g>

      <path d="M 0 290 Q 100 250 200 275 Q 300 300 400 270 L 400 400 L 0 400 Z" fill="url(#ac-hill-3)" />

      <g transform="translate(180, 245)" opacity="0.95">
        <ellipse cx="0" cy="-2" rx="11" ry="3" fill="#00D2BE" />
        <path d="M -6 -4 Q 0 -10 6 -4 Z" fill="#00D2BE" />
        <path d="M -4 0 L -5 18 L 5 18 L 4 0 Z" fill="#00D2BE" opacity="0.95" />
        <line x1="-2" y1="18" x2="-3" y2="28" stroke="#00D2BE" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="2" y1="18" x2="3" y2="28" stroke="#00D2BE" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="-8" y1="-2" x2="-14" y2="20" stroke="#00D2BE" strokeWidth="1.5" strokeLinecap="round" />
      </g>

      <g transform="translate(40, 60)" opacity="0.7">
        <path d="M 0 0 Q 15 -10 30 -5 Q 25 5 10 8 Z" fill="#00D2BE" opacity="0.6" />
        <path d="M 30 -5 Q 50 -20 70 -10 Q 60 0 40 3" fill="none" stroke="#00D2BE" strokeWidth="1.5" opacity="0.5" />
        <circle cx="35" cy="-8" r="2" fill="#00D2BE" />
        <circle cx="55" cy="-12" r="2" fill="#00D2BE" />
      </g>

      <g transform="translate(330, 320)" opacity="0.6">
        <path d="M 0 0 Q -15 -10 -30 -5 Q -25 5 -10 8 Z" fill="#00D2BE" opacity="0.6" />
      </g>

      <circle cx="80" cy="100" r="1.5" fill="#00D2BE">
        <animate attributeName="cy" values="100;90;100" dur="3s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="340" cy="180" r="1.5" fill="#00D2BE">
        <animate attributeName="cy" values="180;170;180" dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;1;0.3" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="200" cy="160" r="1" fill="#00D2BE">
        <animate attributeName="cy" values="160;150;160" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;1;0.4" dur="3.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

function Leaf({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2 C 7 4, 4 8, 4 14 C 4 18, 7 22, 12 22 C 12 22, 11 16, 12 12 C 13 8, 16 5, 20 4 C 18 3, 15 2, 12 2 Z"
        fill="#00D2BE"
        opacity="0.5"
      />
      <path d="M 12 22 C 12 18, 13 14, 16 10" stroke="#00D2BE" strokeWidth="0.5" opacity="0.6" />
    </svg>
  );
}

function FloatingLeaves() {
  return (
    <>
      <div className="ac-leaf-1 absolute top-[12%] left-[8%] hidden md:block">
        <Leaf size={32} />
      </div>
      <div className="ac-leaf-2 absolute top-[28%] right-[12%] hidden md:block">
        <Leaf size={20} />
      </div>
      <div className="ac-leaf-3 absolute bottom-[18%] left-[14%] hidden lg:block">
        <Leaf size={26} />
      </div>
      <div className="ac-leaf-4 absolute bottom-[35%] right-[8%] hidden md:block">
        <Leaf size={22} />
      </div>
      <div className="ac-leaf-1 absolute top-[60%] left-[40%] hidden xl:block opacity-70">
        <Leaf size={18} />
      </div>
    </>
  );
}