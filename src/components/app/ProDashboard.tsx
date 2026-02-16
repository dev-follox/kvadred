import { useState } from "react";
import { Search, Plus, Users, DollarSign, Clock, CheckSquare, MessageSquare, FileText, Calendar, Bell, ChevronRight, TrendingUp, Package, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const stats = [
  { label: "Active Projects", value: "8", icon: CheckSquare, change: "+2 this month", color: "text-primary" },
  { label: "Team Members Online", value: "12", icon: Users, change: "of 18 total", color: "text-success" },
  { label: "This Month's Revenue", value: "$124,500", icon: DollarSign, change: "+18% vs last month", color: "text-warning" },
  { label: "Pending Approvals", value: "5", icon: Clock, change: "3 urgent", color: "text-destructive" },
];

const projects = [
  { id: 1, name: "Johnson Kitchen Remodel", client: "Sarah Johnson", status: "Active", budget: 45000, spent: 28500, progress: 63 },
  { id: 2, name: "Park Condo Renovation", client: "David Park", status: "Active", budget: 22000, spent: 8800, progress: 40 },
  { id: 3, name: "Williams Full Reno", client: "James Williams", status: "Active", budget: 120000, spent: 96000, progress: 80 },
  { id: 4, name: "Chen Living Room", client: "Michelle Chen", status: "On Hold", budget: 18500, spent: 3700, progress: 20 },
  { id: 5, name: "Garcia Bathroom Suite", client: "Carlos Garcia", status: "Active", budget: 35000, spent: 14000, progress: 40 },
];

const teamMembers = [
  { name: "Alex Rivera", role: "Project Manager", status: "online", tasks: 5 },
  { name: "Jordan Lee", role: "Lead Carpenter", status: "online", tasks: 3 },
  { name: "Sam Patel", role: "Electrician", status: "offline", tasks: 2 },
  { name: "Chris Wong", role: "Plumber", status: "online", tasks: 4 },
  { name: "Taylor Kim", role: "Painter", status: "online", tasks: 2 },
];

const inventoryItems = [
  { item: "Hardwood Flooring", stock: 450, unit: "sq ft", status: "In Stock", reorder: false },
  { item: "Subway Tile", stock: 80, unit: "sq ft", status: "Low Stock", reorder: true },
  { item: "Cabinet Handles", stock: 12, unit: "pcs", status: "Low Stock", reorder: true },
  { item: "LED Recessed Lights", stock: 24, unit: "pcs", status: "In Stock", reorder: false },
  { item: "PVC Pipe (1\")", stock: 200, unit: "ft", status: "In Stock", reorder: false },
];

const activities = [
  { text: "Johnson project: Phase 3 milestone completed", time: "2 min ago", type: "success" },
  { text: "New material order placed for Park Condo", time: "15 min ago", type: "info" },
  { text: "Client approval received: Williams bathroom design", time: "1 hr ago", type: "success" },
  { text: "Low stock alert: Subway tile below threshold", time: "2 hrs ago", type: "warning" },
  { text: "Team meeting scheduled for tomorrow 9 AM", time: "3 hrs ago", type: "info" },
];

const milestones = [
  { name: "Design Approval", date: "Jan 15", status: "done" },
  { name: "Demolition Complete", date: "Feb 1", status: "done" },
  { name: "Rough-In Inspection", date: "Feb 15", status: "done" },
  { name: "Cabinet Installation", date: "Mar 1", status: "current" },
  { name: "Final Walkthrough", date: "Mar 20", status: "upcoming" },
];

const ProDashboard = () => {
  const [selectedProject, setSelectedProject] = useState(projects[0]);
  const [projectSearch, setProjectSearch] = useState("");

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const statusBadge = (s: string) => {
    if (s === "Active") return "bg-success/10 text-success border-success/20";
    if (s === "On Hold") return "bg-warning/10 text-warning border-warning/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">Manage All Your Projects</h1>
        <p className="mt-1 text-muted-foreground">Overview of your renovation business</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <Card key={s.label} className="shadow-soft">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-secondary ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Three-column layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Project List */}
        <div className="lg:col-span-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search projects..." className="pl-9" value={projectSearch} onChange={e => setProjectSearch(e.target.value)} />
          </div>
          <Button className="w-full gradient-primary text-primary-foreground" size="sm" onClick={() => toast.success("Create project flow coming soon!")}>
            <Plus className="mr-1 h-4 w-4" /> Create New Project
          </Button>
          <div className="space-y-2">
            {filteredProjects.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedProject(p)}
                className={`w-full rounded-xl border p-3 text-left transition-all ${
                  selectedProject.id === p.id ? "border-primary/30 bg-primary/5 shadow-soft" : "border-border hover:bg-secondary"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{p.client}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Progress value={p.progress} className="h-1.5 flex-1" />
                  <span className="text-xs text-muted-foreground">{p.progress}%</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Project Detail */}
        <div className="lg:col-span-6">
          <Card className="shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{selectedProject.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{selectedProject.client}</p>
                </div>
                <Badge variant="outline" className={statusBadge(selectedProject.status)}>{selectedProject.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="w-full justify-start bg-secondary/50 mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="team">Team</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory</TabsTrigger>
                  <TabsTrigger value="client">Client</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-secondary p-4">
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="text-xl font-bold text-foreground">${selectedProject.budget.toLocaleString()}</p>
                      <Progress value={(selectedProject.spent / selectedProject.budget) * 100} className="mt-2 h-2" />
                      <p className="mt-1 text-xs text-muted-foreground">${selectedProject.spent.toLocaleString()} spent</p>
                    </div>
                    <div className="rounded-xl bg-secondary p-4">
                      <p className="text-xs text-muted-foreground">Progress</p>
                      <p className="text-xl font-bold text-foreground">{selectedProject.progress}%</p>
                      <Progress value={selectedProject.progress} className="mt-2 h-2" />
                      <p className="mt-1 text-xs text-muted-foreground">On schedule</p>
                    </div>
                  </div>
                  {/* Milestones */}
                  <div>
                    <p className="mb-3 text-sm font-semibold text-foreground">Milestones</p>
                    <div className="space-y-2">
                      {milestones.map((m, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-3">
                          <div className={`h-3 w-3 rounded-full ${
                            m.status === "done" ? "bg-success" : m.status === "current" ? "bg-primary animate-pulse" : "bg-muted-foreground/30"
                          }`} />
                          <div className="flex-1">
                            <p className={`text-sm ${m.status === "done" ? "text-muted-foreground line-through" : "font-medium text-foreground"}`}>{m.name}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{m.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="team" className="space-y-3">
                  {teamMembers.map((m, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                            {m.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card ${m.status === "online" ? "bg-success" : "bg-muted-foreground/30"}`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{m.name}</p>
                          <p className="text-xs text-muted-foreground">{m.role}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{m.tasks} tasks</Badge>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="inventory">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventoryItems.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium text-sm">{item.item}</TableCell>
                          <TableCell className="text-sm">{item.stock} {item.unit}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={item.reorder ? "bg-destructive/10 text-destructive border-destructive/20" : "bg-success/10 text-success border-success/20"}>
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {item.reorder && <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Reorder placed for ${item.item}`)}>Reorder</Button>}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                <TabsContent value="client" className="space-y-4">
                  <div className="rounded-xl bg-secondary p-4 space-y-3">
                    <p className="text-sm font-semibold text-foreground">Send Update to Client</p>
                    <Input placeholder="Type a message..." />
                    <Button size="sm"><Send className="mr-1 h-3 w-3" /> Send Update</Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Recent Messages</p>
                    {["Design changes approved ✓", "Invoice #1042 paid", "Photo update sent for kitchen progress"].map((msg, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg border border-border p-3">
                        <MessageSquare className="mt-0.5 h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{msg}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right: Activity Feed */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2"><Bell className="h-4 w-4" /> Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activities.map((a, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${
                    a.type === "success" ? "bg-success" : a.type === "warning" ? "bg-warning" : "bg-primary"
                  }`} />
                  <div>
                    <p className="text-xs text-foreground leading-relaxed">{a.text}</p>
                    <p className="text-xs text-muted-foreground">{a.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { label: "Schedule Meeting", icon: Calendar },
                { label: "Request Approval", icon: CheckSquare },
                { label: "Create Invoice", icon: FileText },
                { label: "Add Note", icon: MessageSquare },
              ].map(a => (
                <Button key={a.label} variant="outline" size="sm" className="w-full justify-start" onClick={() => toast.success(`${a.label} — coming soon!`)}>
                  <a.icon className="mr-2 h-3.5 w-3.5" /> {a.label}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProDashboard;
