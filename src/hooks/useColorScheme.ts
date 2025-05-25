import { useState, useEffect } from "react";
import { Platform, useColorScheme as useColorSchemeRN } from "react-native";

function useWebColorScheme() {
  const [theme, setTheme] = useState<"dark" | "light">(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  );
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
      media.addEventListener("change", listener);
      return () => {
        media.removeEventListener("change", listener);
      };
    };
  }, []);
  return theme;
}

export const useColorScheme =  Platform.OS === "web" ? useWebColorScheme : useColorSchemeRN;
