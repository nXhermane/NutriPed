import {
  ConditionResult,
  evaluateCondition,
  formatError,
  handleError,
  Result,
} from "@shared";
import { EvaluationContext } from "../../common";
import {
  BiologicalTestResult,
  BiologicalAnalysisInterpretation,
  BiochemicalReference,
  BiochemicalRange,
  BiochemicalRangeStatus,
} from "../models";
import {
  BiochemicalReferenceRepository,
  IBiologicalInterpretationService,
} from "../ports";
import { BIOLOGICAL_SERVICE_ERRORS, handleBiologicalError } from "../errors";
import { UnitAcl } from "../../anthropometry";

export class BiologicalInterpretationService
  implements IBiologicalInterpretationService
{
  constructor(
    private readonly biochemicalRefRepo: BiochemicalReferenceRepository,
    private readonly biologicalUnitConvertor: UnitAcl
  ) {}
  async interpret(
    data: BiologicalTestResult[],
    context: EvaluationContext
  ): Promise<Result<BiologicalAnalysisInterpretation[]>> {
    try {
      const referencesResult = await this.getBiochemicalReference(data);
      if (referencesResult.isFailure)
        return handleBiologicalError(
          BIOLOGICAL_SERVICE_ERRORS.VALIDATION.REFERENCE_NOT_FOUND.path
        );
      const convertedBiologicalTestResults =
        await this.convertAllBiologicalTestToRefUnit(
          data,
          referencesResult.val
        );
      return this.interpretAllBiologicalTestResult(
        convertedBiologicalTestResults,
        referencesResult.val,
        context
      );
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
  private interpretAllBiologicalTestResult(
    biologicalTestResults: BiologicalTestResult[],
    references: BiochemicalReference[],
    context: EvaluationContext
  ): Result<BiologicalAnalysisInterpretation[]> {
    const interpretationResults = biologicalTestResults.map(
      biologicalTestResult => {
        const reference = references.find(ref =>
          ref.getProps().code.equals(biologicalTestResult.unpack().code)
        );
        if (!reference) {
          return handleBiologicalError(
            BIOLOGICAL_SERVICE_ERRORS.INTERPRETATION.BIOCHEMICAL_REF_NOT_FOUND
              .path,
            `BiologicalTestResult: ${biologicalTestResult.unpack().code.unpack()}`
          );
        }

        return this.interpretBiologicalTestResult(
          biologicalTestResult,
          context,
          reference
        );
      }
    );
    const combinedResult = Result.combine(interpretationResults);
    if (combinedResult.isFailure) {
      return handleBiologicalError(
        BIOLOGICAL_SERVICE_ERRORS.INTERPRETATION.INTERPRETATION_ERROR.path,
        formatError(combinedResult, BiologicalInterpretationService.name)
      );
    }
    return Result.ok(interpretationResults.map(res => res.val));
  }
  private interpretBiologicalTestResult(
    biologicalTestResult: BiologicalTestResult,
    context: EvaluationContext,
    references: BiochemicalReference
  ): Result<BiologicalAnalysisInterpretation> {
    const biochemicalRanges = references.getProps().ranges;
    const usableRange = biochemicalRanges.find(range => {
      const { value: modulatingCondition } = range.unpack().condition.unpack();
      const conditionResult = evaluateCondition(modulatingCondition, context);
      return conditionResult === ConditionResult.True;
    });
    if (!usableRange) {
      return handleBiologicalError(
        BIOLOGICAL_SERVICE_ERRORS.INTERPRETATION.ADAPTED_RANGE_NOT_FOUND.path,
        `context: ${context} BiologicalTestCode: ${biologicalTestResult.unpack().code.unpack()}`
      );
    }
    const rangeInterpretation = this.interpretRangeValue(
      biologicalTestResult,
      usableRange
    );
    return BiologicalAnalysisInterpretation.create({
      code: references.getCode(),
      ...rangeInterpretation,
    });
  }
  private interpretRangeValue(
    biologicalTestResult: BiologicalTestResult,
    biochemicalRange: BiochemicalRange
  ): {
    status: BiochemicalRangeStatus;
    interpretation: string[];
  } {
    const ranges = biochemicalRange.unpack().range;
    const testValue = biologicalTestResult.unpack().value;
    if (
      testValue < ranges.min[0] ||
      (ranges.min[1] && testValue === ranges.min[0])
    ) {
      return {
        status: BiochemicalRangeStatus.UNDER,
        interpretation: biochemicalRange.unpack().under,
      };
    }
    if (
      testValue > ranges.max[0] ||
      (ranges.max[1] && testValue === ranges.max[0])
    ) {
      return {
        status: BiochemicalRangeStatus.OVER,
        interpretation: biochemicalRange.unpack().over,
      };
    }
    return {
      status: BiochemicalRangeStatus.NORMAL,
      interpretation: [BiochemicalRangeStatus.NORMAL.toString()],
    };
  }
  private async convertAllBiologicalTestToRefUnit(
    biologicalTestResults: BiologicalTestResult[],
    references: BiochemicalReference[]
  ): Promise<BiologicalTestResult[]> {
    return await Promise.all(
      biologicalTestResults.map(biologicalTestResult => {
        const reference = references.find(ref =>
          ref.getProps().code.equals(biologicalTestResult.unpack().code)
        )!;
        //CHECK: Check if i can have error to FIX a checking : Now just suppose the reference is found
        return this.convertBiologicalResultValueToRefUnit(
          biologicalTestResult,
          reference
        );
      })
    );
  }
  private async convertBiologicalResultValueToRefUnit(
    biologicalTestResult: BiologicalTestResult,
    reference: BiochemicalReference
  ): Promise<BiologicalTestResult> {
    const biologicalTestResultUnit = biologicalTestResult.unpack().unit;
    const biochemicalRefUnit = reference.getProps().unit;
    if (biologicalTestResultUnit.equals(biochemicalRefUnit))
      return biologicalTestResult;
    else {
      const convertedValueRes = await this.biologicalUnitConvertor.convertTo(
        biologicalTestResultUnit,
        biochemicalRefUnit,
        biologicalTestResult.unpack().value
      );
      return new BiologicalTestResult({
        value: convertedValueRes.val,
        unit: biochemicalRefUnit,
        code: biologicalTestResult.unpack().code,
      });
    }
  }
}
