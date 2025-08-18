import {
  EntityPropsBaseType,
  Factory,
  GenerateUniqueId,
  handleError,
  Result,
} from "@shared";
import { GrowthIndicatorValue } from "../../anthropometry";
import { BiologicalAnalysisInterpretation } from "../../biological";
import { ClinicalNutritionalAnalysisResult } from "../../clinical";
import { GlobalDiagnostic, NutritionalAssessmentResult } from "../models";

export interface CreateNutritionalAssessmentResultProps
  extends EntityPropsBaseType {
  globalDiagnostics: GlobalDiagnostic[];
  growthIndicatorValues: GrowthIndicatorValue[];
  clinicalAnalysis: ClinicalNutritionalAnalysisResult[];
  biologicalInterpretation: BiologicalAnalysisInterpretation[];
}

export class NutritionalAssessmentResultFactory
  implements
    Factory<CreateNutritionalAssessmentResultProps, NutritionalAssessmentResult>
{
  constructor(private readonly idGenerator: GenerateUniqueId) {}
  async create(
    props: CreateNutritionalAssessmentResultProps
  ): Promise<Result<NutritionalAssessmentResult>> {
    try {
      const {
        globalDiagnostics,
        growthIndicatorValues,
        clinicalAnalysis,
        biologicalInterpretation,
      } = props;
      const uniqueId = this.idGenerator.generate();
      const nutritionalAssessmentResult = new NutritionalAssessmentResult({
        id: uniqueId.toString(),
        props: {
          globalDiagnostics,
          growthIndicatorValues,
          clinicalAnalysis,
          biologicalInterpretation,
        },
      });

      return Result.ok(nutritionalAssessmentResult);
    } catch (e: unknown) {
      return handleError(e);
    }
  }
}
