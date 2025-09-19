import { ConditionResult, handleError, Result } from "@shared";
import { ClinicalNutritionalAnalysisResult } from "../models";
import {
  ClinicalSignReferenceRepository,
  ClinicalVariableObject,
  IClinicalVariableGeneratorService,
} from "../ports";

export class ClinicalVariableGeneratorService
  implements IClinicalVariableGeneratorService
{
  constructor(
    private readonly clinicalReferenceRepo: ClinicalSignReferenceRepository
  ) {}
  async generate(
    clinicalAnalysis: ClinicalNutritionalAnalysisResult[]
  ): Promise<Result<ClinicalVariableObject>> {
    try {
      const clinicalReferencesCode = (
        await this.clinicalReferenceRepo.getAllCode()
      ).map(systemCode => systemCode.unpack());
      const clinicalAnalysisCodes = clinicalAnalysis.map(clinicalAn =>
        clinicalAn.unpack().clinicalSign.unpack()
      );
      const clinicalVariableObject: ClinicalVariableObject = {};
      for (const clinicalRefCode of clinicalReferencesCode) {
        clinicalVariableObject[clinicalRefCode] =
          clinicalAnalysisCodes.includes(clinicalRefCode)
            ? ConditionResult.True
            : ConditionResult.False;
      }
      return Result.ok(clinicalVariableObject);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
