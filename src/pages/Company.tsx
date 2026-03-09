import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Bookmark, TrendingUp, TrendingDown, Brain,
  ArrowRight, Loader2, BarChart3, Activity, Zap, AlertTriangle, Shield
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";
import { companies, plData, newsItems } from "@/lib/mock/mockData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ── helpers ──
const sectorColors: Record<string, string> = {
  Technology: "#00b4ff",
  Automotive: "#f59e0b",
  Retail: "#00ff88",
  Energy: "#ff4444",
};

const regionColors = ["#00ff88", "#00b4ff", "#f59e0b", "#ff4444", "#a855f7"];

const impactLevels = ["high", "medium", "low", "medium"] as const;

const demandDrivers = (factors: string[]) =>
  factors.map((f, i) => ({ name: f, impact: impactLevels[i % impactLevels.length] }));

// ── Company page ──
const Company = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(companies[0]); // Apple default
  const [showDropdown, setShowDropdown] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"1D" | "1W" | "1M" | "1Y">("1M");

  const filtered = useMemo(
    () =>
      query.trim()
        ? companies.filter(
            (c) =>
              c.name.toLowerCase().includes(query.toLowerCase()) ||
              c.symbol.toLowerCase().includes(query.toLowerCase())
          )
        : [],
    [query]
  );

  const companyPL = plData[selected.symbol] ?? [];
  const companyNews = newsItems.filter(
    (n) =>
      n.company.toLowerCase() === selected.name.split(" ")[0].toLowerCase() ||
      n.company === "Multiple"
  );

  const chartSlice = useMemo(() => {
    const d = selected.chartData;
    if (timeRange === "1D") return d.slice(-2);
    if (timeRange === "1W") return d.slice(-7);
    if (timeRange === "1Y") return d;
    return d; // 1M
  }, [selected, timeRange]);

  const isUp = selected.changePercent >= 0;

  // demand monthly data (generate simple from chartData length)
  const demandMonthly = useMemo(() => {
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    let s = selected.demandScore - 15;
    return months.map((m) => {
      s += (Math.random() - 0.4) * 4;
      s = Math.min(100, Math.max(10, s));
      return { month: m, score: parseFloat(s.toFixed(1)) };
    });
  }, [selected]);

  const regionData = [
    { name: "N. America", value: 30 + Math.round(selected.demandScore * 0.35) },
    { name: "Europe", value: 20 + Math.round(selected.demandScore * 0.25) },
    { name: "Asia", value: 25 + Math.round(selected.demandScore * 0.30) },
    { name: "Middle East", value: 10 + Math.round(selected.demandScore * 0.15) },
    { name: "India", value: 15 + Math.round(selected.demandScore * 0.20) },
  ];

  const handleAsk = () => {
    setAiLoading(true);
    setAiResponse(null);
    setTimeout(() => {
      setAiLoading(false);
      setAiResponse(
        `Based on current market data, ${selected.name} shows ${isUp ? "strong" : "mixed"} fundamentals with ${isUp ? "consistent revenue growth" : "some revenue pressure"} over the last 4 quarters.\n\n• Revenue trend: ${isUp ? "Upward" : "Under pressure"} — latest quarter at $${companyPL[0]?.revenue ?? "N/A"}B\n• Profit margin: ${companyPL[0]?.profitMargin ?? "N/A"}% ${(companyPL[0]?.changeFromLastQuarter ?? 0) >= 0 ? "improving" : "declining"}\n• Demand score: ${selected.demandScore}/100 (${selected.demandChange >= 0 ? "+" : ""}${selected.demandChange}% change)\n• Market position: ${selected.status} with $${selected.marketCap} market cap\n\nWatch for margin pressure in Q4 due to increased competition and macro headwinds.`
      );
    }, 2000);
  };

  const suggestedQuestions = [
    "Summarize Q3 performance",
    "Why is demand changing?",
    "Compare with competitors",
    "Predict next quarter trend",
    "What are the key risk factors?",
  ];

  const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

  return (
    <div className="space-y-8">
      {/* Page title */}
      <motion.div {...fade} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Company Analyzer</h1>
          <p className="text-sm text-muted-foreground mt-1">Deep-dive into company fundamentals</p>
        </div>
        <span className="text-sm text-muted-foreground hidden sm:block">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </span>
      </motion.div>

      {/* ── SECTION 1 — SEARCH ── */}
      <motion.div {...fade} transition={{ delay: 0.05 }} className="relative max-w-2xl mx-auto">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => query && setShowDropdown(true)}
          placeholder="Search any company or stock symbol..."
          className="pl-12 h-12 text-base glass-card border-[hsla(var(--glass-border))]"
        />
        {showDropdown && filtered.length > 0 && (
          <div className="absolute z-50 mt-1 w-full glass-card p-2 space-y-1 max-h-72 overflow-y-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                onClick={() => { setSelected(c); setQuery(""); setShowDropdown(false); setAiResponse(null); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[hsla(var(--glass-bg))] transition-colors text-left"
              >
                <Badge variant="outline" className="font-mono text-xs">{c.symbol}</Badge>
                <span className="text-sm text-foreground font-medium">{c.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{c.sector}</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* ── SECTION 2 — PROFILE CARD ── */}
      <motion.div {...fade} transition={{ delay: 0.1 }} className="glass-card p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Avatar */}
          <div
            className="shrink-0 h-16 w-16 rounded-full flex items-center justify-center text-2xl font-bold"
            style={{ background: sectorColors[selected.sector] ?? "#00b4ff", color: "#0a0f1e" }}
          >
            {selected.name[0]}
          </div>

          <div className="flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
              <Badge variant="outline" className="font-mono">{selected.symbol}</Badge>
              <Badge className="bg-secondary/20 text-secondary border-secondary/30">{selected.sector}</Badge>
              <Badge
                className={
                  selected.status === "Rising"
                    ? "bg-primary/20 text-primary border-primary/30"
                    : selected.status === "Falling"
                    ? "bg-destructive/20 text-destructive border-destructive/30"
                    : "bg-muted text-muted-foreground border-muted"
                }
              >
                {selected.status}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Founded {selected.foundedYear}</p>

            {/* Stat boxes */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
              <StatBox label="Current Price" value={`$${selected.currentPrice.toLocaleString()}`}>
                <span className={isUp ? "text-primary" : "text-destructive"}>
                  {isUp ? "+" : ""}{selected.changePercent.toFixed(2)}%
                </span>
              </StatBox>
              <StatBox label="Market Cap" value={selected.marketCap} />
              <StatBox label="52W High" value={`$${selected.high52week}`} className="text-primary" />
              <StatBox label="52W Low" value={`$${selected.low52week}`} className="text-destructive" />
            </div>

            <Button variant="outline" size="sm" className="border-primary/40 text-primary hover:bg-primary/10 mt-2">
              <Bookmark className="h-4 w-4 mr-1" /> Add to Watchlist
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ── SECTION 3 — TABS ── */}
      <motion.div {...fade} transition={{ delay: 0.15 }}>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-[hsla(var(--glass-bg))] border border-[hsla(var(--glass-border))] w-full justify-start overflow-x-auto">
            {["overview", "pnl", "demand", "news", "ai"].map((t) => (
              <TabsTrigger
                key={t}
                value={t}
                className="data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
              >
                {t === "overview" ? "Overview" : t === "pnl" ? "Profit & Loss" : t === "demand" ? "Demand" : t === "news" ? "News" : "AI Analysis"}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── TAB: OVERVIEW ── */}
          <TabsContent value="overview" className="space-y-6">
            {/* time range */}
            <div className="flex gap-2">
              {(["1D","1W","1M","1Y"] as const).map((r) => (
                <Button
                  key={r}
                  size="sm"
                  variant={timeRange === r ? "default" : "outline"}
                  className={timeRange === r ? "bg-primary text-primary-foreground" : ""}
                  onClick={() => setTimeRange(r)}
                >
                  {r}
                </Button>
              ))}
            </div>
            <div className="glass-card p-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartSlice}>
                  <XAxis dataKey="date" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}`} domain={["auto","auto"]} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsla(var(--glass-border))", borderRadius: 8, color: "#fff" }} formatter={(v: number) => [`$${v.toFixed(2)}`, "Price"]} />
                  <Line type="monotone" dataKey="price" stroke={isUp ? "hsl(var(--primary))" : "hsl(var(--destructive))"} strokeWidth={2} dot={false} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <StatBox label="Open Price" value={`$${(selected.currentPrice - selected.change).toFixed(2)}`} />
              <StatBox label="Day High" value={`$${(selected.currentPrice + Math.abs(selected.change) * 0.4).toFixed(2)}`} />
              <StatBox label="Day Low" value={`$${(selected.currentPrice - Math.abs(selected.change) * 1.2).toFixed(2)}`} />
            </div>
          </TabsContent>

          {/* ── TAB: P&L ── */}
          <TabsContent value="pnl" className="space-y-6">
            <div className="glass-card p-4">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={[...companyPL].reverse()}>
                  <XAxis dataKey="quarter" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}B`} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsla(var(--glass-border))", borderRadius: 8, color: "#fff" }} formatter={(v: number) => [`$${v}B`]} />
                  <Legend />
                  <Bar dataKey="revenue" name="Revenue" fill="#00b4ff" radius={[4,4,0,0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="#ff4444" radius={[4,4,0,0]} />
                  <Bar dataKey="netProfit" name="Net Profit" fill="#00ff88" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* table */}
            <div className="glass-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground">
                    {["Quarter","Revenue","Expenses","Net Profit","Margin %","vs Last Q"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-medium whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {companyPL.map((q) => (
                    <tr
                      key={q.quarter}
                      className={`border-t border-[hsla(var(--glass-border))] ${q.netProfit >= 0 ? "bg-primary/5" : "bg-destructive/5"}`}
                    >
                      <td className="px-4 py-3 font-medium text-foreground">{q.quarter}</td>
                      <td className="px-4 py-3 text-foreground">${q.revenue}B</td>
                      <td className="px-4 py-3 text-destructive">${q.expenses}B</td>
                      <td className="px-4 py-3 text-primary">${q.netProfit}B</td>
                      <td className="px-4 py-3 text-foreground">{q.profitMargin}%</td>
                      <td className={`px-4 py-3 font-medium ${q.changeFromLastQuarter >= 0 ? "text-primary" : "text-destructive"}`}>
                        {q.changeFromLastQuarter >= 0 ? "+" : ""}{q.changeFromLastQuarter}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ── TAB: DEMAND ── */}
          <TabsContent value="demand" className="space-y-6">
            {/* score */}
            <div className="glass-card p-6 text-center">
              <p className="text-sm text-muted-foreground mb-1">Current Demand Score</p>
              <p className={`text-5xl font-bold ${selected.demandScore > 60 ? "text-primary" : selected.demandScore > 40 ? "text-yellow-400" : "text-destructive"}`}>
                {selected.demandScore}
              </p>
              <span className={`text-sm ${selected.demandChange >= 0 ? "text-primary" : "text-destructive"}`}>
                {selected.demandChange >= 0 ? "+" : ""}{selected.demandChange}% change
              </span>
            </div>

            {/* area chart */}
            <div className="glass-card p-4">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={demandMonthly}>
                  <defs>
                    <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsla(var(--glass-border))", borderRadius: 8, color: "#fff" }} />
                  <Area type="monotone" dataKey="score" stroke="#00ff88" fill="url(#demandGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* pie */}
              <div className="glass-card p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">Demand by Region</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={regionData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {regionData.map((_, i) => (
                        <Cell key={i} fill={regionColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsla(var(--glass-border))", borderRadius: 8, color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* drivers */}
              <div className="glass-card p-4">
                <h3 className="text-sm font-semibold text-foreground mb-4">Key Demand Drivers</h3>
                <div className="space-y-3">
                  {demandDrivers(getDemandFactors(selected)).map((d, i) => (
                    <div key={i} className="flex items-start gap-3">
                      {d.impact === "high" ? <Zap className="h-4 w-4 text-destructive mt-0.5" /> : d.impact === "medium" ? <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" /> : <Shield className="h-4 w-4 text-muted-foreground mt-0.5" />}
                      <span className="text-sm text-foreground flex-1">{d.name}</span>
                      <Badge className={d.impact === "high" ? "bg-destructive/20 text-destructive border-destructive/30" : d.impact === "medium" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" : "bg-muted text-muted-foreground"}>
                        {d.impact}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── TAB: NEWS ── */}
          <TabsContent value="news" className="space-y-4">
            {companyNews.length === 0 && <p className="text-muted-foreground text-sm">No recent news for this company.</p>}
            {companyNews.map((n) => (
              <div
                key={n.id}
                className={`glass-card p-4 border-l-4 transition-all hover:translate-y-[-2px] hover:shadow-lg ${
                  n.sentiment === "positive" ? "border-l-primary" : n.sentiment === "negative" ? "border-l-destructive" : "border-l-muted-foreground"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground leading-snug">{n.headline}</h4>
                    <p className="text-xs text-muted-foreground">{n.source} · {n.time}</p>
                    <p className="text-xs text-muted-foreground mt-1">{n.summary}</p>
                  </div>
                  <Badge
                    className={
                      n.sentiment === "positive"
                        ? "bg-primary/20 text-primary border-primary/30 shrink-0"
                        : n.sentiment === "negative"
                        ? "bg-destructive/20 text-destructive border-destructive/30 shrink-0"
                        : "bg-muted text-muted-foreground shrink-0"
                    }
                  >
                    {n.sentiment}
                  </Badge>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* ── TAB: AI ANALYSIS ── */}
          <TabsContent value="ai" className="space-y-6">
            {/* chips */}
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((q) => (
                <button
                  key={q}
                  onClick={() => setAiQuestion(q)}
                  className="px-3 py-1.5 text-xs rounded-full border border-[hsla(var(--glass-border))] text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* input */}
            <div className="flex gap-3">
              <Textarea
                value={aiQuestion}
                onChange={(e) => setAiQuestion(e.target.value)}
                placeholder={`Ask anything about ${selected.name}...`}
                className="flex-1 min-h-[48px] max-h-24 glass-card border-[hsla(var(--glass-border))] focus-visible:ring-primary"
                rows={2}
              />
              <Button onClick={handleAsk} disabled={aiLoading || !aiQuestion.trim()} className="shrink-0 self-end">
                {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              </Button>
            </div>

            {/* response */}
            <div className="glass-card p-5 border border-transparent" style={{ borderImage: "linear-gradient(135deg, #00ff88, #00b4ff) 1" }}>
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">AI Analysis</span>
              </div>
              {aiLoading ? (
                <div className="flex items-center gap-2 text-muted-foreground text-sm py-6 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing {selected.name}...
                </div>
              ) : (
                <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {aiResponse ??
                    `Based on current market data, ${selected.name} shows strong fundamentals with consistent revenue growth over the last 4 quarters. Key strengths include market dominance in core segments and growing demand score. Watch for margin pressure in Q4 due to increased competition.`}
                </div>
              )}
              <p className="text-xs text-muted-foreground/60 mt-4">Powered by Claude AI</p>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

// helper to get demand factors from products or fallback
function getDemandFactors(company: typeof companies[number]): string[] {
  const map: Record<string, string[]> = {
    AAPL: ["Strong iPhone 15 sales cycle", "Services revenue expansion", "AI integration driving upgrades", "Emerging market growth"],
    TSLA: ["EV competition intensifying", "Price cuts impacting margins", "Cybertruck production ramp", "Energy storage growth"],
    AMZN: ["AWS AI workload growth", "Same-day delivery expansion", "Advertising revenue surge", "Prime membership growth"],
    MSFT: ["Copilot enterprise adoption", "Azure AI demand", "Gaming segment recovery", "Office 365 price increases"],
    GOOGL: ["Search AI integration", "Cloud revenue acceleration", "YouTube ad growth", "Antitrust regulatory risk"],
    RELIANCE: ["Jio 5G expansion", "Retail store growth", "Oil refining margins", "Digital services adoption"],
    TATAMOTORS: ["EV market leadership in India", "JLR premium segment recovery", "Export growth", "New model launches"],
    "005930": ["Memory chip cycle recovery", "Galaxy AI features", "Foundry business expansion", "Display technology lead"],
    TM: ["Hybrid sales surge", "Hydrogen fuel investment", "Production efficiency", "Emerging market demand"],
    META: ["Reels monetization", "Threads user growth", "AI infrastructure investment", "VR ecosystem development"],
  };
  return map[company.symbol] ?? ["Market positioning", "Revenue growth", "Competitive dynamics"];
}

// ── small stat box ──
const StatBox = ({ label, value, children, className }: { label: string; value: string; children?: React.ReactNode; className?: string }) => (
  <div className="glass-card p-3 space-y-1">
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className={`text-base font-bold ${className ?? "text-foreground"}`}>{value}</p>
    {children}
  </div>
);

export default Company;
