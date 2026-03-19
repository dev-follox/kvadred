import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import ShopApp from "@/components/shop/ShopApp";
import DesignerApp from "@/components/designer/DesignerApp";

export default function AppDashboard() {
  const { userRole, isAdmin } = useAuth();

  if (userRole?.role === "company") return <ShopApp />;
  if (userRole?.role === "designer") return <DesignerApp />;
  if (isAdmin) return <Navigate to="/admin" replace />;

  return <Navigate to="/" replace />;
}
