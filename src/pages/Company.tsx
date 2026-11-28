import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Bookmark,
  Brain,
  ArrowRight,
  Loader2,
  Zap,
  AlertTriangle,
  Shield,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Activity,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useSearchParams } from "react-router-dom";
import { companies, plData, newsItems } from "@/lib/mock/mockData";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FolderCard } from "@/components/ui/FolderCard";
import { SegmentedRing } from "@/components/ui/SegmentedRing";
import { useStockData } from "@/hooks/useStockData";
import { useCompanyNews } from "@/hooks/useNewsData";
import { useCompanyFinancials } from "@/hooks/useFinancialData";
import { useWatchlist } from "@/hooks/useWatchlist";
import { analyzeMarket } from "@/lib/api/gemini";

const sectorColors: Record<string, string> = {
  Technology: "#1BF2B3",
  Automotive: "#FFE055",
  Retail: "#2FA8D8",
  Energy: "#FF7597",
};

const regionColors = ["#1BF2B3", "#FFE055", "#2FA8D8", "#FF7597", "#A78BFA"];
const impactLevels = ["high", "medium", "low", "medium"] as const;

const demandDrivers = (factors: string[]) =>
  factors.map((f, i) => ({ name: f, impact: impactLevels[i % impactLevels.length] }));

const Company = () => {
  const [searchParams] = useSearchParams();
  const initialSymbol = searchParams.get("symbol");
  const matchedInitial = initialSymbol
    ? companies.find((c) => c.symbol.toLowerCase() === initialSymbol.toLowerCase())
    : undefined;

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(matchedInitial ?? companies[0]);
  const [activeTab, setActiveTab] = useState("overview");
  const [showDropdown, setShowDropdown] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<"1D" | "1W" | "1M" | "1Y">("1M");
  const { watchlist, addCompany, removeCompany } = useWatchlist();
  const selectedIsWatched = watchlist.some((item) => item.id === selected.id);

  useEffect(() => {
    const sym = searchParams.get("symbol");
    if (!sym) return;
    const found = companies.find((c) => c.symbol.toLowerCase() === sym.toLowerCase());
    if (found && found.id !== selected.id) {
      setSelected(found);
      setAiResponse(null);
    }
  }, [searchParams, selected.id]);

  const stockData = useStockData(selected.symbol);
  const newsData = useCompanyNews(selected.name.split(" ")[0]);
  const financialData = useCompanyFinancials(selected.symbol);

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

  const currentPrice = stockData.quote?.price ?? selected.currentPrice;
  const change = stockData.quote?.change ?? selected.change;
  const changePercent = stockData.quote?.changePercent ?? selected.changePercent;
  const companyPL =
    financialData.incomeStatement.length > 0
      ? financialData.incomeStatement
      : plData[selected.symbol] ?? [];
  const companyNews =
    newsData.articles.length > 0
      ? newsData.articles
      : newsItems.filter(
          (n) =>
            n.company.toLowerCase() === selected.name.split(" ")[0].toLowerCase() ||
            n.company === "Multiple"
        );

  const chartData = stockData.history.length > 0 ? stockData.history : selected.chartData;
  const chartSlice = useMemo(() => {
    if (timeRange === "1D") return chartData.slice(-2);
    if (timeRange === "1W") return chartData.slice(-7);
    return chartData;
  }, [chartData, timeRange]);

  const isUp = changePercent >= 0;

  const demandMonthly = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let s = selected.demandScore - 15;
    return months.map((m, i) => {
      s = Math.min(100, Math.max(10, s + ((i % 3) - 0.6) * 2.5));
      return { month: m, score: parseFloat(s.toFixed(1)) };
    });
  }, [selected]);

  const regionData = [
    { name: "N. America", value: 30 + Math.round(selected.demandScore * 0.35) },
    { name: "Europe", value: 20 + Math.round(selected.demandScore * 0.25) },
    { name: "Asia", value: 25 + Math.round(selected.demandScore * 0.3) },
    { name: "Middle East", value: 10 + Math.round(selected.demandScore * 0.15) },
    { name: "India", value: 15 + Math.round(selected.demandScore * 0.2) },
  ];

  const handleAsk = async () => {
    if (!aiQuestion.trim()) return;
    setAiLoading(true);
    setAiResponse(null);
    try {
      const marketContext = {
        company: selected,
        stockData: stockData.quote,
        financialData: companyPL,
        newsData: companyNews,
        demandScore: selected.demandScore,
        demandChange: selected.demandChange,
      };
      const response = await analyzeMarket(aiQuestion, marketContext);
      setAiResponse(`${response}\n\n⚠️ AI Generated - Educational Only\nPowered by Gemini AI`);
    } catch {
      setAiResponse(
        "Analysis temporarily unavailable. Please try again shortly. ⚠️ Educational project only.\n\n⚠️ AI Generated - Educational Only\nPowered by Gemini AI"
      );
    } finally {
      setAiLoading(false);
    }
  };

  const suggestedQuestions = [
    "Summarize Q3 performance",
    "Why is demand changing?",
    "Compare with competitors",
    "Predict next quarter trend",
    "What are the key risk factors?",
  ];

  const fade = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

  return (
    <div className="space-y-6">
      {/* Header + Search Bar */}
      <motion.div {...fade} className="glass-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Company Analyzer</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Deep-dive into company fundamentals, financials &amp; demand signals
          </p>
        </div>

        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => query && setShowDropdown(true)}
            placeholder="Search company or ticker (e.g. AAPL, TSLA)..."
            className="pl-11 h-11 rounded-full bg-[hsla(var(--input))] border-border"
          />
          {showDropdown && filtered.length > 0 && (
            <div className="absolute z-50 mt-2 w-full glass-card p-2 space-y-1 max-h-72 overflow-y-auto">
              {filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelected(c);
                    setQuery("");
                    setShowDropdown(false);
                    setAiResponse(null);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-muted/70 transition-colors text-left"
                >
                  <Badge className="bg-[#FFE055] text-[#141416] font-mono text-xs">{c.symbol}</Badge>
                  <span className="text-sm text-foreground font-semibold">{c.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{c.sector}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick Company Switcher Strip */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {companies.map((c) => {
          const active = c.id === selected.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setSelected(c);
                setAiResponse(null);
              }}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all ${
                active
                  ? "bg-[#FFE055] text-[#141416] shadow-sm"
                  : "bento-tile text-muted-foreground hover:text-foreground"
              }`}
            >
              {c.symbol}
            </button>
          );
        })}
      </div>

      {/* Profile Header + 3 Folder Cards */}
      <motion.div {...fade} transition={{ delay: 0.05 }} className="glass-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="shrink-0 h-14 w-14 rounded-2xl flex items-center justify-center text-xl font-extrabold text-[#141416]"
              style={{ backgroundColor: sectorColors[selected.sector] ?? "#1BF2B3" }}
            >
              {selected.symbol.slice(0, 4)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-extrabold text-foreground">{selected.name}</h3>
                <Badge variant="outline" className="font-mono text-xs">{selected.symbol}</Badge>
                <Badge className="bg-[#2FA8D8]/20 text-[#2FA8D8] border-[#2FA8D8]/30">{selected.sector}</Badge>
                <Badge
                  className={
                    selected.status === "Rising"
                      ? "bg-[#1BF2B3]/20 text-[#1BF2B3] border-[#1BF2B3]/30"
                      : selected.status === "Falling"
                      ? "bg-[#FF7597]/20 text-[#FF7597] border-[#FF7597]/30"
                      : "bg-[#FFE055]/20 text-[#FFE055] border-[#FFE055]/30"
                  }
                >
                  {selected.status}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Founded {selected.foundedYear}
                {stockData.lastUpdated && ` · Updated ${new Date(stockData.lastUpdated).toLocaleTimeString()}`}
              </p>
            </div>
          </div>

          <Button
            onClick={() => (selectedIsWatched ? removeCompany(selected.id) : addCompany(selected))}
            className={`rounded-full font-bold ${
              selectedIsWatched
                ? "bg-[#FFE055] text-[#141416] hover:bg-[#ffd62b]"
                : "bento-tile text-foreground hover:brightness-110"
            }`}
          >
            <Bookmark className="h-4 w-4 mr-1.5" />
            {selectedIsWatched ? "In Watchlist" : "Add to Watchlist"}
          </Button>
        </div>

        {stockData.error && (
          <Alert variant="default" className="bg-[#FFE055]/10 border-[#FFE055]/30 rounded-2xl">
            <AlertCircle className="h-4 w-4 text-[#FFE055]" />
            <AlertDescription className="text-foreground/85 text-xs ml-2">
              {stockData.error}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FolderCard
            tone="mint"
            label="Stock Price"
            value={`$${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            trend={`${isUp ? "+" : ""}${changePercent.toFixed(2)}% Today`}
            metaLabel="Market Cap"
            metaValue={`$${selected.marketCap}`}
            ctaLabel="Overview"
            onCtaClick={() => setActiveTab("overview")}
            icon={<DollarSign className="h-3 w-3" />}
          />
          <FolderCard
            tone="yellow"
            label="52-Week Range"
            value={`$${selected.high52week}`}
            trend={`Low $${selected.low52week}`}
            metaLabel="Latest Net Profit"
            metaValue={companyPL[0] ? `$${companyPL[0].netProfit}B` : "N/A"}
            ctaLabel="P&L Tab"
            onCtaClick={() => setActiveTab("pnl")}
            icon={<TrendingUp className="h-3 w-3" />}
          />
          <FolderCard
            tone="pink"
            label="Demand Score"
            value={`${selected.demandScore}/100`}
            trend={`${selected.demandChange >= 0 ? "+" : ""}${selected.demandChange}% Change`}
            metaLabel="Status"
            metaValue={selected.status}
            ctaLabel="Demand"
            onCtaClick={() => setActiveTab("demand")}
            icon={<Activity className="h-3 w-3" />}
          />
        </div>
      </motion.div>

      {/* ── SECTION 3 — BENTO PILL TABS ── */}
      <motion.div {...fade} transition={{ delay: 0.1 }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-5">
          <TabsList className="glass-card h-auto p-2 flex flex-wrap gap-1.5 justify-start w-full">
            {[
              { id: "overview", label: "Overview" },
              { id: "pnl", label: "Profit & Loss" },
              { id: "demand", label: "Demand" },
              { id: "news", label: "News" },
              { id: "ai", label: "AI Analysis" },
            ].map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="rounded-full px-4 py-2 text-xs font-bold data-[state=active]:bg-[#FFE055] data-[state=active]:text-[#141416] data-[state=active]:shadow-sm"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ── TAB: OVERVIEW ── */}
          <TabsContent value="overview" className="space-y-5">
            <div className="glass-card p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="text-base font-bold text-foreground">Price Performance</h4>
                <div className="flex gap-2">
                  {(["1D", "1W", "1M", "1Y"] as const).map((r) => (
                    <Button
                      key={r}
                      size="sm"
                      variant="ghost"
                      className={`rounded-full text-xs font-bold ${
                        timeRange === r
                          ? "bg-[#FFE055] text-[#141416] hover:bg-[#ffd62b]"
                          : "bento-tile text-muted-foreground hover:text-foreground"
                      }`}
                      onClick={() => setTimeRange(r)}
                      disabled={stockData.loading}
                    >
                      {r}
                    </Button>
                  ))}
                </div>
              </div>

              {stockData.loading ? (
                <div className="h-[300px] bg-muted animate-pulse rounded-2xl" />
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartSlice}>
                    <XAxis dataKey="date" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}`} domain={["auto", "auto"]} />
                    <Tooltip contentStyle={{ background: "#1C1C20", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} formatter={(v: number) => [`$${v.toFixed(2)}`, "Price"]} />
                    <Line
                      type="monotone"
                      dataKey={chartSlice[0]?.price ? "price" : "close"}
                      stroke={isUp ? "#1BF2B3" : "#FF7597"}
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bento-highlight p-5">
                <p className="text-xs font-semibold text-[#141416]/75">Open Price</p>
                <p className="text-xl font-extrabold text-[#141416] mt-1">
                  ${(currentPrice - change).toFixed(2)}
                </p>
              </div>
              <div className="glass-card p-5">
                <p className="text-xs font-semibold text-muted-foreground">Day High</p>
                <p className="text-xl font-extrabold text-[#1BF2B3] mt-1">
                  ${(currentPrice + Math.abs(change) * 0.4).toFixed(2)}
                </p>
              </div>
              <div className="glass-card p-5">
                <p className="text-xs font-semibold text-muted-foreground">Day Low</p>
                <p className="text-xl font-extrabold text-[#FF7597] mt-1">
                  ${(currentPrice - Math.abs(change) * 1.2).toFixed(2)}
                </p>
              </div>
            </div>
          </TabsContent>

          {/* ── TAB: P&L ── */}
          <TabsContent value="pnl" className="space-y-5">
            <div className="glass-card p-6">
              <h4 className="text-base font-bold text-foreground mb-4">Quarterly Revenue vs Expenses vs Profit</h4>
              {financialData.loading ? (
                <div className="h-[280px] bg-muted animate-pulse rounded-2xl" />
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={[...companyPL].reverse()}>
                    <XAxis dataKey="quarter" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(v: number) => `$${v}B`} />
                    <Tooltip contentStyle={{ background: "#1C1C20", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} formatter={(v: number) => [`$${v}B`]} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#2FA8D8" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="expenses" name="Expenses" fill="#FF7597" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="netProfit" name="Net Profit" fill="#1BF2B3" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {financialData.error && (
              <Alert variant="default" className="bg-[#FFE055]/10 border-[#FFE055]/30 rounded-2xl">
                <AlertCircle className="h-4 w-4 text-[#FFE055]" />
                <AlertDescription className="text-foreground/85 text-xs ml-2">
                  {financialData.error}
                </AlertDescription>
              </Alert>
            )}

            <div className="glass-card overflow-x-auto">
              {financialData.loading ? (
                <div className="h-32 bg-muted animate-pulse rounded-2xl" />
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted/30 text-muted-foreground">
                      {["Quarter", "Revenue", "Expenses", "Net Profit", "Margin %", "vs Last Q"].map((h) => (
                        <th key={h} className="px-5 py-3.5 text-left font-semibold whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {companyPL.map((q) => (
                      <tr key={q.quarter} className="border-t border-border hover:bg-muted/30 transition-colors">
                        <td className="px-5 py-3.5 font-bold text-foreground">{q.quarter}</td>
                        <td className="px-5 py-3.5 text-foreground">${q.revenue}B</td>
                        <td className="px-5 py-3.5 text-[#FF7597]">${q.expenses}B</td>
                        <td className="px-5 py-3.5 text-[#1BF2B3] font-semibold">${q.netProfit}B</td>
                        <td className="px-5 py-3.5 text-foreground">{q.profitMargin}%</td>
                        <td className={`px-5 py-3.5 font-bold ${q.changeFromLastQuarter >= 0 ? "text-[#1BF2B3]" : "text-[#FF7597]"}`}>
                          {q.changeFromLastQuarter >= 0 ? "+" : ""}{q.changeFromLastQuarter}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </TabsContent>

          {/* ── TAB: DEMAND ── */}
          <TabsContent value="demand" className="space-y-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-4 glass-card p-6 flex flex-col justify-center">
                <h4 className="text-base font-bold text-foreground mb-2">Demand Gauge</h4>
                <SegmentedRing
                  segments={[
                    { name: "Demand Score", value: selected.demandScore, color: "#FFE055" },
                    { name: "Headroom", value: Math.max(5, 100 - selected.demandScore), color: "#2FA8D8" },
                  ]}
                  centerPercent={`${selected.demandChange >= 0 ? "+" : ""}${selected.demandChange}%`}
                  centerValue={`${selected.demandScore}/100`}
                />
              </div>

              <div className="lg:col-span-8 glass-card p-6">
                <h4 className="text-base font-bold text-foreground mb-4">12-Month Demand Trend</h4>
                <ResponsiveContainer width="100%" height={230}>
                  <AreaChart data={demandMonthly}>
                    <defs>
                      <linearGradient id="companyDemandGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1BF2B3" stopOpacity={0.35} />
                        <stop offset="95%" stopColor="#1BF2B3" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#9ca3af", fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "#1C1C20", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
                    <Area type="monotone" dataKey="score" stroke="#1BF2B3" fill="url(#companyDemandGrad)" strokeWidth={2.5} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div className="glass-card p-6">
                <h3 className="text-base font-bold text-foreground mb-4">Demand by Region</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={regionData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={78} paddingAngle={4} cornerRadius={6} stroke="none">
                      {regionData.map((_, i) => (
                        <Cell key={i} fill={regionColors[i]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: "#1C1C20", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, color: "#fff" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-base font-bold text-foreground mb-4">Key Demand Drivers</h3>
                <div className="space-y-2.5">
                  {demandDrivers(getDemandFactors(selected)).map((d, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 p-3 ${
                        i === 0 ? "bento-highlight" : "bento-tile"
                      }`}
                    >
                      {d.impact === "high" ? (
                        <Zap className={`h-4 w-4 shrink-0 ${i === 0 ? "text-[#141416]" : "text-[#FF7597]"}`} />
                      ) : d.impact === "medium" ? (
                        <AlertTriangle className="h-4 w-4 shrink-0 text-[#FFE055]" />
                      ) : (
                        <Shield className="h-4 w-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className={`text-sm font-semibold flex-1 ${i === 0 ? "text-[#141416]" : "text-foreground"}`}>
                        {d.name}
                      </span>
                      <Badge
                        className={
                          i === 0
                            ? "bg-[#141416] text-[#FFE055]"
                            : d.impact === "high"
                            ? "bg-[#FF7597]/20 text-[#FF7597] border-[#FF7597]/30"
                            : "bg-muted text-muted-foreground"
                        }
                      >
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
            {newsData.error && (
              <Alert variant="default" className="bg-[#FFE055]/10 border-[#FFE055]/30 rounded-2xl">
                <AlertCircle className="h-4 w-4 text-[#FFE055]" />
                <AlertDescription className="text-foreground/85 text-xs ml-2">
                  {newsData.error}
                </AlertDescription>
              </Alert>
            )}
            {newsData.loading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="glass-card p-4 h-24 animate-pulse" />
              ))
            ) : companyNews.length === 0 ? (
              <p className="text-muted-foreground text-sm">No recent news for this company.</p>
            ) : (
              companyNews.map((n, idx) => (
                <a
                  key={n.headline}
                  href={n.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`block p-5 rounded-[22px] transition-transform hover:-translate-y-0.5 ${
                    idx === 0
                      ? "bento-highlight shadow-md"
                      : "glass-card"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className={`text-sm font-bold leading-snug ${idx === 0 ? "text-[#141416]" : "text-foreground"}`}>
                        {n.headline}
                      </h4>
                      <p className={`text-xs ${idx === 0 ? "text-[#141416]/75" : "text-muted-foreground"}`}>
                        {n.source} · {n.time}
                      </p>
                      <p className={`text-xs mt-1 ${idx === 0 ? "text-[#141416]/85" : "text-muted-foreground"}`}>
                        {n.summary}
                      </p>
                    </div>
                    <Badge
                      className={
                        idx === 0
                          ? "bg-[#141416] text-[#FFE055] shrink-0"
                          : n.sentiment === "positive"
                          ? "bg-[#1BF2B3]/20 text-[#1BF2B3] border-[#1BF2B3]/30 shrink-0"
                          : n.sentiment === "negative"
                          ? "bg-[#FF7597]/20 text-[#FF7597] border-[#FF7597]/30 shrink-0"
                          : "bg-muted text-muted-foreground shrink-0"
                      }
                    >
                      {n.sentiment}
                    </Badge>
                  </div>
                </a>
              ))
            )}
            <p className="text-xs text-muted-foreground mt-4">Data by NewsAPI — Click articles to read full stories</p>
          </TabsContent>

          {/* ── TAB: AI ANALYSIS ── */}
          <TabsContent value="ai" className="space-y-5">
            <div className="glass-card p-6 space-y-5">
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setAiQuestion(q)}
                    className="bento-tile px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-[#FFE055] hover:text-[#141416] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <div className="flex gap-3">
                <Textarea
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder={`Ask PulseAI about ${selected.name} (educational analysis only)...`}
                  className="flex-1 min-h-[52px] max-h-28 rounded-2xl bg-[hsla(var(--input))] border-border focus-visible:ring-[#FFE055]"
                  rows={2}
                />
                <Button
                  onClick={handleAsk}
                  disabled={aiLoading || !aiQuestion.trim()}
                  className="shrink-0 self-end rounded-full bg-[#FFE055] text-[#141416] hover:bg-[#ffd62b] font-bold px-5"
                >
                  {aiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>

              <div className="bento-tile p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-[#FFE055]" />
                  <span className="text-sm font-bold text-foreground">PulseAI Educational Analysis</span>
                </div>
                {aiLoading ? (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm py-6 justify-center">
                    <Loader2 className="h-4 w-4 animate-spin" /> Analyzing {selected.name}...
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {aiResponse ??
                      `Based on dashboard sample data, ${selected.name} (${selected.symbol}) shows a demand score of ${selected.demandScore}/100 (${selected.status}) and latest quarterly revenue of $${companyPL[0]?.revenue ?? "N/A"}B. Ask any question above to inspect P&L, demand drivers, or risks — strictly for educational learning.`}
                  </div>
                )}
                <p className="text-xs text-muted-foreground/70 mt-4">Powered by Gemini AI · Educational Only</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

function getDemandFactors(company: (typeof companies)[number]): string[] {
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

export default Company;
