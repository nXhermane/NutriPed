export interface ZipProgressEvent {
  type: "start" | "download" | "extract" | "read" | "done" | "error";
  progress?: number; 
  message?: string;
  filePath?: string;
}

export interface IZipProcessorObserver {
  onProgress(event: ZipProgressEvent): void;
}
