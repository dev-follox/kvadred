import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard, Users, BarChart3, Settings, FileText,
  ChevronLeft, ChevronRight, Search, Filter, MoreVertical,
  TrendingUp, DollarSign, UserCheck, AlertCircle, Shield,
  Eye, Edit, Trash2, Mail, Ban
} from "lucide-react";
import kvadredLogo from "@/assets/kvadred-logo.png";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "users", label: "User Management", icon: Users },
  { id: "revenue", label: "Revenue Analytics", icon: BarChart3 },
  { id: "settings", label: "System Settings", icon: Settings },
  { id: "logs", label: "Logs", icon: FileText },
];

const revenueData = [
  { month: "Sep", mrr: 8200, new: 1200, churned: 300 },
  { month: "Oct", mrr: 9100, new: 1500, churned: 200 },
  { month: "Nov", mrr: 10400, new: 2100, churned: 400 },
  { month: "Dec", mrr: 11800, new: 1900, churned: 150 },
  { month: "Jan", mrr: 13200, new: 2400, churned: 250 },
  { month: "Feb", mrr: 14900, new: 2800, churned: 180 },
];

const planDistribution = [
  { name: "Free", value: 842, color: "#8B9DC3" },
  { name: "Owner", value: 234, color: "#E8D44D" },
  { name: "Designer", value: 187, color: "#0D2137" },
  { name: "Company", value: 67, color: "#4267B2" },
];

const mockUsers = [
  { id: "1", name: "Sarah Chen", email: "sarah@design.co", role: "designer", plan: "designer", status: "active", created: "Jan 15, 2026", lastLogin: "2h ago" },
  { id: "2", name: "Marcus Williams", email: "marcus@construct.com", role: "company", plan: "company", status: "active", created: "Dec 3, 2025", lastLogin: "1d ago" },
  { id: "3", name: "Lisa Park", email: "lisa@gmail.com", role: "owner", plan: "free", status: "active", created: "Feb 10, 2026", lastLogin: "Just now" },
  { id: "4", name: "James Miller", email: "james@reno.pro", role: "designer", plan: "designer", status: "suspended", created: "Nov 20, 2025", lastLogin: "5d ago" },
  { id: "5", name: "Anna Torres", email: "anna@homes.co", role: "owner", plan: "owner_paid", status: "active", created: "Feb 5, 2026", lastLogin: "3h ago" },
];

const activityLogs = [
  { ts: "2026-02-20 14:32", user: "sarah@design.co", action: "Exported PDF", ip: "192.168.1.1", details: "Project #1234" },
  { ts: "2026-02-20 14:18", user: "marcus@construct.com", action: "Created project", ip: "10.0.0.45", details: "Project #5678" },
  { ts: "2026-02-20 13:55", user: "lisa@gmail.com", action: "Signed up", ip: "172.16.0.22", details: "Free plan" },
  { ts: "2026-02-20 12:10", user: "admin@kvadred.com", action: "Changed user plan", ip: "10.0.0.1", details: "james@reno.pro → suspended" },
];

