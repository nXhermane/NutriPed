import { handleError, Result } from "@shared";
import { EvaluationContext, ValidateResult } from "../../common";
import { PatientDiagnosticData } from "../models";
import { IPatientDataValidationService } from "../ports";
import { IClinicalValidationService } from "../../clinical";
import { IBiologicalValidationService } from "../../biological";
import { IAnthropometricValidationService } from "../../anthropometry";

export class PatientDataValidationService
  implements IPatientDataValidationService
{
  constructor(
    private readonly anthropValidationService: IAnthropometricValidationService,
    private readonly clinicalValidationService: IClinicalValidationService,
    private readonly biologicalValidationService: IBiologicalValidationService
  ) {}
  async validate(
    patientData: PatientDiagnosticData
  ): Promise<Result<ValidateResult>> {
    try {
      const evaluationContext = this.generateContext(patientData);
      const anthropometricValidationResult =
        await this.anthropValidationService.validate(
          patientData.getAnthropometricData(),
          evaluationContext
        );
      const clinicalValidationResult =
        await this.clinicalValidationService.validate(
          patientData.getClinicalSigns()
        );
      const biologicalValidationResult =
        await this.biologicalValidationService.validate(
          patientData.getBiologicalTestResults()
        );
      const combinedResult = Result.combine([
        anthropometricValidationResult,
        clinicalValidationResult,
        biologicalValidationResult,
      ]);
      if (combinedResult.isFailure)
        return combinedResult as Result<ValidateResult>;
      return Result.ok({ isValid: true });
    } catch (e: unknown) {
      return handleError(e);
    }
  }
  private generateContext(
    patientData: PatientDiagnosticData
  ): EvaluationContext {
    return {
      age_in_day: patientData.age_in_day,
      age_in_month: patientData.age_in_month,
      age_in_year: patientData.age_in_year,
      sex: patientData.getGender().unpack(),
    };
  }
}
