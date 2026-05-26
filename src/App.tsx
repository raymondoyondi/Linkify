import React, { useState, useEffect } from "react";
import { LinkItem, ThemeConfig, MetricMilestone, ThemePresetId } from "./types";
import { THEME_PRESETS, INITIAL_LINKS, INITIAL_MILESTONES } from "./data";
import PhonePreview from "./components/PhonePreview";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import MilestoneAlerts from "./components/MilestoneAlerts";
import HashtagSuggester from "./components/HashtagSuggester";
import { 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Layout, 
  BarChart3, 
  Bell, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Moon, 
  Sun, 
  Save, 
  Settings, 
  Link2, 
  CheckCircle2, 
  Sparkle,
  Lock,
  Instagram,
  Linkedin,
  Twitter,
  Github,
  Mail,
  RefreshCw,
  LayoutGrid,
  TrendingUp,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  UserCheck,
  Zap,
  Globe,
  DollarSign
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<"landing" | "login" | "signup">("landing");
  const [authEmail, setAuthEmail] = useState<string>("");
  const [authPassword, setAuthPassword] = useState<string>("");
  const [authName, setAuthName] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [authSuccess, setAuthSuccess] = useState<string>("");
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  const [activeCompanyPage, setActiveCompanyPage] = useState<string | null>(null);
  const [selectedJobRole, setSelectedJobRole] = useState<string | null>(null);
  const [applicantName, setApplicantName] = useState<string>("");
  const [applicantEmail, setApplicantEmail] = useState<string>("");
  const [applicantPortfolio, setApplicantPortfolio] = useState<string>("");
  const [applicantCoverLetter, setApplicantCoverLetter] = useState<string>("");
  const [applicationSubmitted, setApplicationSubmitted] = useState<boolean>(false);

  // Landing Page Interactive Calculator States
  const [calcPlatform, setCalcPlatform] = useState<string>("Tiktok");
  const [calcTraffic, setCalcTraffic] = useState<number>(25000); // monthly video views / clicks

  // Tabs config
  const [activeTab, setActiveTab] = useState<"builder" | "analytics" | "milestones" | "hashtags">("builder");
  
  // Theme and UI States
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [selectedThemeId, setSelectedThemeId] = useState<ThemePresetId>("cosmic");
  
  // Profile Meta State
  const [profileName, setProfileName] = useState<string>("Guest Creator");
  const [profileBio, setProfileBio] = useState<string>("Brand & Acquisition Creator. Crafting frictionless, data-informed social funnels.");
  const [profileImage, setProfileImage] = useState<string>("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80");
  
  // Custom layout details
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("center");
  const [shadowSize, setShadowSize] = useState<"none" | "small" | "large">("large");

  // Multi-platform social handles integration
  const [socialHandles, setSocialHandles] = useState({
    instagram: "creator_insta",
    tiktok: "creator_tok",
    twitter: "creator_write",
    linkedin: "creator-profile",
    peerlist: "creator",
    github: "creator_dev",
    gmail: "creator@example.com"
  });

  // Link Items state
  const [links, setLinks] = useState<LinkItem[]>(INITIAL_LINKS);
  
  // New link builder buffer
  const [newLinkTitle, setNewLinkTitle] = useState<string>("");
  const [newLinkUrl, setNewLinkUrl] = useState<string>("");
  const [newLinkPlatform, setNewLinkPlatform] = useState<LinkItem["platform"]>("custom");

  // Notifications Milestone alerts setup
  const [milestones, setMilestones] = useState<MetricMilestone[]>(INITIAL_MILESTONES);
  const [userRole, setUserRole] = useState<"owner" | "editor" | "manager" | "viewer">("owner");

  // Triggered alert toasts state
  const [activeAlertToast, setActiveAlertToast] = useState<string | null>(null);

  // Security & platform validation states
  const [apiConStatus, setApiConStatus] = useState<"linked" | "verifying" | "re-auth">("linked");

  // Active theme properties
  const activeTheme = THEME_PRESETS.find(t => t.id === selectedThemeId) || THEME_PRESETS[0];

  const closeCompanyModal = () => {
    setActiveCompanyPage(null);
    setSelectedJobRole(null);
    setApplicationSubmitted(false);
    setApplicantName("");
    setApplicantEmail("");
    setApplicantPortfolio("");
    setApplicantCoverLetter("");
  };

  // Dark mode trigger handler
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  // Simulated link interaction on Phone Preview
  // Clicking links inside the phone increments its stats and triggers push notification alerts if milestones are crossed!
  const handlePhoneLinkClick = (linkId: string) => {
    const updatedLinks = links.map(l => {
      if (l.id === linkId) {
        const incrementedClick = l.clickCount + 1;
        // Verify milestones trigger
        triggerMilestoneChecks(incrementedClick);
        return { ...l, clickCount: incrementedClick };
      }
      return l;
    });
    setLinks(updatedLinks);
  };

  // Automated checks for Metric goals and push milestone toasts
  const triggerMilestoneChecks = (currentClicksVal: number) => {
    // Total aggregate sum across all active links
    const totalAgg = links.reduce((acc, curr) => acc + curr.clickCount, 0) + 1;
    
    milestones.forEach((m) => {
      if (m.isEnabled && !m.notified) {
        if (m.metric === "clicks" && totalAgg >= m.threshold) {
          showMilestoneNotification(m, totalAgg);
          m.notified = true; 
        }
      }
    });
  };

  const showMilestoneNotification = (milestone: MetricMilestone, currentVal: number) => {
    setActiveAlertToast(
      `🎉 MILESTONE REACHED! Your unified profile has crossed the ${milestone.threshold} clicks goal! (Currently achieved: ${currentVal} interactions). Push generated for role: ${milestone.role.toUpperCase()}`
    );
    // Auto clear after 6 seconds
    setTimeout(() => {
      setActiveAlertToast(null);
    }, 6000);
  };

  // Reordering array utility for list swap
  const moveLink = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= links.length) return;

    const swapped = [...links];
    const temp = swapped[index];
    swapped[index] = swapped[targetIdx];
    swapped[targetIdx] = temp;
    setLinks(swapped);
  };

  // Create new bio link
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) return;

    // Auto prepend https if missing and custom scheme
    let formattedUrl = newLinkUrl.trim();
    if (newLinkPlatform !== "gmail" && !/^https?:\/\//i.test(formattedUrl) && !/^mailto:/i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    const item: LinkItem = {
      id: `link-${Date.now()}`,
      title: newLinkTitle.trim(),
      url: formattedUrl,
      platform: newLinkPlatform,
      clickCount: 0,
      isPublished: true,
      engagementRate: 3.2,
    };

    setLinks([item, ...links]);
    setNewLinkTitle("");
    setNewLinkUrl("");
    setNewLinkPlatform("custom");
  };

  // Delete Link
  const handleDeleteLink = (id: string) => {
    setLinks(links.filter(l => l.id !== id));
  };

  // Update specific field parameters
  const togglePublish = (id: string) => {
    setLinks(links.map(l => l.id === id ? { ...l, isPublished: !l.isPublished } : l));
  };

  // New interactive simulated authentication handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError("Please fill out all credentials to access Linkify.");
      return;
    }

    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters for standard API compliance.");
      return;
    }

    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      setIsAuthenticated(true);
      // Auto-populate profile details based on login email dynamically
      const extractedName = authEmail.split("@")[0] || "Custom Creator";
      const formattedName = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      setProfileName(formattedName);
      setAuthSuccess(`Access authenticated. Loading Link-In-Bio Builder Dashboard for ${formattedName}...`);
    }, 850);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSuccess("");

    if (!authName.trim() || !authEmail.trim() || !authPassword.trim()) {
      setAuthError("All registration credentials are mandatory.");
      return;
    }

    if (authPassword.length < 6) {
      setAuthError("API integrity requires a password of at least 6 characters.");
      return;
    }

    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      setIsAuthenticated(true);
      setProfileName(authName.trim());
      setProfileBio(`Brand Creator, optimizing social conversion index. Powered by Linkify.`);
      setAuthSuccess("Creator profile deployed to node! Welcome to Linkify.");
    }, 1000);
  };

  const handleDemoLogin = () => {
    setAuthError("");
    setAuthSuccess("");
    setIsAuthLoading(true);
    
    // Automatically detect entered name/email first, fallback to a clean universal Guest Creator name
    const detectedName = authName.trim() || (authEmail.trim() ? authEmail.trim().split("@")[0] : "") || "Awesome Creator";
    const finalName = detectedName.charAt(0).toUpperCase() + detectedName.slice(1);

    setTimeout(() => {
      setIsAuthLoading(false);
      setIsAuthenticated(true);
      setProfileName(finalName);
      
      // Customize bio dynamically to the new user name
      setProfileBio(`${finalName}, optimizing referral paths and live social click metrics. Powered by Linkify.`);
      
      // Update social handles configuration to match the login session name
      const cleanName = finalName.toLowerCase().replace(/[^a-z0-9]/g, "");
      setSocialHandles({
        instagram: `${cleanName}_insta`,
        tiktok: `${cleanName}_tok`,
        twitter: `${cleanName}_write`,
        linkedin: `${cleanName}-profile`,
        peerlist: cleanName,
        github: cleanName,
        gmail: `${cleanName}@gmail.com`
      });

      setAuthSuccess(`Access verified. Logged in dynamically as ${finalName}!`);
    }, 500);
  };

  // Secure API connection verification trigger
  const handleVerifyPlats = () => {
    setApiConStatus("verifying");
    setTimeout(() => {
      setApiConStatus("linked");
      alert("All active platform tokens, redirect endpoints and OAuth scopes verified. Webhooks active.");
    }, 1200);
  };

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300`}>
      
      {/* Dynamic Push Toast Notification Banner */}
      <AnimatePresence>
        {activeAlertToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            id="toast-milestone-banner"
            className="fixed top-4 left-4 right-4 z-50 bg-indigo-600 dark:bg-indigo-500 text-white p-4 rounded-2xl shadow-xl max-w-xl mx-auto flex items-start gap-3 border border-indigo-400 select-none cursor-pointer"
            onClick={() => setActiveAlertToast(null)}
          >
            <Bell className="w-5 h-5 shrink-0 mt-0.5 animate-bounce" />
            <div className="flex-1">
              <span className="font-bold text-xs uppercase tracking-widest block font-mono">Verified Milestone Met</span>
              <p className="text-xs font-semibold mt-1 leading-relaxed">{activeAlertToast}</p>
            </div>
            <button className="text-xs bg-white/10 p-1 rounded-md text-white/80 hover:text-white hover:bg-white/20 select-none">
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unified Digital Presence Routing: Landing & Auth vs Workspace Dashboard */}
      {!isAuthenticated ? (
        <div className="mx-auto max-w-7xl px-4 py-6 md:py-16">
          {/* Public Navbar Header */}
          <header className="flex justify-between items-center pb-6 mb-12 border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600 text-white p-2 w-11 h-11 rounded-2xl shadow-md flex items-center justify-center font-bold text-xl select-none">
                🔗
              </div>
              <div>
                <h1 className="text-lg font-black tracking-tight font-mono flex items-center gap-1.5">
                  Linkify <span className="text-indigo-500 font-bold">🔗</span>
                </h1>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono tracking-widest font-black uppercase">CREATOR CHANNELS SUITE</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 text-slate-500 dark:text-slate-400 cursor-pointer shadow-xs transition-all"
                title="Toggle visual mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
              
              {authMode === "landing" ? (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setAuthMode("login")}
                    className="text-xs font-black text-slate-600 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white px-3 py-2 cursor-pointer transition-colors font-mono"
                  >
                    LOG IN
                  </button>
                  <button 
                    onClick={() => setAuthMode("signup")}
                    className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-transform duration-100 active:scale-95"
                  >
                    Create Bio Page
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setAuthMode("landing")}
                  className="text-xs font-black text-indigo-500 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors font-mono uppercase"
                >
                  &larr; HOME
                </button>
              )}
            </div>
          </header>

          <AnimatePresence mode="wait">
            {authMode === "landing" ? (
              <motion.div
                key="landing-group"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-16"
              >
                {/* Hero block layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-4">
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-500 border border-indigo-500/25 px-3.5 py-1.5 rounded-full text-[10px] font-black tracking-wider uppercase font-mono">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      UNIFIED COGNITIVE ACQUISITION 🔗
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.08] font-sans">
                      Your Creator presence, <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                        Optimized in single link. 🔗
                      </span>
                    </h2>
                    
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-2xl">
                      Deliver gorgeous design presets, preview layouts dynamically, track interactive mock clickstreams instantly, configure goals thresholds, and manage your handles like a professional director.
                    </p>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
                      <button 
                        onClick={() => setAuthMode("signup")}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider py-4 px-6 rounded-xl shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all hover:translate-y-[-1px] active:translate-y-[1px] font-mono"
                      >
                        Claim your link space <ArrowRight className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={handleDemoLogin}
                        className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-black text-xs uppercase tracking-wider py-4 px-6 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center justify-center gap-2 cursor-pointer transition-all font-mono"
                      >
                        <UserCheck className="w-4 h-4 text-emerald-500" />
                        Run verified Live Demo
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-200 dark:border-white/5">
                      <div>
                        <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-mono">10,000+</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase font-mono">Creators Tuned</p>
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-mono">1.2M+</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase font-mono">Profile clicks</p>
                      </div>
                      <div>
                        <p className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white font-mono">99.98%</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black tracking-wider uppercase font-mono">Network Uptime</p>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Clicks/CTR Slider Calculator Widget */}
                  <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-white/5 mb-5">
                      <Zap className="w-5 h-5 text-indigo-500" />
                      <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                        Link Performance Predictor 🔗
                      </h3>
                    </div>

                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-5 leading-relaxed">
                      Toggle active channels and slide monthly post impressions to estimate optimized Clickstream referral performance using Linkify presets.
                    </p>

                    <div className="space-y-5">
                      {/* Interactive toggle */}
                      <div>
                        <span className="text-[10px] font-black text-slate-700 dark:text-slate-400 block mb-2 font-mono tracking-wider">
                          DISTRIBUTION SOURCE
                        </span>
                        <div className="grid grid-cols-4 gap-1.5">
                          {["Tiktok", "Instagram", "Linkedin", "Peerlist"].map((plat) => (
                            <button
                              key={plat}
                              onClick={() => setCalcPlatform(plat)}
                              className={`text-[10px] py-2 px-0.5 rounded-lg border font-black uppercase font-mono cursor-pointer transition-all ${
                                calcPlatform === plat 
                                  ? "bg-indigo-500/10 text-indigo-500 border-indigo-500" 
                                  : "bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-white/5 hover:bg-slate-100"
                              }`}
                            >
                              {plat === "Tiktok" ? "TikTok" : plat === "Instagram" ? "Insta" : plat === "Linkedin" ? "LinkedIn" : "Peerlist"}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Slider slider */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-[10px] font-black font-mono">
                          <span className="text-slate-700 dark:text-slate-400 uppercase tracking-wider">MONTHLY VIEWS</span>
                          <span className="text-indigo-500">{(calcTraffic / 1000).toFixed(0)}K IMPRESSIONS</span>
                        </div>
                        <input 
                          type="range" 
                          min={5000}
                          max={500000}
                          step={5000}
                          value={calcTraffic}
                          onChange={(e) => setCalcTraffic(Number(e.target.value))}
                          className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>

                      {/* Math outputs */}
                      <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-white/5 space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-semibold">Standard Bio CTR estimate</span>
                          <span className="text-emerald-500 font-black font-mono">
                            {calcPlatform === "Tiktok" ? "8.4%" : calcPlatform === "Instagram" ? "6.8%" : calcPlatform === "Linkedin" ? "11.2%" : "14.5%"}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-slate-500 dark:text-slate-400 font-semibold">Expected Referral visits</span>
                          <span className="text-slate-900 dark:text-white font-black font-mono">
                            {Math.round(calcTraffic * (calcPlatform === "Tiktok" ? 0.084 : calcPlatform === "Instagram" ? 0.068 : calcPlatform === "Linkedin" ? 0.112 : 0.145)).toLocaleString()} / Mo
                          </span>
                        </div>
                        <div className="border-t border-slate-200 dark:border-white/5 pt-3 flex justify-between items-center">
                          <div>
                            <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block font-mono">Funnel optimization index</span>
                            <span className="text-base font-black text-indigo-500 font-mono">
                              +{(calcPlatform === "Tiktok" ? "3,400" : calcPlatform === "Instagram" ? "2,200" : calcPlatform === "Linkedin" ? "5,800" : "7,250")} clicks
                            </span>
                          </div>
                          <span className="text-[9px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md px-2 py-1 font-black uppercase tracking-wider font-mono">
                            VERIFIED CTR
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grid features panel */}
                <div className="space-y-8 pt-8">
                  <div className="text-center space-y-2 max-w-xl mx-auto">
                    <h3 className="text-xs font-black tracking-widest text-indigo-500 uppercase font-mono">INTELLIGENT ARCHITECTURE</h3>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Crafted for creators requiring responsive data controls
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Standardized metrics and beautiful components inside an optimized unified console.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Panel 1 */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-xs hover:border-indigo-500/30 transition-all">
                      <div className="bg-indigo-500/10 text-indigo-500 w-9 h-9 rounded-xl flex items-center justify-center mb-4">
                        <Layout className="w-4 h-4" />
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2 uppercase font-mono">Design Preset Engine</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Deploy modular styling presets including alignment customizers, shadow properties, and responsive social icon components.
                      </p>
                    </div>

                    {/* Panel 2 */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-xs hover:border-indigo-500/30 transition-all">
                      <div className="bg-violet-500/10 text-violet-500 w-9 h-9 rounded-xl flex items-center justify-center mb-4">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2 uppercase font-mono">Clickstream Analytics</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Interactions inside live interactive mock previews trigger real-time clicks calculators and updates aggregated metric logs instantly.
                      </p>
                    </div>

                    {/* Panel 3 */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 shadow-xs hover:border-indigo-500/30 transition-all">
                      <div className="bg-purple-500/10 text-purple-500 w-9 h-9 rounded-xl flex items-center justify-center mb-4">
                        <Award className="w-4 h-4" />
                      </div>
                      <h5 className="font-extrabold text-sm text-slate-900 dark:text-white mb-2 uppercase font-mono">Rules Milestones Banners</h5>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                        Set target clickstream goals. If clicks scale past designated parameters, smart push notifications trigger automatically.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer compliance space */}
                <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-1.5">
                    <p className="text-xs font-black text-indigo-500 tracking-wider uppercase font-mono flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> SECURE DEPLOYMENT STANDARDS
                    </p>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                      Active environment tokens are protected on sandboxed ports and never leaked to external client browsers.
                    </p>
                  </div>
                  <button 
                    onClick={() => setAuthMode("signup")}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-[10px] py-3.5 px-5 rounded-xl uppercase tracking-wider font-mono shrink-0 transition-all active:scale-95"
                  >
                    Claim your link handle free
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="auth-group"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.18 }}
                className="max-w-md mx-auto pt-6"
              >
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-8 shadow-xl space-y-6">
                  <div className="text-center space-y-2">
                    <div className="bg-indigo-600/10 text-indigo-500 w-12 h-12 rounded-2xl mx-auto flex items-center justify-center text-2xl select-none">
                      🔗
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                      {authMode === "login" ? "Welcome Back to Linkify" : "Secure Linkify Node"}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {authMode === "login" 
                        ? "Verify credentials to load custom presets and link telemetry" 
                        : "Initialize a free standard profile backed by real-time clickstreams"
                      }
                    </p>
                  </div>

                  {/* Form alerts response */}
                  {authError && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-semibold">
                      ⚠️ {authError}
                    </div>
                  )}

                  {authSuccess && (
                     <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-semibold animate-pulse">
                      ✨ {authSuccess}
                     </div>
                  )}

                  {/* HTML form */}
                  <form onSubmit={authMode === "login" ? handleLogin : handleSignup} className="space-y-4">
                    {authMode === "signup" && (
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-700 dark:text-slate-300 block font-mono">
                          DISPLAY NAME
                        </label>
                        <input
                          type="text"
                          required
                          value={authName}
                          onChange={(e) => setAuthName(e.target.value)}
                          placeholder="e.g. Alex Carter"
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-950 dark:text-white placeholder-slate-400 font-semibold"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-700 dark:text-slate-300 block font-mono">
                        EMAIL ADDRESS
                      </label>
                      <input
                        type="email"
                        required
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="creator@example.com"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-950 dark:text-white placeholder-slate-400 font-semibold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-700 dark:text-slate-300 block font-mono">
                        SECURE PASSWORD
                      </label>
                      <input
                        type="password"
                        required
                        value={authPassword}
                        onChange={(e) => setAuthPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/5 rounded-xl px-4 py-3 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-950 dark:text-white placeholder-slate-400 font-semibold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthLoading}
                      className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/40 text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all shadow-md shadow-indigo-600/10 font-mono"
                    >
                      {isAuthLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Authenticating Node...
                        </>
                      ) : authMode === "login" ? (
                        "Open dashboard"
                      ) : (
                        "Register Profile node"
                      )}
                    </button>
                  </form>

                  {/* Instant direct demouser signin */}
                  <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-white/5">
                    <button
                      onClick={handleDemoLogin}
                      disabled={isAuthLoading}
                      className="w-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-white/10 font-black py-3 rounded-xl text-[10px] uppercase hover:bg-slate-200 dark:hover:bg-slate-800/50 flex items-center justify-center gap-1.5 cursor-pointer transition-all font-mono tracking-wider"
                    >
                      <UserCheck className="w-4 h-4 text-emerald-500" />
                      {authName.trim() || authEmail.trim() 
                        ? `Sign In Instantly as ${authName.trim() || authEmail.trim().split("@")[0]} 🔗` 
                        : "Sign In Instantly as Guest Creator 🔗"
                      }
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          setAuthMode(authMode === "login" ? "signup" : "login");
                          setAuthError("");
                          setAuthSuccess("");
                        }}
                        className="text-[11px] font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer"
                      >
                        {authMode === "login" 
                          ? "Don't have an authentication node? Sign up free" 
                          : "Synchronized already? Log in with password"
                        }
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="mx-auto max-w-[1400px] px-4 py-6 md:py-8">
          
          {/* Main top header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-8 border-b border-slate-200 dark:border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="bg-indigo-600 text-white p-2.5 w-11 h-11 rounded-2xl shadow-md flex items-center justify-center text-xl select-none font-mono font-black">
                🔗
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-black tracking-tight font-mono flex items-center gap-1">
                    Linkify <span className="text-indigo-500 font-bold">🔗</span>
                  </h1>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Professional Link-In-Bio Builder & Real-time Click Analytics Suite</p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch sm:self-auto">
              
              {/* Authenticated active user indicator & Sign out */}
              <div className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 px-3 py-1.5 rounded-xl">
                <div className="hidden md:block text-left">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-mono">Active Creator</span>
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-200 max-w-[100px] truncate block">{profileName}</span>
                </div>
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    setAuthMode("landing");
                  }}
                  className="ml-1 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase font-mono tracking-wider transition-colors cursor-pointer flex items-center gap-1"
                  title="Log out from dashboard session"
                >
                  Sign Out 🔗
                </button>
              </div>

              {/* Dark mode selector button */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 text-slate-500 dark:text-slate-400 cursor-pointer shadow-xs transition-all"
                title="Toggle theme mode"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            </div>
        </header>

        {/* Central columns Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Workspaces & configuration tools */}
          <main className="lg:col-span-8 space-y-6">
            
            {/* Nav Workspace tabs */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 p-1.5 rounded-2xl flex flex-wrap items-center gap-1">
              <button
                onClick={() => setActiveTab("builder")}
                className={`flex-1 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeTab === "builder" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/15" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-950/40"
                }`}
              >
                <Layout className="w-4 h-4" /> Layout Builder
              </button>
              
              <button
                onClick={() => setActiveTab("analytics")}
                className={`flex-1 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeTab === "analytics" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/15" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-950/40"
                }`}
              >
                <BarChart3 className="w-4 h-4" /> Analytics
              </button>

              <button
                onClick={() => setActiveTab("milestones")}
                className={`flex-1 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeTab === "milestones" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/15" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-950/40"
                }`}
              >
                <Bell className="w-4 h-4" /> Goals & Alerts
              </button>

              <button
                onClick={() => setActiveTab("hashtags")}
                className={`flex-1 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  activeTab === "hashtags" 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-950/15" 
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-950/40"
                }`}
              >
                <Sparkles className="w-4 h-4" /> AI Tag Suggest
              </button>
            </div>

            {/* TAB CONTAINER: Layout Builder */}
            {activeTab === "builder" && (
              <div className="space-y-6">
                
                {/* 1. Custom bio metadata editor */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1">
                    <Sparkle className="w-4.5 h-4.5 text-indigo-500" /> Page Master Identity
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start pt-2">
                    
                    {/* Avatar setup */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Avatar URL</label>
                      <input 
                        type="text" 
                        value={profileImage}
                        onChange={(e) => setProfileImage(e.target.value)}
                        placeholder="Image URL link..."
                        className="text-xs px-3 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500"
                      />
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                        <span>Tip: Standard absolute URL schemas</span>
                      </div>
                    </div>

                    {/* Display name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Display Name</label>
                      <input 
                        type="text" 
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        placeholder="e.g. Raymond Oyondi"
                        className="text-xs px-3 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                      />
                    </div>

                    {/* Page alignment controls */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Layout Alignment</label>
                      <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-1">
                        {(["left", "center", "right"] as const).map((align) => (
                          <button
                            key={align}
                            onClick={() => setAlignment(align)}
                            className={`flex-1 text-[11px] font-bold py-1.5 rounded-lg capitalize cursor-pointer transition-all ${
                              alignment === align 
                                ? "bg-white dark:bg-slate-850 text-slate-900 dark:text-white shadow-xs" 
                                : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Short bio */}
                    <div className="md:col-span-3 flex flex-col gap-1.5 mt-2">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono font-bold">Bio Description</label>
                      <textarea 
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        placeholder="Write a custom headline that defines your personal credentials..."
                        rows={2}
                        className="text-xs px-3 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                      />
                    </div>
                  </div>
                </section>

                {/* 2. Platform connection details integration */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-emerald-500" /> Secure Social Presences Handles
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Connect official media presences. Valid platform API standards structure handles instantly into horizontal profile tiles.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
                    {/* Instagram */}
                    <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-white/[0.03]">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-450 flex items-center gap-1 font-mono">
                        <Instagram className="w-3 h-3 text-pink-500" /> Instagram
                      </span>
                      <input 
                        type="text" 
                        value={socialHandles.instagram}
                        onChange={(e) => setSocialHandles({...socialHandles, instagram: e.target.value})}
                        className="bg-transparent text-xs font-mono font-semibold border-0 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 mt-1"
                        placeholder="@username"
                      />
                    </div>

                    {/* LinkedIn */}
                    <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-white/[0.03]">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-450 flex items-center gap-1 font-mono">
                        <Linkedin className="w-3 h-3 text-blue-500" /> LinkedIn
                      </span>
                      <input 
                        type="text" 
                        value={socialHandles.linkedin}
                        onChange={(e) => setSocialHandles({...socialHandles, linkedin: e.target.value})}
                        className="bg-transparent text-xs font-mono font-semibold border-0 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 mt-1"
                        placeholder="profile-id"
                      />
                    </div>

                    {/* Twitter */}
                    <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-white/[0.03]">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-450 flex items-center gap-1 font-mono">
                        <Twitter className="w-3 h-3 text-sky-400" /> Twitter
                      </span>
                      <input 
                        type="text" 
                        value={socialHandles.twitter}
                        onChange={(e) => setSocialHandles({...socialHandles, twitter: e.target.value})}
                        className="bg-transparent text-xs font-mono font-semibold border-0 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 mt-1"
                        placeholder="handle"
                      />
                    </div>

                    {/* GitHub */}
                    <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-white/[0.03]">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-450 flex items-center gap-1 font-mono">
                        <Github className="w-3 h-3 text-slate-700 dark:text-slate-350" /> GitHub
                      </span>
                      <input 
                        type="text" 
                        value={socialHandles.github}
                        onChange={(e) => setSocialHandles({...socialHandles, github: e.target.value})}
                        className="bg-transparent text-xs font-mono font-semibold border-0 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 mt-1"
                        placeholder="user"
                      />
                    </div>

                    {/* TikTok */}
                    <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-white/[0.03]">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-450 flex font-mono">
                        TikTok
                      </span>
                      <input 
                        type="text" 
                        value={socialHandles.tiktok}
                        onChange={(e) => setSocialHandles({...socialHandles, tiktok: e.target.value})}
                        className="bg-transparent text-xs font-mono font-semibold border-0 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 mt-1"
                        placeholder="user"
                      />
                    </div>

                    {/* Peerlist */}
                    <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-white/[0.03]">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-455 text-emerald-500 font-mono">
                        Peerlist
                      </span>
                      <input 
                        type="text" 
                        value={socialHandles.peerlist}
                        onChange={(e) => setSocialHandles({...socialHandles, peerlist: e.target.value})}
                        className="bg-transparent text-xs font-mono font-semibold border-0 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 mt-1"
                        placeholder="peerlist-user"
                      />
                    </div>

                    {/* Gmail */}
                    <div className="flex flex-col gap-1 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-150 dark:border-white/[0.03] sm:col-span-2">
                      <span className="text-[9px] uppercase font-bold tracking-wider text-slate-450 flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3 text-red-400" /> Gmail Integration
                      </span>
                      <input 
                        type="email" 
                        value={socialHandles.gmail}
                        onChange={(e) => setSocialHandles({...socialHandles, gmail: e.target.value})}
                        className="bg-transparent text-xs font-mono font-semibold border-0 focus:outline-none focus:ring-0 text-slate-800 dark:text-slate-200 mt-1"
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </section>

                {/* 3. Theme Preset Customizers */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6 space-y-4">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1">
                    <LayoutGrid className="w-4.5 h-4.5 text-indigo-500" /> Premium Bio Themes Customizers
                  </h3>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {THEME_PRESETS.map((th) => {
                      const isSelected = selectedThemeId === th.id;
                      return (
                        <button
                          key={th.id}
                          onClick={() => setSelectedThemeId(th.id)}
                          className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between h-24 relative overflow-hidden cursor-pointer transition-all ${
                            isSelected 
                              ? "border-indigo-500 ring-1 ring-indigo-500/20 bg-indigo-50/10 dark:bg-slate-950/60" 
                              : "border-slate-200 dark:border-white/5 hover:border-slate-350 dark:hover:border-white/10"
                          }`}
                        >
                          {/* Accent dot */}
                          {isSelected && (
                            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-indigo-500" />
                          )}
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white block truncate">{th.name}</span>
                            <span className="text-[9px] text-slate-400 font-bold tracking-wider uppercase mt-0.5 block">
                              {th.isDark ? "Dark Variant" : "Light Variant"}
                            </span>
                          </div>
                          {/* Mini visual mockup card */}
                          <div className={`w-full h-3 rounded-lg ${th.backgroundClass} border border-white/10 flex items-center justify-center`}>
                            <div className={`w-[70%] h-1 rounded-xs ${th.cardBgClass}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </section>

                {/* 4. DRAG-AND-DROP REORDER LINK ORGANIZER & EDITOR */}
                <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-white/5 mb-6">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Link2 className="w-4.5 h-4.5 text-indigo-500" /> Drag-and-drop Link Organization
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        Use vertical arrows to slide-coordinate link order. Dynamic framer layouts reflect on profile.
                      </p>
                    </div>
                  </div>

                  {/* Add New Link inline panel */}
                  <form onSubmit={handleAddLink} className="p-4 bg-slate-50 dark:bg-slate-950/60 rounded-2xl border border-slate-150 dark:border-white/5 mb-6 grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Title</span>
                      <input 
                        type="text" 
                        required
                        value={newLinkTitle}
                        onChange={(e) => setNewLinkTitle(e.target.value)}
                        placeholder="e.g. Subscribe to Newsletter"
                        className="text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Destination URL</span>
                      <input 
                        type="text" 
                        required
                        value={newLinkUrl}
                        onChange={(e) => setNewLinkUrl(e.target.value)}
                        placeholder="e.g. substack.com/me"
                        className="text-xs px-3 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Platform Group</span>
                      <div className="flex items-center gap-1.5">
                        <select 
                          value={newLinkPlatform}
                          onChange={(e: any) => setNewLinkPlatform(e.target.value)}
                          className="flex-1 text-xs px-2 py-2 rounded-lg bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-850 dark:text-slate-200 focus:outline-none cursor-pointer"
                        >
                          <option value="custom">General Link</option>
                          <option value="instagram">Instagram</option>
                          <option value="tiktok">TikTok</option>
                          <option value="twitter">Twitter</option>
                          <option value="linkedin">LinkedIn</option>
                          <option value="peerlist">Peerlist</option>
                          <option value="github">GitHub</option>
                          <option value="gmail">Gmail Email</option>
                        </select>
                        <button 
                          type="submit"
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs cursor-pointer select-none"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Active List Reordering Grid */}
                  <div className="space-y-3.5">
                    <AnimatePresence initial={false}>
                      {links.map((link, idx) => (
                        <motion.div
                          key={link.id}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/20 border border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}
                        >
                          <div className="flex items-center gap-3 w-full sm:w-[65%]">
                            
                            {/* Slide Ordering arrows represent tactile drag operations beautifully */}
                            <div className="flex flex-col gap-0.5 shrink-0 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 p-0.5 rounded-lg">
                              <button
                                type="button"
                                disabled={idx === 0}
                                onClick={() => moveLink(idx, "up")}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm disabled:opacity-20 text-slate-500 cursor-pointer"
                                title="Move link card up"
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                disabled={idx === links.length - 1}
                                onClick={() => moveLink(idx, "down")}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-sm disabled:opacity-20 text-slate-500 cursor-pointer"
                                title="Move link card down"
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Info */}
                            <div className="truncate space-y-0.5 flex-1">
                              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900 dark:text-white">
                                <span className="capitalize px-1.5 py-0.5 text-[9px] tracking-wider font-extrabold bg-indigo-500/10 text-indigo-500 rounded-sm font-mono border border-indigo-500/10">
                                  {link.platform}
                                </span>
                                <span className="truncate">{link.title || "Untitled Link"}</span>
                              </div>
                              <p className="text-[10px] text-slate-550 dark:text-slate-400 font-mono truncate">{link.url}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2.5 sm:pt-0">
                            
                            {/* Indicators of clicks */}
                            <div className="text-left sm:text-right font-mono">
                              <span className="text-[10px] text-slate-400 block uppercase font-bold tracking-wider">Metrics</span>
                              <span className="text-xs font-black text-slate-900 dark:text-white block mt-0.5">{link.clickCount.toLocaleString()} clicks</span>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Publish Visibility Toggle */}
                              <button
                                type="button"
                                onClick={() => togglePublish(link.id)}
                                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                                  link.isPublished 
                                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/15" 
                                    : "bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-white/5 hover:text-slate-600"
                                }`}
                                title={link.isPublished ? "Published (Live)" : "Hidden (Draft)"}
                              >
                                {link.isPublished ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => handleDeleteLink(link.id)}
                                className="p-2 rounded-xl bg-rose-500/10 text-rose-500 border border-rose-500/15 hover:bg-rose-550/15 cursor-pointer transition-all"
                                title="Remove link"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>

                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </section>

              </div>
            )}

            {/* TAB CONTAINER: Analytics */}
            {activeTab === "analytics" && (
              <AnalyticsDashboard 
                links={links}
                profileName={profileName}
                theme={activeTheme}
                liveStatsMultiplier={links.length}
              />
            )}

            {/* TAB CONTAINER: Goals & Alerts */}
            {activeTab === "milestones" && (
              <MilestoneAlerts 
                milestones={milestones}
                onUpdateMilestones={setMilestones}
                userRole={userRole}
                onRoleChange={setUserRole}
                currentClicks={links.reduce((acc, curr) => acc + curr.clickCount, 0)}
              />
            )}

            {/* TAB CONTAINER: AI Tag Suggest */}
            {activeTab === "hashtags" && (
              <HashtagSuggester />
            )}

          </main>

          {/* RIGHT: Live device view preview */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5 mb-4">
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  Standard Profile Preview
                </span>
                <span className="text-[10px] bg-indigo-500/10 text-indigo-500 font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                  Interactive
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
                Interactions made directly inside this mock device increment the link clicks in real-time, testing layout builder alignments and dashboard telemetry.
              </p>

              <PhonePreview
                theme={activeTheme}
                profileName={profileName}
                profileBio={profileBio}
                profileImage={profileImage}
                links={links}
                customStyles={{
                  buttonStyle: "soft",
                  alignment,
                  shadowSize,
                }}
                onLinkMockClick={handlePhoneLinkClick}
                socialHandles={socialHandles}
              />
            </div>
          </aside>

        </div>

      </div>
      )}

      {/* Unified Company Footer Section */}
      <footer className="mt-16 border-t border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-900/10 transition-colors">
        <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
            {/* Column 1 - Brand description */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔗</span>
                <span className="text-sm font-black tracking-widest font-mono text-slate-900 dark:text-white">
                  Linkify
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
                Deploying ultra-fast, data-driven Link-In-Bio profiles styled for designers, creators, and brands. Optimized connection redirection with millisecond precision.
              </p>
              <div className="text-[11px] text-slate-400 font-mono">
                &copy; {new Date().getFullYear()} Linkify
              </div>
            </div>

            {/* Column 2 - Product Features */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest font-mono">
                Product Features
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveCompanyPage("Profile Builder")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left font-medium">
                    Profile Builder
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCompanyPage("Clickstream Analytics")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left font-medium">
                    Clickstream Analytics
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCompanyPage("Milestones & Alerts")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left font-medium">
                    Milestones & Alerts
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCompanyPage("AI Hashtag Suggester")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left font-medium">
                    AI Hashtag Suggester
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3 - Corporate Pages */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest font-mono">
                Corporate Pages
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveCompanyPage("About Us")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left font-medium">
                    About Our Platform
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCompanyPage("Careers")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left flex items-center gap-1.5 font-medium">
                    Careers <span className="bg-indigo-500/15 text-indigo-500 font-bold px-1.5 py-0.2 rounded text-[8px]">HIRING</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCompanyPage("Press Kit")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left font-medium">
                    Press & Media Pack
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCompanyPage("Support Center")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left font-medium">
                    Support & FAQs
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4 - Legal / Developers */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-black text-slate-900 dark:text-slate-200 uppercase tracking-widest font-mono">
                Legal & Developer API
              </h5>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setActiveCompanyPage("Developer API Docs")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left font-mono text-[11px]">
                    JSON API Integrations
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCompanyPage("Terms of Service")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left font-medium">
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveCompanyPage("Privacy Shield Policy")} className="text-slate-500 dark:text-slate-400 hover:text-indigo-500 transition-colors cursor-pointer text-left font-medium">
                    Privacy Shield Policy
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono tracking-wider text-center md:text-left pb-1">
              Linkify Referral Portal &bull; Styled Minimalist Directory
            </p>
            <div className="flex gap-4">
              <span className="text-xs text-slate-400">Active Node Secured</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Corporate Page Modal */}
      <AnimatePresence>
        {activeCompanyPage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/10 rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center pb-4 border-b border-slate-105 dark:border-white/5 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔗</span>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight font-mono">
                    {activeCompanyPage}
                  </h3>
                </div>
                <button
                  onClick={closeCompanyModal}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-350 p-1.5 rounded-lg text-xs font-black transition-colors cursor-pointer font-mono"
                >
                  [CLOSE ✕]
                </button>
              </div>

              {/* Dynamic Pages Content */}
              <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                {activeCompanyPage === "Profile Builder" && (
                  <div className="space-y-4">
                    <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">Deploy dynamic, visual referral trees with ease</p>
                    <p>
                      The Profile Builder is the central styling hub of your Linkify workspace. It provides layout alignment utilities, responsive styling presets, dynamic social handle mapping, and real-time live preview synchronization.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-white/5 font-mono text-[11px] text-slate-400 space-y-1">
                      <div>&bull; Theme Presets: Supports Classic Minimal, Glassmorphism, Tokyo Warmth, Cyberpunk, and many more.</div>
                      <div>&bull; Instant Mapping: Bind top social platforms instantly to direct visitors to your verified domains.</div>
                      <div>&bull; Drag & Layout Customizer: Order items with pixel-level alignment control.</div>
                    </div>
                  </div>
                )}

                {activeCompanyPage === "Clickstream Analytics" && (
                  <div className="space-y-4">
                    <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">Deep telemetry and millisecond-level redirect tracking</p>
                    <p>
                      Keep close track of which channels yield the highest conversion value with detailed analytics counters. Interactions within your live profile trigger real-time metrics capture immediately.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-white/5 font-mono text-[11px] text-slate-400 space-y-1">
                      <div>&bull; Real-time Clicks: Track absolute counts for every single action.</div>
                      <div>&bull; CTR Optimization: View aggregated Click-Through Rates to evaluate social presence performance.</div>
                      <div>&bull; Mock Simulations: Test configurations inside an interactive model preview to preview traffic paths.</div>
                    </div>
                  </div>
                )}

                {activeCompanyPage === "Milestones & Alerts" && (
                  <div className="space-y-4">
                    <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">Configure progress-driven conversion benchmarks</p>
                    <p>
                      Define target milestones for your social campaigns. Set target click thresholds for specific handles or your entire profile. When visitors cross designated milestones, the application highlights milestone badges and alerts the user.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-white/5 font-mono text-[11px] text-slate-400 space-y-1">
                      <div>&bull; Target Benchmarks: Define 100, 500, or 1000+ click limits for your profiles.</div>
                      <div>&bull; Visual Celebration: Complete steps with success icons, dynamic alert progress bars, and celebration banners.</div>
                      <div>&bull; Smart Alert Push: Monitor traffic velocities dynamically on your dashboard view.</div>
                    </div>
                  </div>
                )}

                {activeCompanyPage === "AI Hashtag Suggester" && (
                  <div className="space-y-4">
                    <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">Generate high-converting tags powered by Google Gemini API</p>
                    <p>
                      Struggling with post discoverability? The AI Hashtag Suggester processes your chosen digital niche (such as tech development, online retail, lifestyle curation) and produces optimization tags.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-white/5 font-mono text-[11px] text-slate-400 space-y-1">
                      <div>&bull; Secure Proxying: API keys stay hidden inside the server side to maintain top cyber safety protocols.</div>
                      <div>&bull; Audience Sentiment Alignment: Generates tags paired elegantly with active campaign contexts.</div>
                      <div>&bull; Single-click Clipboard Copying: Swift selection copy directly from the dashboard workspace.</div>
                    </div>
                  </div>
                )}

                {activeCompanyPage === "About Us" && (
                  <div className="space-y-4">
                    <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">Connecting social reach with real-time conversion telemetry</p>
                    <p>
                      At Linkify, we believe your digital footprint shouldn't be scattered across disconnected channels. Founded in 2026, Linkify delivers single-view directory portals configured for creators, marketers, and modern developers who require deep analytics visibility.
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-white/5 font-mono text-[11px] text-slate-400">
                      &bull; Mission: Enable seamless clickstream optimization for millions of creators worldwide.<br/>
                      &bull; Core Values: Design humility, modular flexibility, absolute port transparency.
                    </div>
                  </div>
                )}

                {activeCompanyPage === "Careers" && (
                  <div className="space-y-4 font-normal">
                    {!selectedJobRole ? (
                      <>
                        <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">Come build the future of referral analytics (100% Remote)</p>
                        <p>
                          We're looking for passionate designers, systems developers, and digital architects to build robust routing infrastructure. We run a fully decentralized organization.
                        </p>
                        <div className="space-y-3 pt-2">
                          <div className="border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-black">
                            <div>
                              <p className="font-bold text-zinc-100 font-mono">1. Senior Full-Stack Node Engineer</p>
                              <p className="text-[10px] text-zinc-400 font-mono">TypeScript / Node.js / Clickstream caching</p>
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedJobRole("Senior Full-Stack Node Engineer");
                                setApplicationSubmitted(false);
                              }} 
                              className="bg-id-custom bg-indigo-600 text-white text-[10px] px-3.5 py-2 rounded-md font-black hover:bg-indigo-500 cursor-pointer uppercase font-mono transition-colors shrink-0"
                            >
                              Apply For Node Engineer
                            </button>
                          </div>
                          
                          <div className="border border-zinc-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-black">
                            <div>
                              <p className="font-bold text-zinc-100 font-mono">2. Visual UX UI Architect</p>
                              <p className="text-[10px] text-zinc-400 font-mono">Figma / TailwindCSS / Motion preset design</p>
                            </div>
                            <button 
                              onClick={() => {
                                setSelectedJobRole("Visual UX UI Architect");
                                setApplicationSubmitted(false);
                              }} 
                              className="bg-id-custom bg-indigo-600 text-white text-[10px] px-3.5 py-2 rounded-md font-black hover:bg-indigo-500 cursor-pointer uppercase font-mono transition-colors shrink-0"
                            >
                              Apply For UX UI Architect
                            </button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-4 border border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-white/5">
                          <div>
                            <span className="text-[9px] font-black uppercase text-indigo-500 tracking-wider font-mono">Role Application</span>
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white font-mono">{selectedJobRole}</h4>
                          </div>
                          <button 
                            onClick={() => setSelectedJobRole(null)}
                            className="text-[10px] text-slate-400 hover:text-slate-600 dark:hover:text-white uppercase font-mono tracking-wider cursor-pointer font-bold"
                          >
                            &larr; Back to Listings
                          </button>
                        </div>

                        {applicationSubmitted ? (
                          <div className="py-6 text-center space-y-3">
                            <span className="text-4xl">🚀</span>
                            <h5 className="text-sm font-black text-emerald-500 uppercase font-mono">Application Submitted!</h5>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                              Thank you for applying, <span className="font-bold text-slate-800 dark:text-slate-200">{applicantName}</span>. Your nomination package is encrypted and securely saved within our node registry. Reference: <span className="font-mono text-indigo-500">LNK-{Math.floor(Math.random() * 90000 + 10000)}</span>.
                            </p>
                            <button 
                              onClick={() => {
                                setSelectedJobRole(null);
                                setApplicationSubmitted(false);
                              }}
                              className="mt-4 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-[10px] uppercase font-mono font-black py-2 px-4 rounded-xl hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                            >
                              View Other Roles
                            </button>
                          </div>
                        ) : (
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              if (!applicantName.trim() || !applicantEmail.trim()) return;
                              setApplicationSubmitted(true);
                            }}
                            className="space-y-3.5 pt-2"
                          >
                            <div>
                              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono mb-1">Your Full Name</label>
                              <input 
                                type="text"
                                required
                                value={applicantName}
                                onChange={(e) => setApplicantName(e.target.value)}
                                placeholder="e.g. Robin Banks"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono mb-1">Email Address</label>
                              <input 
                                type="email"
                                required
                                value={applicantEmail}
                                onChange={(e) => setApplicantEmail(e.target.value)}
                                placeholder="robin@example.com"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono mb-1">Portfolio or GitHub Link</label>
                              <input 
                                type="url"
                                required
                                value={applicantPortfolio}
                                onChange={(e) => setApplicantPortfolio(e.target.value)}
                                placeholder="https://github.com/robin-dev"
                                className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-slate-950 dark:text-white font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono mb-1">Why do you want to join Linkify?</label>
                              <textarea 
                                rows={3}
                                value={applicantCoverLetter}
                                onChange={(e) => setApplicantCoverLetter(e.target.value)}
                                placeholder="Tell us about your background styling responsive interfaces or designing clickstream caching systems..."
                                className="w-full bg-white dark:bg-slate-900 border border-slate-250 dark:border-white/10 rounded-xl px-3.5 py-2 text-xs text-slate-950 dark:text-white font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
                              />
                            </div>

                            <div className="flex gap-2.5 pt-2">
                              <button 
                                type="button"
                                onClick={() => setSelectedJobRole(null)}
                                className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-330 text-[10px] font-black uppercase tracking-wider py-3 rounded-xl transition-colors font-mono cursor-pointer text-center"
                              >
                                Cancel
                              </button>
                              <button 
                                type="submit"
                                className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-wider py-3 rounded-xl transition-colors font-mono cursor-pointer"
                              >
                                Submit Application 🚀
                              </button>
                            </div>
                          </form>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeCompanyPage === "Press Kit" && (
                  <div className="space-y-4">
                    <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 font-mono">Linkify Brand and Media Identity Assets</p>
                    <p>
                      Download verified media kits including high-resolution vector logos, color spectrum guides, and typographic pairings for publication.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-dashed border-slate-250 dark:border-white/10 p-4 rounded-xl text-center space-y-2">
                        <span className="text-3xl">🔗</span>
                        <p className="font-bold text-[10px] font-mono text-slate-400">VECTOR_LOGO.SVG</p>
                        <button onClick={() => alert("Downloading default vector logo assets...")} className="text-indigo-500 hover:underline font-bold text-[10px] uppercase font-mono cursor-pointer">Download</button>
                      </div>
                      <div className="border border-dashed border-slate-250 dark:border-white/10 p-4 rounded-xl text-center space-y-2">
                        <span className="text-3xl">🎨</span>
                        <p className="font-bold text-[10px] font-mono text-slate-400">PALETTE_GUIDE.PDF</p>
                        <button onClick={() => alert("Downloading color scheme guidelines...")} className="text-indigo-500 hover:underline font-bold text-[10px] uppercase font-mono cursor-pointer">Download</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeCompanyPage === "Support Center" && (
                  <div className="space-y-4">
                    <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 font-mono">Help Center & Connection FAQs</p>
                    <div className="space-y-3">
                      <details className="border border-slate-200 dark:border-white/5 p-3 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-950">
                        <summary className="font-semibold text-xs text-slate-900 dark:text-white">How do I verify external redirect channels?</summary>
                        <p className="mt-2 text-slate-500 text-[11px] leading-relaxed pl-2 border-l-2 border-indigo-500">Go to the builder panel, enter your desired handles in the platform list, and click "Deploy handles". Clickstream links will route through Linkify core immediately.</p>
                      </details>
                      <details className="border border-slate-200 dark:border-white/5 p-3 rounded-xl cursor-pointer bg-slate-50 dark:bg-slate-950">
                        <summary className="font-semibold text-xs text-slate-900 dark:text-white">Why does TikTok and Peerlist route clicks dynamically?</summary>
                        <p className="mt-2 text-slate-500 text-[11px] leading-relaxed pl-2 border-l-2 border-indigo-500">By proxying links using secure node redirects, we prevent click data leakage and aggregate analytics metrics on a unified dashboard to provide verified telemetry.</p>
                      </details>
                    </div>
                  </div>
                )}

                {activeCompanyPage === "Developer API Docs" && (
                  <div className="space-y-4">
                    <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400 font-mono">Clickstream Webhook Retrieval Docs</p>
                    <p>Integrate Linkify directly with external servers or analytics databases via standard JSON API requests.</p>
                    <div className="bg-slate-955 text-emerald-400 p-4 rounded-xl font-mono text-[10px] space-y-2 overflow-x-auto border border-emerald-500/20">
                      <div>GET /api/v1/telemetry/stats</div>
                      <div>Host: localhost:3000</div>
                      <div>Authorization: Bearer <span className="text-indigo-400">linkify_live_sec_token</span></div>
                      <div className="text-slate-400 pt-2">{`{`}</div>
                      <div className="text-slate-400">{`  "node": "linkify_port3000_core",`}</div>
                      <div className="text-slate-400">{`  "active_creator": "${profileName}",`}</div>
                      <div className="text-slate-400">{`  "total_clicks": ${links.reduce((acc, curr) => acc + curr.clickCount, 0)},`}</div>
                      <div className="text-slate-400">{`  "live_ctr": "11.8%"`}</div>
                      <div className="text-slate-400">{`}`}</div>
                    </div>
                  </div>
                )}

                {activeCompanyPage === "Terms of Service" && (
                  <div className="space-y-4">
                    <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">Terms and Conditions of Referral Service Deployment</p>
                    <p>
                      By operating a Creator Node on Linkify (Port 3000), you agree to represent verified personal platforms. Phishing links, malicious redirect routes, or spoofed identifiers (e.g. replicating private company trademarks) is strictly forbidden.
                    </p>
                    <p>
                      Linkify provides real-time click aggregation. We assume no liability for the downstream products, video postings, or visual images published on your claimed handles.
                    </p>
                  </div>
                )}

                {activeCompanyPage === "Privacy Shield Policy" && (
                  <div className="space-y-4">
                    <p className="font-extrabold text-sm text-indigo-600 dark:text-indigo-400">Absolute Non-Leakage Browser Privacy Framework</p>
                    <p>
                      We enforce safe local user caching profiles. Your verified credentials (usernames, email paths, configured layout dimensions) are strictly preserved on client memory routers and are never transmitted to unverified tracking platforms.
                    </p>
                    <p>
                      Our system is compliant with local regulations and contains optional sandbox security configurations.
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/5 flex justify-end">
                <button
                  onClick={closeCompanyModal}
                  className="bg-indigo-600 text-white font-extrabold text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl hover:bg-indigo-500 cursor-pointer transition-all font-mono"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
