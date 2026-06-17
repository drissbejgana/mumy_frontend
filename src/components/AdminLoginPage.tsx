import React, { useState } from "react";
import { Shield, Lock, Mail, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { apiFetch, setToken } from "../api";

interface Props {
  onSuccess: (user: any) => void;
  onBack: () => void;
}

export default function AdminLoginPage({ onSuccess, onBack }: Props) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res  = await apiFetch("/api/auth/admin-login", {
        method: "POST",
        body:   JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error ?? "Access denied");
        return;
      }
      setToken(data.token);
      localStorage.setItem("mumy_user", JSON.stringify(data.user));
      onSuccess(data.user);
    } catch {
      setError("Connection failed. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-4">

      {/* Back link */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-1.5 text-xs font-mono font-bold text-gray-500 hover:text-gray-300 cursor-pointer transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to site
      </button>

      <div className="w-full max-w-sm space-y-8">

        {/* Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20">
            <Shield className="w-7 h-7 text-red-400" />
          </div>
          <div>
            <h1 className="text-2xl font-space font-extrabold text-white tracking-tight">
              Admin Access
            </h1>
            <p className="text-xs text-gray-500 mt-1 font-mono">
              MUMY IP Guard · Restricted Area
            </p>
          </div>
        </div>

        {/* Warning banner */}
        <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/8 border border-amber-500/20 text-amber-400">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="text-[11px] font-mono leading-relaxed">
            Unauthorized access attempts are logged. This panel is for authorized administrators only.
          </p>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@yourdomain.com"
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 focus:bg-white/8 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPw(v => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 cursor-pointer"
              >
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-sm font-space font-extrabold text-white cursor-pointer transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Authenticating…
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" /> Enter Admin Panel
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-600 font-mono">
          Session encrypted · JWT 7-day expiry · Access logged
        </p>
      </div>
    </div>
  );
}
