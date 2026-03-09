import { LayoutDashboard, TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "S&P 500", value: "5,234.18", change: "+1.23%", up: true },
  { label: "NASDAQ", value: "16,742.39", change: "+0.87%", up: true },
  { label: "DOW", value: "39,512.84", change: "-0.32%", up: false },
  { label: "BTC/USD", value: "$67,842", change: "+2.41%", up: true },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Market overview & key metrics</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
              {stat.up ? (
                <TrendingUp className="h-4 w-4 text-primary" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
            </div>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
            <p className={`text-sm font-medium mt-1 ${stat.up ? "text-primary" : "text-destructive"}`}>
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <h2 className="text-lg font-semibold text-foreground mb-2">Market Performance</h2>
          <p className="text-sm text-muted-foreground">Chart coming soon — connect real-time data to visualize trends.</p>
          <div className="mt-6 h-48 rounded-lg bg-muted/30 flex items-center justify-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground/40" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-2">Top Movers</h2>
          <p className="text-sm text-muted-foreground">Biggest gainers & losers today</p>
          <div className="mt-4 space-y-3">
            {[
              { ticker: "NVDA", change: "+4.2%", up: true },
              { ticker: "AAPL", change: "+1.8%", up: true },
              { ticker: "TSLA", change: "-2.1%", up: false },
              { ticker: "META", change: "+3.1%", up: true },
            ].map((item) => (
              <div key={item.ticker} className="flex items-center justify-between py-2 border-b border-[hsla(var(--glass-border))]">
                <span className="text-sm font-semibold text-foreground">{item.ticker}</span>
                <span className={`text-sm font-medium ${item.up ? "text-primary" : "text-destructive"}`}>{item.change}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
