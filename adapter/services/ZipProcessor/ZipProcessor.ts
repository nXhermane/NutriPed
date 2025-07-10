import { IZipProcessor } from "./IZipProcessor";
import { IZipProcessorObserver } from "./ZipProcessorObserver";

class ZipProcessor implements IZipProcessor {
  constructor(
    private allowedExtensions: string[] = [],
    private observer?: IZipProcessorObserver
  ) {}
  async load(zipUrl: string): Promise<Map<string, string>> {
    return new Map<string, string>();
  }
}

export default ZipProcessor;
