import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Building2, Activity, Brain, Bookmark } from "lucide-react";

const tabs = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Company", icon: Building2, path: "/company" },
  { label: "Feed", icon: Activity, path: "/feed" },
  { label: "AI", icon: Brain, path: "/ai-insights" },
  { label: "Watchlist", icon: Bookmark, path: "/watchlist" },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-sidebar border-t border-sidebar-border z-40 flex items-center justify-around px-2">
      {tabs.map((tab) => {
        const isActive =
          location.pathname === tab.path ||
          (tab.path === "/dashboard" && location.pathname === "/");
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
