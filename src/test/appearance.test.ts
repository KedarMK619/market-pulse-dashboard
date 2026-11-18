import { beforeEach, describe, expect, it } from "vitest";
import {
  applyAppearancePreferences,
  readAppearancePreferences,
  type AppearancePreferences,
} from "@/contexts/AppearanceContext";

describe("appearance preferences", () => {
  let root: HTMLElement;

  beforeEach(() => {
    root = document.createElement("html");
  });

  it("applies dark mode and restores its saved value", () => {
    const preferences: AppearancePreferences = {
      darkMode: false,
      compactView: false,
      animationsEnabled: true,
    };
    applyAppearancePreferences(root, preferences);

    expect(root.classList.contains("light-mode")).toBe(true);
    expect(readAppearancePreferences({ getItem: () => JSON.stringify(preferences) }).darkMode).toBe(false);
  });

  it("applies compact view and restores its saved value", () => {
    const preferences: AppearancePreferences = {
      darkMode: true,
      compactView: true,
      animationsEnabled: true,
    };
    applyAppearancePreferences(root, preferences);

    expect(root.classList.contains("compact-view")).toBe(true);
    expect(readAppearancePreferences({ getItem: () => JSON.stringify(preferences) }).compactView).toBe(true);
  });

  it("disables animations and restores the saved choice", () => {
    const preferences: AppearancePreferences = {
      darkMode: true,
      compactView: false,
      animationsEnabled: false,
    };
    applyAppearancePreferences(root, preferences);

    expect(root.classList.contains("animations-off")).toBe(true);
    expect(readAppearancePreferences({ getItem: () => JSON.stringify(preferences) }).animationsEnabled).toBe(false);
  });
});