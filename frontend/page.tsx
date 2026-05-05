import Image from "next/image";
import UploadForm from "./UploadForm";

const features = [
  {
    number: "01",
    title: "Parse Anything",
    tag: "CSV · XLSX",
    desc: "Throw your chaotic, colour-coded, finance-team-special spreadsheet at us. We'll eat it, digest it, and not complain. Up to 10 MB of pure corporate trauma accepted.",
    why: "Because copy-pasting into a summary doc at 11 PM on a Friday is a crime against humanity.",
  },
  {
    number: "02",
    title: "AI Brain Goes Brrr",
    tag: "Groq · LLaMA 3.3 70B",
    desc: "Our LLM has read more quarterly reports than your entire org combined. It turns raw numbers into crisp executive prose in under 3 seconds — no hallucinations about your targets (we hope).",
    why: "Because 'just look at the spreadsheet' is not a presentation strategy.",
  },
  {
    number: "03",
    title: "Inbox Delivered",
    tag: "Gmail SMTP",
    desc: "A beautifully formatted HTML email lands in the recipient's inbox — clean, branded, and ready to forward to the CEO without a single 'pls see attached'. You're welcome.",
    why: "Because email is still how companies pretend to be organised.",
  },
  {
    number: "04",
    title: "Rate Limited",
    tag: "5 / min / IP",
    desc: "We trust you. We also don't trust you. 5 requests per minute per IP keeps the API alive and your colleagues slightly inconvenienced — motivation to upload only when it counts.",
    why: "Because Groq's free tier is generous, not infinite.",
  },
];

