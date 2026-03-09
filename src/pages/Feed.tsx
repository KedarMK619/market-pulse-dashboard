import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, RefreshCw, Zap } from "lucide-react";
import { companies, marketAlerts } from "@/lib/mock/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const filters = ["All", "Stocks", "Products", "Companies", "Sectors"];
const typeBadge: Record<string, string> = {
  "Price Change": "bg-secondary/20 text-secondary",
  "Demand Spike": "bg-purple-500/20 text-purple-400",
  "Profit Report": "bg-primary/20 text-primary",
  "News Impact": "bg-yellow-500/20 text-yellow-400",
};

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const Feed = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);
  const navigate = useNavigate();

  const majorMoves = marketAlerts.filter((a) => Math.abs(a.changePercent) >= 5);
  const displayed = marketAlerts.slice(0, visibleCount);

  return (
    <motion.div className="space-y-8" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.06 } } }}>
      {/* Ticker Bar */}
      <motion.div variants={fadeUp} className="overflow-hidden glass-card py-2 px-4">
        <div className="flex gap-8 animate-[scroll_30s_linear_infinite] whitespace-nowrap">
          {[...companies, ...companies].map((c, i) => (
            <span key={`${c.id}-${i}`} className="inline-flex items-center gap-2 text-sm">
              <span className="font-semibold text-foreground">{c.symbol}</span>
              <span className="text-muted-foreground">${c.currentPrice.toFixed(2)}</span>
              <span className={c.changePercent >= 0 ? "text-primary" : "text-destructive"}>
                {c.changePercent >= 0 ? "+" : ""}{c.changePercent.toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* AI Daily Summary */}
      <motion.div variants={fadeUp} className="rounded-xl p-[1px] bg-gradient-to-r from-primary to-secondary">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Today's Market Summary</h2>
            <button className="ml-auto p-1.5 rounded-lg hover:bg-muted/50 transition-colors">
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Markets closed the day on a cautiously optimistic note. Technology sector led gains with AI-driven stocks surging. Tesla faced selling pressure in European markets while Apple held strong. Energy sector remains volatile amid oil price uncertainty. Overall market breadth was positive with 6 out of 10 tracked companies gaining.
          </p>
          <p className="text-xs text-muted-foreground mt-3">Updated 5 minutes ago</p>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={fadeUp} className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeFilter === f ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground"}`}
          >
            {f}
          </button>
        ))}
      </motion.div>

      {/* Major Moves */}
      {majorMoves.length > 0 && (
        <motion.div variants={fadeUp}>
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-400" /> Major Moves Today
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {majorMoves.map((a) => (
              <div
                key={a.id}
                className={`glass-card p-5 border ${a.changePercent >= 0 ? "border-primary/40 shadow-[0_0_20px_hsl(var(--primary)/0.15)]" : "border-destructive/40 shadow-[0_0_20px_hsl(var(--destructive)/0.15)]"}`}
              >
                <p className={`text-2xl font-bold ${a.changePercent >= 0 ? "text-primary" : "text-destructive"}`}>
                  {a.changePercent >= 0 ? "+" : ""}{a.changePercent}%
                </p>
                <p className="text-sm font-semibold text-foreground mt-1">{a.company}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.message}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Main Feed */}
      <motion.div variants={fadeUp} className="space-y-3">
        {displayed.map((alert) => {
          const positive = alert.changePercent >= 0;
          const borderColor = alert.type === "News Impact" || alert.type === "Profit Report"
            ? "border-l-secondary"
            : positive ? "border-l-primary" : "border-l-destructive";

          return (
            <div
              key={alert.id}
              className={`glass-card p-5 border-l-4 ${borderColor} hover:translate-y-[-2px] hover:shadow-lg transition-all duration-200`}
            >
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground">{alert.company}</span>
                <Badge variant="outline" className={`text-[10px] px-1.5 border ${typeBadge[alert.type] ?? ""}`}>
                  {alert.type}
                </Badge>
              </div>
              <p className={`text-xl font-bold ${positive ? "text-primary" : "text-destructive"}`}>
                {positive ? "+" : ""}{alert.changePercent}%
              </p>
              <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground">{alert.time}</span>
                <Button variant="ghost" size="sm" className="text-xs text-primary" onClick={() => navigate("/company")}>
                  View Details
                </Button>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* Load More */}
      {visibleCount < marketAlerts.length && (
        <motion.div variants={fadeUp} className="flex justify-center">
          <Button variant="outline" onClick={() => setVisibleCount((c) => c + 5)}>Load More</Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Feed;
