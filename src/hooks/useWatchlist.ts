import { useEffect, useState } from "react";

const STORAGE_KEY = "marketpulse.watchlist.v1";

export type WatchItem = {
  id: string;
  name: string;
  symbol: string;
  type: string;
  value: number;
  changePercent: number;
  alertSet: boolean;
};

export type WatchableCompany = Pick<WatchItem, "id" | "name" | "symbol"> & {
  currentPrice: number;
  changePercent: number;
};

type WatchlistStorage = Pick<Storage, "getItem" | "setItem">;

const getStorage = (storage?: WatchlistStorage): WatchlistStorage | undefined => {
  if (storage) return storage;
  if (typeof window === "undefined") return undefined;

  try {
    return window.localStorage;
  } catch {
    return undefined;
  }
};

const isWatchItem = (value: unknown): value is WatchItem => {
  if (typeof value !== "object" || value === null) return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.symbol === "string" &&
    typeof item.type === "string" &&
    typeof item.value === "number" &&
    typeof item.changePercent === "number" &&
    typeof item.alertSet === "boolean"
  );
};

export function readWatchlist(storage?: WatchlistStorage): WatchItem[] {
  const target = getStorage(storage);
  if (!target) return [];

  try {
    const saved = target.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed: unknown = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed.filter(isWatchItem) : [];
  } catch {
    return [];
  }
}

export function writeWatchlist(items: WatchItem[], storage?: WatchlistStorage): void {
  const target = getStorage(storage);
  if (!target) return;

  try {
    target.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Keep the page usable when browser storage is unavailable.
  }
}

export function addCompanyToWatchlist(items: WatchItem[], company: WatchableCompany): WatchItem[] {
  if (items.some((item) => item.id === company.id)) return items;
  return [
    ...items,
    {
      id: company.id,
      name: company.name,
      symbol: company.symbol,
      type: "Company",
      value: company.currentPrice,
      changePercent: company.changePercent,
      alertSet: false,
    },
  ];
}

export function removeCompanyFromWatchlist(items: WatchItem[], id: string): WatchItem[] {
  return items.filter((item) => item.id !== id);
}

export function toggleWatchlistAlert(items: WatchItem[], id: string): WatchItem[] {
  return items.map((item) => (item.id === id ? { ...item, alertSet: !item.alertSet } : item));
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchItem[]>(() => readWatchlist());

  useEffect(() => {
    writeWatchlist(watchlist);
  }, [watchlist]);

  return {
    watchlist,
    addCompany: (company: WatchableCompany) =>
      setWatchlist((current) => addCompanyToWatchlist(current, company)),
    removeCompany: (id: string) => setWatchlist((current) => removeCompanyFromWatchlist(current, id)),
    toggleAlert: (id: string) => setWatchlist((current) => toggleWatchlistAlert(current, id)),
  };
}
