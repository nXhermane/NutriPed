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
  GoogleAuthProvider,
  InitializationProvider,
  PediatricAppProvider,
  useInitialization,
} from "@context";
import { EventProvider } from "domain-eventrix/react";
import { Button, ButtonText } from "@/components/ui/button";
import GoogleAuthService from "@services/AuthService/GoogleAuthService";

export default function RootLayout() {
  return (
    <GluestackUIProvider mode="dark">
      <AppStateProvider>
        <EventProvider>
          <DatabaseProvider>
            <GoogleAuthProvider>
              <PediatricAppProvider>
                <InitializationProvider>
                  <Main />
                </InitializationProvider>
              </PediatricAppProvider>
            </GoogleAuthProvider>
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
  const auth = new GoogleAuthService();
  const handleLogin = async () => {
    const success = await auth.login();
    console.log(success);
  };

  return (
    <View style={styles.centered}>
      <Text style={{ textAlign: "center" }}>
        Bienvenue dans l'application !
      </Text>
      <Button
        action={"primary"}
        variant={"solid"}
        size={"lg"}
        isDisabled={false}
        onPress={handleLogin}
      >
        <ButtonText>Login</ButtonText>
      </Button>
      <Button
        action={"negative"}
        variant={"solid"}
        size={"lg"}
        isDisabled={false}
        onPress={async () => {
          const logout = await auth.logout();
          console.log(logout);
        }}
      >
        <ButtonText>Logout</ButtonText>
      </Button>
      <Button
        action={"secondary"}
        variant={"solid"}
        size={"lg"}
        isDisabled={false}
        onPress={async () => {
          const user = await auth.getUserInfo();
          console.log(user);
        }}
      >
        <ButtonText>Get User</ButtonText>
      </Button>
      <Button
        action={"secondary"}
        variant={"outline"}
        size={"lg"}
        isDisabled={false}
        onPress={async () => {
          const token = await auth.getTokens();
          console.log(token);
        }}
      >
        <ButtonText>Get Tokens</ButtonText>
      </Button>
      <Button
        action={"secondary"}
        variant={"outline"}
        size={"lg"}
        isDisabled={false}
        onPress={async () => {
          await auth.revokeAccess();
        }}
      >
        <ButtonText>Revoke access</ButtonText>
      </Button>
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
