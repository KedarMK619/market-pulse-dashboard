// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// MarketPulse — Complete Mock Data
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// Helper: generate smooth price curve
const generateChartData = (basePrice: number, volatility: number, points = 30) => {
  const data = [];
  let price = basePrice * (1 - volatility * 0.15);
  for (let i = 0; i < points; i++) {
    const trend = (basePrice - price) / points;
    const noise = (Math.random() - 0.45) * volatility * basePrice;
    price += trend + noise;
    price = Math.max(price, basePrice * 0.7);
    const date = new Date();
    date.setDate(date.getDate() - (points - i));
    data.push({
      date: date.toISOString().split("T")[0],
      price: parseFloat(price.toFixed(2)),
    });
  }
  // ensure last point equals currentPrice
  data[data.length - 1].price = basePrice;
  return data;
};

const generateIndexChart = (baseValue: number, volatility: number) => {
  const data = [];
  let value = baseValue * (1 - volatility * 0.1);
  for (let i = 0; i < 30; i++) {
    const trend = (baseValue - value) / 30;
    const noise = (Math.random() - 0.45) * volatility * baseValue;
    value += trend + noise;
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    data.push({
      date: date.toISOString().split("T")[0],
      value: parseFloat(value.toFixed(2)),
    });
  }
  data[data.length - 1].value = baseValue;
  return data;
};

