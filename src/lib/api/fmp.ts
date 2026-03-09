// Educational project - Financial Modeling Prep API
// API Documentation: https://financialmodelingprep.com/

import { companies } from "@/lib/mock/mockData";

const API_KEY = import.meta.env.VITE_FMP_KEY || "";
const BASE_URL = "https://financialmodelingprep.com/api/v3";

interface QuarterlyData {
  quarter: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  profitMargin: number;
  changeFromLastQuarter: number;
}

interface CompanyFinancials {
  marketCap: string;
  revenue: number;
  netIncome: number;
  employees: string;
  ceo: string;
  website: string;
  sector: string;
}

const getMockCompany = (symbol: string) => {
  return companies.find((c) => c.symbol.toUpperCase() === symbol.toUpperCase());
};

const getMockIncomeStatement = (symbol: string): QuarterlyData[] => {
  const company = getMockCompany(symbol);
  if (!company) {
    return [
      { quarter: "Q1 2024", revenue: 50, expenses: 30, netProfit: 20, profitMargin: 40, changeFromLastQuarter: 5 },
      { quarter: "Q4 2023", revenue: 48, expenses: 29, netProfit: 19, profitMargin: 39.6, changeFromLastQuarter: 3 },
      { quarter: "Q3 2023", revenue: 45, expenses: 28, netProfit: 17, profitMargin: 37.8, changeFromLastQuarter: 2 },
      { quarter: "Q2 2023", revenue: 43, expenses: 27, netProfit: 16, profitMargin: 37.2, changeFromLastQuarter: 1 },
    ];
  }

  const revenues = company.revenue || [100, 95, 90, 85];
  const expenses = company.expenses || [70, 68, 65, 62];
  const netProfits = company.netProfit || [30, 27, 25, 23];

  return [
    {
      quarter: "Q1 2024",
      revenue: revenues[0],
      expenses: expenses[0],
      netProfit: netProfits[0],
      profitMargin: (netProfits[0] / revenues[0]) * 100,
      changeFromLastQuarter: 5,
    },
    {
      quarter: "Q4 2023",
      revenue: revenues[1],
      expenses: expenses[1],
      netProfit: netProfits[1],
      profitMargin: (netProfits[1] / revenues[1]) * 100,
      changeFromLastQuarter: 3,
    },
    {
      quarter: "Q3 2023",
      revenue: revenues[2],
      expenses: expenses[2],
      netProfit: netProfits[2],
      profitMargin: (netProfits[2] / revenues[2]) * 100,
      changeFromLastQuarter: 2,
    },
    {
      quarter: "Q2 2023",
      revenue: revenues[3],
      expenses: expenses[3],
      netProfit: netProfits[3],
      profitMargin: (netProfits[3] / revenues[3]) * 100,
      changeFromLastQuarter: 1,
    },
  ];
};

const getMockCompanyFinancials = (symbol: string): CompanyFinancials => {
  const company = getMockCompany(symbol);
  if (!company) {
    return {
      marketCap: "1.0T",
      revenue: 100,
      netIncome: 25,
      employees: "50000",
      ceo: "Unknown",
      website: "www.example.com",
      sector: "Technology",
    };
  }

  return {
    marketCap: company.marketCap,
    revenue: company.revenue?.[0] || 100,
    netIncome: company.netProfit?.[0] || 25,
    employees: "50000",
    ceo: "Executive",
    website: "www.company.com",
    sector: company.sector,
  };
};

export const getIncomeStatement = async (symbol: string): Promise<QuarterlyData[]> => {
  try {
    const params = new URLSearchParams({
      limit: "4",
      apikey: API_KEY,
    });

    const response = await fetch(
      `${BASE_URL}/income-statement/${symbol.toUpperCase()}?${params.toString()}`
    );

    if (!response.ok) {
      console.warn(`FMP API error: ${response.status}, using mock data`);
      return getMockIncomeStatement(symbol);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Invalid FMP income statement response, using mock data");
      return getMockIncomeStatement(symbol);
    }

    return data.slice(0, 4).map((item: any, idx: number) => {
      const prevRevenue = idx > 0 ? data[idx - 1].revenue : data[idx].revenue;
      const changePercent = ((item.revenue - prevRevenue) / prevRevenue) * 100;

      return {
        quarter: item.date ? new Date(item.date).toLocaleString("en-US", { year: "numeric", quarter: "short" }) : `Q${4 - idx}`,
        revenue: item.revenue / 1000000000, // Convert to billions
        expenses: (item.revenue - item.netIncome) / 1000000000,
        netProfit: item.netIncome / 1000000000,
        profitMargin: (item.netIncome / item.revenue) * 100,
        changeFromLastQuarter: changePercent,
      };
    });
  } catch (error) {
    console.error("Error fetching income statement from FMP:", error);
    return getMockIncomeStatement(symbol);
  }
};

export const getCompanyFinancials = async (symbol: string): Promise<CompanyFinancials> => {
  try {
    const params = new URLSearchParams({
      apikey: API_KEY,
    });

    const response = await fetch(`${BASE_URL}/profile/${symbol.toUpperCase()}?${params.toString()}`);

    if (!response.ok) {
      console.warn(`FMP API error: ${response.status}, using mock data`);
      return getMockCompanyFinancials(symbol);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      console.warn("Invalid FMP profile response, using mock data");
      return getMockCompanyFinancials(symbol);
    }

    const company = data[0];
    return {
      marketCap: (company.marketCap / 1000000000).toFixed(0) + "B",
      revenue: company.revenue / 1000000000, // billions
      netIncome: company.netIncome / 1000000000,
      employees: company.fullTimeEmployees?.toString() || "N/A",
      ceo: company.ceo || "Unknown",
      website: company.website || "N/A",
      sector: company.sector || "Technology",
    };
  } catch (error) {
    console.error("Error fetching financials from FMP:", error);
    return getMockCompanyFinancials(symbol);
  }
};

// Test API connection
export const testFMPConnection = async (): Promise<boolean> => {
  try {
    const financials = await getIncomeStatement("AAPL");
    return financials.length > 0;
  } catch {
    return false;
  }
};
