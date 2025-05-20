import {
  AuthData,
  GoogleUserInfo,
  IGoogleAuthService,
} from "./IGoogleAuthService";

class GoogleAuthService implements IGoogleAuthService {
  revokeAccess(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  login(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  logout(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  getUserInfo(): Promise<GoogleUserInfo | null> {
    throw new Error("Method not implemented.");
  }
  getTokens(): Promise<AuthData | null> {
    throw new Error("Method not implemented.");
  }
  isAuthenticated(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}

export default GoogleAuthService;
