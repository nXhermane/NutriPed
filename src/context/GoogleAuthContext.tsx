import { createContext, ReactNode, useContext, useState } from "react";
import GoogleAuthService from "@services/AuthService/GoogleAuthService";
import {
  GoogleUserInfo,
  AuthData,
} from "@services/AuthService/IGoogleAuthService";

type GoogleAuthContextType = {
  user: GoogleUserInfo | null;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  revokeAccess: () => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
  tokens: AuthData | null;
};

export const GoogleAuthContext = createContext<GoogleAuthContextType>(
  {} as GoogleAuthContextType
);

const authService = new GoogleAuthService();

export interface GoogleAuthProviderProps {
  children: ReactNode;
}
export const GoogleAuthProvider: React.FC<GoogleAuthProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<GoogleUserInfo | null>(null);
  const [tokens, setTokens] = useState<AuthData | null>(null);

  const login = async (): Promise<boolean> => {
    const success = await authService.login();
    if (!success) return false;
    const userInfo = await authService.getUserInfo();
    const tokenData = await authService.getTokens();
    if (userInfo && tokenData) {
      setUser(userInfo);
      setTokens(tokenData);
      return true;
    }
    return false;
  };

  const logout = async (): Promise<void> => {
    await authService.logout();
    setUser(null);
    setTokens(null);
  };

  const revokeAccess = async (): Promise<void> => {
    await authService.revokeAccess();
    setUser(null);
    setTokens(null);
  };
  const isAuthenticated = async (): Promise<boolean> => {
    return await authService.isAuthenticated();
  };

  return (
    <GoogleAuthContext.Provider
      value={{
        user,
        tokens,
        login,
        logout,
        revokeAccess,
        isAuthenticated,
      }}
    >
      {children}
    </GoogleAuthContext.Provider>
  );
};

export const useGoogleAuth = (): GoogleAuthContextType => {
  const context = useContext(GoogleAuthContext);
  if (!context) {
    throw new Error("useGoogleAuth must be used within GoogleAuthProvider");
  }
  return context;
};
