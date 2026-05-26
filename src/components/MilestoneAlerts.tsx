import { useState } from "react";
import { MetricMilestone } from "../types";
import { 
  Bell, 
  Shield, 
  AlertCircle, 
  Save, 
  ToggleLeft, 
  ToggleRight, 
  Info,
  CheckCircle2,
  Trash2,
  Plus
} from "lucide-react";

interface MilestoneAlertsProps {
  milestones: MetricMilestone[];
  onUpdateMilestones: (updated: MetricMilestone[]) => void;
  userRole: "owner" | "editor" | "manager" | "viewer";
  onRoleChange: (role: "owner" | "editor" | "manager" | "viewer") => void;
  currentClicks: number;
}

export default function MilestoneAlerts({
  milestones,
  onUpdateMilestones,
  userRole,
  onRoleChange,
  currentClicks,
}: MilestoneAlertsProps) {
  const [editingMilestones, setEditingMilestones] = useState<MetricMilestone[]>(milestones);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [tempThresholds, setTempThresholds] = useState<Record<string, string>>({});
  const [newMetric, setNewMetric] = useState<"clicks" | "visitors" | "ctr">("clicks");
  const [newThreshold, setNewThreshold] = useState<string>("500");

  // Determine what each role can do
  const canModifyToggle = userRole !== "viewer";
  const canModifyThresholdValue = (metric: string) => {
    if (userRole === "owner") return true;
    if (userRole === "manager" && (metric === "visitors" || metric === "ctr")) return true;
    return false;
  };

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case "owner": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "manager": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "editor": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "viewer": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const handleToggleActive = (id: string) => {
    if (!canModifyToggle) return;
    const updated = editingMilestones.map((m) => {
      if (m.id === id) {
        return { ...m, isEnabled: !m.isEnabled };
      }
      return m;
    });
    setEditingMilestones(updated);
    onUpdateMilestones(updated);
    triggerSuccess("Alert status toggled successfully!");
  };

  const handleThresholdChange = (id: string, val: string) => {
    setTempThresholds(prev => ({ ...prev, [id]: val }));
  };

  const handleSaveThreshold = (id: string, metric: string) => {
    if (!canModifyThresholdValue(metric)) return;
    const rawVal = tempThresholds[id];
    if (!rawVal) return;

    const numVal = parseFloat(rawVal);
    if (isNaN(numVal) || numVal <= 0) {
      alert("Please enter a valid positive number.");
      return;
    }

    const updated = editingMilestones.map((m) => {
      if (m.id === id) {
        return { ...m, threshold: numVal, notified: false };
      }
      return m;
    });
    setEditingMilestones(updated);
    onUpdateMilestones(updated);
    triggerSuccess(`Successfully updated alert threshold to ${numVal}!`);
  };

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => {
      setSuccessMsg(null);
    }, 3000);
  };

  const handleCreateMilestone = () => {
    if (userRole !== "owner" && userRole !== "manager") {
      alert("Only Owners or Managers can create new metric thresholds.");
      return;
    }

    const parsed = parseFloat(newThreshold);
    if (isNaN(parsed) || parsed <= 0) {
      alert("Please enter a valid threshold number.");
      return;
    }

    const newAlert: MetricMilestone = {
      id: `m-${Date.now()}`,
      metric: newMetric,
      threshold: parsed,
      role: userRole,
      isEnabled: true,
      notified: false,
    };

    const updated = [...editingMilestones, newAlert];
    setEditingMilestones(updated);
    onUpdateMilestones(updated);
    setNewThreshold("");
    triggerSuccess("New dynamic milestone threshold added!");
  };

  const handleDeleteMilestone = (id: string, metric: string) => {
    if (!canModifyThresholdValue(metric)) {
      alert("Permission denied. You cannot remove this metric.");
      return;
    }
    const updated = editingMilestones.filter((m) => m.id !== id);
    setEditingMilestones(updated);
    onUpdateMilestones(updated);
    triggerSuccess("Metric threshold alert deleted.");
  };

  return (
    <div id="alerts-config-pane" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-white/5">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500 animate-swing" /> Push Milestone Alerts
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure push notifications when your Linkify profile reaches key conversion milestones.
          </p>
        </div>

        {/* Role Custom Switcher */}
        <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-200/50 dark:border-white/10 self-start md:self-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 font-mono flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" /> Simulation Role:
          </span>
          <select
            value={userRole}
            onChange={(e) => onRoleChange(e.target.value as any)}
            className="bg-white dark:bg-slate-900 text-xs font-semibold px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="owner">Owner (Admin)</option>
            <option value="manager">Manager</option>
            <option value="editor">Editor</option>
            <option value="viewer">Viewer (View-Only)</option>
          </select>
        </div>
      </div>

      {successMsg && (
        <div className="my-4 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-500 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4" /> {successMsg}
        </div>
      )}

      {/* Role permission explanatory notice */}
      <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-950/60 rounded-xl border border-slate-200/50 dark:border-white/5 flex items-start gap-2.5 text-xs">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div className="text-slate-500 dark:text-slate-400 leading-relaxed">
          Active Role Permission: <span className={`border px-1.5 py-0.5 rounded-sm text-[10px] font-bold uppercase font-mono ${getRoleBadgeColor()}`}>{userRole}</span>. 
          {userRole === "owner" && " Full access. You can toggle and overwrite all alert thresholds."}
          {userRole === "manager" && " Medium access. You can customize Unique Visitors and CTR limits but not Total Clicks."}
          {userRole === "editor" && " Restricted access. You can enable or disable active alerts, but cannot edit limit thresholds."}
          {userRole === "viewer" && " View only. You can monitor milestone alerts but cannot modify schedules or metrics."}
        </div>
      </div>

      {/* Active Thresholds Config Lines */}
      <div className="mt-6 space-y-4">
        {editingMilestones.map((milestone) => {
          const currentVal = tempThresholds[milestone.id] ?? milestone.threshold.toString();
          const hasChanges = currentVal !== milestone.threshold.toString();
          const isAllowedValueChange = canModifyThresholdValue(milestone.metric);

          return (
            <div 
              key={milestone.id} 
              className={`p-4 rounded-xl border transition-all ${
                milestone.isEnabled 
                  ? "bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-white/5" 
                  : "bg-slate-100/30 dark:bg-slate-900/10 border-slate-150 dark:border-white/[0.02] opacity-60"
              } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
            >
              <div className="flex items-start gap-3">
                <button
                  disabled={!canModifyToggle}
                  onClick={() => handleToggleActive(milestone.id)}
                  title={canModifyToggle ? "Toggle alert" : "View only"}
                  className={`shrink-0 mt-0.5 cursor-pointer ${!canModifyToggle ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {milestone.isEnabled ? (
                    <ToggleRight className="w-7 h-7 text-indigo-500" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-slate-400" />
                  )}
                </button>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">
                      {milestone.metric === "clicks" ? "Total Clicks" : milestone.metric === "visitors" ? "Unique Visitors" : "CTR Rate"} Goal
                    </span>
                    <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-sm font-semibold font-mono">
                      {milestone.metric === "ctr" ? "%" : "qty"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Triggers when {milestone.metric === "ctr" ? "CTR exceeds" : "clicks reach"} <span className="font-bold text-slate-600 dark:text-slate-300">{milestone.threshold}</span>.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 self-end sm:self-auto">
                <div className="relative">
                  <input
                    type="number"
                    disabled={!isAllowedValueChange}
                    value={currentVal}
                    onChange={(e) => handleThresholdChange(milestone.id, e.target.value)}
                    placeholder="Value.."
                    className={`text-xs font-mono font-bold w-24 px-2 py-1.5 rounded-lg border focus:outline-none ${
                      isAllowedValueChange 
                        ? "bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 border-slate-250 dark:border-slate-800 focus:border-indigo-500" 
                        : "bg-slate-100 dark:bg-slate-950 text-slate-400 border-slate-200 dark:border-white/5 cursor-not-allowed"
                    }`}
                  />
                  {milestone.metric === "ctr" && (
                    <span className="absolute right-2.5 top-1.5 text-[10px] font-bold text-slate-400">%</span>
                  )}
                </div>

                {isAllowedValueChange && hasChanges && (
                  <button
                    onClick={() => handleSaveThreshold(milestone.id, milestone.metric)}
                    className="p-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Save className="w-3.5 h-3.5" /> Save
                  </button>
                )}

                {isAllowedValueChange && (
                  <button
                    onClick={() => handleDeleteMilestone(milestone.id, milestone.metric)}
                    title="Delete milestone"
                    className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add alert panel */}
      {(userRole === "owner" || userRole === "manager") && (
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-dashed border-slate-200 dark:border-white/10">
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-3 font-mono">Create Dynamic Reach Milestone</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <select
              value={newMetric}
              onChange={(e: any) => setNewMetric(e.target.value)}
              className="bg-white dark:bg-slate-900 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="clicks">Total Clicks</option>
              <option value="visitors">Unique Visitors</option>
              <option value="ctr">Conversion CTR (%)</option>
            </select>
            <input
              type="number"
              placeholder="Min value..."
              value={newThreshold}
              onChange={(e) => setNewThreshold(e.target.value)}
              className="bg-white dark:bg-slate-900 text-xs font-mono font-bold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
            />
            <button
              onClick={handleCreateMilestone}
              className="py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add Threshold Goal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
