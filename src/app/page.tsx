"use client";
// ─────────────────────────────────────────────────────────────────────────────
// CareerPilot AI — Full Application
// React (Make preview) + Next.js App Router compatible code
// See /src/nextjs/ for the file-split Next.js version
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useCallback, useEffect } from "react";
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, XAxis, YAxis,
  Tooltip, CartesianGrid, LineChart, Line,
} from "recharts";
import {
  Briefcase, Target, Zap, FileText, TrendingUp, Award, ChevronRight,
  ArrowRight, Star, Check, Menu, X, Bell, Search, Upload, User,
  BarChart2, MessageSquare, BookOpen, PenTool, Settings, LogOut,
  ChevronDown, Mic, Camera, Download, Copy, Plus, Edit2, Clock,
  Code, Globe, Cpu, Shield, Sparkles, Brain, Bot, Send, Map,
  LayoutDashboard, Rocket, ChevronLeft, CheckCircle, AlertCircle,
  Mail, Lock, Eye, EyeOff, GraduationCap, Building, Calendar, Trophy,
  Flame, Activity, Play, Gauge, Lightbulb, Compass, GitBranch,
  MoreHorizontal, ExternalLink, RefreshCw, Hash, HelpCircle,
  ChevronUp, Info, Layers, Filter, Users,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Page =
  | "landing" | "login" | "signup" | "forgot" | "onboarding"
  | "dashboard" | "resume-upload" | "resume-analysis" | "job-match"
  | "roadmap" | "interview" | "skill-gap" | "cover-letter" | "profile";

// ─── Data ─────────────────────────────────────────────────────────────────────

const weeklyActivity = [
  { day: "Mon", applications: 3, interviews: 1, learning: 4 },
  { day: "Tue", applications: 5, interviews: 2, learning: 3 },
  { day: "Wed", applications: 2, interviews: 0, learning: 6 },
  { day: "Thu", applications: 7, interviews: 3, learning: 5 },
  { day: "Fri", applications: 4, interviews: 1, learning: 2 },
  { day: "Sat", applications: 1, interviews: 0, learning: 7 },
  { day: "Sun", applications: 2, interviews: 1, learning: 4 },
];

const skillProgress = [
  { skill: "React", current: 75, target: 95 },
  { skill: "Node.js", current: 60, target: 85 },
  { skill: "TypeScript", current: 70, target: 90 },
  { skill: "Python", current: 55, target: 82 },
  { skill: "SQL", current: 65, target: 85 },
  { skill: "System Design", current: 40, target: 78 },
];

const radarSkills = [
  { subject: "Frontend", A: 85, B: 95 },
  { subject: "Backend", A: 65, B: 88 },
  { subject: "DevOps", A: 40, B: 70 },
  { subject: "DSA", A: 72, B: 90 },
  { subject: "System Design", A: 45, B: 80 },
  { subject: "Soft Skills", A: 80, B: 85 },
];

const roadmapWeeks = [
  { week: "Week 1–2", title: "DSA Foundations", status: "completed", tasks: ["Arrays & Strings", "Linked Lists", "Stack & Queue", "50 LeetCode Easy"], pct: 100 },
  { week: "Week 3–4", title: "Advanced DSA", status: "completed", tasks: ["Trees & Graphs", "Dynamic Programming", "Backtracking", "50 LeetCode Medium"], pct: 100 },
  { week: "Week 5–6", title: "System Design", status: "in-progress", tasks: ["HLD & LLD Basics", "Scalability Patterns", "Case Studies", "Mock Design Interview"], pct: 50 },
  { week: "Week 7–8", title: "Frontend Mastery", status: "pending", tasks: ["React Advanced Patterns", "Performance Optimization", "Testing", "Build a Project"], pct: 0 },
  { week: "Week 9–10", title: "Mock Interviews & Apply", status: "pending", tasks: ["5 Full Mock Rounds", "Behavioral Prep", "Resume Finalization", "100 Applications"], pct: 0 },
];

const testimonials = [
  { name: "Priya Sharma", role: "SDE Intern @ Google", avatar: "PS", college: "IIT Bombay", text: "CareerPilot AI transformed my job search. The ATS optimizer got my resume past filters I never could before. Landed my Google internship in just 6 weeks!", stars: 5 },
  { name: "Arjun Mehta", role: "SWE Intern @ Microsoft", avatar: "AM", college: "BITS Pilani", text: "The AI interview practice is insane. It gave me questions almost identical to my actual Microsoft interview. I felt 10x more confident walking in.", stars: 5 },
  { name: "Sneha Reddy", role: "Product Intern @ Stripe", avatar: "SR", college: "NIT Trichy", text: "From a 32% resume score to 91% in 2 days. The roadmap feature kept me accountable every single week. Best investment I made for my career.", stars: 5 },
];

// ─── Shared Components ────────────────────────────────────────────────────────

function ProgressRing({ value, size = 100, strokeWidth = 9, color = "#6366f1", bg = "#ede9fe", showLabel = false }: {
  value: number; size?: number; strokeWidth?: number; color?: string; bg?: string; showLabel?: boolean;
}) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ - (value / 100) * circ;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)" }} />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-extrabold text-gray-900" style={{ fontSize: size * 0.22 }}>{value}</span>
          <span className="text-gray-400" style={{ fontSize: size * 0.1 }}>/ 100</span>
        </div>
      )}
    </div>
  );
}

