import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Star,
  Activity,
  BarChart2,
  Brain,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  Clock,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
  newsItems,
} from "@/lib/mock/mockData";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { useState, useEffect } from "react";
import { generateMarketSummary } from "@/lib/api/gemini";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: "easeOut" as const },
});

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Summary Card Component
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext?: string;
  accentClass: string;
  sparkData?: { date: string; value: number }[];
  delay: number;
}

const SummaryCard = ({ icon, label, value, subtext, accentClass, sparkData, delay }: SummaryCardProps) => (
  <motion.div
    {...fadeUp(delay)}
    className="glass-card p-6 group hover:border-primary/30 transition-all duration-300 hover:scale-[1.02] cursor-default"
  >
    <div className="flex items-start justify-between mb-3">
      <div className={`p-2.5 rounded-lg bg-${accentClass}/10`}>
        {icon}
      </div>
      {subtext && (
        <Badge
          variant="outline"
          className={`text-xs border-${accentClass}/30 ${
            subtext.startsWith("+") || parseFloat(subtext) > 0
              ? "text-primary"
              : subtext.startsWith("-")
              ? "text-destructive"
              : "text-secondary"
          }`}
        >
          {subtext}
        </Badge>
      )}
    </div>
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
    <p className={`text-2xl font-bold text-foreground`}>{value}</p>
    {sparkData && (
      <div className="mt-3 h-10">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={1.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    )}
  </motion.div>
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Market Index Card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const IndexCard = ({
  index,
  delay,
}: {
  index: (typeof marketIndices)[0];
  delay: number;
}) => {
  const isPositive = index.changePercent >= 0;
  const color = isPositive ? "hsl(var(--primary))" : "hsl(var(--destructive))";

  return (
    <motion.div {...fadeUp(delay)} className="glass-card p-5">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {index.symbol}
        </span>
        <Badge
          variant="outline"
          className={`text-xs ${isPositive ? "text-primary border-primary/30" : "text-destructive border-destructive/30"}`}
        >
          {isPositive ? "+" : ""}
          {index.changePercent.toFixed(1)}%
        </Badge>
      </div>
      <p className="text-lg font-bold text-foreground">{index.name}</p>
      <p className="text-2xl font-bold text-foreground mt-1">
        {index.value.toLocaleString()}
      </p>
      <div className="mt-3 h-20">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={index.chartData}>
            <Tooltip
              contentStyle={{
                background: "hsl(var(--card))",
                border: "1px solid hsla(var(--glass-border))",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(var(--foreground))",
              }}
              labelStyle={{ color: "hsl(var(--muted-foreground))" }}
              formatter={(val: number) => [val.toLocaleString(), "Value"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 3, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Sector Tile
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SectorTile = ({
  sector,
  delay,
}: {
  sector: (typeof sectors)[0];
  delay: number;
}) => {
  const isPositive = sector.performance >= 0;

  return (
    <motion.div
      {...fadeUp(delay)}
      className={`rounded-xl p-5 border transition-all duration-300 hover:scale-[1.02] cursor-default ${
        isPositive
          ? "bg-primary/10 border-primary/20 hover:bg-primary/15"
          : "bg-destructive/10 border-destructive/20 hover:bg-destructive/15"
      }`}
    >
      <div className="text-2xl mb-2">{sector.icon}</div>
      <p className="text-sm font-bold text-foreground">{sector.name}</p>
      <p
        className={`text-xl font-bold mt-1 ${
          isPositive ? "text-primary" : "text-destructive"
        }`}
      >
        {isPositive ? "+" : ""}
        {sector.performance}%
      </p>
      <p className="text-xs text-muted-foreground mt-2">{sector.topCompany}</p>
    </motion.div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Alert Card
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const AlertItem = ({
  alert,
  delay,
}: {
  alert: (typeof marketAlerts)[0];
  delay: number;
}) => {
  const borderColor =
    alert.severity === "high"
      ? "border-l-primary"
      : alert.severity === "medium"
      ? "border-l-secondary"
      : "border-l-muted-foreground";

  const isPositive = alert.changePercent >= 0;

  return (
    <motion.div
      {...fadeUp(delay)}
      className={`glass-card p-4 border-l-4 ${borderColor}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{alert.company}</span>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
            {alert.type}
          </Badge>
        </div>
        <span
          className={`text-sm font-bold ${isPositive ? "text-primary" : "text-destructive"}`}
        >
          {isPositive ? "+" : ""}
          {alert.changePercent}%
        </span>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-2">
        {alert.message}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">{alert.time}</span>
        <Button variant="ghost" size="sm" className="text-xs h-6 px-2 text-secondary hover:text-secondary">
          View Details <ChevronRight className="h-3 w-3" />
        </Button>
      </div>
    </motion.div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Countdown Timer
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
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
      Next refresh in <span className="text-foreground font-mono">{seconds}s</span>
    </span>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Dashboard Page
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const Dashboard = () => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const top5 = companies.slice(0, 5);
  const sparkData = marketIndices[2].chartData.map((d) => ({
    date: d.date,
    value: d.value,
  }));

  const loadAiSummary = async () => {
    setAiLoading(true);
    try {
      const marketData = { marketIndices, sectors, summaryStats };
      const summary = await generateMarketSummary(marketData);
      setAiSummary(summary);
    } catch (error) {
      setAiSummary('Market summary temporarily unavailable. ⚠️ Educational analysis only.');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    loadAiSummary();
  }, []);

  const handleRefreshAi = () => {
    loadAiSummary();
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <motion.div {...fadeUp(0)} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Market Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Real-time market intelligence</p>
        </div>
        <p className="text-sm text-muted-foreground hidden sm:block">{today}</p>
      </motion.div>

      {/* ━━━ Section 1: Summary Cards ━━━ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard
          icon={<DollarSign className="h-5 w-5 text-primary" />}
          label="Total Market Cap"
          value={`$${summaryStats.totalMarketCap}`}
          subtext={summaryStats.totalMarketCapChange}
          accentClass="primary"
          sparkData={sparkData}
          delay={0.05}
        />
        <SummaryCard
          icon={<TrendingUp className="h-5 w-5 text-primary" />}
          label={summaryStats.topGainer.name}
          value={`+${summaryStats.topGainer.changePercent}%`}
          subtext={summaryStats.topGainer.symbol}
          accentClass="primary"
          delay={0.1}
        />
        <SummaryCard
          icon={<TrendingDown className="h-5 w-5 text-destructive" />}
          label={summaryStats.topLoser.name}
          value={`${summaryStats.topLoser.changePercent}%`}
          subtext={summaryStats.topLoser.symbol}
          accentClass="destructive"
          delay={0.15}
        />
        <SummaryCard
          icon={<Star className="h-5 w-5 text-secondary" />}
          label={summaryStats.mostDemandedProduct.name}
          value={`${summaryStats.mostDemandedProduct.demandScore}/100`}
          subtext="Demand Score"
          accentClass="secondary"
          delay={0.2}
        />
      </div>

      {/* ━━━ Section 2: Market Indices ━━━ */}
      <motion.div {...fadeUp(0.25)}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Market Indices</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {marketIndices.map((idx, i) => (
            <IndexCard key={idx.symbol} index={idx} delay={0.3 + i * 0.05} />
          ))}
        </div>
      </motion.div>

      {/* ━━━ Section 3: Market Sectors Heatmap ━━━ */}
      <motion.div {...fadeUp(0.45)}>
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-secondary" />
          <h2 className="text-lg font-semibold text-foreground">Market Sectors</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sectors.map((sector, i) => (
            <SectorTile key={sector.id} sector={sector} delay={0.5 + i * 0.04} />
          ))}
        </div>
      </motion.div>

      {/* ━━━ Section 4: Top Companies Table ━━━ */}
      <motion.div {...fadeUp(0.6)}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Top Trending Companies</h2>
        </div>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-[hsl(var(--sidebar-background))] border-b border-[hsla(var(--glass-border))]">
                  <TableHead className="text-muted-foreground">Company</TableHead>
                  <TableHead className="text-muted-foreground">Stock Price</TableHead>
                  <TableHead className="text-muted-foreground">Change %</TableHead>
                  <TableHead className="text-muted-foreground">Demand Score</TableHead>
                  <TableHead className="text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top5.map((c, i) => {
                  const isUp = c.changePercent >= 0;
                  return (
                    <TableRow
                      key={c.id}
                      className={`border-b border-[hsla(var(--glass-border))] hover:bg-[hsla(var(--glass-bg))] transition-colors ${
                        i % 2 === 0 ? "" : "bg-[hsla(var(--glass-bg))]"
                      }`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs font-mono px-1.5">
                            {c.symbol}
                          </Badge>
                          <span className="text-sm font-medium text-foreground">{c.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-semibold text-foreground">
                        {formatCurrency(c.currentPrice)}
                      </TableCell>
                      <TableCell>
                        <div className={`flex items-center gap-1 text-sm font-semibold ${isUp ? "text-primary" : "text-destructive"}`}>
                          {isUp ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                          {isUp ? "+" : ""}
                          {c.changePercent.toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={c.demandScore} className="h-2 w-20 bg-muted" />
                          <span className="text-xs text-muted-foreground">{c.demandScore}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`text-[10px] ${
                            c.status === "Rising"
                              ? "bg-primary/15 text-primary border-primary/30"
                              : c.status === "Falling"
                              ? "bg-destructive/15 text-destructive border-destructive/30"
                              : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                          }`}
                          variant="outline"
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
          <div className="flex justify-end p-4 border-t border-[hsla(var(--glass-border))]">
            <Button variant="ghost" size="sm" className="text-secondary hover:text-secondary text-xs">
              View All <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* ━━━ Section 5: Two Column Bottom ━━━ */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
        {/* Left: Recent Alerts */}
        <motion.div {...fadeUp(0.7)}>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-destructive" />
            <h2 className="text-lg font-semibold text-foreground">Recent Market Changes</h2>
          </div>
          <div className="space-y-3">
            {marketAlerts.slice(0, 5).map((alert, i) => (
              <AlertItem key={alert.id} alert={alert} delay={0.75 + i * 0.04} />
            ))}
          </div>
        </motion.div>

        {/* Right: AI Insight + Market Status */}
        <div className="space-y-4">
          <motion.div
            {...fadeUp(0.8)}
            className="rounded-xl p-[1px] bg-gradient-to-br from-primary via-secondary to-primary"
          >
            <div className="rounded-xl p-5 bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="h-5 w-5 text-secondary" />
                <span className="text-sm font-semibold text-foreground">AI Insight</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {aiLoading ? (
                  <span className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Generating market summary...
                  </span>
                ) : (
                  aiSummary || "Today's market shows cautious optimism. Technology sector leads with +3.2% gains driven by AI chip demand surge. Tesla faces headwinds in Europe while Apple maintains strong consumer demand globally. Watch energy sector — oil price volatility may impact broader market sentiment."
                )}
              </p>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-[hsla(var(--glass-border))]">
                <span className="text-[10px] text-muted-foreground">Powered by Gemini AI</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-foreground"
                  onClick={handleRefreshAi}
                  disabled={aiLoading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.85)} className="glass-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-semibold text-foreground">Markets Open</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Last Updated</span>
                <span className="text-xs text-foreground font-medium">
                  {new Date(summaryStats.lastUpdated).toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Companies Tracked</span>
                <span className="text-xs text-foreground font-medium">{summaryStats.totalCompaniesTracked}</span>
              </div>
              <div className="flex items-center justify-between">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <RefreshCountdown />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
