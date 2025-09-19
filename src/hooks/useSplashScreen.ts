import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

export function useSplashScreen() {
  useEffect(() => {
    // Configure l'animation du splash screen
    SplashScreen.setOptions({
      duration: 800, // Durée de l'animation en ms
      fade: true,    // Animation de fondu
    });

    // Hide splash screen after app is ready
    const hideSplashScreen = async () => {
      try {
        // Attendre un peu pour les ressources (fonts, data, etc.)
        await new Promise(resolve => setTimeout(resolve, 1500));
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    };

    hideSplashScreen();
  }, []);
}

// Utility function to manually hide splash screen when needed
export const hideSplashScreen = async () => {
  try {
    await SplashScreen.hideAsync();
  } catch (error) {
    console.warn('Error hiding splash screen:', error);
  }
};

// Utility function to manually show splash screen when needed
export const showSplashScreen = async () => {
  try {
    await SplashScreen.preventAutoHideAsync();
  } catch (error) {
    console.warn('Error showing splash screen:', error);
  }
};
