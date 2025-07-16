// import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
// import React, {
//   createContext,
//   ReactNode,
//   useContext,
//   useMemo,
//   useState,
// } from "react";
// import { StatusBar } from "expo-status-bar";
// import variables from "@/scaling";
// import { vars } from "nativewind";
// import { View } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// export interface UIContextType {
//   colorMode: "dark" | "light";
//   handleColorMode: (value?: "dark" | "light") => void;
// }

// export const UIContext = createContext<UIContextType>({} as UIContextType);

// export interface UIContextProviderProps {
//   children: ReactNode;
// }

// export const UIProvider: React.FC<UIContextProviderProps> = ({ children }) => {
//   const [colorMode, setColorMode] = useState<"dark" | "light">("dark");

//   const generatedVars = useMemo(() => vars(variables), [variables]);
//   const handleColorMode = (value?: "dark" | "light") => {
//     setColorMode(prev => {
//       if (value) {
//         return value;
//       }
//       return prev === "light" ? "dark" : "light";
//     });
//   };

//   return (
//     <React.Fragment>
//       <StatusBar
//         style="auto"
//         // backgroundColor={`${colorMode == "light" ? "#F6F6F6" : "#272625"}`}
//       />
//       <UIContext.Provider
//         value={{
//           colorMode: colorMode,
//           handleColorMode,
//         }}
//       >
//         <View
//           style={[
//             {
//               flex: 1,
//               height: "100%",
//               width: "100%",
//             },
//             generatedVars,
//           ]}
//         >
//           <GestureHandlerRootView style={{ flex: 1 }}>
//             <GluestackUIProvider mode={colorMode}>
//               {children}
//             </GluestackUIProvider>
//           </GestureHandlerRootView>
//         </View>
//       </UIContext.Provider>
//     </React.Fragment>
//   );
// };

// export function useUI() {
//   const context = useContext(UIContext);
//   if (!context) {
//     throw new Error("useUI must be used within UIProvider");
//   }
//   return context;
// }
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
  useEffect,
} from "react";
import { StatusBar } from "expo-status-bar";
import { Appearance, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import variables from "@/scaling";
import { vars } from "nativewind";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export interface UIContextType {
  colorMode: "dark" | "light";
  handleColorMode: (value?: "dark" | "light") => void;
  isSystemTheme: boolean; // Pour savoir si on utilise encore le thème système
  resetToSystemTheme: () => void; // Pour revenir au thème système
}

export const UIContext = createContext<UIContextType>({} as UIContextType);

export interface UIContextProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = "@theme_preference";

export const UIProvider: React.FC<UIContextProviderProps> = ({ children }) => {
  // État pour savoir si l'utilisateur a déjà changé manuellement le thème
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  // Fonction pour obtenir le thème système actuel
  const getSystemTheme = (): "dark" | "light" => {
    return Appearance.getColorScheme() === "dark" ? "dark" : "light";
  };

  // État initial basé sur le thème système
  const [colorMode, setColorMode] = useState<"dark" | "light">(getSystemTheme);

  // Initialiser le thème au démarrage
  useEffect(() => {
    const initializeTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);

        if (savedTheme === null) {
          // Aucune préférence sauvegardée, on utilise le thème système
          setColorMode(getSystemTheme());
          setIsSystemTheme(true);
        } else if (savedTheme === "system") {
          // L'utilisateur a choisi de suivre le système
          setColorMode(getSystemTheme());
          setIsSystemTheme(true);
        } else {
          // L'utilisateur a une préférence manuelle
          setColorMode(savedTheme as "dark" | "light");
          setIsSystemTheme(false);
        }
      } catch (error) {
        console.error("Error loading theme preference:", error);
        setColorMode(getSystemTheme());
        setIsSystemTheme(true);
      }
      setIsInitialized(true);
    };

    initializeTheme();
  }, []);

  // Écouter les changements du thème système seulement si l'utilisateur n'a pas encore changé manuellement
  useEffect(() => {
    if (!isSystemTheme || !isInitialized) return;

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const systemTheme = colorScheme === "dark" ? "dark" : "light";
      setColorMode(systemTheme);
    });

    return () => subscription?.remove();
  }, [isSystemTheme, isInitialized]);

  const generatedVars = useMemo(() => vars(variables), [variables]);

  const handleColorMode = async (value?: "dark" | "light") => {
    // Dès que l'utilisateur change manuellement le thème, on arrête de suivre le système
    setIsSystemTheme(false);

    const newTheme = value || (colorMode === "light" ? "dark" : "light");
    setColorMode(newTheme);

    // Sauvegarder la préférence
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  const resetToSystemTheme = async () => {
    setIsSystemTheme(true);
    setColorMode(getSystemTheme());

    // Sauvegarder que l'utilisateur veut suivre le système
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, "system");
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Ne pas rendre le contenu tant que le thème n'est pas initialisé
  if (!isInitialized) {
    return null; // ou un loading spinner
  }

  return (
    <React.Fragment>
      <StatusBar
        style="auto"
        // backgroundColor={`${colorMode == "light" ? "#F6F6F6" : "#272625"}`}
      />
      <UIContext.Provider
        value={{
          colorMode: colorMode,
          handleColorMode,
          isSystemTheme,
          resetToSystemTheme,
        }}
      >
        <View
          style={[
            {
              flex: 1,
              height: "100%",
              width: "100%",
            },
            generatedVars,
          ]}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <GluestackUIProvider mode={colorMode}>
              {children}
            </GluestackUIProvider>
          </GestureHandlerRootView>
        </View>
      </UIContext.Provider>
    </React.Fragment>
  );
};

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error("useUI must be used within UIProvider");
  }
  return context;
}