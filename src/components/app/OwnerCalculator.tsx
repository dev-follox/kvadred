import { useState, useCallback } from "react";
import { Calculator, CheckCircle2, ChevronDown, ChevronRight, Download, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { toast } from "sonner";

const renovationOptions = [
  { id: "kitchen", label: "Kitchen", costRange: [100, 250] },
  { id: "bathroom", label: "Bathroom(s)", costRange: [150, 300] },
  { id: "living", label: "Living Areas", costRange: [50, 150] },
  { id: "bedrooms", label: "Bedrooms", costRange: [40, 120] },
  { id: "flooring", label: "Flooring", costRange: [30, 80] },
  { id: "electrical", label: "Electrical", costRange: [20, 60] },
  { id: "plumbing", label: "Plumbing", costRange: [25, 70] },
  { id: "hvac", label: "HVAC", costRange: [30, 90] },
];

const qualityMultipliers: Record<string, number> = { budget: 0.7, mid: 1.0, premium: 1.5 };

const phases = [
  { title: "Pre-Construction", weeks: "Week 1-2", items: ["Permits & approvals", "Design finalization", "Contract signing", "Material orders"] },
  { title: "Demolition & Rough-In", weeks: "Week 3-4", items: ["Demolition", "Structural work", "Electrical/Plumbing/HVAC rough-in", "Inspections"] },
  { title: "Installation", weeks: "Week 5-8", items: ["Drywall & mudding", "Flooring installation", "Cabinet & fixture install", "Trim & painting"] },
  { title: "Finishing Touches", weeks: "Week 9-10", items: ["Light fixtures", "Hardware installation", "Final hookups", "Appliance install & cleaning"] },
  { title: "Completion", weeks: "Week 11-12", items: ["Final walkthrough", "Punch list items", "Final inspection", "Documentation & handoff"] },
];

const OwnerCalculator = () => {
  const [sqft, setSqft] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [quality, setQuality] = useState("mid");
  const [showResults, setShowResults] = useState(false);
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  const toggleScope = useCallback((id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  }, []);

  const calculate = useCallback(() => {
    if (!sqft || selected.length === 0) {
      toast.error("Please enter square footage and select at least one renovation scope.");
      return;
    }
    setShowResults(true);
    toast.success("Estimate calculated successfully!");
  }, [sqft, selected]);

  const area = Number(sqft) || 0;
  const mult = qualityMultipliers[quality];

  const breakdown = selected.map(id => {
    const opt = renovationOptions.find(o => o.id === id)!;
    const fraction = area / selected.length;
    return {
      name: opt.label,
      low: Math.round(fraction * opt.costRange[0] * mult),
      high: Math.round(fraction * opt.costRange[1] * mult),
    };
  });

  const totalLow = breakdown.reduce((s, b) => s + b.low, 0);
  const totalHigh = breakdown.reduce((s, b) => s + b.high, 0);
  const weeks = Math.max(8, selected.length * 2 + 4);

  const chartData = breakdown.map(b => ({ name: b.name, low: b.low, high: b.high - b.low }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Calculate Your Renovation Budget & Timeline</h1>
        <p className="mt-2 text-muted-foreground">Get instant estimates based on real project data</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sqft */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Property Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="sqft" className="text-sm text-muted-foreground">Total Square Footage</Label>
            <div className="relative mt-2">
              <Input id="sqft" type="number" placeholder="e.g. 1500" value={sqft} onChange={e => setSqft(e.target.value)} className="pr-14" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">sq ft</span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Enter the total area to be renovated</p>
          </CardContent>
        </Card>

        {/* Scope */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Renovation Scope</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">What are you renovating?</p>
            <div className="grid grid-cols-2 gap-2">
              {renovationOptions.map(opt => (
                <label key={opt.id} className="flex cursor-pointer items-center gap-2 rounded-lg border border-border p-2.5 text-sm transition-colors hover:bg-secondary has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
                  <Checkbox checked={selected.includes(opt.id)} onCheckedChange={() => toggleScope(opt.id)} />
                  {opt.label}
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quality */}
        <Card className="shadow-soft">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quality Level</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">Material & Finish Quality</p>
            <RadioGroup value={quality} onValueChange={setQuality} className="space-y-2">
              {[
                { value: "budget", label: "Budget-Friendly", price: "$" },
                { value: "mid", label: "Mid-Range", price: "$$" },
                { value: "premium", label: "Premium", price: "$$$" },
              ].map(q => (
                <label key={q.value} className="flex cursor-pointer items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-secondary has-[:checked]:border-primary/30 has-[:checked]:bg-primary/5">
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value={q.value} />
                    <span className="text-sm font-medium">{q.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">{q.price}</span>
                </label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <Button size="lg" className="w-full gradient-primary text-primary-foreground font-semibold text-base" onClick={calculate}>
        <Calculator className="mr-2 h-5 w-5" /> Get Your Estimate
      </Button>

      {/* Results */}
      <AnimatePresence>
        {showResults && area > 0 && selected.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-primary/20 shadow-card">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Budget Range</p>
                    <p className="text-2xl font-bold text-foreground">${totalLow.toLocaleString()} – ${totalHigh.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-primary/20 shadow-card">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Timeline</p>
                    <p className="text-2xl font-bold text-foreground">{weeks - 2}–{weeks} weeks</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart */}
            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Cost Breakdown</CardTitle></CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                      <Bar dataKey="low" stackId="a" fill="hsl(var(--primary))" radius={[0, 0, 0, 0]} name="Low Estimate" />
                      <Bar dataKey="high" stackId="a" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} name="Range" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Phases */}
            <Card className="shadow-soft">
              <CardHeader><CardTitle className="text-base">Renovation Checklist</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {phases.map((phase, i) => (
                  <div key={i} className="rounded-lg border border-border">
                    <button
                      onClick={() => setExpandedPhase(expandedPhase === i ? null : i)}
                      className="flex w-full items-center justify-between p-4 text-left transition-colors hover:bg-secondary"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-primary-foreground">{i + 1}</div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{phase.title}</p>
                          <p className="text-xs text-muted-foreground">{phase.weeks}</p>
                        </div>
                      </div>
                      {expandedPhase === i ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                    </button>
                    <AnimatePresence>
                      {expandedPhase === i && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="border-t border-border px-4 py-3 space-y-2">
                            {phase.items.map(item => (
                              <div key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-success" /> {item}
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button variant="outline" className="w-full" onClick={() => toast.success("PDF download started!")}>
              <Download className="mr-2 h-4 w-4" /> Download PDF Report
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OwnerCalculator;
