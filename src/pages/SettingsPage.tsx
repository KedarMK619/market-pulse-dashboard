import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, Moon, Lock, Database, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  testAlphaVantageConnection,
} from "@/lib/api/alphaVantage";
import { testNewsAPIConnection } from "@/lib/api/newsapi";
import { testFMPConnection } from "@/lib/api/fmp";

const SettingsPage = () => {
  const [apiStatus, setApiStatus] = useState({
    alphaVantage: { status: "testing", lastCheck: null as Date | null },
    newsAPI: { status: "testing", lastCheck: null as Date | null },
    fmp: { status: "testing", lastCheck: null as Date | null },
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Test API connections on mount
  useEffect(() => {
    const testAPIs = async () => {
      try {
        const [alphaResult, newsResult, fmpResult] = await Promise.all([
          testAlphaVantageConnection(),
          testNewsAPIConnection(),
          testFMPConnection(),
        ]);

        setApiStatus({
          alphaVantage: {
            status: alphaResult ? "connected" : "error",
            lastCheck: new Date(),
          },
          newsAPI: {
            status: newsResult ? "connected" : "error",
            lastCheck: new Date(),
          },
          fmp: {
            status: fmpResult ? "connected" : "error",
            lastCheck: new Date(),
          },
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

    testAPIs();
  }, []);

  const fade = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.35 } };

  const handleRetestAPIs = () => {
    setApiStatus({
      alphaVantage: { status: "testing", lastCheck: null },
      newsAPI: { status: "testing", lastCheck: null },
      fmp: { status: "testing", lastCheck: null },
    });
    
    const testAPIs = async () => {
      try {
        const [alphaResult, newsResult, fmpResult] = await Promise.all([
          testAlphaVantageConnection(),
          testNewsAPIConnection(),
          testFMPConnection(),
        ]);

        setApiStatus({
          alphaVantage: {
            status: alphaResult ? "connected" : "error",
            lastCheck: new Date(),
          },
          newsAPI: {
            status: newsResult ? "connected" : "error",
            lastCheck: new Date(),
          },
          fmp: {
            status: fmpResult ? "connected" : "error",
            lastCheck: new Date(),
          },
        });
      } catch (error) {
        console.error("Error testing APIs:", error);
      }
    };

    testAPIs();
  };

  const getStatusIcon = (status: string) => {
    if (status === "connected") {
      return <CheckCircle2 className="h-5 w-5 text-primary" />;
    } else if (status === "testing") {
      return <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-destructive" />;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "connected") {
      return <Badge className="bg-primary/20 text-primary border-primary/30">Connected</Badge>;
    } else if (status === "testing") {
      return <Badge className="bg-yellow-500/20 text-yellow-600 border-yellow-500/30">Testing...</Badge>;
    } else {
      return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Error</Badge>;
    }
  };

  return (
    <motion.div className="space-y-8" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }}>
      {/* Page Header */}
      <motion.div {...fade}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your preferences and API connections</p>
      </motion.div>

      {/* API Status Section */}
      <motion.div {...fade} transition={{ delay: 0.1 }}>
        <Card className="glass-card border border-[hsla(var(--glass-border))] p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">API Status</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetestAPIs}
              disabled={apiStatus.alphaVantage.status === "testing" || apiStatus.newsAPI.status === "testing" || apiStatus.fmp.status === "testing"}
            >
              Retest Connections
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Alpha Vantage */}
            <div className="glass-card p-4 border border-[hsla(var(--glass-border))] space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">Alpha Vantage</h3>
                  <p className="text-xs text-muted-foreground">Stock price data</p>
                </div>
                {getStatusIcon(apiStatus.alphaVantage.status)}
              </div>
              <div className="pt-2">
                {getStatusBadge(apiStatus.alphaVantage.status)}
              </div>
              {apiStatus.alphaVantage.lastCheck && (
                <p className="text-xs text-muted-foreground pt-2">
                  Last checked: {apiStatus.alphaVantage.lastCheck.toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* NewsAPI */}
            <div className="glass-card p-4 border border-[hsla(var(--glass-border))] space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">NewsAPI</h3>
                  <p className="text-xs text-muted-foreground">Market news & headlines</p>
                </div>
                {getStatusIcon(apiStatus.newsAPI.status)}
              </div>
              <div className="pt-2">
                {getStatusBadge(apiStatus.newsAPI.status)}
              </div>
              {apiStatus.newsAPI.lastCheck && (
                <p className="text-xs text-muted-foreground pt-2">
                  Last checked: {apiStatus.newsAPI.lastCheck.toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* FMP */}
            <div className="glass-card p-4 border border-[hsla(var(--glass-border))] space-y-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">FMP</h3>
                  <p className="text-xs text-muted-foreground">Financial statements</p>
                </div>
                {getStatusIcon(apiStatus.fmp.status)}
              </div>
              <div className="pt-2">
                {getStatusBadge(apiStatus.fmp.status)}
              </div>
              {apiStatus.fmp.lastCheck && (
                <p className="text-xs text-muted-foreground pt-2">
                  Last checked: {apiStatus.fmp.lastCheck.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>

          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Note:</strong> API keys are configured in your environment variables. If you see "Error" status, please verify your API keys are valid and have sufficient quota. Free tier API limits may apply.
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Preferences Section */}
      <motion.div {...fade} transition={{ delay: 0.2 }} className="grid md:grid-cols-2 gap-6">
        {/* Notifications */}
        <Card className="glass-card border border-[hsla(var(--glass-border))] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Market Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified of major price changes</p>
              </div>
              <Switch
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">News Updates</p>
                <p className="text-xs text-muted-foreground">Breaking news from your watchlist</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Daily Summary</p>
                <p className="text-xs text-muted-foreground">Morning market analysis</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card className="glass-card border border-[hsla(var(--glass-border))] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Moon className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Appearance</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Use dark theme by default</p>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Compact View</p>
                <p className="text-xs text-muted-foreground">Reduce spacing and size</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Animations</p>
                <p className="text-xs text-muted-foreground">Enable smooth transitions</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Security Section */}
      <motion.div {...fade} transition={{ delay: 0.3 }}>
        <Card className="glass-card border border-[hsla(var(--glass-border))] p-6 space-y-4">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">Security</h2>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Connected Devices
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div {...fade} transition={{ delay: 0.4 }} className="text-center py-8">
        <p className="text-xs text-muted-foreground">
          MarketPulse v1.0.0 • Built with React & TypeScript<br />
          Data sources: Alpha Vantage, NewsAPI, Financial Modeling Prep
        </p>
      </motion.div>
    </motion.div>
  );
};

export default SettingsPage;
