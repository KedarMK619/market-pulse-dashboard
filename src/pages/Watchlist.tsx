import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Plus, Search, Bell, Trash2, Check, Minus } from "lucide-react";
import { companies } from "@/lib/mock/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

type WatchItem = { id: string; name: string; symbol: string; type: string; value: number; changePercent: number; alertSet: boolean };

const mockAlertHistory = [
  { id: "ah1", message: "Tesla fell below $240 threshold", time: "2 hours ago" },
  { id: "ah2", message: "Apple rose above $190 target", time: "5 hours ago" },
  { id: "ah3", message: "Amazon crossed $180 alert level", time: "Yesterday" },
  { id: "ah4", message: "Meta surpassed $500 milestone", time: "2 days ago" },
  { id: "ah5", message: "Microsoft hit $420 price alert", time: "3 days ago" },
];

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState<WatchItem[]>([]);
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
    (c) => c.name.toLowerCase().includes(searchQ.toLowerCase()) || c.symbol.toLowerCase().includes(searchQ.toLowerCase())
  );

  const addToWatchlist = (c: typeof companies[0]) => {
    if (watchlist.find((w) => w.id === c.id)) return;
    setWatchlist((prev) => [...prev, { id: c.id, name: c.name, symbol: c.symbol, type: "Company", value: c.currentPrice, changePercent: c.changePercent, alertSet: false }]);
    setDialogOpen(false);
    setSearchQ("");
  };

  const removeItem = (id: string) => setWatchlist((prev) => prev.filter((w) => w.id !== id));
  const toggleAlert = (id: string) => setWatchlist((prev) => prev.map((w) => w.id === id ? { ...w, alertSet: !w.alertSet } : w));

  const handleSetAlert = () => {
    if (!alertCompany || !alertThreshold) return;
    setSavedAlerts((prev) => [...prev, `${alertCompany} ${alertCondition} $${alertThreshold}`]);
    setAlertCompany("");
    setAlertThreshold("");
  };

  return (
    <motion.div className="space-y-8" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      {/* Header */}
      <motion.div variants={fadeUp} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Watchlist</h1>
          <p className="text-sm text-muted-foreground mt-1">Track your favourite companies and products</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" /> Add to Watchlist</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add to Watchlist</DialogTitle></DialogHeader>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search companies..." className="pl-10" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1 mt-2">
              {filteredCompanies.map((c) => (
                <button
                  key={c.id}
                  onClick={() => addToWatchlist(c)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                >
                  <Badge variant="outline" className="text-xs">{c.symbol}</Badge>
                  <span className="text-sm text-foreground flex-1">{c.name}</span>
                  <span className="text-xs text-muted-foreground">{c.sector}</span>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Watchlist Table or Empty State */}
      {watchlist.length === 0 ? (
        <motion.div variants={fadeUp} className="glass-card p-16 text-center">
          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-semibold text-foreground">Your watchlist is empty</p>
          <p className="text-sm text-muted-foreground mt-1 mb-6">Search and add companies or products to track them here</p>
          <Button onClick={() => navigate("/company")}>Browse Companies</Button>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background/40">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Name</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Value</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Change%</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Alert</th>
                <th className="text-center py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((w, i) => (
                <tr key={w.id} className={`border-b border-border/50 ${i % 2 === 0 ? "bg-background/20" : ""}`}>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-foreground">{w.name}</span>
                    <Badge variant="outline" className="ml-2 text-[10px]">{w.symbol}</Badge>
                  </td>
                  <td className="py-3 px-4"><Badge variant="secondary" className="text-xs">{w.type}</Badge></td>
                  <td className="py-3 px-4 text-right text-foreground">${w.value.toFixed(2)}</td>
                  <td className={`py-3 px-4 text-right font-semibold ${w.changePercent >= 0 ? "text-primary" : "text-destructive"}`}>
                    {w.changePercent >= 0 ? "+" : ""}{w.changePercent.toFixed(2)}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    {w.alertSet ? <Check className="inline h-4 w-4 text-primary" /> : <Minus className="inline h-4 w-4 text-muted-foreground" />}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button onClick={() => toggleAlert(w.id)} className="p-1.5 rounded hover:bg-muted/50 transition-colors mr-1">
                      <Bell className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </button>
                    <button onClick={() => removeItem(w.id)} className="p-1.5 rounded hover:bg-destructive/20 transition-colors">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}

      {/* Set Alert Panel */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Set Price Alert</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <select value={alertCompany} onChange={(e) => setAlertCompany(e.target.value)} className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
            <option value="">Select company</option>
            {companies.map((c) => <option key={c.id} value={c.symbol}>{c.name} ({c.symbol})</option>)}
          </select>
          <select value={alertCondition} onChange={(e) => setAlertCondition(e.target.value)} className="rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground">
            <option>rises above</option>
            <option>falls below</option>
          </select>
          <Input type="number" placeholder="Price" className="w-28" value={alertThreshold} onChange={(e) => setAlertThreshold(e.target.value)} />
          <Button onClick={handleSetAlert}>Set Alert</Button>
        </div>
        {savedAlerts.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {savedAlerts.map((a, i) => (
              <Badge key={i} variant="secondary" className="text-xs">{a}</Badge>
            ))}
          </div>
        )}
      </motion.div>

      {/* Alert History */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Alert History</h2>
        <div className="space-y-3">
          {mockAlertHistory.map((a) => (
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/30">
              <Bell className="h-4 w-4 text-primary shrink-0" />
              <span className="text-sm text-foreground flex-1">{a.message}</span>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{a.time}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div variants={fadeUp} className="glass-card p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Notification Preferences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Email notifications</span>
            <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Browser notifications</span>
            <Switch checked={browserNotif} onCheckedChange={setBrowserNotif} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">Daily market summary email</span>
            <Switch checked={dailySummary} onCheckedChange={setDailySummary} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Watchlist;
