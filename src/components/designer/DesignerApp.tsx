import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Store, ShoppingCart, User, ChevronDown, LogOut, Shield } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import kvadredLogo from "@/assets/kvadred-logo.png";
import DesignerOverview from "./DesignerOverview";
import DesignerShops from "./DesignerShops";
import DesignerSales from "./DesignerSales";

const tabs = [
  { id: "overview", label: "Дашборд", icon: LayoutDashboard },
  { id: "shops", label: "Магазины", icon: Store },
  { id: "sales", label: "Мои продажи", icon: ShoppingCart },
] as const;

type TabId = typeof tabs[number]["id"];

export default function DesignerApp() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const renderContent = () => {
    switch (activeTab) {
      case "overview": return <DesignerOverview />;
      case "shops": return <DesignerShops />;
      case "sales": return <DesignerSales />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-sidebar">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred" className="h-7 w-7 object-contain" />
            <span className="text-lg font-bold text-foreground">Kvadred</span>
          </Link>
          <div className="flex items-center gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-5 text-sm font-medium transition-colors ${activeTab === tab.id ? "text-primary" : "text-secondary-alpha hover:text-foreground"}`}
              >
                <tab.icon className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">{tab.label}</span>
                {activeTab === tab.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
              </button>
            ))}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:bg-foreground/5 transition-colors px-2 py-1">
                <div className="flex h-8 w-8 items-center justify-center bg-primary/10 text-sm font-semibold text-primary">
                  <User className="h-4 w-4" />
                </div>
                <ChevronDown className="h-4 w-4 text-secondary-alpha" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <div className="px-3 py-2">
                <p className="text-sm font-medium text-foreground truncate">{user?.email}</p>
                <p className="text-xs text-secondary-alpha">Дизайнер</p>
              </div>
              <DropdownMenuSeparator />
              {isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    <Shield className="h-4 w-4 mr-2" /> Админ
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" /> Выйти
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
}
