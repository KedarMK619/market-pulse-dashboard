import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Newspaper, Tag, CalendarDays, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { products } from "@/lib/mock/mockData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";

const categories = [
  { name: "Electronics", emoji: "📱", match: ["Smartphones", "Smart Speakers", "Laptops", "Semiconductors"] },
  { name: "Fashion", emoji: "👗", match: [] },
  { name: "Food & Beverage", emoji: "🍎", match: ["Food & Beverage"] },
  { name: "Automobiles", emoji: "🚗", match: ["Electric Vehicles"] },
  { name: "Real Estate", emoji: "🏠", match: [] },
  { name: "Pharmaceuticals", emoji: "💊", match: [] },
  { name: "Consumer Goods", emoji: "🛍️", match: ["Components", "Energy", "Luxury Goods"] },
];

const factors = [
  { icon: TrendingUp, name: "Seasonal Trends", desc: "Holiday shopping boosting electronics demand +23%", impact: "High" },
  { icon: Newspaper, name: "Competitor Launch", desc: "New Samsung model affecting iPhone demand", impact: "Medium" },
  { icon: Tag, name: "Price Changes", desc: "Recent price cuts driving 15% demand increase", impact: "High" },
  { icon: CalendarDays, name: "Social Media Buzz", desc: "Viral reviews increasing product awareness", impact: "Low" },
];

const impactColor: Record<string, string> = {
  High: "bg-destructive/20 text-destructive border-destructive/30",
  Medium: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Low: "bg-muted text-muted-foreground border-border",
};

const rankColors = ["text-yellow-400 border-yellow-400", "text-gray-300 border-gray-300", "text-amber-600 border-amber-600"];

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const Products = () => {
  const [selectedCat, setSelectedCat] = useState("Electronics");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const cat = categories.find((c) => c.name === selectedCat);
    let list = cat?.match.length ? products.filter((p) => cat.match.includes(p.category)) : [];
    if (search) {
      const q = search.toLowerCase();
      list = products.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q));
    }
    return list.sort((a, b) => b.demandScore - a.demandScore);
  }, [selectedCat, search]);

  const top5 = filtered.slice(0, 5);
  // aggregate monthly demand from top product or fallback
  const chartProduct = filtered[0];
  const chartData = chartProduct?.monthlyDemand ?? [];

  return (
    <motion.div className="space-y-8" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      {/* Header */}
      <motion.div variants={fadeUp}>
        <h1 className="text-2xl font-bold text-foreground">Product Demand Tracker</h1>
        <p className="text-sm text-muted-foreground mt-1">Track real-time demand shifts across product categories</p>
        <div className="relative mt-4 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search any product..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </motion.div>

      {/* Category Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {categories.map((cat) => {
          const count = cat.match.length ? products.filter((p) => cat.match.includes(p.category)).length : 0;
          const avg = count ? Math.round(products.filter((p) => cat.match.includes(p.category)).reduce((s, p) => s + p.demandScore, 0) / count) : 0;
          const active = selectedCat === cat.name;
          return (
            <button
              key={cat.name}
              onClick={() => { setSearch(""); setSelectedCat(cat.name); }}
              className={`glass-card p-4 text-left transition-all duration-200 hover:scale-[1.03] ${active ? "border-primary shadow-[0_0_16px_hsl(var(--primary)/0.25)]" : ""}`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <p className="text-sm font-semibold text-foreground mt-2">{cat.name}</p>
              <p className="text-xs text-muted-foreground">{count} products</p>
              {count > 0 && <Badge variant="secondary" className="mt-2 text-xs">{avg} avg</Badge>}
            </button>
          );
        })}
      </motion.div>

      {filtered.length === 0 ? (
        <motion.div variants={fadeUp} className="glass-card p-12 text-center">
          <p className="text-muted-foreground">No products found in this category yet.</p>
        </motion.div>
      ) : (
        <>
          {/* Demand Index Chart */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Demand Index — {chartProduct?.name}</h2>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                <Area type="monotone" dataKey="score" stroke="hsl(var(--primary))" fill="url(#demandGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top 5 Products Ranking */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Top Products by Demand</h2>
            <div className="space-y-3">
              {top5.map((p, i) => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-lg bg-background/30 hover:bg-background/50 transition-colors">
                  <span className={`flex items-center justify-center h-8 w-8 rounded-full border-2 text-sm font-bold ${i < 3 ? rankColors[i] : "text-muted-foreground border-muted"}`}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                  </div>
                  <div className="w-24 hidden sm:block">
                    <Progress value={p.demandScore} className="h-2" />
                  </div>
                  <span className="text-sm font-bold text-foreground w-10 text-right">{p.demandScore}</span>
                  <Badge className={`text-xs ${p.demandChange >= 0 ? "bg-primary/20 text-primary" : "bg-destructive/20 text-destructive"}`}>
                    {p.demandChange >= 0 ? "+" : ""}{p.demandChange}
                  </Badge>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Demand Change Table */}
          <motion.div variants={fadeUp} className="glass-card p-6 overflow-x-auto">
            <h2 className="text-lg font-semibold text-foreground mb-4">Demand Changes</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-3 px-2 font-medium">Product</th>
                  <th className="text-right py-3 px-2 font-medium">Current</th>
                  <th className="text-right py-3 px-2 font-medium">Last Month</th>
                  <th className="text-right py-3 px-2 font-medium">Change</th>
                  <th className="text-center py-3 px-2 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr key={p.id} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-background/20" : ""}`}>
                    <td className="py-3 px-2 font-medium text-foreground">{p.name}</td>
                    <td className="py-3 px-2 text-right text-foreground">{p.demandScore}</td>
                    <td className="py-3 px-2 text-right text-muted-foreground">{p.lastMonthScore}</td>
                    <td className={`py-3 px-2 text-right font-semibold ${p.demandChange >= 0 ? "text-primary" : "text-destructive"}`}>
                      {p.demandChange >= 0 ? "+" : ""}{p.demandChange}
                    </td>
                    <td className="py-3 px-2 text-center">
                      {p.trend === "up" ? <ArrowUpRight className="inline h-4 w-4 text-primary" /> : p.trend === "down" ? <ArrowDownRight className="inline h-4 w-4 text-destructive" /> : <Minus className="inline h-4 w-4 text-yellow-400" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Key Demand Factors */}
          <motion.div variants={fadeUp}>
            <h2 className="text-lg font-semibold text-foreground mb-4">Key Demand Factors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {factors.map((f) => (
                <div key={f.name} className="glass-card p-5 flex gap-4">
                  <div className="p-2 rounded-lg bg-primary/10 h-fit">
                    <f.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">{f.name}</p>
                      <Badge variant="outline" className={`text-[10px] px-1.5 ${impactColor[f.impact]}`}>{f.impact}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default Products;
