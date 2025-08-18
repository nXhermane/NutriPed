import { Result } from "@/core/shared";
import { AnthropometricData } from "../../models";

export interface INormalizeAnthropometricDataService {
  normalize(
    anthropometricData: AnthropometricData
  ): Promise<Result<AnthropometricData>>;
}
