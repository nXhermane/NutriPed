// services/authService.js
import * as AuthSession from 'expo-auth-session';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AUTH_CONFIG } from '@/src/config/auth';
import { encryptData, decryptData } from './utils';


const config = {
  clientId: AUTH_CONFIG.googleWebId,
  redirectUri: AuthSession.makeRedirectUri({
    scheme: 'votreapp',
    path: 'redirect'
  }),
  scopes: ['profile', 'email', 'https://www.googleapis.com/auth/drive.file'],
};


// Service d'authentification
export const AuthService = {
  
  login: async () => {
    const discovery = await AuthSession.fetchDiscoveryAsync('https://accounts.google.com');
    const request = new AuthSession.AuthRequest({
      clientId: AUTH_CONFIG.googleWebId,
      
      redirectUri: config.redirectUri,
      scopes: config.scopes,
      responseType: AuthSession.ResponseType.Token,
    });
    
    const result = await request.promptAsync(discovery);
    
    if (result.type === 'success') {
      
      const authData = {
        accessToken: result.authentication!.accessToken,
        expiresIn: result.authentication!.expiresIn,
        refreshToken: result.authentication!.refreshToken,
        timestamp: Date.now()
      };
      
      // Crypter avant de stocker
      const encryptedData = await encryptData(authData);
      await AsyncStorage.setItem(AUTH_CONFIG.authDataStoreKey, JSON.stringify(encryptedData))
      return true;
    }
    return false;
  },
  
  getAuthInfo: async () => {
    try {
      const storedData = await AsyncStorage.getItem(AUTH_CONFIG.authDataStoreKey);
      
      if (!storedData) return null;
      
      const encryptedData = JSON.parse(storedData);
      const authData = await decryptData(encryptedData);
      
      const isExpired = Date.now() > (authData.timestamp + (authData.expiresIn * 1000));
      
      if (isExpired && authData.refreshToken) {
        return await AuthService.refreshToken(authData.refreshToken);
      }
      
      return authData;
    } catch (error) {
      console.error(`Erreur lors de la récupération des informations d'authentification:`, error);
      return null;
    }
  },
  
  // Rafraîchir le token d'accès
  refreshToken: async (refreshToken: string) => {
   
    try {
      const response = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `client_id=${config.clientId}&refresh_token=${refreshToken}&grant_type=refresh_token`,
      });
      
      const data = await response.json();
      
      if (data.access_token) {
        const authData = {
          accessToken: data.access_token,
          expiresIn: data.expires_in,
          refreshToken: refreshToken, 
          timestamp: Date.now()
        };
        
        // Crypter et stocker
        const encryptedData = await encryptData(authData);
        await AsyncStorage.setItem(AUTH_CONFIG.authDataStoreKey, JSON.stringify(encryptedData));
        
        return authData;
      }
      
      throw new Error('Échec du rafraîchissement du token');
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      await AsyncStorage.removeItem(AUTH_CONFIG.authDataStoreKey);
      return null;
    }
  },
  
  // Déconnexion
  logout: async () => {
    await AsyncStorage.removeItem(AUTH_CONFIG.authDataStoreKey);
    return true;
  },
  
  isAuthenticated: async () => {
    const authInfo = await AuthService.getAuthInfo();
    return !!authInfo?.accessToken;
  }
};

export default AuthService;