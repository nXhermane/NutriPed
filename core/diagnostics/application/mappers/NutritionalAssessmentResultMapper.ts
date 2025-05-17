import { ApplicationMapper } from "@shared";
import {
   BiologicalAnalysisInterpretation,
   ClinicalNutritionalAnalysisResult,
   GlobalDiagnostic,
   GrowthIndicatorValue,
   NutritionalAssessmentResult,
} from "../../domain";
import {
   BiologicalAnalysisInterpretationDto,
   ClinicalNutritionalAnalysisResultDto,
   GlobalDiagnosticDto,
   GrowthIndicatorValueDto,
   NutritionalAssessmentResultDto,
} from "../dtos";

export class NutritionalAssessmentResultMapper implements ApplicationMapper<NutritionalAssessmentResult, NutritionalAssessmentResultDto> {
   toResponse(entity: NutritionalAssessmentResult): NutritionalAssessmentResultDto {
      return {
         id: entity.id,
         growthIndicatorValues: entity.getGrowthIndicatorValues().map(this.mapGrowthIndicatorValue),
         biologicalInterpretation: entity.getBiologicalInterpretation().map(this.mapBiologicalResult),
         clinicalAnalysis: entity.getClinicalAnalysis().map(this.mapClinicalAnalysisResult),
         globalDiagnostics: entity.getGlobalDiagnostics().map(this.mapGlobalDiagnostic),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
   private mapGrowthIndicatorValue(growthIndicatorValue: GrowthIndicatorValue): GrowthIndicatorValueDto {
      const { code, growthStandard, referenceSource, interpretation, unit, value, valueRange } = growthIndicatorValue.unpack();
      return {
         code: code.unpack(),
         growthStandard,
         referenceSource,
         interpretation,
         unit: unit.unpack(),
         value,
         valueRange,
      };
   }
   private mapClinicalAnalysisResult(clinicalAnalysis: ClinicalNutritionalAnalysisResult): ClinicalNutritionalAnalysisResultDto {
      const { clinicalSign, recommendedTests, suspectedNutrients } = clinicalAnalysis.unpack();
      return {
         clinicalSign: clinicalSign.unpack(),
         recommendedTests: recommendedTests.map((test) => test.unpack()),
         suspectedNutrients: suspectedNutrients.map((nutrient) => {
            const { effect, nutrient: code } = nutrient.unpack();
            return { nutrient: code.unpack(), effect };
         }),
      };
   }
   private mapBiologicalResult(biologicalInterpretation: BiologicalAnalysisInterpretation): BiologicalAnalysisInterpretationDto {
      const { code, interpretation, status } = biologicalInterpretation.unpack();
      return {
         code: code.unpack(),
         interpretation,
         status,
      };
   }
   private mapGlobalDiagnostic(globalDiagnostic: GlobalDiagnostic): GlobalDiagnosticDto {
      const { code, criteriaUsed } = globalDiagnostic.unpack();
      return { code: code.unpack(), criteriaUsed };
   }
}
