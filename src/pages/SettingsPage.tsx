import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Lock, Database, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { testAlphaVantageConnection } from "@/lib/api/alphaVantage";
import { testNewsAPIConnection } from "@/lib/api/newsapi";
import { testFMPConnection } from "@/lib/api/fmp";
import { useAppearance } from "@/contexts/AppearanceContext";

const SettingsPage = () => {
  const {
    darkMode,
    compactView,
    animationsEnabled,
    setDarkMode,
    setCompactView,
    setAnimationsEnabled,
  } = useAppearance();
  const [apiStatus, setApiStatus] = useState({
    alphaVantage: { status: "testing", lastCheck: null as Date | null },
    newsAPI: { status: "testing", lastCheck: null as Date | null },
    fmp: { status: "testing", lastCheck: null as Date | null },
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const runApiChecks = async () => {
    try {
      const [alphaResult, newsResult, fmpResult] = await Promise.all([
        testAlphaVantageConnection(),
        testNewsAPIConnection(),
        testFMPConnection(),
      ]);

      setApiStatus({
        alphaVantage: { status: alphaResult ? "connected" : "error", lastCheck: new Date() },
        newsAPI: { status: newsResult ? "connected" : "error", lastCheck: new Date() },
        fmp: { status: fmpResult ? "connected" : "error", lastCheck: new Date() },
      });
    } catch (error) {
      console.error("Error testing APIs:", error);
      setApiStatus({
        alphaVantage: { status: "error", lastCheck: new Date() },
        newsAPI: { status: "error", lastCheck: new Date() },
        fmp: { status: "error", lastCheck: new Date() },
      });
    }
  };

  useEffect(() => {
    runApiChecks();
  }, []);

  const fade = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

  const handleRetestAPIs = () => {
    setApiStatus({
      alphaVantage: { status: "testing", lastCheck: null },
      newsAPI: { status: "testing", lastCheck: null },
      fmp: { status: "testing", lastCheck: null },
    });
    runApiChecks();
  };

  const getStatusIcon = (status: string) => {
    if (status === "connected") return <CheckCircle2 className="h-5 w-5 text-[#1BF2B3]" />;
    if (status === "testing") return <Loader2 className="h-5 w-5 text-[#FFE055] animate-spin" />;
    return <AlertCircle className="h-5 w-5 text-[#FF7597]" />;
  };

  const getStatusBadge = (status: string) => {
    if (status === "connected") {
      return <Badge className="bg-[#1BF2B3]/20 text-[#1BF2B3] border-[#1BF2B3]/30">Connected</Badge>;
    }
    if (status === "testing") {
      return <Badge className="bg-[#FFE055]/20 text-[#FFE055] border-[#FFE055]/30">Testing...</Badge>;
    }
    return <Badge className="bg-[#FF7597]/20 text-[#FF7597] border-[#FF7597]/30">Fallback Mode</Badge>;
  };

  const apis = [
    { key: "alphaVantage" as const, title: "Alpha Vantage", desc: "Stock price data" },
    { key: "newsAPI" as const, title: "NewsAPI", desc: "Market news & headlines" },
    { key: "fmp" as const, title: "FMP", desc: "Financial statements" },
  ];

  return (
    <motion.div className="space-y-6" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
      <motion.div {...fade} className="glass-card p-6">
        <h1 className="text-2xl font-extrabold text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground mt-1">
          Manage your appearance preferences, alerts &amp; API connections
        </p>
      </motion.div>

      {/* API Status Section */}
      <motion.div {...fade} transition={{ delay: 0.08 }}>
        <Card className="glass-card p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFE055] text-[#141416]">
                <Database className="h-4 w-4" />
              </span>
              <h2 className="text-base font-bold text-foreground">API Status</h2>
            </div>
            <Button
              size="sm"
              onClick={handleRetestAPIs}
              className="rounded-full bg-[#FFE055] text-[#141416] hover:bg-[#ffd62b] font-bold"
              disabled={
                apiStatus.alphaVantage.status === "testing" ||
                apiStatus.newsAPI.status === "testing" ||
                apiStatus.fmp.status === "testing"
              }
            >
              Retest Connections
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {apis.map((api) => {
              const info = apiStatus[api.key];
              return (
                <div key={api.key} className="bento-tile p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-sm text-foreground">{api.title}</h3>
                      <p className="text-xs text-muted-foreground">{api.desc}</p>
                    </div>
                    {getStatusIcon(info.status)}
                  </div>
                  <div>{getStatusBadge(info.status)}</div>
                  {info.lastCheck && (
                    <p className="text-[11px] text-muted-foreground">
                      Last checked: {info.lastCheck.toLocaleTimeString()}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="bento-tile p-3.5">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Note:</strong> API keys are configured in environment variables. When external APIs are unavailable, MarketPulse automatically uses local educational sample data.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Preferences Section */}
      <motion.div {...fade} transition={{ delay: 0.14 }} className="grid md:grid-cols-2 gap-5">
        <Card className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1BF2B3]/20 text-[#1BF2B3]">
              <Bell className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-foreground">Notifications</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bento-tile p-3.5">
              <div>
                <p className="text-sm font-semibold text-foreground">Market Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified of major price changes</p>
              </div>
              <Switch checked={notificationsEnabled} onCheckedChange={setNotificationsEnabled} />
            </div>

            <div className="flex items-center justify-between bento-tile p-3.5">
              <div>
                <p className="text-sm font-semibold text-foreground">News Updates</p>
                <p className="text-xs text-muted-foreground">Breaking news from your watchlist</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between bento-tile p-3.5">
              <div>
                <p className="text-sm font-semibold text-foreground">Daily Summary</p>
                <p className="text-xs text-muted-foreground">Morning market analysis</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFE055]/20 text-[#FFE055]">
              <Moon className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-foreground">Appearance</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bento-tile p-3.5">
              <div>
                <p className="text-sm font-semibold text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Use matte dark theme by default</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="flex items-center justify-between bento-tile p-3.5">
              <div>
                <p className="text-sm font-semibold text-foreground">Compact View</p>
                <p className="text-xs text-muted-foreground">Reduce spacing and card padding</p>
              </div>
              <Switch checked={compactView} onCheckedChange={setCompactView} />
            </div>

            <div className="flex items-center justify-between bento-tile p-3.5">
              <div>
                <p className="text-sm font-semibold text-foreground">Animations</p>
                <p className="text-xs text-muted-foreground">Enable smooth transitions</p>
              </div>
              <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div {...fade} transition={{ delay: 0.2 }}>
        <Card className="glass-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF7597]/20 text-[#FF7597]">
              <Lock className="h-4 w-4" />
            </span>
            <h2 className="text-base font-bold text-foreground">Security</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="ghost" className="bento-tile justify-start rounded-2xl h-11 font-semibold">
              Change Password
            </Button>
            <Button variant="ghost" className="bento-tile justify-start rounded-2xl h-11 font-semibold">
              Two-Factor Authentication
            </Button>
            <Button variant="ghost" className="bento-tile justify-start rounded-2xl h-11 font-semibold">
              Connected Devices
            </Button>
          </div>
        </Card>
      </motion.div>

      <motion.div {...fade} transition={{ delay: 0.25 }} className="text-center py-4">
        <p className="text-xs text-muted-foreground">
          MarketPulse v1.0.0 • Built with React &amp; TypeScript
          <br />
          Data sources: Alpha Vantage, NewsAPI, Financial Modeling Prep
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
