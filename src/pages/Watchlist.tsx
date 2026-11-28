import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Plus, Search, Bell, Trash2, Check, Minus, TrendingUp, Layers } from "lucide-react";
import { companies } from "@/lib/mock/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FolderCard } from "@/components/ui/FolderCard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "@/hooks/useWatchlist";

const mockAlertHistory = [
  { id: "ah1", message: "Tesla fell below $240 threshold", time: "2 hours ago" },
  { id: "ah2", message: "Apple rose above $190 target", time: "5 hours ago" },
  { id: "ah3", message: "Amazon crossed $180 alert level", time: "Yesterday" },
  { id: "ah4", message: "Meta surpassed $500 milestone", time: "2 days ago" },
  { id: "ah5", message: "Microsoft hit $420 price alert", time: "3 days ago" },
];

const fadeUp = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

const Watchlist = () => {
  const { watchlist, addCompany, removeCompany, toggleAlert } = useWatchlist();
  const [searchQ, setSearchQ] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertCompany, setAlertCompany] = useState("");
  const [alertCondition, setAlertCondition] = useState("rises above");
  const [alertThreshold, setAlertThreshold] = useState("");
  const [savedAlerts, setSavedAlerts] = useState<string[]>([]);
  const [emailNotif, setEmailNotif] = useState(true);
  const [browserNotif, setBrowserNotif] = useState(false);
  const [dailySummary, setDailySummary] = useState(true);
  const navigate = useNavigate();

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQ.toLowerCase()) ||
      c.symbol.toLowerCase().includes(searchQ.toLowerCase())
  );

  const addToWatchlist = (c: (typeof companies)[0]) => {
    addCompany(c);
    setDialogOpen(false);
    setSearchQ("");
  };

  const handleSetAlert = () => {
    if (!alertCompany || !alertThreshold) return;
    setSavedAlerts((prev) => [...prev, `${alertCompany} ${alertCondition} $${alertThreshold}`]);
    setAlertCompany("");
    setAlertThreshold("");
  };

  const activeAlertCount = watchlist.filter((w) => w.alertSet).length + savedAlerts.length;
  const topWatched = [...watchlist].sort((a, b) => b.changePercent - a.changePercent)[0];

  return (
    <motion.div
      className="space-y-6"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.06 } } }}
    >
      {/* Header */}
      <motion.div variants={fadeUp} className="glass-card p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground">My Watchlist</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Track your favourite companies and configure educational price alerts
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-full bg-[#FFE055] text-[#141416] hover:bg-[#ffd62b] font-bold">
              <Plus className="h-4 w-4" /> Add to Watchlist
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card">
            <DialogHeader>
              <DialogTitle>Add to Watchlist</DialogTitle>
            </DialogHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                className="pl-10 rounded-full"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1.5 mt-2">
              {filteredCompanies.map((c) => (
                <Button
                  variant="ghost"
                  key={c.id}
                  onClick={() => addToWatchlist(c)}
                  className="h-auto w-full justify-start gap-3 p-3 text-left rounded-xl hover:bg-muted"
                >
                  <Badge className="bg-[#FFE055] text-[#141416] font-mono text-xs">{c.symbol}</Badge>
                  <span className="text-sm text-foreground flex-1 font-semibold">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.sector}</span>
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Summary Folder Cards */}
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FolderCard
          tone="mint"
          label="Tracked Items"
          value={`${watchlist.length}`}
          trend="Saved in Browser"
          metaLabel="Catalog"
          metaValue={`${companies.length} Available`}
          ctaLabel="Browse"
          onCtaClick={() => navigate("/company")}
          icon={<Layers className="h-3 w-3" />}
        />
        <FolderCard
          tone="yellow"
          label="Top Watched"
          value={topWatched ? `${topWatched.changePercent >= 0 ? "+" : ""}${topWatched.changePercent.toFixed(2)}%` : "—"}
          trend={topWatched ? topWatched.symbol : "Add a company"}
          metaLabel="Company"
          metaValue={topWatched ? topWatched.name : "Empty"}
          ctaLabel="Analyze"
          onCtaClick={() =>
            navigate(topWatched ? `/company?symbol=${encodeURIComponent(topWatched.symbol)}` : "/company")
          }
          icon={<TrendingUp className="h-3 w-3" />}
        />
        <FolderCard
          tone="pink"
          label="Active Alerts"
          value={`${activeAlertCount}`}
          trend="Alert Triggers"
          metaLabel="Feed"
          metaValue="Live Signals"
          ctaLabel="View Feed"
          onCtaClick={() => navigate("/feed")}
          icon={<Bell className="h-3 w-3" />}
        />
      </motion.div>

      {/* Watchlist Table or Empty State */}
      {watchlist.length === 0 ? (
        <motion.div variants={fadeUp} className="glass-card p-14 text-center">
          <Bookmark className="h-12 w-12 text-[#FFE055] mx-auto mb-4" />
          <p className="text-lg font-bold text-foreground">Your watchlist is empty</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">
            Search and add companies to track them here
          </p>
          <Button
            onClick={() => navigate("/company")}
            className="rounded-full bg-[#FFE055] text-[#141416] hover:bg-[#ffd62b] font-bold"
          >
            Browse Companies
          </Button>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3.5 px-5 font-semibold text-muted-foreground">Name</th>
                <th className="text-left py-3.5 px-4 font-semibold text-muted-foreground">Type</th>
                <th className="text-right py-3.5 px-4 font-semibold text-muted-foreground">Value</th>
                <th className="text-right py-3.5 px-4 font-semibold text-muted-foreground">Change%</th>
                <th className="text-center py-3.5 px-4 font-semibold text-muted-foreground">Alert</th>
                <th className="text-center py-3.5 px-5 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((w) => (
                <tr key={w.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3.5 px-5">
                    <span className="font-bold text-foreground">{w.name}</span>
                    <Badge className="ml-2 text-[10px] bg-[#FFE055]/15 text-[#FFE055] border-[#FFE055]/30">
                      {w.symbol}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-4">
                    <Badge variant="secondary" className="text-xs">{w.type}</Badge>
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-foreground">${w.value.toFixed(2)}</td>
                  <td
                    className={`py-3.5 px-4 text-right font-bold ${
                      w.changePercent >= 0 ? "text-[#1BF2B3]" : "text-[#FF7597]"
                    }`}
                  >
                    {w.changePercent >= 0 ? "+" : ""}
                    {w.changePercent.toFixed(2)}%
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {w.alertSet ? (
                      <Check className="inline h-4 w-4 text-[#1BF2B3]" />
                    ) : (
                      <Minus className="inline h-4 w-4 text-muted-foreground" />
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`${w.alertSet ? "Disable" : "Enable"} alert for ${w.name}`}
                      onClick={() => toggleAlert(w.id)}
                      className="mr-1 rounded-full"
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${w.name} from watchlist`}
                      onClick={() => removeCompany(w.id)}
                      className="rounded-full text-[#FF7597] hover:text-[#FF7597]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Set Price Alert + History + Preferences Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-5">
          <motion.div variants={fadeUp} className="glass-card p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Set Price Alert</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={alertCompany}
                onChange={(e) => setAlertCompany(e.target.value)}
                className="flex-1 rounded-full border border-border bg-[hsla(var(--input))] px-4 py-2 text-sm text-foreground"
              >
                <option value="">Select company</option>
                {companies.map((c) => (
                  <option key={c.id} value={c.symbol}>
                    {c.name} ({c.symbol})
                  </option>
                ))}
              </select>
              <select
                value={alertCondition}
                onChange={(e) => setAlertCondition(e.target.value)}
                className="rounded-full border border-border bg-[hsla(var(--input))] px-4 py-2 text-sm text-foreground"
              >
                <option>rises above</option>
                <option>falls below</option>
              </select>
              <Input
                type="number"
                placeholder="Price"
                className="w-28 rounded-full"
                value={alertThreshold}
                onChange={(e) => setAlertThreshold(e.target.value)}
              />
              <Button
                onClick={handleSetAlert}
                className="rounded-full bg-[#FFE055] text-[#141416] hover:bg-[#ffd62b] font-bold"
              >
                Set Alert
              </Button>
            </div>
            {savedAlerts.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {savedAlerts.map((a, i) => (
                  <Badge key={i} className="bg-[#1BF2B3]/15 text-[#1BF2B3] border-[#1BF2B3]/30 text-xs">
                    {a}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="glass-card p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Notification Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between bento-tile p-3.5">
                <span className="text-sm font-medium text-foreground">Email notifications</span>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>
              <div className="flex items-center justify-between bento-tile p-3.5">
                <span className="text-sm font-medium text-foreground">Browser notifications</span>
                <Switch checked={browserNotif} onCheckedChange={setBrowserNotif} />
              </div>
              <div className="flex items-center justify-between bento-tile p-3.5">
                <span className="text-sm font-medium text-foreground">Daily market summary email</span>
                <Switch checked={dailySummary} onCheckedChange={setDailySummary} />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div variants={fadeUp} className="lg:col-span-5 glass-card p-6">
          <h2 className="text-base font-bold text-foreground mb-4">Alert History</h2>
          <div className="space-y-2.5">
            {mockAlertHistory.map((a, idx) => (
              <div
                key={a.id}
                className={`flex items-center gap-3 p-3.5 ${
                  idx === 0 ? "bento-highlight shadow-sm" : "bento-tile"
                }`}
              >
                <Bell
                  className={`h-4 w-4 shrink-0 ${
                    idx === 0 ? "text-[#141416]" : "text-[#1BF2B3]"
                  }`}
                />
                <span
                  className={`text-xs font-semibold flex-1 ${
                    idx === 0 ? "text-[#141416]" : "text-foreground"
                  }`}
                >
                  {a.message}
                </span>
                <span
                  className={`text-[11px] whitespace-nowrap ${
                    idx === 0 ? "text-[#141416]/75" : "text-muted-foreground"
                  }`}
                >
                  {a.time}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Watchlist;
