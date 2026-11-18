import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AppearancePreferences = {
  darkMode: boolean;
  compactView: boolean;
  animationsEnabled: boolean;
};

const STORAGE_KEY = "marketpulse-appearance";

const defaults: AppearancePreferences = {
  darkMode: true,
  compactView: false,
  animationsEnabled: true,
};

export const readAppearancePreferences = (
  storage: Pick<Storage, "getItem">,
): AppearancePreferences => {
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (!saved) return defaults;
    const parsed: unknown = JSON.parse(saved);
    if (typeof parsed !== "object" || parsed === null) return defaults;
    const values = parsed as Partial<AppearancePreferences>;
    return {
      darkMode: typeof values.darkMode === "boolean" ? values.darkMode : defaults.darkMode,
      compactView: typeof values.compactView === "boolean" ? values.compactView : defaults.compactView,
      animationsEnabled:
        typeof values.animationsEnabled === "boolean"
          ? values.animationsEnabled
          : defaults.animationsEnabled,
    };
  } catch {
    return defaults;
  }
};

export const applyAppearancePreferences = (
  root: HTMLElement,
  preferences: AppearancePreferences,
) => {
  root.classList.toggle("light-mode", !preferences.darkMode);
  root.classList.toggle("compact-view", preferences.compactView);
  root.classList.toggle("animations-off", !preferences.animationsEnabled);
};

type AppearanceContextValue = AppearancePreferences & {
  setDarkMode: (enabled: boolean) => void;
  setCompactView: (enabled: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
};

const AppearanceContext = createContext<AppearanceContextValue | null>(null);

export const AppearanceProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<AppearancePreferences>(() =>
    typeof window === "undefined" ? defaults : readAppearancePreferences(window.localStorage),
  );

  useEffect(() => {
    applyAppearancePreferences(document.documentElement, preferences);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
    } catch {
      // Keep the setting usable for this session when browser storage is unavailable.
    }
  }, [preferences]);

  const value: AppearanceContextValue = {
    ...preferences,
    setDarkMode: (darkMode) => setPreferences((current) => ({ ...current, darkMode })),
    setCompactView: (compactView) => setPreferences((current) => ({ ...current, compactView })),
    setAnimationsEnabled: (animationsEnabled) =>
      setPreferences((current) => ({ ...current, animationsEnabled })),
  };

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
};

export const useAppearance = () => {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error("useAppearance must be used inside AppearanceProvider");
  return context;
};