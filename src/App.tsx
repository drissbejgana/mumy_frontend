import React, { useState, useEffect } from "react";
import { 
  ShieldAlert, Sparkles, CheckCircle2, User, 
  MapPin, HelpCircle, BadgeInfo, Zap, TrendingUp, AlertCircle, ShoppingBag, 
  Terminal, ShieldCheck, Database, FileText, Search, CreditCard, LogOut, Lock, 
  ArrowRight, Shield, Download, RefreshCw, BarChart3, Filter, Trash2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import FAQ from "./components/FAQ";
import { Hero, FeaturedOnSection, FearSection, HowItWorks, AgentExplainer, PricingSection, Footer, MarketplacesSection } from "./components/LandingSections";
import { LogoIcon } from "./components/LogoIcon";
import ScanForm from "./components/ScanForm";
import ScanProgress from "./components/ScanProgress";
import ResultDashboard from "./components/ResultDashboard";
import { PrivacyPolicyView, TermsOfServiceView } from "./components/LegalTexts";
import { AdminDashboard } from "./components/AdminComponents";
import AdminLoginPage from "./components/AdminLoginPage";
import { PWAInstallBanner } from "./components/PWAInstallBanner";
import { useGoogleLogin } from "@react-oauth/google";
import { msalInstance, msalReady, msalRedirectResult, isMicrosoftConfigured } from "./msalConfig";
import { apiFetch, setToken, clearAuth, getToken } from "./api";
import { UserProfile, ScanResult } from "./types";

export default function App() {
  const [view, setView] = useState<string>("landing");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Auth Form State
  const [authError, setAuthError] = useState("");
  const [refLinkCopied, setRefLinkCopied] = useState(false);

  // Scanner States
  const [scanLoading, setScanLoading] = useState(false);
  const [activeScanPayload, setActiveScanPayload] = useState<{ marketplace: string } | null>(null);
  const [currentScanResult, setCurrentScanResult] = useState<ScanResult | null>(null);

  // History / Dashboard Fetching States
  const [scansHistory, setScansHistory] = useState<ScanResult[]>([]);
  const [historyFilterMarketplace, setHistoryFilterMarketplace] = useState("all");
  const [historyFilterVerdict, setHistoryFilterVerdict] = useState("all");
  const [adminStats, setAdminStats] = useState<any>(null);
  const [adminLoading, setAdminLoading] = useState(false);

  // Alert Dialog Deletion States
  const [deleteConfirmScanId, setDeleteConfirmScanId] = useState<string | null>(null);

  // Pricing modal
  const [showPricingModal, setShowPricingModal] = useState(false);

  // Restore session from localStorage and detect Stripe payment redirects
  useEffect(() => {
    const saved = localStorage.getItem("mumy_user");
    if (saved && getToken()) {
      try { setUser(JSON.parse(saved)); } catch {}
    }
    const params = new URLSearchParams(window.location.search);
    const payment = params.get("payment");
    if (payment === "success") setView("success");
    else if (payment === "cancelled") setView("cancel");
    // Persist affiliate referral code across the session
    const ref = params.get("ref");
    if (ref) sessionStorage.setItem("mumy_ref", ref);
  }, []);

  // Handle Microsoft redirect flow (fires when popup was blocked and MSAL
  // fell back to full-page redirect — processes the #code in the URL)
  useEffect(() => {
    if (!isMicrosoftConfigured) return;
    msalRedirectResult
      .then(async (result) => {
        if (!result?.accessToken) return;
        try {
          const response = await apiFetch("/api/auth/microsoft", {
            method: "POST",
            body: JSON.stringify({
              accessToken: result.accessToken,
              refCode: sessionStorage.getItem("mumy_ref") ?? undefined,
            }),
          });
          sessionStorage.removeItem("mumy_ref");
          const data = await response.json();
          if (data.success) {
            setToken(data.token);
            localStorage.setItem("mumy_user", JSON.stringify(data.user));
            setUser(data.user);
            setView("scanner");
            window.history.replaceState({}, document.title, window.location.pathname);
          } else {
            setAuthError(data.error || "Microsoft sign-in failed.");
            setView("login");
          }
        } catch (e: any) {
          console.error("[MS redirect] backend call failed:", e);
          setAuthError("Microsoft sign-in error: " + (e?.message ?? "network error"));
          setView("login");
        }
      })
      .catch((e: any) => {
        console.error("[MS redirect] MSAL handleRedirectPromise failed:", e);
        // Clear stale MSAL interaction state so the next attempt works
        Object.keys(sessionStorage)
          .filter(k => k.startsWith("msal."))
          .forEach(k => sessionStorage.removeItem(k));
        setAuthError("Microsoft sign-in error: " + (e?.errorMessage ?? e?.message ?? String(e)));
        setView("login");
      });
  }, []); // eslint-disable-line

  // Redirect logged-in users away from landing page to scanner
  useEffect(() => {
    if (user && view === "landing") {
      setView("scanner");
    }
  }, [user, view]);

  // Quick live synchronization when navigation happens
  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchUserHistory();
    }
    // Simple custom routing listening to hash changes
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash === "admin") {
        setView(user?.role === "admin" ? "admin" : "admin-login");
        return;
      }
      if (hash && ["landing", "scanner", "history", "dashboard", "privacy", "terms"].includes(hash)) {
        setView(hash);
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [view]);

  // Sync profile details (such as credits)
  const fetchUserProfile = async () => {
    if (!user) return;
    try {
      const response = await apiFetch(`/api/users/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (e) {
      console.error("Error syncing profile details", e);
    }
  };

  const fetchUserHistory = async () => {
    if (!user) return;
    try {
      const response = await apiFetch(`/api/scans/user/${user.uid}`);
      if (response.ok) {
        const data = await response.json();
        setScansHistory(data);
      }
    } catch (e) {
      console.error("Error fetching scan history list", e);
    }
  };

  const fetchAdminStats = async () => {
    if (!user || user.role !== "admin") return;
    setAdminLoading(true);
    try {
      const response = await apiFetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setAdminStats(data);
      }
    } catch (e) {
      console.error("Error fetching admin metrics", e);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    if (view === "admin") {
      fetchAdminStats();
    }
    if (view === "success") {
      const sessionId = new URLSearchParams(window.location.search).get("session_id");
      if (sessionId) {
        apiFetch("/api/success-sync", {
          method: "POST",
          body: JSON.stringify({ sessionId })
        }).then(res => res.json()).then(data => {
          if (data.success) {
            localStorage.setItem("mumy_user", JSON.stringify(data.user));
            setUser(data.user);
          }
        });
      }
    }
  }, [view]);

  // Real Google OAuth via @react-oauth/google
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const response = await apiFetch("/api/auth/google", {
          method: "POST",
          body: JSON.stringify({
            accessToken: tokenResponse.access_token,
            refCode: sessionStorage.getItem("mumy_ref") ?? undefined,
          })
        });
        sessionStorage.removeItem("mumy_ref");
        const data = await response.json();
        if (data.success) {
          setToken(data.token);
          localStorage.setItem("mumy_user", JSON.stringify(data.user));
          setUser(data.user);
          setView("scanner");
        } else {
          setAuthError(data.error || "Google sign-in failed.");
        }
      } catch (e) {
        setAuthError("Google authentication error. Please try again.");
      }
    },
    onError: () => setAuthError("Google sign-in was cancelled or failed."),
  });

  const triggerGoogleLogin = () => googleLogin();

  // Microsoft OAuth via full-page redirect (more reliable than popup across browsers)
  const triggerMicrosoftLogin = async () => {
    try {
      await msalReady;
      // loginRedirect navigates the page away — result is handled in the
      // msalRedirectResult useEffect below when the page loads on return
      await msalInstance.loginRedirect({
        scopes: ["User.Read", "openid", "profile", "email"],
      });
    } catch (e: any) {
      console.error("[MS login] error:", e?.errorCode, e?.errorMessage ?? e?.message);
      const code = e?.errorCode ?? "";
      if (code === "user_cancelled" || code === "access_denied") return;
      if (code === "interaction_in_progress") {
        Object.keys(sessionStorage)
          .filter(k => k.startsWith("msal."))
          .forEach(k => sessionStorage.removeItem(k));
        setAuthError("Sign-in interrupted. Please click the Microsoft button again.");
        return;
      }
      setAuthError(
        e?.errorMessage
          ? `Microsoft: ${e.errorMessage}`
          : `Microsoft sign-in failed (${code || (e?.message ?? "unknown error")})`
      );
    }
  };

  // Complete Scanning dispatcher
  const handleRunScan = async (payload: {
    imageUrl: string;
    title: string;
    description: string;
    tags: string[];
    marketplace: string;
  }) => {
    if (!user) {
      setView("login");
      return;
    }
    setScanLoading(true);
    setCurrentScanResult(null);
    setActiveScanPayload({ marketplace: payload.marketplace });

    try {
      const response = await apiFetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          userId: user.uid
        })
      });
      if (response.ok) {
        const result = await response.json();
        setCurrentScanResult(result);
        fetchUserProfile(); // Synced scan credits limit
        fetchUserHistory(); // Refetch history lists
      } else {
        const errData = await response.json();
        alert(errData.error || "Compliance scan failed. Please check credits.");
      }
    } catch (err) {
      console.error(err);
      alert("A gateway error occurred during image vector evaluations.");
    } finally {
      setScanLoading(false);
    }
  };

  // Handle direct navigation to stripe simulation
  const handleStripeCheckout = async (plan: string, cycle: "monthly" | "yearly" = "monthly") => {
    if (!user) {
      setView("login");
      return;
    }
    try {
      const response = await apiFetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: plan,
          cycle,
          userId: user.uid,
          userEmail: user.email
        })
      });
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url; // Trigger checkout routing redirect
      }
    } catch (e) {
      console.error("Stripe gateway down", e);
    }
  };

  // Open Stripe Customer Portal
  const handleStripePortal = async () => {
    try {
      const response = await apiFetch("/api/stripe/portal", { method: "POST" });
      if (response.ok) {
        const data = await response.json();
        window.location.href = data.url;
      } else {
        const err = await response.json();
        alert(err.error || "Could not open billing portal.");
      }
    } catch (e) {
      console.error("Portal error", e);
    }
  };

  // Delete scan history
  const handleDeleteScan = async (scanId: string) => {
    try {
      const response = await apiFetch(`/api/scans/${scanId}`, { method: "DELETE" });
      if (response.ok) {
        setScansHistory(prev => prev.filter(s => s.scanId !== scanId));
        setDeleteConfirmScanId(null);
      }
    } catch (e) {
      console.error("Deletion error", e);
    }
  };

  // Admin lock actions (unban/ban accounts)
  const handleAdminToggleBan = async (uid: string, action: string) => {
    try {
      const response = await apiFetch("/api/admin/users/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, status: action })
      });
      if (response.ok) {
        fetchAdminStats();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Safe Navigation Helper that sets state & scroll reset
  const navigateTo = (route: string) => {
    setView(route);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setIsMobileMenuOpen(false);
  };

  // On-page anchor scroll helper for single-page navigation
  const scrollToSection = (sectionId: string) => {
    if (view !== "landing") {
      setView("landing");
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setIsMobileMenuOpen(false);
  };

  // CSV Exporter for Scans Listing
  const triggerCSVDownload = () => {
    if (scansHistory.length === 0) return;
    const headers = ["Scan ID", "Timestamp", "Marketplace", "Product Title", "Verdict", "Risk Score", "Detected Brand", "Advice"];
    const rows = scansHistory.map((s) => [
      s.scanId,
      s.timestamp,
      s.marketplace,
      `"${s.productTitle.replace(/"/g, '""')}"`,
      s.verdict,
      `${s.riskScore}%`,
      s.detectedBrand,
      `"${s.optimizationAdvice.replace(/"/g, '""').replace(/\n/g, ' ')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MUMY_IP_Scans_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Scan History listings
  const filteredHistory = scansHistory.filter((scan) => {
    const marketMatch = historyFilterMarketplace === "all" || scan.marketplace === historyFilterMarketplace;
    const verdictMatch = historyFilterVerdict === "all" || scan.verdict === historyFilterVerdict;
    return marketMatch && verdictMatch;
  });

  // Determines view categories: Is it a marketing landing context (requires dark theme, full-width) vs dashboard app view
  const isMarketingContext = ["landing", "privacy", "terms", "login", "signup", "success", "cancel"].includes(view);

  return (
    <div className="min-h-screen font-sans antialiased text-white flex flex-col bg-[#0a0a0a]">
      <PWAInstallBanner />

      {/* Visual Navigation Bar */}
      <nav className="w-full py-4 px-6 border-b transition-colors relative z-50 bg-[#0a0a0a]/90 border-white/10 text-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          <button
            onClick={() => navigateTo(user ? "scanner" : "landing")}
            className="flex items-center cursor-pointer text-left focus:outline-none"
            aria-label="Home"
          >
            <LogoIcon className="w-20 h-10" />
          </button>

          {/* Nav links (Desktop Only) */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-space font-bold uppercase tracking-wider">
            {user ? (
              /* Dashboard nav — only the three app sections */
              <>
                <button
                  onClick={() => navigateTo("scanner")}
                  className={`transition-colors cursor-pointer focus:outline-none ${view === "scanner" ? "text-[#2cff05] font-extrabold" : "text-gray-400 hover:text-white"}`}
                >
                  Analyze Listing
                </button>
                <button
                  onClick={() => navigateTo("history")}
                  className={`transition-colors cursor-pointer focus:outline-none ${view === "history" ? "text-[#2cff05] font-extrabold" : "text-gray-400 hover:text-white"}`}
                >
                  My Scans History
                </button>
                <button
                  onClick={() => navigateTo("dashboard")}
                  className={`transition-colors cursor-pointer focus:outline-none ${view === "dashboard" ? "text-[#2cff05] font-extrabold" : "text-gray-400 hover:text-white"}`}
                >
                  Dashboard
                </button>
                {user.role === "admin" && (
                  <button
                    onClick={() => navigateTo("admin")}
                    className="text-red-500 hover:text-red-400 font-extrabold flex items-center gap-1.5 cursor-pointer focus:outline-none text-xs font-space border border-red-500/30 px-2.5 py-1 rounded-lg hover:bg-red-500/10 transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" /> Admin
                  </button>
                )}
              </>
            ) : (
              /* Marketing nav — landing page sections */
              <>
                <button
                  onClick={() => scrollToSection("overview")}
                  className="text-gray-300 hover:text-[#2cff05] transition-colors cursor-pointer focus:outline-none"
                >
                  Overview
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-gray-300 hover:text-[#2cff05] transition-colors cursor-pointer focus:outline-none"
                >
                  How it works
                </button>
                <button
                  onClick={() => scrollToSection("safety-stack")}
                  className="text-gray-300 hover:text-[#2cff05] transition-colors cursor-pointer focus:outline-none"
                >
                  Safety Stack
                </button>
                <button
                  onClick={() => scrollToSection("marketplaces")}
                  className="text-gray-300 hover:text-[#2cff05] transition-colors cursor-pointer focus:outline-none"
                >
                  Marketplaces
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-gray-300 hover:text-[#2cff05] transition-colors cursor-pointer focus:outline-none"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-gray-300 hover:text-[#2cff05] transition-colors cursor-pointer focus:outline-none"
                >
                  FAQ
                </button>
              </>
            )}
          </div>

          {/* Account states & Hamburger Trigger (Right side) */}
          <div className="flex items-center gap-4">
            
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-bold leading-none text-white">
                    {user.displayName}
                  </span>
                  <span className="text-[10px] font-mono text-[#2cff05] font-bold mt-0.5">
                    {user.plan.toUpperCase()} LICENSE
                  </span>
                </div>
                <button
                  onClick={() => navigateTo("dashboard")}
                  className="p-2.5 bg-white/10 rounded-xl text-white hover:bg-white/20 transition-all cursor-pointer focus:outline-none"
                  title="My Profile"
                >
                  <User className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    clearAuth();
                    setUser(null);
                    setView("landing");
                  }}
                  className="p-2.5 text-gray-400 hover:text-red-400 rounded-xl hover:bg-white/10 transition-colors inline-flex cursor-pointer focus:outline-none"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <button
                  onClick={() => navigateTo("login")}
                  className="px-4 py-2 text-xs md:text-sm font-space font-bold cursor-pointer hover:underline focus:outline-none text-gray-300"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigateTo("login")}
                  className="bg-[#2323ff] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-space font-extrabold shadow-sm cursor-pointer glow-hover focus:outline-none"
                >
                  Sign Up Free
                </button>
              </div>
            )}

            {/* Mobile Responsive Hamburger Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border lg:hidden focus:outline-none transition-all bg-white/5 border-white/10 text-white hover:bg-white/10"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>

          </div>

        </div>
      </nav>

      {/* Mobile Menu Dropdown Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-b z-50 animate-in slide-in-from-top duration-200 bg-[#0b0b0b] border-white/10 text-white">
          <div className="flex flex-col p-6 space-y-4 text-xs font-space font-bold uppercase tracking-wider">
            {user ? (
              /* Dashboard mobile menu */
              <>
                <button
                  onClick={() => navigateTo("scanner")}
                  className={`text-left w-full py-2 transition-colors focus:outline-none ${view === "scanner" ? "text-[#2cff05]" : "text-gray-400 hover:text-white"}`}
                >
                  Analyze Listing
                </button>
                <button
                  onClick={() => navigateTo("history")}
                  className={`text-left w-full py-2 transition-colors focus:outline-none ${view === "history" ? "text-[#2cff05]" : "text-gray-400 hover:text-white"}`}
                >
                  My Scans History
                </button>
                <button
                  onClick={() => navigateTo("dashboard")}
                  className={`text-left w-full py-2 transition-colors focus:outline-none ${view === "dashboard" ? "text-[#2cff05]" : "text-gray-400 hover:text-white"}`}
                >
                  Dashboard
                </button>
                {user.role === "admin" && (
                  <button
                    onClick={() => navigateTo("admin")}
                    className="text-left w-full py-2 text-red-400 hover:text-red-300 transition-colors focus:outline-none"
                  >
                    Admin Console
                  </button>
                )}
                <div className="h-[1px] my-1 bg-white/10" />
                <button
                  onClick={() => {
                    clearAuth();
                    setUser(null);
                    setView("landing");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left w-full py-2 text-red-400 hover:text-red-300 transition-colors focus:outline-none"
                >
                  Logout
                </button>
              </>
            ) : (
              /* Marketing mobile menu */
              <>
                <button
                  onClick={() => scrollToSection("overview")}
                  className="text-left w-full py-2 hover:text-[#2cff05] transition-colors focus:outline-none"
                >
                  Overview
                </button>
                <button
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-left w-full py-2 hover:text-[#2cff05] transition-colors focus:outline-none"
                >
                  How it works
                </button>
                <button
                  onClick={() => scrollToSection("safety-stack")}
                  className="text-left w-full py-2 hover:text-[#2cff05] transition-colors focus:outline-none"
                >
                  Safety Stack
                </button>
                <button
                  onClick={() => scrollToSection("marketplaces")}
                  className="text-left w-full py-2 hover:text-[#2cff05] transition-colors focus:outline-none"
                >
                  Marketplaces
                </button>
                <button
                  onClick={() => scrollToSection("pricing")}
                  className="text-left w-full py-2 hover:text-[#2cff05] transition-colors focus:outline-none"
                >
                  Pricing
                </button>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-left w-full py-2 hover:text-[#2cff05] transition-colors focus:outline-none"
                >
                  FAQ
                </button>
                <div className="h-[1px] bg-white/10 my-1" />
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => {
                      navigateTo("login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-xl border border-white/15 hover:bg-white/5 text-xs focus:outline-none"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      navigateTo("login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2.5 rounded-xl bg-[#2323ff] text-white hover:bg-blue-700 transition-colors focus:outline-none text-xs"
                  >
                    Sign Up Free
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Container Views Router */}
      <main className="flex-1 w-full shrink-0">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="w-full shrink-0"
          >
            
            {/* VIEW 1: LANDING PAGE */}
            {view === "landing" && (
              <div className="w-full text-white shrink-0">
                <Hero onStartScan={() => navigateTo("scanner")} />
                <FeaturedOnSection />
                <FearSection />
                <HowItWorks />
                <AgentExplainer />
                <PricingSection onSelectPlan={(plan, cycle) => handleStripeCheckout(plan, cycle)} />
                <MarketplacesSection />
                <FAQ />
                <Footer onNavigate={(r) => navigateTo(r)} />
              </div>
            )}

            {/* VIEW 2: COMPLIANCE SCANNER */}
            {view === "scanner" && (
              <div className="max-w-6xl mx-auto px-4 py-12">
                {!user ? (
                  // If unauthenticated try viewing scanner trigger CTA auth guard
                  <div className="p-8 max-w-md mx-auto bg-[#111111] border border-white/10 rounded-2xl text-center space-y-6">
                    <div className="p-3 bg-[#2323ff]/10 rounded-full inline-flex text-[#2323ff]">
                      <Lock className="w-8 h-8" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-space font-extrabold text-xl text-white">Scanner Protection Alert</h3>
                      <p className="text-sm text-gray-400 font-sans">
                        You must log in to execute live pre-publication audits on our AI agent sandbox.
                      </p>
                    </div>
                    <button
                      onClick={() => navigateTo("login")}
                      className="w-full py-3 bg-[#2323ff] hover:bg-blue-700 text-white font-space font-bold rounded-xl cursor-pointer"
                    >
                      Authenticate Account
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="border-b border-white/10 pb-5">
                      <h1 className="text-2xl md:text-4xl font-space font-extrabold text-white">
                        IP Scanner Console
                      </h1>
                      <p className="text-sm text-gray-400">
                        Upload your thumbnail listings. Our parallel detector prevents store suspension in 8 seconds.
                      </p>
                    </div>

                    {/* Rendering Scanning States */}
                    {scanLoading ? (
                      <ScanProgress marketplace={activeScanPayload?.marketplace || "Etsy"} />
                    ) : currentScanResult ? (
                      <ResultDashboard 
                        scan={currentScanResult} 
                        onReset={() => {
                          setCurrentScanResult(null);
                        }}
                      />
                    ) : (
                      <ScanForm onSubmit={handleRunScan} loading={scanLoading} />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* VIEW 3: USER SCANS HISTORY */}
            {view === "history" && (
              <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
                <div className="border-b border-white/10 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl md:text-4xl font-space font-extrabold text-white">
                      My Pre-Publication Audits
                    </h1>
                    <p className="text-sm text-gray-400">
                      Review complete compliance history. Purged elements remain cached for 24 hours.
                    </p>
                  </div>
                  {scansHistory.length > 0 && (
                    <button
                      onClick={triggerCSVDownload}
                      className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-3 rounded-xl text-xs font-space font-extrabold inline-flex items-center gap-2 cursor-pointer"
                    >
                      <Download className="w-4 h-4" /> Export CSV Ledger
                    </button>
                  )}
                </div>

                {scansHistory.length === 0 ? (
                  <div className="p-12 text-center bg-[#111111] border border-white/10 rounded-2xl max-w-md mx-auto space-y-4">
                    <Database className="w-12 h-12 text-gray-600 mx-auto" />
                    <div>
                      <h4 className="font-space font-bold text-white text-base">No previous scans found</h4>
                      <p className="text-xs text-gray-500 mt-0.5">Your analyzed products will appear here once processed.</p>
                    </div>
                    <button
                      onClick={() => navigateTo("scanner")}
                      className="bg-[#2323ff] hover:bg-blue-700 text-white font-space font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer"
                    >
                      Run First Scan
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Filters */}
                    <div className="bg-[#111111] p-5 border border-white/10 rounded-2xl flex flex-wrap gap-4 items-center">
                      <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-bold font-space uppercase">
                        <Filter className="w-4 h-4 text-gray-600" />
                        Quick Filters:
                      </div>

                      {/* Marketplace Filter */}
                      <select
                        value={historyFilterMarketplace}
                        onChange={(e) => setHistoryFilterMarketplace(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded-xl text-xs font-space font-bold outline-none focus:border-[#2323ff]"
                      >
                        <option value="all" className="bg-[#111111]">Every Marketplace</option>
                        <option value="All Marketplaces" className="bg-[#111111]">All Marketplaces (Global)</option>
                        <option value="Etsy" className="bg-[#111111]">Etsy</option>
                        <option value="Redbubble" className="bg-[#111111]">Redbubble</option>
                        <option value="Amazon Merch" className="bg-[#111111]">Amazon Merch</option>
                        <option value="Teepublic" className="bg-[#111111]">Teepublic</option>
                        <option value="Society6" className="bg-[#111111]">Society6</option>
                        <option value="Zazzle" className="bg-[#111111]">Zazzle</option>
                        <option value="Spring" className="bg-[#111111]">Spring (TeeSpring)</option>
                        <option value="Spreadshirt" className="bg-[#111111]">Spreadshirt</option>
                        <option value="CafePress" className="bg-[#111111]">CafePress</option>
                        <option value="Printify" className="bg-[#111111]">Printify</option>
                        <option value="Printful" className="bg-[#111111]">Printful</option>
                        <option value="eBay" className="bg-[#111111]">eBay</option>
                        <option value="Shopify" className="bg-[#111111]">Shopify</option>
                        <option value="WooCommerce" className="bg-[#111111]">WooCommerce</option>
                      </select>

                      {/* Verdict Filter */}
                      <select
                        value={historyFilterVerdict}
                        onChange={(e) => setHistoryFilterVerdict(e.target.value)}
                        className="bg-white/5 border border-white/10 text-white p-2 rounded-xl text-xs font-space font-bold outline-none focus:border-[#2323ff]"
                      >
                        <option value="all" className="bg-[#111111]">Every Verdict</option>
                        <option value="BLOCK_LISTING" className="bg-[#111111]">BLOCK_LISTING</option>
                        <option value="MANUAL_REVIEW" className="bg-[#111111]">MANUAL_REVIEW</option>
                        <option value="SAFE_TO_PUBLISH" className="bg-[#111111]">SAFE_TO_PUBLISH</option>
                      </select>

                      <button
                        onClick={() => {
                          setHistoryFilterMarketplace("all");
                          setHistoryFilterVerdict("all");
                        }}
                        className="text-xs text-[#2cff05] font-space font-bold ml-auto hover:underline"
                      >
                        Reset Filters
                      </button>
                    </div>

                    {/* Table View */}
                    <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs md:text-sm">
                          <thead>
                            <tr className="bg-white/5 font-space font-bold text-gray-400 border-b border-white/10">
                              <th className="p-4">Visual Listing</th>
                              <th className="p-4">Channel Outlet</th>
                              <th className="p-4">Verdict</th>
                              <th className="p-4">Security Score</th>
                              <th className="p-4">Forensic Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5 font-sans">
                            {filteredHistory.map((scan) => (
                              <tr key={scan.scanId} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-white/5 shrink-0">
                                    <img src={scan.imageUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                                  </div>
                                  <div>
                                    <div className="font-bold text-white leading-tight">{scan.productTitle}</div>
                                    <div className="text-[10px] text-gray-500 mt-0.5">
                                      {new Date(scan.timestamp).toLocaleString()}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 font-space font-bold text-gray-300">
                                  {scan.marketplace}
                                </td>
                                <td className="p-4">
                                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold border ${
                                    scan.verdict === "BLOCK_LISTING"
                                      ? "bg-red-500/10 border-red-500/30 text-red-400"
                                      : scan.verdict === "MANUAL_REVIEW"
                                      ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                                      : "bg-green-500/10 border-green-500/30 text-green-400"
                                  }`}>
                                    {scan.verdict}
                                  </span>
                                </td>
                                <td className="p-4 font-mono font-extrabold text-[#2cff05]">
                                  {scan.riskScore}%
                                </td>
                                <td className="p-4">
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setCurrentScanResult(scan);
                                        navigateTo("scanner");
                                      }}
                                      className="bg-[#2323ff]/20 text-[#2323ff] px-2.5 py-1.5 rounded-lg text-xs font-space font-bold cursor-pointer hover:bg-[#2323ff]/30"
                                    >
                                      View Report
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirmScanId(scan.scanId)}
                                      className="p-1.5 text-gray-600 hover:text-red-400 rounded-lg hover:bg-white/5 cursor-pointer"
                                      title="Purge scan"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VIEW 4: USER CONTROL DASHBOARD */}
            {view === "dashboard" && (
              <div className="min-h-screen bg-[#0a0a0a] text-white">
                <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">

                  {/* Page heading */}
                  <div className="border-b border-white/10 pb-5">
                    <h1 className="text-2xl md:text-4xl font-space font-extrabold text-white">
                      User Dashboard
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                      Manage store safety credentials, billing portals, and platform integrations.
                    </p>
                  </div>

                  {user && (
                    <>
                      {/* STATUS BANNER */}
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-[#111111] border border-white/10 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-[#2323ff]/20 border border-[#2323ff]/30 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5 text-[#2323ff]" />
                          </div>
                          <div>
                            <p className="font-space font-extrabold text-white text-sm uppercase tracking-wide">
                              {user.plan === "free" ? "FREE LICENSE — Limited Protection" : `${user.plan.toUpperCase()} LICENSE — Active`}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 font-sans">
                              {user.plan === "free"
                                ? `${user.scansUsed} of ${user.scansLimit} scans used this month. Upgrade for full coverage.`
                                : `Billing ${user.paymentStatus === "active" ? "active" : "inactive"} · ${user.scansUsed} of ${user.scansLimit === -1 ? "2,500" : user.scansLimit} scans used`}
                            </p>
                          </div>
                        </div>
                        {user.plan === "free" ? (
                          <button
                            onClick={() => setShowPricingModal(true)}
                            className="shrink-0 px-5 py-2.5 bg-[#2323ff] hover:bg-blue-700 text-white text-xs font-space font-extrabold rounded-xl cursor-pointer transition-colors"
                          >
                            View Plans & Upgrade →
                          </button>
                        ) : (
                          <button
                            onClick={handleStripePortal}
                            className="shrink-0 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-space font-extrabold rounded-xl cursor-pointer transition-colors inline-flex items-center gap-1.5"
                          >
                            <CreditCard className="w-3.5 h-3.5" /> Manage Billing
                          </button>
                        )}
                      </div>

                      {/* MAIN GRID */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* LEFT: ACCOUNT PROFILE */}
                        <div className="space-y-5">
                          <div className="p-6 bg-[#111111] border border-white/10 rounded-2xl space-y-5 text-center">
                            <div className="w-16 h-16 bg-[#2323ff] text-white font-space font-bold text-2xl flex items-center justify-center rounded-2xl mx-auto">
                              {user.displayName[0].toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-space font-black text-white text-lg leading-tight">
                                {user.displayName}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">{user.email}</p>
                            </div>
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-bold bg-[#2cff05]/10 text-[#2cff05] rounded-full border border-[#2cff05]/20">
                              <Zap className="w-3 h-3" />
                              {user.plan.toUpperCase()} LICENSE
                            </div>
                            <div className="border-t border-white/10 pt-4 text-left space-y-3 text-xs font-sans">
                              <div className="flex justify-between">
                                <span className="text-gray-500">Member since</span>
                                <span className="font-bold text-gray-200">{new Date(user.createdAt).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Role</span>
                                <span className="font-bold text-gray-200">{user.role.toUpperCase()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-500">Billing</span>
                                <span className={`font-bold ${user.paymentStatus === "active" ? "text-[#2cff05]" : "text-gray-500"}`}>
                                  {user.paymentStatus === "active" ? "✓ active" : "none"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Quick actions */}
                          <div className="p-5 bg-[#111111] border border-white/10 rounded-2xl space-y-2">
                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-3">Quick Actions</p>
                            <button
                              onClick={() => navigateTo("scanner")}
                              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-space font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                            >
                              <Search className="w-4 h-4 text-[#2323ff]" /> New IP Scan
                            </button>
                            <button
                              onClick={() => navigateTo("history")}
                              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-space font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                            >
                              <Database className="w-4 h-4 text-[#2323ff]" /> Scan History
                            </button>
                            <button
                              onClick={handleStripePortal}
                              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-space font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-left"
                            >
                              <CreditCard className="w-4 h-4 text-[#2323ff]" /> Billing Portal
                            </button>
                          </div>
                        </div>

                        {/* RIGHT: USAGE + BILLING */}
                        <div className="md:col-span-2 space-y-5">

                          {/* Usage metrics */}
                          <div className="p-6 bg-[#111111] border border-white/10 rounded-2xl space-y-5">
                            <div className="flex items-center justify-between">
                              <h3 className="font-space font-bold text-white text-sm flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-[#2323ff]" />
                                IP Check Usage Metrics
                              </h3>
                              <span className="text-[10px] font-mono text-gray-500 uppercase">Monthly</span>
                            </div>

                            {/* Big number stat */}
                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-4 bg-white/5 rounded-xl text-center">
                                <div className="text-2xl font-space font-extrabold text-white">{user.scansUsed}</div>
                                <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">Scans Used</div>
                              </div>
                              <div className="p-4 bg-white/5 rounded-xl text-center">
                                <div className="text-2xl font-space font-extrabold text-white">
                                  {user.scansLimit === -1 ? "2,500" : user.scansLimit - user.scansUsed}
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">Remaining</div>
                              </div>
                              <div className="p-4 bg-white/5 rounded-xl text-center">
                                <div className="text-2xl font-space font-extrabold text-white">
                                  {user.scansLimit === -1 ? "∞" : user.scansLimit}
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase">Monthly Cap</div>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <div className="space-y-2">
                              <div className="flex justify-between text-[11px] font-mono text-gray-500">
                                <span>Quota consumed</span>
                                <span className="text-gray-300">
                                  {user.scansLimit === -1
                                    ? `${Math.round((user.scansUsed / 2500) * 100)}%`
                                    : `${Math.round((user.scansUsed / user.scansLimit) * 100)}%`}
                                </span>
                              </div>
                              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <div
                                  className="h-full bg-gradient-to-r from-[#2323ff] to-cyan-400 rounded-full transition-all duration-700"
                                  style={{
                                    width: `${
                                      user.scansLimit === -1
                                        ? Math.max(Math.min((user.scansUsed / 2500) * 100, 100), 2)
                                        : Math.max(Math.min((user.scansUsed / user.scansLimit) * 100, 100), 2)
                                    }%`
                                  }}
                                />
                              </div>
                              <p className="text-[10px] text-gray-600 font-sans">
                                Quota resets on the anniversary of your license activation.
                              </p>
                            </div>
                          </div>

                          {/* Billing manager */}
                          <div className="p-6 bg-[#111111] border border-white/10 rounded-2xl space-y-4">
                            <h4 className="font-space font-bold text-white text-sm flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-[#2323ff]" />
                              Billing & Subscription
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-xs font-sans">
                              <div className="p-3 bg-white/5 rounded-xl space-y-1">
                                <p className="text-gray-500 text-[10px] font-mono uppercase">Current Plan</p>
                                <p className="text-white font-bold">{user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}</p>
                              </div>
                              <div className="p-3 bg-white/5 rounded-xl space-y-1">
                                <p className="text-gray-500 text-[10px] font-mono uppercase">Status</p>
                                <p className={`font-bold ${user.paymentStatus === "active" ? "text-[#2cff05]" : "text-gray-400"}`}>
                                  {user.paymentStatus === "active" ? "Active" : "Inactive"}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-3 pt-1">
                              <button
                                onClick={handleStripePortal}
                                className="bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2.5 rounded-xl text-xs font-space font-extrabold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                              >
                                <CreditCard className="w-3.5 h-3.5" /> Manage Subscriptions
                              </button>
                              {user.plan === "free" && (
                                <button
                                  onClick={() => setShowPricingModal(true)}
                                  className="bg-[#2323ff] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-xs font-space font-extrabold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
                                >
                                  <Zap className="w-3.5 h-3.5" /> Upgrade Plan
                                </button>
                              )}
                            </div>
                          </div>

                          {/* ── AFFILIATE PROGRAM CARD ── */}
                          {!user.referralCode ? (
                            /* ── JOIN CTA ── */
                            <div className="p-6 bg-[#111111] border border-white/10 rounded-2xl space-y-4">
                              <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-[#2cff05]/10 border border-[#2cff05]/20 flex items-center justify-center shrink-0">
                                  <Sparkles className="w-5 h-5 text-[#2cff05]" />
                                </div>
                                <div>
                                  <h4 className="font-space font-bold text-white text-sm">Become an Affiliate</h4>
                                  <p className="text-xs text-gray-500 mt-0.5 font-sans leading-relaxed">
                                    Earn <span className="text-[#2cff05] font-bold">$5 per Pro</span> and <span className="text-[#2cff05] font-bold">$15 per Agency</span> referral. Share your unique link, get paid automatically when friends upgrade.
                                  </p>
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-3 text-center text-[10px] font-mono text-gray-500">
                                <div className="p-3 bg-white/5 rounded-xl space-y-1">
                                  <div className="text-base font-space font-extrabold text-white">$5</div>
                                  <div className="uppercase">Pro plan</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl space-y-1">
                                  <div className="text-base font-space font-extrabold text-white">$15</div>
                                  <div className="uppercase">Agency plan</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl space-y-1">
                                  <div className="text-base font-space font-extrabold text-[#2cff05]">∞</div>
                                  <div className="uppercase">No cap</div>
                                </div>
                              </div>
                              <button
                                onClick={async () => {
                                  try {
                                    const res = await apiFetch("/api/affiliate/join", { method: "POST" });
                                    const data = await res.json();
                                    if (data.referralCode) {
                                      const updated = { ...user, referralCode: data.referralCode, referralCount: 0, affiliateEarnings: 0 };
                                      setUser(updated);
                                      localStorage.setItem("mumy_user", JSON.stringify(updated));
                                    }
                                  } catch {}
                                }}
                                className="w-full py-3 bg-[#2cff05] hover:bg-green-400 text-gray-900 font-space font-extrabold text-sm rounded-xl cursor-pointer transition-colors"
                              >
                                Join Affiliate Program →
                              </button>
                            </div>
                          ) : (
                            <div className="p-6 bg-[#111111] border border-[#2cff05]/20 rounded-2xl space-y-5">
                              {/* Header */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4 className="font-space font-bold text-white text-sm flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-[#2cff05]" />
                                    Affiliate Program
                                  </h4>
                                  <p className="text-[11px] text-gray-500 mt-0.5">Earn $5 per Pro referral · $15 per Agency referral</p>
                                </div>
                                <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#2cff05]/10 text-[#2cff05] border border-[#2cff05]/20">
                                  ACTIVE
                                </span>
                              </div>

                              {/* Stats row */}
                              <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 bg-white/5 rounded-xl text-center">
                                  <div className="text-xl font-space font-extrabold text-white">{user.referralCount ?? 0}</div>
                                  <div className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">Referrals</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl text-center">
                                  <div className="text-xl font-space font-extrabold text-[#2cff05]">${(user.affiliateEarnings ?? 0).toFixed(2)}</div>
                                  <div className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">Earned</div>
                                </div>
                                <div className="p-3 bg-white/5 rounded-xl text-center">
                                  <div className="text-xl font-space font-extrabold text-white">20%</div>
                                  <div className="text-[10px] text-gray-500 font-mono mt-0.5 uppercase">Commission</div>
                                </div>
                              </div>

                              {/* Referral link */}
                              {(() => {
                                const refLink = window.location.origin + "?ref=" + user.referralCode;
                                return (
                                  <div className="space-y-2">
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Your referral link</p>
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-mono text-gray-300 truncate select-all">
                                        {refLink}
                                      </div>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(refLink);
                                          setRefLinkCopied(true);
                                          setTimeout(() => setRefLinkCopied(false), 2000);
                                        }}
                                        className={`shrink-0 px-3 py-2.5 border text-xs font-space font-extrabold rounded-xl cursor-pointer transition-all duration-200 ${
                                          refLinkCopied
                                            ? "bg-[#2cff05]/20 border-[#2cff05]/60 text-[#2cff05] scale-95"
                                            : "bg-[#2cff05]/10 hover:bg-[#2cff05]/20 border-[#2cff05]/20 text-[#2cff05]"
                                        }`}
                                      >
                                        {refLinkCopied ? "✓ Copied!" : "Copy"}
                                      </button>
                                    </div>
                                  </div>
                                );
                              })()}

                              {/* Share row */}
                              {(() => {
                                const refLink = window.location.origin + "?ref=" + user.referralCode;
                                const tweetUrl = "https://twitter.com/intent/tweet?text=" + encodeURIComponent("I use MUMY to protect my store from IP bans 🛡️ Try it free: " + refLink);
                                const mailUrl  = "mailto:?subject=" + encodeURIComponent("Protect your Etsy store") + "&body=" + encodeURIComponent("Hey, I've been using MUMY to keep my store safe from IP bans. Try it here: " + refLink);
                                return (
                                  <div className="flex items-center gap-2 pt-1">
                                    <p className="text-[10px] font-mono text-gray-600 uppercase">Share:</p>
                                    <a
                                      href={tweetUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-[10px] font-mono rounded-lg transition-colors"
                                    >
                                      X Twitter
                                    </a>
                                    <a
                                      href={mailUrl}
                                      className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white text-[10px] font-mono rounded-lg transition-colors"
                                    >
                                      Email
                                    </a>
                                  </div>
                                );
                              })()}
                            </div>
                          )}

                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 5a: ADMIN LOGIN */}
            {view === "admin-login" && (
              <AdminLoginPage
                onSuccess={(adminUser) => {
                  setUser(adminUser);
                  setView("admin");
                  fetchAdminStats();
                }}
                onBack={() => navigateTo("landing")}
              />
            )}

            {/* VIEW 5b: ADMIN DASHBOARD */}
            {view === "admin" && user?.role === "admin" && (
              <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
                <div className="border-b border-white/10 pb-5 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-space font-extrabold text-white flex items-center gap-2">
                      <Shield className="w-7 h-7 text-red-400 shrink-0" /> Admin Console
                    </h1>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      Logged in as <span className="text-red-400 font-bold">{user.email}</span> · Administrator
                    </p>
                  </div>
                </div>

                {adminLoading ? (
                  <div className="text-center py-12 space-y-2">
                    <RefreshCw className="w-8 h-8 text-[#2323ff] animate-spin mx-auto" />
                    <p className="text-xs text-gray-500 font-mono">Loading dashboard...</p>
                  </div>
                ) : adminStats ? (
                  <AdminDashboard
                    stats={adminStats}
                    onBanAction={handleAdminToggleBan}
                    onDeleteScan={handleDeleteScan}
                    onRefresh={fetchAdminStats}
                    loading={adminLoading}
                  />
                ) : (
                  <div className="text-center text-gray-500 text-xs py-12">Failed to load dashboard data.</div>
                )}
              </div>
            )}

            {/* VIEW 6: PRIVACY POLICY */}
            {view === "privacy" && (
              <div className="max-w-4xl mx-auto px-4 py-16 font-sans">
                <button
                  onClick={() => navigateTo("landing")}
                  className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-all hover:translate-x-1"
                >
                  ← Back to Home
                </button>
                <PrivacyPolicyView />
              </div>
            )}

            {/* VIEW 7: TERMS OF SERVICES */}
            {view === "terms" && (
              <div className="max-w-4xl mx-auto px-4 py-16 font-sans">
                <button
                  onClick={() => navigateTo("landing")}
                  className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 text-xs font-mono font-bold uppercase tracking-wider cursor-pointer transition-all hover:translate-x-1"
                >
                  ← Back to Home
                </button>
                <TermsOfServiceView />
              </div>
            )}

            {/* VIEW 8: AUTHENTICATION (LOGIN / SIGNUP) VIEW */}
            {view === "login" && (
              <div className="py-20 flex justify-center items-center px-4">
                <div className="w-full max-w-md bg-[#111111] border border-white/5 p-8 rounded-3xl text-white space-y-6 shadow-2xl relative">
                  
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue/20 w-48 h-48 rounded-full blur-[60px] pointer-events-none"></div>

                  <div className="text-center space-y-2 relative z-10">
                    <img
                      src="/icon.png"
                      alt="MUMY"
                      className="w-12 h-12 mx-auto mb-2 object-contain shrink-0"
                      draggable={false}
                    />
                    <h2 className="text-2xl font-space font-extrabold text-white">
                      Sign In to Store Protection
                    </h2>
                    <p className="text-xs text-gray-400">
                      Pre-publication verification suite. Secure and compliant in under 8s.
                    </p>
                  </div>

                  {authError && (
                    <div className="p-3 bg-red-950/40 border border-red-500/20 rounded-xl text-xs text-red-300 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* OAUTH SIGN IN */}
                  <div className="space-y-3 relative z-10">
                    <button
                      type="button"
                      onClick={triggerGoogleLogin}
                      className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-[#3c4043] font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-3 cursor-pointer shadow-sm transition-colors border border-[#dadce0] hover:border-[#c6c6c6]"
                      style={{ fontFamily: "'Google Sans', Roboto, sans-serif" }}
                    >
                      <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                        <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                      </svg>
                      Sign in with Google
                    </button>

                    {isMicrosoftConfigured && (
                      <button
                        type="button"
                        onClick={triggerMicrosoftLogin}
                        className="w-full bg-white hover:bg-gray-50 active:bg-gray-100 text-[#1b1b1b] font-medium py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-3 cursor-pointer shadow-sm transition-colors border border-[#8c8c8c] hover:border-[#666]"
                        style={{ fontFamily: "'Segoe UI', sans-serif" }}
                      >
                        <svg width="18" height="18" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
                          <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
                          <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
                          <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
                        </svg>
                        Sign in with Microsoft
                      </button>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* VIEW 9: STRIPE UPGRADE SUCCESS GATE */}
            {view === "success" && (
              <div className="py-24 flex justify-center items-center px-4">
                <div className="max-w-xl text-center bg-[#111111] border border-[#2cff05]/20 p-8 rounded-3xl text-white space-y-6 shadow-2xl relative overflow-hidden">
                  
                  {/* Neon light beams */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-brand-green/10 rounded-full blur-[40px] pointer-events-none"></div>

                  <div className="p-4 bg-brand-green/10 rounded-full inline-flex text-brand-green border border-[#2cff05]/20 animate-bounce">
                    <ShieldCheck className="w-12 h-12" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-4xl font-space font-extrabold text-white">
                      Your plan is now active! 🎉
                    </h2>
                    <p className="text-sm text-gray-300 font-sans leading-relaxed">
                      Credentials validated. Your scanning limit has been fully upgraded to Pro/Agency license status in real-time. Protect multiple stores instantly.
                    </p>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-left text-xs font-mono space-y-2 divide-y divide-white/5">
                    <div className="flex justify-between pb-2">
                      <span className="text-gray-400">License Badge:</span>
                      <span className="text-[#2cff05] font-bold">MUMY PROFESSIONAL</span>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-400">Stripe Invoiced:</span>
                      <span className="text-white">Active subscription tier</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigateTo("scanner")}
                    className="w-full py-4 bg-[#2323ff] hover:bg-blue-700 text-white font-space font-extrabold rounded-xl text-center select-none cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    Start Safeguarding Now <ArrowRight className="w-5 h-5 animate-pulse" />
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 10: STRIPE PAYMENT CANCEL RETENTION CARD */}
            {view === "cancel" && (
              <div className="py-24 flex justify-center items-center px-4">
                <div className="max-w-md text-center bg-[#111111] border border-red-500/20 p-8 rounded-3xl text-white space-y-6 shadow-2xl">
                  <div className="p-4 bg-red-950/40 rounded-full inline-flex text-red-500 border border-red-500/10">
                    <ShieldAlert className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-xl md:text-2xl font-space font-extrabold">Changed your mind? No problem.</h2>
                    <p className="text-xs text-gray-450 leading-relaxed font-sans">
                      Leaving without Pro protection? Keep in mind that <span className="text-red-400 font-bold">one single DMCA infringement suspension</span> could erase years of SEO keyword indexing and review history on your active shops.
                    </p>
                  </div>

                  {/* Retention Offer Coupons */}
                  <div className="p-5 bg-gradient-to-r from-brand-blue/20 to-purple-950/20 border border-brand-blue/30 rounded-2xl text-left space-y-3">
                    <span className="font-mono text-[9px] font-bold text-brand-green border border-brand-green/35 px-1.5 py-0.5 rounded uppercase">
                      LIMITED RETENTION DISCOUNT
                    </span>
                    <h4 className="font-space font-bold text-white text-sm">Use code STAY20 for 20% off your first month!</h4>
                    <p className="text-[11px] text-gray-400">Get complete Laplacian zone blur scanners, NLP phonetics, and 100 scans for as low as $15.20.</p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => handleStripeCheckout("pro")}
                      className="w-full py-3.5 bg-[#2323ff] hover:bg-blue-700 text-white font-space font-extrabold rounded-xl cursor-pointer"
                    >
                      Redeem stay20 coupon in checkout
                    </button>
                    <button
                      onClick={() => navigateTo("landing")}
                      className="w-full text-xs font-mono text-gray-400 hover:underline cursor-pointer"
                    >
                      Go back to Home page
                    </button>
                  </div>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </main>

      {/* Pricing / Upgrade Plan Modal */}
      {showPricingModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setShowPricingModal(false)}
        >
          <div
            className="bg-[#0d0d1a] border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="font-space font-extrabold text-white text-lg">Choose Your Plan</h2>
                <p className="text-xs text-gray-400 mt-0.5 font-sans">Upgrade anytime. Cancel anytime.</p>
              </div>
              <button
                onClick={() => setShowPricingModal(false)}
                className="text-gray-400 hover:text-white text-2xl leading-none cursor-pointer w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10"
              >
                ×
              </button>
            </div>
            {/* Reuse existing PricingSection */}
            <div className="[&>section]:py-10 [&>section]:border-none">
              <PricingSection onSelectPlan={(plan, cycle) => {
                setShowPricingModal(false);
                handleStripeCheckout(plan, cycle);
              }} />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Alert Dialog popup */}
      {deleteConfirmScanId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <h4 className="font-space font-extrabold text-white text-lg">Purge Analyzed Run?</h4>
            <p className="text-xs text-gray-400 leading-relaxed font-sans">
              Purging is irreversible. This will delete the scan record completely from the historical logs dashboard.
            </p>
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setDeleteConfirmScanId(null)}
                className="px-4 py-2 bg-white/5 text-gray-300 text-xs font-space font-bold rounded-xl border border-white/10 cursor-pointer hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteScan(deleteConfirmScanId)}
                className="px-4 py-2 bg-red-500/80 text-white text-xs font-space font-bold rounded-xl hover:bg-red-500 cursor-pointer"
              >
                Delete Log
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Persistent mini-footer for app screens to carry legal agreements */}
      {!isMarketingContext && (
        <footer className="py-6 border-t border-white/10 bg-[#0a0a0a] text-center text-xs text-gray-600 font-sans mt-auto">
          <div className="flex justify-center gap-4 text-gray-400 font-semibold font-mono mb-1.5">
            <button onClick={() => navigateTo("privacy")} className="hover:text-white hover:underline cursor-pointer transition-colors">Privacy Guidelines</button>
            <span>·</span>
            <button onClick={() => navigateTo("terms")} className="hover:text-white hover:underline cursor-pointer transition-colors">Terms of Service</button>
          </div>
          <div>MUMY © {new Date().getFullYear()}. All pre-publication audits secured.</div>
        </footer>
      )}

    </div>
  );
}
