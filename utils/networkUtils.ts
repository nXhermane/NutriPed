import * as Network from 'expo-network';

export interface NetworkState {
  isConnected: boolean;
  type: string;
  isInternetReachable: boolean | null;
}

/**
 * Vérifie l'état de la connexion réseau
 */
export const checkNetworkConnectivity = async (): Promise<NetworkState> => {
  try {
    const networkState = await Network.getNetworkStateAsync();
    return {
      isConnected: networkState.isConnected ?? false,
      type: networkState.type ?? 'unknown',
      isInternetReachable: networkState.isInternetReachable ?? null,
    };
  } catch (error) {
    console.error('Erreur lors de la vérification de la connectivité réseau:', error);
    return {
      isConnected: false,
      type: 'unknown',
      isInternetReachable: false,
    };
  }
};

/**
 * Vérifie si l'appareil est connecté à internet
 */
export const isConnectedToInternet = async (): Promise<boolean> => {
  const networkState = await checkNetworkConnectivity();
  return networkState.isConnected && networkState.isInternetReachable !== false;
};

/**
 * Détermine si une erreur est liée à un problème de réseau
 * Version plus restrictive pour éviter les faux positifs
 */
export const isNetworkError = (error: any): boolean => {
  if (!error) return false;

  const errorMessage = error.message || error.toString() || '';
  const errorCode = error.code || '';

  // Erreurs réseau spécifiques (plus restrictives)
  const networkErrorPatterns = [
    'network request failed',
    'unable to resolve host',
    'connection timed out',
    'no address associated with hostname',
    'connection refused',
    'connection reset',
    'connection aborted',
    'network is unreachable',
    'temporary failure in name resolution',
    'name resolution failure',
    'dns',
    'econnrefused',
    'enotfound',
    'econnreset',
    'etimedout',
    'net::err_internet_disconnected',
    'net::err_network_changed',
    'net::err_connection_refused',
    'failed to fetch',
    'server unreachable',
    'host unreachable',
    'no route to host',
  ];

  const lowerMessage = errorMessage.toLowerCase();
  const lowerCode = errorCode.toLowerCase();

  const isNetwork = networkErrorPatterns.some(pattern =>
    lowerMessage.includes(pattern) || lowerCode.includes(pattern)
  );



  return isNetwork;
};

/**
 * Teste la connectivité réseau en faisant une requête HTTP simple
 */
export const testNetworkConnectivity = async (): Promise<boolean> => {
  try {
    // Test avec une requête simple vers Google
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout de 5 secondes

    const response = await fetch('https://www.google.com/favicon.ico', {
      method: 'HEAD',
      signal: controller.signal,
      cache: 'no-cache',
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log('Test de connectivité réseau échoué:', error);
    return false;
  }
};

/**
 * Vérification complète de la connectivité réseau
 */
export const checkFullNetworkConnectivity = async (): Promise<{
  isConnected: boolean;
  canReachInternet: boolean;
  message: string;
}> => {
  const networkState = await checkNetworkConnectivity();
  const canReachInternet = await testNetworkConnectivity();

  let message = "";

  if (!networkState.isConnected) {
    message = "Aucune connexion réseau détectée. Veuillez vérifier votre connexion Wi-Fi ou données mobiles.";
  } else if (!canReachInternet) {
    if (networkState.isInternetReachable === false) {
      message = "Connexion internet limitée ou indisponible. Veuillez vérifier votre connexion.";
    } else if (networkState.type === 'cellular') {
      message = "Vous utilisez une connexion données mobiles. Assurez-vous d'avoir un signal suffisant.";
    } else if (networkState.type === 'wifi') {
      message = "Problème de connexion Wi-Fi détecté. Essayez de vous reconnecter au réseau Wi-Fi.";
    } else {
      message = "Problème de connexion internet détecté. Veuillez vérifier vos paramètres réseau.";
    }
  }

  return {
    isConnected: networkState.isConnected,
    canReachInternet,
    message,
  };
};



/**
 * Obtient un message d'erreur approprié selon l'état du réseau
 */
export const getNetworkErrorMessage = async (): Promise<string> => {
  const result = await checkFullNetworkConnectivity();
  return result.message || "Problème de connexion internet détecté. Veuillez vérifier vos paramètres réseau.";
};
