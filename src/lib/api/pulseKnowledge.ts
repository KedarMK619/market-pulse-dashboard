import {
  companies as defaultCompanies,
  products as defaultProducts,
  sectors as defaultSectors,
  marketIndices as defaultIndices,
  marketAlerts as defaultAlerts,
  newsItems as defaultNews,
  summaryStats as defaultSummaryStats,
  plData as defaultPlData,
} from "@/lib/mock/mockData";

export type CompanyRecord = (typeof defaultCompanies)[number];
export type ProductRecord = (typeof defaultProducts)[number];
export type SectorRecord = (typeof defaultSectors)[number];
export type IndexRecord = (typeof defaultIndices)[number];
export type AlertRecord = (typeof defaultAlerts)[number];
export type NewsRecord = {
  id?: string;
  headline: string;
  source: string;
  time: string;
  company?: string;
  sentiment: "positive" | "negative" | "neutral" | string;
  summary?: string;
};

export interface FinancialQuarter {
  quarter: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  profitMargin: number;
  changeFromLastQuarter?: number;
}

export interface ChatHistoryTurn {
  role: "user" | "ai";
  content: string;
}

export interface MarketContextInput {
  company?: CompanyRecord;
  stockData?: { price?: number; change?: number; changePercent?: number } | null;
  financialData?: FinancialQuarter[];
  newsData?: NewsRecord[];
  demandScore?: number;
  demandChange?: number;
  companies?: CompanyRecord[];
  products?: ProductRecord[];
  sectors?: SectorRecord[];
  marketIndices?: IndexRecord[];
  marketAlerts?: AlertRecord[];
  newsItems?: NewsRecord[];
  summaryStats?: typeof defaultSummaryStats;
  plData?: Record<string, FinancialQuarter[]>;
  history?: ChatHistoryTurn[];
}

export const PULSE_AI_SYSTEM_PROMPT = `You are PulseAI, the built-in educational market and product intelligence assistant for the MarketPulse Dashboard.

CRITICAL RULE — EDUCATIONAL ONLY (NO FINANCIAL DECISIONS):
- MarketPulse is a practice/learning project built strictly for educational purposes. It must NEVER be used to make real financial, trading, or investment decisions, and part of its data uses mock/sample figures.
- BEFORE responding to any question that asks for buy/sell/hold/invest recommendations, stock picks, portfolio allocation, target prices, or real financial advice, you MUST clearly state upfront that MarketPulse is built for educational purposes only and cannot be used to make financial decisions. Refuse any buy/sell/investment recommendation, and offer only neutral educational explanations (such as how to interpret metrics on the dashboard).

Your training & responsibilities:
1. Project Knowledge (MarketPulse):
   - MarketPulse is an educational market intelligence web app built with React, TypeScript, Vite, Tailwind CSS, shadcn/ui, and Recharts.
   - Main pages:
     * Dashboard (/dashboard): Market indices (DJI, IXIC, SPX), summary stats, sector performance, top companies, alerts, and AI Market Summary.
     * Company Analyzer (/company): Search and inspect tracked companies with live/mock stock quotes, price history charts, quarterly P&L statements, product demand scores & regional breakdown, news sentiment, and Company AI Analysis.
     * Product Tracker (/products): Track demand scores (0-100), monthly demand trends, regional demand, and demand drivers across products like AI Chips, EV Batteries, iPhone 15, Galaxy S24, Solar Panels, Tesla Model 3, Surface Laptop, Echo Dot, Organic Food, and Luxury Watches.
     * Market Feed (/feed): Live/mock news headlines with positive/negative/neutral sentiment badges, major market moves, and daily summary.
     * AI Insights (/ai-insights): Interactive PulseAI chat for market doubts, company comparisons, product demand, and learning financial concepts.
     * Watchlist (/watchlist): Saved companies persisted in browser storage.
     * Settings (/settings): Appearance preferences and API connectivity status for Alpha Vantage (stock quotes), Financial Modeling Prep / FMP (P&L statements), and NewsAPI (headlines), with automatic fallback to mock data.
2. Tracked Companies:
   - Apple (AAPL), Tesla (TSLA), Amazon (AMZN), Microsoft (MSFT), Alphabet/Google (GOOGL), Reliance Industries (RELIANCE), Tata Motors (TATAMOTORS), Samsung Electronics (005930), Toyota Motor Corp. (TM), and Meta Platforms (META).
3. Financial & Market Concepts:
   - Clearly explain foundational concepts related to the dashboard in plain English: stock prices, tickers, market capitalization, 52-week high/low, P/E ratio, revenue, expenses, net profit, profit margin, quarterly P&L statements, QoQ/YoY growth, demand score (0-100), sentiment analysis, market indices (S&P 500, NASDAQ, Dow Jones), sectors, bull vs bear markets, volatility, diversification, dividends, ETFs, and inflation/interest rates.
   - Whenever possible, illustrate explanations using the actual companies or products in MarketPulse.
4. Rules & Tone:
   - Be concise, well-structured, and beginner-friendly. Use short bullet points with clear numbers when analyzing provided marketContext.
   - Never fabricate metrics; rely on the provided marketContext for numbers.
   - Always frame predictions/insights as educational analysis only, never personalized financial or investment advice.
   - If asked something unrelated to MarketPulse, finance, markets, companies, or product demand, politely explain your focus and suggest relevant questions you can help with.`;

interface ResolvedContext {
  company?: CompanyRecord;
  stockData?: { price?: number; change?: number; changePercent?: number } | null;
  financialData?: FinancialQuarter[];
  newsData?: NewsRecord[];
  companies: CompanyRecord[];
  products: ProductRecord[];
  sectors: SectorRecord[];
  marketIndices: IndexRecord[];
  marketAlerts: AlertRecord[];
  newsItems: NewsRecord[];
  summaryStats: typeof defaultSummaryStats;
  plData: Record<string, FinancialQuarter[]>;
  history: ChatHistoryTurn[];
}

