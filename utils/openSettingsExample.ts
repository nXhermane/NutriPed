/**
 * Exemple d'utilisation de react-native-open-settings
 * pour ouvrir les paramètres réseau de manière plus fiable
 *
 * Installation: npm install react-native-open-settings
 * ou yarn add react-native-open-settings
 */

// import OpenSettings from 'react-native-open-settings';

/**
 * Fonction alternative utilisant react-native-open-settings
 * pour ouvrir les paramètres réseau de manière plus fiable
 */
/*
export const openNetworkSettingsAdvanced = () => {
  try {
    // Ouvrir les paramètres Wi-Fi/réseau
    OpenSettings.openWiFiSettings();

    // Autres options disponibles :
    // OpenSettings.openWiFiSettings() - Paramètres Wi-Fi
    // OpenSettings.openCellularDataSettings() - Données mobiles
    // OpenSettings.openBluetoothSettings() - Bluetooth
    // OpenSettings.openLocationSettings() - Localisation
    // OpenSettings.openAirplaneModeSettings() - Mode avion
    // OpenSettings.openGeneralSettings() - Paramètres généraux

  } catch (error) {
    console.warn('Erreur avec react-native-open-settings:', error);

    // Fallback vers Linking
    Linking.openSettings();
  }
};
*/

/**
 * URLs spécifiques pour différentes plateformes
 * (utilisables avec Linking.openURL())
 */
export const NETWORK_SETTINGS_URLS = {
  android: {
    wifi: 'android.settings.WIFI_SETTINGS',
    wireless: 'android.settings.WIRELESS_SETTINGS',
    dataUsage: 'android.settings.DATA_USAGE_SETTINGS',
    network: 'android.settings.NETWORK_OPERATOR_SETTINGS',
    general: 'android.settings.SETTINGS'
  },
  ios: {
    wifi: 'app-settings:', // iOS ouvre les paramètres de l'app
    general: 'app-settings:'
  }
} as const;

/**
 * Fonction robuste pour ouvrir les paramètres réseau
 * Utilise plusieurs méthodes en fallback
 */
export const openNetworkSettingsRobust = async (): Promise<void> => {
  const { Linking, Platform } = require('react-native');

  // Méthode 1: react-native-open-settings (si installé)
  try {
    // const OpenSettings = require('react-native-open-settings').default;
    // await OpenSettings.openWiFiSettings();
    // return;
  } catch (error) {
    console.log('react-native-open-settings non disponible, utilisation de Linking');
  }

  // Méthode 2: URLs spécifiques selon la plateforme
  if (Platform.OS === 'android') {
    const androidUrls = [
      NETWORK_SETTINGS_URLS.android.wifi,
      NETWORK_SETTINGS_URLS.android.wireless,
      NETWORK_SETTINGS_URLS.android.dataUsage,
      NETWORK_SETTINGS_URLS.android.network,
      NETWORK_SETTINGS_URLS.android.general
    ];

    for (const url of androidUrls) {
      try {
        await Linking.openURL(url);
        console.log(`Paramètres ouverts avec succès: ${url}`);
        return;
      } catch (error) {
        console.log(`URL non supportée: ${url}`);
      }
    }
  }

  // Méthode 3: Paramètres généraux
  try {
    await Linking.openSettings();
    console.log('Paramètres généraux ouverts');
  } catch (error) {
    console.error('Impossible d\'ouvrir les paramètres:', error);
  }
};
