import { useState, useMemo } from "react";
import { Building2, User, Calculator, Palette, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import OwnerCalculator from "@/components/app/OwnerCalculator";
import DesignerStudio from "@/components/app/DesignerStudio";
import ProDashboard from "@/components/app/ProDashboard";

const tabs = [
  { id: "owner", label: "Owner Calculator", icon: Calculator },
  { id: "designer", label: "Designer Studio", icon: Palette },
  { id: "pro", label: "Pro Dashboard", icon: BarChart3 },
] as const;

type TabId = typeof tabs[number]["id"];

const AppDashboard = () => {
  const [activeTab, setActiveTab] = useState<TabId>("owner");

  const content = useMemo(() => {
    switch (activeTab) {
      case "owner": return <OwnerCalculator />;
      case "designer": return <DesignerStudio />;
      case "pro": return <ProDashboard />;
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-background">
      {/* Top Nav */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card shadow-soft">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold text-foreground">RenoPlan</span>
          </Link>
          <div className="flex items-center gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-5 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
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
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
            <User className="h-4 w-4" />
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-4 py-8">
        {content}
      </main>
    </div>
  );
};

export default AppDashboard;