function Badge({ color, children }: { color: string; children: React.ReactNode }) {
  const map: Record<string, string> = {
    indigo: "bg-indigo-100 text-indigo-700", purple: "bg-violet-100 text-violet-700",
    cyan: "bg-cyan-100 text-cyan-700", emerald: "bg-emerald-100 text-emerald-700",
    amber: "bg-amber-100 text-amber-700", red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-500", orange: "bg-orange-100 text-orange-700",
  };
  return <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${map[color] ?? map.gray}`}>{children}</span>;
}

function Btn({ children, onClick, className = "", variant = "primary", size = "md" }: {
  children: React.ReactNode; onClick?: () => void; className?: string;
  variant?: "primary" | "outline" | "ghost"; size?: "sm" | "md" | "lg";
}) {
  const sz = { sm: "px-3.5 py-1.5 text-xs", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3.5 text-base" }[size];
  if (variant === "outline") return (
    <button onClick={onClick} className={`${sz} rounded-xl border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-all duration-200 ${className}`}>{children}</button>
  );
  if (variant === "ghost") return (
    <button onClick={onClick} className={`${sz} rounded-xl text-gray-600 font-semibold hover:bg-gray-100 transition-all duration-200 ${className}`}>{children}</button>
  );
  return (
    <button onClick={onClick} className={`${sz} rounded-xl font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg hover:shadow-indigo-200 active:scale-[0.97] ${className}`}
      style={{ background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)" }}>{children}</button>
  );
}

function Card({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return <div className={`bg-white rounded-2xl border border-gray-100 ${className}`} style={style}>{children}</div>;
}

function Field({ icon, placeholder, type, value, onChange, label }: {
  icon: React.ReactNode; placeholder: string; type: string; value: string; onChange: (v: string) => void; label: string;
}) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{label}</label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all" />
      </div>
    </div>
  );
}

// ─── Landing Page ─────────────────────────────────────────────────────────────

function LandingPage({ navigate }: { navigate: (p: Page) => void }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [annual, setAnnual] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const features = [
    { icon: FileText, color: "indigo", title: "ATS Resume Optimizer", desc: "AI scans your resume against 200+ ATS systems and delivers an actionable score with precise keyword suggestions for any role." },
    { icon: Target, color: "purple", title: "Job Description Match", desc: "Paste any JD and instantly see your match %, missing skills, and tailored suggestions to maximize your interview chances." },
    { icon: MessageSquare, color: "cyan", title: "AI Mock Interviews", desc: "Practice with a real-time AI interviewer that adapts to your role, asks intelligent follow-ups, and scores every answer." },
    { icon: Map, color: "emerald", title: "Personalized Roadmap", desc: "Week-by-week learning plan built from your skill gaps, target company, graduation timeline, and current proficiency." },
    { icon: TrendingUp, color: "amber", title: "Skill Gap Analysis", desc: "See exactly what skills you're missing, how hard they are to learn, and the fastest path from beginner to job-ready." },
    { icon: PenTool, color: "red", title: "Cover Letter AI", desc: "Generate tailored, professional cover letters in seconds — personalized to the exact role, company, and your background." },
  ];

  const pricing = [
    { name: "Free", price: 0, features: ["1 Resume Analysis/month", "Basic ATS Score", "3 Mock Questions", "Community Access"], cta: "Get Started Free" },
    { name: "Pro", price: annual ? 19 : 29, popular: true, features: ["Unlimited Resume Scans", "Full ATS Optimizer", "Unlimited Mock Interviews", "AI Roadmap Generation", "Job Match Analysis", "Cover Letter Generator", "Priority Support"], cta: "Start 7-Day Free Trial" },
    { name: "Team", price: annual ? 49 : 69, features: ["Everything in Pro", "5 Team Members", "Placement Analytics", "Dedicated Coach AI", "API Access", "Custom Integrations", "White-glove Onboarding"], cta: "Contact Sales" },
  ];

  const colorSpec: Record<string, { bg: string; text: string; border: string }> = {
    indigo: { bg: "#eef2ff", text: "#6366f1", border: "#c7d2fe" },
    purple: { bg: "#f5f3ff", text: "#8b5cf6", border: "#ddd6fe" },
    cyan:   { bg: "#ecfeff", text: "#06b6d4", border: "#a5f3fc" },
    emerald:{ bg: "#ecfdf5", text: "#10b981", border: "#a7f3d0" },
    amber:  { bg: "#fffbeb", text: "#f59e0b", border: "#fde68a" },
    red:    { bg: "#fef2f2", text: "#ef4444", border: "#fecaca" },
  };

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "'Inter',-apple-system,sans-serif" }}>
      {/* Navbar */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-indigo-100/60" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate("landing")} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              <Rocket className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-gray-900">CareerPilot<span className="text-indigo-600"> AI</span></span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Pricing", "Testimonials", "Blog"].map(l => (
              <button key={l} className="text-sm font-medium text-gray-500 hover:text-indigo-600 transition-colors">{l}</button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Btn variant="ghost" size="sm" onClick={() => navigate("login")}>Log in</Btn>
            <Btn size="sm" onClick={() => navigate("signup")}>Get Started Free</Btn>
          </div>
          <button className="md:hidden p-1" onClick={() => setMobileOpen(o => !o)}>
            {mobileOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 px-6 py-5 space-y-3">
            {["Features", "Pricing", "Testimonials"].map(l => (
              <button key={l} className="block text-sm font-medium text-gray-600">{l}</button>
            ))}
            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Btn variant="outline" size="sm" onClick={() => navigate("login")} className="flex-1 justify-center">Log in</Btn>
              <Btn size="sm" onClick={() => navigate("signup")} className="flex-1 justify-center">Sign up</Btn>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-24 px-6" style={{ background: "linear-gradient(160deg,#fafafe 0%,#f0f0fe 55%,#faf5ff 100%)" }}>
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-white border border-indigo-200 rounded-full px-4 py-1.5 mb-7 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span className="text-xs font-semibold text-indigo-700">Trusted by 12,000+ students at IIT, NIT & BITS</span>
            </div>
            <h1 className="text-5xl lg:text-[3.8rem] font-extrabold text-gray-900 leading-[1.08] tracking-tight mb-6">
              Land Your Dream<br />
              <span style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6 50%,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Internship with AI
              </span>
            </h1>
            <p className="text-[1.1rem] text-gray-400 leading-relaxed mb-9 max-w-lg">
              Upload your resume, analyze ATS score, identify skill gaps, prepare for interviews, and receive a personalized roadmap—all powered by AI.
            </p>
            <div className="flex flex-wrap gap-4 mb-9">
              <Btn size="lg" onClick={() => navigate("signup")} className="flex items-center gap-2">
                Analyze My Resume <ArrowRight className="w-4 h-4" />
              </Btn>
              <button onClick={() => navigate("dashboard")} className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-gray-700 bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm">
                <Play className="w-4 h-4 fill-current opacity-70" /> Try Live Demo
              </button>
            </div>
            <div className="flex flex-wrap gap-5">
              {["No credit card required", "Free forever plan", "Cancel anytime"].map(t => (
                <div key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm text-gray-400">{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="hidden lg:block relative">
            <div className="relative rounded-3xl overflow-visible" style={{ filter: "drop-shadow(0 40px 80px rgba(99,102,241,0.18))" }}>
              <div className="rounded-3xl p-5" style={{ background: "linear-gradient(145deg,#eef2ff,#ede9fe)" }}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <div className="flex-1 mx-3">
                      <div className="bg-gray-100 rounded-md h-5 flex items-center px-3">
                        <span className="text-[9px] text-gray-400">app.careerpilot.ai/dashboard</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-10 bg-white border-r border-gray-100 py-3 flex flex-col items-center gap-3">
                      {[LayoutDashboard, FileText, Target, Map, MessageSquare].map((Icon, i) => (
                        <div key={i} className={`w-6 h-6 rounded-lg flex items-center justify-center ${i === 0 ? "bg-indigo-600" : ""}`}>
                          <Icon className={`w-3 h-3 ${i === 0 ? "text-white" : "text-gray-300"}`} />
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 p-4 bg-gray-50/50">
                      <div className="text-xs font-bold text-gray-700 mb-3">Dashboard</div>
                      <div className="grid grid-cols-3 gap-2 mb-3">
                        {[{ l: "ATS Score", v: "94%", c: "#10b981" }, { l: "Job Match", v: "87%", c: "#6366f1" }, { l: "Readiness", v: "76%", c: "#8b5cf6" }].map(s => (
                          <div key={s.l} className="bg-white rounded-xl p-2 shadow-sm">
                            <div className="text-sm font-extrabold" style={{ color: s.c }}>{s.v}</div>
                            <div className="text-[8px] text-gray-400">{s.l}</div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-white rounded-xl p-3 shadow-sm mb-2">
                        <div className="text-[8px] text-gray-400 mb-1.5">Weekly Activity</div>
                        <div className="flex items-end gap-1 h-10">
                          {weeklyActivity.map((d, i) => (
                            <div key={i} className="flex-1 rounded-sm" style={{ height: `${(d.applications / 7) * 32}px`, background: "linear-gradient(to top,#6366f1,#8b5cf6)" }} />
                          ))}
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-2 shadow-sm flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Bot className="w-2.5 h-2.5 text-indigo-500" />
                        </div>
                        <div className="text-[8px] text-gray-500">AI: Add quantified metrics to Work Experience →</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-6 bg-white rounded-2xl shadow-xl border border-emerald-100 px-3.5 py-2.5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">ATS Compatible</div>
                  <div className="text-[10px] text-gray-400">Score: 94/100</div>
                </div>
              </div>
              <div className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl border border-violet-100 px-3.5 py-2.5 flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-violet-600" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">AI Roadmap Ready</div>
                  <div className="text-[10px] text-gray-400">10-week plan · Google SWE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-14 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-semibold text-gray-300 uppercase tracking-widest mb-8">Interns placed at</p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {["Google", "Microsoft", "Amazon", "Meta", "Stripe", "Airbnb", "Goldman Sachs"].map(c => (
              <span key={c} className="text-sm font-bold text-gray-300 tracking-wide">{c}</span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-gray-100">
            {[{ v: "94%", l: "Interview Success Rate" }, { v: "12K+", l: "Students Placed" }, { v: "3.2×", l: "Faster Job Search" }].map(s => (
              <div key={s.l} className="text-center">
                <div className="text-4xl font-extrabold text-gray-900 mb-1">{s.v}</div>
                <div className="text-sm text-gray-400">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <Badge color="indigo">Features</Badge>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4 mb-4 tracking-tight">Everything you need to get hired</h2>
            <p className="text-lg text-gray-400 max-w-xl mx-auto">One platform to optimize your resume, ace interviews, and build the exact skills top employers want.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(f => {
              const Icon = f.icon;
              const c = colorSpec[f.color];
              return (
                <Card key={f.title} className="group p-6 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300 cursor-pointer">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                    <Icon className="w-5 h-5" style={{ color: c.text }} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6" style={{ background: "linear-gradient(160deg,#fafafe,#f0f0fe)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge color="purple">How It Works</Badge>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">From upload to offer in 4 steps</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step: "01", icon: Upload, title: "Upload Resume", desc: "Drop your PDF or DOCX. AI extracts every detail instantly." },
              { step: "02", icon: Gauge, title: "Get Your Score", desc: "Receive ATS score, keyword gaps, and formatting analysis." },
              { step: "03", icon: Map, title: "Follow Roadmap", desc: "Week-by-week plan to close every gap before the interview." },
              { step: "04", icon: Trophy, title: "Land the Role", desc: "Apply with confidence. AI-coached, fully prepared." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="relative">
                  {i < 3 && <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-indigo-100 z-0" />}
                  <Card className="relative z-10 p-5 text-center">
                    <div className="text-xs font-extrabold text-indigo-300 mb-3">{s.step}</div>
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: "linear-gradient(135deg,#eef2ff,#ede9fe)" }}>
                      <Icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 mb-1.5">{s.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{s.desc}</p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge color="cyan">Testimonials</Badge>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4 tracking-tight">Loved by students at top colleges</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <Card key={t.name} className="p-6 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm text-gray-500 leading-[1.8] mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>{t.avatar}</div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{t.name}</div>
                    <div className="text-xs text-indigo-600 font-medium">{t.role}</div>
                    <div className="text-xs text-gray-400">{t.college}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6" style={{ background: "linear-gradient(160deg,#fafafe,#f0f0fe)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge color="emerald">Pricing</Badge>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-4 mb-4 tracking-tight">Simple, transparent pricing</h2>
            <div className="inline-flex items-center bg-gray-100 rounded-xl p-1">
              <button onClick={() => setAnnual(false)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${!annual ? "bg-white shadow text-gray-900" : "text-gray-400"}`}>Monthly</button>
              <button onClick={() => setAnnual(true)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${annual ? "bg-white shadow text-gray-900" : "text-gray-400"}`}>Annual <span className="text-emerald-600 text-xs ml-1">Save 35%</span></button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pricing.map((plan: any) => (
              <div key={plan.name} className={`relative rounded-2xl p-6 border transition-all ${plan.popular ? "border-indigo-400 shadow-xl shadow-indigo-100" : "border-gray-200 bg-white"}`}
                style={plan.popular ? { background: "linear-gradient(160deg,#fafafe,#eef2ff)" } : {}}>
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-[11px] font-bold px-3.5 py-1 rounded-full shadow-md">Most Popular</span>
                  </div>
                )}
                <div className="mb-5">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{plan.name}</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                    <span className="text-gray-400 text-sm">/month</span>
                  </div>
                  {annual && plan.price > 0 && <div className="text-xs text-emerald-600 mt-1">Billed annually</div>}
                </div>
                <Btn variant={plan.popular ? "primary" : "outline"} onClick={() => navigate("signup")} className="w-full justify-center mb-6">{plan.cta}</Btn>
                <ul className="space-y-2.5">
                  {plan.features.map((f: string) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-500">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span className="text-xs font-semibold text-indigo-200">Join 12,000+ students who landed their dream jobs</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Ready to land your dream internship?</h2>
          <p className="text-indigo-200 text-lg mb-8">No credit card required. Set up in 2 minutes.</p>
          <button onClick={() => navigate("signup")} className="px-9 py-4 bg-white rounded-xl text-indigo-700 font-bold text-base hover:shadow-2xl transition-all hover:scale-[1.03] active:scale-100">
            Start for Free — It&apos;s Instant
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-14 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                  <Rocket className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-white font-bold">CareerPilot AI</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">AI-powered career coaching for the next generation of tech talent.</p>
            </div>
            {[
              { title: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
              { title: "Resources", links: ["Blog", "Resume Templates", "Interview Guides", "Community"] },
              { title: "Company", links: ["About", "Careers", "Privacy", "Terms"] },
            ].map(col => (
              <div key={col.title}>
                <div className="text-xs font-bold text-gray-300 uppercase tracking-widest mb-4">{col.title}</div>
                <ul className="space-y-2.5">
                  {col.links.map(l => <li key={l}><button className="text-sm text-gray-500 hover:text-white transition-colors">{l}</button></li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-gray-600">© 2025 CareerPilot AI, Inc. All rights reserved.</div>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "GitHub", "Discord"].map(s => (
                <button key={s} className="text-xs text-gray-600 hover:text-white transition-colors">{s}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ─── Auth Pages ───────────────────────────────────────────────────────────────

function AuthPage({ mode, navigate }: { mode: "login" | "signup" | "forgot"; navigate: (p: Page) => void }) {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate(mode === "forgot" ? "login" : "onboarding"); }, 1000);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ fontFamily: "'Inter',-apple-system,sans-serif" }}>
      {/* Left dark panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden" style={{ background: "linear-gradient(160deg,#0f0f1a 0%,#1e1060 100%)" }}>
        <div className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            <Rocket className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-extrabold text-white">CareerPilot AI</span>
        </div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-[0.12]" style={{ background: "radial-gradient(circle,#6366f1,transparent)" }} />
          <div className="absolute -bottom-10 -right-10 w-64 h-64 rounded-full opacity-[0.08]" style={{ background: "radial-gradient(circle,#8b5cf6,transparent)" }} />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#6366f1 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
        </div>
        <div className="z-10 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/10 rounded-full px-3 py-1.5 mb-5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-indigo-300 font-medium">Trusted by 12,000+ students</span>
            </div>
            <blockquote className="text-white text-2xl font-light leading-[1.6] mb-6">
              &ldquo;CareerPilot AI helped me go from zero to Google intern in 8 weeks. Absolutely game-changing.&rdquo;
            </blockquote>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>PS</div>
              <div>
                <div className="text-white font-semibold text-sm">Priya Sharma</div>
                <div className="text-indigo-400 text-xs">SDE Intern @ Google · IIT Bombay &apos;26</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ v: "94%", l: "Avg. ATS Score" }, { v: "8 wks", l: "Time to Offer" }, { v: "4.9★", l: "Rating" }].map(s => (
              <div key={s.l} className="bg-white/5 border border-white/10 rounded-2xl p-3.5">
                <div className="text-xl font-extrabold text-white">{s.v}</div>
                <div className="text-xs text-gray-400 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex items-center justify-center p-8" style={{ background: "#f8f8fc" }}>
        <div className="w-full max-w-[420px]">
          <button onClick={() => navigate("landing")} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-8 transition-colors group">
            <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to home
          </button>

          {mode === "forgot" ? (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Reset your password</h1>
              <p className="text-gray-400 text-sm mb-8">We&apos;ll send a magic link to your email.</p>
              <div className="space-y-4">
                <Field icon={<Mail className="w-4 h-4 text-gray-400" />} label="Email address" placeholder="you@college.edu" type="email" value={email} onChange={setEmail} />
                <Btn onClick={submit} className="w-full justify-center" size="lg">{loading ? "Sending..." : "Send Reset Link"}</Btn>
                <p className="text-center text-sm text-gray-400">Remember it? <button onClick={() => navigate("login")} className="text-indigo-600 font-semibold hover:underline">Sign in</button></p>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">{mode === "login" ? "Welcome back 👋" : "Create your account"}</h1>
              <p className="text-gray-400 text-sm mb-7">{mode === "login" ? "Sign in to your CareerPilot account" : "Start your AI-powered career journey today"}</p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:shadow-sm transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Google
                </button>
                <button className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 text-sm font-semibold text-white hover:bg-gray-800 transition-all">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Apple
                </button>
              </div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or continue with email</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <div className="space-y-4">
                {mode === "signup" && <Field icon={<User className="w-4 h-4 text-gray-400" />} label="Full name" placeholder="Your full name" type="text" value={name} onChange={setName} />}
                <Field icon={<Mail className="w-4 h-4 text-gray-400" />} label="Email address" placeholder="you@college.edu" type="email" value={email} onChange={setEmail} />
                <div>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition-all" />
                    <button onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                {mode === "login" && (
                  <div className="text-right -mt-1">
                    <button onClick={() => navigate("forgot")} className="text-xs text-indigo-600 hover:underline font-semibold">Forgot password?</button>
                  </div>
                )}
                <Btn onClick={submit} size="lg" className="w-full justify-center">
                  {loading && <RefreshCw className="w-4 h-4 animate-spin inline mr-1.5" />}
                  {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
                </Btn>
              </div>
              <p className="text-center text-sm text-gray-400 mt-6">
                {mode === "login" ? "Don't have an account? " : "Already have an account? "}
                <button onClick={() => navigate(mode === "login" ? "signup" : "login")} className="text-indigo-600 font-semibold hover:underline">
                  {mode === "login" ? "Sign up free" : "Sign in"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Onboarding ───────────────────────────────────────────────────────────────

const ALL_SKILLS = ["React","Vue.js","Next.js","Node.js","Express","Python","Django","FastAPI","TypeScript","JavaScript","Java","C++","Go","Rust","SQL","MongoDB","PostgreSQL","Redis","AWS","GCP","Azure","Docker","Kubernetes","GraphQL","Machine Learning","Data Science","System Design","DSA"];
const DOMAINS = ["Software Development","Data Science / ML","Product Management","DevOps / Cloud","Frontend Engineering","Backend Engineering","Full Stack","Mobile (iOS/Android)"];
const TOP_COMPANIES = ["Google","Microsoft","Amazon","Meta","Apple","Netflix","Stripe","Airbnb","Uber","Goldman Sachs","Jane Street","Atlassian","Salesforce","Adobe"];

function OnboardingPage({ navigate }: { navigate: (p: Page) => void }) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", college: "", branch: "", year: "", skills: [] as string[], domain: "", company: "", role: "" });
  const TOTAL = 4;
  const toggle = (s: string) => setForm(f => ({ ...f, skills: f.skills.includes(s) ? f.skills.filter(x => x !== s) : [...f.skills, s] }));

  if (step >= TOTAL) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(160deg,#fafafe,#f0f0fe)", fontFamily: "'Inter',sans-serif" }}>
      <div className="text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">You&apos;re all set, {form.name || "there"}!</h2>
        <p className="text-gray-400 mb-2">Generating your personalized AI roadmap...</p>
        <p className="text-sm text-indigo-600 font-medium mb-8">10-week plan for {form.role || "Software Engineer"} at {form.company || "your dream company"}</p>
        <Btn size="lg" onClick={() => navigate("dashboard")} className="flex items-center gap-2 mx-auto">Go to Dashboard <ArrowRight className="w-4 h-4" /></Btn>
      </div>
    </div>
  );

  const stepDefs = [
    {
      title: "Let's get to know you", subtitle: "Tell us a bit about yourself", icon: User,
      body: (
        <div className="space-y-4">
          <Field icon={<User className="w-4 h-4 text-gray-400" />} label="Full Name" placeholder="Arjun Mehta" type="text" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
          <Field icon={<Building className="w-4 h-4 text-gray-400" />} label="College / University" placeholder="IIT Bombay" type="text" value={form.college} onChange={v => setForm(f => ({ ...f, college: v }))} />
        </div>
      ),
    },
    {
      title: "Academic details", subtitle: "Branch and expected graduation", icon: GraduationCap,
      body: (
        <div className="space-y-4">
          <Field icon={<BookOpen className="w-4 h-4 text-gray-400" />} label="Branch / Major" placeholder="Computer Science & Engineering" type="text" value={form.branch} onChange={v => setForm(f => ({ ...f, branch: v }))} />
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Graduation Year</label>
            <div className="grid grid-cols-4 gap-2">
              {[2025, 2026, 2027, 2028].map(y => (
                <button key={y} onClick={() => setForm(f => ({ ...f, year: String(y) }))} className={`py-2.5 rounded-xl text-sm font-semibold border transition-all ${form.year === String(y) ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>{y}</button>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Your current skills", subtitle: "Select everything you know", icon: Code,
      body: (
        <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto pr-1">
          {ALL_SKILLS.map(s => (
            <button key={s} onClick={() => toggle(s)} className={`px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${form.skills.includes(s) ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>{s}</button>
          ))}
        </div>
      ),
    },
    {
      title: "Career goals", subtitle: "Dream company and target role", icon: Target,
      body: (
        <div className="space-y-5">
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Preferred Domain</label>
            <div className="grid grid-cols-2 gap-2">
              {DOMAINS.map(d => (
                <button key={d} onClick={() => setForm(f => ({ ...f, domain: d }))} className={`py-2 px-3 rounded-xl text-xs font-semibold border text-left transition-all ${form.domain === d ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>{d}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-2 block">Dream Company</label>
            <div className="flex flex-wrap gap-2">
              {TOP_COMPANIES.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, company: c }))} className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${form.company === c ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"}`}>{c}</button>
              ))}
            </div>
          </div>
          <Field icon={<Briefcase className="w-4 h-4 text-gray-400" />} label="Dream Role" placeholder="Software Development Engineer Intern" type="text" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} />
        </div>
      ),
    },
  ];

  const curr = stepDefs[step];
  const Icon = curr.icon;
  const pct = Math.round(((step + 1) / (TOTAL + 1)) * 100);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(160deg,#fafafe,#f0f0fe)", fontFamily: "'Inter',sans-serif" }}>
      <div className="w-full max-w-xl">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            <Rocket className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-extrabold text-gray-900">CareerPilot AI</span>
        </div>
        <div className="mb-7">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-400">Step {step + 1} of {TOTAL}</span>
            <span className="text-xs font-bold text-indigo-600">{pct}% complete</span>
          </div>
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
          </div>
          <div className="flex gap-1.5 mt-2.5">
            {stepDefs.map((_, i) => (
              <div key={i} className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${i < step ? "bg-indigo-500" : i === step ? "bg-indigo-300" : "bg-gray-200"}`} />
            ))}
          </div>
        </div>
        <Card className="p-8 shadow-xl shadow-indigo-50">
          <div className="flex items-center gap-3 mb-7">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#eef2ff,#ede9fe)" }}>
              <Icon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-gray-900">{curr.title}</h2>
              <p className="text-sm text-gray-400">{curr.subtitle}</p>
            </div>
          </div>
          {curr.body}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <Btn variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} className={step === 0 ? "opacity-0 pointer-events-none" : ""}>
              <ChevronLeft className="inline w-4 h-4 mr-1" /> Back
            </Btn>
            <Btn onClick={() => setStep(s => s + 1)}>
              {step === TOTAL - 1 ? "Finish Setup 🎉" : "Continue"} <ChevronRight className="inline w-4 h-4 ml-1" />
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Sidebar + App Layout ─────────────────────────────────────────────────────

const NAV = [
  { id: "dashboard" as Page, icon: LayoutDashboard, label: "Dashboard" },
  { id: "resume-upload" as Page, icon: Upload, label: "Resume Upload" },
  { id: "resume-analysis" as Page, icon: FileText, label: "Resume Analysis" },
  { id: "job-match" as Page, icon: Target, label: "Job Match" },
  { id: "roadmap" as Page, icon: Map, label: "AI Roadmap" },
  { id: "interview" as Page, icon: MessageSquare, label: "AI Interview" },
  { id: "skill-gap" as Page, icon: TrendingUp, label: "Skill Gap" },
  { id: "cover-letter" as Page, icon: PenTool, label: "Cover Letter" },
  { id: "profile" as Page, icon: User, label: "Profile" },
];

function AppLayout({ page, navigate }: { page: Page; navigate: (p: Page) => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const label = NAV.find(n => n.id === page)?.label ?? "Dashboard";

  const content: Partial<Record<Page, React.ReactNode>> = {
    dashboard: <DashboardContent navigate={navigate} />,
    "resume-upload": <ResumeUploadPage navigate={navigate} />,
    "resume-analysis": <ResumeAnalysisPage navigate={navigate} />,
    "job-match": <JobMatchPage />,
    roadmap: <RoadmapPage />,
    interview: <InterviewPage />,
    "skill-gap": <SkillGapPage />,
    "cover-letter": <CoverLetterPage />,
    profile: <ProfilePage />,
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#f8f8fc", fontFamily: "'Inter',-apple-system,sans-serif" }}>
      <aside className={`${collapsed ? "w-[60px]" : "w-[240px]"} flex-shrink-0 bg-white border-r border-gray-100 flex flex-col fixed h-full z-30 transition-all duration-300`}>
        <div className="h-[58px] flex items-center gap-2.5 px-4 border-b border-gray-100 flex-shrink-0">
          <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
            <Rocket className="w-3.5 h-3.5 text-white" />
          </div>
          {!collapsed && <span className="font-extrabold text-gray-900 text-sm whitespace-nowrap">CareerPilot AI</span>}
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = item.id === page;
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group ${active ? "text-indigo-700" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"}`}
                style={active ? { background: "linear-gradient(135deg,#eef2ff,#f5f3ff)" } : {}}>
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-500"}`} />
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
                {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />}
              </button>
            );
          })}
        </nav>
        <div className="p-2 border-t border-gray-100 space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all group">
            <Settings className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />
            {!collapsed && <span>Settings</span>}
          </button>
          <button onClick={() => navigate("landing")} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all group">
            <LogOut className="w-4 h-4 flex-shrink-0 text-gray-400 group-hover:text-red-400" />
            {!collapsed && <span>Sign out</span>}
          </button>
        </div>
      </aside>

      <div className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "ml-[60px]" : "ml-[240px]"}`}>
        <header className="h-[58px] bg-white border-b border-gray-100 flex items-center gap-4 px-5 sticky top-0 z-20">
          <button onClick={() => setCollapsed(c => !c)} className="text-gray-400 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-100">
            <Menu className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>CareerPilot</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-semibold text-gray-700">{label}</span>
          </div>
          <div className="flex items-center gap-2.5 ml-auto">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input placeholder="Search..." className="pl-8 pr-4 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-xs outline-none focus:border-indigo-300 focus:bg-white w-44 transition-all" />
            </div>
            <button className="relative w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="w-4 h-4 text-gray-400" />
              <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 ring-2 ring-white" />
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>AM</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {content[page] ?? <DashboardContent navigate={navigate} />}
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function DashboardContent({ navigate }: { navigate: (p: Page) => void }) {
  const metrics = [
    { label: "Resume Score", value: 87, color: "#6366f1", bg: "#eef2ff", icon: FileText, delta: "+5 this week" },
    { label: "ATS Score", value: 94, color: "#10b981", bg: "#ecfdf5", icon: CheckCircle, delta: "+12 after edit" },
    { label: "Interview Ready", value: 76, color: "#8b5cf6", bg: "#f5f3ff", icon: MessageSquare, delta: "3 mocks done" },
    { label: "Applications", value: 12, total: 50, color: "#06b6d4", bg: "#ecfeff", icon: Briefcase, suffix: "/50", delta: "4 this week" },
    { label: "Learning Pct", value: 68, color: "#f59e0b", bg: "#fffbeb", icon: BookOpen, delta: "Week 5 of 10" },
    { label: "Skills Done", value: 14, total: 22, color: "#ef4444", bg: "#fef2f2", icon: Zap, suffix: "/22", delta: "+2 this week" },
  ];

  const aiSuggestions = [
    { icon: AlertCircle, iconColor: "#f59e0b", iconBg: "#fffbeb", text: "Add quantified results to Work Experience. Try: 'Reduced API latency by 40% using Redis caching'." },
    { icon: TrendingUp, iconColor: "#6366f1", iconBg: "#eef2ff", text: "Your profile matches 87% with Google SWE Intern. Gap: System Design fundamentals + GCP basics." },
    { icon: Lightbulb, iconColor: "#8b5cf6", iconBg: "#f5f3ff", text: "Practice STAR method for behavioral rounds. Your technical answers are strong; context needs work." },
    { icon: CheckCircle, iconColor: "#10b981", iconBg: "#ecfdf5", text: "ATS score improved from 72% → 94% after yesterday's keyword optimization. Great work!" },
  ];

  const recentActivity = [
    { time: "Today, 2:30 PM", text: "Completed mock interview — DSA + Behavioral", score: "82/100", color: "#6366f1" },
    { time: "Today, 11:00 AM", text: "Resume re-analyzed and optimized", score: "87%", color: "#10b981" },
    { time: "Yesterday", text: "Applied to Stripe SWE Intern (via LinkedIn)", score: "", color: "#8b5cf6" },
    { time: "Yesterday", text: "Finished Week 4 roadmap milestones", score: "100%", color: "#06b6d4" },
    { time: "2 days ago", text: "Skill Gap analysis — 14/22 skills matched", score: "14/22", color: "#f59e0b" },
  ];

  const quickActions = [
    { label: "Upload Resume", icon: Upload, page: "resume-upload" as Page, color: "#6366f1", bg: "#eef2ff" },
    { label: "Job Match", icon: Target, page: "job-match" as Page, color: "#8b5cf6", bg: "#f5f3ff" },
    { label: "Mock Interview", icon: Mic, page: "interview" as Page, color: "#06b6d4", bg: "#ecfeff" },
    { label: "View Roadmap", icon: Map, page: "roadmap" as Page, color: "#10b981", bg: "#ecfdf5" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Good morning, Arjun 👋</h1>
          <p className="text-sm text-gray-400 mt-0.5">You have 3 pending tasks and 2 new AI suggestions.</p>
        </div>
        <Btn onClick={() => navigate("resume-upload")} className="hidden sm:flex items-center gap-2">
          <Upload className="w-4 h-4" /> Upload Resume
        </Btn>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {metrics.map(m => {
          const Icon = m.icon;
          const pct = Math.round((m.value / (m.total ?? 100)) * 100);
          return (
            <Card key={m.label} className="p-4 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-200 cursor-pointer">
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: m.bg }}>
                  <Icon className="w-4 h-4" style={{ color: m.color }} />
                </div>
                <span className="text-[10px] font-medium text-gray-400 text-right leading-tight">{m.delta}</span>
              </div>
              <div className="text-xl font-extrabold text-gray-900">{m.value}{m.suffix ?? "%"}</div>
              <div className="text-[11px] text-gray-400 mb-2.5">{m.label}</div>
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: m.color }} />
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Weekly Activity</h3>
              <p className="text-xs text-gray-400">Applications, interviews & learning hours</p>
            </div>
            <select className="text-xs border border-gray-200 rounded-lg px-2.5 py-1 text-gray-400 outline-none bg-white">
              <option>This week</option><option>Last week</option>
            </select>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyActivity}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.2} /><stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f0f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e0e7ff", fontSize: 12, boxShadow: "0 4px 16px rgba(99,102,241,0.08)" }} />
              <Area type="monotone" dataKey="applications" name="Applications" stroke="#6366f1" strokeWidth={2.5} fill="url(#gA)" dot={false} />
              <Area type="monotone" dataKey="learning" name="Learning hrs" stroke="#8b5cf6" strokeWidth={2.5} fill="url(#gL)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Score Overview</h3>
          <div className="space-y-4">
            {[
              { label: "Resume Score", value: 87, color: "#6366f1", bg: "#ede9fe" },
              { label: "ATS Score", value: 94, color: "#10b981", bg: "#d1fae5" },
              { label: "Interview Ready", value: 76, color: "#8b5cf6", bg: "#ede9fe" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-3">
                <ProgressRing value={s.value} size={52} strokeWidth={6} color={s.color} bg={s.bg} />
                <div className="flex-1">
                  <div className="text-sm font-bold text-gray-900">{s.value}%</div>
                  <div className="text-xs text-gray-400">{s.label}</div>
                </div>
                <Badge color={s.value >= 90 ? "emerald" : s.value >= 75 ? "indigo" : "amber"}>
                  {s.value >= 90 ? "Excellent" : s.value >= 75 ? "Good" : "Fair"}
                </Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="text-xs text-gray-400 mb-2">Application pipeline</div>
            <div className="flex items-center gap-2">
              {[{ l: "Sent", v: 22, c: "#6366f1" }, { l: "Interview", v: 9, c: "#8b5cf6" }, { l: "Offer", v: 3, c: "#10b981" }].map(s => (
                <div key={s.l} className="flex-1 text-center py-2 rounded-xl border border-gray-100 bg-gray-50">
                  <div className="text-sm font-extrabold" style={{ color: s.c }}>{s.v}</div>
                  <div className="text-[9px] text-gray-400">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Bot className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-gray-900">AI Suggestions</h3>
            <Badge color="indigo">4 new</Badge>
          </div>
          <div className="space-y-2.5">
            {aiSuggestions.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50/80 hover:bg-indigo-50/60 transition-colors cursor-pointer group">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: s.iconBg }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: s.iconColor }} />
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed flex-1">{s.text}</p>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 flex-shrink-0 mt-0.5 transition-colors" />
                </div>
              );
            })}
          </div>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(a => {
                const Icon = a.icon;
                return (
                  <button key={a.label} onClick={() => navigate(a.page)} className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-150" style={{ background: a.bg }}>
                      <Icon className="w-4 h-4" style={{ color: a.color }} />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-400 text-center leading-tight">{a.label}</span>
                  </button>
                );
              })}
            </div>
          </Card>
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-gray-900">Recent Activity</h3>
            </div>
            <div className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: a.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-gray-600 leading-snug">{a.text}</div>
                    <div className="text-[10px] text-gray-400">{a.time}</div>
                  </div>
                  {a.score && <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md flex-shrink-0">{a.score}</span>}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Resume Upload ────────────────────────────────────────────────────────────

function ResumeUploadPage({ navigate }: { navigate: (p: Page) => void }) {
  const [drag, setDrag] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"idle" | "uploading" | "done">("idle");
  const ref = useRef<HTMLInputElement>(null);

  const start = () => {
    setPhase("uploading");
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 14 + 6;
      if (p >= 100) { clearInterval(t); setProgress(100); setTimeout(() => setPhase("done"), 400); return; }
      setProgress(p);
    }, 180);
  };

  if (phase === "done") return (
    <div className="max-w-lg mx-auto">
      <Card className="p-8 text-center border-emerald-200">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-7 h-7 text-emerald-500" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900 mb-2">Upload complete!</h2>
        <p className="text-sm text-gray-400 mb-6">AI is analyzing your resume. This takes about 10 seconds.</p>
        <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3 mb-6 text-left">
          <div className="w-10 h-12 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-gray-900">Arjun_Mehta_Resume_2025.pdf</div>
            <div className="text-xs text-gray-400">PDF · 124 KB · Uploaded just now</div>
          </div>
          <CheckCircle className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[{ v: "2", l: "Pages" }, { v: "487", l: "Words" }, { v: "6", l: "Sections" }].map(s => (
            <div key={s.l} className="bg-indigo-50 rounded-xl p-2.5 text-center">
              <div className="text-lg font-extrabold text-indigo-700">{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </div>
          ))}
        </div>
        <Btn onClick={() => navigate("resume-analysis")} className="w-full justify-center" size="lg">
          View Full Analysis <ArrowRight className="inline w-4 h-4 ml-1.5" />
        </Btn>
      </Card>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Upload Your Resume</h1>
        <p className="text-sm text-gray-400 mt-1">Get an instant ATS score, keyword analysis, and personalized suggestions.</p>
      </div>
      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={e => { e.preventDefault(); setDrag(false); start(); }}
        onClick={() => phase === "idle" && ref.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-16 text-center transition-all duration-200 cursor-pointer select-none ${drag ? "border-indigo-400 bg-indigo-50" : phase === "uploading" ? "border-indigo-300 bg-white" : "border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/20"}`}
      >
        <input ref={ref} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={start} />
        {phase === "uploading" ? (
          <div className="space-y-5">
            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center" style={{ background: "linear-gradient(135deg,#eef2ff,#ede9fe)" }}>
              <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 mb-0.5">Uploading and scanning...</div>
              <div className="text-xs text-gray-400">{Math.round(progress)}% — extracting content</div>
            </div>
            <div className="w-52 mx-auto h-2 bg-indigo-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-200" style={{ width: `${progress}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
            </div>
          </div>
        ) : (
          <>
            <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-5 transition-all duration-200 ${drag ? "scale-110" : ""}`} style={{ background: drag ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#eef2ff,#ede9fe)" }}>
              <Upload className={`w-8 h-8 ${drag ? "text-white" : "text-indigo-500"}`} />
            </div>
            <h3 className="text-base font-bold text-gray-900 mb-2">{drag ? "Release to analyze" : "Drag & drop your resume here"}</h3>
            <p className="text-sm text-gray-400 mb-5">or click to browse from your computer</p>
            <div className="flex items-center justify-center gap-2">
              {["PDF", "DOC", "DOCX"].map(f => <span key={f} className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-bold text-gray-400">{f}</span>)}
            </div>
          </>
        )}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ icon: Gauge, t: "ATS Score", d: "Checks 200+ ATS systems" }, { icon: Target, t: "Keyword Match", d: "Role-specific gaps" }, { icon: Lightbulb, t: "AI Suggestions", d: "Personalized tips" }].map(c => {
          const Icon = c.icon;
          return (
            <Card key={c.t} className="p-4 text-center">
              <Icon className="w-5 h-5 text-indigo-500 mx-auto mb-2" />
              <div className="text-xs font-bold text-gray-900 mb-1">{c.t}</div>
              <div className="text-xs text-gray-400">{c.d}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ─── Resume Analysis ──────────────────────────────────────────────────────────

function ResumeAnalysisPage({ navigate }: { navigate: (p: Page) => void }) {
  const sectionScores = [
    { name: "Keywords", score: 91, color: "#6366f1", badge: "emerald", status: "Excellent" },
    { name: "Formatting", score: 88, color: "#10b981", badge: "emerald", status: "Great" },
    { name: "Achievements", score: 72, color: "#f59e0b", badge: "amber", status: "Needs Work" },
    { name: "Grammar", score: 96, color: "#06b6d4", badge: "cyan", status: "Excellent" },
  ];
  const strengths = ["Strong technical skills section with relevant stack", "Clean ATS-compatible single-column format", "Well-described project outcomes with GitHub links", "Relevant coursework clearly listed"];
  const weaknesses = ["Missing quantified achievements (use numbers!)", "No open-source contribution section", "LinkedIn URL absent from header", "Professional summary missing from top"];
  const suggestions = [
    { p: "High", t: "'Worked on React app' → 'Built React SPA serving 5,000+ daily users, reducing load time by 40% via code splitting'", gain: "+8 pts" },
    { p: "High", t: "Add Skills section with proficiency levels (e.g., React — Advanced, Python — Intermediate)", gain: "+5 pts" },
    { p: "Medium", t: "Include GitHub profile link with pinned repositories showing recent contributions", gain: "+3 pts" },
    { p: "Low", t: "Add a 3-line professional summary at the top tailored to SWE intern roles", gain: "+2 pts" },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Resume Analysis</h1>
          <p className="text-sm text-gray-400 mt-1">Arjun_Mehta_Resume_2025.pdf · Analyzed just now</p>
        </div>
        <div className="flex gap-2.5">
          <Btn variant="outline" onClick={() => navigate("job-match")}>Job Match →</Btn>
          <Btn onClick={() => {}}><Download className="inline w-4 h-4 mr-1.5" />Download Report</Btn>
        </div>
      </div>
      <div className="rounded-2xl p-6 border border-indigo-100" style={{ background: "linear-gradient(135deg,#fafafe,#eef2ff)" }}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex-shrink-0">
            <ProgressRing value={87} size={140} strokeWidth={13} color="#6366f1" bg="#c7d2fe" showLabel />
          </div>
          <div className="flex-1">
            <Badge color="indigo">Overall Score</Badge>
            <h2 className="text-2xl font-extrabold text-gray-900 mt-2 mb-1">Good Resume — Clear Path to Excellent</h2>
            <p className="text-sm text-gray-400 mb-4 max-w-lg">Your resume scores well on format and keywords but needs stronger achievement statements with quantified impact.</p>
            <div className="grid grid-cols-4 gap-3">
              {[{ l: "ATS Score", v: "94%", c: "#10b981" }, { l: "Keywords", v: "91%", c: "#6366f1" }, { l: "Format", v: "88%", c: "#06b6d4" }, { l: "Content", v: "72%", c: "#f59e0b" }].map(s => (
                <div key={s.l} className="bg-white/70 rounded-xl p-2.5 text-center border border-white/60">
                  <div className="text-lg font-extrabold" style={{ color: s.c }}>{s.v}</div>
                  <div className="text-[10px] text-gray-400">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sectionScores.map(s => (
          <Card key={s.name} className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold text-gray-900">{s.name}</span>
              <Badge color={s.badge as any}>{s.status}</Badge>
            </div>
            <div className="text-2xl font-extrabold mb-2" style={{ color: s.color }}>{s.score}%</div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${s.score}%`, background: s.color }} />
            </div>
          </Card>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5 border-emerald-100">
          <div className="flex items-center gap-2 mb-4"><CheckCircle className="w-4 h-4 text-emerald-500" /><h3 className="text-sm font-bold text-gray-900">Strengths</h3></div>
          <ul className="space-y-3">
            {strengths.map(s => <li key={s} className="flex items-start gap-2.5 text-sm text-gray-500"><Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />{s}</li>)}
          </ul>
        </Card>
        <Card className="p-5 border-amber-100">
          <div className="flex items-center gap-2 mb-4"><AlertCircle className="w-4 h-4 text-amber-500" /><h3 className="text-sm font-bold text-gray-900">Areas to Improve</h3></div>
          <ul className="space-y-3">
            {weaknesses.map(w => <li key={w} className="flex items-start gap-2.5 text-sm text-gray-500"><div className="w-4 h-4 rounded-full border-2 border-amber-300 mt-0.5 flex-shrink-0" />{w}</li>)}
          </ul>
        </Card>
      </div>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4"><Lightbulb className="w-4 h-4 text-indigo-500" /><h3 className="text-sm font-bold text-gray-900">AI-Powered Suggestions</h3></div>
        <div className="space-y-2.5">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50/80 hover:bg-indigo-50/50 transition-colors cursor-pointer">
              <Badge color={s.p === "High" ? "red" : s.p === "Medium" ? "amber" : "gray"}>{s.p}</Badge>
              <p className="text-sm text-gray-500 flex-1 leading-relaxed">{s.t}</p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg whitespace-nowrap">{s.gain}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Job Match ────────────────────────────────────────────────────────────────

const SAMPLE_JD = `Software Development Engineer Intern — Google

We are looking for a passionate software engineering intern to join one of our product teams.

Requirements:
• Strong proficiency in Python, Java, C++, or Go
• Data structures, algorithms & system design fundamentals
• Cloud platform experience (GCP, AWS, or Azure)
• React or Angular for frontend work
• RESTful APIs and microservices architecture
• Open source contributions are a plus
• Docker & Kubernetes experience preferred`;

function JobMatchPage() {
  const [jd, setJd] = useState("");
  const [analyzed, setAnalyzed] = useState(false);
  const keywords = [
    { k: "Python", m: true }, { k: "React", m: true }, { k: "REST API", m: true },
    { k: "Data Structures", m: true }, { k: "Microservices", m: true },
    { k: "System Design", m: false }, { k: "Docker", m: false },
    { k: "Kubernetes", m: false }, { k: "GCP / AWS", m: false }, { k: "Open Source", m: false },
  ];
  const missing = [
    { s: "Google Cloud Platform", t: "~3 weeks", d: "Medium" },
    { s: "Docker & Containers", t: "~2 weeks", d: "Medium" },
    { s: "System Design HLD/LLD", t: "~5 weeks", d: "Hard" },
    { s: "Kubernetes Basics", t: "~3 weeks", d: "Hard" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Job Description Match</h1>
        <p className="text-sm text-gray-400 mt-1">Paste any JD to see how well your resume matches the role.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5 flex flex-col" style={{ minHeight: 460 }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-gray-900">Job Description</h3>
            <button onClick={() => setJd(SAMPLE_JD)} className="text-xs text-indigo-600 hover:underline font-semibold">Load Google Sample</button>
          </div>
          <textarea value={jd} onChange={e => setJd(e.target.value)} placeholder="Paste the full job description here..." className="flex-1 min-h-[280px] text-sm text-gray-500 outline-none resize-none leading-relaxed placeholder:text-gray-300" />
          <Btn onClick={() => setAnalyzed(true)} className="w-full justify-center mt-4 flex items-center gap-2">
            <Target className="w-4 h-4" /> Analyze Match
          </Btn>
        </Card>
        <div className="space-y-4">
          {!analyzed ? (
            <Card className="p-14 flex flex-col items-center justify-center text-center" style={{ minHeight: 460 }}>
              <Target className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm text-gray-400">Paste a JD and click Analyze to see your match</p>
            </Card>
          ) : (
            <>
              <Card className="p-5" style={{ background: "linear-gradient(135deg,#fafafe,#f0f0fe)" }}>
                <div className="flex items-center gap-5">
                  <div className="relative flex-shrink-0">
                    <ProgressRing value={68} size={90} strokeWidth={9} color="#6366f1" bg="#c7d2fe" showLabel />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-gray-900">Fair Match</h3>
                    <p className="text-sm text-gray-400 mb-1">68% of requirements met</p>
                    <p className="text-xs text-indigo-600 font-semibold">Can reach 91% with 4 skill additions</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Skill Radar</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={radarSkills}>
                    <PolarGrid stroke="#f1f0f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: "#9ca3af" }} />
                    <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
                    <Radar name="You" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                    <Radar name="Required" dataKey="B" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.08} strokeWidth={2} strokeDasharray="4 2" />
                  </RadarChart>
                </ResponsiveContainer>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Keyword Analysis</h3>
                <div className="flex flex-wrap gap-2">
                  {keywords.map(k => (
                    <span key={k.k} className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold border ${k.m ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                      {k.m ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}{k.k}
                    </span>
                  ))}
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Missing Skills to Add</h3>
                <div className="space-y-2">
                  {missing.map(s => (
                    <div key={s.s} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50">
                      <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600 flex-1">{s.s}</span>
                      <Badge color={s.d === "Hard" ? "red" : "amber"}>{s.d}</Badge>
                      <span className="text-xs text-gray-400 w-14 text-right">{s.t}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Roadmap ──────────────────────────────────────────────────────────────────

function RoadmapPage() {
  const overall = 42;
  const statusMap = {
    completed: { badge: "emerald", dot: "#10b981", label: "Completed", Icon: CheckCircle },
    "in-progress": { badge: "indigo", dot: "#6366f1", label: "In Progress", Icon: Activity },
    pending: { badge: "gray", dot: "#d1d5db", label: "Pending", Icon: Clock },
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">AI Career Roadmap</h1>
          <p className="text-sm text-gray-400 mt-1">10-week personalized plan — Google SWE Intern</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-2xl font-extrabold text-indigo-600">{overall}%</div>
            <div className="text-xs text-gray-400">Complete</div>
          </div>
          <ProgressRing value={overall} size={56} strokeWidth={6} color="#6366f1" bg="#e0e7ff" />
        </div>
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold text-gray-900">10-Day Streak 🔥</span>
          </div>
          <Badge color="amber">On fire!</Badge>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${overall}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6,#06b6d4)" }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">Week 1 — Start</span>
          <span className="text-xs font-semibold text-indigo-600">{overall}% complete</span>
          <span className="text-xs text-gray-400">Week 10 — Offer</span>
        </div>
      </Card>
      <div className="relative">
        <div className="absolute left-[27px] top-6 bottom-6 w-px bg-indigo-100" />
        <div className="space-y-4">
          {roadmapWeeks.map((item, i) => {
            const s = statusMap[item.status as keyof typeof statusMap];
            const Icon = s.Icon;
            return (
              <div key={i} className="relative flex gap-4 pl-14">
                <div className="absolute left-4 top-5 w-[18px] h-[18px] rounded-full flex items-center justify-center border-[3px] border-white z-10" style={{ background: s.dot }}>
                  <div className="w-[6px] h-[6px] rounded-full bg-white" />
                </div>
                <Card className={`flex-1 p-5 transition-all hover:shadow-md ${item.status === "in-progress" ? "border-indigo-200 shadow-lg shadow-indigo-50" : ""}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[11px] font-bold text-gray-400 mb-0.5">{item.week}</div>
                      <h3 className="text-base font-extrabold text-gray-900">{item.title}</h3>
                    </div>
                    <Badge color={s.badge as any}><Icon className="w-3 h-3 mr-0.5" />{s.label}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.tasks.map(t => (
                      <span key={t} className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-xl font-medium border ${item.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : item.status === "in-progress" ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
                        {item.status === "completed" && <Check className="w-2.5 h-2.5" />}{t}
                      </span>
                    ))}
                  </div>
                  {item.status === "in-progress" && (
                    <div className="mt-4 pt-3 border-t border-indigo-100">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs text-gray-400">Week progress</span>
                        <span className="text-xs font-bold text-indigo-600">{item.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-indigo-500" style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── AI Interview ─────────────────────────────────────────────────────────────

const AI_REPLIES = [
  "Great answer! You explained the time-space tradeoff well. Next: How would you design a URL shortening service like bit.ly? Think about scale — 10M URLs/day.",
  "Solid system design thinking. How would you handle cache invalidation and ensure consistency across distributed nodes?",
  "Nice! Now a behavioral one: Tell me about a time you disagreed with a teammate on a technical decision. How did you resolve it?",
  "Great use of the STAR method. Final question: What's your biggest technical weakness right now, and what are you actively doing about it?",
];

function InterviewPage() {
  const [msgs, setMsgs] = useState([
    { role: "ai", text: "Hi Arjun! I'm your AI interviewer for today's technical + behavioral round for Google SWE Intern. Ready to begin? 🚀" },
    { role: "user", text: "Yes, let's go! I'm ready." },
    { role: "ai", text: "Perfect! Let's start with a classic: Explain the difference between BFS and DFS, and when would you choose each?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const send = () => {
    if (!input.trim()) return;
    setMsgs(m => [...m, { role: "user", text: input }]);
    setInput(""); setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { role: "ai", text: AI_REPLIES[Math.floor(Math.random() * AI_REPLIES.length)] }]);
    }, 1600);
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const liveScores = [
    { l: "Confidence", v: 78, c: "#6366f1" },
    { l: "Communication", v: 85, c: "#8b5cf6" },
    { l: "Technical Depth", v: 72, c: "#06b6d4" },
    { l: "Body Language", v: 65, c: "#f59e0b" },
  ];

  return (
    <div className="max-w-6xl mx-auto" style={{ height: "calc(100vh - 7rem)" }}>
      <div className="grid lg:grid-cols-[1fr_300px] gap-4 h-full">
        <Card className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-3 p-4 border-b border-gray-100 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold text-gray-900">AI Interviewer — Google SWE Intern</div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] text-gray-400">Live session · 12:34 elapsed</span>
              </div>
            </div>
            <div className="flex gap-1.5">
              {[Camera, Mic].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Icon className="w-4 h-4 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${m.role === "ai" ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "bg-gray-200 text-gray-600"}`}>
                  {m.role === "ai" ? <Bot className="w-3.5 h-3.5" /> : "AM"}
                </div>
                <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "ai" ? "bg-gray-50 text-gray-700 rounded-tl-sm" : "text-white rounded-tr-sm"}`}
                  style={m.role === "user" ? { background: "linear-gradient(135deg,#6366f1,#8b5cf6)" } : {}}>
                  {m.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="bg-gray-50 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map(i => <div key={i} className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="p-4 border-t border-gray-100 flex-shrink-0">
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center hover:bg-indigo-100 transition-colors flex-shrink-0">
                <Mic className="w-4 h-4 text-indigo-500" />
              </button>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Type your answer or press mic to speak..."
                className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-300 focus:bg-white transition-all" />
              <button onClick={send} className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 hover:opacity-90 transition-opacity" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </Card>
        <div className="space-y-4 overflow-auto">
          <Card className="overflow-hidden">
            <div className="aspect-video bg-gray-900 flex items-center justify-center">
              <div className="text-center">
                <Camera className="w-7 h-7 text-gray-600 mx-auto mb-2" />
                <p className="text-xs text-gray-500 mb-2">Camera off</p>
                <button className="text-xs text-indigo-400 border border-indigo-800 px-3 py-1 rounded-lg hover:bg-indigo-900/50 transition-colors">Enable</button>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Live Evaluation</h3>
            <div className="space-y-3">
              {liveScores.map(s => (
                <div key={s.l}>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs font-medium text-gray-500">{s.l}</span>
                    <span className="text-xs font-bold" style={{ color: s.c }}>{s.v}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${s.v}%`, background: s.c }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-center">
              <div className="text-2xl font-extrabold text-gray-900">75<span className="text-base font-normal text-gray-400">/100</span></div>
              <div className="text-xs text-gray-400">Overall Score</div>
            </div>
          </Card>
          <Card className="p-4" style={{ background: "linear-gradient(135deg,#fafafe,#f0f0fe)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-gray-900">Live Tips</h3>
            </div>
            <ul className="space-y-2">
              {["Slow down — you're rushing the explanation", "Mention Big-O complexity for algorithms", "Use STAR method for behavioral answers"].map(t => (
                <li key={t} className="flex items-start gap-2 text-xs text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />{t}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Skill Gap ────────────────────────────────────────────────────────────────

function SkillGapPage() {
  const skills = [
    { name: "React", current: 75, target: 95, time: "3 wks", diff: "Easy", status: "learning" },
    { name: "TypeScript", current: 70, target: 90, time: "2 wks", diff: "Easy", status: "learning" },
    { name: "Node.js / Express", current: 60, target: 85, time: "4 wks", diff: "Medium", status: "gap" },
    { name: "System Design", current: 40, target: 80, time: "6 wks", diff: "Hard", status: "gap" },
    { name: "Docker", current: 20, target: 75, time: "3 wks", diff: "Medium", status: "gap" },
    { name: "Google Cloud (GCP)", current: 15, target: 70, time: "4 wks", diff: "Hard", status: "new" },
    { name: "Python (DSA)", current: 65, target: 90, time: "3 wks", diff: "Medium", status: "learning" },
    { name: "Kubernetes", current: 0, target: 60, time: "4 wks", diff: "Hard", status: "new" },
  ];
  const statusMap: Record<string, { badge: string; label: string }> = {
    learning: { badge: "indigo", label: "Learning" },
    gap: { badge: "amber", label: "Gap" },
    new: { badge: "red", label: "New" },
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Skill Gap Analysis</h1>
        <p className="text-sm text-gray-400 mt-1">Based on target: Software Development Engineer Intern @ Google</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { l: "Matched", v: "8/22", c: "#10b981", bg: "#ecfdf5", icon: CheckCircle },
          { l: "In Progress", v: "3", c: "#6366f1", bg: "#eef2ff", icon: Activity },
          { l: "To Learn", v: "11", c: "#f59e0b", bg: "#fffbeb", icon: Target },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.l} className="p-4 flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <Icon className="w-5 h-5" style={{ color: s.c }} />
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900">{s.v}</div>
                <div className="text-xs text-gray-400">{s.l}</div>
              </div>
            </Card>
          );
        })}
      </div>
      <Card className="p-5">
        <h3 className="text-sm font-bold text-gray-900 mb-4">Current vs Target Proficiency</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={skillProgress} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f0f9" vertical={false} />
            <XAxis dataKey="skill" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e0e7ff", fontSize: 12 }} />
            <Bar dataKey="current" name="Current %" fill="#6366f1" radius={[6, 6, 0, 0]} />
            <Bar dataKey="target" name="Target %" fill="#ede9fe" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-900">All Skills</h3>
          <div className="flex gap-2">
            {["All", "Gap", "Learning", "New"].map(f => (
              <button key={f} className="text-xs px-3 py-1 rounded-lg border border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-600 transition-colors">{f}</button>
            ))}
          </div>
        </div>
        <div className="space-y-3">
          {skills.map(s => {
            const sc = statusMap[s.status];
            const gap = s.target - s.current;
            return (
              <div key={s.name} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-36 flex-shrink-0">
                  <div className="text-sm font-semibold text-gray-800 mb-0.5">{s.name}</div>
                  <Badge color={sc.badge as any}>{sc.label}</Badge>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-gray-400 w-14">{s.current}% now</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full relative overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-indigo-200 rounded-full" style={{ width: `${s.target}%` }} />
                      <div className="absolute inset-y-0 left-0 bg-indigo-600 rounded-full" style={{ width: `${s.current}%` }} />
                    </div>
                    <span className="text-[10px] text-gray-400 w-16 text-right">target {s.target}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge color={s.diff === "Easy" ? "emerald" : s.diff === "Medium" ? "amber" : "red"}>{s.diff}</Badge>
                  <span className="text-xs text-gray-400 w-12 text-right">{s.time}</span>
                  <span className="text-[11px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-lg">−{gap}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── Cover Letter ─────────────────────────────────────────────────────────────

const GENERATED_LETTER = `Dear Hiring Manager,

I am writing to express my strong interest in the Software Development Engineer Intern position at Google. As a Computer Science student at IIT Bombay with a deep passion for building scalable, high-impact software, I am excited about the opportunity to contribute to Google's mission of organizing the world's information.

During my academic journey I have developed strong foundations in data structures, algorithms, and full-stack development. My recent project — a real-time collaborative code editor built with React and WebSockets — served over 1,200 daily users and reduced collaboration overhead by 60%, demonstrating my ability to design and ship production-ready systems under constraints.

I am particularly drawn to Google's culture of technical excellence and its emphasis on solving problems at planetary scale. My experience building REST APIs with Node.js, deploying containerized services on cloud infrastructure, and contributing to open-source projects aligns closely with the technical requirements of this role.

I would welcome the opportunity to discuss how my background, passion, and skills align with Google's goals. Thank you sincerely for your time and consideration.

Warm regards,
Arjun Mehta
arjun.mehta@iitb.ac.in · github.com/arjunmehta · +91 98765 43210`;

function CoverLetterPage() {
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Software Development Engineer Intern");
  const [tone, setTone] = useState("Professional");
  const [generated, setGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = () => { setLoading(true); setTimeout(() => { setLoading(false); setGenerated(true); }, 1200); };
  const copy = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">Cover Letter Generator</h1>
        <p className="text-sm text-gray-400 mt-1">AI-crafted, personalized cover letters in seconds.</p>
      </div>
      <div className="grid lg:grid-cols-[340px_1fr] gap-5">
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-sm font-bold text-gray-900 mb-4">Job Details</h3>
            <div className="space-y-3">
              {[{ label: "Company", value: company, set: setCompany, placeholder: "Google" }, { label: "Role", value: role, set: setRole, placeholder: "SWE Intern" }].map(f => (
                <div key={f.label}>
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">{f.label}</label>
                  <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-400 focus:bg-white transition-all" />
                </div>
              ))}
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Tone</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Professional", "Enthusiastic", "Concise"].map(t => (
                    <button key={t} onClick={() => setTone(t)} className={`py-2 rounded-xl text-xs font-semibold border transition-all ${tone === t ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block">Key Skills to Highlight</label>
                <textarea className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none resize-none h-20 focus:border-indigo-400 focus:bg-white transition-all" defaultValue="React, Node.js, System Design, DSA" />
              </div>
            </div>
            <Btn onClick={generate} className="w-full justify-center mt-4 flex items-center gap-2">
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Generating..." : "Generate Letter"}
            </Btn>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-bold text-gray-900 mb-2">Resume Summary Used</h3>
            <p className="text-xs text-gray-400 leading-relaxed">CS @ IIT Bombay · React, Node.js, Python · Collaborative code editor (1,200+ users) · 2 internships · strong DSA background</p>
          </Card>
        </div>
        <Card className="flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <PenTool className="w-4 h-4 text-indigo-500" />
              <h3 className="text-sm font-bold text-gray-900">{generated ? `Cover Letter — ${role} @ ${company}` : "Generated Preview"}</h3>
              {generated && <Badge color="emerald">Ready</Badge>}
            </div>
            {generated && (
              <div className="flex gap-2">
                <button onClick={copy} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:border-indigo-300 hover:text-indigo-600 transition-all">
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}{copied ? "Copied!" : "Copy"}
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700 transition-all">
                  <Download className="w-3.5 h-3.5" /> Download PDF
                </button>
              </div>
            )}
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {!generated ? (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <PenTool className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-300">Fill in the details and click Generate</p>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl">
                <div className="mb-6 pb-5 border-b border-gray-100">
                  <div className="text-base font-extrabold text-gray-900">Arjun Mehta</div>
                  <div className="text-xs text-gray-400 mt-0.5">arjun.mehta@iitb.ac.in · github.com/arjunmehta · +91 98765 43210</div>
                </div>
                <p className="text-xs text-gray-400 mb-4">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
                <div className="text-sm text-gray-600 leading-[2] whitespace-pre-line">{GENERATED_LETTER}</div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Profile ──────────────────────────────────────────────────────────────────

function ProfilePage() {
  const badges = [
    { icon: Trophy, l: "Top 5%", c: "#f59e0b", bg: "#fffbeb" },
    { icon: Flame, l: "10-Day Streak", c: "#ef4444", bg: "#fef2f2" },
    { icon: Award, l: "ATS Master", c: "#6366f1", bg: "#eef2ff" },
    { icon: Star, l: "Interview Ace", c: "#8b5cf6", bg: "#f5f3ff" },
    { icon: Target, l: "Job Matcher", c: "#06b6d4", bg: "#ecfeff" },
    { icon: Zap, l: "Fast Learner", c: "#10b981", bg: "#ecfdf5" },
  ];
  const resumes = [
    { name: "Arjun_Mehta_Resume_v3.pdf", score: 87, date: "Today", active: true },
    { name: "Arjun_Mehta_Resume_v2.pdf", score: 72, date: "3 days ago", active: false },
    { name: "Arjun_Mehta_Resume_v1.pdf", score: 58, date: "1 week ago", active: false },
  ];
  const leaderboard = [
    { rank: 1, name: "Priya Sharma", score: 96, you: false },
    { rank: 2, name: "Kiran Joshi", score: 94, you: false },
    { rank: 3, name: "Divya Nair", score: 92, you: false },
    { rank: 7, name: "Arjun Mehta (You)", score: 87, you: true },
  ];
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <Card className="overflow-hidden">
        <div className="h-28" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)" }} />
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl border-4 border-white flex items-center justify-center text-2xl font-extrabold text-white shadow-lg" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>AM</div>
            <Btn variant="outline"><Edit2 className="inline w-3.5 h-3.5 mr-1.5" />Edit Profile</Btn>
          </div>
          <h2 className="text-xl font-extrabold text-gray-900">Arjun Mehta</h2>
          <p className="text-sm text-gray-400">Computer Science · IIT Bombay · Class of 2026</p>
          <p className="text-sm text-gray-500 mt-2 max-w-lg leading-relaxed">Passionate about building scalable systems and solving complex problems. Targeting SWE Intern roles at top-tier tech companies for Summer 2025.</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {["React", "Node.js", "Python", "TypeScript", "DSA", "System Design"].map(s => (
              <span key={s} className="text-xs px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-xl border border-indigo-100 font-medium">{s}</span>
            ))}
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { l: "Resume Score", v: "87%", icon: FileText, c: "#6366f1" },
          { l: "Mock Interviews", v: "14", icon: MessageSquare, c: "#8b5cf6" },
          { l: "Applications", v: "12", icon: Briefcase, c: "#06b6d4" },
          { l: "Day Streak", v: "10 🔥", icon: Flame, c: "#ef4444" },
        ].map(s => {
          const Icon = s.icon;
          return (
            <Card key={s.l} className="p-4 text-center">
              <Icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.c }} />
              <div className="text-2xl font-extrabold text-gray-900">{s.v}</div>
              <div className="text-xs text-gray-400">{s.l}</div>
            </Card>
          );
        })}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Achievements & Badges</h3>
          <div className="grid grid-cols-3 gap-3">
            {badges.map(b => {
              const Icon = b.icon;
              return (
                <div key={b.l} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-gray-50 hover:bg-indigo-50/50 transition-colors cursor-pointer group">
                  <div className="w-11 h-11 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-150" style={{ background: b.bg }}>
                    <Icon className="w-5 h-5" style={{ color: b.c }} />
                  </div>
                  <span className="text-[10px] font-semibold text-gray-400 text-center leading-tight">{b.l}</span>
                </div>
              );
            })}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-gray-900">Resume History</h3>
            <button className="text-xs text-indigo-600 hover:underline font-semibold">+ Upload New</button>
          </div>
          <div className="space-y-2.5">
            {resumes.map(r => (
              <div key={r.name} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${r.active ? "border-indigo-200 bg-indigo-50/50" : "border-gray-100 hover:bg-gray-50"}`}>
                <div className="w-9 h-11 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-4 h-4 text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-gray-900 truncate">{r.name}</div>
                  <div className="text-[10px] text-gray-400">{r.date}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-sm font-bold" style={{ color: r.score >= 80 ? "#10b981" : r.score >= 65 ? "#f59e0b" : "#ef4444" }}>{r.score}%</span>
                  {r.active && <Badge color="emerald">Active</Badge>}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h3 className="text-sm font-bold text-gray-900">IIT Bombay Leaderboard</h3>
          <Badge color="amber">Top 5%</Badge>
        </div>
        <div className="space-y-2">
          {leaderboard.map(u => (
            <div key={u.rank} className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${u.you ? "bg-indigo-50 border border-indigo-200" : "hover:bg-gray-50"}`}>
              <span className={`w-5 text-xs font-extrabold text-center ${u.rank <= 3 ? "text-amber-500" : "text-gray-400"}`}>{u.rank}</span>
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0" style={{ background: u.you ? "linear-gradient(135deg,#6366f1,#8b5cf6)" : "linear-gradient(135deg,#9ca3af,#6b7280)" }}>
                {u.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
              </div>
              <span className={`text-sm flex-1 ${u.you ? "font-bold text-indigo-700" : "font-medium text-gray-700"}`}>{u.name}</span>
              <span className="text-sm font-extrabold text-gray-900">{u.score}%</span>
              {u.rank <= 3 && <span>{medals[u.rank - 1]}</span>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("landing");

  const navigate = useCallback((p: Page) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const APP_PAGES: Page[] = ["dashboard", "resume-upload", "resume-analysis", "job-match", "roadmap", "interview", "skill-gap", "cover-letter", "profile"];

  if (page === "landing")    return <LandingPage navigate={navigate} />;
  if (page === "login")      return <AuthPage mode="login" navigate={navigate} />;
  if (page === "signup")     return <AuthPage mode="signup" navigate={navigate} />;
  if (page === "forgot")     return <AuthPage mode="forgot" navigate={navigate} />;
  if (page === "onboarding") return <OnboardingPage navigate={navigate} />;
  if (APP_PAGES.includes(page)) return <AppLayout page={page} navigate={navigate} />;
  return <LandingPage navigate={navigate} />;
}
