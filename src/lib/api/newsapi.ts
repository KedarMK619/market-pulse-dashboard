// Educational project - NewsAPI integration
// API Documentation: https://newsapi.org/

import { newsItems } from "@/lib/mock/mockData";

const API_KEY = import.meta.env.VITE_NEWS_API_KEY || "";
const BASE_URL = "https://newsapi.org/v2";

interface NewsArticle {
  headline: string;
  source: string;
  time: string;
  url: string;
  summary: string;
  sentiment: "positive" | "negative" | "neutral";
  imageUrl?: string;
  publishedAt?: string;
}

const positiveKeywords = ["surge", "gain", "profit", "growth", "rise", "up", "high", "beat", "strong", "positive", "bullish", "success", "boost", "soars", "rallies"];
const negativeKeywords = ["fall", "drop", "loss", "decline", "down", "low", "miss", "weak", "negative", "bearish", "crash", "plunge", "collapse", "tumbles"];

export const detectSentiment = (text: string): "positive" | "negative" | "neutral" => {
  const lowerText = text.toLowerCase();
  
  const hasPositive = positiveKeywords.some(word => lowerText.includes(word));
  const hasNegative = negativeKeywords.some(word => lowerText.includes(word));
  
  if (hasPositive && !hasNegative) return "positive";
  if (hasNegative && !hasPositive) return "negative";
  return "neutral";
};

const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
};

const formatArticles = (articles: any[]): NewsArticle[] => {
  return articles.slice(0, 15).map(article => ({
    headline: article.title || "No title",
    source: article.source?.name || "Unknown Source",
    time: timeAgo(article.publishedAt),
    url: article.url,
    summary: article.description || "No description available",
    sentiment: detectSentiment(article.title + " " + (article.description || "")),
    imageUrl: article.urlToImage,
    publishedAt: article.publishedAt,
  }));
};

const getMockNews = (): NewsArticle[] => {
  return newsItems.slice(0, 15).map(item => ({
    headline: item.headline,
    source: item.source,
    time: item.time,
    url: "#",
    summary: item.summary,
    sentiment: item.sentiment as "positive" | "negative" | "neutral",
    imageUrl: "imageUrl" in item && typeof item.imageUrl === "string" ? item.imageUrl : undefined,
  }));
};

const getMockCompanyNews = (companyName: string): NewsArticle[] => {
  return [
    {
      headline: `${companyName} Reports Strong Q4 Earnings`,
      source: "Financial Times",
      time: "2h ago",
      url: "#",
      summary: `${companyName} exceeded analyst expectations with strong quarterly results.`,
      sentiment: "positive",
    },
    {
      headline: `${companyName} Announces New Product Launch`,
      source: "Reuters",
      time: "4h ago",
      url: "#",
      summary: `The company unveiled its latest innovation to compete in the market.`,
      sentiment: "positive",
    },
    {
      headline: `Sector Analysis: How ${companyName} Compares`,
      source: "MarketWatch",
      time: "1d ago",
      url: "#",
      summary: `In-depth comparison of ${companyName} against industry competitors.`,
      sentiment: "neutral",
    },
  ];
};

export const getCompanyNews = async (companyName: string): Promise<NewsArticle[]> => {
  try {
    const params = new URLSearchParams({
      q: companyName,
      sortBy: "publishedAt",
      pageSize: "15",
      apiKey: API_KEY,
    });

    const response = await fetch(`${BASE_URL}/everything?${params.toString()}`);

    if (!response.ok) {
      console.warn(`NewsAPI error: ${response.status}, using mock data`);
      return getMockCompanyNews(companyName);
    }

    const data = await response.json();

    if (data.status !== "ok" || !data.articles) {
      console.warn("Invalid NewsAPI response, using mock data");
      return getMockCompanyNews(companyName);
    }

    return formatArticles(data.articles);
  } catch (error) {
    console.error("Error fetching news from NewsAPI:", error);
    return getMockCompanyNews(companyName);
  }
};

export const getMarketNews = async (): Promise<NewsArticle[]> => {
  try {
    const params = new URLSearchParams({
      category: "business",
      pageSize: "15",
      apiKey: API_KEY,
      language: "en",
      sortBy: "publishedAt",
      country: "us",
    });

    const response = await fetch(`${BASE_URL}/top-headlines?${params.toString()}`);

    if (!response.ok) {
      console.warn(`NewsAPI error: ${response.status}, using mock data`);
      return getMockNews();
    }

    const data = await response.json();

    if (data.status !== "ok" || !data.articles) {
      console.warn("Invalid NewsAPI response, using mock data");
      return getMockNews();
    }

    return formatArticles(data.articles);
  } catch (error) {
    console.error("Error fetching market news from NewsAPI:", error);
    return getMockNews();
  }
};

// Test API connection
export const testNewsAPIConnection = async (): Promise<boolean> => {
  try {
    const news = await getMarketNews();
    return news.length > 0;
  } catch {
    return false;
  }
};
