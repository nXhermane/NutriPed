import * as FileSystem from 'expo-file-system';

/**
 * Extrait un nom de fichier valide à partir d'une URL.
 * @param url URL complète du fichier à télécharger
 * @returns nom du fichier à utiliser pour le stockage local
 */
const extractFileNameFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Prend la partie après le dernier slash
    const pathname = urlObj.pathname;
    let filename = pathname.substring(pathname.lastIndexOf('/') + 1);

    // Optionnel : nettoyage pour enlever query params ou autres si présents
    filename = filename.split('?')[0];

    // Si l'URL ne contient pas de nom de fichier, générer un fallback
    if (!filename) {
      filename = 'downloaded_file';
    }
    return filename;
  } catch {
    // En cas d'URL invalide, fallback
    return 'downloaded_file';
  }
};

/**
 * Télécharge un fichier depuis une URL et le stocke localement.
 * S'il existe déjà, renvoie simplement le chemin local.
 * 
 * @param fileUrl URL du fichier à télécharger
 * @returns chemin local vers le fichier stocké
 */
export const downloadAndCacheFile = async (fileUrl: string, forceDownload: boolean = false): Promise<string | null> => {
  try {
    const fileName = extractFileNameFromUrl(fileUrl);
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    const { exists } = await FileSystem.getInfoAsync(fileUri);
    if (exists) {
      console.log(`Fichier déjà téléchargé : ${fileUri}`);
      if (!forceDownload) return fileUri;
    }

    const downloadResult = await FileSystem.downloadAsync(fileUrl, fileUri);
    console.log(`Fichier téléchargé avec succès : ${downloadResult.uri}`);

    return downloadResult.uri;
  } catch (error) {
    console.error("Erreur lors du téléchargement et du cache :", error);
    return null;
  }
};
