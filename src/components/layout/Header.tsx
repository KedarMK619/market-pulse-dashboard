import { Search, Bell, AlertCircle } from "lucide-react";

const Header = () => {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-60 h-16 bg-[hsla(var(--header-bg))] backdrop-blur-xl border-b border-[hsla(var(--glass-border))] z-40 flex items-center justify-between px-4 md:px-6">
      {/* Left: Mobile logo + Badge */}
      <div className="lg:hidden flex items-center gap-2">
        <span className="text-lg font-bold text-foreground">
          Market<span className="text-primary">Pulse</span>
        </span>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
          <AlertCircle className="h-3 w-3 text-yellow-500" />
          <span className="text-xs font-semibold text-yellow-500">Learning</span>
        </div>
      </div>
      <div className="hidden lg:flex items-center gap-2">
        <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
          <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
          <span className="text-sm font-semibold text-yellow-500">⚠️ Educational Project</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden sm:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search companies, products, sectors..."
            className="w-full h-9 pl-9 pr-4 rounded-lg bg-[hsla(var(--input))] border border-[hsla(var(--glass-border))] text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* Right: Notifications + Avatar */}
      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-lg hover:bg-[hsla(var(--glass-bg))] transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </button>
        <div className="h-8 w-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
          <span className="text-xs font-semibold text-primary">MP</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
