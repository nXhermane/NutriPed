import { Result } from "@/core/shared";
import { AnthropometricRecord } from "../../../models";

export interface INormalizeAnthropometricDataACL {
  normalize(
    anthropRecord: AnthropometricRecord
  ): Promise<Result<AnthropometricRecord>>;
}
