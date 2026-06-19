import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Sparkles, Flame, CheckCircle2, User, 
  MapPin, HelpCircle, BadgeInfo, Zap, TrendingUp, AlertCircle, ShoppingBag, Terminal
} from "lucide-react";
import { LogoIcon } from "./LogoIcon";

// 1. HERO COMPONENT
export function Hero({ onStartScan }: { onStartScan: () => void }) {
  const [protectedCount, setProtectedCount] = useState(1247);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProtectedCount((prev) => prev + Math.floor(Math.random() * 2) + 1);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="overview" className="relative min-h-[92vh] flex flex-col justify-center items-center py-20 px-4 grid-bg-pattern bg-brand-dark overflow-hidden">
      {/* Blue Ambient Glow in background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-blue/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-brand-green/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
        
        {/* Pre-headline tag */}
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-brand-green text-xs font-mono tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-brand-green animate-pulse" />
          AI-POWERED PRE-PUBLICATION FORENSICS
        </div>

        {/* Large Typography Accent Headings */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-space font-extrabold text-white leading-tight tracking-tight">
          DON'T LET ONE LISTING <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-red-500 via-amber-400 to-brand-green bg-clip-text text-transparent">
            COST YOU YOUR STORE.
          </span>
        </h1>

        <p className="max-w-3xl mx-auto text-base sm:text-xl text-gray-300 font-sans leading-relaxed">
          MUMY scans your product image, title, tags, and description in <span className="text-white font-extrabold underline decoration-brand-green">8 seconds</span> — and tells you exactly what to fix before Etsy or Redbubble crawlers suspend your account.
        </p>

        {/* ACCOUNT SUSPENDED MOCKUP / LOSS AVERSION MOTIVATOR */}
        <div className="max-w-lg mx-auto bg-[#180a0a] border border-red-900/40 p-5 rounded-2xl flex items-start gap-4 text-left shadow-2xl animate-pulse">
          <div className="p-3 bg-red-950/60 rounded-xl border border-red-500/20 text-red-500 shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/10 text-red-400 border border-[#b91c1c]/20 mb-2 font-bold tracking-wider">
              ⚠ ACCOUNT SUSPENDED
            </div>
            <h4 className="font-space font-extrabold text-white text-base">Your Etsy store has been deactivated</h4>
            <p className="text-xs text-red-100/70 font-sans leading-relaxed mt-1">
              "We determined that your account has uploaded intellectual property violations relating to Pokemon characters without a licensed merchant agreement. This suspension is permanent."
            </p>
          </div>
        </div>

        {/* CALL TO ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={onStartScan}
            className="w-full sm:w-auto bg-[#2323ff] hover:bg-blue-700 text-white font-space font-extrabold px-8 py-4 rounded-2xl text-lg shadow-lg hover:shadow-[#2323ff]/20 transition-all transform hover:-translate-y-0.5 cursor-pointer glow-hover"
          >
            Scan My First Listing Free →
          </button>
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 font-space font-medium px-8 py-4 rounded-2xl text-lg transition-colors cursor-pointer inline-flex items-center justify-center gap-2 focus:outline-none"
          >
            Watch Video →
          </button>
        </div>

        {/* Social Proof metrics */}
        <div className="pt-8 border-t border-white/5 flex flex-wrap justify-center items-center gap-y-4 gap-x-8 text-gray-400 text-xs sm:text-sm font-mono">
          <div>Trusted by <span className="text-white font-bold">12,024+ sellers</span></div>
          <span className="hidden sm:inline text-white/10">•</span>
          <div><span className="text-brand-green font-bold">98.7%</span> detection accuracy</div>
          <span className="hidden sm:inline text-white/10">•</span>
          <div><span className="text-white font-bold">&lt; 8s</span> scan time</div>
        </div>

        {/* Listings protected counter */}
        <div className="font-sans text-xs text-brand-green bg-brand-green/5 border border-brand-green/20 px-4 py-1.5 rounded-full inline-block font-bold">
          Listings checked today: <span className="font-mono text-white text-sm ml-1 font-black">{protectedCount}</span>
        </div>

      </div>

      {/* Video Modal Popup with Closing Cross */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsVideoModalOpen(false)} />
          <div className="relative w-full max-w-4xl bg-[#090909] border border-white/10 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in duration-250">
            {/* Header / Close button */}
            <div className="flex items-center justify-between p-4 border-b border-white/5 bg-[#0e0e0e]">
              <div className="flex items-center gap-2">
                <LogoIcon className="w-6 h-6" />
                <span className="text-xs font-mono font-bold text-gray-300">MUMY COMPLIANCE WALKTHROUGH</span>
              </div>
              <button 
                onClick={() => setIsVideoModalOpen(false)}
                className="p-1.5 px-3 rounded-lg bg-white/5 hover:bg-red-500/15 text-gray-400 hover:text-red-500 transition-all font-sans text-xs font-bold flex items-center gap-1 cursor-pointer focus:outline-none"
              >
                Close ✕
              </button>
            </div>
            {/* 16:9 Video Aspect Ratio Wrapper */}
            <div className="relative pt-[56.25%] w-full bg-black">
              <iframe 
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/UwGwrg8a-1A?autoplay=1"
                title="MUMY Compliance Scan Walkthrough Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* FOMO TICKER */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden bg-white/5 border-y border-white/10 py-3 relative z-10 mt-12">
        <div className="flex whitespace-nowrap gap-12 font-mono text-[11px] uppercase tracking-wide text-gray-350 animate-scroll">
          <span className="inline-flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-brand-green" /> A seller avoided ban on Etsy by removing secret Pikachu print layers (3.2s)
          </span>
          <span className="text-white/20">|</span>
          <span className="inline-flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" /> Banned words detected: 'Just Buy It' (Nike trademark proxy block)
          </span>
          <span className="text-white/20">|</span>
          <span className="inline-flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-brand-green" /> Trademark identified & fixed: 'Disney Castle font style guide matches'
          </span>
          <span className="text-white/20">|</span>
          <span className="inline-flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-brand-green" /> Obfuscated blurred overlays unpacked and exposed on anime vector
          </span>
        </div>
      </div>
    </section>
  );
}

