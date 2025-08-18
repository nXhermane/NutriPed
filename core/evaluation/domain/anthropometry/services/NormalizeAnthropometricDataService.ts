import { INormalizeAnthropometricDataService } from "./interfaces/NormalizeAnthropometricDataService";
import { AnthropometricMeasureRepository, UnitAcl } from "../ports";
import { handleError, Result } from "@/core/shared";
import { AnthropEntry, AnthropometricData } from "../models";
import {
  handleAnthropometricError,
  ANTHROPOMETRIC_MEASURE_ERROR,
} from "../errors";

export class NormalizeAnthropometricDataService
  implements INormalizeAnthropometricDataService
{
  constructor(
    private readonly anthropMeasureRepo: AnthropometricMeasureRepository,
    private readonly unitAcl: UnitAcl
  ) {}
  async normalize(
    anthropometricData: AnthropometricData
  ): Promise<Result<AnthropometricData>> {
    try {
      const normalizedAnthropometricEntries: AnthropEntry[] = [];
      const anthropometricEntries = anthropometricData.unpack().entry;
      for (const anthropEntry of anthropometricEntries) {
        const anthropMeasure = await this.anthropMeasureRepo.getByCode(
          anthropEntry.code
        );
        const anthropMeasureAvailableUnits =
          anthropMeasure.getUnits().availableUnits;
        if (
          !anthropMeasureAvailableUnits.includes(anthropEntry.unit.unpack())
        ) {
          return handleAnthropometricError(
            ANTHROPOMETRIC_MEASURE_ERROR.VALIDATION.INVALID_UNIT.path,
            `AnthroUnit: ${anthropEntry.unit.unpack()} , AvailableUnit : ${anthropMeasureAvailableUnits.join(";")}.`
          );
        }
        if (
          anthropEntry.unit.unpack() === anthropMeasure.getUnits().defaultUnit
        )
          normalizedAnthropometricEntries.push(anthropEntry);
        else {
          const convertedValueRes = await this.unitAcl.convertTo(
            anthropEntry.unit,
            anthropMeasure.getProps().unit,
            anthropEntry.value
          );
          if (convertedValueRes.isFailure)
            return handleAnthropometricError(
              ANTHROPOMETRIC_MEASURE_ERROR.VALIDATION.INVALID_UNIT.path,
              `AnthroFromUnit: ${anthropEntry.unit.unpack()}, AnthroToUnit: ${anthropMeasure.getProps().unit.unpack()}, AnthroValue: ${anthropEntry.value}, ConvertionServiceError: ${convertedValueRes.err} .`
            );
          normalizedAnthropometricEntries.push({
            code: anthropEntry.code,
            unit: anthropMeasure.getProps().unit,
            value: convertedValueRes.val,
          });
        }
      }
      return Result.encapsulate(
        () => new AnthropometricData({ entry: normalizedAnthropometricEntries })
      );
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
