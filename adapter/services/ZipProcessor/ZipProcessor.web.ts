import { IZipProcessor } from "./IZipProcessor";
import JSZip from "jszip";
import {
  IZipProcessorObserver,
  ZipProgressEvent,
} from "./ZipProcessorObserver";

class WebZipProcessor implements IZipProcessor {
  constructor(
    private allowedExtensions: string[] = [],
    private observer?: IZipProcessorObserver
  ) {
    console.log("WebZipProcessor initialized with:", this.allowedExtensions);
  }

  async load(zipUrl: string): Promise<Map<string, string>> {
    this.emit({ type: "start", message: "Chargement du zip depuis le web" });

    const response = await fetch(zipUrl);
    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    this.emit({
      type: "download",
      message: "Téléchargement terminé depuis le web",
    });

    const zip = await JSZip.loadAsync(buffer);
    const result = new Map<string, string>();

    const fileEntries = Object.keys(zip.files).filter(path => {
      const file = zip.files[path];
      return !file.dir && this.isAllowed(path);
    });

    let count = 0;

    for (const path of fileEntries) {
      const file = zip.files[path];
      const content = await file.async("text");
      result.set(path, content);
      count++;
      this.emit({
        type: "read",
        filePath: path,
        message: `Lecture de ${path}`,
        progress: count / fileEntries.length,
      });
    }

    this.emit({ type: "done", message: "Lecture terminée" });

    return result;
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

export default WebZipProcessor;