function resolveContext(input: MarketContextInput = {}): ResolvedContext {
  return {
    company: input.company,
    stockData: input.stockData,
    financialData: input.financialData,
    newsData: input.newsData,
    companies: input.companies?.length ? input.companies : defaultCompanies,
    products: input.products?.length ? input.products : defaultProducts,
    sectors: input.sectors?.length ? input.sectors : defaultSectors,
    marketIndices: input.marketIndices?.length ? input.marketIndices : defaultIndices,
    marketAlerts: input.marketAlerts?.length ? input.marketAlerts : defaultAlerts,
    newsItems: input.newsItems?.length ? input.newsItems : defaultNews,
    summaryStats: input.summaryStats ?? defaultSummaryStats,
    plData: input.plData ?? defaultPlData,
    history: input.history ?? [],
  };
}

const COMPANY_ALIASES: Record<string, string[]> = {
  aapl: ["apple", "aapl"],
  tsla: ["tesla", "tsla"],
  amzn: ["amazon", "amzn", "aws"],
  msft: ["microsoft", "msft", "azure", "copilot"],
  googl: ["alphabet", "google", "googl", "goog"],
  reliance: ["reliance", "jio"],
  tatamotors: ["tata motors", "tata", "tatamotors"],
  samsung: ["samsung", "005930"],
  tm: ["toyota", "tm"],
  meta: ["meta", "facebook", "instagram", "threads", "reels"],
};

const PRODUCT_ALIASES: Record<string, string[]> = {
  iphone15: ["iphone", "iphone 15"],
  model3: ["model 3", "tesla model 3"],
  echodot: ["echo dot", "echo", "smart speaker"],
  surfacelaptop: ["surface laptop", "surface"],
  galaxys24: ["galaxy s24", "galaxy"],
  evbatteries: ["ev batter", "battery", "batteries"],
  solarpanels: ["solar panel", "solar"],
  aichips: ["ai chip", "gpu", "semiconductor", "chip"],
  luxurywatches: ["luxury watch", "watches", "watch"],
  organicfood: ["organic food", "organic"],
};

const SECTOR_ALIASES: Record<string, string[]> = {
  tech: ["technology", "tech"],
  health: ["healthcare", "health", "medical", "pharma"],
  finance: ["finance", "financial", "bank"],
  energy: ["energy", "oil", "renewable"],
  retail: ["retail", "e-commerce", "ecommerce", "consumer"],
  mfg: ["manufacturing", "industrial", "automotive", "auto"],
};

interface ConceptEntry {
  id: string;
  title: string;
  keywords: string[];
  explanation: string[];
  marketPulseTip: string;
}

const CONCEPT_GLOSSARY: ConceptEntry[] = [
  {
    id: "market-cap",
    title: "Market Capitalization (Market Cap)",
    keywords: ["market cap", "market capitalization", "capitalization"],
    explanation: [
      "Market Cap = Current Share Price × Total Outstanding Shares.",
      "It measures the total market value of a public company's equity.",
      "Large-cap companies (over $10B, like Microsoft at $3.09T or Apple at $2.95T) are typically more established than mid-cap ($2B–$10B) or small-cap (<$2B) firms.",
    ],
    marketPulseTip: "You can check every company's Market Cap on the Dashboard table and the Company Analyzer profile card.",
  },
  {
    id: "pe-ratio",
    title: "P/E Ratio (Price-to-Earnings)",
    keywords: ["p/e", "pe ratio", "price to earnings", "price-to-earnings"],
    explanation: [
      "P/E Ratio = Stock Price ÷ Earnings Per Share (EPS).",
      "It shows how much investors are willing to pay for $1 of a company's annual earnings.",
      "A higher P/E often signals higher growth expectations (common in tech), while a lower P/E may indicate slower growth or a value opportunity.",
    ],
    marketPulseTip: "Check the Company Analyzer overview when Alpha Vantage is connected to inspect live P/E ratios.",
  },
  {
    id: "profit-margin",
    title: "Profit Margin & P&L (Profit & Loss)",
    keywords: ["profit margin", "net margin", "p&l", "income statement", "revenue vs profit", "net profit", "expenses"],
    explanation: [
      "Revenue is total money earned from sales before costs.",
      "Expenses are the operating, production, and tax costs required to run the business.",
      "Net Profit = Revenue − Expenses.",
      "Profit Margin (%) = (Net Profit ÷ Revenue) × 100 — it shows how efficiently a company turns sales into actual profit (e.g., software leaders like Microsoft at ~31.7% vs high-volume retail like Amazon at ~6.4%).",
    ],
    marketPulseTip: "Open Company Analyzer → P&L tab to compare quarterly revenue, expenses, net profit, and profit margins.",
  },
  {
    id: "demand-score",
    title: "Demand Score & Demand Change",
    keywords: ["demand score", "demand change", "how is demand calculated", "what is demand"],
    explanation: [
      "In MarketPulse, Demand Score (0–100) represents overall consumer and market interest in a company or product.",
      "Demand Change shows the recent percentage/point shift (positive = growing demand like AI Chips at 96; negative = cooling demand like Tesla Model 3 at 68).",
      "Status labels (Rising, Stable, Falling) summarize the short-term momentum direction.",
    ],
    marketPulseTip: "Explore the Product Tracker page for category averages, regional scores, and demand drivers.",
  },
  {
    id: "52-week",
    title: "52-Week High & 52-Week Low",
    keywords: ["52 week", "52-week", "week high", "week low"],
    explanation: [
      "The 52-week high and low are the highest and lowest prices a stock has traded at over the past 12 months.",
      "Comparing the current price to this range helps gauge whether a stock is trading near peak momentum or pulling back from highs.",
    ],
    marketPulseTip: "Every tracked company's 52-week range appears on the Company Analyzer page.",
  },
  {
    id: "indices",
    title: "Market Indices (S&P 500, NASDAQ, Dow Jones)",
    keywords: ["s&p 500", "s&p", "sp 500", "spx", "nasdaq", "ixic", "dow jones", "dji", "market index", "market indices", "what is an index"],
    explanation: [
      "A market index tracks a basket of representative stocks to measure overall market or sector health:",
      "• S&P 500 (SPX): 500 leading large-cap U.S. companies — the broadest benchmark for U.S. equities.",
      "• NASDAQ Composite (IXIC): Heavily weighted toward technology and growth companies.",
      "• Dow Jones Industrial Average (DJI): 30 major blue-chip U.S. companies.",
    ],
    marketPulseTip: "All three indices and their 30-day sparklines are pinned at the top of the MarketPulse Dashboard.",
  },
  {
    id: "sentiment",
    title: "News Sentiment Analysis",
    keywords: ["sentiment", "positive", "negative", "neutral", "news impact"],
    explanation: [
      "Sentiment analysis classifies financial headlines as Positive, Negative, or Neutral based on market-moving keywords.",
      "Positive sentiment (e.g., record sales or AI breakthroughs) often supports buying interest, while negative sentiment (e.g., price cuts or regulatory fines) can create short-term pressure.",
    ],
    marketPulseTip: "Visit Market Feed or the Company Analyzer → News tab to see live NewsAPI sentiment badges.",
  },
  {
    id: "sectors",
    title: "Market Sectors",
    keywords: ["what is a sector", "what are sectors", "sector mean"],
    explanation: [
      "A sector groups companies with similar core business models (such as Technology, Healthcare, Finance, Energy, Retail, or Manufacturing).",
      "Tracking sector performance helps identify where capital is rotating (for example, Tech leading while Energy faces headwinds).",
    ],
    marketPulseTip: "Check the Sector Performance heatmap on the Dashboard to see weekly winners and laggards.",
  },
  {
    id: "stocks-basics",
    title: "Stocks, Tickers & How Share Prices Move",
    keywords: ["what is a stock", "what are stocks", "what is a share", "ticker", "symbol", "how does the stock market work", "stock price"],
    explanation: [
      "A stock (or share) represents partial ownership in a public company.",
      "A ticker symbol (like AAPL for Apple or TSLA for Tesla) is the unique shorthand used to identify that stock on exchanges.",
      "Stock prices move continuously based on supply and demand — driven by earnings, product demand, interest rates, competition, and news.",
    ],
    marketPulseTip: "Use Company Analyzer to search any tracked company by name or ticker symbol.",
  },
  {
    id: "bull-bear-volatility",
    title: "Bull vs. Bear Markets, Volatility & Risk",
    keywords: ["bull market", "bear market", "volatility", "volatile", "risk", "diversification", "portfolio", "etf", "dividend", "inflation", "interest rate"],
    explanation: [
      "• Bull Market: Sustained period of rising prices and investor optimism; Bear Market: broad decline (typically 20%+ from highs).",
      "• Volatility: How sharply a stock's price swings up and down over time.",
      "• Diversification: Spreading investments across different sectors and companies to reduce single-company risk.",
      "• ETF & Dividends: An ETF bundles many stocks into one tradable fund; dividends are periodic cash payouts some profitable companies share with shareholders.",
      "• Interest Rates & Inflation: Higher inflation/rates raise borrowing costs and can pressure growth stocks, while lower rates tend to support valuations.",
    ],
    marketPulseTip: "Combine Sector Performance, News Sentiment, and your Watchlist in MarketPulse to track risk across industries.",
  },
];