const generateMonthlyDemand = (base: number, trend: "up" | "down" | "stable") => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let score = trend === "up" ? base - 18 : trend === "down" ? base + 12 : base - 5;
  return months.map((month) => {
    const delta = trend === "up" ? Math.random() * 4 + 1 : trend === "down" ? -(Math.random() * 3 + 0.5) : (Math.random() - 0.5) * 3;
    score = Math.min(100, Math.max(10, score + delta));
    return { month, score: parseFloat(score.toFixed(1)) };
  });
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1. COMPANIES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const companies = [
  {
    id: "aapl",
    name: "Apple Inc.",
    symbol: "AAPL",
    sector: "Technology",
    foundedYear: 1976,
    currentPrice: 189.84,
    change: 3.42,
    changePercent: 1.84,
    marketCap: "2.95T",
    high52week: 199.62,
    low52week: 143.90,
    revenue: [117.2, 94.8, 85.8, 89.5],
    expenses: [82.1, 68.4, 62.3, 64.8],
    netProfit: [35.1, 26.4, 23.5, 24.7],
    demandScore: 88,
    demandChange: 4.2,
    status: "Rising" as const,
    chartData: generateChartData(189.84, 0.04),
  },
  {
    id: "tsla",
    name: "Tesla Inc.",
    symbol: "TSLA",
    sector: "Automotive",
    foundedYear: 2003,
    currentPrice: 242.56,
    change: -5.18,
    changePercent: -2.09,
    marketCap: "770B",
    high52week: 299.29,
    low52week: 152.37,
    revenue: [25.2, 24.9, 23.4, 21.3],
    expenses: [21.8, 21.4, 20.1, 18.5],
    netProfit: [3.4, 3.5, 3.3, 2.8],
    demandScore: 72,
    demandChange: -6.3,
    status: "Falling" as const,
    chartData: generateChartData(242.56, 0.07),
  },
  {
    id: "amzn",
    name: "Amazon.com Inc.",
    symbol: "AMZN",
    sector: "Retail",
    foundedYear: 1994,
    currentPrice: 178.25,
    change: 2.67,
    changePercent: 1.52,
    marketCap: "1.86T",
    high52week: 189.77,
    low52week: 118.35,
    revenue: [143.1, 134.4, 127.4, 149.2],
    expenses: [133.9, 126.2, 120.8, 139.5],
    netProfit: [9.2, 8.2, 6.6, 9.7],
    demandScore: 91,
    demandChange: 5.1,
    status: "Rising" as const,
    chartData: generateChartData(178.25, 0.05),
  },
  {
    id: "msft",
    name: "Microsoft Corp.",
    symbol: "MSFT",
    sector: "Technology",
    foundedYear: 1975,
    currentPrice: 415.60,
    change: 6.23,
    changePercent: 1.52,
    marketCap: "3.09T",
    high52week: 430.82,
    low52week: 309.45,
    revenue: [61.9, 56.5, 52.9, 62.0],
    expenses: [42.3, 39.8, 37.1, 42.8],
    netProfit: [19.6, 16.7, 15.8, 19.2],
    demandScore: 85,
    demandChange: 3.8,
    status: "Rising" as const,
    chartData: generateChartData(415.60, 0.04),
  },
  {
    id: "googl",
    name: "Alphabet Inc.",
    symbol: "GOOGL",
    sector: "Technology",
    foundedYear: 1998,
    currentPrice: 141.80,
    change: 1.15,
    changePercent: 0.82,
    marketCap: "1.78T",
    high52week: 153.78,
    low52week: 115.83,
    revenue: [86.3, 80.5, 76.7, 84.1],
    expenses: [65.1, 62.3, 59.4, 64.8],
    netProfit: [21.2, 18.2, 17.3, 19.3],
    demandScore: 82,
    demandChange: 2.1,
    status: "Stable" as const,
    chartData: generateChartData(141.80, 0.04),
  },
  {
    id: "reliance",
    name: "Reliance Industries",
    symbol: "RELIANCE",
    sector: "Energy",
    foundedYear: 1966,
    currentPrice: 28.42,
    change: -0.38,
    changePercent: -1.32,
    marketCap: "192B",
    high52week: 31.20,
    low52week: 23.45,
    revenue: [28.4, 26.8, 25.1, 27.9],
    expenses: [23.1, 21.9, 20.6, 22.8],
    netProfit: [5.3, 4.9, 4.5, 5.1],
    demandScore: 65,
    demandChange: -1.8,
    status: "Falling" as const,
    chartData: generateChartData(28.42, 0.05),
  },
  {
    id: "tatamotors",
    name: "Tata Motors",
    symbol: "TATAMOTORS",
    sector: "Automotive",
    foundedYear: 1945,
    currentPrice: 22.18,
    change: 0.32,
    changePercent: 1.46,
    marketCap: "82B",
    high52week: 25.90,
    low52week: 16.80,
    revenue: [14.2, 12.8, 11.5, 13.9],
    expenses: [12.8, 11.6, 10.5, 12.4],
    netProfit: [1.4, 1.2, 1.0, 1.5],
    demandScore: 70,
    demandChange: 3.4,
    status: "Rising" as const,
    chartData: generateChartData(22.18, 0.06),
  },
  {
    id: "samsung",
    name: "Samsung Electronics",
    symbol: "005930",
    sector: "Technology",
    foundedYear: 1969,
    currentPrice: 68.45,
    change: -0.92,
    changePercent: -1.33,
    marketCap: "450B",
    high52week: 78.30,
    low52week: 55.20,
    revenue: [63.2, 58.7, 54.1, 61.8],
    expenses: [52.4, 49.1, 45.8, 51.2],
    netProfit: [10.8, 9.6, 8.3, 10.6],
    demandScore: 76,
    demandChange: -2.4,
    status: "Stable" as const,
    chartData: generateChartData(68.45, 0.05),
  },
  {
    id: "tm",
    name: "Toyota Motor Corp.",
    symbol: "TM",
    sector: "Automotive",
    foundedYear: 1937,
    currentPrice: 195.30,
    change: 1.85,
    changePercent: 0.96,
    marketCap: "310B",
    high52week: 212.45,
    low52week: 162.10,
    revenue: [78.5, 72.1, 68.4, 76.8],
    expenses: [68.2, 63.5, 60.1, 67.0],
    netProfit: [10.3, 8.6, 8.3, 9.8],
    demandScore: 74,
    demandChange: 1.2,
    status: "Stable" as const,
    chartData: generateChartData(195.30, 0.04),
  },
  {
    id: "meta",
    name: "Meta Platforms Inc.",
    symbol: "META",
    sector: "Technology",
    foundedYear: 2004,
    currentPrice: 505.42,
    change: 8.75,
    changePercent: 1.76,
    marketCap: "1.29T",
    high52week: 542.81,
    low52week: 274.38,
    revenue: [40.1, 36.5, 34.1, 39.1],
    expenses: [27.8, 25.9, 24.5, 27.2],
    netProfit: [12.3, 10.6, 9.6, 11.9],
    demandScore: 80,
    demandChange: 5.6,
    status: "Rising" as const,
    chartData: generateChartData(505.42, 0.06),
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2. PRODUCTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const products = [
  {
    id: "iphone15",
    name: "iPhone 15",
    category: "Smartphones",
    brand: "Apple",
    demandScore: 92,
    demandChange: 6.8,
    lastMonthScore: 85.2,
    trend: "up" as const,
    regionData: [
      { region: "North America", score: 95 },
      { region: "Europe", score: 89 },
      { region: "Asia", score: 91 },
      { region: "Middle East", score: 78 },
      { region: "India", score: 72 },
    ],
    monthlyDemand: generateMonthlyDemand(92, "up"),
    factors: ["New titanium design driving upgrades", "Strong holiday season demand", "Camera improvements praised by reviewers", "USB-C adoption boosting sales"],
  },
  {
    id: "model3",
    name: "Tesla Model 3",
    category: "Electric Vehicles",
    brand: "Tesla",
    demandScore: 68,
    demandChange: -8.4,
    lastMonthScore: 76.4,
    trend: "down" as const,
    regionData: [
      { region: "North America", score: 72 },
      { region: "Europe", score: 58 },
      { region: "Asia", score: 65 },
      { region: "Middle East", score: 45 },
      { region: "India", score: 32 },
    ],
    monthlyDemand: generateMonthlyDemand(68, "down"),
    factors: ["Increased EV competition from BYD and Rivian", "Price cuts eroding brand premium perception", "Charging infrastructure concerns in some regions"],
  },
  {
    id: "echodot",
    name: "Echo Dot",
    category: "Smart Speakers",
    brand: "Amazon",
    demandScore: 74,
    demandChange: 2.1,
    lastMonthScore: 71.9,
    trend: "stable" as const,
    regionData: [
      { region: "North America", score: 82 },
      { region: "Europe", score: 76 },
      { region: "Asia", score: 61 },
      { region: "Middle East", score: 55 },
      { region: "India", score: 68 },
    ],
    monthlyDemand: generateMonthlyDemand(74, "stable"),
    factors: ["AI assistant improvements driving interest", "Bundle deals with Prime subscriptions", "Smart home ecosystem expansion"],
  },
  {
    id: "surfacelaptop",
    name: "Surface Laptop",
    category: "Laptops",
    brand: "Microsoft",
    demandScore: 71,
    demandChange: 3.5,
    lastMonthScore: 67.5,
    trend: "up" as const,
    regionData: [
      { region: "North America", score: 78 },
      { region: "Europe", score: 74 },
      { region: "Asia", score: 62 },
      { region: "Middle East", score: 58 },
      { region: "India", score: 55 },
    ],
    monthlyDemand: generateMonthlyDemand(71, "up"),
    factors: ["Copilot AI integration attracting enterprise buyers", "Improved ARM processor performance", "Strong education sector demand"],
  },
  {
    id: "galaxys24",
    name: "Galaxy S24",
    category: "Smartphones",
    brand: "Samsung",
    demandScore: 84,
    demandChange: 5.2,
    lastMonthScore: 78.8,
    trend: "up" as const,
    regionData: [
      { region: "North America", score: 79 },
      { region: "Europe", score: 83 },
      { region: "Asia", score: 90 },
      { region: "Middle East", score: 82 },
      { region: "India", score: 88 },
    ],
    monthlyDemand: generateMonthlyDemand(84, "up"),
    factors: ["Galaxy AI features generating buzz", "Competitive pricing vs iPhone", "Strong carrier promotions", "Improved camera system praised"],
  },
  {
    id: "evbatteries",
    name: "EV Batteries",
    category: "Components",
    brand: "Multiple",
    demandScore: 89,
    demandChange: 9.1,
    lastMonthScore: 79.9,
    trend: "up" as const,
    regionData: [
      { region: "North America", score: 88 },
      { region: "Europe", score: 92 },
      { region: "Asia", score: 95 },
      { region: "Middle East", score: 62 },
      { region: "India", score: 78 },
    ],
    monthlyDemand: generateMonthlyDemand(89, "up"),
    factors: ["Global EV adoption accelerating", "Government subsidies boosting production", "Solid-state battery breakthroughs", "Supply chain improvements reducing costs"],
  },
  {
    id: "solarpanels",
    name: "Solar Panels",
    category: "Energy",
    brand: "Multiple",
    demandScore: 81,
    demandChange: 4.7,
    lastMonthScore: 76.3,
    trend: "up" as const,
    regionData: [
      { region: "North America", score: 80 },
      { region: "Europe", score: 88 },
      { region: "Asia", score: 82 },
      { region: "Middle East", score: 91 },
      { region: "India", score: 85 },
    ],
    monthlyDemand: generateMonthlyDemand(81, "up"),
    factors: ["Renewable energy mandates expanding", "Panel efficiency hitting record levels", "Falling installation costs"],
  },
  {
    id: "aichips",
    name: "AI Chips",
    category: "Semiconductors",
    brand: "Multiple",
    demandScore: 96,
    demandChange: 12.3,
    lastMonthScore: 83.7,
    trend: "up" as const,
    regionData: [
      { region: "North America", score: 98 },
      { region: "Europe", score: 88 },
      { region: "Asia", score: 95 },
      { region: "Middle East", score: 72 },
      { region: "India", score: 80 },
    ],
    monthlyDemand: generateMonthlyDemand(96, "up"),
    factors: ["Explosive AI model training demand", "Cloud providers racing to expand GPU clusters", "New chip architectures from NVIDIA & AMD", "Enterprise AI adoption accelerating"],
  },
  {
    id: "luxurywatches",
    name: "Luxury Watches",
    category: "Luxury Goods",
    brand: "Multiple",
    demandScore: 58,
    demandChange: -4.2,
    lastMonthScore: 62.2,
    trend: "down" as const,
    regionData: [
      { region: "North America", score: 55 },
      { region: "Europe", score: 68 },
      { region: "Asia", score: 52 },
      { region: "Middle East", score: 75 },
      { region: "India", score: 48 },
    ],
    monthlyDemand: generateMonthlyDemand(58, "down"),
    factors: ["Smartwatch competition intensifying", "Secondary market prices declining", "Younger buyers shifting to experiences over goods"],
  },
  {
    id: "organicfood",
    name: "Organic Food",
    category: "Food & Beverage",
    brand: "Multiple",
    demandScore: 77,
    demandChange: 3.9,
    lastMonthScore: 73.1,
    trend: "up" as const,
    regionData: [
      { region: "North America", score: 82 },
      { region: "Europe", score: 88 },
      { region: "Asia", score: 65 },
      { region: "Middle East", score: 60 },
      { region: "India", score: 72 },
    ],
    monthlyDemand: generateMonthlyDemand(77, "up"),
    factors: ["Health consciousness driving adoption", "Supply chain maturation lowering prices", "Retail expansion in emerging markets"],
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3. MARKET INDICES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const marketIndices = [
  {
    name: "Dow Jones Industrial Average",
    symbol: "DJI",
    value: 38520,
    change: 154.08,
    changePercent: 0.4,
    chartData: generateIndexChart(38520, 0.02),
  },
  {
    name: "NASDAQ Composite",
    symbol: "IXIC",
    value: 15890,
    change: 190.68,
    changePercent: 1.2,
    chartData: generateIndexChart(15890, 0.03),
  },
  {
    name: "S&P 500",
    symbol: "SPX",
    value: 5021,
    change: 30.13,
    changePercent: 0.6,
    chartData: generateIndexChart(5021, 0.02),
  },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4. SECTORS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const sectors = [
  { id: "tech", name: "Technology", performance: 3.2, color: "#00ff88", icon: "💻", topCompany: "Microsoft", marketCap: "12.4T" },
  { id: "health", name: "Healthcare", performance: -1.1, color: "#ff4444", icon: "🏥", topCompany: "UnitedHealth", marketCap: "6.8T" },
  { id: "finance", name: "Finance", performance: 0.8, color: "#00b4ff", icon: "🏦", topCompany: "JPMorgan Chase", marketCap: "9.2T" },
  { id: "energy", name: "Energy", performance: -2.4, color: "#ff4444", icon: "⚡", topCompany: "ExxonMobil", marketCap: "4.1T" },
  { id: "retail", name: "Retail", performance: 1.7, color: "#00ff88", icon: "🛒", topCompany: "Amazon", marketCap: "5.6T" },
  { id: "mfg", name: "Manufacturing", performance: 0.3, color: "#00b4ff", icon: "🏭", topCompany: "Toyota", marketCap: "3.9T" },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5. MARKET ALERTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const marketAlerts = [
  { id: "a1", company: "Apple", type: "Price Change", message: "Apple stock surged +5.2% after strong iPhone 15 sales report", time: "2 hours ago", severity: "high" as const, change: 9.87, changePercent: 5.2 },
  { id: "a2", company: "Tesla", type: "Demand Spike", message: "Tesla demand score dropped -12% in Europe amid EV competition", time: "3 hours ago", severity: "high" as const, change: -29.1, changePercent: -12.0 },
  { id: "a3", company: "Amazon", type: "Profit Report", message: "Amazon Q3 profit report beats expectations by 18%", time: "5 hours ago", severity: "high" as const, change: 8.54, changePercent: 4.8 },
  { id: "a4", company: "Microsoft", type: "Price Change", message: "Microsoft hits all-time high on Azure AI growth momentum", time: "6 hours ago", severity: "medium" as const, change: 12.48, changePercent: 3.1 },
  { id: "a5", company: "Google", type: "News Impact", message: "Alphabet faces antitrust ruling, shares dip 2.1% in after-hours", time: "8 hours ago", severity: "medium" as const, change: -2.98, changePercent: -2.1 },
  { id: "a6", company: "Meta", type: "Demand Spike", message: "Meta's Threads app crosses 200M users, ad revenue outlook raised", time: "10 hours ago", severity: "medium" as const, change: 15.12, changePercent: 3.0 },
  { id: "a7", company: "Samsung", type: "Profit Report", message: "Samsung reports memory chip division returning to profitability", time: "12 hours ago", severity: "medium" as const, change: 2.05, changePercent: 3.0 },
  { id: "a8", company: "Reliance", type: "News Impact", message: "Reliance Jio announces 5G expansion to 200 new cities", time: "Yesterday", severity: "low" as const, change: 0.85, changePercent: 3.1 },
  { id: "a9", company: "Toyota", type: "Demand Spike", message: "Toyota hybrid sales surge 34% year-over-year globally", time: "Yesterday", severity: "medium" as const, change: 4.68, changePercent: 2.4 },
  { id: "a10", company: "Tata Motors", type: "Price Change", message: "Tata Motors gains 4.8% on strong Jaguar Land Rover earnings", time: "Yesterday", severity: "low" as const, change: 1.06, changePercent: 4.8 },
  { id: "a11", company: "Apple", type: "News Impact", message: "Apple Vision Pro sales slower than expected in initial markets", time: "2 days ago", severity: "medium" as const, change: -3.42, changePercent: -1.8 },
  { id: "a12", company: "Tesla", type: "Price Change", message: "Tesla Cybertruck delivery ramp exceeds analyst forecasts", time: "2 days ago", severity: "low" as const, change: 7.28, changePercent: 3.0 },
  { id: "a13", company: "Amazon", type: "News Impact", message: "AWS launches next-gen Graviton chips, enterprises fast-tracking migration", time: "3 days ago", severity: "low" as const, change: 3.21, changePercent: 1.8 },
  { id: "a14", company: "Microsoft", type: "Demand Spike", message: "Copilot enterprise subscriptions grow 40% quarter-over-quarter", time: "3 days ago", severity: "high" as const, change: 16.62, changePercent: 4.0 },
  { id: "a15", company: "Google", type: "Profit Report", message: "Google Cloud revenue surpasses $10B quarterly for first time", time: "4 days ago", severity: "high" as const, change: 5.67, changePercent: 4.0 },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6. NEWS ITEMS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const newsItems = [
  { id: "n1", headline: "Apple Reports Record-Breaking iPhone 15 Sales in Holiday Quarter", source: "Reuters", time: "1 hour ago", company: "Apple", sentiment: "positive" as const, summary: "Apple shipped over 80 million iPhone 15 units in Q4, exceeding Wall Street estimates by 12%." },
  { id: "n2", headline: "Tesla Slashes Model 3 Prices Across Europe Amid Fierce Competition", source: "Bloomberg", time: "2 hours ago", company: "Tesla", sentiment: "negative" as const, summary: "Tesla reduced Model 3 prices by up to 8% in key European markets as BYD and VW gain ground." },
  { id: "n3", headline: "Amazon Web Services Launches Revolutionary AI Infrastructure", source: "TechCrunch", time: "3 hours ago", company: "Amazon", sentiment: "positive" as const, summary: "AWS unveiled custom Trainium2 chips that deliver 4x the ML training performance at half the cost." },
  { id: "n4", headline: "Microsoft Copilot Now Used by 60% of Fortune 500 Companies", source: "CNBC", time: "4 hours ago", company: "Microsoft", sentiment: "positive" as const, summary: "Enterprise adoption of Microsoft 365 Copilot has accelerated faster than any previous Microsoft product launch." },
  { id: "n5", headline: "Google DeepMind Achieves Breakthrough in Protein Structure Prediction", source: "BBC Business", time: "5 hours ago", company: "Google", sentiment: "positive" as const, summary: "AlphaFold 3 can now predict interactions between proteins, DNA, and drug molecules with 95% accuracy." },
  { id: "n6", headline: "Reliance Industries Partners With NVIDIA for India AI Cloud", source: "Reuters", time: "6 hours ago", company: "Reliance", sentiment: "positive" as const, summary: "Reliance Jio will build India's largest AI cloud infrastructure using NVIDIA's latest H200 GPUs." },
  { id: "n7", headline: "Tata Motors Reports 28% Jump in EV Sales for Q3", source: "Bloomberg", time: "8 hours ago", company: "Tata Motors", sentiment: "positive" as const, summary: "Tata's Nexon EV and Tiago EV continue to dominate India's electric vehicle market with 72% share." },
  { id: "n8", headline: "Samsung Unveils Galaxy AI Features That Work Entirely On-Device", source: "TechCrunch", time: "10 hours ago", company: "Samsung", sentiment: "positive" as const, summary: "The new Galaxy AI suite processes translations, summaries, and image editing without cloud connectivity." },
  { id: "n9", headline: "Toyota Doubles Down on Hydrogen Fuel Cell Technology", source: "Forbes", time: "12 hours ago", company: "Toyota", sentiment: "neutral" as const, summary: "Toyota announced $3.5B investment in next-gen hydrogen fuel cells, betting on multi-powertrain future." },
  { id: "n10", headline: "Meta's Ad Revenue Surges 24% as Reels Monetization Accelerates", source: "CNBC", time: "14 hours ago", company: "Meta", sentiment: "positive" as const, summary: "Instagram Reels now generates over $10B annually, catching up to TikTok in advertiser spend." },
  { id: "n11", headline: "EU Proposes New Digital Tax That Could Impact Big Tech Earnings", source: "BBC Business", time: "Yesterday", company: "Multiple", sentiment: "negative" as const, summary: "The proposed 3% digital services tax would apply to tech companies with EU revenues above €750M." },
  { id: "n12", headline: "Apple's Vision Pro Faces Supply Chain Constraints, Production Cut", source: "Bloomberg", time: "Yesterday", company: "Apple", sentiment: "negative" as const, summary: "Apple has reportedly cut Vision Pro production targets by 50% due to micro-OLED display shortages." },
  { id: "n13", headline: "Tesla Semi Truck Begins Mass Production at Giga Nevada", source: "Reuters", time: "Yesterday", company: "Tesla", sentiment: "positive" as const, summary: "Tesla has started volume production of the Semi, with PepsiCo and UPS among first major fleet customers." },
  { id: "n14", headline: "Amazon Expands Same-Day Delivery to 30 New Metro Areas", source: "Forbes", time: "2 days ago", company: "Amazon", sentiment: "positive" as const, summary: "The expansion brings same-day delivery coverage to 90% of the US population." },
  { id: "n15", headline: "Microsoft Azure Revenue Grows 29% Driven by AI Workloads", source: "CNBC", time: "2 days ago", company: "Microsoft", sentiment: "positive" as const, summary: "AI services now account for 8 percentage points of Azure's growth, up from 3 points last quarter." },
  { id: "n16", headline: "Global Chip Shortage Eases but AI Chip Demand Remains Sky-High", source: "Reuters", time: "2 days ago", company: "Multiple", sentiment: "neutral" as const, summary: "While consumer chip supply normalizes, lead times for AI-grade GPUs extend to 6+ months." },
  { id: "n17", headline: "Google Faces $2.3B Fine in EU Antitrust Case Over Ad Tech", source: "Bloomberg", time: "3 days ago", company: "Google", sentiment: "negative" as const, summary: "EU regulators ruled that Google abused its dominant position in the digital advertising market." },
  { id: "n18", headline: "Reliance Retail Becomes India's Largest Retailer by Revenue", source: "Forbes", time: "3 days ago", company: "Reliance", sentiment: "positive" as const, summary: "Reliance Retail surpassed $30B in annual revenue, operating over 18,000 stores across India." },
  { id: "n19", headline: "Samsung Plans $230B Investment in Semiconductor Mega-Complex", source: "Reuters", time: "4 days ago", company: "Samsung", sentiment: "positive" as const, summary: "The 20-year project near Seoul will house five advanced chip fabrication plants." },
  { id: "n20", headline: "Meta Launches Open-Source Llama 3 Model, Challenging GPT-4", source: "TechCrunch", time: "4 days ago", company: "Meta", sentiment: "positive" as const, summary: "Llama 3's 400B parameter model matches GPT-4 on most benchmarks while remaining fully open-source." },
];

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7. SUMMARY STATS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const summaryStats = {
  totalMarketCap: "89.4T",
  totalMarketCapChange: "+1.2%",
  topGainer: { name: "Meta Platforms", symbol: "META", changePercent: 1.76 },
  topLoser: { name: "Tesla Inc.", symbol: "TSLA", changePercent: -2.09 },
  mostDemandedProduct: { name: "AI Chips", demandScore: 96 },
  totalCompaniesTracked: 10,
  marketsOpen: true,
  lastUpdated: new Date().toISOString(),
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8. P&L DATA
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export const plData: Record<string, Array<{
  quarter: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  profitMargin: number;
  changeFromLastQuarter: number;
}>> = {
  AAPL: [
    { quarter: "Q1 2024", revenue: 117.2, expenses: 82.1, netProfit: 35.1, profitMargin: 29.9, changeFromLastQuarter: 5.4 },
    { quarter: "Q4 2023", revenue: 89.5, expenses: 64.8, netProfit: 24.7, profitMargin: 27.6, changeFromLastQuarter: 5.1 },
    { quarter: "Q3 2023", revenue: 85.8, expenses: 62.3, netProfit: 23.5, profitMargin: 27.4, changeFromLastQuarter: -3.1 },
    { quarter: "Q2 2023", revenue: 94.8, expenses: 68.4, netProfit: 26.4, profitMargin: 27.8, changeFromLastQuarter: 2.2 },
  ],
  TSLA: [
    { quarter: "Q1 2024", revenue: 25.2, expenses: 21.8, netProfit: 3.4, profitMargin: 13.5, changeFromLastQuarter: -2.9 },
    { quarter: "Q4 2023", revenue: 21.3, expenses: 18.5, netProfit: 2.8, profitMargin: 13.1, changeFromLastQuarter: -15.2 },
    { quarter: "Q3 2023", revenue: 23.4, expenses: 20.1, netProfit: 3.3, profitMargin: 14.1, changeFromLastQuarter: -5.7 },
    { quarter: "Q2 2023", revenue: 24.9, expenses: 21.4, netProfit: 3.5, profitMargin: 14.1, changeFromLastQuarter: 1.4 },
  ],
  AMZN: [
    { quarter: "Q1 2024", revenue: 143.1, expenses: 133.9, netProfit: 9.2, profitMargin: 6.4, changeFromLastQuarter: -5.2 },
    { quarter: "Q4 2023", revenue: 149.2, expenses: 139.5, netProfit: 9.7, profitMargin: 6.5, changeFromLastQuarter: 47.0 },
    { quarter: "Q3 2023", revenue: 127.4, expenses: 120.8, netProfit: 6.6, profitMargin: 5.2, changeFromLastQuarter: -19.5 },
    { quarter: "Q2 2023", revenue: 134.4, expenses: 126.2, netProfit: 8.2, profitMargin: 6.1, changeFromLastQuarter: 12.3 },
  ],
  MSFT: [
    { quarter: "Q1 2024", revenue: 61.9, expenses: 42.3, netProfit: 19.6, profitMargin: 31.7, changeFromLastQuarter: 2.1 },
    { quarter: "Q4 2023", revenue: 62.0, expenses: 42.8, netProfit: 19.2, profitMargin: 31.0, changeFromLastQuarter: 21.5 },
    { quarter: "Q3 2023", revenue: 52.9, expenses: 37.1, netProfit: 15.8, profitMargin: 29.9, changeFromLastQuarter: -5.4 },
    { quarter: "Q2 2023", revenue: 56.5, expenses: 39.8, netProfit: 16.7, profitMargin: 29.6, changeFromLastQuarter: 3.8 },
  ],
  GOOGL: [
    { quarter: "Q1 2024", revenue: 86.3, expenses: 65.1, netProfit: 21.2, profitMargin: 24.6, changeFromLastQuarter: 9.8 },
    { quarter: "Q4 2023", revenue: 84.1, expenses: 64.8, netProfit: 19.3, profitMargin: 23.0, changeFromLastQuarter: 11.6 },
    { quarter: "Q3 2023", revenue: 76.7, expenses: 59.4, netProfit: 17.3, profitMargin: 22.6, changeFromLastQuarter: -4.9 },
    { quarter: "Q2 2023", revenue: 80.5, expenses: 62.3, netProfit: 18.2, profitMargin: 22.6, changeFromLastQuarter: 5.5 },
  ],
  RELIANCE: [
    { quarter: "Q1 2024", revenue: 28.4, expenses: 23.1, netProfit: 5.3, profitMargin: 18.7, changeFromLastQuarter: 3.9 },
    { quarter: "Q4 2023", revenue: 27.9, expenses: 22.8, netProfit: 5.1, profitMargin: 18.3, changeFromLastQuarter: 13.3 },
    { quarter: "Q3 2023", revenue: 25.1, expenses: 20.6, netProfit: 4.5, profitMargin: 17.9, changeFromLastQuarter: -8.2 },
    { quarter: "Q2 2023", revenue: 26.8, expenses: 21.9, netProfit: 4.9, profitMargin: 18.3, changeFromLastQuarter: 2.1 },
  ],
  TATAMOTORS: [
    { quarter: "Q1 2024", revenue: 14.2, expenses: 12.8, netProfit: 1.4, profitMargin: 9.9, changeFromLastQuarter: -6.7 },
    { quarter: "Q4 2023", revenue: 13.9, expenses: 12.4, netProfit: 1.5, profitMargin: 10.8, changeFromLastQuarter: 50.0 },
    { quarter: "Q3 2023", revenue: 11.5, expenses: 10.5, netProfit: 1.0, profitMargin: 8.7, changeFromLastQuarter: -16.7 },
    { quarter: "Q2 2023", revenue: 12.8, expenses: 11.6, netProfit: 1.2, profitMargin: 9.4, changeFromLastQuarter: 8.5 },
  ],
  "005930": [
    { quarter: "Q1 2024", revenue: 63.2, expenses: 52.4, netProfit: 10.8, profitMargin: 17.1, changeFromLastQuarter: 1.9 },
    { quarter: "Q4 2023", revenue: 61.8, expenses: 51.2, netProfit: 10.6, profitMargin: 17.2, changeFromLastQuarter: 27.7 },
    { quarter: "Q3 2023", revenue: 54.1, expenses: 45.8, netProfit: 8.3, profitMargin: 15.3, changeFromLastQuarter: -13.5 },
    { quarter: "Q2 2023", revenue: 58.7, expenses: 49.1, netProfit: 9.6, profitMargin: 16.4, changeFromLastQuarter: 4.3 },
  ],
  TM: [
    { quarter: "Q1 2024", revenue: 78.5, expenses: 68.2, netProfit: 10.3, profitMargin: 13.1, changeFromLastQuarter: 5.1 },
    { quarter: "Q4 2023", revenue: 76.8, expenses: 67.0, netProfit: 9.8, profitMargin: 12.8, changeFromLastQuarter: 18.1 },
    { quarter: "Q3 2023", revenue: 68.4, expenses: 60.1, netProfit: 8.3, profitMargin: 12.1, changeFromLastQuarter: -3.5 },
    { quarter: "Q2 2023", revenue: 72.1, expenses: 63.5, netProfit: 8.6, profitMargin: 11.9, changeFromLastQuarter: 2.4 },
  ],
  META: [
    { quarter: "Q1 2024", revenue: 40.1, expenses: 27.8, netProfit: 12.3, profitMargin: 30.7, changeFromLastQuarter: 3.4 },
    { quarter: "Q4 2023", revenue: 39.1, expenses: 27.2, netProfit: 11.9, profitMargin: 30.4, changeFromLastQuarter: 24.0 },
    { quarter: "Q3 2023", revenue: 34.1, expenses: 24.5, netProfit: 9.6, profitMargin: 28.2, changeFromLastQuarter: -9.4 },
    { quarter: "Q2 2023", revenue: 36.5, expenses: 25.9, netProfit: 10.6, profitMargin: 29.0, changeFromLastQuarter: 6.0 },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DEFAULT EXPORT
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const mockData = {
  companies,
  products,
  marketIndices,
  sectors,
  marketAlerts,
  newsItems,
  summaryStats,
  plData,
};

export default mockData;