export default function AdminConsole() {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/app");
      toast({ title: "Access denied", description: "Admin access required", variant: "destructive" });
    }
  }, [isAdmin, loading, navigate, toast]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  if (!isAdmin) return null;

  const filteredUsers = mockUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const planBadgeColor: Record<string, string> = {
    free: "bg-muted text-muted-foreground",
    owner_paid: "bg-accent/20 text-foreground",
    designer: "bg-primary/10 text-primary",
    company: "bg-success/10 text-success",
  };

  const statusBadgeColor: Record<string, string> = {
    active: "bg-success/10 text-success",
    suspended: "bg-destructive/10 text-destructive",
    inactive: "bg-muted text-muted-foreground",
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`sticky top-0 h-screen flex flex-col border-r border-border bg-card transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-56"}`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <img src={kvadredLogo} alt="Kvadred" className="h-6 w-6 object-contain" />
              <span className="text-sm font-bold text-foreground">Admin</span>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="p-1 rounded-md hover:bg-muted transition-colors">
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeSection === item.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && item.label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <Link to="/app">
            <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-all`}>
              <Shield className="h-4 w-4 flex-shrink-0" />
              {!sidebarCollapsed && "Exit Admin"}
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border bg-card px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground capitalize">{navItems.find(n => n.id === activeSection)?.label}</h1>
            <p className="text-xs text-muted-foreground">Kvadred Admin Console</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs text-success font-medium bg-success/10 px-3 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" /> System Online
            </span>
          </div>
        </header>

        <main className="p-6">
          {/* ===================== DASHBOARD ===================== */}
          {activeSection === "dashboard" && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Users", value: "1,330", change: "+12.4%", icon: Users, color: "text-primary" },
                  { label: "Monthly Revenue", value: "$14,900", change: "+8.2%", icon: DollarSign, color: "text-success" },
                  { label: "Active Subscriptions", value: "488", change: "+5.7%", icon: UserCheck, color: "text-accent" },
                  { label: "Churn Rate", value: "2.1%", change: "-0.3%", icon: TrendingUp, color: "text-warning" },
                ].map((stat, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-success mt-1">{stat.change} this month</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl border border-border bg-card p-5 shadow-soft">
                  <h3 className="font-semibold text-foreground mb-4">Monthly Recurring Revenue</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                      <Line type="monotone" dataKey="mrr" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
                  <h3 className="font-semibold text-foreground mb-4">Users by Plan</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                        {planDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {planDistribution.map(p => (
                      <div key={p.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                          <span className="text-muted-foreground">{p.name}</span>
                        </div>
                        <span className="font-medium text-foreground">{p.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {activityLogs.slice(0, 4).map((log, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm py-2 border-b border-border last:border-0">
                      <span className="text-xs text-muted-foreground whitespace-nowrap">{log.ts.split(" ")[1]}</span>
                      <span className="font-medium text-foreground truncate">{log.user}</span>
                      <span className="text-muted-foreground">{log.action}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{log.details}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== USERS ===================== */}
          {activeSection === "users" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search users..." className="pl-9" />
                </div>
                <Button variant="outline" size="sm" className="gap-2"><Filter className="h-4 w-4" /> Filter</Button>
                <Button variant="outline" size="sm">Export CSV</Button>
              </div>

              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      {["User", "Role", "Plan", "Status", "Joined", "Last Login", "Actions"].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                              {u.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{u.name}</p>
                              <p className="text-xs text-muted-foreground">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize text-muted-foreground">{u.role}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${planBadgeColor[u.plan]}`}>
                            {u.plan === "owner_paid" ? "Owner" : u.plan.charAt(0).toUpperCase() + u.plan.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadgeColor[u.status]}`}>
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{u.created}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{u.lastLogin}</td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 rounded-md hover:bg-muted transition-colors"><MoreVertical className="h-4 w-4" /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View Profile</DropdownMenuItem>
                              <DropdownMenuItem><Edit className="h-4 w-4 mr-2" />Edit Details</DropdownMenuItem>
                              <DropdownMenuItem><Mail className="h-4 w-4 mr-2" />Send Email</DropdownMenuItem>
                              <DropdownMenuItem className="text-warning"><Ban className="h-4 w-4 mr-2" />Suspend</DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== REVENUE ===================== */}
          {activeSection === "revenue" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">Time range:</span>
                {["7", "30", "90", "365"].map(r => (
                  <button key={r} onClick={() => setTimeRange(r)} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${timeRange === r ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground"}`}>
                    {r === "7" ? "7 days" : r === "30" ? "30 days" : r === "90" ? "3 months" : "1 year"}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { label: "Total Revenue", value: "$67,400" },
                  { label: "MRR", value: "$14,900" },
                  { label: "ARPU", value: "$30.50" },
                  { label: "Conversion Rate", value: "36.7%" },
                ].map((m, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5 shadow-soft">
                    <p className="text-sm text-muted-foreground mb-2">{m.label}</p>
                    <p className="text-2xl font-bold text-foreground">{m.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-soft">
                <h3 className="font-semibold text-foreground mb-4">New vs. Churned Revenue</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                    <Legend />
                    <Bar dataKey="new" fill="hsl(var(--primary))" name="New Revenue" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="churned" fill="hsl(var(--destructive))" name="Churned" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* ===================== SETTINGS ===================== */}
          {activeSection === "settings" && (
            <div className="space-y-6 max-w-2xl">
              {[
                {
                  title: "General Settings",
                  fields: [
                    { label: "Platform Name", value: "Kvadred", type: "text" },
                    { label: "Support Email", value: "support@kvadred.com", type: "email" },
                  ],
                },
                {
                  title: "Pricing Settings",
                  fields: [
                    { label: "Owner One-Time Price ($)", value: "19", type: "number" },
                    { label: "Designer Monthly Price ($)", value: "49", type: "number" },
                    { label: "Company Monthly Price ($)", value: "149", type: "number" },
                    { label: "Designer Trial Days", value: "14", type: "number" },
                  ],
                },
              ].map(section => (
                <div key={section.title} className="rounded-xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="font-semibold text-foreground mb-4">{section.title}</h3>
                  <div className="space-y-4">
                    {section.fields.map(field => (
                      <div key={field.label}>
                        <label className="text-sm font-medium text-foreground block mb-1">{field.label}</label>
                        <Input type={field.type} defaultValue={field.value} />
                      </div>
                    ))}
                  </div>
                  <Button className="mt-4 gradient-primary text-primary-foreground">Save</Button>
                </div>
              ))}

              <div className="rounded-xl border border-border bg-card p-6 shadow-soft">
                <h3 className="font-semibold text-foreground mb-4">Feature Flags</h3>
                <div className="space-y-3">
                  {[
                    "AI-powered estimates",
                    "Contractor marketplace",
                    "Referral system",
                    "Beta features",
                  ].map(flag => (
                    <div key={flag} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <span className="text-sm font-medium text-foreground">{flag}</span>
                      <div className="relative inline-flex h-5 w-9 cursor-pointer rounded-full bg-muted transition-colors">
                        <span className="sr-only">Toggle</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===================== LOGS ===================== */}
          {activeSection === "logs" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search logs..." className="pl-9" />
                </div>
                <Button variant="outline" size="sm">Export CSV</Button>
              </div>

              <div className="rounded-xl border border-border bg-card overflow-hidden shadow-soft">
                <table className="w-full text-sm">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      {["Timestamp", "User", "Action", "IP Address", "Details"].map(h => (
                        <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {activityLogs.map((log, i) => (
                      <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30">
                        <td className="py-3 px-4 text-xs text-muted-foreground font-mono">{log.ts}</td>
                        <td className="py-3 px-4 text-foreground">{log.user}</td>
                        <td className="py-3 px-4"><span className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs">{log.action}</span></td>
                        <td className="py-3 px-4 text-xs text-muted-foreground font-mono">{log.ip}</td>
                        <td className="py-3 px-4 text-muted-foreground text-xs">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
