import { describe, expect, it } from "vitest";
import {
  addCompanyToWatchlist,
  readWatchlist,
  removeCompanyFromWatchlist,
  writeWatchlist,
  type WatchItem,
} from "@/hooks/useWatchlist";

const apple = {
  id: "aapl",
  name: "Apple Inc.",
  symbol: "AAPL",
  currentPrice: 189.84,
  changePercent: 1.84,
};

const savedApple: WatchItem = {
  id: "aapl",
  name: "Apple Inc.",
  symbol: "AAPL",
  type: "Company",
  value: 189.84,
  changePercent: 1.84,
  alertSet: false,
};

describe("watchlist", () => {
  it("adds a company once with its current price and change", () => {
    const added = addCompanyToWatchlist([], apple);

    expect(added).toEqual([savedApple]);
    expect(addCompanyToWatchlist(added, apple)).toHaveLength(1);
  });

  it("removes the selected company without removing other companies", () => {
    const tesla: WatchItem = { ...savedApple, id: "tsla", name: "Tesla Inc.", symbol: "TSLA" };

    expect(removeCompanyFromWatchlist([savedApple, tesla], "aapl")).toEqual([tesla]);
  });

  it("restores saved companies from browser storage", () => {
    let savedValue: string | null = null;
    const storage = {
      getItem: () => savedValue,
      setItem: (_key: string, value: string) => {
        savedValue = value;
      },
    };

    writeWatchlist([savedApple], storage);

    expect(readWatchlist(storage)).toEqual([savedApple]);
  });
});