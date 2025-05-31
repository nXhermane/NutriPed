import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import {
  Poppins_400Regular,
  Poppins_100Thin,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_500Medium,
  
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_300Light_Italic,
  useFonts
} from "@expo-google-fonts/poppins";


export const useAppInitialization = () => {

  const [isLoaded, error] = useFonts({
    Poppins_500Medium,
    Poppins_400Regular,
    Poppins_100Thin,
    Poppins_200ExtraLight_Italic,
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_700Bold,
    Poppins_600SemiBold,
  })


  const onLayoutRootView = useCallback(async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [isLoaded]);

  return {
    appIsReady: isLoaded,
    onLayoutRootView,

  };
};
