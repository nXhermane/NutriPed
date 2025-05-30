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
      const isLogin = await this.isAuthenticated();
      if (isLogin) return true;
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        const { user } = response.data;
        return true;
      } else {
        return false;
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            // operation (eg. sign in) already in progress
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            // Android only, play services not available or outdated
            break;
          default:
            throw new Error(
              `[${NativeGoogleAuthService.name}]: Error in native google sign in service related to google.,[Error]: ${error}`
            );
        }
        return false;
      } else {
        throw new Error(
          `[${NativeGoogleAuthService.name}]: Error in native google sign in service not related to google.,[Error]: ${error}`
        );
      }
    }
  }
  async logout(): Promise<boolean> {
    const signOut = await GoogleSignin.signOut();
    return true;
  }
  async getUserInfo(): Promise<GoogleUserInfo | null> {
    try {
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
