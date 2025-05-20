import { AUTH_CONFIG } from "@/adapter/config/auth";
import CryptoJS from "crypto-js";

// Chiffrement
export const encryptData = (data: any) => {
  return CryptoJS.AES.encrypt(
    JSON.stringify(data),
    AUTH_CONFIG.secret_crypt_key
  ).toString();
};

// Déchiffrement
export const decryptData = (encryptedData: string) => {
  const bytes = CryptoJS.AES.decrypt(
    encryptedData,
    AUTH_CONFIG.secret_crypt_key
  );
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return JSON.parse(decrypted);
};
