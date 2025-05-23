import { useCallback, useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import {
  Poppins_400Regular,
  Poppins_100Thin,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_300Light_Italic,
} from "@expo-google-fonts/poppins";

export const useAppInitialization = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Charger les fonts
        await Font.loadAsync({
          Poppins_500Medium,
          Poppins_400Regular,
          Poppins_100Thin,
          Poppins_200ExtraLight_Italic,
          Poppins_300Light,
          Poppins_300Light_Italic,
          Poppins_700Bold,
          Poppins_600SemiBold,
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
