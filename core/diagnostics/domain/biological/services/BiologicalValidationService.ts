import { formatError, handleError, Result } from "@shared";
import { ValidateResult } from "../../common";
import { BiochemicalReference, BiologicalTestResult } from "../models";
import {
  BiochemicalReferenceRepository,
  IBiologicalValidationService,
} from "../ports";
import { BIOLOGICAL_SERVICE_ERRORS, handleBiologicalError } from "../errors";

export class BiologicalValidationService
  implements IBiologicalValidationService
{
  constructor(
    private readonly biochemicalRefRepo: BiochemicalReferenceRepository
  ) {}
  async validate(
    data: BiologicalTestResult[]
  ): Promise<Result<ValidateResult>> {
    try {
      const referencesResult = await this.getBiochemicalReference(data);
      if (referencesResult.isFailure) {
        return handleBiologicalError(
          BIOLOGICAL_SERVICE_ERRORS.VALIDATION.REFERENCE_NOT_FOUND.path,
          formatError(referencesResult, BiologicalValidationService.name)
        );
      }
      const validationResult = this.validateBiologicalTestResult(
        data,
        referencesResult.val
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (validationResult.isFailure) return validationResult as Result<any>;
      return Result.ok({ isValid: true });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private async getBiochemicalReference(
    data: BiologicalTestResult[]
  ): Promise<Result<BiochemicalReference[]>> {
    try {
      const references = await Promise.all(
        data.map(biologicalTest =>
          this.biochemicalRefRepo.getByCode(biologicalTest.unpack().code)
        )
      );
      return Result.ok(references);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private validateBiologicalTestResult(
    data: BiologicalTestResult[],
    references: BiochemicalReference[]
  ): Result<void> {
    if (data.length != references.length) {
      return handleBiologicalError(
        BIOLOGICAL_SERVICE_ERRORS.VALIDATION.DATA_LEN_NOT_EQ_REFERENCE_LEN.path,
        `dataLen: ${data.length} , referenceLen: ${references.length} `
      );
    }
    for (const biologicalTestResult of data) {
      const biologicalReference = references.find(
        ref => ref.getCode() === biologicalTestResult.unpack().code.unpack()
      )!;
      const checkUnitResult = this.checkBiologicalTestUnitIsValid(
        biologicalTestResult,
        biologicalReference
      );
      if (checkUnitResult.isFailure)
        return handleBiologicalError(
          BIOLOGICAL_SERVICE_ERRORS.VALIDATION.INVALID_DATA.path,
          `${formatError(checkUnitResult, BiologicalValidationService.name)}`
        );
    }
    return Result.ok();
  }
  private checkBiologicalTestUnitIsValid(
    biologicalTestResult: BiologicalTestResult,
    reference: BiochemicalReference
  ): Result<void> {
    const resultUnit = biologicalTestResult.unpack().unit.unpack();
    const availableUnits = reference.getAvailableCode();
    if (availableUnits.includes(resultUnit)) return Result.ok();
    return handleBiologicalError(
      BIOLOGICAL_SERVICE_ERRORS.VALIDATION.INVALID_DATA_UNIT.path,
      `dataUnit: ${resultUnit} availableUnits: ${availableUnits.join(";")}`
    );
  }
}
