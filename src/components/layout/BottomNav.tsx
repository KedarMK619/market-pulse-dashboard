import { Link, useLocation } from "react-router-dom";
import { LayoutGrid, Building2, ShoppingBag, Brain, Bookmark } from "lucide-react";

const tabs = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { label: "Company", icon: Building2, path: "/company" },
  { label: "Products", icon: ShoppingBag, path: "/products" },
  { label: "PulseAI", icon: Brain, path: "/ai-insights" },
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
            className={`flex flex-col items-center gap-0.5 py-1.5 px-3 rounded-2xl transition-all ${
              isActive
                ? "bg-[#FFE055] text-[#141416] font-bold shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="text-[10px]">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
