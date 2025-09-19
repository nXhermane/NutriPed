import { IZipProcessor } from "./IZipProcessor";
import * as FileSystem from "expo-file-system/legacy";
import { unzip } from "react-native-zip-archive";
import {
  IZipProcessorObserver,
  ZipProgressEvent,
} from "./ZipProcessorObserver";

class NativeZipProcessor implements IZipProcessor {
  constructor(
    private allowedExtensions: string[] = [],
    private observer?: IZipProcessorObserver
  ) {
    console.log("NativeZipProcessor initialized with:", this.allowedExtensions);
  }

  async load(zipUrl: string): Promise<Map<string, string>> {
    const zipPath = `${FileSystem.cacheDirectory}temp.zip`;
    const destPath = `${FileSystem.cacheDirectory}unzipped/`;

    this.emit({ type: "start", message: "Début du téléchargement" });

    const download = await FileSystem.downloadAsync(zipUrl, zipPath);
    if (download.status !== 200) {
      this.emit({ type: "error", message: "Téléchargement échoué" });
      throw new Error("Téléchargement échoué");
    }

    this.emit({
      type: "download",
      message: "Téléchargement terminé",
      filePath: download.uri,
    });

    this.emit({ type: "extract", message: "Début de l'extraction" });
    await unzip(zipPath, destPath);
    this.emit({
      type: "extract",
      message: "Extraction terminée",
      filePath: destPath,
    });

    const map = new Map<string, string>();
    await this.readAll(destPath, map, destPath);

    this.emit({ type: "done", message: "Lecture terminée" });

    return map;
  }

  private async readAll(
    current: string,
    map: Map<string, string>,
    root: string
  ): Promise<void> {
    const files = await FileSystem.readDirectoryAsync(current);
    for (const file of files) {
      const fullPath = `${current}${file}`;
      const info = await FileSystem.getInfoAsync(fullPath);
      if (info.isDirectory) {
        await this.readAll(`${fullPath}/`, map, root);
      } else if (this.isAllowed(file)) {
        const content = await FileSystem.readAsStringAsync(fullPath);
        const relativePath = fullPath.replace(root, "");
        map.set(relativePath, content);
        this.emit({
          type: "read",
          filePath: relativePath,
          message: `Lecture de ${relativePath}`,
        });
      }
    }
  }

  private isAllowed(path: string): boolean {
    if (this.allowedExtensions.length === 0) return true;
    return this.allowedExtensions.some(ext => path.toLowerCase().endsWith(ext));
  }

  private emit(event: ZipProgressEvent) {
    if (this.observer) {
      this.observer.onProgress(event);
    }
  }
}

export default NativeZipProcessor;
