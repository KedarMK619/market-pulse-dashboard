// Educational project - Alpha Vantage free tier
// API Documentation: https://www.alphavantage.co/documentation/

import { companies } from "@/lib/mock/mockData";

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY || "";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
const BASE_URL = "https://www.alphavantage.co/query";

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  lastUpdated: string;
}

interface HistoryData {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CompanyOverview {
  name: string;
  symbol: string;
  sector: string;
  industry: string;
  marketCap: string;
  peRatio: string;
  high52week: number;
  low52week: number;
  description: string;
  employees: string;
}

// Mock fallback data
const getMockCompany = (symbol: string) => {
  return companies.find((c) => c.symbol.toUpperCase() === symbol.toUpperCase());
};

const getMockQuote = (symbol: string): StockQuote => {
  const company = getMockCompany(symbol);
  if (!company) {
    return {
      symbol,
      price: 100,
      change: 2.5,
      changePercent: 2.5,
      high: 105,
      low: 98,
      volume: 5000000,
      lastUpdated: new Date().toISOString(),
    };
  }

  return {
    symbol: company.symbol,
    price: company.currentPrice,
    change: company.change,
    changePercent: company.changePercent,
    high: company.high52week,
    low: company.low52week,
    volume: 5000000,
    lastUpdated: new Date().toISOString(),
  };
};

const getMockHistory = (
  symbol: string,
  range: "1D" | "1W" | "1M" | "1Y"
): HistoryData[] => {
  const company = getMockCompany(symbol);
  const basePrice = company?.currentPrice || 100;
  const volatility = 0.05;
  
  const rangeMap = {
    "1D": 1,
    "1W": 7,
    "1M": 30,
    "1Y": 365,
  };

  const days = rangeMap[range];
  const data: HistoryData[] = [];
  let price = basePrice * 0.95;

  for (let i = 0; i < days; i++) {
    const trend = (basePrice - price) / days;
    const noise = (Math.random() - 0.45) * volatility * basePrice;
    price += trend + noise;

    const date = new Date();
    date.setDate(date.getDate() - (days - i));

    data.push({
      date: date.toISOString().split("T")[0],
      open: Math.round(price * 100) / 100,
      high: Math.round((price * 1.02) * 100) / 100,
      low: Math.round((price * 0.98) * 100) / 100,
      close: basePrice,
      volume: Math.floor(Math.random() * 10000000 + 1000000),
    });
  }

  data[data.length - 1].close = basePrice;
  return data;
};

const getMockOverview = (symbol: string): CompanyOverview => {
  const company = getMockCompany(symbol);
  if (!company) {
    return {
      name: symbol,
      symbol: symbol,
      sector: "Technology",
      industry: "Software",
      marketCap: "1.0T",
      peRatio: "28.5",
      high52week: 150,
      low52week: 100,
      description: "A leading technology company.",
      employees: "100000",
    };
  }

  return {
    name: company.name,
    symbol: company.symbol,
    sector: company.sector,
    industry: "Various",
    marketCap: company.marketCap,
    peRatio: "25.3",
    high52week: company.high52week,
    low52week: company.low52week,
    description: `${company.name} is a major company in the ${company.sector} sector.`,
    employees: "50000",
  };
};

// Real API calls with error handling and fallback
export const getStockQuote = async (symbol: string): Promise<StockQuote> => {
  try {
    const params = new URLSearchParams({
      function: "GLOBAL_QUOTE",
      symbol: symbol.toUpperCase(),
      apikey: API_KEY,
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      console.warn(
        `Alpha Vantage API error: ${response.status}, using mock data`
      );
      return getMockQuote(symbol);
    }

    const data = await response.json();

    // Check for API rate limit or error
    if (data["Note"] || data["Error Message"]) {
      console.warn(
        "Alpha Vantage API rate limited or error:",
        data["Note"] || data["Error Message"]
      );
      return getMockQuote(symbol);
    }

    const quote = data["Global Quote"];
    if (!quote || !quote["05. price"]) {
      console.warn("Invalid Alpha Vantage response for quote, using mock data");
      return getMockQuote(symbol);
    }

    return {
      symbol: quote["01. symbol"] || symbol,
      price: parseFloat(quote["05. price"]) || 0,
      change: parseFloat(quote["09. change"]) || 0,
      changePercent: parseFloat(quote["10. change percent"]?.replace("%", "") || "0") || 0,
      high: parseFloat(quote["03. high"]) || 0,
      low: parseFloat(quote["04. low"]) || 0,
      volume: parseInt(quote["06. volume"]) || 0,
      lastUpdated: new Date(quote["07. latest trading day"])?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching quote from Alpha Vantage:", error);
    return getMockQuote(symbol);
  }
};

export const getStockHistory = async (
  symbol: string,
  range: "1D" | "1W" | "1M" | "1Y" = "1M"
): Promise<HistoryData[]> => {
  try {
    const params = new URLSearchParams({
      function: "TIME_SERIES_DAILY",
      symbol: symbol.toUpperCase(),
      apikey: API_KEY,
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      console.warn(
        `Alpha Vantage API error: ${response.status}, using mock data`
      );
      return getMockHistory(symbol, range);
    }

    const data = await response.json();

    if (data["Note"] || data["Error Message"]) {
      console.warn("Alpha Vantage API error, using mock data");
      return getMockHistory(symbol, range);
    }

    const timeSeries = data["Time Series (Daily)"];
    if (!timeSeries) {
      console.warn("No time series data, using mock data");
      return getMockHistory(symbol, range);
    }

    const rangeMap = {
      "1D": 1,
      "1W": 7,
      "1M": 30,
      "1Y": 365,
    };

    const daysToFetch = rangeMap[range];
    const dates = Object.keys(timeSeries).slice(0, daysToFetch);

    return dates
      .reverse()
      .map((date) => ({
        date,
        open: parseFloat(timeSeries[date]["1. open"]),
        high: parseFloat(timeSeries[date]["2. high"]),
        low: parseFloat(timeSeries[date]["3. low"]),
        close: parseFloat(timeSeries[date]["4. close"]),
        volume: parseInt(timeSeries[date]["5. volume"]),
      }));
  } catch (error) {
    console.error("Error fetching history from Alpha Vantage:", error);
    return getMockHistory(symbol, range);
  }
};

export const getCompanyOverview = async (symbol: string): Promise<CompanyOverview> => {
  try {
    const params = new URLSearchParams({
      function: "OVERVIEW",
      symbol: symbol.toUpperCase(),
      apikey: API_KEY,
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
      console.warn(
        `Alpha Vantage API error: ${response.status}, using mock data`
      );
      return getMockOverview(symbol);
    }

    const data = await response.json();

    if (data["Note"] || data["Error Message"]) {
      console.warn("Alpha Vantage API error, using mock data");
      return getMockOverview(symbol);
    }

    return {
      name: data["Name"] || symbol,
      symbol: data["Symbol"] || symbol,
      sector: data["Sector"] || "Technology",
      industry: data["Industry"] || "Software",
      marketCap: data["MarketCapitalization"] || "N/A",
      peRatio: data["PERatio"] || "N/A",
      high52week: parseFloat(data["52WeekHigh"]) || 0,
      low52week: parseFloat(data["52WeekLow"]) || 0,
      description: data["Description"] || "No description available",
      employees: data["FullTimeEmployees"] || "N/A",
    };
  } catch (error) {
    console.error("Error fetching overview from Alpha Vantage:", error);
    return getMockOverview(symbol);
  }
};

// Test API connection
export const testAlphaVantageConnection = async (): Promise<boolean> => {
  try {
    const quote = await getStockQuote("AAPL");
    return quote.price > 0;
  } catch {
    return false;
  }
};
