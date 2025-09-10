import * as FileSystem from "expo-file-system";

async function waitForFileToExist(
  uri: string,
  timeout = 5000
): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const info = await FileSystem.getInfoAsync(uri);
    if (info.exists && info.size > 0) return true;
    await new Promise(resolve => setTimeout(resolve, 100)); // petite pause avant de réessayer
  }
  return false;
}

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
    let filename = pathname.substring(pathname.lastIndexOf("/") + 1);

    // Optionnel : nettoyage pour enlever query params ou autres si présents
    filename = filename.split("?")[0];

    // Si l'URL ne contient pas de nom de fichier, générer un fallback
    if (!filename) {
      filename = "downloaded_file";
    }
    return filename;
  } catch {
    // En cas d'URL invalide, fallback
    return "downloaded_file";
  }
};

/**
 * Télécharge un fichier depuis une URL et le stocke localement.
 * S'il existe déjà, renvoie simplement le chemin local.
 *
 * @param fileUrl URL du fichier à télécharger
 * @returns chemin local vers le fichier stocké
 */

export const downloadAndCacheFile = async (
  fileUrl: string,
  forceDownload: boolean = false,
  callback?: (progress: number) => void
): Promise<string | null> => {
  try {
    const fileName = extractFileNameFromUrl(fileUrl);
    const fileUri = `${FileSystem.documentDirectory}${fileName}`;

    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    if (fileInfo.exists && forceDownload) {
      await FileSystem.deleteAsync(fileUri, { idempotent: true });
    }

    const finalInfo = await FileSystem.getInfoAsync(fileUri);
    if (finalInfo.exists && !forceDownload) {
      return fileUri;
    }

    const downloadResumable = FileSystem.createDownloadResumable(
      fileUrl,
      fileUri,
      {
        cache: true,
      },
      downloadProgress => {
        const progress =
          downloadProgress.totalBytesWritten /
          downloadProgress.totalBytesExpectedToWrite;
        callback?.(progress);
      }
    );

    const downloadResult = await downloadResumable.downloadAsync(); //await FileSystem.downloadAsync(fileUrl, fileUri, {});

    if (!downloadResult || !downloadResult.uri) {
      throw new Error("Erreur de téléchargement");
    }
    return downloadResult.uri;
  } catch (error) {
    console.error("Erreur lors du téléchargement :", error);
    return null;
  }
};
