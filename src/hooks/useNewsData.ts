import { useState, useEffect } from "react";
import { getCompanyNews, getMarketNews } from "@/lib/api/newsapi";

interface NewsData {
  articles: any[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useCompanyNews = (companyName: string | null) => {
  const [data, setData] = useState<NewsData>({
    articles: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    if (!companyName) {
      setData((prev) => ({ ...prev, loading: false }));
      return;
    }

    const fetchNews = async () => {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const articles = await getCompanyNews(companyName);
        setData({
          articles,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error("Error fetching news:", error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch news. Using cached data.",
        }));
      }
    };

    fetchNews();
  }, [companyName]);

  return data;
};

export const useMarketNewsFeed = () => {
  const [data, setData] = useState<NewsData>({
    articles: [],
    loading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    const fetchNews = async () => {
      setData((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const articles = await getMarketNews();
        setData({
          articles,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      } catch (error) {
        console.error("Error fetching market news:", error);
        setData((prev) => ({
          ...prev,
          loading: false,
          error: "Failed to fetch market news. Using cached data.",
        }));
      }
    };

    fetchNews();
  }, []);

  return data;
};
