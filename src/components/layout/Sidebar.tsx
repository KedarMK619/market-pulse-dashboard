import { Link, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  Building2,
  ShoppingBag,
  Activity,
  Brain,
  Bookmark,
  Settings,
  ShieldAlert,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", icon: LayoutGrid, path: "/dashboard" },
  { label: "Company", icon: Building2, path: "/company" },
  { label: "Products", icon: ShoppingBag, path: "/products" },
  { label: "Feed", icon: Activity, path: "/feed" },
  { label: "PulseAI", icon: Brain, path: "/ai-insights" },
  { label: "Watchlist", icon: Bookmark, path: "/watchlist" },
  { label: "Settings", icon: Settings, path: "/settings" },
  { label: "Notice", icon: ShieldAlert, path: "/disclaimer" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-sidebar border-r border-sidebar-border z-50 px-4 py-5 justify-between overflow-y-auto">
      <div>
        {/* Brand Emblem */}
        <Link to="/dashboard" className="flex items-center justify-center gap-2.5 pb-6 pt-1">
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <circle cx="18" cy="18" r="13" stroke="#FF7597" strokeWidth="3" strokeDasharray="48 16" strokeLinecap="round" />
            <path
              d="M11 23 L17.5 11.5 L24 23"
              stroke="#1BF2B3"
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="17.5" cy="24.5" r="2.2" fill="#FFE055" />
          </svg>
          <span className="text-base font-extrabold tracking-tight text-foreground">
            Market<span className="text-[#FFE055]">Pulse</span>
          </span>
        </Link>

        {/* 2-Column Square Tile Navigation Grid */}
        <nav className="grid grid-cols-2 gap-3" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/dashboard" && location.pathname === "/");
            return (
              <Link
                key={item.path}
                to={item.path}
                className="group flex flex-col items-center gap-1.5 text-center"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-[#FFE055] text-[#141416] shadow-[0_8px_20px_rgba(255,224,85,0.28)] scale-[1.03]"
                      : "bento-tile text-muted-foreground group-hover:text-foreground group-hover:scale-[1.03]"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-[11px] leading-tight transition-colors ${
                    isActive
                      ? "font-semibold text-foreground"
                      : "font-medium text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Indigo/Violet Feature Card */}
      <div className="relative mt-8 pt-5">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#1C1C20] border-2 border-[#7C6BFF] shadow-lg">
          <Sparkles className="h-4 w-4 text-[#FFE055]" />
        </div>
        <div
          className="rounded-[22px] px-4 pt-7 pb-4 text-center text-white shadow-[0_14px_30px_rgba(44,32,120,0.38)]"
          style={{
            background: "linear-gradient(155deg, #4B38C9 0%, #2C217A 58%, #191645 100%)",
          }}
        >
          <p className="text-sm font-bold">PulseAI Tutor</p>
          <p className="mt-1 text-[11px] leading-relaxed text-white/75">
            Educational mode: ask doubts on stocks, P&amp;L &amp; demand.
          </p>
          <Link
            to="/ai-insights"
            className="mt-3.5 inline-flex w-full items-center justify-center rounded-full bg-[#FFE055] px-4 py-2 text-xs font-bold text-[#141416] hover:bg-[#ffd62b] transition-colors"
          >
            Ask PulseAI
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
