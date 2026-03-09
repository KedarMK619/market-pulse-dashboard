import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  TrendingUp,
  Activity,
  Brain,
  Bookmark,
  Settings,
  BarChart3,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Company Analyzer", icon: Building2, path: "/company" },
  { label: "Product Tracker", icon: TrendingUp, path: "/products" },
  { label: "Market Feed", icon: Activity, path: "/feed" },
  { label: "AI Insights", icon: Brain, path: "/ai-insights" },
  { label: "Watchlist", icon: Bookmark, path: "/watchlist" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border z-50">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-sidebar-border">
        <BarChart3 className="h-7 w-7 text-primary" />
        <span className="text-lg font-bold text-foreground tracking-tight">
          Market<span className="text-primary">Pulse</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.path ||
            (item.path === "/dashboard" && location.pathname === "/");
          return (
            <Link
              key={item.path}
              to={item.path}
              className={isActive ? "sidebar-link-active" : "sidebar-link"}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-sidebar-border">
        <p className="text-xs text-muted-foreground">© 2026 MarketPulse</p>
      </div>
    </aside>
  );
};

export default Sidebar;
