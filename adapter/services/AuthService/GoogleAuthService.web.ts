import {
  AuthData,
  GoogleUserInfo,
  IGoogleAuthService,
} from "./IGoogleAuthService";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { AUTH_CONFIG } from "./../../config/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { encryptData, decryptData } from "./utils";

WebBrowser.maybeCompleteAuthSession();

const discovery = AUTH_CONFIG.discovery

const AUTH_KEY = AUTH_CONFIG.authDataStoreKey;
const USER_KEY = AUTH_CONFIG.userDataStoreKey;

async function saveAuthData(data: AuthData) {
  const encrypted = await encryptData(data);
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(encrypted));
}

async function getAuthData(): Promise<AuthData | null> {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  const encrypted = JSON.parse(raw);
  return await decryptData(encrypted);
}

async function saveUserInfo(data: GoogleUserInfo) {
  const encrypted = await encryptData(data);
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(encrypted));
}

async function getUserInfoFromStorage(): Promise<GoogleUserInfo | null> {
  const raw = await AsyncStorage.getItem(USER_KEY);
  if (!raw) return null;
  const encrypted = JSON.parse(raw);
  return await decryptData(encrypted);
}

class WebGoogleAuthService implements IGoogleAuthService {
  private accessToken: string | null = null;
  private idToken: string | null = null;
  private userInfo: GoogleUserInfo | null = null;

  async login(): Promise<boolean> {
    try {
      const isLogin = await this.isAuthenticated();
      if (isLogin) return true;
      const redirectUri = AuthSession.makeRedirectUri({
        preferLocalhost: true,
      });

      const authRequest = new AuthSession.AuthRequest({
        responseType: AuthSession.ResponseType.Code,
        clientId: AUTH_CONFIG.googleWebId,
        scopes: ["openid", "profile", "email"],
        redirectUri,
        usePKCE: true,
      });

      await authRequest.makeAuthUrlAsync(discovery);
      const result = await authRequest.promptAsync(discovery);

      if (result.type === "success" && result.params.code) {
        const codeVerifier = authRequest.codeVerifier;
        const tokenResponse = await fetch(discovery.tokenEndpoint!, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code: result.params.code,
            client_id: AUTH_CONFIG.googleWebId,
            client_secret: AUTH_CONFIG.googleWebClientSecret,
            redirect_uri: redirectUri,
            code_verifier: codeVerifier!,
          }).toString(),
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
          this.accessToken = tokenData.access_token;
          this.idToken = tokenData.id_token;

          // Enregistre les tokens
          await saveAuthData({
            accessToken: this.accessToken!,
            idToken: this.idToken!,
          });

          // Récupère et enregistre les infos utilisateur
          const userInfo = await this.getUserInfo();
          if (userInfo) {
            await saveUserInfo(userInfo);
          }

          return true;
        } else {
          console.error("Token exchange failed", tokenData);
          return false;
        }
      }

      return false;
    } catch (error) {
      console.error(`[${WebGoogleAuthService.name}]: Login error`, error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      if (this.accessToken) {
        await fetch(discovery.revocationEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `token=${this.accessToken}`,
        });
      }

      this.accessToken = null;
      this.idToken = null;
      this.userInfo = null;

      await AsyncStorage.removeItem(AUTH_KEY);
      await AsyncStorage.removeItem(USER_KEY);

      return true;
    } catch (error) {
      console.error(`[${WebGoogleAuthService.name}]: Logout error`, error);
      return false;
    }
  }

  async getUserInfo(): Promise<GoogleUserInfo | null> {
    if (this.userInfo) return this.userInfo;
    if (!this.accessToken) return await getUserInfoFromStorage();

    try {
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch user info");

      const data = await response.json();
      this.userInfo = {
        email: data.email,
        family_name: data.family_name,
        given_name: data.given_name,
        name: data.name,
        picture: data.picture,
        sub: data.sub,
      };

      return this.userInfo;
    } catch (error) {
      console.error(`[${WebGoogleAuthService.name}]: UserInfo error`, error);
      return null;
    }
  }

  async getTokens(): Promise<AuthData | null> {
    if (this.accessToken && this.idToken) {
      return {
        accessToken: this.accessToken,
        idToken: this.idToken,
      };
    }

    return await getAuthData();
  }

  async isAuthenticated(): Promise<boolean> {
    const tokens = await this.getTokens();
    if (!tokens) return false;

    this.accessToken = tokens.accessToken;
    this.idToken = tokens.idToken;
    this.userInfo = await getUserInfoFromStorage();

    return this.userInfo != null;
  }

  async revokeAccess(): Promise<void> {
    try {
      await this.logout();
    } catch (error) {
      console.error("Erreur lors de la révocation d'accès:", error);
      throw error;
    }
  }
}

export default WebGoogleAuthService;
