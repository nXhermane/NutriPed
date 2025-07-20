import * as FileSystem from "expo-file-system";
import { Alert } from "react-native";
import XLSX from "xlsx";
export async function loadXlsxTemplate(templateUri: string) {
  try {
    const templateData = await FileSystem.readAsStringAsync(templateUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Convertir en ArrayBuffer pour XLSX
    const binaryString = atob(templateData);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Lire avec XLSX
    const workbook = XLSX.read(bytes, { type: "array" });
    return workbook;
  } catch (error) {
    console.error("Erreur lors du chargement du template:", error);
    Alert.alert("Erreur", "Impossible de charger le template Excel");
    return null;
  }
}
