import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Calculator, Palette, BarChart3, Bell, ChevronDown, Settings, CreditCard, LogOut, Shield } from "lucide-react";
import kvadredLogo from "@/assets/kvadred-logo.png";
import OwnerCalculator from "@/components/app/OwnerCalculator";
import DesignerStudio from "@/components/app/DesignerStudio";
import ProDashboard from "@/components/app/ProDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tabs = [
  { id: "owner", label: "Owner Calculator", icon: Calculator },
  { id: "designer", label: "Designer Studio", icon: Palette },
  { id: "pro", label: "Pro Dashboard", icon: BarChart3 },
] as const;

type TabId = typeof tabs[number]["id"];

const AppDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>("owner");
  const { user, signOut, isPaid, planType, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const planLabel = planType === "free" ? "Free Plan" : planType === "owner_paid" ? "Owner Plan" : planType === "designer" ? "Designer Plan" : "Company Plan";

  const renderContent = () => {
    switch (activeTab) {
      case "owner": return <OwnerCalculator />;
      case "designer": return <DesignerStudio />;
      case "pro": return <ProDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Upgrade Banner for free users */}
      {!isPaid && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-center">
          <span className="text-sm text-foreground">You're on the free plan. </span>
          <Link to="/pricing" className="text-sm font-semibold text-primary hover:underline">
            Upgrade to unlock all features →
          </Link>
        </div>
      )}

      {/* Top Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-soft">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred logo" className="h-7 w-7 object-contain" />
            <span className="text-lg font-bold text-foreground">Kvadred</span>
          </Link>
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-5 text-sm font-medium transition-colors ${
                  activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-muted transition-colors px-2 py-1">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    <User className="h-4 w-4" />
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">{planLabel}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/account/profile")}>
                  <User className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/account/billing")}>
                  <CreditCard className="h-4 w-4 mr-2" /> Billing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/account/settings")}>
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/admin")}>
                      <Shield className="h-4 w-4 mr-2" /> Admin Console
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default AppDashboard;
