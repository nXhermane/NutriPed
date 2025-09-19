import { AUTH_CONFIG } from "./../../config/auth";
import {
  AuthData,
  GoogleUserInfo,
  IGoogleAuthService,
} from "./IGoogleAuthService";
import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { isConnectedToInternet, getNetworkErrorMessage, isNetworkError } from "../../../utils/networkUtils";


class NativeGoogleAuthService implements IGoogleAuthService {
  constructor() {
     this.configure();
  }
  private configure() {
    GoogleSignin.configure({
      webClientId: AUTH_CONFIG.googleWebId,
      scopes: [...AUTH_CONFIG.scopes],
      offlineAccess: true,
    });
  }
  async login(): Promise<boolean> {
    try {
      // Vérifier la connectivité réseau avant de procéder
      const hasInternet = await isConnectedToInternet();
      if (!hasInternet) {
        const networkMessage = await getNetworkErrorMessage();
        throw new Error(networkMessage);
      }

      const isLogin = await this.isAuthenticated();
      if (isLogin) return true;

      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();

      return isSuccessResponse(response);
    } catch (error: any) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            throw new Error("CONNECTION_IN_PROGRESS:Une connexion Google est déjà en cours. Veuillez patienter.");
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            throw new Error("PLAY_SERVICES_ERROR:Google Play Services n'est pas disponible ou doit être mis à jour. Veuillez vérifier vos services Google Play.");
          case statusCodes.SIGN_IN_CANCELLED:
            throw new Error("USER_CANCELLED:Connexion Google annulée par l'utilisateur.");
          case statusCodes.SIGN_IN_REQUIRED:
            throw new Error("SIGN_IN_REQUIRED:Une connexion Google est requise pour continuer.");
          default:
            throw new Error("Erreur lors de la connexion Google. Veuillez réessayer.");
        }
      } else {
        // Vérifier si c'est une erreur réseau
        if (isNetworkError(error)) {
          const networkMessage = await getNetworkErrorMessage();
          throw new Error(networkMessage);
        }
        throw new Error("Erreur inattendue lors de la connexion. Veuillez vérifier votre connexion internet.");
      }
    }
  }
  async logout(): Promise<boolean> {
    const signOut = await GoogleSignin.signOut();
    return true;
  }
  async getUserInfo(): Promise<GoogleUserInfo | null> {
    try {
      // Vérifier la connectivité réseau
      const hasInternet = await isConnectedToInternet();
      if (!hasInternet) {
        console.warn('Pas de connexion internet pour récupérer les informations utilisateur');
        return null;
      }

      const userInfo = await GoogleSignin.getCurrentUser();
      if (userInfo === null) return null;
      const { user } = userInfo;
      return {
        email: user.email,
        family_name: user.familyName,
        given_name: user.givenName,
        name: user.name,
        picture: user.photo,
        sub: user.id,
      };
    } catch (e: unknown) {
      console.error(
        `[${NativeGoogleAuthService.name}]: Error in native get user info request.,[Error]: ${e}`
      );
      return null;
    }
  }
  async getTokens(): Promise<AuthData | null> {
    return await GoogleSignin.getTokens();
  }
  async isAuthenticated(): Promise<boolean> {
    try {
      return (await this.getUserInfo()) != null;
    } catch (e: unknown) {
      return false;
    }
  }
  async revokeAccess(): Promise<void> {
    await GoogleSignin.revokeAccess();
  }
}
export default NativeGoogleAuthService;
