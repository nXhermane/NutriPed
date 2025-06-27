import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import React, {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";
import { StatusBar } from "expo-status-bar";
import variables from "@/scaling";
import { vars } from "nativewind";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export interface UIContextType {
  colorMode: "dark" | "light";
  handleColorMode: (value?: "dark" | "light") => void;
}

export const UIContext = createContext<UIContextType>({} as UIContextType);

export interface UIContextProviderProps {
  children: ReactNode;
}

export const UIProvider: React.FC<UIContextProviderProps> = ({ children }) => {
  const [colorMode, setColorMode] = useState<"dark" | "light">("dark");

  const generatedVars = useMemo(() => vars(variables), [variables]);
  const handleColorMode = (value?: "dark" | "light") => {
    setColorMode(prev => {
      if (value) {
        return value;
      }
      return prev === "light" ? "dark" : "light";
    });
  };
  return (
    <React.Fragment>
      <StatusBar
        style="auto"
        // backgroundColor={`${colorMode == "light" ? "#F6F6F6" : "#272625"}`}
      />
      <UIContext.Provider
        value={{
          colorMode,
          handleColorMode,
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