// 2. FEATURED ON STRIP
export function FeaturedOnSection() {
  return (
    <section className="py-10 bg-brand-dark border-b border-white/5 relative z-10">
      <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-6">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-600">
          As featured on
        </p>
        <div className="flex flex-wrap items-center justify-center gap-10">
          <img
            src="/logo-indiehackers.webp"
            alt="Indie Hackers"
            className="h-7 opacity-50 hover:opacity-90 transition-opacity duration-300 object-contain"
            draggable={false}
          />
          <img
            src="/logo-wefunders.webp"
            alt="Wefunder"
            className="h-7 opacity-50 hover:opacity-90 transition-opacity duration-300 object-contain"
            draggable={false}
          />
        </div>
      </div>
    </section>
  );
}

// 3. FEAR SECTION COMPONENT
export function FearSection() {
  return (
    <section className="py-24 bg-brand-dark/90 text-white border-y border-white/5 relative z-10">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-red-500 text-xs font-mono font-bold uppercase tracking-widest bg-red-950/30 border border-red-900/50 px-3 py-1 rounded-full">
            <Flame className="w-3.5 h-3.5 text-red-500 shrink-0" />
            THE REAL MEDIATED DANGER
          </div>
          <h2 className="text-3xl md:text-5xl font-space font-extrabold text-white">
            One mistake. Your entire income — gone.
          </h2>
          <p className="text-gray-400">
            E-commerce platforms utilize state-of-the-art automated AI sweepers. They don't give warning signs. They delete listings first, suspend catalogs second, and ban registration identities permanently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Col 1 */}
          <div className="p-8 bg-[#0e0e0e] border border-white/5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-red-500/20 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-950/55 border border-red-500/20 flex items-center justify-center text-red-500">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-space font-bold text-white">Account Deactivation</h3>
              <p className="text-sm text-gray-450 leading-relaxed font-sans">
                The average seller loses <span className="text-red-400 font-extrabold font-mono">$4,210/month</span> in active sales during a suspension appeal process.
              </p>
            </div>
            {/* Mock screenshot */}
            <div className="bg-[#1c0f0f] border border-red-800/25 p-3.5 rounded-lg text-[10px] font-mono space-y-1.5 mt-2">
              <div className="text-red-400 font-bold">SYSTEM RED BANNER:</div>
              <p className="text-white/70">"Warning: Shop suspension active due to repeating DMCA notices. Direct deposits are locked."</p>
            </div>
          </div>

          {/* Col 2 */}
          <div className="p-8 bg-[#0e0e0e] border border-white/5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-red-500/20 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-950/55 border border-red-500/20 flex items-center justify-center text-red-500">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-space font-bold text-white">All Listings Deleted</h3>
              <p className="text-sm text-gray-450 leading-relaxed font-sans">
                Years of SEO backlinks, organic search keywords, review history, and sales rankings wiped clean in a millisecond.
              </p>
            </div>
            {/* Mock screenshot */}
            <div className="bg-[#1c0f0f] border border-red-800/25 p-3.5 rounded-lg text-[10px] font-mono space-y-1.5 mt-2">
              <div className="text-red-400 font-bold">REDBUBBLE INDEX NOTIFICATION:</div>
              <p className="text-white/70">"Listing 'Cute Green Plumber Retro Cart' deleted under legal copyright representations."</p>
            </div>
          </div>

          {/* Col 3 */}
          <div className="p-8 bg-[#0e0e0e] border border-white/5 rounded-2xl space-y-4 flex flex-col justify-between hover:border-red-500/20 transition-all">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-red-950/55 border border-red-500/20 flex items-center justify-center text-red-500">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-space font-bold text-white">Identity Blacklist</h3>
              <p className="text-sm text-gray-450 leading-relaxed font-sans">
                Once flagged, your bank account details, routing codes, SSN, and IP address are globally blacklisted across all top markets.
              </p>
            </div>
            {/* Mock screenshot */}
            <div className="bg-[#1c0f0f] border border-red-800/25 p-3.5 rounded-lg text-[10px] font-mono space-y-1.5 mt-2">
              <div className="text-red-400 font-bold">AMAZON MERCH REGISTER:</div>
              <p className="text-white/70">"Registration declined. Associated taxpayer credentials have been locked as fraudulent."</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

// 3. HOW IT WORKS COMPONENT
export function HowItWorks() {
  const steps = [
    { num: "01", title: "Upload your product", desc: "Drag and drop your thumbnail image. Fill in listing titles, search tags, or description values." },
    { num: "02", title: "8-second parallel scan", desc: "Our 5 parallel IP forensics agents evaluate designs, keywords, and hidden overlay layers simultaneously." },
    { num: "03", title: "Apply your clear fixes", desc: "Obtain an exact action list (specific pixels, fonts, or tags to adjust) and publish to your store 100% risk-free." }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-brand-dark relative z-10 text-white">
      <div className="max-w-5xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-5xl font-space font-extrabold">
            Pristine 3-Step Verification Flow
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-sans">
            MUMY integrates pre-publication testing as a natural, lightning-fast extension of your content uploading cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((s, idx) => (
            <div key={idx} className="bg-[#111111] p-8 rounded-2xl space-y-4 border border-white/5 relative z-10">
              <div className="font-space font-black text-4xl text-brand-green leading-none">
                {s.num}
              </div>
              <h3 className="text-lg font-space font-bold text-white">
                {s.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}

// 4. AGENT EXPLAINER COMPONENT
export function AgentExplainer() {
  const agents = [
    { title: "Advanced Vision Scan Engine", desc: "Deep neural network analysis of visual features, color distributions, shapes, and graphical boundaries.", boost: "94.8% Match Boost" },
    { title: "Global Public Catalog Matcher", desc: "Queries massive public registers, performing automated reference cross-matching against online listings.", boost: "Index Overlap Search" },
    { title: "Grayscale Variance & Blur Analysis", desc: "Detects suspicious tampering zones where graphics have been processed or blurred to hide copyright items.", boost: "Grayscale Variance Check" },
    { title: "Fuzzy Keyword Spelling Decoder", desc: "Identifies synonym substitutions, misspelled brand mockings, and phonetic trademark proxy triggers.", boost: "NLP Phonetic Parser" },
    { title: "Risk Verdict Synthesis Fuser", desc: "Fuses all parallel signals dynamically to form a unified risk score with zero false positives.", boost: "Weighted Core Formula" }
  ];

  return (
    <section id="safety-stack" className="py-24 bg-brand-dark border-t border-white/5 text-white relative z-10 w-full shrink-0">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-brand-green text-xs font-mono font-bold uppercase tracking-widest bg-brand-green/5 border border-brand-green/20 px-3 py-1 rounded-full">
            <Terminal className="w-3.5 h-3.5 shrink-0" />
            5 PARALLEL SCANNER AGENTS
          </div>
          <h2 className="text-3xl md:text-5xl font-space font-extrabold">
            Pre-Publication Safety Stack
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            MUMY doesn't just call one generator. We execute five specialized defensive security processors in parallel to guarantee zero-trust compliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((a, i) => (
            <div 
              key={i} 
              className={`p-6 bg-[#0e0e0e] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-brand-blue/30 transition-all ${
                i === 4 ? "lg:col-span-2 md:col-span-2 lg:flex-row lg:items-center lg:gap-8 bg-gradient-to-r from-brand-dark to-brand-blue/10 border-brand-blue/20" : ""
              }`}
            >
              <div className="space-y-3">
                <span className="font-mono text-brand-green text-xs font-bold uppercase block tracking-wider">
                  LAYER 0{i+1} ACTIVE
                </span>
                <h3 className="text-xl font-space font-bold text-white">
                  {a.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-400 font-sans leading-relaxed max-w-xl">
                  {a.desc}
                </p>
              </div>

              <div className="mt-4 lg:mt-0 font-mono text-[10px] font-bold text-[#2cff05] bg-brand-green/10 border border-brand-green/30 px-3 py-1 rounded self-start shrink-0">
                {a.boost}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// 5. SOCIAL PROOF COMPONENT
export function SocialProof() {
  const testimonials = [
    { name: "Sarah K.", role: "Etsy Elite Creator, 1,240 Sales", text: "I almost listed a cute pocket lightning tail yellow shirt without knowing Nintendo legal triggers. MUMY identified Pikachu copyrighted vectors instantly. Literally saved my account." },
    { name: "Marcus T.", role: "Redbubble & POD Artist", text: "My initial Redbubble store was suspended for Disney trademark words in tags. I use MUMY now on every upload. It's an absolute workflows requirement." },
    { name: "Priya M.", role: "Amazon Merch Full-Timer", text: "The Laplacian blurring analysis is insane. It flag a fading commercial swoosh logo on a client vintage background that even I didn't see. Spectacular accuracy." },
    { name: "James R.", role: "Society6 Featured Illustrator", text: "MUMY is part of our standard team catalog uploading pipelines. 8-second execution makes scaling designs secure and reliable." }
  ];

  return (
    <section className="py-24 bg-brand-dark relative z-10 text-white border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* Stat blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center">
          <div className="p-8 bg-[#111111] border border-white/5 rounded-2xl">
            <div className="font-space font-extrabold text-white text-4xl md:text-5xl tracking-tight mb-2">12,000+</div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Active sellers protected</p>
          </div>
          <div className="p-8 bg-[#111111] border border-white/5 rounded-2xl">
            <div className="font-space font-extrabold text-white text-4xl md:text-5xl tracking-tight mb-2">540,000+</div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Store listings analyzed</p>
          </div>
          <div className="p-8 bg-[#111111] border border-white/5 rounded-2xl">
            <div className="font-space font-extrabold text-brand-green text-4xl md:text-5xl tracking-tight mb-2">98.7%</div>
            <p className="text-xs font-mono text-gray-400 uppercase tracking-widest">Audit block accuracy</p>
          </div>
        </div>

        {/* Brand logos row "Compatible platforms" to trigger AUTHORITY */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-xs font-mono text-gray-400 uppercase tracking-widest font-bold">
            Compatible pre-publication scans for major platforms
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 text-white text-xl font-space font-black opacity-30 select-none">
            <span>ETSY</span>
            <span>REDBUBBLE</span>
            <span>AMAZON MERCH</span>
            <span>TEEPUBLIC</span>
            <span>SOCIETY6</span>
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="p-8 bg-[#0b0b0b] border border-white/5 rounded-2xl space-y-4 hover:border-brand-blue/30 transition-all">
              <p className="text-sm md:text-base text-gray-300 italic font-sans leading-relaxed">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-blue/20 rounded-full flex items-center justify-center font-bold text-[#2323ff]">
                  {t.name[0]}
                </div>
                <div>
                  <h4 className="font-space font-bold text-white text-sm">
                    {t.name}
                  </h4>
                  <p className="text-xs text-brand-green font-mono">
                    {t.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

// 6. PRICING SECTION COMPONENT
export function PricingSection({ onSelectPlan }: { onSelectPlan: (plan: string, cycle: "monthly" | "yearly") => void }) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <section id="pricing" className="py-24 bg-brand-dark/95 text-white border-t border-white/10 relative z-10 w-full shrink-0">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-brand-green text-xs font-mono font-bold uppercase tracking-widest bg-brand-green/5 border border-brand-green/20 px-3 py-1 rounded-full">
            <Zap className="w-3.5 h-3.5 text-brand-green shrink-0" />
            SECURE YOUR STORE TODAY
          </div>
          <h2 className="text-3xl md:text-5xl font-space font-extrabold">
            Plans That Pay For Themselves
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            Protect your listings, rankings, and stores from catastrophic automated suspensions. Cancel anytime.
          </p>
        </div>

        {/* Dynamic Billing Toggle Switch */}
        <div className="flex items-center justify-center gap-4 mb-16">
          <span className={`text-xs sm:text-sm font-space font-bold transition-all duration-200 ${billingCycle === "monthly" ? "text-brand-green" : "text-gray-450"}`}>
            Billed Monthly
          </span>
          <button 
            type="button"
            onClick={() => setBillingCycle(prev => prev === "monthly" ? "yearly" : "monthly")}
            className="w-14 h-8 bg-white/5 border border-white/10 rounded-full p-1 transition-all duration-300 relative focus:outline-none focus:ring-1 focus:ring-brand-blue"
          >
            <div className={`w-5.5 h-5.5 bg-[#2323ff] rounded-full transition-all duration-300 ${billingCycle === "yearly" ? "translate-x-6 bg-brand-green" : ""}`} />
          </button>
          <span className={`text-xs sm:text-sm font-space font-bold transition-all duration-200 ${billingCycle === "yearly" ? "text-brand-green" : "text-gray-450"}`}>
            Billed Annually <span className="text-[9px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded border border-brand-green/25 font-bold uppercase font-mono ml-1">Save 20%</span>
          </span>
        </div>

        {/* Anchor pricing: Agency listed first, Pro highlighted, Free last */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          
          {/* FREE TIER */}
          <div className="p-8 bg-[#111111] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block">INDIVIDUAL SCANNER</span>
                <h3 className="text-2xl font-space font-bold text-white mt-1">BASIC FREE</h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5">Explore compliance checks.</p>
              </div>

              <div className="space-y-1">
                <div className="text-4xl font-space font-extrabold text-white">$0</div>
                <div className="text-[10px] font-mono text-gray-450 uppercase tracking-widest">No credit card required</div>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-3 font-sans text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" /> 3 pre-publication scans/month
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" /> Basic brand word matches
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" /> Standard OCR scanning
                </div>
                <div className="flex items-center gap-2 opacity-35">
                  ✕ Full multimodal visual agent
                </div>
                <div className="flex items-center gap-2 opacity-35">
                  ✕ Custom frequency forensics logs
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPlan("free", billingCycle)}
              className="mt-8 w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-space font-bold py-3.5 rounded-xl text-center self-end cursor-pointer"
            >
              Get Started Free →
            </button>
          </div>

          {/* MOST POPULAR: PRO TIER */}
          <div className="p-8 bg-[#121226] border-2 border-[#2323ff] rounded-3xl flex flex-col justify-between hover:scale-[1.02] transition-all relative z-10 shadow-2xl">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-[#2cff05] text-gray-900 font-mono text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              ★ MOST POPULAR
            </div>
            
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono text-brand-green uppercase tracking-wider block">PROFESSIONAL</span>
                <h3 className="text-2xl font-space font-bold text-white mt-1">MUMY PRO</h3>
                <p className="text-xs text-brand-green font-sans mt-0.5">Complete account protection.</p>
              </div>

              <div className="space-y-1">
                <div className="text-4xl font-space font-extrabold text-white">
                  {billingCycle === "yearly" ? "$15" : "$19"}
                  <span className="text-sm font-medium text-gray-450">/mo</span>
                </div>
                <div className="text-[10px] font-mono text-brand-green uppercase tracking-widest leading-relaxed">
                  {billingCycle === "yearly" ? "$180 billed Annually (Save $48)" : "Instant Portal Activation"}
                </div>
              </div>

              <div className="border-t border-[#2323ff]/30 pt-6 space-y-3 font-sans text-xs text-gray-100">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2cff05]" /> <span className="font-extrabold text-white">100 scans / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2cff05]" /> Full 5-agent parallel suite
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2cff05]" /> Pixel obfustication forensics
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2cff05]" /> Scan history & dashboard access
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2cff05]" /> Priority high speed queues
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPlan("pro", billingCycle)}
              className="mt-8 w-full bg-[#2323ff] hover:bg-blue-700 text-white hover:text-white font-space font-bold py-3.5 rounded-xl text-center self-end shadow-md cursor-pointer glow-hover"
            >
              Protect My Catalog Now →
            </button>
          </div>

          {/* AGENCY TIER */}
          <div className="p-8 bg-[#111111] border border-white/5 rounded-2xl flex flex-col justify-between hover:border-white/10 transition-all">
            <div className="space-y-6">
              <div>
                <span className="text-xs font-mono text-gray-400 uppercase tracking-wider block">HIGH-VOLUME TEAM ARCHITECTURE</span>
                <h3 className="text-2xl font-space font-bold text-white mt-1">MUMY AGENCY</h3>
                <p className="text-xs text-gray-400 font-sans mt-0.5">Automate bulk listings.</p>
              </div>

              <div className="space-y-1">
                <div className="text-4xl font-space font-extrabold text-white">
                  {billingCycle === "yearly" ? "$63" : "$79"}
                  <span className="text-sm font-medium text-gray-450">/mo</span>
                </div>
                <div className="text-[10px] font-mono text-gray-450 uppercase tracking-widest leading-relaxed">
                  {billingCycle === "yearly" ? "$756 billed Annually (Save $192)" : "For massive shops & agencies"}
                </div>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-3 font-sans text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" /> <span className="font-extrabold text-white">2,500 scans / month</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" /> Team member seats (up to 5)
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" /> Bulk exports and history search
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" /> API access token keys
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" /> Dedicated priority support agent
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectPlan("agency", billingCycle)}
              className="mt-8 w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 font-space font-bold py-3.5 rounded-xl text-center self-end cursor-pointer"
            >
              Get Agency License →
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

// 7. FOOTER COMPONENT
export function Footer({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <footer className="py-16 bg-brand-dark/95 text-[#a3a3a3] border-t border-white/5 relative z-10 text-sm">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        <div className="space-y-4">
          <LogoIcon className="w-20 h-12" />
          <p className="text-xs text-gray-400 leading-relaxed font-sans">
            MUMY IP Guard is dedicated to protecting modern e-commerce creators from devastating brand copyright and trademark suspensions before they publish.
          </p>
          <div className="text-[10px] text-gray-500 font-mono">
            © {new Date().getFullYear()} MUMY. All rights reserved.
          </div>
        </div>

        <div>
          <h4 className="text-white font-space font-bold text-xs uppercase tracking-wider mb-4">Marketplaces We Support</h4>
          <ul className="space-y-2 text-xs font-sans">
            <li>Etsy Shop Compliance</li>
            <li>Redbubble Copyright Sweeps</li>
            <li>Amazon Merch Trademark Defense</li>
            <li>Teepublic Artist Portfolios</li>
            <li>Society6 Visual Inspection</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-space font-bold text-xs uppercase tracking-wider mb-4">Compliance Resources</h4>
          <ul className="space-y-2 text-xs font-sans">
            <li>FFT Zone Blur Analysis Guides</li>
            <li>How DMCA Automated Bots Work</li>
            <li>Common Synonym Flag Trigger words</li>
            <li>Avoiding Trademark Infringements</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-white font-space font-bold text-xs uppercase tracking-wider">Legal Agreements</h4>
          <ul className="space-y-2.5 text-xs text-brand-green font-mono">
            <li>
              <button onClick={() => onNavigate("privacy")} className="hover:underline text-left cursor-pointer">
                Privacy Policy (GDPR / CCPA)
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate("terms")} className="hover:underline text-left cursor-pointer">
                Terms of Service (Secure & Verified)
              </button>
            </li>
          </ul>
          <div className="flex items-center gap-1.5 text-[10px] bg-white/5 border border-white/10 p-2.5 rounded text-gray-400">
            <BadgeInfo className="w-5 h-5 text-brand-green shrink-0 animate-pulse" />
            <span>Secure billing powered by standard end-to-end encrypted billing protocols.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

// 8. COMPATIBLE MARKETPLACES SECTION
export function MarketplacesSection() {
  const marketplaces = [
    { name: "Etsy", type: "Active integration", badge: "High Risk", desc: "Monitors tag keyword bypasses and custom graphics." },
    { name: "Amazon Merch", type: "Visual alignment", badge: "Critical", desc: "Blocks automated Merch on Demand suspension strings." },
    { name: "Redbubble", type: "Spelling triggers", badge: "Dynamic", desc: "Analyzes fuzzy title synonym evasions instantly." },
    { name: "Teepublic", type: "Artwork protection", badge: "Auto-scan", desc: "Extracts layered elements and prints safety checks." },
    { name: "Society6", type: "Portfolio audit", badge: "On-demand", desc: "Reviews complex illustrator motifs for copyrights." },
    { name: "Zazzle", type: "Template check", badge: "Custom", desc: "Audits editable typography schemas they check." },
    { name: "Spring", type: "Storefront defense", badge: "Rapid", desc: "Integrates directly with campaign description words." },
    { name: "Spreadshirt", type: "Universal coverage", badge: "Batch", desc: "Scans active text prompts & design uploads." },
    { name: "CafePress", type: "Retrofit checks", badge: "Instant", desc: "Handles historical designs with catalog matching." },
    { name: "Printify", type: "Provider check", badge: "API Shield", desc: "Guarantees fulfillment safe status on listing." },
    { name: "Printful", type: "Asset verification", badge: "Secure", desc: "Ensures custom embroidered shapes are safe." },
    { name: "eBay", type: "Direct store audit", badge: "2-way", desc: "Monitors commercial trademarks in description body." },
    { name: "Shopify", type: "Store safety", badge: "Enterprise", desc: "Keeps custom digital designs free from DMCA letters." },
    { name: "WooCommerce", type: "Private secure", badge: "Self-host", desc: "Checks database catalog before public release." }
  ];

  return (
    <section id="marketplaces" className="py-24 bg-brand-dark text-white border-t border-white/5 relative z-10 w-full shrink-0">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 text-[#2cff05] text-xs font-mono font-bold uppercase tracking-widest bg-brand-green/5 border border-brand-green/20 px-3 py-1 rounded-full">
            <ShoppingBag className="w-3.5 h-3.5 text-brand-green shrink-0" />
            100% UNIVERSAL COMPATIBILITY
          </div>
          <h2 className="text-3xl md:text-5xl font-space font-extrabold text-white">
            Compatible Marketplaces
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-sans leading-relaxed">
            MUMY evaluates listings across all major custom print-on-demand networks and self-hosted channels to protect you from algorithmic suspensions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {marketplaces.map((m, idx) => (
            <div 
              key={idx} 
              className="p-6 bg-[#0c0c0c] border border-white/5 rounded-2xl hover:border-brand-blue/30 hover:bg-[#0e0e0e] transition-all min-h-[140px] flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-space font-bold text-lg text-white">
                    {m.name}
                  </h3>
                  <span className="text-[9px] font-mono font-bold text-[#2cff05] px-2 py-0.5 rounded bg-brand-green/10 border border-brand-green/25 uppercase tracking-wider">
                    {m.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-sans leading-relaxed">
                  {m.desc}
                </p>
              </div>
              <div className="text-[10px] text-gray-500 font-mono pt-3 border-t border-white/5 mt-3">
                ● {m.type}
              </div>
            </div>
          ))}
          {/* Universal Showcase option card */}
          <div className="p-6 bg-gradient-to-br from-brand-blue/15 to-[#0c0c0c] border border-brand-blue/25 rounded-2xl min-h-[140px] flex flex-col justify-between sm:col-span-2 lg:col-span-1 xl:col-span-1">
            <div className="space-y-1">
              <h3 className="font-space font-bold text-lg text-brand-green">
                Scan Anywhere
              </h3>
              <p className="text-xs text-gray-300 font-sans leading-relaxed">
                Need verification for a custom platform? Select the <span className="text-white font-bold">"All Marketplaces"</span> option to execute a universal check.
              </p>
            </div>
            <div className="text-[10px] text-brand-green font-mono pt-3 border-t border-brand-blue/15 mt-3">
              ✓ Fully customized rulesets
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

