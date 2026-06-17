import React, { useState, useMemo } from "react";
import {
  Users, TrendingUp, DollarSign, Database, Search,
  Mail, Trash2, Ban, Activity, BarChart3,
  Shield, UserCheck, AlertTriangle, CheckCircle2,
  Settings, Crown, RefreshCw, ChevronDown
} from "lucide-react";
import { apiFetch } from "../api";
import { UserProfile, ScanResult } from "../types";

// ─── Shared Types ─────────────────────────────────────────────────────────────

interface AdminStats {
  mrr: number;
  totalRevenue: number;
  churnRate: number;
  planDistribution: { free: number; pro: number; agency: number };
  verdictDistribution: { block: number; review: number; safe: number };
  users: UserProfile[];
  scans: ScanResult[];
}

// ─── Shared UI Atoms ─────────────────────────────────────────────────────────

function PlanBadge({ plan }: { plan: string }) {
  const s =
    plan === "agency" ? "bg-black text-[#2cff05]" :
    plan === "pro"    ? "bg-[#2323ff]/10 text-[#2323ff]" :
                        "bg-gray-100 text-gray-500";
  return <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${s}`}>{plan}</span>;
}

function VerdictBadge({ verdict }: { verdict: string }) {
  const s =
    verdict === "BLOCK_LISTING"  ? "bg-red-50 border-red-200 text-red-600" :
    verdict === "MANUAL_REVIEW"  ? "bg-amber-50 border-amber-200 text-amber-600" :
                                   "bg-green-50 border-green-200 text-green-600";
  const label =
    verdict === "BLOCK_LISTING"  ? "BLOCK" :
    verdict === "MANUAL_REVIEW"  ? "REVIEW" : "SAFE";
  return <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${s}`}>{label}</span>;
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase();
  const palette = ["bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-green-100 text-green-700", "bg-amber-100 text-amber-700", "bg-red-100 text-red-700"];
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-space shrink-0 ${palette[name.charCodeAt(0) % palette.length]}`}>
      {initials || "?"}
    </div>
  );
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  return d > 0 ? `${d}d ago` : h > 0 ? `${h}h ago` : `${m}m ago`;
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

type Accent = "blue" | "green" | "red" | "amber" | "purple";

function KPICard({ label, value, sub, icon, accent = "blue" }: {
  label: string; value: string; sub: string; icon: React.ReactNode; accent?: Accent;
}) {
  const c: Record<Accent, { bg: string; text: string; val: string }> = {
    blue:   { bg: "bg-[#2323ff]/8",  text: "text-[#2323ff]",  val: "text-[#2323ff]"  },
    green:  { bg: "bg-green-50",     text: "text-green-600",  val: "text-green-700"  },
    red:    { bg: "bg-red-50",       text: "text-red-500",    val: "text-red-600"    },
    amber:  { bg: "bg-amber-50",     text: "text-amber-600",  val: "text-amber-700"  },
    purple: { bg: "bg-purple-50",    text: "text-purple-600", val: "text-purple-700" },
  };
  const { bg, text, val } = c[accent];
  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div className="min-w-0 space-y-0.5">
        <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">{label}</p>
        <p className={`text-2xl font-space font-extrabold ${val}`}>{value}</p>
        <p className="text-[10px] text-gray-400 truncate">{sub}</p>
      </div>
      <div className={`p-3 rounded-xl shrink-0 ${bg} ${text}`}>{icon}</div>
    </div>
  );
}

// ─── Distribution Bar ─────────────────────────────────────────────────────────

function DistBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="font-bold text-gray-800">{value} <span className="text-gray-400 font-normal">({pct}%)</span></span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// ─── Mini Bar Chart (last 7 days) ─────────────────────────────────────────────

function MiniBarChart({ scans }: { scans: ScanResult[] }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d;
  });

  const data = days.map(d => ({
    label: d.toLocaleDateString("en", { weekday: "short" }),
    count: scans.filter(s => {
      const sd = new Date(s.timestamp);
      return sd.getFullYear() === d.getFullYear() && sd.getMonth() === d.getMonth() && sd.getDate() === d.getDate();
    }).length,
  }));

  const max = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm">
      <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 mb-4">Scan Volume — Last 7 Days</p>
      <div className="flex items-end gap-1.5 h-20">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center justify-end" style={{ height: 64 }}>
              <div
                className="w-full rounded-t bg-[#2323ff] hover:bg-blue-500 transition-colors cursor-default"
                style={{ height: `${Math.max(d.count > 0 ? (d.count / max) * 100 : 0, d.count > 0 ? 6 : 0)}%` }}
                title={`${d.count} scan${d.count !== 1 ? "s" : ""}`}
              />
            </div>
            <span className="text-[9px] text-gray-400 font-mono">{d.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ stats }: { stats: AdminStats }) {
  const totalUsers   = stats.users.length;
  const activeSubs   = stats.planDistribution.pro + stats.planDistribution.agency;
  const totalScans   = stats.scans.length;
  const blockedCount = stats.verdictDistribution.block;
  const avgRisk      = totalScans > 0 ? Math.round(stats.scans.reduce((a, s) => a + s.riskScore, 0) / totalScans) : 0;
  const convRate     = totalUsers > 0 ? ((activeSubs / totalUsers) * 100).toFixed(1) : "0";
  const totalV       = stats.verdictDistribution.block + stats.verdictDistribution.review + stats.verdictDistribution.safe;

  const recentUsers  = [...stats.users].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);
  const recentScans  = [...stats.scans].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

  return (
    <div className="space-y-6">

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KPICard
          label="MRR"
          value={`$${stats.mrr.toLocaleString()}`}
          sub="Monthly recurring revenue"
          icon={<DollarSign className="w-5 h-5" />}
          accent="blue"
        />
        <KPICard
          label="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          sub="Cumulative all-time"
          icon={<TrendingUp className="w-5 h-5" />}
          accent="green"
        />
        <KPICard
          label="Total Users"
          value={totalUsers.toString()}
          sub={`${convRate}% conversion rate`}
          icon={<Users className="w-5 h-5" />}
          accent="purple"
        />
        <KPICard
          label="Subscribers"
          value={activeSubs.toString()}
          sub={`${stats.planDistribution.pro} Pro · ${stats.planDistribution.agency} Agency`}
          icon={<UserCheck className="w-5 h-5" />}
          accent="blue"
        />
        <KPICard
          label="Total Scans"
          value={totalScans.toString()}
          sub={`Avg risk score: ${avgRisk}%`}
          icon={<Database className="w-5 h-5" />}
          accent="amber"
        />
        <KPICard
          label="Blocked Listings"
          value={blockedCount.toString()}
          sub="IP violations flagged"
          icon={<Ban className="w-5 h-5" />}
          accent="red"
        />
      </div>

      {/* Distribution + Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Plan distribution */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">Plan Distribution</p>
          <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
            {totalUsers > 0 && <>
              <div className="h-full bg-gray-300"       style={{ width: `${(stats.planDistribution.free   / totalUsers) * 100}%` }} title={`Free: ${stats.planDistribution.free}`} />
              <div className="h-full bg-[#2323ff]"      style={{ width: `${(stats.planDistribution.pro    / totalUsers) * 100}%` }} title={`Pro: ${stats.planDistribution.pro}`} />
              <div className="h-full bg-[#2cff05]"      style={{ width: `${(stats.planDistribution.agency / totalUsers) * 100}%` }} title={`Agency: ${stats.planDistribution.agency}`} />
            </>}
          </div>
          <div className="space-y-2.5">
            <DistBar label="Free"   value={stats.planDistribution.free}   total={totalUsers} color="bg-gray-300"  />
            <DistBar label="Pro"    value={stats.planDistribution.pro}    total={totalUsers} color="bg-[#2323ff]" />
            <DistBar label="Agency" value={stats.planDistribution.agency} total={totalUsers} color="bg-[#2cff05]" />
          </div>
        </div>

        {/* Verdict distribution */}
        <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400">Verdict Distribution</p>
          <div className="h-3 rounded-full overflow-hidden flex bg-gray-100">
            {totalV > 0 && <>
              <div className="h-full bg-red-500"   style={{ width: `${(stats.verdictDistribution.block  / totalV) * 100}%` }} />
              <div className="h-full bg-amber-400" style={{ width: `${(stats.verdictDistribution.review / totalV) * 100}%` }} />
              <div className="h-full bg-green-500" style={{ width: `${(stats.verdictDistribution.safe   / totalV) * 100}%` }} />
            </>}
          </div>
          <div className="space-y-2.5">
            <DistBar label="Blocked"       value={stats.verdictDistribution.block}  total={totalV} color="bg-red-500"   />
            <DistBar label="Manual Review" value={stats.verdictDistribution.review} total={totalV} color="bg-amber-400" />
            <DistBar label="Safe"          value={stats.verdictDistribution.safe}   total={totalV} color="bg-green-500" />
          </div>
        </div>

        {/* Daily scan bar chart */}
        <MiniBarChart scans={stats.scans} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent users */}
        <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2323ff]" />
            <span className="font-space font-bold text-sm text-gray-800">Newest Users</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentUsers.map(u => (
              <div key={u.uid} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <Avatar name={u.displayName} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 truncate">{u.displayName}</div>
                  <div className="text-[10px] text-gray-400 truncate flex items-center gap-1">
                    <Mail className="w-3 h-3 shrink-0" />{u.email}
                  </div>
                </div>
                <PlanBadge plan={u.plan} />
                <span className="text-[10px] text-gray-400 font-mono shrink-0">{timeAgo(u.createdAt)}</span>
              </div>
            ))}
            {recentUsers.length === 0 && <p className="px-5 py-8 text-xs text-gray-400 text-center">No users yet</p>}
          </div>
        </div>

        {/* Recent scans */}
        <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50/80 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#2323ff]" />
            <span className="font-space font-bold text-sm text-gray-800">Recent Scans</span>
          </div>
          <div className="divide-y divide-gray-50">
            {recentScans.map(s => (
              <div key={s.scanId} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-lg overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                  <img src={s.imageUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-gray-900 truncate">{s.productTitle}</div>
                  <div className="text-[10px] text-gray-400 font-mono">{s.marketplace}</div>
                </div>
                <VerdictBadge verdict={s.verdict} />
                <span className={`text-sm font-mono font-extrabold shrink-0 ${s.riskScore >= 75 ? "text-red-600" : s.riskScore >= 40 ? "text-amber-600" : "text-green-600"}`}>
                  {s.riskScore}%
                </span>
              </div>
            ))}
            {recentScans.length === 0 && <p className="px-5 py-8 text-xs text-gray-400 text-center">No scans yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Users Tab ────────────────────────────────────────────────────────────────

function UsersTab({ users, onBanAction }: { users: UserProfile[]; onBanAction: (uid: string, action: string) => void }) {
  const [search, setSearch] = useState("");
  const [planFilter, setPlanFilter] = useState("all");

  const filtered = useMemo(() =>
    users
      .filter(u => {
        const q = search.toLowerCase();
        return (
          (!search || u.displayName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)) &&
          (planFilter === "all" || u.plan === planFilter)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [users, search, planFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2323ff] bg-white"
          />
        </div>
        <select
          value={planFilter}
          onChange={e => setPlanFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2323ff] bg-white font-space font-bold text-gray-700 cursor-pointer"
        >
          <option value="all">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="agency">Agency</option>
        </select>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-150">
          <span className="text-xs font-space font-bold text-gray-500">{filtered.length} users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 font-space font-bold text-gray-500 text-[11px] uppercase tracking-wide">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Plan</th>
                <th className="px-5 py-3">Usage</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3">Billing</th>
                <th className="px-5 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(u => (
                <tr key={u.uid} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={u.displayName} />
                      <div>
                        <div className="font-bold text-gray-900 flex items-center gap-1.5">
                          {u.displayName}
                          {u.role === "admin" && (
                            <span className="text-[9px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-mono font-bold">ADMIN</span>
                          )}
                        </div>
                        <div className="text-gray-400 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 shrink-0" />{u.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><PlanBadge plan={u.plan} /></td>
                  <td className="px-5 py-3.5">
                    <div className="space-y-1">
                      <span className="font-mono font-bold text-gray-800">
                        {u.scansUsed} <span className="text-gray-400 font-normal">/ {u.scansLimit === -1 ? "∞" : u.scansLimit}</span>
                      </span>
                      {u.scansLimit > 0 && (
                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2323ff] rounded-full"
                            style={{ width: `${Math.min((u.scansUsed / u.scansLimit) * 100, 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 font-mono">
                    {new Date(u.createdAt).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[10px] font-mono font-bold ${
                      u.paymentStatus === "active"         ? "text-green-600" :
                      u.paymentStatus === "payment_failed" ? "text-red-500"   : "text-gray-400"
                    }`}>
                      {u.paymentStatus === "active"         ? "✓ Active" :
                       u.paymentStatus === "payment_failed" ? "✗ Failed" : "—"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    {u.role === "admin" ? (
                      <span className="text-[10px] font-mono text-gray-400">SYS_ADMIN</span>
                    ) : (
                      <button
                        onClick={() => onBanAction(u.uid, u.paymentStatus === "payment_failed" ? "unban" : "ban")}
                        className={`px-3 py-1.5 rounded-lg text-[11px] font-space font-bold cursor-pointer transition-colors ${
                          u.paymentStatus === "payment_failed"
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                      >
                        {u.paymentStatus === "payment_failed" ? "Unban" : "Ban"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-xs text-gray-400">
                    No users match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Scans Tab ────────────────────────────────────────────────────────────────

function ScansTab({ scans, onDeleteScan }: { scans: ScanResult[]; onDeleteScan: (scanId: string) => void }) {
  const [search, setSearch] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("all");
  const [marketFilter, setMarketFilter] = useState("all");

  const marketplaces = useMemo(() => [...new Set(scans.map(s => s.marketplace))].sort(), [scans]);

  const filtered = useMemo(() =>
    scans
      .filter(s => {
        const q = search.toLowerCase();
        return (
          (!search || s.productTitle.toLowerCase().includes(q) || s.detectedBrand.toLowerCase().includes(q)) &&
          (verdictFilter === "all" || s.verdict === verdictFilter) &&
          (marketFilter  === "all" || s.marketplace === marketFilter)
        );
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [scans, search, verdictFilter, marketFilter]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search product title or detected brand…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2323ff] bg-white"
          />
        </div>
        <select
          value={verdictFilter}
          onChange={e => setVerdictFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2323ff] bg-white font-space font-bold text-gray-700 cursor-pointer"
        >
          <option value="all">All Verdicts</option>
          <option value="BLOCK_LISTING">Blocked</option>
          <option value="MANUAL_REVIEW">Review</option>
          <option value="SAFE_TO_PUBLISH">Safe</option>
        </select>
        <select
          value={marketFilter}
          onChange={e => setMarketFilter(e.target.value)}
          className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#2323ff] bg-white font-space font-bold text-gray-700 cursor-pointer"
        >
          <option value="all">All Marketplaces</option>
          {marketplaces.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-150">
          <span className="text-xs font-space font-bold text-gray-500">{filtered.length} scans</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-100 font-space font-bold text-gray-500 text-[11px] uppercase tracking-wide">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Marketplace</th>
                <th className="px-5 py-3">Verdict</th>
                <th className="px-5 py-3">Risk</th>
                <th className="px-5 py-3">Detected Brand</th>
                <th className="px-5 py-3">When</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => (
                <tr key={s.scanId} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                        <img src={s.imageUrl} alt="" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <span className="font-bold text-gray-900 truncate max-w-[180px]">{s.productTitle}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="font-space font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[10px]">{s.marketplace}</span>
                  </td>
                  <td className="px-5 py-3.5"><VerdictBadge verdict={s.verdict} /></td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-mono font-extrabold ${
                      s.riskScore >= 75 ? "text-red-600" : s.riskScore >= 40 ? "text-amber-600" : "text-green-600"
                    }`}>
                      {s.riskScore}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 max-w-[120px] truncate">
                    {s.detectedBrand !== "None" ? s.detectedBrand : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 font-mono whitespace-nowrap">{timeAgo(s.timestamp)}</td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onDeleteScan(s.scanId)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Delete scan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-xs text-gray-400">
                    No scans match your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Settings Tab ────────────────────────────────────────────────────────────

function SettingsTab({ users, onRefresh }: { users: UserProfile[]; onRefresh: () => void }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  async function callAction(endpoint: string, body: object, label: string) {
    setBusy(label);
    setMsg(null);
    try {
      const res = await apiFetch(endpoint, { method: "POST", body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        setMsg({ text: data.success ? "Done!" : data.error ?? "Done!", ok: res.ok });
        onRefresh();
      } else {
        setMsg({ text: data.error ?? "Failed", ok: false });
      }
    } catch {
      setMsg({ text: "Network error", ok: false });
    } finally {
      setBusy(null);
    }
  }

  const planLimits = [
    { plan: "free",   scans: 3,    price: "$0",  color: "bg-gray-100 text-gray-600"    },
    { plan: "pro",    scans: 100,  price: "$19", color: "bg-[#2323ff]/10 text-[#2323ff]" },
    { plan: "agency", scans: "∞",  price: "$79", color: "bg-black text-[#2cff05]"      },
  ];

  return (
    <div className="space-y-6 max-w-3xl">

      {msg && (
        <div className={`px-4 py-3 rounded-xl text-xs font-space font-bold ${msg.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {msg.ok ? "✓" : "✗"} {msg.text}
        </div>
      )}

      {/* Plan Limits Reference */}
      <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Crown className="w-4 h-4 text-[#2323ff]" />
          <h3 className="font-space font-bold text-sm text-gray-800">Plan Configuration</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {planLimits.map(p => (
            <div key={p.plan} className="border border-gray-150 rounded-xl p-4 space-y-2">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${p.color}`}>{p.plan}</span>
              <div className="text-xl font-space font-extrabold text-gray-900">{p.price}<span className="text-xs text-gray-400 font-normal">/mo</span></div>
              <div className="text-xs text-gray-500">{p.scans} scans / month</div>
            </div>
          ))}
        </div>
      </div>

      {/* User Management Actions */}
      <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-[#2323ff]" />
          <h3 className="font-space font-bold text-sm text-gray-800">User Actions</h3>
          <span className="text-[10px] text-gray-400 font-mono">Set plan · Promote admin · Reset scans</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-gray-100 font-space font-bold text-gray-500 text-[11px] uppercase tracking-wide">
                <th className="pb-2 pr-4">User</th>
                <th className="pb-2 pr-4">Current Plan</th>
                <th className="pb-2 pr-4">Set Plan</th>
                <th className="pb-2 pr-4">Role</th>
                <th className="pb-2">Scans</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(u => (
                <tr key={u.uid} className="hover:bg-gray-50/60">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <Avatar name={u.displayName} />
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate max-w-[120px]">{u.displayName}</div>
                        <div className="text-gray-400 truncate max-w-[120px]">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4"><PlanBadge plan={u.plan} /></td>
                  <td className="py-3 pr-4">
                    <div className="flex gap-1">
                      {["free", "pro", "agency"].filter(p => p !== u.plan).map(p => (
                        <button
                          key={p}
                          disabled={busy === `plan-${u.uid}-${p}`}
                          onClick={() => callAction("/api/admin/users/set-plan", { uid: u.uid, plan: p }, `plan-${u.uid}-${p}`)}
                          className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer transition-colors disabled:opacity-40 uppercase"
                        >
                          {busy === `plan-${u.uid}-${p}` ? "…" : p}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    {u.role === "admin" ? (
                      <button
                        disabled={busy === `role-${u.uid}`}
                        onClick={() => callAction("/api/admin/users/promote", { uid: u.uid, role: "user" }, `role-${u.uid}`)}
                        className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-red-50 hover:bg-red-100 text-red-700 cursor-pointer transition-colors disabled:opacity-40"
                      >
                        {busy === `role-${u.uid}` ? "…" : "Demote"}
                      </button>
                    ) : (
                      <button
                        disabled={busy === `role-${u.uid}`}
                        onClick={() => callAction("/api/admin/users/promote", { uid: u.uid, role: "admin" }, `role-${u.uid}`)}
                        className="px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 cursor-pointer transition-colors disabled:opacity-40"
                      >
                        {busy === `role-${u.uid}` ? "…" : "Make Admin"}
                      </button>
                    )}
                  </td>
                  <td className="py-3">
                    <button
                      disabled={busy === `reset-${u.uid}`}
                      onClick={() => callAction("/api/admin/users/reset-scans", { uid: u.uid }, `reset-${u.uid}`)}
                      className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 cursor-pointer transition-colors disabled:opacity-40"
                    >
                      <RefreshCw className={`w-3 h-3 ${busy === `reset-${u.uid}` ? "animate-spin" : ""}`} />
                      Reset
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-white border border-gray-150 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-[#2323ff]" />
          <h3 className="font-space font-bold text-sm text-gray-800">System</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { label: "Database",  value: "MySQL",    ok: true  },
            { label: "Auth",      value: "JWT 7d",   ok: true  },
            { label: "AI Engine", value: "Gemini",   ok: true  },
            { label: "Payments",  value: "Stripe",   ok: true  },
          ].map(s => (
            <div key={s.label} className="border border-gray-100 rounded-xl p-3 space-y-1">
              <div className="text-[10px] font-mono text-gray-400 uppercase">{s.label}</div>
              <div className="font-space font-bold text-gray-800 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${s.ok ? "bg-green-500" : "bg-red-500"}`} />
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

// ─── Main Export: AdminDashboard ──────────────────────────────────────────────

export function AdminDashboard({
  stats,
  onBanAction,
  onDeleteScan,
  onRefresh,
  loading = false,
}: {
  stats: AdminStats;
  onBanAction: (uid: string, action: string) => void;
  onDeleteScan: (scanId: string) => void;
  onRefresh: () => void;
  loading?: boolean;
}) {
  const [tab, setTab] = useState<"overview" | "users" | "scans" | "settings">("overview");

  const tabs = [
    { id: "overview"  as const, label: "Overview",                             Icon: BarChart3  },
    { id: "users"     as const, label: `Users (${stats.users.length})`,        Icon: Users      },
    { id: "scans"     as const, label: `Scans (${stats.scans.length})`,        Icon: Database   },
    { id: "settings"  as const, label: "Settings",                             Icon: Settings   },
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex items-end justify-between border-b border-gray-200">
        <div className="flex gap-0.5">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-3 text-xs font-space font-bold flex items-center gap-1.5 border-b-2 -mb-px transition-colors cursor-pointer ${
                tab === id
                  ? "border-[#2323ff] text-[#2323ff]"
                  : "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 mb-1 text-xs font-space font-bold text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
        >
          <Activity className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Tab content */}
      {tab === "overview"  && <OverviewTab stats={stats} />}
      {tab === "users"     && <UsersTab users={stats.users} onBanAction={onBanAction} />}
      {tab === "scans"     && <ScansTab scans={stats.scans} onDeleteScan={onDeleteScan} />}
      {tab === "settings"  && <SettingsTab users={stats.users} onRefresh={onRefresh} />}
    </div>
  );
}

// Keep old named exports so no other import breaks
export function RevenueStats() { return null; }
export function UserTable()    { return null; }
export function ScanTable()    { return null; }
