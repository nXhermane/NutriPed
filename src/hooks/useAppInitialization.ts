import { useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_100Thin,
  Poppins_200ExtraLight_Italic,
  Poppins_300Light,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_600SemiBold,
  Poppins_300Light_Italic,
  Poppins_800ExtraBold,
  Poppins_800ExtraBold_Italic,
  Poppins_900Black,
  Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import { Roboto_100Thin, Roboto_200ExtraLight, Roboto_200ExtraLight_Italic, Roboto_300Light, Roboto_300Light_Italic, Roboto_400Regular, Roboto_500Medium, Roboto_600SemiBold, Roboto_700Bold, Roboto_800ExtraBold, Roboto_800ExtraBold_Italic, Roboto_900Black, Roboto_900Black_Italic } from "@expo-google-fonts/roboto"


export const useAppInitialization = () => {
  const [isLoaded, error] = useFonts({
    SemiBold: Roboto_600SemiBold,// Poppins_600SemiBold,
    Medium: Roboto_500Medium,//Poppins_500Medium,
    Regular: Roboto_400Regular,//Poppins_400Regular,
    Thin: Roboto_100Thin, //Poppins_100Thin,
    ExtraLightItalic: Roboto_200ExtraLight, //Poppins_200ExtraLight_Italic,
    Light: Roboto_300Light,//Poppins_300Light,
    LightItalic: Roboto_300Light_Italic, //Poppins_300Light_Italic,
    Bold: Roboto_700Bold,//Poppins_700Bold,
    ExtraBold: Roboto_800ExtraBold, // Poppins_800ExtraBold,
    ExtraBoldItalic: Roboto_800ExtraBold_Italic, //Poppins_800ExtraBold_Italic,
    Black: Roboto_900Black, //Poppins_900Black,
    BlackItalic: Roboto_900Black_Italic//Poppins_900Black_Italic,
  });

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
