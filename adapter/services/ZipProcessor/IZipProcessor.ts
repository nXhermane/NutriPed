export interface IZipProcessor {
  load(zipUrl: string): Promise<Map<string, string>>;
}
export const allowedExtensions: string[] = [".json", ".txt"];