const stats = [
  { value: "< 3s", label: "Summary generation" },
  { value: "10 MB", label: "Max file size" },
  { value: "14 400", label: "Free daily API calls" },
  { value: "100%", label: "Gemini-free" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      <nav className="sticky top-0 z-50 bg-paper border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-14">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="Sellix logo"
              width={64}
              height={64}
              //   className="border-2 border-ink shadow-[2px_2px_0_#0a0a0a] group-hover:shadow-none group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all duration-100"
            />
            <span className="font-black text-sm uppercase tracking-swiss">
              Sellix
            </span>
            <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wide2 text-gray-400 border border-rule px-1.5 py-0.5 ml-1">
              Pragati
            </span>
          </a>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "How it works", href: "#how" },
              { label: "Features", href: "#features" },
              { label: "Upload", href: "#upload" },
            ].map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs font-bold uppercase tracking-swiss text-ink hover:text-accent transition-colors"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://sellix-sales-insight-generator.onrender.com/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-black uppercase tracking-swiss border-2 border-ink px-3 py-1.5
                       shadow-brutal hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]
                       transition-all duration-100 bg-white"
          >
            API Docs ↗
          </a>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────── */}
      <section id="hero" className="hero-grid border-b-2 border-ink">
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-accent" />
            <span className="text-[11px] font-black uppercase tracking-wide2 text-accent">
              Internal tool · Q1 2026
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2.8rem,8vw,7rem)] font-black leading-[0.92] tracking-tight uppercase max-w-5xl mb-8">
            Stop Manually{" "}
            <span className="relative inline-block">
              <span className="relative z-10">Summarising</span>
              <span className="absolute bottom-1 left-0 w-full h-3 bg-accent-light -z-0" />
            </span>
            <br />
            <span className="text-accent">Sales Data</span>
            <br />
            Like It&apos;s 2003.
          </h1>

          {/* Tagline */}
          <p className="text-lg md:text-xl font-medium text-gray-600 max-w-2xl leading-relaxed mb-12">
            Upload a spreadsheet. Get an AI-written executive summary in your
            inbox.{" "}
            <span className="font-bold text-ink">
              No pivot tables. No panicking. No excuses.
            </span>{" "}
            Your manager will think you stayed up all night. You didn&apos;t.
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#upload"
              className="inline-flex items-center gap-2 bg-accent text-white font-black uppercase tracking-swiss
                         text-sm border-2 border-ink px-6 py-3.5 shadow-brutal-lg
                         hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px]
                         transition-all duration-100"
            >
              Try it now →
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 bg-white text-ink font-black uppercase tracking-swiss
                         text-sm border-2 border-ink px-6 py-3.5 shadow-brutal
                         hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]
                         transition-all duration-100"
            >
              See features
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-0 border-2 border-ink">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className={`px-6 py-5 ${i < stats.length - 1 ? "border-r-0 md:border-r-2 border-b-2 md:border-b-0 border-ink" : ""} ${i === 1 || i === 3 ? "border-b-2 md:border-b-0 border-r-2 md:border-r-0" : ""}`}
              >
                <div className="text-3xl font-black text-accent">{s.value}</div>
                <div className="text-[11px] font-bold uppercase tracking-swiss text-gray-500 mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────── */}
      <section id="how" className="border-b-2 border-ink bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="flex items-center gap-4 mb-14">
            <div className="h-px flex-1 bg-rule" />
            <h2 className="text-xs font-black uppercase tracking-wide2 text-gray-400">
              How it works
            </h2>
            <div className="h-px flex-1 bg-rule" />
          </div>

          <div className="grid md:grid-cols-4 gap-0 border-2 border-ink">
            {[
              {
                step: "01",
                icon: "📂",
                title: "Drop the file",
                body: "Drag & drop your .csv or .xlsx. The messier the better — we have pandas.",
              },
              {
                step: "02",
                icon: "⚙️",
                title: "We crunch it",
                body: "Revenue totals, top regions, best categories. Maths no one asked you to do.",
              },
              {
                step: "03",
                icon: "🧠",
                title: "AI writes it up",
                body: "LLaMA 3.3 70B turns your numbers into an executive narrative. C-suite approved.",
              },
              {
                step: "04",
                icon: "📬",
                title: "Lands in inbox",
                body: "A formatted HTML email arrives. You look incredibly competent. Enjoy it.",
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className={`p-8 ${i < 3 ? "border-b-2 md:border-b-0 md:border-r-2 border-ink" : ""}`}
              >
                <div className="text-[10px] font-black uppercase tracking-wide2 text-accent mb-4">
                  {item.step}
                </div>
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="font-black text-base uppercase tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed font-medium">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────── */}
      <section id="features" className="border-b-2 border-ink bg-paper">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8 bg-accent" />
              <span className="text-[11px] font-black uppercase tracking-wide2 text-accent">
                Features
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight">
              Why Your Team <br />
              <span className="text-accent">Has to Use This.</span>
            </h2>
            <p className="mt-4 text-base text-gray-500 font-medium max-w-xl">
              (Politely mandatory. HR-approved. Your quarterly review depends on
              it. Probably.)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-0 border-2 border-ink">
            {features.map((f, i) => (
              <div
                key={f.number}
                className={`p-8 relative overflow-hidden
                  ${i % 2 === 0 ? "md:border-r-2 border-ink" : ""}
                  ${i < 2 ? "border-b-2 border-ink" : ""}
                `}
              >
                {/* Number watermark */}
                <span className="absolute top-4 right-5 text-7xl font-black text-rule select-none leading-none">
                  {f.number}
                </span>

                <div className="relative z-10">
                  <div className="inline-block border-2 border-ink bg-accent-light px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide2 mb-4 shadow-[2px_2px_0_#0a0a0a]">
                    {f.tag}
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-3">
                    {f.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed font-medium mb-4">
                    {f.desc}
                  </p>
                  <div className="border-l-4 border-accent pl-3">
                    <p className="text-xs font-bold italic text-gray-500">
                      {f.why}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPLOAD ─────────────────────────────────────── */}
      <section id="upload" className="border-b-2 border-ink bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            {/* Left copy */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-8 bg-accent" />
                <span className="text-[11px] font-black uppercase tracking-wide2 text-accent">
                  Upload
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-tight mb-6">
                Go Ahead. <br />
                <span className="text-accent">Drop the File.</span>
              </h2>
              <p className="text-base text-gray-600 font-medium leading-relaxed mb-8">
                Your sales data goes in. A polished executive summary comes out.
                The AI does the thinking. You take the credit. This is the way.
              </p>

              <ul className="space-y-3">
                {[
                  "Accepts .csv and .xlsx up to 10 MB",
                  "Revenue, units, region & category breakdowns",
                  "Groq LLaMA 3.3 · sub-3s generation",
                  "Delivered as a formatted HTML email",
                  "Rate limited to keep it fair (5 req/min)",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-sm font-medium text-gray-700"
                  >
                    <span className="mt-0.5 w-4 h-4 bg-accent border-2 border-ink flex-shrink-0 flex items-center justify-center shadow-[1px_1px_0_#0a0a0a]">
                      <span className="text-white text-[8px] font-black">
                        ✓
                      </span>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right form */}
            <div>
              <UploadForm />
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────── */}
      <footer className="bg-ink text-paper">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-5 h-5 bg-accent border border-paper/30 flex items-center justify-center">
                  <span className="text-white font-black text-[9px]">S</span>
                </div>
                <span className="font-black text-sm uppercase tracking-swiss">
                  Sellix
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wide2 text-paper/40 ml-1">
                  by pragati
                </span>
              </div>
              <p className="text-[11px] text-paper/40 font-medium uppercase tracking-swiss">
                Sales Insight Automator · Q1 2026 · Powered by Groq
              </p>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="https://sellix-sales-insight-generator.onrender.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-black uppercase tracking-swiss border border-paper/20 px-3 py-1.5
                           hover:border-paper hover:text-white transition-colors text-paper/60"
              >
                Swagger UI ↗
              </a>
              <a
                href="https://sellix-sales-insight-generator.onrender.com/redoc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-black uppercase tracking-swiss border border-paper/20 px-3 py-1.5
                           hover:border-paper hover:text-white transition-colors text-paper/60"
              >
                ReDoc ↗
              </a>
              <a
                href="#upload"
                className="text-[11px] font-black uppercase tracking-swiss bg-accent border-2 border-accent
                           px-3 py-1.5 hover:bg-accent-dark transition-colors text-white"
              >
                Back to top ↑
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-paper/10 flex flex-col md:flex-row justify-between gap-2">
            <p className="text-[10px] text-paper/30 font-medium uppercase tracking-swiss">
              © 2026 Built for internal use.
            </p>
            <p className="text-[10px] text-paper/30 font-medium uppercase tracking-swiss">
              No Gemini APIs were harmed in the making of this tool.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
