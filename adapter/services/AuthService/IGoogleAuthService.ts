export interface AuthData {
  accessToken: string;
  idToken: string; // optionnel, parfois indisponible selon l'auth flow
}

export interface GoogleUserInfo {
  sub: string; // ID unique Google de l'utilisateur
  name: string | null;
  given_name: string | null; // Prénom
  family_name: string | null; // Nom de famille
  picture: string | null; // URL de la photo de profil
  email: string; // Email de l'utilisateur
}

export interface IGoogleAuthService {
  login(): Promise<boolean>;
  logout(): Promise<boolean>;
  getUserInfo(): Promise<GoogleUserInfo | null>;
  getTokens(): Promise<AuthData | null>;
  isAuthenticated(): Promise<boolean>;
  revokeAccess(): Promise<void>;
}
