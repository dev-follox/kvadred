import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calculator, Palette, BarChart3, CheckCircle2, ArrowRight, Home, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DemoModalProps {
  open: boolean;
  onClose: () => void;
}

const tabs = [
  { id: "calculator", label: "Budget Calculator", icon: Calculator },
  { id: "design", label: "Design Studio", icon: Palette },
  { id: "dashboard", label: "Project Dashboard", icon: BarChart3 },
];

const scopeOptions = ["Kitchen", "Bathroom", "Living Room", "Bedroom", "Full Home"];
const qualityOptions = [
  { label: "Standard", multiplier: 1, desc: "Cost-effective finishes" },
  { label: "Premium", multiplier: 1.6, desc: "Higher quality materials" },
  { label: "Luxury", multiplier: 2.4, desc: "Top-tier everything" },
];

function CalculatorDemo() {
  const [sqft, setSqft] = useState(500);
  const [scope, setScope] = useState("Kitchen");
  const [quality, setQuality] = useState(0);

  const baseCost = scope === "Full Home" ? 80 : scope === "Kitchen" ? 120 : scope === "Bathroom" ? 150 : 60;
  const min = Math.round(sqft * baseCost * qualityOptions[quality].multiplier);
  const max = Math.round(min * 1.25);
  const weeks = Math.round((sqft / 200) * (quality + 1) * 2);

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Square Footage: <span className="text-primary">{sqft} sq ft</span></label>
        <input type="range" min={100} max={3000} step={50} value={sqft} onChange={e => setSqft(Number(e.target.value))}
          className="w-full accent-primary" />
        <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>100</span><span>3,000</span></div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Renovation Scope</label>
        <div className="flex flex-wrap gap-2">
          {scopeOptions.map(s => (
            <button key={s} onClick={() => setScope(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${scope === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:border-primary/50"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Quality Level</label>
        <div className="grid grid-cols-3 gap-3">
          {qualityOptions.map((q, i) => (
            <button key={q.label} onClick={() => setQuality(i)}
              className={`p-3 rounded-xl border text-left transition-all ${quality === i ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
              <div className="text-sm font-bold text-foreground">{q.label}</div>
              <div className="text-xs text-muted-foreground">{q.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <motion.div key={`${sqft}-${scope}-${quality}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-card border border-primary/20 p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <span className="font-semibold text-foreground">Instant Estimate</span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Budget Range</p>
            <p className="text-2xl font-extrabold text-foreground">${(min / 1000).toFixed(0)}K – ${(max / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Timeline</p>
            <p className="text-2xl font-extrabold text-foreground">{weeks}–{weeks + 2} wks</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const designRooms = [
  { name: "Modern Kitchen", color: "#1a3a5c", accent: "#d4a853" },
  { name: "Nordic Bathroom", color: "#e8e4df", accent: "#8a9a8e" },
  { name: "Industrial Loft", color: "#2c2c2c", accent: "#c0392b" },
  { name: "Scandinavian", color: "#f5f0eb", accent: "#6b8f71" },
];

function DesignDemo() {
  const [selected, setSelected] = useState(0);
  const room = designRooms[selected];
  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">Choose a Style</label>
        <div className="grid grid-cols-2 gap-3">
          {designRooms.map((r, i) => (
            <button key={r.name} onClick={() => setSelected(i)}
              className={`p-3 rounded-xl border text-left transition-all ${selected === i ? "border-primary ring-1 ring-primary" : "border-border"}`}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 rounded-full" style={{ background: r.color }} />
                <div className="h-4 w-4 rounded-full" style={{ background: r.accent }} />
              </div>
              <span className="text-sm font-medium text-foreground">{r.name}</span>
            </button>
          ))}
        </div>
      </div>
      <motion.div key={selected} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
        className="rounded-2xl overflow-hidden border border-border shadow-card"
        style={{ background: room.color, height: 200 }}>
        <div className="h-full flex items-end p-5">
          <div className="space-y-1">
            <div className="h-2 w-24 rounded-full" style={{ background: room.accent }} />
            <div className="h-2 w-16 rounded-full opacity-60" style={{ background: room.accent }} />
            <p className="text-xs font-semibold mt-2" style={{ color: room.accent }}>{room.name} Preview</p>
          </div>
        </div>
      </motion.div>
      <div className="grid grid-cols-3 gap-2">
        {["Materials", "Furniture", "Lighting"].map(cat => (
          <div key={cat} className="rounded-lg border border-border p-3 text-center">
            <div className="h-8 w-8 rounded-full mx-auto mb-1" style={{ background: room.accent + "33" }} />
            <p className="text-xs font-medium text-foreground">{cat}</p>
            <p className="text-xs text-muted-foreground">12 items</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const projects = [
  { name: "Johnson Kitchen Reno", progress: 68, budget: "$42K", status: "In Progress", color: "bg-primary" },
  { name: "Park Ave Bathroom", progress: 100, budget: "$18K", status: "Complete", color: "bg-success" },
  { name: "Loft Full Renovation", progress: 23, budget: "$120K", status: "Planning", color: "bg-warning" },
];

function DashboardDemo() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[{ label: "Active Projects", value: "3" }, { label: "Total Budget", value: "$180K" }, { label: "Avg Progress", value: "64%" }].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-3 text-center">
            <p className="text-xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
      <div className="space-y-3">
        {projects.map(p => (
          <div key={p.name} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.budget} budget</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === "Complete" ? "bg-success/10 text-success" : p.status === "Planning" ? "bg-warning/10 text-warning-foreground" : "bg-primary/10 text-primary"}`}>
                {p.status}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${p.progress}%` }} transition={{ duration: 0.8, delay: 0.2 }}
                className={`h-full rounded-full ${p.color}`} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{p.progress}% complete</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DemoModal({ open, onClose }: DemoModalProps) {
  const [activeTab, setActiveTab] = useState("calculator");

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}>
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-2xl bg-background rounded-3xl shadow-elevated border border-border overflow-hidden"
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="gradient-primary px-6 py-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Play className="h-4 w-4 text-primary-foreground/70" />
                  <span className="text-xs font-semibold text-primary-foreground/70 uppercase tracking-wider">Live Demo</span>
                </div>
                <h2 className="text-xl font-bold text-primary-foreground">Try Kvadred — No Sign Up Needed</h2>
              </div>
              <button onClick={onClose} className="h-8 w-8 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 flex items-center justify-center transition-colors">
                <X className="h-4 w-4 text-primary-foreground" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border bg-card">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-all ${activeTab === tab.id ? "text-primary border-b-2 border-primary bg-background" : "text-muted-foreground hover:text-foreground"}`}>
                  <tab.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                  {activeTab === "calculator" && <CalculatorDemo />}
                  {activeTab === "design" && <DesignDemo />}
                  {activeTab === "dashboard" && <DashboardDemo />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-card px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Home className="h-4 w-4" />
                <span>This is a preview — sign up for full access</span>
              </div>
              <Link to="/auth" onClick={onClose}>
                <Button size="sm" className="gradient-primary text-primary-foreground">
                  Get Started Free <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
