import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";

export const useAppInitialization = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Charger les fonts
        await Font.loadAsync({
          // Vos fonts personnalisées ici
        });

        setFontsLoaded(true);
        setAppIsReady(true);
      } catch (e) {
        console.warn(e);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady && fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  return {
    appIsReady: appIsReady && fontsLoaded,
    onLayoutRootView,
    setAppIsReady,
  };
};
