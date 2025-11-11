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
  Sparkles,
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

  const triggerClasses = isDark
    ? "bg-transparent hover:bg-white/10 hover:text-white focus:bg-white/10 focus:text-white data-[active]:bg-white/10 data-[state=open]:bg-white/10 h-10 px-3 sm:px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full border-0 cursor-pointer backdrop-blur-sm text-slate-300"
    : "bg-transparent hover:bg-white/90 hover:text-slate-900 focus:bg-white/90 focus:text-slate-900 data-[active]:bg-white/80 data-[state=open]:bg-white/80 h-10 px-3 sm:px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full border-0 cursor-pointer backdrop-blur-sm text-slate-700";

  return (
    <div
      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${isDark ? "bg-slate-950" : "bg-white"}`}>
      {/* Subtle Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {getAnimatedBg().map((className, index) => (
          <div key={index} className={className}></div>
        ))}
        {/* Grid Pattern */}
        <div className={`absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] ${isDark ? "opacity-20" : "opacity-40"}`}></div>
      </div>

      {/* Navigation Section */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-xl bg-white/80 dark:bg-slate-950/80 border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${theme.text.primary}`}>
                Opportune
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isDark
                      ? "text-slate-300 hover:text-white hover:bg-slate-800"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href="/auth/signup"
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isDark
                    ? "bg-white text-slate-900 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Get Started
              </Link>
              <ThemeToggleButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 pt-32 sm:pt-40 pb-20">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                AI-Powered Talent Matching
              </span>
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight ${theme.text.primary}`}>
                Find the perfect
                <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Indian tech talent
                </span>
                <br />
                in minutes, not weeks
              </h1>

              <p className={`text-xl sm:text-2xl leading-relaxed max-w-2xl mx-auto font-light ${theme.text.secondary}`}>
                Automatically match LinkedIn candidates with your job requirements. 
                No more endless scrolling. Just quality matches, delivered instantly.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link href="/auth/signup">
                <button className={`group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white`}>
                  <span>Post a Job</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <button className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 border-2 ${
                isDark 
                  ? "border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white hover:bg-slate-800/50"
                  : "border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900 hover:bg-slate-50"
              }`}>
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 sm:gap-12 pt-12">
              {[
                { label: "Active Candidates", value: "10K+", icon: Users },
                { label: "Companies Hiring", value: "500+", icon: TrendingUp },
                { label: "Avg. Match Time", value: "< 2 min", icon: Clock },
              ].map(({ label, value, icon: Icon }, idx) => (
                <div key={idx} className="flex flex-col items-center space-y-2">
                  <div className={`p-3 rounded-xl ${
                    isDark ? "bg-slate-800/50" : "bg-slate-100"
                  }`}>
                    <Icon className={`w-6 h-6 ${theme.accent.emerald}`} />
                  </div>
                  <div className={`text-3xl font-bold ${theme.text.primary}`}>
                    {value}
                  </div>
                  <div className={`text-sm font-medium ${theme.text.muted}`}>
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
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-800 mb-6">
              <Users className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                WHY EMPLOYERS LOVE US
              </span>
            </div>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${theme.text.primary}`}>
              Everything you need to find
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                top Indian talent
              </span>
            </h2>
            <p className={`text-lg sm:text-xl ${theme.text.secondary}`}>
              Skip the endless browsing. Our AI does the heavy lifting so you can focus on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {features.map(({ icon, title, description, border }, index) => (
              <div
                key={index}
                className={`group p-8 rounded-2xl border transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
                  isDark
                    ? "bg-slate-900/50 border-slate-800 hover:border-emerald-500/50"
                    : "bg-white/50 border-slate-200 hover:border-emerald-200"
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br from-emerald-500 to-teal-500`}>
                  <div className="text-white text-2xl">{icon}</div>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${theme.text.primary}`}>
                  {title}
                </h3>
                <p className={`${theme.text.secondary} leading-relaxed`}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className={`max-w-4xl mx-auto text-center p-12 sm:p-16 rounded-3xl border ${
            isDark 
              ? "bg-slate-900/50 border-slate-800" 
              : "bg-slate-50 border-slate-200"
          }`}>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${theme.text.primary}`}>
              Ready to find your next
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                tech hire?
              </span>
            </h2>
            <p className={`text-lg sm:text-xl mb-8 ${theme.text.secondary}`}>
              Join 500+ companies already using Opportune to find top Indian tech talent
            </p>
            <Link href="/auth/signup">
              <button className={`group px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center space-x-2 mx-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white`}>
                <span>Post a Job Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
        </div>
      </section>


      {/* Testimonials Section */}
      <section id="testimonials" className="relative z-10 py-24 sm:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-800 mb-6">
              <Star className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                SUCCESS STORIES
              </span>
            </div>
            <h2 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 ${theme.text.primary}`}>
              Trusted by hiring managers
              <br />
              <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                across India
              </span>
            </h2>
          </div>

          <div className="max-w-6xl mx-auto">
            <Carousel opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {testimonials.map((item, index) => (
                  <CarouselItem key={index} className="md:basis-1/2">
                    <div
                      className={`group p-8 rounded-2xl border transition-all duration-200 hover:shadow-xl hover:scale-[1.02] ${
                        isDark
                          ? "bg-slate-900/50 border-slate-800 hover:border-emerald-500/50"
                          : "bg-white/50 border-slate-200 hover:border-emerald-200"
                      }`}
                    >
                      <div className="flex items-start space-x-4 mb-6">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 flex-shrink-0">
                          <span className="text-white font-bold text-lg">
                            {item.initial}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className={`font-semibold text-lg mb-1 ${theme.text.primary}`}>
                            {item.name}
                          </div>
                          <div className={`text-sm ${theme.text.muted}`}>
                            {item.role}, {item.company}
                          </div>
                        </div>
                      </div>
                      <div className={`text-xl font-bold mb-4 ${theme.text.primary}`}>
                        "{item.quote}"
                      </div>
                      <p className={`${theme.text.secondary} leading-relaxed`}>
                        {item.text}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="flex justify-center mt-8 gap-4">
                <CarouselPrevious className={`${
                  isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                }`} />
                <CarouselNext className={`${
                  isDark ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"
                }`} />
              </div>
            </Carousel>
          </div>

          {/* Stats Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 p-8 rounded-2xl border ${
              isDark 
                ? "bg-slate-900/50 border-slate-800" 
                : "bg-slate-50 border-slate-200"
            }`}>
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center"
                >
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    isDark ? "bg-emerald-600/20" : "bg-emerald-100"
                  }`}>
                    <stat.icon className={`w-6 h-6 ${theme.accent.emerald}`} />
                  </div>
                  <div className={`text-3xl font-bold mb-2 ${theme.text.primary}`}>
                    {stat.value}
                  </div>
                  <div className={`text-sm font-medium ${theme.text.muted}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800">
        {/* Newsletter Section */}
        <div className="container mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border backdrop-blur-sm bg-white/50 dark:bg-slate-900/50 border-emerald-200 dark:border-emerald-800 mb-6">
              <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                STAY UPDATED
              </span>
            </div>

            <h3 className={`text-3xl sm:text-4xl font-bold mb-4 ${theme.text.primary}`}>
              Get the latest hiring insights
            </h3>

            <p className={`text-lg mb-8 ${theme.text.secondary}`}>
              Join 500+ hiring managers who get weekly insights on Indian tech talent
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className={`flex-1 px-6 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  isDark
                    ? "bg-slate-800/50 border-slate-700 text-white placeholder-slate-400"
                    : "bg-white border-slate-300 text-slate-900 placeholder-slate-500"
                }`}
              />
              <button
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl`}
              >
                <span>Subscribe</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-bold ${theme.text.primary}`}>
                  Opportune
                </span>
              </div>
              <p className={`mb-6 ${theme.text.secondary}`}>
                Connecting Indian tech talent with global opportunities through AI-powered matching.
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${
                      isDark
                        ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
                  <h4 className={`font-semibold mb-4 capitalize ${theme.text.primary}`}>
                    {category}
                  </h4>
                  <ul className="space-y-2">
                    {links.slice(0, 4).map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className={`text-sm transition-colors duration-200 ${theme.text.secondary} hover:${theme.accent.emerald}`}
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
            isDark ? "border-slate-800" : "border-slate-200"
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div className={`flex items-center space-x-2 text-sm ${theme.text.muted}`}>
                <span>© 2025 Opportune. Made with</span>
                <Heart className="w-4 h-4 text-red-500" />
                <span>in India</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <a href="#" className={theme.text.muted}>Privacy</a>
                <span className={isDark ? "text-slate-700" : "text-slate-300"}>•</span>
                <a href="#" className={theme.text.muted}>Terms</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
