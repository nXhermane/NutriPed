import { formatError, handleError, Result, UnitCode } from "@/core/shared";
import {
  AnthropometricRecord,
  INormalizeAnthropometricDataACL,
} from "../../domain";
import { INormalizeAnthropometricDataAppService } from "@/core/diagnostics";

export class NormalizeAnthropomericDataACL
  implements INormalizeAnthropometricDataACL
{
  constructor(
    private readonly normalizeAnthropometricDataService: INormalizeAnthropometricDataAppService
  ) {}
  async normalize(
    anthropRecord: AnthropometricRecord
  ): Promise<Result<AnthropometricRecord>> {
    try {
      const result = await this.normalizeAnthropometricDataService.normalize({
        anthropometricMeasures: [
          {
            code: anthropRecord.getCode(),
            ...anthropRecord.getMeasurement(),
          },
        ],
      });
      if ("data" in result) {
        const normalizeRecord = result.data[0];
        const newUnitRes = UnitCode.create(normalizeRecord.unit);
        if (newUnitRes.isFailure)
          return Result.fail(
            formatError(newUnitRes, NormalizeAnthropomericDataACL.name)
          );
        anthropRecord.changeMeasurement({
          value: normalizeRecord.value,
          unit: newUnitRes.val,
        });
        return Result.ok(anthropRecord);
      } else {
        const _errorContent = JSON.parse(result.content);
        return Result.fail(_errorContent);
      }
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