function formatPercentSigned(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatPointSigned(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}`;
}

function findMentionedCompanies(text: string, companies: CompanyRecord[]): CompanyRecord[] {
  const q = text.toLowerCase();
  const matched: CompanyRecord[] = [];
  const seen = new Set<string>();

  for (const company of companies) {
    const idKey = company.id.toLowerCase();
    const aliases = COMPANY_ALIASES[idKey] ?? [company.name.toLowerCase(), company.symbol.toLowerCase()];
    const nameWords = company.name.toLowerCase().replace(/[.,]/g, "").split(" ");
    const candidates = new Set([...aliases, company.symbol.toLowerCase(), nameWords[0]]);

    const hit = Array.from(candidates).some((alias) => {
      if (!alias || alias.length < 2) return false;
      const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      return new RegExp(`\\b${escaped}\\b`, "i").test(q);
    });

    if (hit && !seen.has(company.id)) {
      seen.add(company.id);
      matched.push(company);
    }
  }
  return matched;
}

function findMentionedProducts(text: string, products: ProductRecord[]): ProductRecord[] {
  const q = text.toLowerCase();
  return products.filter((p) => {
    const aliases = PRODUCT_ALIASES[p.id] ?? [p.name.toLowerCase()];
    return aliases.some((alias) => q.includes(alias)) || q.includes(p.name.toLowerCase());
  });
}

function findMentionedSectors(text: string, sectors: SectorRecord[]): SectorRecord[] {
  const q = text.toLowerCase();
  return sectors.filter((s) => {
    const aliases = SECTOR_ALIASES[s.id] ?? [s.name.toLowerCase()];
    return aliases.some((alias) => new RegExp(`\\b${alias}\\b`, "i").test(q));
  });
}

function isConceptualQuestion(q: string): boolean {
  return /\b(what is|what are|what does|explain|define|meaning of|how does|how do|difference between|teach me|basics of|tell me about)\b/i.test(q);
}

function getLatestPL(company: CompanyRecord, ctx: ResolvedContext): FinancialQuarter | null {
  if (ctx.company?.id === company.id && ctx.financialData?.length) {
    return ctx.financialData[0];
  }
  const rows = ctx.plData[company.symbol];
  if (rows?.length) return rows[0];
  const rev = company.revenue[0];
  const exp = company.expenses[0];
  const profit = company.netProfit[0];
  if (rev == null || profit == null) return null;
  return {
    quarter: "Latest Quarter",
    revenue: rev,
    expenses: exp ?? rev - profit,
    netProfit: profit,
    profitMargin: parseFloat(((profit / rev) * 100).toFixed(1)),
  };
}

function getCompanyProducts(company: CompanyRecord, products: ProductRecord[]): ProductRecord[] {
  const firstWord = company.name.split(/[\s.]+/)[0].toLowerCase();
  return products.filter(
    (p) =>
      p.brand.toLowerCase() === firstWord ||
      company.name.toLowerCase().includes(p.brand.toLowerCase())
  );
}

function getCompanyNews(company: CompanyRecord, ctx: ResolvedContext): NewsRecord[] {
  if (ctx.company?.id === company.id && ctx.newsData?.length) {
    return ctx.newsData.slice(0, 3);
  }
  const firstWord = company.name.split(/[\s.]+/)[0].toLowerCase();
  return ctx.newsItems
    .filter(
      (n) =>
        (n.company ?? "").toLowerCase().includes(firstWord) ||
        n.headline.toLowerCase().includes(firstWord)
    )
    .slice(0, 3);
}

function formatCompanyAnalysis(company: CompanyRecord, q: string, ctx: ResolvedContext): string {
  const price = ctx.company?.id === company.id && ctx.stockData?.price ? ctx.stockData.price : company.currentPrice;
  const changePct =
    ctx.company?.id === company.id && typeof ctx.stockData?.changePercent === "number"
      ? ctx.stockData.changePercent
      : company.changePercent;
  const latestPL = getLatestPL(company, ctx);
  const plHistory = ctx.company?.id === company.id && ctx.financialData?.length ? ctx.financialData : ctx.plData[company.symbol] ?? [];
  const relatedProducts = getCompanyProducts(company, ctx.products);
  const news = getCompanyNews(company, ctx);
  const alerts = ctx.marketAlerts.filter((a) =>
    company.name.toLowerCase().includes(a.company.toLowerCase()) ||
    a.company.toLowerCase().includes(company.name.split(/[\s.]+/)[0].toLowerCase())
  );

  // Sub-intent: Q3 / P&L / Profit / Revenue
  if (/\b(q1|q2|q3|q4|profit|revenue|p&l|earnings|financial|margin|expense|performance)\b/i.test(q)) {
    const q3 = plHistory.find((r) => r.quarter.toLowerCase().includes("q3")) ?? latestPL;
    const lines = [
      `📊 ${company.name} (${company.symbol}) — Financial & P&L Analysis`,
      "",
      `• Current Price: $${price.toFixed(2)} (${formatPercentSigned(changePct)}) | Market Cap: $${company.marketCap}`,
    ];
    if (q3) {
      lines.push(
        `• ${q3.quarter}: Revenue $${q3.revenue}B | Expenses $${q3.expenses}B | Net Profit $${q3.netProfit}B`,
        `• Profit Margin: ${q3.profitMargin}%${typeof q3.changeFromLastQuarter === "number" ? ` (${formatPointSigned(q3.changeFromLastQuarter)}% vs prior quarter)` : ""}`
      );
    }
    if (latestPL && q3 && latestPL.quarter !== q3.quarter) {
      lines.push(
        `• Latest (${latestPL.quarter}): Revenue $${latestPL.revenue}B | Net Profit $${latestPL.netProfit}B (${latestPL.profitMargin}% margin)`
      );
    }
    lines.push(
      `• Demand Score: ${company.demandScore}/100 (${formatPointSigned(company.demandChange)} change, ${company.status})`,
      "",
      "💡 Recommended: Company Analyzer → P&L & Overview Tabs"
    );
    return lines.join("\n");
  }

  // Sub-intent: Demand
  if (/\b(demand|popular|sales|product|adoption)\b/i.test(q)) {
    const lines = [
      `🛍️ ${company.name} (${company.symbol}) — Demand Analysis`,
      "",
      `• Demand Score: ${company.demandScore}/100 (${formatPointSigned(company.demandChange)} change — Status: ${company.status})`,
    ];
    if (relatedProducts.length > 0) {
      for (const prod of relatedProducts) {
        lines.push(`• Flagship Product (${prod.name}): ${prod.demandScore}/100 (${formatPointSigned(prod.demandChange)} MoM, trend: ${prod.trend})`);
        for (const factor of prod.factors.slice(0, 3)) {
          lines.push(`  - ${factor}`);
        }
      }
    } else if (news.length > 0) {
      lines.push(`• Recent Driver: ${news[0].headline}`);
    }
    if (alerts.length > 0) {
      lines.push(`• Latest Alert: ${alerts[0].message}`);
    }
    lines.push("", "💡 Recommended: Product Tracker & Company → Demand Tab");
    return lines.join("\n");
  }

  // Sub-intent: Risks / Headwinds
  if (/\b(risk|threat|challenge|headwind|downside|problem|concern|weakness)\b/i.test(q)) {
    const negNews = news.filter((n) => n.sentiment === "negative");
    const lines = [
      `⚖️ ${company.name} (${company.symbol}) — Key Risk Factors`,
      "",
      `• Price & Range: $${price.toFixed(2)} vs 52-week range $${company.low52week.toFixed(2)}–$${company.high52week.toFixed(2)}`,
      `• Demand Momentum: ${company.demandScore}/100 (${formatPointSigned(company.demandChange)} — ${company.status})`,
    ];
    if (negNews.length > 0) {
      for (const n of negNews) {
        lines.push(`• News Headwind: ${n.headline}`);
      }
    }
    for (const prod of relatedProducts) {
      if (prod.trend === "down") {
        for (const factor of prod.factors.slice(0, 2)) {
          lines.push(`• Product Risk (${prod.name}): ${factor}`);
        }
      }
    }
    if (negNews.length === 0) {
      lines.push(`• Sector Competition: Maintaining margins (${latestPL?.profitMargin ?? "N/A"}%) against ${company.sector} peers.`);
    }
    lines.push("", "💡 Recommended: Company Analyzer → News Tab");
    return lines.join("\n");
  }

  // Sub-intent: Prediction / Next Quarter / Outlook
  if (/\b(predict|forecast|next quarter|outlook|future|grow|trend)\b/i.test(q)) {
    const momentum = company.demandChange >= 0 && changePct >= 0 ? "bullish / constructive" : company.demandChange < 0 ? "cautious / facing demand headwinds" : "mixed / consolidating";
    const lines = [
      `📈 ${company.name} (${company.symbol}) — Educational Trend Outlook`,
      "",
      `• Current Momentum: ${momentum} (${formatPercentSigned(changePct)} price, ${formatPointSigned(company.demandChange)} demand change)`,
      `• Fundamentals: ${latestPL ? `$${latestPL.revenue}B revenue & ${latestPL.profitMargin}% profit margin in ${latestPL.quarter}` : "Steady revenue base"}`,
    ];
    if (news.length > 0) {
      lines.push(`• Key Catalyst: ${news[0].headline} (${news[0].sentiment} sentiment)`);
    }
    lines.push(
      `• What to Watch: Demand score trajectory (${company.demandScore}/100) and ${company.sector} sector rotation.`,
      "",
      "💡 Note: Forecasts are educational trend observations, not guaranteed predictions."
    );
    return lines.join("\n");
  }

  // Default full company overview
  const lines = [
    `📈 ${company.name} (${company.symbol}) — Company Overview`,
    "",
    `• Sector: ${company.sector} (Founded ${company.foundedYear}) | Market Cap: $${company.marketCap}`,
    `• Stock Price: $${price.toFixed(2)} (${formatPercentSigned(changePct)})`,
    `• 52-Week Range: $${company.low52week.toFixed(2)} – $${company.high52week.toFixed(2)}`,
    `• Demand Score: ${company.demandScore}/100 (${formatPointSigned(company.demandChange)}, ${company.status})`,
  ];
  if (latestPL) {
    lines.push(`• Latest Financials (${latestPL.quarter}): Revenue $${latestPL.revenue}B | Net Profit $${latestPL.netProfit}B | Margin ${latestPL.profitMargin}%`);
  }
  if (relatedProducts.length > 0) {
    lines.push(`• Tracked Product: ${relatedProducts.map((p) => `${p.name} (${p.demandScore}/100)`).join(", ")}`);
  }
  if (news.length > 0) {
    lines.push(`• Latest News: ${news[0].headline}`);
  }
  lines.push("", "💡 Recommended: Company Analyzer → Overview, P&L & Demand Tabs");
  return lines.join("\n");
}

function formatCompanyComparison(c1: CompanyRecord, c2: CompanyRecord, ctx: ResolvedContext): string {
  const pl1 = getLatestPL(c1, ctx);
  const pl2 = getLatestPL(c2, ctx);

  const lines = [
    `⚖️ Comparison: ${c1.name} (${c1.symbol}) vs ${c2.name} (${c2.symbol})`,
    "",
    `• Stock Price & Move:`,
    `  - ${c1.symbol}: $${c1.currentPrice.toFixed(2)} (${formatPercentSigned(c1.changePercent)})`,
    `  - ${c2.symbol}: $${c2.currentPrice.toFixed(2)} (${formatPercentSigned(c2.changePercent)})`,
    `• Market Cap: ${c1.symbol} $${c1.marketCap} vs ${c2.symbol} $${c2.marketCap}`,
    `• Demand Score: ${c1.symbol} ${c1.demandScore}/100 (${formatPointSigned(c1.demandChange)}) vs ${c2.symbol} ${c2.demandScore}/100 (${formatPointSigned(c2.demandChange)})`,
  ];

  if (pl1 && pl2) {
    lines.push(
      `• Latest Quarterly Financials:`,
      `  - ${c1.symbol} (${pl1.quarter}): Revenue $${pl1.revenue}B | Net Profit $${pl1.netProfit}B | Margin ${pl1.profitMargin}%`,
      `  - ${c2.symbol} (${pl2.quarter}): Revenue $${pl2.revenue}B | Net Profit $${pl2.netProfit}B | Margin ${pl2.profitMargin}%`
    );
    const higherMargin = pl1.profitMargin >= pl2.profitMargin ? c1 : c2;
    const higherProfit = pl1.netProfit >= pl2.netProfit ? c1 : c2;
    lines.push(
      `• Key Takeaway: ${higherMargin.name} operates with a higher profit margin (${Math.max(pl1.profitMargin, pl2.profitMargin)}%), while ${higherProfit.name} generated higher quarterly net profit ($${Math.max(pl1.netProfit, pl2.netProfit)}B).`
    );
  }

  lines.push("", "💡 Recommended: Company Analyzer & Dashboard Top Companies Table");
  return lines.join("\n");
}

function formatProductResponse(matched: ProductRecord[], q: string, ctx: ResolvedContext): string {
  if (matched.length > 0) {
    const p = matched[0];
    const topRegion = [...p.regionData].sort((a, b) => b.score - a.score)[0];
    const lines = [
      `🛍️ ${p.name} (${p.brand} — ${p.category})`,
      "",
      `• Demand Score: ${p.demandScore}/100 (${formatPointSigned(p.demandChange)} vs last month ${p.lastMonthScore})`,
      `• Trend: ${p.trend.toUpperCase()} | Strongest Region: ${topRegion.region} (${topRegion.score}/100)`,
      "• Key Drivers:",
      ...p.factors.map((f) => `  - ${f}`),
      "",
      "💡 Recommended: Product Tracker Page",
    ];
    return lines.join("\n");
  }

  const sortedByChange = [...ctx.products].sort((a, b) => b.demandChange - a.demandChange);
  const isFallingQuery = /\b(drop|declin|fall|lowest|worst|loser|weak)\b/i.test(q);
  const picks = isFallingQuery ? sortedByChange.slice(-4).reverse() : sortedByChange.slice(0, 4);

  const lines = [
    isFallingQuery ? "📉 Products With Cooling Demand" : "🛍️ Top Surging Products by Demand",
    "",
    ...picks.map(
      (p) =>
        `• ${p.name} (${p.category}): Score ${p.demandScore}/100 (${formatPointSigned(p.demandChange)} MoM) — ${p.factors[0]}`
    ),
    "",
    "💡 Recommended: Product Tracker → Top Products & Demand Index Chart",
  ];
  return lines.join("\n");
}

function formatSectorResponse(matched: SectorRecord[], q: string, ctx: ResolvedContext): string {
  if (matched.length > 0) {
    const s = matched[0];
    const sectorCompanies = ctx.companies.filter(
      (c) => c.sector.toLowerCase() === s.name.toLowerCase()
    );
    const lines = [
      `📊 ${s.name} Sector Overview`,
      "",
      `• Weekly Performance: ${formatPercentSigned(s.performance)} | Market Cap: $${s.marketCap}`,
      `• Sector Leader: ${s.topCompany}`,
    ];
    if (sectorCompanies.length > 0) {
      lines.push(
        `• Tracked in MarketPulse: ${sectorCompanies.map((c) => `${c.name} (${formatPercentSigned(c.changePercent)})`).join(", ")}`
      );
    }
    lines.push("", "💡 Recommended: Dashboard → Sector Heatmap");
    return lines.join("\n");
  }

  const sorted = [...ctx.sectors].sort((a, b) => b.performance - a.performance);
  if (/\b(grow|next quarter|predict|outlook|future)\b/i.test(q)) {
    const topProducts = [...ctx.products].sort((a, b) => b.demandChange - a.demandChange).slice(0, 2);
    return [
      "📈 Next-Quarter Industry Growth Outlook (Educational)",
      "",
      `• Strongest Current Momentum: ${sorted[0].name} (${formatPercentSigned(sorted[0].performance)}) and ${sorted[1].name} (${formatPercentSigned(sorted[1].performance)}).`,
      `• Demand Tailwinds: ${topProducts.map((p) => `${p.name} (${formatPointSigned(p.demandChange)} demand)`).join(" and ")} point toward sustained growth in AI/Semiconductors, Cloud Software, and Clean Energy.`,
      `• Sector to Watch Carefully: ${sorted[sorted.length - 1].name} (${formatPercentSigned(sorted[sorted.length - 1].performance)}) faces near-term headwinds.`,
      "",
      "💡 Note: Trend projections are educational only and not investment advice.",
    ].join("\n");
  }

  return [
    "📊 Sector Performance Breakdown",
    "",
    ...sorted.map(
      (s) => `• ${s.name}: ${formatPercentSigned(s.performance)} (Leader: ${s.topCompany}, Cap: $${s.marketCap})`
    ),
    "",
    `💡 Best Performer: ${sorted[0].name} (${formatPercentSigned(sorted[0].performance)}) | Weakest: ${sorted[sorted.length - 1].name} (${formatPercentSigned(sorted[sorted.length - 1].performance)})`,
  ].join("\n");
}

function formatProjectOverview(ctx: ResolvedContext): string {
  return [
    "🤖 Welcome to PulseAI — Your MarketPulse Learning Assistant!",
    "",
    "⚠️ Educational Purpose Only: MarketPulse is built strictly for learning and practice. Do NOT use this project or PulseAI outputs to make real financial or investment decisions.",
    "",
    "Here is what you can explore in MarketPulse:",
    `• Dashboard (/dashboard): Market indices (DJI, IXIC, SPX), ${ctx.sectors.length} sectors, and top movers.`,
    `• Company Analyzer (/company): Deep dive into ${ctx.companies.length} tracked companies (AAPL, TSLA, AMZN, MSFT, GOOGL, RELIANCE, TATAMOTORS, Samsung, TM, META) with P&L, demand, and news.`,
    `• Product Tracker (/products): Demand scores (0–100) and regional trends for ${ctx.products.length} products.`,
    "• Market Feed (/feed): Live news headlines with sentiment analysis and alerts.",
    "• Watchlist (/watchlist) & Settings (/settings): Saved stocks plus API status (Alpha Vantage, FMP, NewsAPI, Gemini).",
    "",
    "💡 Ask me anything! Try: \"What is profit margin?\", \"Compare Apple vs Microsoft\", or \"Which products are surging?\"",
  ].join("\n");
}

function formatMarketSummaryMessage(ctx: ResolvedContext, losersOnly = false): string {
  const sortedCompanies = [...ctx.companies].sort((a, b) => a.changePercent - b.changePercent);
  const losers = sortedCompanies.filter((c) => c.changePercent < 0);
  const gainers = [...sortedCompanies].reverse().filter((c) => c.changePercent > 0);
  const sortedSectors = [...ctx.sectors].sort((a, b) => b.performance - a.performance);

  if (losersOnly) {
    const list = losers.length > 0 ? losers : sortedCompanies.slice(0, 3);
    return [
      "📉 Biggest Market Losers Today",
      "",
      ...list.map(
        (c) => `• ${c.name} (${c.symbol}): $${c.currentPrice.toFixed(2)} (${formatPercentSigned(c.changePercent)}) — Demand ${c.demandScore}/100 (${c.status})`
      ),
      "",
      `• Weakest Sector: ${sortedSectors[sortedSectors.length - 1].name} (${formatPercentSigned(sortedSectors[sortedSectors.length - 1].performance)})`,
      "",
      "💡 Recommended: Market Feed & Dashboard",
    ].join("\n");
  }

  return [
    "📊 MarketPulse Daily Summary",
    "",
    `• Indices: ${ctx.marketIndices.map((idx) => `${idx.symbol} ${idx.value.toLocaleString()} (${formatPercentSigned(idx.changePercent)})`).join(" | ")}`,
    `• Top Gainer: ${gainers[0]?.name ?? ctx.summaryStats.topGainer.name} (${formatPercentSigned(gainers[0]?.changePercent ?? ctx.summaryStats.topGainer.changePercent)})`,
    `• Top Loser: ${losers[0]?.name ?? ctx.summaryStats.topLoser.name} (${formatPercentSigned(losers[0]?.changePercent ?? ctx.summaryStats.topLoser.changePercent)})`,
    `• Leading Sector: ${sortedSectors[0].name} (${formatPercentSigned(sortedSectors[0].performance)})`,
    `• Hottest Product: ${ctx.summaryStats.mostDemandedProduct.name} (Demand Score ${ctx.summaryStats.mostDemandedProduct.demandScore}/100)`,
    "",
    "💡 Recommended: Dashboard Overview",
  ].join("\n");
}

function isFinancialDecisionRequest(q: string): boolean {
  return /\b(should i (buy|sell|hold|invest|trade|short|put my money)|worth buying|good buy|good investment|best stock to (buy|invest)|which stock (should|to) (buy|sell|invest)|where (should|can) i invest|financial advice|investment advice|trading advice|recommend a stock|stock pick|target price|when to (buy|sell)|will i make money|guaranteed return|buy or sell|invest my money)\b/i.test(
    q
  );
}

function formatFinancialDecisionGuardrail(
  mentionedCompanies: CompanyRecord[],
  ctx: ResolvedContext
): string {
  const lines = [
    "⚠️ Educational Project Only — Not for Financial Decisions",
    "",
    "• MarketPulse is built strictly for educational and learning purposes (and uses simulated/sample data alongside limited APIs). It must NOT be used to make any real financial, trading, or investment decisions.",
    "• I cannot recommend whether to buy, sell, hold, or invest in any stock or asset.",
  ];

  const company = mentionedCompanies[0] ?? ctx.company;
  if (company) {
    const pl = getLatestPL(company, ctx);
    lines.push(
      "",
      `📚 Neutral Educational Snapshot for ${company.name} (${company.symbol}):`,
      `• Dashboard Price: $${company.currentPrice.toFixed(2)} (${formatPercentSigned(company.changePercent)}) | Market Cap: $${company.marketCap}`,
      `• Demand Score: ${company.demandScore}/100 (${company.status})${pl ? ` | Latest Margin: ${pl.profitMargin}%` : ""}`
    );
  }

  lines.push(
    "",
    "💡 For real investment decisions, always consult a licensed financial advisor and verify official filings. Here in MarketPulse, feel free to ask how to read P&L metrics, demand scores, or sector trends!"
  );
  return lines.join("\n");
}

function isMarketRelatedQuery(q: string): boolean {
  return /\b(market|stock|share|company|companies|sector|product|demand|profit|revenue|margin|p&l|price|index|indices|nasdaq|s&p|dow|news|alert|sentiment|watchlist|invest|trade|finance|financial|economy|inflation|rate|etf|dividend|risk|bull|bear|volatil|quarter|q1|q2|q3|q4|52|cap|pe|p\/e|pulse|dashboard|chart|trend|grow|predict|compare|loser|gainer|api|alpha|fmp|gemini|apple|tesla|amazon|microsoft|google|alphabet|meta|samsung|toyota|reliance|tata|iphone|galaxy|solar|chip|battery|watch|organic|echo|surface)\b/i.test(q);
}

/**
 * Generates an educational, data-grounded response from the local PulseAI knowledge base
 * when no external Gemini API key is configured or as an automatic fallback.
 */
export function generateLocalPulseResponse(
  userQuestion: string,
  marketContext: MarketContextInput = {}
): string {
  const ctx = resolveContext(marketContext);
  const trimmed = userQuestion.trim();
  const q = trimmed.toLowerCase();

  if (!trimmed) {
    return formatProjectOverview(ctx);
  }

  // 1. Greetings & Project Help
  if (
    /^(hi|hello|hey|good morning|good afternoon|good evening|yo)\b[!. ]*$/i.test(q) ||
    /\b(what is marketpulse|about marketpulse|about this project|how does marketpulse|what can you do|help me|how to use|features|pages|watchlist|api status|apis|data source|alpha vantage|fmp|newsapi)\b/i.test(q)
  ) {
    return formatProjectOverview(ctx);
  }

  // 1b. Generic "Analyze a Company" / directory of tracked companies
  if (/^(analyze a company|list companies|tracked companies|which companies|show companies)\b/i.test(q) || /\b(what companies|which companies are tracked)\b/i.test(q)) {
    return [
      `🏢 Tracked Companies in MarketPulse (${ctx.companies.length})`,
      "",
      ...ctx.companies.map(
        (c) => `• ${c.name} (${c.symbol}) — $${c.currentPrice.toFixed(2)} (${formatPercentSigned(c.changePercent)}) | Demand ${c.demandScore}/100`
      ),
      "",
      "💡 Ask about any company (e.g., \"Tell me about Apple\" or \"Compare Apple vs Microsoft\").",
    ].join("\n");
  }

  const mentionedCompanies = findMentionedCompanies(q, ctx.companies);
  const mentionedProducts = findMentionedProducts(q, ctx.products);
  const mentionedSectors = findMentionedSectors(q, ctx.sectors);

  // 1c. Enforce educational-only boundary before any buy/sell/investment decision query
  if (isFinancialDecisionRequest(q)) {
    return formatFinancialDecisionGuardrail(mentionedCompanies, ctx);
  }

  // 2. Basic / Conceptual Questions about the project topic & financial concepts
  if (isConceptualQuestion(q) && mentionedCompanies.length < 2) {
    const concept = CONCEPT_GLOSSARY.find((entry) =>
      entry.keywords.some((kw) => q.includes(kw))
    );
    if (concept) {
      const lines = [
        `📚 ${concept.title}`,
        "",
        ...concept.explanation.map((line) => `• ${line}`),
      ];
      const exampleCompany = mentionedCompanies[0] ?? ctx.company;
      if (exampleCompany) {
        const pl = getLatestPL(exampleCompany, ctx);
        lines.push(
          "",
          `• Live Example (${exampleCompany.name}): Price $${exampleCompany.currentPrice.toFixed(2)}, Market Cap $${exampleCompany.marketCap}, Demand ${exampleCompany.demandScore}/100${pl ? `, Profit Margin ${pl.profitMargin}%` : ""}.`
        );
      }
      lines.push("", `💡 ${concept.marketPulseTip}`);
      return lines.join("\n");
    }
  }

  // 3. Company Comparison ("Compare Apple vs Microsoft" or "Compare with competitors")
  if (mentionedCompanies.length >= 2) {
    return formatCompanyComparison(mentionedCompanies[0], mentionedCompanies[1], ctx);
  }
  if (/\b(compare|competitor|versus|vs\.?)\b/i.test(q)) {
    const base = mentionedCompanies[0] ?? ctx.company;
    if (base) {
      const peer =
        ctx.companies.find((c) => c.id !== base.id && c.sector === base.sector) ??
        ctx.companies.find((c) => c.id !== base.id);
      if (peer) {
        return formatCompanyComparison(base, peer, ctx);
      }
    }
  }

  // 4. Specific Company Analysis (or active Company Analyzer context, or follow-up from history)
  if (mentionedCompanies.length === 1) {
    return formatCompanyAnalysis(mentionedCompanies[0], q, ctx);
  }
  if (ctx.company && !/\b(all companies|market summary|all sectors|all products)\b/i.test(q)) {
    return formatCompanyAnalysis(ctx.company, q, ctx);
  }
  if (ctx.history.length > 0 && /\b(it|its|they|their|that company|this company|profit|margin|demand|risk)\b/i.test(q)) {
    const lastMentioned = [...ctx.history]
      .reverse()
      .map((turn) => findMentionedCompanies(turn.content, ctx.companies)[0])
      .find(Boolean);
    if (lastMentioned) {
      return formatCompanyAnalysis(lastMentioned, q, ctx);
    }
  }

  // 5. Product & Demand Queries
  if (mentionedProducts.length > 0 || /\b(product|demand|surge|surging)\b/i.test(q)) {
    return formatProductResponse(mentionedProducts, q, ctx);
  }

  // 6. Sector & Industry Growth Queries
  if (mentionedSectors.length > 0 || /\b(sector|industry|industries)\b/i.test(q)) {
    return formatSectorResponse(mentionedSectors, q, ctx);
  }

  // 7. Market Losers / Gainers / Indices / News / Alerts / Summary
  if (/\b(loser|losing|worst|down today|biggest drop)\b/i.test(q)) {
    return formatMarketSummaryMessage(ctx, true);
  }
  if (/\b(gainer|winning|best stock|top stock|top performer)\b/i.test(q)) {
    const top = [...ctx.companies].sort((a, b) => b.changePercent - a.changePercent).slice(0, 4);
    return [
      "📈 Top Performing Stocks Today",
      "",
      ...top.map(
        (c) => `• ${c.name} (${c.symbol}): $${c.currentPrice.toFixed(2)} (${formatPercentSigned(c.changePercent)}) — ${c.sector}`
      ),
      "",
      "💡 Recommended: Dashboard → Top Companies Table",
    ].join("\n");
  }
  if (/\b(news|headline|alert|feed)\b/i.test(q)) {
    return [
      "📰 Latest Market Headlines & Alerts",
      "",
      ...ctx.newsItems.slice(0, 4).map((n) => `• [${n.sentiment.toUpperCase()}] ${n.headline} (${n.source})`),
      "",
      "💡 Recommended: Market Feed Page",
    ].join("\n");
  }
  if (/\b(index|indices|dow|nasdaq|s&p|spx|ixic|dji|summary|overview|market today)\b/i.test(q)) {
    return formatMarketSummaryMessage(ctx, false);
  }

  // 8. Concept match even without explicit "what is..." phrasing
  const directConcept = CONCEPT_GLOSSARY.find((entry) =>
    entry.keywords.some((kw) => q.includes(kw))
  );
  if (directConcept) {
    return [
      `📚 ${directConcept.title}`,
      "",
      ...directConcept.explanation.map((line) => `• ${line}`),
      "",
      `💡 ${directConcept.marketPulseTip}`,
    ].join("\n");
  }

  // 9. Generic market-related fallback vs out-of-scope redirect
  if (isMarketRelatedQuery(q)) {
    return formatMarketSummaryMessage(ctx, false);
  }

  return [
    "🤖 I'm PulseAI, trained specifically for the MarketPulse Dashboard and financial/market topics.",
    "",
    "I can help you with:",
    "• How MarketPulse works (Dashboard, Company Analyzer, Product Tracker, Feed, Watchlist)",
    "• Tracked companies & comparisons (e.g., \"Compare Apple vs Microsoft\" or \"Tell me about Reliance\")",
    "• Product demand & sector trends (e.g., \"Which products are surging?\" or \"Best sector this week\")",
    "• Financial & market basics (e.g., \"What is market cap?\", \"Explain profit margin\", \"What is S&P 500?\")",
    "",
    "💡 Try asking one of those market or project questions!",
  ].join("\n");
}

/**
 * Builds a concise, data-backed daily summary for Dashboard and Feed pages.
 */
export function buildLocalMarketSummary(marketData: MarketContextInput = {}): string {
  const ctx = resolveContext(marketData);
  const sortedSectors = [...ctx.sectors].sort((a, b) => b.performance - a.performance);
  const sortedCompanies = [...ctx.companies].sort((a, b) => b.changePercent - a.changePercent);
  const topGainer = sortedCompanies[0];
  const topLoser = sortedCompanies[sortedCompanies.length - 1];
  const risingCount = ctx.companies.filter((c) => c.changePercent > 0).length;
  const topProduct = [...ctx.products].sort((a, b) => b.demandScore - a.demandScore)[0];

  return [
    `Markets show balanced momentum with ${risingCount} of ${ctx.companies.length} tracked companies trading higher.`,
    `${sortedSectors[0].name} leads sectors at ${formatPercentSigned(sortedSectors[0].performance)}, while ${sortedSectors[sortedSectors.length - 1].name} lags at ${formatPercentSigned(sortedSectors[sortedSectors.length - 1].performance)}.`,
    `${topGainer.name} (${formatPercentSigned(topGainer.changePercent)}) tops gainers, ${topLoser.name} (${formatPercentSigned(topLoser.changePercent)}) leads declines, and ${topProduct.name} holds the highest demand score (${topProduct.demandScore}/100).`,
    "⚠️ Educational analysis only. Not financial advice.",
  ].join(" ");
}

/**
 * Formats user prompt + compact market context for live Gemini API calls.
 */
export function buildGeminiPrompt(
  userQuestion: string,
  marketContext: MarketContextInput = {}
): string {
  const ctx = resolveContext(marketContext);
  const compactContext = {
    selectedCompany: ctx.company
      ? {
          name: ctx.company.name,
          symbol: ctx.company.symbol,
          sector: ctx.company.sector,
          price: ctx.stockData?.price ?? ctx.company.currentPrice,
          changePercent: ctx.stockData?.changePercent ?? ctx.company.changePercent,
          marketCap: ctx.company.marketCap,
          demandScore: ctx.company.demandScore,
          demandChange: ctx.company.demandChange,
          latestPL: getLatestPL(ctx.company, ctx),
          recentNews: getCompanyNews(ctx.company, ctx).map((n) => ({
            headline: n.headline,
            sentiment: n.sentiment,
          })),
        }
      : undefined,
    companies: ctx.companies.map((c) => ({
      name: c.name,
      symbol: c.symbol,
      sector: c.sector,
      price: c.currentPrice,
      changePercent: c.changePercent,
      marketCap: c.marketCap,
      demandScore: c.demandScore,
      demandChange: c.demandChange,
    })),
    products: ctx.products.map((p) => ({
      name: p.name,
      category: p.category,
      brand: p.brand,
      demandScore: p.demandScore,
      demandChange: p.demandChange,
      trend: p.trend,
      factors: p.factors.slice(0, 2),
    })),
    sectors: ctx.sectors.map((s) => ({
      name: s.name,
      performance: s.performance,
      topCompany: s.topCompany,
    })),
    indices: ctx.marketIndices.map((i) => ({
      symbol: i.symbol,
      value: i.value,
      changePercent: i.changePercent,
    })),
  };

  const historyBlock = ctx.history.length
    ? `\nRecent conversation:\n${ctx.history
        .slice(-4)
        .map((h) => `${h.role === "user" ? "User" : "PulseAI"}: ${h.content}`)
        .join("\n")}\n`
    : "";

  return `MarketContext JSON:\n${JSON.stringify(compactContext)}${historyBlock}\nUser Question: ${userQuestion}`;
}
