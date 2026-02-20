import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, User, CreditCard, Settings, Bell } from "lucide-react";
import kvadredLogo from "@/assets/kvadred-logo.png";

export default function Account() {
  const { user, signOut, planType } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");

  const planLabel = planType === "free" ? "Free Plan" : planType === "owner_paid" ? "Owner Plan ($19 one-time)" : planType === "designer" ? "Designer Plan ($49/mo)" : "Company Plan ($149/mo)";
  const planFeatures = {
    free: ["1 project calculation", "Basic checklist (view only)"],
    owner_paid: ["Unlimited calculations", "Downloadable PDFs", "Interactive checklists", "Save projects"],
    designer: ["All Owner features", "Unlimited client projects", "Material library", "Custom templates", "Branded PDF exports"],
    company: ["All Designer features", "Team collaboration (10 users)", "Project management", "Inventory tracking", "Client portal", "Analytics & reporting"],
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from("profiles").upsert({
      user_id: user!.id,
      full_name: fullName,
      phone,
      company_name: company,
      bio,
      website_url: website,
      email: user!.email,
    });
    if (error) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile saved!" });
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const billingHistory = [
    { date: "Jan 1, 2026", desc: "Kvadred Designer Plan", amount: "$49.00", status: "Paid" },
    { date: "Dec 1, 2025", desc: "Kvadred Designer Plan", amount: "$49.00", status: "Paid" },
    { date: "Nov 1, 2025", desc: "Kvadred Designer Plan", amount: "$49.00", status: "Paid" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-soft">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred" className="h-7 w-7 object-contain" />
            <span className="text-lg font-bold text-foreground">Kvadred</span>
          </Link>
          <Link to="/app">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to App
            </Button>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto max-w-4xl px-4 py-10">
        <h1 className="text-2xl font-bold text-foreground mb-8">Account Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList className="mb-8 grid w-full grid-cols-4">
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" /><span className="hidden sm:inline">Profile</span></TabsTrigger>
            <TabsTrigger value="billing" className="gap-2"><CreditCard className="h-4 w-4" /><span className="hidden sm:inline">Billing</span></TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" /><span className="hidden sm:inline">Notifications</span></TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /><span className="hidden sm:inline">Settings</span></TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Full Name</Label>
                    <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="John Doe" className="mt-1" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={user?.email || ""} disabled className="mt-1 bg-muted" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" className="mt-1" />
                  </div>
                  <div>
                    <Label>Company Name</Label>
                    <Input value={company} onChange={e => setCompany(e.target.value)} placeholder="Your company" className="mt-1" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Bio</Label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell us about yourself..." rows={3} className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Website URL</Label>
                    <Input value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourwebsite.com" className="mt-1" />
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={saving} className="gradient-primary text-primary-foreground">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* BILLING TAB */}
          <TabsContent value="billing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
                <CardDescription>{planLabel}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {(planFeatures[planType] || planFeatures.free).map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {planType === "free" ? (
                  <Link to="/pricing">
                    <Button className="gradient-primary text-primary-foreground">Upgrade Plan</Button>
                  </Link>
                ) : (
                  <Button variant="outline">Manage Subscription</Button>
                )}
              </CardContent>
            </Card>

            {planType !== "free" && (
              <>
                <Card>
                  <CardHeader><CardTitle>Payment Method</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3 p-3 border border-border rounded-lg">
                      <div className="h-8 w-12 bg-muted rounded flex items-center justify-center text-xs font-bold">VISA</div>
                      <div>
                        <p className="text-sm font-medium">•••• •••• •••• 4242</p>
                        <p className="text-xs text-muted-foreground">Expires 12/27</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto">Update</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Billing History</CardTitle></CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 font-medium text-muted-foreground">Date</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Description</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Amount</th>
                          <th className="text-left py-2 font-medium text-muted-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billingHistory.map((row, i) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="py-3 text-muted-foreground">{row.date}</td>
                            <td className="py-3">{row.desc}</td>
                            <td className="py-3 font-medium">{row.amount}</td>
                            <td className="py-3"><span className="px-2 py-1 rounded-full bg-success/10 text-success text-xs font-medium">{row.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          {/* NOTIFICATIONS TAB */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Manage which emails you receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {[
                  { id: "welcome", label: "Welcome emails", desc: "Onboarding and getting started" },
                  { id: "payment", label: "Payment confirmations", desc: "Receipts and invoices" },
                  { id: "renewal", label: "Renewal reminders", desc: "3 days before billing" },
                  { id: "trial", label: "Trial ending alerts", desc: "2 days before trial expires" },
                  { id: "milestone", label: "Project milestones", desc: "Project completion updates" },
                  { id: "summary", label: "Monthly summary", desc: "Your usage and activity recap" },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* SETTINGS TAB */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Language</Label>
                    <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option>English (US)</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option>USD ($)</option>
                      <option>EUR (€)</option>
                      <option>GBP (£)</option>
                    </select>
                  </div>
                  <div>
                    <Label>Time Zone</Label>
                    <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option>UTC-5 (Eastern)</option>
                      <option>UTC-8 (Pacific)</option>
                      <option>UTC+0 (London)</option>
                    </select>
                  </div>
                  <div>
                    <Label>Date Format</Label>
                    <select className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
                <Button className="gradient-primary text-primary-foreground">Save Settings</Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions — proceed with caution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Export My Data</p>
                    <p className="text-xs text-muted-foreground">Download all your data</p>
                  </div>
                  <Button variant="outline" size="sm">Export</Button>
                </div>
                <div className="flex items-center justify-between p-3 border border-destructive/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-destructive">Delete Account</p>
                    <p className="text-xs text-muted-foreground">Permanently delete your account and data</p>
                  </div>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
