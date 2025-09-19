import {
  AuthData,
  GoogleUserInfo,
  IGoogleAuthService,
} from "./IGoogleAuthService";
import { Platform } from "react-native";

let authService: IGoogleAuthService;

if (Platform.OS === "web") {
  // For web platform, we would need to implement web-specific auth
  // For now, we'll use a placeholder that throws an error
  authService = {
    login: async () => {
      throw new Error("Google authentication is not yet implemented for web platform.");
    },
    logout: async () => {
      throw new Error("Google authentication is not yet implemented for web platform.");
    },
    getUserInfo: async () => {
      throw new Error("Google authentication is not yet implemented for web platform.");
    },
    getTokens: async () => {
      throw new Error("Google authentication is not yet implemented for web platform.");
    },
    isAuthenticated: async () => {
      throw new Error("Google authentication is not yet implemented for web platform.");
    },
    revokeAccess: async () => {
      throw new Error("Google authentication is not yet implemented for web platform.");
    },
  };
} else {
  // For native platforms (iOS/Android), use the native implementation
  const NativeGoogleAuthService = require("./GoogleAuthService.native").default;
  authService = new NativeGoogleAuthService();
}

class GoogleAuthService implements IGoogleAuthService {
  async login(): Promise<boolean> {
    return await authService.login();
  }

  async logout(): Promise<boolean> {
    return await authService.logout();
  }

  async getUserInfo(): Promise<GoogleUserInfo | null> {
    return await authService.getUserInfo();
  }

  async getTokens(): Promise<AuthData | null> {
    return await authService.getTokens();
  }

  async isAuthenticated(): Promise<boolean> {
    return await authService.isAuthenticated();
  }

  async revokeAccess(): Promise<void> {
    return await authService.revokeAccess();
  }
}

export default GoogleAuthService;
