import { describe, expect, it } from "vitest";
import { companies, plData } from "@/lib/mock/mockData";
import { analyzeMarket, generateMarketSummary } from "@/lib/api/gemini";
import { generateLocalPulseResponse } from "@/lib/api/pulseKnowledge";

describe("PulseAI knowledge & analysis", () => {
  it("explains MarketPulse project features and educational-only purpose", () => {
    const reply = generateLocalPulseResponse("What is MarketPulse?");

    expect(reply).toContain("Educational Purpose Only");
    expect(reply).toContain("Do NOT use");
    expect(reply).toContain("Dashboard");
    expect(reply).toContain("Company Analyzer");
    expect(reply).toContain("Product Tracker");
    expect(reply).toContain("Watchlist");
  });

  it("refuses buy/sell/investment decision requests upfront before sharing educational data", () => {
    const buyReply = generateLocalPulseResponse("Should I buy Apple stock right now?");

    expect(buyReply).toContain("Educational Project Only — Not for Financial Decisions");
    expect(buyReply).toContain("cannot recommend whether to buy, sell, hold, or invest");
    expect(buyReply).toContain("Apple Inc.");

    const adviceReply = generateLocalPulseResponse("Which stock should I invest in?");
    expect(adviceReply).toContain("Educational Project Only — Not for Financial Decisions");
    expect(adviceReply).toContain("must NOT be used to make any real financial");
  });

  it("answers basic financial and project-related concept questions", () => {
    const marginReply = generateLocalPulseResponse("What is profit margin?");
    expect(marginReply).toContain("Profit Margin");
    expect(marginReply).toContain("Revenue");
    expect(marginReply).toContain("Net Profit");

    const demandReply = generateLocalPulseResponse("What does demand score mean?");
    expect(demandReply).toContain("Demand Score");
    expect(demandReply).toContain("0–100");

    const indexReply = generateLocalPulseResponse("Explain S&P 500 and NASDAQ");
    expect(indexReply).toContain("S&P 500");
    expect(indexReply).toContain("NASDAQ");
  });

  it("compares two companies using tracked financial and demand metrics", () => {
    const reply = generateLocalPulseResponse("Compare Apple vs Microsoft profit trends");

    expect(reply).toContain("Apple Inc.");
    expect(reply).toContain("Microsoft Corp.");
    expect(reply).toContain("AAPL");
    expect(reply).toContain("MSFT");
    expect(reply).toContain("Margin");
  });

  it("uses selected Company Analyzer context for company-specific questions", () => {
    const tesla = companies.find((c) => c.symbol === "TSLA")!;
    const reply = generateLocalPulseResponse("Summarize Q3 performance", {
      company: tesla,
      financialData: plData.TSLA,
    });

    expect(reply).toContain("Tesla Inc.");
    expect(reply).toContain("TSLA");
    expect(reply).toContain("Q3 2023");
    expect(reply).toContain("$23.4B");
  });

  it("answers Tesla demand and surging product queries accurately", () => {
    const teslaDemand = generateLocalPulseResponse("Why is Tesla's demand changing recently?");
    expect(teslaDemand).toContain("Tesla Inc.");
    expect(teslaDemand).toContain("72/100");
    expect(teslaDemand).toContain("Tesla Model 3");

    const surging = generateLocalPulseResponse("What products are seeing demand surge right now?");
    expect(surging).toContain("AI Chips");
    expect(surging).toContain("EV Batteries");
  });

  it("handles follow-up questions from chat history and out-of-scope redirects", () => {
    const followUp = generateLocalPulseResponse("What about its profit margin?", {
      history: [
        { role: "user", content: "Tell me about Reliance" },
        { role: "ai", content: "Reliance Industries (RELIANCE) overview..." },
      ],
    });
    expect(followUp).toContain("Reliance Industries");

    const offTopic = generateLocalPulseResponse("Can you give me a pasta recipe?");
    expect(offTopic).toContain("PulseAI");
    expect(offTopic).toContain("MarketPulse");
  });

  it("runs analyzeMarket and generateMarketSummary without an external API key", async () => {
    const answer = await analyzeMarket("Which sector is performing best this week?");
    expect(answer).toContain("Technology");
    expect(answer).toContain("+3.20%");

    const summary = await generateMarketSummary();
    expect(summary).toContain("Technology");
    expect(summary).toContain("Educational analysis only");
  });
});
