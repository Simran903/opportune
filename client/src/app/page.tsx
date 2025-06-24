"use client";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
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
  Phone,
  Twitter,
  Linkedin,
  Github,
  ArrowRight,
  Sparkles,
  Heart,
  Globe,
  Users,
  Zap,
  Moon,
  Sun,
  Star,
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
    title: "Instantly see top 5 profiles",
    description:
      "Get the most relevant candidates delivered instantly. We prioritize quality over quantity with our top 5 matching system.",
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
      className={`min-h-screen transition-all duration-500 relative overflow-hidden ${theme.background}`}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {getAnimatedBg().map((className, index) => (
          <div key={index} className={className}></div>
        ))}
      </div>

      {/* Navigation Section*/}
      <div className="fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50 w-[95%] sm:w-auto">
        <div
          className={`backdrop-blur-xl rounded-2xl shadow-xl px-3 sm:px-4 py-3 ${theme.nav}`}
        >
          <div className="flex items-center justify-between">
            <NavigationMenu viewport={false} className="max-w-full">
              <NavigationMenuList className="flex space-x-1">
                {navItems.map((item, index) => (
                  <NavigationMenuItem key={index}>
                    {item.external ? (
                      <Link href={item.href}>
                        <NavigationMenuTrigger className={triggerClasses}>
                          <span className="hidden sm:inline">{item.name}</span>
                          <span className="sm:hidden text-xs">
                            {item.name.slice(0, 4)}
                          </span>
                        </NavigationMenuTrigger>
                      </Link>
                    ) : (
                      <a href={item.href}>
                        <NavigationMenuTrigger className={triggerClasses}>
                          <span className="hidden sm:inline">{item.name}</span>
                          <span className="sm:hidden text-xs">
                            {item.name.slice(0, 4)}
                          </span>
                        </NavigationMenuTrigger>
                      </a>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            {/* Theme Toggle */}
            <div className="px-2">
              <ThemeToggleButton />
            </div>

          </div>
        </div>
      </div>

      {/* Main Section */}
      <section id="home">
        <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[calc(100vh-8rem)]">
            {/* Left Content */}
            <div className="space-y-6 sm:space-y-10 relative z-10 text-center lg:text-left">
              <div className="space-y-3">
                <div
                  className={`flex items-center justify-center lg:justify-start space-x-3 font-semibold text-sm tracking-wide ${theme.accent.emerald}`}
                >
                  <div
                    className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full ${theme.badge}`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">
                      FOR EMPLOYERS ONLY
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6 sm:space-y-8">
                <h1
                  className={`text-4xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight ${theme.text.primary}`}
                >
                  Discover Top
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                    Indian Talent,
                  </span>
                  <br />
                  <span className={theme.text.secondary}>Effortlessly</span>
                </h1>

                <p
                  className={`text-lg sm:text-xl leading-relaxed max-w-lg font-medium mx-auto lg:mx-0 ${theme.text.secondary}`}
                >
                  Post jobs and automatically match relevant LinkedIn candidates
                  from India.
                  <span className={`font-semibold ${theme.accent.emerald}`}>
                    {" "}
                    Powered by AI-driven
                  </span>{" "}
                  keyword extraction and scraping.
                </p>
              </div>

              {/* Stats */}
              <div className="flex justify-center lg:justify-start space-x-6 sm:space-x-8 pt-4">
                {[
                  { label: "Candidates", value: "10K+" },
                  { label: "Companies", value: "500+" },
                  { label: "Match Rate", value: "95%" },
                ].map(({ label, value }, idx) => (
                  <div key={idx} className="text-center">
                    <div
                      className={`text-2xl sm:text-3xl font-bold ${theme.text.primary}`}
                    >
                      {value}
                    </div>
                    <div className={`text-sm font-medium ${theme.text.muted}`}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center lg:justify-start">
                <Link href="/auth/signup">
                  <button
                    className={`group px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center space-x-3 ${theme.button.primary}`}
                  >
                    <span>Post a Job</span>
                    <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </Link>
              </div>
            </div>

            {/* Right Visual Section */}
            <div className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] flex items-center justify-center mt-8 lg:mt-0">
              <div className="relative w-full max-w-xl lg:max-w-2xl h-full">
                {/* Central Hub */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div
                    className={`p-2 rounded-3xl shadow-2xl ${isDark
                      ? "bg-gradient-to-br from-emerald-600 to-teal-700"
                      : "bg-gradient-to-br from-emerald-500 to-teal-600"
                      }`}
                  >
                    <div className="bg-white/20 backdrop-blur-sm p-2 rounded-2xl">
                      <MapPin className="w-8 sm:w-12 h-8 sm:h-12 text-white animate-pulse drop-shadow-lg" />
                    </div>
                  </div>
                </div>

                {/* Profile Images - Responsive positioning */}
                {/* Top Left */}
                <div className="absolute top-8 sm:top-12 left-8 sm:left-12 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 z-30 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white transform hover:scale-110 transition-all duration-300 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                    className="w-full h-full object-cover"
                    alt="Software Engineer"
                  />
                  <div
                    className={`absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-5 sm:w-7 h-5 sm:h-7 rounded-full border-2 sm:border-3 border-white flex items-center justify-center ${isDark ? "bg-emerald-500" : "bg-emerald-500"
                      }`}
                  >
                    <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Top Right */}
                <div className="absolute top-6 sm:top-8 right-12 sm:right-16 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 z-30 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white transform hover:scale-110 transition-all duration-300 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
                    className="w-full h-full object-cover"
                    alt="Product Manager"
                  />
                  <div
                    className={`absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-5 sm:w-7 h-5 sm:h-7 rounded-full border-2 sm:border-3 border-white flex items-center justify-center ${isDark ? "bg-teal-500" : "bg-teal-500"
                      }`}
                  >
                    <Zap className="w-2 sm:w-3.5 h-2 sm:h-3.5 text-white" />
                  </div>
                </div>

                {/* Middle Left */}
                <div className="absolute top-1/2 left-6 sm:left-8 transform -translate-y-1/2 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 z-30 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white hover:scale-110 transition-all duration-300 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
                    className="w-full h-full object-cover"
                    alt="Data Scientist"
                  />
                  <div
                    className={`absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-5 sm:w-7 h-5 sm:h-7 rounded-full border-2 sm:border-3 border-white flex items-center justify-center ${isDark ? "bg-cyan-500" : "bg-cyan-500"
                      }`}
                  >
                    <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Middle Right */}
                <div className="absolute top-1/2 right-8 sm:right-12 transform -translate-y-1/2 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 z-30 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white hover:scale-110 transition-all duration-300 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80"
                    className="w-full h-full object-cover"
                    alt="UI/UX Designer"
                  />
                  <div
                    className={`absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-5 sm:w-7 h-5 sm:h-7 rounded-full border-2 sm:border-3 border-white flex items-center justify-center ${isDark ? "bg-emerald-600" : "bg-emerald-600"
                      }`}
                  >
                    <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="absolute bottom-12 sm:bottom-16 left-16 sm:left-20 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 z-30 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white transform hover:scale-110 transition-all duration-300 cursor-pointer">
                  <img
                    src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=150&q=80"
                    className="w-full h-full object-cover"
                    alt="DevOps Engineer"
                  />
                  <div
                    className={`absolute -bottom-1 sm:-bottom-2 -right-1 sm:-right-2 w-5 sm:w-7 h-5 sm:h-7 rounded-full border-2 sm:border-3 border-white flex items-center justify-center ${isDark ? "bg-teal-600" : "bg-teal-600"
                      }`}
                  >
                    <div className="w-1.5 sm:w-2.5 h-1.5 sm:h-2.5 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Enhanced Connecting Lines - Responsive viewBox */}
                <svg
                  className="absolute inset-0 w-full h-full z-10"
                  viewBox="0 0 400 500"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <linearGradient
                      id="lineGradient1"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor={isDark ? "#059669" : "#059669"}
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="100%"
                        stopColor={isDark ? "#0d9488" : "#0d9488"}
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                    <linearGradient
                      id="lineGradient2"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor={isDark ? "#0891b2" : "#0891b2"}
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="100%"
                        stopColor={isDark ? "#059669" : "#059669"}
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                    <linearGradient
                      id="lineGradient3"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop
                        offset="0%"
                        stopColor={isDark ? "#0d9488" : "#0d9488"}
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="100%"
                        stopColor={isDark ? "#0891b2" : "#0891b2"}
                        stopOpacity="0.9"
                      />
                    </linearGradient>
                  </defs>

                  {/* Responsive paths */}
                  <path
                    d="M 60 60 Q 130 130 200 250"
                    stroke="url(#lineGradient1)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;24"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>

                  <path
                    d="M 340 50 Q 270 130 200 250"
                    stroke="url(#lineGradient2)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                    style={{ animationDelay: "0.8s" }}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;24"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>

                  <path
                    d="M 50 250 Q 120 250 200 250"
                    stroke="url(#lineGradient3)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                    style={{ animationDelay: "1.6s" }}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;24"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>

                  <path
                    d="M 350 250 Q 270 250 200 250"
                    stroke="url(#lineGradient1)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                    style={{ animationDelay: "2.4s" }}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;24"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>

                  <path
                    d="M 100 420 Q 150 340 200 250"
                    stroke="url(#lineGradient2)"
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray="8,4"
                    className="animate-pulse"
                    style={{ animationDelay: "3.2s" }}
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      values="0;24"
                      dur="4s"
                      repeatCount="indefinite"
                    />
                  </path>
                </svg>

                {/* Floating Labels - Responsive */}
                <div
                  className={`absolute top-6 sm:top-8 left-6 sm:left-8 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg shadow-lg border animate-bounce z-40 ${isDark
                    ? "bg-slate-800/95 border-emerald-500/50 text-emerald-400"
                    : "bg-white/95 border-emerald-200/50 text-slate-800"
                    }`}
                  style={{ animationDelay: "1s", animationDuration: "4s" }}
                >
                  <div className="text-xs sm:text-xs font-semibold">
                    5+ Years
                  </div>
                </div>

                <div
                  className={`absolute top-2 sm:top-4 right-8 sm:right-12 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg shadow-lg border animate-bounce z-40 ${isDark
                    ? "bg-slate-800/95 border-teal-500/50 text-teal-400"
                    : "bg-white/95 border-teal-200/50 text-slate-800"
                    }`}
                  style={{ animationDelay: "2s", animationDuration: "4s" }}
                >
                  <div className="text-xs sm:text-xs font-semibold">
                    Available
                  </div>
                </div>

                <div
                  className={`absolute top-1/2 left-1 sm:left-2 transform -translate-y-8 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg shadow-lg border animate-bounce z-40 ${isDark
                    ? "bg-slate-800/95 border-cyan-500/50 text-cyan-400"
                    : "bg-white/95 border-cyan-200/50 text-slate-800"
                    }`}
                  style={{ animationDelay: "0.5s", animationDuration: "4s" }}
                >
                  <div className="text-xs sm:text-xs font-semibold">
                    React Expert
                  </div>
                </div>

                <div
                  className={`absolute top-1/2 right-2 sm:right-4 transform -translate-y-8 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg shadow-lg border animate-bounce z-40 ${isDark
                    ? "bg-slate-800/95 border-emerald-500/50 text-emerald-400"
                    : "bg-white/95 border-emerald-200/50 text-slate-800"
                    }`}
                  style={{ animationDelay: "1.5s", animationDuration: "4s" }}
                >
                  <div className="text-xs sm:text-xs font-semibold">
                    Top Rated
                  </div>
                </div>

                <div
                  className={`absolute bottom-8 sm:bottom-12 left-8 sm:left-12 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg shadow-lg border animate-bounce z-40 ${isDark
                    ? "bg-slate-800/95 border-teal-500/50 text-teal-400"
                    : "bg-white/95 border-teal-200/50 text-slate-800"
                    }`}
                  style={{ animationDelay: "2.5s", animationDuration: "4s" }}
                >
                  <div className="text-xs sm:text-xs font-semibold">
                    DevOps Pro
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features">
        <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16">
          <div className="text-center mb-12 sm:mb-16">
            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${theme.badge}`}
            >
              <Users className="w-4 h-4" />
              <span className="text-sm font-semibold">
                WHY EMPLOYERS LOVE US
              </span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${theme.text.primary}`}
            >
              Everything you need to find
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                top Indian talent
              </span>
            </h2>
            <p className={`text-lg max-w-2xl mx-auto ${theme.text.secondary}`}>
              Skip the endless browsing. Our AI does the heavy lifting so you
              can focus on what matters most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map(({ icon, title, description, border }, index) => (
              <div
                key={index}
                className={`group p-6 sm:p-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl backdrop-blur-sm ${isDark
                  ? `bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800/80 hover:border-${border}-500/50`
                  : `bg-white/50 border border-white/50 hover:bg-white/80 hover:border-${border}-200`
                  }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isDark ? `bg-${border}-600` : `bg-${border}-500`
                    }`}
                >
                  <div className="text-white text-xl">{icon}</div>
                </div>
                <h3 className={`text-xl font-bold mb-3 ${theme.text.primary}`}>
                  {title}
                </h3>
                <p className={`${theme.text.secondary}`}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <div className="mt-24 sm:mt-32 relative z-10">
        <div
          className={`w-full backdrop-blur-md ${isDark ? "bg-black/30" : "bg-white/30"
            }`}
        >
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center">
              <h2
                className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 ${theme.text.primary}`}
              >
                Ready to find your next
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  tech hire?
                </span>
              </h2>

              <Link href="/auth/signup">
                <button
                  className={`group px-8 sm:px-12 py-4 sm:py-5 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 flex items-center justify-center space-x-3 mx-auto ${theme.button.primary}`}
                >
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span>Post a Job Now</span>
                  <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <section id="testimonials">
        <div className="container mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16">
          <div className="text-center mb-12 sm:mb-16">
            <div
              className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${theme.badge}`}
            >
              <span className="text-lg">💬</span>
              <span className="text-sm font-semibold">SUCCESS STORIES</span>
            </div>
            <h2
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 ${theme.text.primary}`}
            >
              Trusted by hiring managers
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                across India
              </span>
            </h2>
          </div>

          <div className="max-w-5xl mx-auto">
            <Carousel opts={{ loop: true }} className="w-full">
              <CarouselContent>
                {testimonials.map((item, index) => (
                  <CarouselItem key={index}>
                    <div
                      className={`group p-6 sm:p-8 rounded-2xl border ${theme.card} hover:border-${item.color}-500/50 hover:bg-${item.color}-900/10 shadow-xl hover:shadow-2xl relative overflow-hidden`}
                    >
                      <div
                        className={`absolute top-4 right-4 text-6xl opacity-10 ${isDark
                          ? `text-${item.color}-400`
                          : `text-${item.color}-600`
                          }`}
                      >
                        "
                      </div>

                      <div className="relative z-10">
                        <div
                          className={`text-xl sm:text-2xl font-bold mb-4 ${theme.text.primary}`}
                        >
                          {item.quote}
                        </div>
                        <p className={`mb-6 ${theme.text.secondary}`}>
                          {item.text}
                        </p>
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${isDark
                              ? `bg-${item.color}-600`
                              : `bg-${item.color}-500`
                              }`}
                          >
                            <span className="text-white font-bold text-lg">
                              {item.initial}
                            </span>
                          </div>
                          <div>
                            <div
                              className={`font-semibold ${theme.text.primary}`}
                            >
                              {item.name}
                            </div>
                            <div className={`text-sm ${theme.text.muted}`}>
                              {item.role}, {item.company}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <div className="flex justify-center mt-6 gap-4">
                <CarouselPrevious className="bg-gray-100/20" />
                <CarouselNext className="bg-gray-100/20" />
              </div>
            </Carousel>
          </div>

          {/* Stats Section */}
          <div className="my-16 md:w-4xl mx-auto">
            <div className="px-4 sm:px-6">
              <div
                className={`
          flex flex-wrap justify-center items-center gap-y-6 gap-x-10 sm:gap-x-16 px-6 py-4
          rounded-2xl border backdrop-blur-sm shadow-xl
          ${theme.card}
        `}
              >
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 relative"
                  >
                    <div
                      className={`p-2 rounded-lg ${isDark ? "bg-emerald-600/20" : "bg-emerald-100"
                        }`}
                    >
                      <stat.icon
                        className={`w-6 h-6 ${theme.accent.emerald}`}
                      />
                    </div>

                    <div className="min-w-[100px]">
                      <div
                        className={`text-2xl font-semibold ${theme.text.primary}`}
                      >
                        {stat.value}
                      </div>
                      <div className={`text-sm ${theme.text.muted}`}>
                        {stat.label}
                      </div>
                    </div>

                    {index < stats.length - 1 && (
                      <div className="hidden sm:block absolute -right-8 top-1/2 transform -translate-y-1/2 h-10 w-px bg-gradient-to-b from-transparent via-slate-400 to-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="relative z-10">
        {/* Newsletter Section */}
        <div
          className={`border-y ${isDark ? "border-slate-700/50" : "border-slate-200/50"
            }`}
        >
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto text-center">
              <div
                className={`inline-flex items-center space-x-2 px-4 py-2 rounded-full mb-6 ${theme.badge}`}
              >
                <Mail className="w-4 h-4" />
                <span className="text-sm font-semibold">STAY UPDATED</span>
              </div>

              <h3
                className={`text-2xl sm:text-3xl font-bold mb-4 ${theme.text.primary}`}
              >
                Get the latest hiring insights and
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  candidate updates
                </span>
              </h3>

              <p className={`text-lg mb-8 ${theme.text.secondary}`}>
                Join 500+ hiring managers who get weekly insights on Indian tech
                talent
              </p>

              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={`flex-1 px-6 py-4 rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${theme.input} backdrop-blur-sm`}
                />
                <button
                  className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${theme.button.primary} shadow-xl hover:shadow-2xl transform hover:scale-105`}
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-16">
          <div className="grid lg:grid-cols-6 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <span className={`text-2xl font-bold ${theme.text.primary}`}>
                    Opportune
                  </span>
                </div>
                <p className={`text-lg mb-6 ${theme.text.secondary}`}>
                  Connecting Indian tech talent with global opportunities
                  through AI-powered matching.
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail className={`w-5 h-5 ${theme.accent.emerald}`} />
                  <span className={theme.text.secondary}>
                    hello@Opportune.com
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className={`w-5 h-5 ${theme.accent.emerald}`} />
                  <span className={theme.text.secondary}>+91 98765 43210</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className={`w-5 h-5 ${theme.accent.emerald}`} />
                  <span className={theme.text.secondary}>
                    Gurugram, Haryana, India
                  </span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 rounded-xl transition-all duration-300 backdrop-blur-sm hover:scale-110
        ${isDark
                        ? `bg-slate-800/60 text-white hover:bg-slate-700 ${social.color}`
                        : `bg-white/80 text-slate-800 hover:bg-slate-100 ${social.color}`
                      } shadow-md`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>

            </div>

            {/* Links Sections */}
            <div className="lg:col-span-4 grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(footerLinks).map(([category, links]) => (
                <div key={category}>
                  <h4
                    className={`text-lg font-semibold mb-6 capitalize ${theme.text.primary}`}
                  >
                    {category}
                  </h4>
                  <ul className="space-y-3">
                    {links.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className={`transition-all duration-300 hover:translate-x-1 ${theme.text.secondary} hover:${theme.accent.emerald}`}
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
        </div>

        {/* Bottom Bar */}
        <div
          className={`border-t ${isDark ? "border-slate-700/50" : "border-slate-200/50"
            }`}
        >
          <div className="container mx-auto px-6 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <div
                className={`flex items-center space-x-2 text-sm ${theme.text.muted}`}
              >
                <span>© 2025 Opportune. Made with</span>
                <Heart className="w-4 h-4 text-red-500 animate-pulse" />
                <span>in India</span>
              </div>

              <div className="flex items-center space-x-6">
                <span className={`flex items-center gap-1 text-sm ${theme.text.muted}`}>
                  <Star className="w-4 h-4" />
                  Trusted by 500+ companies
                </span>
                <div className={`w-px h-4 ${isDark ? "bg-slate-700" : "bg-slate-300"}`} />
                <span className={`flex items-center gap-1 text-sm ${theme.text.muted}`}>
                  <Zap className="w-4 h-4" />
                  10K+ successful hires
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
