import React, { useState } from "react";
import { HashtagSuggestion } from "../types";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Share2, 
  AlertCircle, 
  Zap, 
  RefreshCw,
  Heart
} from "lucide-react";

export default function HashtagSuggester() {
  const [platform, setPlatform] = useState<string>("Instagram");
  const [topic, setTopic] = useState<string>("");
  const [tone, setTone] = useState<string>("Professional");
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<HashtagSuggestion[]>([
    {
      tag: "#linkinbio",
      category: "general",
      reachMultiplier: "High",
      explanation: "Industry-standard tag with high search intent across all major profiles.",
    },
    {
      tag: "#socialmediamarketing",
      category: "industry-specific",
      reachMultiplier: "Viral",
      explanation: "Frequently used by business marketers to index growth optimization tips.",
    },
    {
      tag: "#brandidentity",
      category: "trending",
      reachMultiplier: "Medium",
      explanation: "Highlights customized layout features to build unique personal aesthetics.",
    },
  ]);
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState<boolean>(true);

  const handleGenerateTags = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      alert("Please enter a topic or keyword to guide tag suggestions.");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch("/api/hashtag-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, topic, tone }),
      });

      if (!response.ok) {
        throw new Error("API server responded with error");
      }

      const data = await response.json();
      if (data.suggestions) {
        setSuggestions(data.suggestions);
        setIsDemo(!!data.isDemo);
      } else {
        setErrorMsg("Failed to generate correct response schema.");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Unable to reach backend generator. Re-try or use default suggestions.");
    } finally {
      setLoading(false);
    }
  };

  const copyIndividualTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };

  const copyAllTags = () => {
    const allTagsStr = suggestions.map((s) => s.tag).join(" ");
    navigator.clipboard.writeText(allTagsStr);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const getMultiplierColor = (multiplier: string) => {
    switch (multiplier.toLowerCase()) {
      case "viral":
      case "extremely high":
        return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "high":
        return "bg-indigo-500/10 text-indigo-500 border-indigo-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <div id="hashtag-ai-pane" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
      <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-100 dark:border-white/5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> AI Hashtag Generator
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Increase organic reach. Generate customized post hashtags optimized for your brand persona.
          </p>
        </div>
      </div>

      <form onSubmit={handleGenerateTags} className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Topic Input */}
        <div className="md:col-span-1 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wide">
            Keywords / Category Topic
          </label>
          <input
            type="text"
            required
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. digital agency, nodejs"
            className="text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Platform Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wide">
            Target Platform
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option>Instagram</option>
            <option>TikTok</option>
            <option>Twitter</option>
            <option>LinkedIn</option>
            <option>Peerlist</option>
            <option>GitHub</option>
          </select>
        </div>

        {/* Tone Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-500 dark:text-slate-450 uppercase tracking-wide">
            Brand Style Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option>Professional</option>
            <option>Casual & Relatable</option>
            <option>Energetic</option>
            <option>Aesthetic & Minimalist</option>
            <option>Helpful & Educational</option>
          </select>
        </div>

        {/* Submit action */}
        <div className="md:col-span-3 flex justify-end mt-2">
          <button
            type="submit"
            disabled={loading}
            className={`px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
              loading 
                ? "bg-indigo-300 dark:bg-indigo-900 text-indigo-100 dark:text-indigo-400 cursor-not-allowed" 
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-950/20"
            }`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Mining high-reach tags...
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> Recommend Hashtags
              </>
            )}
          </button>
        </div>
      </form>

      {/* Tags Display list */}
      <div className="mt-8">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-white/5 mb-4">
          <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-widest font-mono">
            Optimized Platform Hashtags ({suggestions.length})
          </span>

          {suggestions.length > 0 && (
            <button
              onClick={copyAllTags}
              className="text-xs font-bold text-indigo-500 hover:text-indigo-400 flex items-center gap-1.5 cursor-pointer bg-transparent border-0"
            >
              {copiedAll ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> Copied Suite
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copy Suite
                </>
              )}
            </button>
          )}
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/15 rounded-xl text-rose-500 text-xs flex items-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {isDemo && suggestions.length > 3 && (
          <div className="p-3 bg-indigo-500/[0.04] dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-[11px] text-indigo-650 dark:text-indigo-300 flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500 shrink-0" /> Since your environment's Gemini secret isn't specified yet, Linkify is using its prepackaged growth-tuning model!
          </div>
        )}

        <div className="space-y-3.5">
          {suggestions.map((item, idx) => (
            <div 
              key={idx} 
              className="p-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-white/5 rounded-2xl flex items-start justify-between gap-4 group hover:border-indigo-500/30 transition-all"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-slate-900 dark:text-white font-mono tracking-wide selection:bg-indigo-500/30">
                    {item.tag}
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-mono">
                    {item.category}
                  </span>
                  <span className={`text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-sm border ${getMultiplierColor(item.reachMultiplier)} font-mono`}>
                    Reach: {item.reachMultiplier}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {item.explanation}
                </p>
              </div>

              <button
                onClick={() => copyIndividualTag(item.tag)}
                title="Copy tag"
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 text-slate-400 group-hover:text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500/5 rounded-xl cursor-pointer shadow-xs transition-all shrink-0"
              >
                {copiedTag === item.tag ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
