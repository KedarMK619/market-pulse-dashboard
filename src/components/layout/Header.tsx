import { useMemo, useState } from "react";
import { Search, Bell, AlertCircle, Building2, ShoppingBag, Brain } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { companies, products } from "@/lib/mock/mockData";

const ROUTE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/company": "Company Analyzer",
  "/products": "Product Tracker",
  "/feed": "Market Feed",
  "/ai-insights": "PulseAI Insights",
  "/watchlist": "My Watchlist",
  "/settings": "Settings",
  "/disclaimer": "Educational Disclaimer",
  "/privacy-policy": "Privacy Policy",
  "/terms-of-service": "Terms of Service",
};

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const pageTitle = ROUTE_TITLES[location.pathname] ?? "MarketPulse";

  const results = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return { companies: [], products: [] };
    return {
      companies: companies
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.symbol.toLowerCase().includes(q) ||
            c.sector.toLowerCase().includes(q)
        )
        .slice(0, 4),
      products: products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.brand.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        )
        .slice(0, 3),
    };
  }, [searchQuery]);

  const hasResults = results.companies.length > 0 || results.products.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    if (results.companies.length > 0) {
      navigate(`/company?symbol=${encodeURIComponent(results.companies[0].symbol)}`);
    } else if (results.products.length > 0) {
      navigate("/products");
    } else {
      navigate("/ai-insights");
    }
    setFocused(false);
    setSearchQuery("");
  };

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-60 h-16 bg-[hsla(var(--header-bg))] backdrop-blur-xl border-b border-border z-40 flex items-center justify-between px-4 md:px-6 gap-4">
      {/* Left: Title + Educational pill */}
      <div className="flex items-center gap-3 min-w-0">
        <span className="lg:hidden text-base font-extrabold text-foreground">
          Market<span className="text-[#FFE055]">Pulse</span>
        </span>
        <h1 className="hidden lg:block text-lg font-bold tracking-tight text-foreground truncate">
          {pageTitle}
        </h1>
        <button
          type="button"
          onClick={() => navigate("/disclaimer")}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FFE055]/15 border border-[#FFE055]/35 text-[11px] font-semibold text-[#FFE055] hover:bg-[#FFE055]/25 transition-colors"
        >
          <AlertCircle className="h-3 w-3" />
          Educational Only
        </button>
      </div>

      {/* Center: Pill Search Bar */}
      <form onSubmit={handleSubmit} className="hidden sm:flex items-center flex-1 max-w-md relative">
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFocused(true);
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => setFocused(false), 180)}
            placeholder="Search company, product, or ask PulseAI..."
            className="w-full h-10 pl-4 pr-10 rounded-full bg-[hsla(var(--input))] border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#FFE055]/50 transition-all"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>

        {focused && searchQuery.trim() && (
          <div className="absolute top-12 left-0 right-0 glass-card p-2 z-50 space-y-1">
            {hasResults ? (
              <>
                {results.companies.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onMouseDown={() => {
                      navigate(`/company?symbol=${encodeURIComponent(c.symbol)}`);
                      setSearchQuery("");
                      setFocused(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/70 text-left transition-colors"
                  >
                    <Building2 className="h-4 w-4 text-[#1BF2B3] shrink-0" />
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#FFE055] text-[#141416]">
                      {c.symbol}
                    </span>
                    <span className="text-sm font-medium text-foreground flex-1 truncate">{c.name}</span>
                    <span className="text-xs text-muted-foreground">${c.currentPrice.toFixed(2)}</span>
                  </button>
                ))}
                {results.products.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onMouseDown={() => {
                      navigate("/products");
                      setSearchQuery("");
                      setFocused(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-muted/70 text-left transition-colors"
                  >
                    <ShoppingBag className="h-4 w-4 text-[#FF7597] shrink-0" />
                    <span className="text-sm font-medium text-foreground flex-1 truncate">{p.name}</span>
                    <span className="text-xs text-muted-foreground">Demand {p.demandScore}/100</span>
                  </button>
                ))}
              </>
            ) : (
              <button
                type="button"
                onMouseDown={() => {
                  navigate("/ai-insights");
                  setSearchQuery("");
                  setFocused(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-muted/70 text-left text-sm text-foreground"
              >
                <Brain className="h-4 w-4 text-[#FFE055]" />
                Ask PulseAI about &ldquo;{searchQuery.trim()}&rdquo;
              </button>
            )}
          </div>
        )}
      </form>

      {/* Right: Alerts Bell + Profile Pill */}
      <div className="flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => navigate("/feed")}
          aria-label="Open Market Feed alerts"
          className="relative flex h-10 w-10 items-center justify-center rounded-full bento-tile text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-[#FF7597] text-[10px] font-bold text-[#141416] flex items-center justify-center">
            3
          </span>
        </button>
        <button
          type="button"
          onClick={() => navigate("/settings")}
          aria-label="Open Settings"
          className="h-10 w-10 rounded-full bg-[#FFE055] text-[#141416] font-extrabold text-xs flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
        >
          MP
        </button>
      </div>
    </header>
  );
};

export default Header;
