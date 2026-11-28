import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  TrendingUp,
  Newspaper,
  Tag,
  CalendarDays,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Flame,
  BarChart3,
  TrendingDown,
} from "lucide-react";
import { products } from "@/lib/mock/mockData";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FolderCard } from "@/components/ui/FolderCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
  High: "bg-[#FF7597]/20 text-[#FF7597] border-[#FF7597]/30",
  Medium: "bg-[#FFE055]/20 text-[#FFE055] border-[#FFE055]/30",
  Low: "bg-muted text-muted-foreground border-border",
};

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const Products = () => {
  const [selectedCat, setSelectedCat] = useState("Electronics");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const cat = categories.find((c) => c.name === selectedCat);
    let list = cat?.match.length ? products.filter((p) => cat.match.includes(p.category)) : [];
    if (search) {
      const q = search.toLowerCase();
      list = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    return list.sort((a, b) => b.demandScore - a.demandScore);
  }, [selectedCat, search]);

  const topSurging = useMemo(
    () => [...products].sort((a, b) => b.demandChange - a.demandChange)[0],
    []
  );
  const topCooling = useMemo(
    () => [...products].sort((a, b) => a.demandChange - b.demandChange)[0],
    []
  );
  const avgCategoryScore = useMemo(() => {
    if (!filtered.length) return 0;
    return Math.round(filtered.reduce((s, p) => s + p.demandScore, 0) / filtered.length);
  }, [filtered]);

  const top5 = filtered.slice(0, 5);
  const chartProduct = filtered[0];
  const chartData = chartProduct?.monthlyDemand ?? [];

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      {/* Header + Search */}
      <motion.div variants={fadeUp} className="glass-card p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-foreground">Product Demand Tracker</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Track real-time demand shifts, regional popularity &amp; product drivers
          </p>
        </div>
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search any product or brand..."
            className="pl-11 h-11 rounded-full bg-[hsla(var(--input))] border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Top 3 Folder Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FolderCard
          tone="mint"
          label="Surging Product"
          value={`${topSurging.demandScore}/100`}
          trend={`+${topSurging.demandChange} MoM`}
          metaLabel="Product"
          metaValue={topSurging.name}
          ctaLabel="Focus"
          onCtaClick={() => {
            setSearch("");
            setSelectedCat("Electronics");
          }}
          icon={<Flame className="h-3 w-3" />}
        />
        <FolderCard
          tone="yellow"
          label={`${selectedCat} Avg`}
          value={`${avgCategoryScore}/100`}
          trend={`${filtered.length} Products`}
          metaLabel="Leader"
          metaValue={chartProduct?.name ?? "None"}
          ctaLabel="Reset"
          onCtaClick={() => setSearch("")}
          icon={<BarChart3 className="h-3 w-3" />}
        />
        <FolderCard
          tone="pink"
          label="Cooling Demand"
          value={`${topCooling.demandScore}/100`}
          trend={`${topCooling.demandChange} MoM`}
          metaLabel="Product"
          metaValue={topCooling.name}
          ctaLabel="Inspect"
          onCtaClick={() => {
            setSearch("");
            setSelectedCat("Automobiles");
          }}
          icon={<TrendingDown className="h-3 w-3" />}
        />
      </motion.div>

      {/* Category Tile Grid */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {categories.map((cat) => {
          const count = cat.match.length
            ? products.filter((p) => cat.match.includes(p.category)).length
            : 0;
          const avg = count
            ? Math.round(
                products
                  .filter((p) => cat.match.includes(p.category))
                  .reduce((s, p) => s + p.demandScore, 0) / count
              )
            : 0;
          const active = !search && selectedCat === cat.name;
          return (
            <button
              key={cat.name}
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCat(cat.name);
              }}
              className={`p-4 text-left transition-all duration-200 hover:scale-[1.03] ${
                active ? "bento-highlight shadow-md" : "glass-card"
              }`}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <p className={`text-sm font-bold mt-2 ${active ? "text-[#141416]" : "text-foreground"}`}>
                {cat.name}
              </p>
              <p className={`text-xs ${active ? "text-[#141416]/75" : "text-muted-foreground"}`}>
                {count} products
              </p>
              {count > 0 && (
                <Badge
                  className={`mt-2 text-[11px] ${
                    active ? "bg-[#141416] text-[#FFE055]" : "bg-muted text-foreground"
                  }`}
                >
                  {avg} avg
                </Badge>
              )}
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
          {/* Demand Chart + Top 5 Ranking Bento Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <motion.div variants={fadeUp} className="lg:col-span-7 glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-foreground">
                  Demand Index — {chartProduct?.name}
                </h2>
                <Badge className="bg-[#1BF2B3]/15 text-[#1BF2B3] border-[#1BF2B3]/30">
                  {chartProduct?.demandScore}/100
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#1BF2B3" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="#1BF2B3" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      background: "#1C1C20",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 12,
                      color: "#fff",
                    }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#1BF2B3" fill="url(#demandGrad)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-5 glass-card p-6">
              <h2 className="text-base font-bold text-foreground mb-4">Top Products by Demand</h2>
              <div className="space-y-2.5">
                {top5.map((p, i) => {
                  const first = i === 0;
                  return (
                    <div
                      key={p.id}
                      className={`flex items-center gap-3 p-3 ${
                        first ? "bento-highlight shadow-sm" : "bento-tile"
                      }`}
                    >
                      <span
                        className={`flex items-center justify-center h-8 w-8 rounded-xl text-xs font-extrabold shrink-0 ${
                          first
                            ? "bg-[#141416] text-[#FFE055]"
                            : "bg-background/60 text-foreground"
                        }`}
                      >
                        #{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold truncate ${first ? "text-[#141416]" : "text-foreground"}`}>
                          {p.name}
                        </p>
                        <p className={`text-xs ${first ? "text-[#141416]/75" : "text-muted-foreground"}`}>
                          {p.brand}
                        </p>
                      </div>
                      <div className="w-20 hidden sm:block">
                        <Progress value={p.demandScore} className="h-2" />
                      </div>
                      <span className={`text-sm font-extrabold w-8 text-right ${first ? "text-[#141416]" : "text-foreground"}`}>
                        {p.demandScore}
                      </span>
                      <Badge
                        className={`text-[11px] ${
                          first
                            ? "bg-[#141416] text-[#FFE055]"
                            : p.demandChange >= 0
                            ? "bg-[#1BF2B3]/20 text-[#1BF2B3]"
                            : "bg-[#FF7597]/20 text-[#FF7597]"
                        }`}
                      >
                        {p.demandChange >= 0 ? "+" : ""}
                        {p.demandChange}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Demand Change Table */}
          <motion.div variants={fadeUp} className="glass-card overflow-x-auto">
            <div className="p-6 pb-3">
              <h2 className="text-base font-bold text-foreground">Demand Changes</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-muted-foreground">
                  <th className="text-left py-3 px-6 font-semibold">Product</th>
                  <th className="text-right py-3 px-4 font-semibold">Current</th>
                  <th className="text-right py-3 px-4 font-semibold">Last Month</th>
                  <th className="text-right py-3 px-4 font-semibold">Change</th>
                  <th className="text-center py-3 px-6 font-semibold">Trend</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => (
                  <tr key={p.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-foreground">{p.name}</td>
                    <td className="py-3.5 px-4 text-right font-bold text-foreground">{p.demandScore}</td>
                    <td className="py-3.5 px-4 text-right text-muted-foreground">{p.lastMonthScore}</td>
                    <td
                      className={`py-3.5 px-4 text-right font-bold ${
                        p.demandChange >= 0 ? "text-[#1BF2B3]" : "text-[#FF7597]"
                      }`}
                    >
                      {p.demandChange >= 0 ? "+" : ""}
                      {p.demandChange}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {p.trend === "up" ? (
                        <ArrowUpRight className="inline h-4 w-4 text-[#1BF2B3]" />
                      ) : p.trend === "down" ? (
                        <ArrowDownRight className="inline h-4 w-4 text-[#FF7597]" />
                      ) : (
                        <Minus className="inline h-4 w-4 text-[#FFE055]" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>

          {/* Key Demand Factors */}
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Key Demand Factors</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {factors.map((f) => (
                <div key={f.name} className="bento-tile p-4 flex gap-4">
                  <div className="p-2.5 rounded-xl bg-[#FFE055]/15 h-fit">
                    <f.icon className="h-5 w-5 text-[#FFE055]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-bold text-foreground">{f.name}</p>
                      <Badge variant="outline" className={`text-[10px] px-2 ${impactColor[f.impact]}`}>
                        {f.impact}
                      </Badge>
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
