import { useFonts as useExpoFonts } from 'expo-font';
import {
  Lato_100Thin,
  Lato_100Thin_Italic,
  Lato_300Light,
  Lato_300Light_Italic,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
  Lato_900Black,
  Lato_900Black_Italic,
} from '@expo-google-fonts/lato';

import {
  OpenSans_300Light,
  OpenSans_300Light_Italic,
  OpenSans_400Regular,
  OpenSans_400Regular_Italic,
  OpenSans_500Medium,
  OpenSans_500Medium_Italic,
  OpenSans_600SemiBold,
  OpenSans_600SemiBold_Italic,
  OpenSans_700Bold,
  OpenSans_700Bold_Italic,
  OpenSans_800ExtraBold,
  OpenSans_800ExtraBold_Italic,
} from '@expo-google-fonts/open-sans';

import {
  Roboto_100Thin,
  Roboto_100Thin_Italic,
  Roboto_300Light,
  Roboto_300Light_Italic,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_600SemiBold,
  Roboto_700Bold,
  Roboto_700Bold_Italic,
  Roboto_900Black,
  Roboto_900Black_Italic,
} from '@expo-google-fonts/roboto';

export type FontFamily = 'lato' | 'open-sans' | 'roboto';

interface FontConfig {
  [key: string]: any;
}

// Configuration avec les anciens noms de polices pour compatibilité Tailwind
const FONT_CONFIGS: Record<FontFamily, FontConfig> = {
  'lato': {
    // Anciens noms utilisés dans Tailwind
    'SemiBold': Lato_700Bold, // Fallback
    'Medium': Lato_400Regular, // Fallback
    'Regular': Lato_400Regular,
    'Thin': Lato_100Thin,
    'ExtraLightItalic': Lato_300Light_Italic, // Fallback
    'Light': Lato_300Light,
    'LightItalic': Lato_300Light_Italic,
    'Bold': Lato_700Bold,
    'ExtraBold': Lato_900Black, // Fallback
    'ExtraBoldItalic': Lato_900Black_Italic, // Fallback
    'Black': Lato_900Black,
    'BlackItalic': Lato_900Black_Italic,
  },
  'open-sans': {
    // Anciens noms utilisés dans Tailwind
    'SemiBold': OpenSans_600SemiBold,
    'Medium': OpenSans_500Medium,
    'Regular': OpenSans_400Regular,
    'Thin': OpenSans_300Light,
    'ExtraLightItalic': OpenSans_300Light_Italic,
    'Light': OpenSans_300Light,
    'LightItalic': OpenSans_300Light_Italic,
    'Bold': OpenSans_700Bold,
    'ExtraBold': OpenSans_800ExtraBold,
    'ExtraBoldItalic': OpenSans_800ExtraBold_Italic,
    'Black': OpenSans_800ExtraBold, // Fallback
    'BlackItalic': OpenSans_800ExtraBold_Italic,
  },
  'roboto': {
    // Anciens noms utilisés dans Tailwind (originaux)
    'SemiBold': Roboto_500Medium, // Fallback
    'Medium': Roboto_500Medium,
    'Regular': Roboto_400Regular,
    'Thin': Roboto_100Thin,
    'ExtraLightItalic': Roboto_300Light_Italic, // Fallback
    'Light': Roboto_300Light,
    'LightItalic': Roboto_300Light_Italic,
    'Bold': Roboto_700Bold,
    'ExtraBold': Roboto_700Bold, // Fallback
    'ExtraBoldItalic': Roboto_700Bold_Italic, // Fallback
    'Black': Roboto_900Black,
    'BlackItalic': Roboto_900Black_Italic,
  },
};

/**
 * Hook personnalisé pour charger les polices avec noms standard
 * @param fontFamily - La famille de police à charger ('lato', 'open-sans', 'roboto')
 * @returns Un tuple [fontsLoaded, error] comme useFonts d'expo-font
 */
export function useFonts(fontFamily: FontFamily) {
  const fontConfig = FONT_CONFIGS[fontFamily];

  if (!fontConfig) {
    throw new Error(`Police '${fontFamily}' non supportée. Polices disponibles: ${Object.keys(FONT_CONFIGS).join(', ')}`);
  }

  return useExpoFonts(fontConfig);
}

/**
 * Fonction utilitaire pour charger une police spécifique avec noms standard
 * @param fontFamily - La famille de police à charger
 * @returns Promise résolue quand la police est chargée
 */
export async function loadFonts(fontFamily: FontFamily): Promise<void> {
  const fontConfig = FONT_CONFIGS[fontFamily];

  if (!fontConfig) {
    throw new Error(`Police '${fontFamily}' non supportée. Polices disponibles: ${Object.keys(FONT_CONFIGS).join(', ')}`);
  }

  const [fontsLoaded] = useExpoFonts(fontConfig);

  return new Promise((resolve, reject) => {
    if (fontsLoaded) {
      resolve();
    } else {
      // Attendre un peu et vérifier à nouveau
      setTimeout(() => {
        const [fontsLoadedRetry] = useExpoFonts(fontConfig);
        if (fontsLoadedRetry) {
          resolve();
        } else {
          reject(new Error(`Échec du chargement de la police '${fontFamily}'`));
        }
      }, 100);
    }
  });
}

/**
 * Liste des polices disponibles
 */
export const AVAILABLE_FONTS: FontFamily[] = Object.keys(FONT_CONFIGS) as FontFamily[];

/**
 * Configuration des polices pour référence
 */
export const FONT_FAMILIES = {
  LATO: 'lato' as FontFamily,
  OPEN_SANS: 'open-sans' as FontFamily,
  ROBOTO: 'roboto' as FontFamily,
} as const;

/**
 * Noms de polices standard utilisables dans toute l'app
 * Peu importe la police chargée, ces noms restent les mêmes
 */
export const FONT_NAMES = {
  THIN: 'font-thin',
  THIN_ITALIC: 'font-thin-italic',
  LIGHT: 'font-light',
  LIGHT_ITALIC: 'font-light-italic',
  REGULAR: 'font-regular',
  REGULAR_ITALIC: 'font-regular-italic',
  MEDIUM: 'font-medium',
  MEDIUM_ITALIC: 'font-medium-italic',
  SEMIBOLD: 'font-semibold',
  SEMIBOLD_ITALIC: 'font-semibold-italic',
  BOLD: 'font-bold',
  BOLD_ITALIC: 'font-bold-italic',
  EXTRABOLD: 'font-extrabold',
  EXTRABOLD_ITALIC: 'font-extrabold-italic',
  BLACK: 'font-black',
  BLACK_ITALIC: 'font-black-italic',
} as const;
