"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  MapPin,
  Mail,
  Twitter,
  Linkedin,
  Github,
  ArrowRight,
  Heart,
  Globe,
  Users,
  Zap,
  Star,
  TrendingUp,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "@/contexts/ThemeContext";
import { ThemeToggleButton } from "@/components/ThemeToggleButton";

const navItems = [
  { name: "Home", href: "#home", external: false },
  { name: "Features", href: "#features", external: false },
  { name: "Testimonials", href: "#testimonials", external: false },
  { name: "Post Job", href: "/auth/signup", external: true },
];

const features = [
  {
    icon: "🔍",
    title: "Auto-match LinkedIn candidates",
    description:
      "Our AI automatically scans and matches relevant LinkedIn profiles based on your job requirements. No manual searching required.",
    border: "emerald",
  },
  {
    icon: "📬",
    title: "Instantly see top profiles",
    description:
      "Get the most relevant candidates delivered instantly. We prioritize quality over quantity with our matching system.",
    border: "teal",
  },
  {
    icon: "🇮🇳",
    title: "Focused on Indian tech talent",
    description:
      "Specialized in connecting you with India's top developers, designers, and tech professionals. Quality talent, competitive rates.",
    border: "cyan",
  },
  {
    icon: "🧠",
    title: "AI-powered skill extraction",
    description:
      "Advanced AI extracts and matches technical skills, experience levels, and specializations from job descriptions automatically.",
    border: "emerald",
  },
  {
    icon: "📊",
    title: "Clean & powerful job dashboard",
    description:
      "Manage all your job postings and candidate matches in one intuitive dashboard. Track applications and responses effortlessly.",
    border: "teal",
  },
  {
    icon: "🛠",
    title: "Built by developers, for developers",
    description:
      "Created by engineers who understand the hiring process. We know what matters and built the tool we wished existed.",
    border: "cyan",
  },
];

const testimonials = [
  {
    quote: "We hired a frontend dev in 48 hours!",
    text: "The AI matching was spot-on. Instead of spending weeks browsing profiles, we found our perfect React developer in just 2 days. Game changer for our startup!",
    initial: "A",
    name: "Arjun Patel",
    role: "CTO",
    company: "TechStart Mumbai",
    color: "emerald",
  },
  {
    quote: "No more endless scrolling on LinkedIn.",
    text: "Finally, a platform that understands what we actually need. The top 5 candidates were all interview-ready. Saved us countless hours of manual searching.",
    initial: "P",
    name: "Priya Sharma",
    role: "Head of Engineering",
    company: "FinTech Solutions",
    color: "teal",
  },
  {
    quote: "The quality of candidates was unbelievable.",
    text: "We've tried every job board out there, but this one stood out. Every candidate we interviewed was highly relevant and technically solid.",
    initial: "M",
    name: "Meera Iyer",
    role: "Talent Lead",
    company: "CodeCraft Bengaluru",
    color: "emerald",
  },
  {
    quote: "Our hiring pipeline just got 10x faster.",
    text: "We reduced our average hiring time from 3 weeks to 4 days. That's not just faster — it's smarter hiring. Highly recommended for early-stage teams.",
    initial: "R",
    name: "Rohit Malhotra",
    role: "Founder",
    company: "QuickHire Delhi",
    color: "teal",
  },
  {
    quote: "It felt like magic — but it was data.",
    text: "The system recommended people who fit not just our skills requirement but also our company vibe. We've hired two amazing backend devs already!",
    initial: "S",
    name: "Sneha Verma",
    role: "HR Manager",
    company: "NextGen Gurugram",
    color: "teal",
  },
];

