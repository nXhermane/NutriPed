import { useCallback, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts, type FontFamily } from "./useFonts";

interface UseAppInitializationOptions {
  fontFamily?: FontFamily;
}

export const useAppInitialization = (options: UseAppInitializationOptions = {}) => {
  const { fontFamily = 'open-sans' } = options;

  // Charger la police sélectionnée avec les noms standard
  const [isLoaded, error] = useFonts(fontFamily);

  const onLayoutRootView = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (error) {
      console.error('Font loading error:', error.message);
    }
  }, [error]);

  return {
    appIsReady: isLoaded,
    onLayoutRootView,
    fontFamily,
  };
};
