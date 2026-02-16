import { useState } from "react";
import { Search, Plus, Download, Save, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const sidebarItems = ["Quick Estimates", "Material Library", "Design Templates", "Client Projects"];

type EstimateRow = { id: number; item: string; qty: number; unitCost: number; notes: string };

const defaultEstimates: Record<string, EstimateRow[]> = {
  kitchen: [
    { id: 1, item: "Cabinets", qty: 12, unitCost: 850, notes: "Shaker style" },
    { id: 2, item: "Countertops (sq ft)", qty: 40, unitCost: 75, notes: "Quartz" },
    { id: 3, item: "Backsplash (sq ft)", qty: 30, unitCost: 25, notes: "Subway tile" },
    { id: 4, item: "Sink & Faucet", qty: 1, unitCost: 650, notes: "Undermount" },
    { id: 5, item: "Appliance Package", qty: 1, unitCost: 4500, notes: "Mid-range" },
    { id: 6, item: "Lighting", qty: 4, unitCost: 180, notes: "Pendant + recessed" },
    { id: 7, item: "Labor (hours)", qty: 120, unitCost: 65, notes: "Licensed contractor" },
  ],
  bathroom: [
    { id: 1, item: "Vanity", qty: 1, unitCost: 1200, notes: "Double sink" },
    { id: 2, item: "Tile (sq ft)", qty: 80, unitCost: 12, notes: "Porcelain" },
    { id: 3, item: "Shower/Tub", qty: 1, unitCost: 2000, notes: "Walk-in" },
    { id: 4, item: "Toilet", qty: 1, unitCost: 450, notes: "Elongated" },
    { id: 5, item: "Fixtures", qty: 3, unitCost: 200, notes: "Brushed nickel" },
    { id: 6, item: "Labor (hours)", qty: 80, unitCost: 65, notes: "" },
  ],
  living: [
    { id: 1, item: "Flooring (sq ft)", qty: 300, unitCost: 8, notes: "Engineered hardwood" },
    { id: 2, item: "Paint (gallons)", qty: 6, unitCost: 55, notes: "Premium" },
    { id: 3, item: "Trim/Molding (linear ft)", qty: 120, unitCost: 6, notes: "Crown molding" },
    { id: 4, item: "Lighting", qty: 3, unitCost: 250, notes: "Chandelier + sconces" },
    { id: 5, item: "Labor (hours)", qty: 40, unitCost: 55, notes: "" },
  ],
};

const materials = [
  { id: 1, name: "White Oak Hardwood", category: "Flooring", priceRange: "$8-$14/sq ft", fav: false },
  { id: 2, name: "Carrara Marble Tile", category: "Flooring", priceRange: "$15-$25/sq ft", fav: true },
  { id: 3, name: "Benjamin Moore Advance", category: "Paint", priceRange: "$55-$70/gal", fav: false },
  { id: 4, name: "Delta Trinsic Faucet", category: "Fixtures", priceRange: "$280-$350", fav: true },
  { id: 5, name: "Schlage Encode Lock", category: "Hardware", priceRange: "$250-$300", fav: false },
  { id: 6, name: "KitchenAid Range", category: "Appliances", priceRange: "$1,800-$2,400", fav: false },
  { id: 7, name: "Pottery Barn Sofa", category: "Furniture", priceRange: "$2,200-$3,000", fav: false },
  { id: 8, name: "Kohler Undermount Sink", category: "Fixtures", priceRange: "$350-$500", fav: true },
  { id: 9, name: "Porcelain Floor Tile", category: "Flooring", priceRange: "$5-$12/sq ft", fav: false },
];

const clientProjects = [
  { name: "Johnson Residence", type: "Full Kitchen", status: "In Progress", budget: "$45,000", timeline: "10 weeks" },
  { name: "Park Condo Unit 4B", type: "Bathroom", status: "Planning", budget: "$22,000", timeline: "6 weeks" },
  { name: "Williams Family Home", type: "Full Renovation", status: "Completed", budget: "$120,000", timeline: "16 weeks" },
  { name: "Chen Townhouse", type: "Living Room", status: "In Progress", budget: "$18,500", timeline: "4 weeks" },
];

const categories = ["All", "Flooring", "Paint", "Fixtures", "Hardware", "Appliances", "Furniture"];

const DesignerStudio = () => {
  const [activeSection, setActiveSection] = useState("Quick Estimates");
  const [roomType, setRoomType] = useState("kitchen");
  const [rows, setRows] = useState<EstimateRow[]>(defaultEstimates.kitchen);
  const [materialFilter, setMaterialFilter] = useState("All");
  const [materialSearch, setMaterialSearch] = useState("");

  const handleRoomChange = (val: string) => {
    setRoomType(val);
    setRows(defaultEstimates[val] || defaultEstimates.kitchen);
  };

  const updateRow = (id: number, field: keyof EstimateRow, value: string | number) => {
    setRows(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const addRow = () => {
    setRows(prev => [...prev, { id: Date.now(), item: "New Item", qty: 1, unitCost: 0, notes: "" }]);
  };

  const total = rows.reduce((s, r) => s + r.qty * r.unitCost, 0);

  const filteredMaterials = materials.filter(m =>
    (materialFilter === "All" || m.category === materialFilter) &&
    m.name.toLowerCase().includes(materialSearch.toLowerCase())
  );

  const statusColor = (s: string) => {
    if (s === "Completed") return "bg-success/10 text-success border-success/20";
    if (s === "In Progress") return "bg-primary/10 text-primary border-primary/20";
    return "bg-warning/10 text-warning border-warning/20";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Design & Estimate Faster</h1>
        <p className="mt-1 text-muted-foreground">Professional tools for interior designers</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="hidden w-56 flex-shrink-0 space-y-1 lg:block">
          {sidebarItems.map(item => (
            <button
              key={item}
              onClick={() => setActiveSection(item)}
              className={`w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                activeSection === item ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Mobile tabs */}
          <div className="mb-4 flex gap-2 overflow-x-auto lg:hidden">
            {sidebarItems.map(item => (
              <button key={item} onClick={() => setActiveSection(item)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  activeSection === item ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>{item}</button>
            ))}
          </div>

          {activeSection === "Quick Estimates" && (
            <Card className="shadow-soft">
              <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base">Quick Estimate Tool</CardTitle>
                <Select value={roomType} onValueChange={handleRoomChange}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="kitchen">Kitchen</SelectItem>
                    <SelectItem value="bathroom">Bathroom</SelectItem>
                    <SelectItem value="living">Living Room</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead className="w-20">Qty</TableHead>
                        <TableHead className="w-28">Unit Cost</TableHead>
                        <TableHead className="w-28">Total</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rows.map(r => (
                        <TableRow key={r.id}>
                          <TableCell>
                            <Input value={r.item} onChange={e => updateRow(r.id, "item", e.target.value)} className="h-8 text-sm" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={r.qty} onChange={e => updateRow(r.id, "qty", Number(e.target.value))} className="h-8 w-16 text-sm" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" value={r.unitCost} onChange={e => updateRow(r.id, "unitCost", Number(e.target.value))} className="h-8 text-sm" />
                          </TableCell>
                          <TableCell className="font-medium">${(r.qty * r.unitCost).toLocaleString()}</TableCell>
                          <TableCell>
                            <Input value={r.notes} onChange={e => updateRow(r.id, "notes", e.target.value)} className="h-8 text-sm" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <Button variant="outline" size="sm" onClick={addRow}><Plus className="mr-1 h-3 w-3" /> Add line item</Button>
                  <p className="text-lg font-bold text-foreground">Total: ${total.toLocaleString()}</p>
                </div>
                <div className="mt-4 flex gap-3">
                  <Button size="sm" onClick={() => toast.success("Estimate saved!")}><Save className="mr-1 h-3 w-3" /> Save Estimate</Button>
                  <Button size="sm" variant="outline" onClick={() => toast.success("PDF exported!")}><Download className="mr-1 h-3 w-3" /> Export to PDF</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "Material Library" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search materials..." className="pl-9" value={materialSearch} onChange={e => setMaterialSearch(e.target.value)} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(c => (
                  <button key={c} onClick={() => setMaterialFilter(c)}
                    className={`rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
                      materialFilter === c ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                    }`}>{c}</button>
                ))}
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredMaterials.map(m => (
                  <Card key={m.id} className="shadow-soft transition-all hover:shadow-card">
                    <CardContent className="p-5">
                      <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-secondary">
                        <Filter className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-foreground text-sm">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.category}</p>
                          <p className="mt-1 text-sm font-semibold text-primary">{m.priceRange}</p>
                        </div>
                        <button className="text-muted-foreground hover:text-warning transition-colors">
                          <Star className={`h-4 w-4 ${m.fav ? "fill-warning text-warning" : ""}`} />
                        </button>
                      </div>
                      <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => toast.success(`${m.name} added to project`)}>
                        <Plus className="mr-1 h-3 w-3" /> Add to Project
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeSection === "Design Templates" && (
            <div className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {["All", "Kitchen", "Bathroom", "Living Room", "Bedroom"].map(f => (
                  <button key={f} className="rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors first:bg-primary first:text-primary-foreground">{f}</button>
                ))}
              </div>
              <div className="columns-2 gap-4 lg:columns-3">
                {[180, 240, 160, 200, 280, 220, 190, 250, 170].map((h, i) => (
                  <div key={i} className="mb-4 break-inside-avoid overflow-hidden rounded-xl bg-secondary shadow-soft">
                    <div style={{ height: h }} className="bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                      <span className="text-muted-foreground/30 text-sm">Design {i + 1}</span>
                    </div>
                    <div className="p-3 flex items-center justify-between">
                      <span className="text-xs font-medium text-foreground">Modern {["Kitchen", "Bath", "Living", "Bedroom", "Office"][i % 5]}</span>
                      <Star className="h-3.5 w-3.5 text-muted-foreground hover:text-warning cursor-pointer" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "Client Projects" && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-base">Client Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client Name</TableHead>
                        <TableHead>Project Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Timeline</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {clientProjects.map((p, i) => (
                        <TableRow key={i} className="cursor-pointer hover:bg-secondary/50">
                          <TableCell className="font-medium">{p.name}</TableCell>
                          <TableCell>{p.type}</TableCell>
                          <TableCell><Badge variant="outline" className={statusColor(p.status)}>{p.status}</Badge></TableCell>
                          <TableCell>{p.budget}</TableCell>
                          <TableCell>{p.timeline}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesignerStudio;
