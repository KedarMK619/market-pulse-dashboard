import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, RefreshCw, Zap, AlertCircle, ChevronRight } from "lucide-react";
import { companies, marketAlerts } from "@/lib/mock/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import { useMarketNewsFeed } from "@/hooks/useNewsData";
import { generateMarketSummary } from "@/lib/api/gemini";

const filters = ["All", "Stocks", "Products", "Companies", "Sectors"];
const typeBadge: Record<string, string> = {
  "Price Change": "bg-[#2FA8D8]/20 text-[#2FA8D8] border-[#2FA8D8]/30",
  "Demand Spike": "bg-[#FFE055]/20 text-[#FFE055] border-[#FFE055]/30",
  "Profit Report": "bg-[#1BF2B3]/20 text-[#1BF2B3] border-[#1BF2B3]/30",
  "News Impact": "bg-[#FF7597]/20 text-[#FF7597] border-[#FF7597]/30",
};

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const Feed = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const navigate = useNavigate();

  const newsData = useMarketNewsFeed();

  const loadAiSummary = async () => {
    setAiLoading(true);
    try {
      const marketData = { companies, marketAlerts };
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

  const newsAlerts = newsData.articles.map((article, idx) => ({
    id: `news-${idx}`,
    company: article.source,
    type:
      article.sentiment === "positive"
        ? "News Impact"
        : article.sentiment === "negative"
        ? "Price Change"
        : "News Impact",
    changePercent:
      article.sentiment === "positive" ? 3.4 : article.sentiment === "negative" ? -2.8 : 0.6,
    message: article.headline,
    time: article.time,
  }));

  const displayAlerts = newsAlerts.length > 0 ? newsAlerts : marketAlerts;
  const filteredAlerts =
    activeFilter === "All"
      ? displayAlerts
      : displayAlerts.filter((a) => {
          if (activeFilter === "Stocks") return a.type === "Price Change";
          if (activeFilter === "Products") return a.type === "Demand Spike";
          if (activeFilter === "Companies") return a.type === "Profit Report" || a.type === "Price Change";
          return a.type === "News Impact";
        });

  const majorMoves = filteredAlerts.filter((a) => Math.abs(a.changePercent) >= 4);
  const displayed = filteredAlerts.slice(0, visibleCount);

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.05 } } }}
    >
      {newsData.error && (
        <motion.div variants={fadeUp}>
          <Alert variant="default" className="bg-[#FFE055]/10 border-[#FFE055]/30 rounded-2xl">
            <AlertCircle className="h-4 w-4 text-[#FFE055]" />
            <AlertDescription className="text-foreground/85 ml-2 text-xs">
              {newsData.error}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Ticker Bar */}
      <motion.div variants={fadeUp} className="overflow-hidden glass-card py-3 px-4">
        <div className="flex gap-8 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {[...companies, ...companies].map((c, i) => (
            <span key={`${c.id}-${i}`} className="inline-flex items-center gap-2 text-sm">
              <span className="font-bold text-foreground">{c.symbol}</span>
              <span className="text-muted-foreground">${c.currentPrice.toFixed(2)}</span>
              <span className={c.changePercent >= 0 ? "text-[#1BF2B3] font-bold" : "text-[#FF7597] font-bold"}>
                {c.changePercent >= 0 ? "+" : ""}
                {c.changePercent.toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* AI Daily Summary Bento */}
      <motion.div
        variants={fadeUp}
        className="rounded-[22px] p-6 text-white shadow-[0_14px_30px_rgba(44,32,120,0.28)]"
        style={{
          background: "linear-gradient(145deg, #4B38C9 0%, #2C217A 58%, #191645 100%)",
        }}
      >
        <div className="flex items-center gap-2.5 mb-3">
          <Brain className="h-5 w-5 text-[#FFE055]" />
          <h2 className="text-base font-bold">Today&apos;s Market Summary</h2>
          <button
            type="button"
            onClick={loadAiSummary}
            disabled={aiLoading}
            className="ml-auto p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${aiLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
        <p className="text-sm text-white/85 leading-relaxed">
          {aiLoading
            ? "Generating real-time market analysis..."
            : aiSummary ||
              "Markets closed cautiously optimistic. Technology led gains while Energy remained volatile."}
        </p>
        <p className="text-xs text-white/60 mt-3">Powered by Gemini AI · Educational Only</p>
      </motion.div>

      {/* Pill Filter Bar */}
      <motion.div variants={fadeUp} className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
              activeFilter === f
                ? "bg-[#FFE055] text-[#141416] shadow-sm"
                : "bento-tile text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Major Moves */}
      {majorMoves.length > 0 && (
        <motion.div variants={fadeUp}>
          <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-[#FFE055]" /> Major Moves Today
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {majorMoves.map((a, idx) => (
              <div
                key={a.id}
                className={`p-5 rounded-[22px] ${
                  idx === 0
                    ? "bento-highlight shadow-md"
                    : "glass-card"
                }`}
              >
                <p
                  className={`text-2xl font-extrabold ${
                    idx === 0
                      ? "text-[#141416]"
                      : a.changePercent >= 0
                      ? "text-[#1BF2B3]"
                      : "text-[#FF7597]"
                  }`}
                >
                  {a.changePercent >= 0 ? "+" : ""}
                  {a.changePercent.toFixed(1)}%
                </p>
                <p className={`text-sm font-bold mt-1 ${idx === 0 ? "text-[#141416]" : "text-foreground"}`}>
                  {a.company}
                </p>
                <p className={`text-xs mt-1 line-clamp-2 ${idx === 0 ? "text-[#141416]/80" : "text-muted-foreground"}`}>
                  {a.message}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Feed */}
      <motion.div variants={fadeUp} className="space-y-3">
        {newsData.loading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="glass-card p-5 h-20 animate-pulse" />
            ))
          : displayed.map((alert) => {
              const positive = alert.changePercent >= 0;
              return (
                <div
                  key={alert.id}
                  className="glass-card p-5 hover:translate-y-[-2px] transition-all duration-200 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  onClick={() => navigate("/company")}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-foreground">{alert.company}</span>
                      <Badge variant="outline" className={`text-[10px] px-2 ${typeBadge[alert.type] ?? ""}`}>
                        {alert.type}
                      </Badge>
                      <span className="text-xs text-muted-foreground">· {alert.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{alert.message}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span
                      className={`text-lg font-extrabold ${
                        positive ? "text-[#1BF2B3]" : "text-[#FF7597]"
                      }`}
                    >
                      {positive ? "+" : ""}
                      {alert.changePercent.toFixed(1)}%
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bento-tile text-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              );
            })}
      </motion.div>

      <motion.div variants={fadeUp} className="text-center">
        <p className="text-xs text-muted-foreground">
          Market news powered by <span className="font-semibold text-foreground">NewsAPI</span> • Stock data powered by{" "}
          <span className="font-semibold text-foreground">Alpha Vantage</span>
        </p>
      </motion.div>

      {visibleCount < filteredAlerts.length && (
        <motion.div variants={fadeUp} className="flex justify-center">
          <Button
            onClick={() => setVisibleCount((c) => c + 5)}
            className="rounded-full bg-[#FFE055] text-[#141416] hover:bg-[#ffd62b] font-bold px-6"
          >
            Load More
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Feed;
