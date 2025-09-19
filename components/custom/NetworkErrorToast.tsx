import { WifiOff, Settings } from "lucide-react-native";
import { HStack } from "../ui/hstack";
import { Toast, ToastTitle, ToastDescription } from "../ui/toast";
import { VStack } from "../ui/vstack";
import { Icon } from "../ui/icon";
import { Button, ButtonText } from "../ui/button";
import * as Linking from 'expo-linking';
import { Platform } from "react-native";

export interface NetworkErrorToastProps {
  id: string;
  title?: string;
  desc?: string;
  showSettingsButton?: boolean;
}

export const NetworkErrorToast: React.FC<NetworkErrorToastProps> = ({
  id,
  title = "Problème de connexion",
  desc = "Vérifiez votre connexion internet",
  showSettingsButton = true
}) => {
  const toastId = "toast-" + id;

  const openNetworkSettings = async () => {
    try {
      // Méthode 1: URL spécifique suggérée par l'utilisateur pour Android
      if (Platform.OS === 'android') {
        try {
          // URL spécifique pour les paramètres Wi-Fi Android
          await Linking.openURL('package:com.android.settings');// TODO: this not work like the expectation so i have the possibilitie to use expo-intent-launcher 
          console.log('Paramètres Wi-Fi ouverts avec succès');
          return;
        } catch (androidError) {
          console.log('URL spécifique Android non supportée, essai des URLs génériques...');

          // Essayer les URLs génériques Android
          const androidUrls = [
            'android.settings.WIFI_SETTINGS',
            'android.settings.WIRELESS_SETTINGS',
            'android.settings.DATA_USAGE_SETTINGS',
          ];

          for (const url of androidUrls) {
            try {
              await Linking.openURL(url);
              console.log(`Paramètres ouverts avec: ${url}`);
              return;
            } catch (urlError) {
              console.log(`URL ${url} non supportée`);
            }
          }
        }
      }

      // Méthode 2: Paramètres généraux pour iOS ou fallback Android
      console.log('Utilisation des paramètres généraux');
      await Linking.openSettings();

    } catch (error) {
      console.warn('Toutes les méthodes d\'ouverture des paramètres ont échoué:', error);

      // Méthode 3: Dernier fallback
      try {
        if (Platform.OS === 'ios') {
          await Linking.openURL('app-settings:');
        } else {
          // Pour Android, essayer une dernière fois les paramètres généraux
          await Linking.openSettings();
        }
      } catch (finalError) {
        console.error('Impossible d\'ouvrir les paramètres système:', finalError);
      }
    }
  };

  return (
    <Toast
      nativeID={toastId}
      style={{
        alignSelf: "center",
      }}
      className={
        "elevation-sm w-[95%] overflow-hidden rounded-2xl border border-primary-border/5 bg-background-secondary p-4"
      }
    >
      <VStack className="gap-3">
        <HStack className="gap-3">
          <Icon
            as={WifiOff}
            className={
              "h-6 w-6 items-center justify-center rounded-full bg-orange-700 text-white dark:bg-orange-500"
            }
          />

          <VStack className="flex-1">
            {title && (
              <ToastTitle
                className={
                  "text-base font-semibold text-orange-700 dark:text-orange-400"
                }
              >
                {title}
              </ToastTitle>
            )}
            {desc && (
              <ToastDescription
                className={
                  "mt-1 text-sm text-typography-primary_light dark:text-gray-300"
                }
              >
                {desc}
              </ToastDescription>
            )}
          </VStack>
        </HStack>

        {showSettingsButton && (
          <Button
            size="sm"
            variant="outline"
            className="self-end"
            onPress={openNetworkSettings}
          >
            <Icon as={Settings} className="h-4 w-4 mr-2" />
            <ButtonText size="sm">Paramètres réseau</ButtonText>
          </Button>
        )}
      </VStack>
    </Toast>
  );
};
