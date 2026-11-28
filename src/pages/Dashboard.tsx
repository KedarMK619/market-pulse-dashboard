import { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Star,
  Activity,
  BarChart2,
  Brain,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Clock,
  SlidersHorizontal,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FolderCard } from "@/components/ui/FolderCard";
import { SegmentedRing } from "@/components/ui/SegmentedRing";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  companies,
  marketIndices,
  sectors,
  marketAlerts,
  summaryStats,
} from "@/lib/mock/mockData";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { generateMarketSummary } from "@/lib/api/gemini";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

const today = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const IndexCard = ({
  index,
  delay,
}: {
  index: (typeof marketIndices)[0];
  delay: number;
}) => {
  const isPositive = index.changePercent >= 0;
  const color = isPositive ? "#1BF2B3" : "#FF7597";

  return (
    <motion.div {...fadeUp(delay)} className="glass-card p-5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {index.symbol}
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
            isPositive
              ? "bg-[#1BF2B3]/15 text-[#1BF2B3]"
              : "bg-[#FF7597]/15 text-[#FF7597]"
          }`}
        >
          {isPositive ? "+" : ""}
          {index.changePercent.toFixed(1)}%
        </span>
      </div>
      <p className="text-sm font-semibold text-foreground truncate">{index.name}</p>
      <p className="text-2xl font-extrabold text-foreground mt-1">
        {index.value.toLocaleString()}
      </p>
      <div className="mt-3 h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={index.chartData}>
            <Tooltip
              contentStyle={{
                background: "#1C1C20",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "12px",
                color: "#fff",
              }}
              formatter={(val: number) => [val.toLocaleString(), "Value"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.2}
              dot={false}
              activeDot={{ r: 3.5, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

const RefreshCountdown = () => {
  const [seconds, setSeconds] = useState(60);
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s <= 1 ? 60 : s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <span className="text-xs text-muted-foreground">
      Refresh in <span className="text-foreground font-mono">{seconds}s</span>
    </span>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [reportMode, setReportMode] = useState<"highlights" | "indices">("highlights");
  const [activeTrendId, setActiveTrendId] = useState(companies[0].id);
  const [activeAlertId, setActiveAlertId] = useState(marketAlerts[0].id);

  const top5 = companies.slice(0, 5);
  const risingCount = companies.filter((c) => c.status === "Rising").length;
  const stableCount = companies.filter((c) => c.status === "Stable").length;
  const fallingCount = companies.filter((c) => c.status === "Falling").length;
  const risingPct = Math.round(((risingCount + stableCount) / companies.length) * 100);

  const ringSegments = [
    { name: "Rising", value: risingCount, color: "#FFE055" },
    { name: "Stable", value: stableCount, color: "#2FA8D8" },
    { name: "Falling", value: fallingCount, color: "#FF7597" },
  ];

  const loadAiSummary = async () => {
    setAiLoading(true);
    try {
      const marketData = { marketIndices, sectors, summaryStats };
      const summary = await generateMarketSummary(marketData);
      setAiSummary(summary);
    } catch {
      setAiSummary("Market summary temporarily unavailable. ⚠️ Educational analysis only.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    loadAiSummary();
  }, []);

  return (
    <div className="space-y-6">
      {/* ━━━ HERO 3-COLUMN BENTO GRID (Inspired by Reference Layout) ━━━ */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* LEFT COLUMN: Greeting + Stacked Folder Cards */}
        <motion.div {...fadeUp(0)} className="xl:col-span-5 glass-card p-6 flex flex-col gap-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-foreground">
                Market Pulse
              </h2>
              <p className="text-xs text-muted-foreground mt-1">{today}</p>
            </div>
            <button
              type="button"
              onClick={() =>
                setReportMode((m) => (m === "highlights" ? "indices" : "highlights"))
              }
              title="Switch report view"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFE055] text-[#141416] hover:bg-[#ffd62b] transition-colors shadow-sm"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                setReportMode((m) => (m === "highlights" ? "indices" : "highlights"))
              }
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-[#FFE055] transition-colors"
            >
              {reportMode === "highlights" ? "Market Report ⌄" : "Index Snapshot ⌄"}
            </button>
            <span className="text-[11px] font-medium text-muted-foreground">
              10 Tracked Assets
            </span>
          </div>

          {reportMode === "highlights" ? (
            <div className="space-y-4">
              <FolderCard
                tone="mint"
                label="Market Cap"
                value={`$${summaryStats.totalMarketCap}`}
                trend={`${summaryStats.totalMarketCapChange} Today`}
                metaLabel="Tracked"
                metaValue={`${summaryStats.totalCompaniesTracked} Companies`}
                ctaLabel="Details"
                onCtaClick={() => navigate("/company")}
                icon={<DollarSign className="h-3 w-3" />}
              />
              <FolderCard
                tone="yellow"
                label={`Gainer · ${summaryStats.topGainer.symbol}`}
                value={`+${summaryStats.topGainer.changePercent}%`}
                trend="Leading Mover"
                metaLabel="Company"
                metaValue={summaryStats.topGainer.name}
                ctaLabel="Analyze"
                onCtaClick={() =>
                  navigate(`/company?symbol=${encodeURIComponent(summaryStats.topGainer.symbol)}`)
                }
                icon={<TrendingUp className="h-3 w-3" />}
              />
              <FolderCard
                tone="pink"
                label="Top Demand"
                value={`${summaryStats.mostDemandedProduct.demandScore}/100`}
                trend="+12.3 MoM"
                metaLabel="Product"
                metaValue={summaryStats.mostDemandedProduct.name}
                ctaLabel="Explore"
                onCtaClick={() => navigate("/products")}
                icon={<Star className="h-3 w-3" />}
              />
            </div>
          ) : (
            <div className="space-y-4">
              <FolderCard
                tone="mint"
                label={marketIndices[2].symbol}
                value={marketIndices[2].value.toLocaleString()}
                trend={`+${marketIndices[2].changePercent}%`}
                metaLabel="Index"
                metaValue="S&P 500"
                ctaLabel="Details"
                onCtaClick={() => navigate("/company")}
                icon={<Activity className="h-3 w-3" />}
              />
              <FolderCard
                tone="yellow"
                label={marketIndices[1].symbol}
                value={marketIndices[1].value.toLocaleString()}
                trend={`+${marketIndices[1].changePercent}%`}
                metaLabel="Index"
                metaValue="NASDAQ"
                ctaLabel="Details"
                onCtaClick={() => navigate("/company")}
                icon={<TrendingUp className="h-3 w-3" />}
              />
              <FolderCard
                tone="pink"
                label={marketIndices[0].symbol}
                value={marketIndices[0].value.toLocaleString()}
                trend={`+${marketIndices[0].changePercent}%`}
                metaLabel="Index"
                metaValue="Dow Jones"
                ctaLabel="Details"
                onCtaClick={() => navigate("/company")}
                icon={<BarChart2 className="h-3 w-3" />}
              />
            </div>
          )}
        </motion.div>

        {/* MIDDLE COLUMN: Segmented Ring + Top Movers */}
        <div className="xl:col-span-4 flex flex-col gap-5">
          {/* Segmented Donut Ring */}
          <motion.div {...fadeUp(0.08)} className="glass-card p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-foreground">Market Breadth</h3>
              <button
                type="button"
                onClick={() => navigate("/products")}
                aria-label="Go to Product Tracker"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <SegmentedRing
              segments={ringSegments}
              centerPercent={`${risingPct}%`}
              centerValue={`${risingCount + stableCount}/${companies.length}`}
            />
          </motion.div>

          {/* Top Movers List (Inspired by "Last Orders") */}
          <motion.div {...fadeUp(0.14)} className="glass-card p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-foreground">Top Movers</h3>
              <button
                type="button"
                onClick={() => navigate("/company")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] font-medium text-muted-foreground pb-2 border-b border-border">
              <span>Company</span>
              <span>Move</span>
            </div>
            <div className="mt-2 space-y-2.5 flex-1">
              {top5.map((c) => {
                const isUp = c.changePercent >= 0;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigate(`/company?symbol=${encodeURIComponent(c.symbol)}`)}
                    className="w-full flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 ${
                        isUp
                          ? "bg-[#1BF2B3]/20 text-[#1BF2B3]"
                          : "bg-[#FF7597]/20 text-[#FF7597]"
                      }`}
                    >
                      {c.symbol.slice(0, 4)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground">{c.sector}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`text-xs font-bold ${
                          isUp ? "text-[#1BF2B3]" : "text-[#FF7597]"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {c.changePercent.toFixed(2)}%
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {formatCurrency(c.currentPrice)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* RIGHT COLUMN: Yellow-Highlight Cards ("Trending Watch" & "Alerts") */}
        <div className="xl:col-span-3 flex flex-col gap-5">
          {/* Trending Watch (Inspired by "Recently") */}
          <motion.div {...fadeUp(0.12)} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Trending</h3>
              <button
                type="button"
                onClick={() => navigate("/watchlist")}
                aria-label="Open Watchlist"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {companies.slice(0, 4).map((c) => {
                const isSelected = activeTrendId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveTrendId(c.id)}
                    onDoubleClick={() =>
                      navigate(`/company?symbol=${encodeURIComponent(c.symbol)}`)
                    }
                    className={`w-full flex items-center gap-3 p-3 text-left ${
                      isSelected ? "bento-highlight shadow-md" : "bento-tile hover:brightness-110"
                    }`}
                  >
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center text-xs font-extrabold shrink-0 ${
                        isSelected
                          ? "bg-[#141416] text-[#FFE055]"
                          : "bg-background/60 text-foreground"
                      }`}
                    >
                      {c.symbol.slice(0, 4)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-bold truncate ${
                          isSelected ? "text-[#141416]" : "text-foreground"
                        }`}
                      >
                        {c.name}
                      </p>
                      <p
                        className={`text-[11px] truncate ${
                          isSelected ? "text-[#141416]/75" : "text-muted-foreground"
                        }`}
                      >
                        {formatCurrency(c.currentPrice)} · Demand {c.demandScore}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Market Alerts (Inspired by "Invoice") */}
          <motion.div {...fadeUp(0.18)} className="glass-card p-6 flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-foreground">Signals</h3>
              <button
                type="button"
                onClick={() => navigate("/feed")}
                aria-label="Open Market Feed"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {marketAlerts.slice(0, 3).map((alert) => {
                const isSelected = activeAlertId === alert.id;
                return (
                  <button
                    key={alert.id}
                    type="button"
                    onClick={() => setActiveAlertId(alert.id)}
                    className={`w-full flex items-center gap-3 p-3 text-left ${
                      isSelected ? "bento-highlight shadow-md" : "bento-tile hover:brightness-110"
                    }`}
                  >
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? "bg-[#141416] text-[#FFE055]"
                          : "bg-background/60 text-[#FF7597]"
                      }`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-bold truncate ${
                          isSelected ? "text-[#141416]" : "text-foreground"
                        }`}
                      >
                        {alert.company}{" "}
                        <span>
                          ({alert.changePercent >= 0 ? "+" : ""}
                          {alert.changePercent}%)
                        </span>
                      </p>
                      <p
                        className={`text-[11px] truncate ${
                          isSelected ? "text-[#141416]/75" : "text-muted-foreground"
                        }`}
                      >
                        {alert.type} · {alert.time}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ━━━ SECTION 2: MARKET INDICES ━━━ */}
      <motion.div {...fadeUp(0.22)}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-[#1BF2B3]" />
            <h2 className="text-lg font-bold text-foreground">Market Indices</h2>
          </div>
          <span className="text-xs text-muted-foreground">30-Day Trend</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketIndices.map((idx, i) => (
            <IndexCard key={idx.symbol} index={idx} delay={0.25 + i * 0.04} />
          ))}
        </div>
      </motion.div>

      {/* ━━━ SECTION 3: SECTORS + AI SUMMARY BENTO ROW ━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <motion.div {...fadeUp(0.32)} className="lg:col-span-7 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Market Sectors</h2>
            <span className="text-xs text-muted-foreground">Weekly Performance</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {sectors.map((sector) => {
              const isPositive = sector.performance >= 0;
              return (
                <div
                  key={sector.id}
                  className="bento-tile p-4 hover:scale-[1.02] transition-transform"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{sector.icon}</span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isPositive
                          ? "bg-[#1BF2B3]/15 text-[#1BF2B3]"
                          : "bg-[#FF7597]/15 text-[#FF7597]"
                      }`}
                    >
                      {isPositive ? "+" : ""}
                      {sector.performance}%
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground">{sector.name}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Leader: {sector.topCompany}
                  </p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* AI Insight + Market Status */}
        <motion.div {...fadeUp(0.36)} className="lg:col-span-5 flex flex-col gap-5">
          <div
            className="rounded-[22px] p-6 text-white shadow-[0_14px_30px_rgba(44,32,120,0.28)] flex-1 flex flex-col justify-between"
            style={{
              background: "linear-gradient(145deg, #3D2EB5 0%, #241C66 60%, #19163F 100%)",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[#FFE055]" />
                  <span className="text-sm font-bold">PulseAI Daily Summary</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-white/80 hover:text-white hover:bg-white/10"
                  onClick={loadAiSummary}
                  disabled={aiLoading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${aiLoading ? "animate-spin" : ""}`} />
                </Button>
              </div>
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                {aiLoading ? "Generating market summary..." : aiSummary}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between">
              <span className="text-[11px] text-white/65">Educational Analysis Only</span>
              <button
                type="button"
                onClick={() => navigate("/ai-insights")}
                className="rounded-full bg-[#FFE055] px-4 py-1.5 text-xs font-bold text-[#141416] hover:bg-[#ffd62b] transition-colors"
              >
                Open PulseAI
              </button>
            </div>
          </div>

          <div className="glass-card p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-[#1BF2B3] animate-pulse" />
              <div>
                <p className="text-sm font-bold text-foreground">Markets Open</p>
                <p className="text-xs text-muted-foreground">
                  {summaryStats.totalCompaniesTracked} companies · {new Date(summaryStats.lastUpdated).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <RefreshCountdown />
            </div>
          </div>
        </motion.div>
      </div>

      {/* ━━━ SECTION 4: TOP TRENDING COMPANIES TABLE ━━━ */}
      <motion.div {...fadeUp(0.4)} className="glass-card overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-[#FFE055]" />
            <h2 className="text-lg font-bold text-foreground">Top Trending Companies</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/company")}
            className="text-xs font-semibold text-[#FFE055] hover:text-[#FFE055]"
          >
            Analyze All <ChevronRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/30">
                <TableHead className="text-muted-foreground">Company</TableHead>
                <TableHead className="text-muted-foreground">Stock Price</TableHead>
                <TableHead className="text-muted-foreground">Change %</TableHead>
                <TableHead className="text-muted-foreground">Demand Score</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {top5.map((c) => {
                const isUp = c.changePercent >= 0;
                return (
                  <TableRow
                    key={c.id}
                    onClick={() => navigate(`/company?symbol=${encodeURIComponent(c.symbol)}`)}
                    className="border-b border-border hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Badge className="bg-[#FFE055]/15 text-[#FFE055] border-[#FFE055]/30 font-mono text-xs">
                          {c.symbol}
                        </Badge>
                        <span className="text-sm font-semibold text-foreground">{c.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-bold text-foreground">
                      {formatCurrency(c.currentPrice)}
                    </TableCell>
                    <TableCell>
                      <div
                        className={`flex items-center gap-1 text-sm font-bold ${
                          isUp ? "text-[#1BF2B3]" : "text-[#FF7597]"
                        }`}
                      >
                        {isUp ? (
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowDownRight className="h-3.5 w-3.5" />
                        )}
                        {isUp ? "+" : ""}
                        {c.changePercent.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={c.demandScore} className="h-2 w-20 bg-muted" />
                        <span className="text-xs font-semibold text-muted-foreground">
                          {c.demandScore}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-[11px] ${
                          c.status === "Rising"
                            ? "bg-[#1BF2B3]/15 text-[#1BF2B3] border-[#1BF2B3]/30"
                            : c.status === "Falling"
                            ? "bg-[#FF7597]/15 text-[#FF7597] border-[#FF7597]/30"
                            : "bg-[#FFE055]/15 text-[#FFE055] border-[#FFE055]/30"
                        }`}
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
