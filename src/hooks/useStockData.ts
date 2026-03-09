import { useState, useEffect } from "react";
import { getStockQuote, getStockHistory, getCompanyOverview } from "@/lib/api/alphaVantage";

interface StockData {
  quote: any;
  history: any[];
  overview: any;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useStockData = (symbol: string | null) => {
  const [data, setData] = useState<StockData>({
    quote: null,
    history: [],
    overview: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    if (!symbol) {
      setData((prev) => ({ ...prev, loading: false }));
      return;
    }

    const fetchData = async () => {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const [quote, history, overview] = await Promise.all([
          getStockQuote(symbol),
          getStockHistory(symbol, "1M"),
          getCompanyOverview(symbol),
        ]);

        setData({
          quote,
          history,
          overview,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch stock data. Using cached data.",
        }));
      }
    };

    fetchData();
  }, [symbol]);

  return data;
};
