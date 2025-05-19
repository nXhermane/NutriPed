import React from "react";
import "react-native-reanimated";
import "react-native-get-random-values";
import { Text } from "@/components/ui/text";
import { View, ActivityIndicator } from "react-native";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { useColorScheme } from "@/components/useColorScheme";
import {
  AppStateProvider,
  DatabaseProvider,
  InitializationProvider,
  PediatricAppProvider,
  useInitialization,
} from "@context";
import { EventProvider } from "domain-eventrix/react";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <AppStateProvider>
        <EventProvider>
          <DatabaseProvider>
            <PediatricAppProvider>
              <InitializationProvider>
                <Main />
              </InitializationProvider>
            </PediatricAppProvider>
          </DatabaseProvider>
        </EventProvider>
      </AppStateProvider>
    </GluestackUIProvider>
  );
}

function Main() {
  const {
    isInitialized,
    isLoading,
    progress,
    currentStage,
    statusMessage,
    error,
    initializeApp,
  } = useInitialization();

  React.useEffect(() => {
    if (!isInitialized && !isLoading) {
      initializeApp();
    }
  }, [isInitialized, isLoading]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>{statusMessage || "Initialisation en cours..."}</Text>
        <Text>{`Étape : ${currentStage}`}</Text>
        <Text>{`Progression : ${progress.toFixed(0)}%`}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "red" }}>{error}</Text>
        <Text
          onPress={initializeApp}
          style={{ textDecorationLine: "underline", marginTop: 10 }}
        >
          Réessayer
        </Text>
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={styles.centered}>
        <Text>L'application n'a pas pu être initialisée.</Text>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Text style={{ textAlign: "center" }}>
        Bienvenue dans l'application !
      </Text>
    </View>
  );
}

const styles = {
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  } as const,
};
