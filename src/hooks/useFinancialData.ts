import { useState, useEffect } from "react";
import { getIncomeStatement, getCompanyFinancials } from "@/lib/api/fmp";

interface FinancialData {
  incomeStatement: any[];
  financials: any;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useCompanyFinancials = (symbol: string | null) => {
  const [data, setData] = useState<FinancialData>({
    incomeStatement: [],
    financials: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    if (!symbol) {
      setData((prev) => ({ ...prev, loading: false }));
      return;
    }

    const fetchFinancials = async () => {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const [incomeStatement, financials] = await Promise.all([
          getIncomeStatement(symbol),
          getCompanyFinancials(symbol),
        ]);

        setData({
          incomeStatement,
          financials,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error("Error fetching financials:", error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch financial data. Using cached data.",
        }));
      }
    };

    fetchFinancials();
  }, [symbol]);

  return data;
};