const footerLinks = {
  product: [
    { name: "Post a Job", href: "/auth/signup" },
    { name: "Browse Candidates", href: "#" },
    { name: "Dashboard", href: "#" },
    { name: "Analytics", href: "#" },
    { name: "Pricing", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Our Story", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Blog", href: "#" },
  ],
  resources: [
    { name: "Help Center", href: "#" },
    { name: "API Docs", href: "#" },
    { name: "Hiring Guide", href: "#" },
    { name: "Success Stories", href: "#" },
    { name: "Webinars", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR", href: "#" },
    { name: "Security", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", color: "hover:text-blue-400" },
  { icon: Linkedin, href: "#", color: "hover:text-blue-600" },
  { icon: Github, href: "#", color: "hover:text-gray-400" },
];

const stats = [
  { icon: Users, value: "10K+", label: "Active Candidates" },
  { icon: Zap, value: "500+", label: "Companies Hiring" },
  { icon: Globe, value: "50+", label: "Cities Covered" },
];

export default function HomePage() {
  const { isDark, getThemeClasses, getAnimatedBg } = useTheme();
  const theme = getThemeClasses;

  return (
    <div
      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${isDark ? "bg-black" : "bg-white"}`}>
      {/* Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getAnimatedBg().map((className, index) => (
          <div key={index} className={className}></div>
        ))}
        <div className="absolute inset-0 bg-grid"></div>
      </div>

      {/* Navigation Section */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl bg-white/70 dark:bg-black/70 border-slate-200/60 dark:border-white/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-glow transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-display font-semibold tracking-tight ${theme.text.primary}`}>
                Opportune
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1 p-1 rounded-full border border-slate-200/60 dark:border-white/10 bg-white/40 dark:bg-white/[0.03] backdrop-blur-sm">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isDark
                      ? "text-slate-300 hover:text-white hover:bg-white/10"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/auth/signup"
                className="btn-shine hidden sm:inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold text-white bg-gradient-to-br from-emerald-500 to-teal-600 shadow-glow transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
              >
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 pt-36 sm:pt-44 pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-sm bg-white/50 dark:bg-white/[0.04] border-emerald-500/30 animate-fade-up shadow-soft">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="eyebrow text-emerald-700 dark:text-emerald-300">
                AI-Powered Talent Matching
              </span>
            </div>

            <div className="space-y-6">
              <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.05] animate-fade-up [animation-delay:80ms] ${theme.text.primary}`}>
                Find the perfect
                <br />
                <span className="text-gradient">Indian tech talent</span>
                <br />
                in minutes, not weeks
              </h1>

              <p className={`text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto animate-fade-up [animation-delay:160ms] ${theme.text.secondary}`}>
                Automatically match LinkedIn candidates with your job requirements.
                No more endless scrolling. Just quality matches, delivered instantly.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4 animate-fade-up [animation-delay:240ms]">
              <Link href="/auth/signup">
                <button className="btn-shine group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-glow hover:-translate-y-1 active:scale-95 flex items-center gap-2 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  <span>Post a Job</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-16 pt-14 animate-fade-up [animation-delay:320ms]">
              {[
                { label: "Active Candidates", value: "10K+", icon: Users },
                { label: "Companies Hiring", value: "500+", icon: TrendingUp },
                { label: "Avg. Match Time", value: "< 2 min", icon: Clock },
              ].map(({ label, value, icon: Icon }, idx) => (
                <div key={idx} className="group flex flex-col items-center gap-2">
                  <div className={`p-3 rounded-2xl transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-glow ${
                    isDark ? "bg-white/5 border border-white/10" : "bg-white border border-slate-200 shadow-soft"
                  }`}>
                    <Icon className={`w-6 h-6 ${theme.accent.emerald}`} />
                  </div>
                  <div className={`text-3xl font-display font-semibold ${theme.text.primary}`}>
                    {value}
                  </div>
                  <div className={`text-xs font-mono uppercase tracking-widest ${theme.text.muted}`}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-sm bg-white/50 dark:bg-white/[0.04] border-emerald-500/30 mb-6 shadow-soft">
              <Users className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="eyebrow text-emerald-700 dark:text-emerald-300">
                Why employers love us
              </span>
            </div>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 ${theme.text.primary}`}>
              Everything you need to find{" "}
              <span className="text-gradient">top Indian talent</span>
            </h2>
            <p className={`text-lg sm:text-xl ${theme.text.secondary}`}>
              Skip the endless browsing. Our AI does the heavy lifting so you can focus on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map(({ icon, title, description }, index) => (
              <div
                key={index}
                className={`hover-lift group relative p-8 rounded-3xl border overflow-hidden ${
                  isDark
                    ? "bg-white/[0.03] border-white/10 hover:border-emerald-500/40"
                    : "bg-white/70 border-slate-200/80 hover:border-emerald-300/70"
                }`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-emerald-500/[0.06] to-transparent pointer-events-none" />
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-emerald-500 to-teal-600 shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                    <div className="text-white text-2xl">{icon}</div>
                  </div>
                  <h3 className={`text-xl font-display font-semibold mb-3 ${theme.text.primary}`}>
                    {title}
                  </h3>
                  <p className={`${theme.text.secondary} leading-relaxed`}>{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`relative max-w-4xl mx-auto text-center p-12 sm:p-16 rounded-[2rem] border overflow-hidden ${
            isDark
              ? "bg-gradient-to-br from-white/[0.06] to-white/[0.02] border-white/10"
              : "bg-gradient-to-br from-emerald-50 to-teal-50/60 border-emerald-200/60"
          } shadow-elevated`}>
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
            <div className="relative">
              <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 ${theme.text.primary}`}>
                Ready to find your next{" "}
                <span className="text-gradient">tech hire?</span>
              </h2>
              <p className={`text-lg sm:text-xl mb-8 ${theme.text.secondary}`}>
                Join 500+ companies already using Opportune to find top Indian tech talent
              </p>
              <Link href="/auth/signup">
                <button className="btn-shine group px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-glow hover:-translate-y-1 active:scale-95 flex items-center gap-2 mx-auto bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                  <span>Post a Job Now</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-sm bg-white/50 dark:bg-white/[0.04] border-emerald-500/30 mb-6 shadow-soft">
              <Star className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span className="eyebrow text-emerald-700 dark:text-emerald-300">
                Success stories
              </span>
            </div>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-semibold mb-6 ${theme.text.primary}`}>
              Trusted by hiring managers{" "}
              <span className="text-gradient">across India</span>
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <Carousel opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {testimonials.map((item, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <div
                      className={`hover-lift group h-full p-8 rounded-3xl border ${
                        isDark
                          ? "bg-white/[0.03] border-white/10 hover:border-emerald-500/40"
                          : "bg-white/70 border-slate-200/80 hover:border-emerald-300/70"
                      }`}
                    >
                      <div className="text-5xl font-display leading-none text-emerald-500/30 mb-2">&ldquo;</div>
                      <div className={`text-xl font-display font-semibold mb-4 leading-snug ${theme.text.primary}`}>
                        {item.quote}
                      </div>
                      <p className={`${theme.text.secondary} leading-relaxed mb-6`}>
                        {item.text}
                      </p>
                      <div className="flex items-center gap-4 pt-4 border-t border-slate-200/60 dark:border-white/10">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 flex-shrink-0 shadow-glow">
                          <span className="text-white font-semibold">
                            {item.initial}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold ${theme.text.primary}`}>
                            {item.name}
                          </div>
                          <div className={`text-xs font-mono uppercase tracking-wider ${theme.text.muted}`}>
                            {item.role}, {item.company}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="flex justify-center mt-8 gap-4">
                <CarouselPrevious className={`hover:scale-110 transition-transform ${
                  isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                }`} />
                <CarouselNext className={`hover:scale-110 transition-transform ${
                  isDark ? "bg-white/5 border-white/10" : "bg-white border-slate-200"
                }`} />
              </div>
            </Carousel>
          </div>

          {/* Stats Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-3xl border ${
              isDark
                ? "bg-white/[0.03] border-white/10"
                : "bg-white/70 border-slate-200/80"
            } shadow-soft`}>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group text-center"
                >
                  <div className={`inline-flex p-3 rounded-2xl mb-4 transition-all duration-300 group-hover:-translate-y-1 ${
                    isDark ? "bg-emerald-500/15" : "bg-emerald-100"
                  }`}>
                    <stat.icon className={`w-6 h-6 ${theme.accent.emerald}`} />
                  </div>
                  <div className={`text-3xl font-display font-semibold mb-2 ${theme.text.primary}`}>
                    {stat.value}
                  </div>
                  <div className={`text-xs font-mono uppercase tracking-widest ${theme.text.muted}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 border-t border-slate-200/70 dark:border-white/10">

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-1.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-glow">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-display font-semibold ${theme.text.primary}`}>
                  Opportune
                </span>
              </div>
              <p className={`mb-6 max-w-sm ${theme.text.secondary}`}>
                Connecting Indian tech talent with global opportunities through AI-powered matching.
              </p>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2.5 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:text-emerald-500 ${
                      isDark
                        ? "bg-white/5 text-slate-300 hover:bg-white/10"
                        : "bg-slate-100 text-slate-600 hover:bg-white shadow-soft"
                    }`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 md:col-span-2">
              {Object.entries(footerLinks).slice(0, 2).map(([category, links]) => (
                <div key={category}>
                  <h4 className={`eyebrow mb-4 ${theme.text.muted}`}>
                    {category}
                  </h4>
                  <ul className="space-y-2.5">
                    {links.slice(0, 4).map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className={`text-sm transition-colors duration-200 hover:text-emerald-500 ${theme.text.secondary}`}
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className={`border-t pt-8 ${
            isDark ? "border-white/10" : "border-slate-200"
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className={`flex items-center gap-2 text-sm ${theme.text.muted}`}>
                <span>© 2025 Opportune. Made with</span>
                <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-glow" />
                <span>in India</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <a href="#" className={`transition-colors hover:text-emerald-500 ${theme.text.muted}`}>Privacy</a>
                <span className={isDark ? "text-slate-700" : "text-slate-300"}>•</span>
                <a href="#" className={`transition-colors hover:text-emerald-500 ${theme.text.muted}`}>Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
