import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import GoogleAuthService from "@services/AuthService/GoogleAuthService";
import auth, {
  GoogleAuthProvider as FireBaseGoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
} from "@react-native-firebase/auth";
import {
  GoogleUserInfo,
  AuthData,
} from "@services/AuthService/IGoogleAuthService";
import { useToast } from "./ToastContext";


type GoogleAuthContextType = {
  onLoading: boolean;
  loginLoading: boolean;
  logoutLoading: boolean;
  revokeLoading: boolean;
  user: GoogleUserInfo | null;
  login: () => Promise<boolean>;
  logout: () => Promise<void>;
  revokeAccess: () => Promise<void>;
  isAuthenticated: () => Promise<boolean>;
  getUserInfo: () => Promise<GoogleUserInfo | null>;
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
  const [loading, setLoading] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [revokeLoading, setRevokeLoading] = useState<boolean>(false);
  const toast = useToast();
  const login = async (): Promise<boolean> => {
    try {
      setLoginLoading(true);
      setLoading(true);

      const success = await authService.login();

      if (!success) {
        toast.show("Error", "Échec de connexion", "Impossible de se connecter avec Google. Veuillez réessayer.");
        return false;
      }

      const userInfo = await authService.getUserInfo();
      const tokenData = await authService.getTokens();

      if (userInfo && tokenData) {
        if (!tokenData.idToken) {
          toast.show("Error", "Erreur d'authentification", "Token d'identification manquant. Veuillez réessayer.");
          return false;
        }

        const googleCredential = FireBaseGoogleAuthProvider.credential(tokenData.idToken);
        await signInWithCredential(getAuth(), googleCredential);
        setTokens(tokenData);

        toast.show("Success", "Connexion réussie", "Vous êtes maintenant connecté avec Google.");
        return true;
      }

      toast.show("Error", "Erreur de récupération des données", "Impossible de récupérer vos informations utilisateur.");
      return false;

    } catch (error: any) {
      const errorMessage = error.message || error.toString() || '';

      // Détection des erreurs réseau
      if (errorMessage.includes('connexion') || errorMessage.includes('réseau') ||
          errorMessage.includes('internet') || errorMessage.includes('Wi-Fi')) {
        toast.show("NetWork", "Problème de connexion internet", errorMessage);
      }
      // Détection des annulations utilisateur
      else if (errorMessage.includes('USER_CANCELLED:')) {
        toast.show("UserCancelled", "Connexion annulée", errorMessage.replace('USER_CANCELLED:', ''));
      }
      // Détection des erreurs Google Play Services
      else if (errorMessage.includes('PLAY_SERVICES_ERROR:')) {
        toast.show("Error", "Service Google indisponible", errorMessage.replace('PLAY_SERVICES_ERROR:', ''));
      }
      // Détection des connexions en cours
      else if (errorMessage.includes('CONNECTION_IN_PROGRESS:')) {
        toast.show("Info", "Connexion en cours", errorMessage.replace('CONNECTION_IN_PROGRESS:', ''));
      }
      // Détection des connexions requises
      else if (errorMessage.includes('SIGN_IN_REQUIRED:')) {
        toast.show("Info", "Connexion requise", errorMessage.replace('SIGN_IN_REQUIRED:', ''));
      }
      // Erreur générique
      else {
        toast.show("Error", "Erreur de connexion", "Une erreur inattendue s'est produite. Veuillez réessayer.");
      }

      return false;
    } finally {
      setLoginLoading(false);
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLogoutLoading(true);
      setLoading(true);

      await signOut(getAuth());
      await authService.logout();
      setUser(null);
      setTokens(null);

      toast.show("Success", "Déconnexion réussie", "Vous avez été déconnecté de votre compte Google.");
    } catch (error: any) {
      toast.show("Error", "Erreur de déconnexion", error.message || "Impossible de se déconnecter.");
    } finally {
      setLogoutLoading(false);
      setLoading(false);
    }
  };

  const revokeAccess = async (): Promise<void> => {
    try {
      setRevokeLoading(true);
      setLoading(true);

      await authService.revokeAccess();
      setUser(null);
      setTokens(null);

      toast.show("Success", "Accès révoqué", "L'accès à votre compte Google a été révoqué.");
    } catch (error: any) {
      toast.show("Error", "Erreur de révocation", error.message || "Impossible de révoquer l'accès.");
    } finally {
      setRevokeLoading(false);
      setLoading(false);
    }
  };
  const isAuthenticated = async (): Promise<boolean> => {
    return await authService.isAuthenticated();
  };
  const getUserInfo = async (): Promise<GoogleUserInfo | null> => {
    return user;
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user === null) {
        setUser(null);
      } else {
        setUser({
          email: user.email!,
          family_name: user.displayName,
          given_name: user.displayName,
          name: user.displayName,
          picture: user.photoURL,
          sub: user.uid,
        });
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);
  return (
    <GoogleAuthContext.Provider
      value={{
        user,
        tokens,
        login,
        logout,
        revokeAccess,
        isAuthenticated,
        getUserInfo,
        onLoading: loading,
        loginLoading,
        logoutLoading,
        revokeLoading
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
