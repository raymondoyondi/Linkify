import { useState, useEffect } from "react";
import { LinkItem, AnalyticsDataPoint, ThemeConfig } from "../types";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  MousePointerClick, 
  Percent, 
  FileDown, 
  Play, 
  Pause, 
  Sparkles, 
  Award,
  Clock,
  ExternalLink
} from "lucide-react";
import { MONTHLY_ANALYTICS } from "../data";

interface AnalyticsDashboardProps {
  links: LinkItem[];
  profileName: string;
  theme: ThemeConfig;
  liveStatsMultiplier: number;
}

export default function AnalyticsDashboard({
  links,
  profileName,
  theme,
  liveStatsMultiplier,
}: AnalyticsDashboardProps) {
  const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d");
  const [isRealTime, setIsRealTime] = useState<boolean>(true);
  const [liveTicks, setLiveTicks] = useState<number>(0);
  const [showReport, setShowReport] = useState<boolean>(false);

  // Dynamic ticking simulator for real-time analytics
  useEffect(() => {
    if (!isRealTime) return;
    const interval = setInterval(() => {
      setLiveTicks((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 3800);
    return () => clearInterval(interval);
  }, [isRealTime]);

  // Aggregate stats
  const baseClicks = links.reduce((acc, curr) => acc + curr.clickCount, 0);
  const totalClicks = baseClicks + liveTicks;
  // Simulated organic search traffic and referral ratio
  const totalVisitors = Math.floor(totalClicks * 0.72) + Math.floor(liveTicks * 0.5);
  const averageCtr = totalVisitors > 0 ? ((totalClicks / (totalVisitors * 1.35)) * 100).toFixed(1) : "0.0";

  // Build list of platform clicks for bar chart
  const platformDataMap = links.reduce((acc: Record<string, number>, curr) => {
    const plat = curr.platform === "custom" ? "Direct/Web" : curr.platform;
    acc[plat] = (acc[plat] || 0) + curr.clickCount;
    return acc;
  }, {});

  const platformColors: Record<string, string> = {
    instagram: "#E1306C",
    tiktok: "#000000",
    twitter: "#1DA1F2",
    linkedin: "#0A66C2",
    peerlist: "#00E676",
    github: "#333",
    gmail: "#EA4335",
    "Direct/Web": "#6366F1",
  };

  const platformClicksData = Object.entries(platformDataMap).map(([title, val]) => ({
    name: title.toUpperCase(),
    clicks: val,
    color: platformColors[title.toLowerCase()] || "#845EF7",
  }));

  // Fetch trend timeframe data
  const originalTrend = MONTHLY_ANALYTICS[timeframe];
  // Apply live additions to the latest data point if real-time is toggled
  const trendData: AnalyticsDataPoint[] = originalTrend.map((dp, idx) => {
    if (idx === originalTrend.length - 1) {
      return {
        ...dp,
        clicks: dp.clicks + liveTicks,
        visitors: dp.visitors + Math.floor(liveTicks * 0.7),
      };
    }
    return dp;
  });

  // Export mock monthly PDF performance report
  const handleExportPDF = () => {
    // We open standard print dialogue styled tailored for PDF printing
    window.print();
  };

  return (
    <div id="analytics-panel-wrapper" className="space-y-6">
      
      {/* Real-time Ticker and Controls Header */}
      <div className="bg-slate-300/[0.04] dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isRealTime && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isRealTime ? "bg-emerald-500" : "bg-slate-400"}`}></span>
            </span>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100 uppercase tracking-wider font-mono">
              Live Clickstream Monitoring
            </h4>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {isRealTime ? "Tracking real-time audience conversions, link interactions, and content engagement." : "Stream paused. Turn on for live simulation updates."}
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-stretch sm:self-auto">
          <button
            onClick={() => setIsRealTime(!isRealTime)}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border transition-colors ${
              isRealTime 
                ? "bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20" 
                : "bg-emerald-600 hover:bg-emerald-500 text-white border-transparent"
            }`}
          >
            {isRealTime ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Stream
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Resume Stream
              </>
            )}
          </button>

          <button
            onClick={() => setShowReport(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs border border-transparent cursor-pointer transition-colors"
          >
            <FileDown className="w-3.5 h-3.5" /> Performance Report
          </button>
        </div>
      </div>

      {/* Aggregate Scorecards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Clicks */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-bl from-indigo-500 to-transparent rounded-bl-3xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Interactions</span>
            <div className="bg-indigo-500/10 p-2 rounded-xl text-indigo-500">
              <MousePointerClick className="w-5 h-5 shadow-xs" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white transition-all duration-500">
              {totalClicks.toLocaleString()}
            </span>
            {isRealTime && (
              <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-sm animate-pulse">
                +Live
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-500 font-semibold inline-flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +14.2%
            </span>
            vs last week
          </p>
        </div>

        {/* Unique Visitors */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-bl from-emerald-500 to-transparent rounded-bl-3xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Unique Visitors</span>
            <div className="bg-emerald-500/10 p-2 rounded-xl text-emerald-500">
              <Users className="w-5 h-5 shadow-xs" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {totalVisitors.toLocaleString()}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-500 font-semibold inline-flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +11.8%
            </span>
            organic profile referrals
          </p>
        </div>

        {/* Engagement average CTR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 p-4 opacity-5 bg-gradient-to-bl from-amber-500 to-transparent rounded-bl-3xl" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Click Through Rate</span>
            <div className="bg-amber-500/10 p-2 rounded-xl text-amber-500">
              <Percent className="w-5 h-5 shadow-xs" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {averageCtr}%
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-500 font-semibold inline-flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> +3.5%
            </span>
            above benchmark index
          </p>
        </div>
      </div>

      {/* Main Charts block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Area Trend Chart */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Audience Growth Trend</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Visualizing multi-channel click acquisition and organic growth over selected days.
              </p>
            </div>
            {/* Range Selectors */}
            <div className="bg-slate-100 dark:bg-slate-950 p-1 rounded-lg flex items-center gap-1 self-stretch sm:self-auto">
              {(["7d", "30d", "90d"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeframe(r)}
                  className={`flex-1 sm:flex-none text-xs font-medium px-3 py-1 rounded-md transition-all cursor-pointer whitespace-nowrap ${
                    timeframe === r
                      ? "bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                  }`}
                >
                  {r === "7d" ? "7 Days" : r === "30d" ? "30 Days" : "90 Days"}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="clicksGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.15} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#0f172a", 
                    borderColor: "#1e293b", 
                    borderRadius: "0.75rem",
                    color: "#f8fafc",
                    fontSize: "0.75rem"
                  }} 
                />
                <Area type="monotone" name="Total Clicks" dataKey="clicks" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#clicksGrad)" />
                <Area type="monotone" name="Unique Visitors" dataKey="visitors" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#visitorsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Platform Share Bar Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Interactions by Platform</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Distribution of organic click acquisitions across unified socials.
            </p>
          </div>

          <div className="h-[220px] w-full my-4 flex items-center justify-center">
            {platformClicksData.length === 0 ? (
              <span className="text-xs text-slate-400">No cross-platform clicks registered yet.</span>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={platformClicksData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.15} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={8} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} axisLine={false} />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.04)" }}
                    contentStyle={{ 
                      backgroundColor: "#0f172a", 
                      borderColor: "#1e293b", 
                      borderRadius: "0.75rem",
                      color: "#f8fafc",
                      fontSize: "0.75rem"
                    }}
                  />
                  <Bar dataKey="clicks" radius={[4, 4, 0, 0]}>
                    {platformClicksData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-white/[0.04]">
            <div className="flex flex-col">
              <span className="text-slate-500 dark:text-slate-400 font-semibold font-mono">HIGHEST REACH</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-bold uppercase mt-0.5">Tiktok Channel</span>
            </div>
            <div className="flex flex-col border-l border-slate-200 dark:border-white/10 pl-2">
              <span className="text-slate-500 dark:text-slate-400 font-semibold font-mono font-bold">BEST ENGAGEMENT</span>
              <span className="text-emerald-500 font-bold uppercase mt-0.5">LinkedIn Profile</span>
            </div>
          </div>
        </div>

      </div>

      {/* MODAL: Monthly Performance PDF Report Template */}
      {showReport && (
        <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-950 rounded-3xl max-w-3xl w-full border border-slate-300 dark:border-white/10 overflow-hidden flex flex-col shadow-2xl relative my-8">
            
            {/* Modal Control header (hidden in print) */}
            <div className="p-4 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-white/5 flex items-center justify-between print:hidden">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 font-mono">
                <Award className="w-4 h-4 text-indigo-500" /> Executive Monthly Performance Briefing
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportPDF}
                  className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5" /> PDF Print
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>

            {/* THE PRINT MODULE: Styled beautifully with @media print overrides */}
            <div id="pdf-report-canvas" className="p-8 sm:p-12 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 flex-1 overflow-y-auto print:p-0 print:bg-white print:text-black">
              
              {/* Report Title Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-8 border-b-2 border-slate-100 dark:border-white/5 print:border-slate-300">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold tracking-widest bg-indigo-600 text-white px-2 py-0.5 rounded-sm">Linkify PDF Report</span>
                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-0.5">
                      <Clock className="w-3 h-3" /> Monthly Review
                    </span>
                  </div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-2 font-mono tracking-tight print:text-black">
                    Link-In-Bio Analytics Audit
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 print:text-slate-600">
                    Prepared for: <span className="font-bold text-slate-700 dark:text-slate-200 print:text-black">{profileName || "@yourhandle"}</span>
                  </p>
                </div>
                
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-bold text-indigo-500 tracking-wider block font-mono">Linkify Digital Suite</span>
                  <span className="text-xs font-medium text-slate-600 dark:text-slate-450 mt-1 block">May 1, 2026 – May 26, 2026</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 block">Status: Verified Official</span>
                </div>
              </div>

              {/* Scorecard row inside PDF */}
              <div className="grid grid-cols-3 gap-4 my-8">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 print:bg-slate-100 print:border-slate-300">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono print:text-slate-600">Total Clicks</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 block mt-1 print:text-indigo-700">{totalClicks}</span>
                  <span className="text-[9px] text-emerald-500 font-semibold block mt-0.5">+14.2% Growth MoM</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 print:bg-slate-100 print:border-slate-300">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono print:text-slate-600">Unique Visitors</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white block mt-1 print:text-black">{totalVisitors}</span>
                  <span className="text-[9px] text-emerald-500 font-semibold block mt-0.5">+11.8% Organic Reach</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 print:bg-slate-100 print:border-slate-300">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono print:text-slate-600">Conversion CTR</span>
                  <span className="text-xl sm:text-2xl font-extrabold text-emerald-500 block mt-1 print:text-emerald-700">{averageCtr}%</span>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 block mt-0.5">Optimized Multi-Channel</span>
                </div>
              </div>

              {/* Links breakdown list in Report */}
              <div className="mt-8 space-y-4">
                <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-mono pb-2 border-b border-slate-100 dark:border-white/5 print:text-black">
                  Verified Multi-Channel Links Performance
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-white/5 text-slate-400 print:text-slate-600">
                        <th className="py-2.5 font-bold uppercase">Link Title / Platform</th>
                        <th className="py-2.5 font-bold uppercase text-right">Raw Clicks</th>
                        <th className="py-2.5 font-bold uppercase text-right">Engagement</th>
                        <th className="py-2.5 font-bold uppercase text-right">Destination Handle</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                      {links.map((link) => (
                        <tr key={link.id} className="text-slate-700 dark:text-slate-300 print:text-black">
                          <td className="py-3 font-semibold">
                            <div className="flex items-center gap-1.5 font-sans">
                              <span className="capitalize px-1.5 py-0.5 text-[9px] bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-sm print:bg-slate-200 font-bold block shrink-0">
                                {link.platform}
                              </span>
                              <span className="truncate max-w-[200px]">{link.title || "Untitled link"}</span>
                            </div>
                          </td>
                          <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white print:text-black">
                            {link.clickCount}
                          </td>
                          <td className="py-3 text-right text-emerald-500 font-bold font-mono">
                            {link.engagementRate ? `${link.engagementRate}%` : "4.0%"}
                          </td>
                          <td className="py-3 text-right text-slate-400 dark:text-slate-500 truncate max-w-[150px] font-mono font-semibold">
                            {link.url}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Growth Conclusion */}
              <div className="mt-10 p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 text-xs leading-relaxed text-indigo-900 dark:text-indigo-200 print:bg-slate-100 print:text-black print:border-slate-300">
                <div className="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300 font-bold uppercase tracking-wider font-mono mb-2">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> Linkify Strategic Growth Summary
                </div>
                Based on metric telemetry recorded between May 1st and May 26th, your personalized brand representation has registered a steady up-tick of unique visitors, largely pulled by TikTok and LinkedIn platforms. Multi-channel representation remains optimized. We recommend targeting hashtag generation on LinkedIn specifically to capture trending niches, maintaining automated schedules, and setting alerts for milestone clicks at 1,500 total interactions.
              </div>

              {/* Signature Line */}
              <div className="mt-12 pt-8 border-t border-slate-100 dark:border-white/5 flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 print:border-slate-300 print:text-slate-600">
                <span>System Authenticated: Linkify Security Cert</span>
                <span className="font-semibold font-mono tracking-wider">Page 1 of 1</span>
              </div>

            </div>

            {/* Print Note banner (hidden in print) */}
            <div className="p-4 bg-amber-500/10 border-t border-amber-500/15 text-[11px] text-amber-500 text-center print:hidden flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Note: Ensure your local browser PDF print options have "Background Graphics" enabled for optimal color rendering!
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
