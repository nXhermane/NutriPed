import {
  CreateNutritionalAssessmentResult,
  NutritionalAssessmentResult,
} from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { NutritionalAssessmentResultPersistenceDto } from "../dtos";

export class NutritionalAssessmentResultInfraMapper
  implements
    InfrastructureMapper<
      NutritionalAssessmentResult,
      NutritionalAssessmentResultPersistenceDto
    >
{
  toPersistence(
    entity: NutritionalAssessmentResult
  ): NutritionalAssessmentResultPersistenceDto {
    return {
      id: entity.id as string,
      biologicalInterpretation: entity
        .getBiologicalInterpretation()
        .map(interpret => {
          const { code, interpretation, status } = interpret.unpack();
          return {
            code: code.unpack(),
            interpretation,
            status,
          };
        }),
      clinicalAnalysis: entity.getClinicalAnalysis().map(clinicalAnalysis => {
        const { clinicalSign, recommendedTests, suspectedNutrients } =
          clinicalAnalysis.unpack();
        return {
          clinicalSign: clinicalSign.unpack(),
          recommendedTests: recommendedTests.map(test => test.unpack()),
          suspectedNutrients: suspectedNutrients.map(nutrient => ({
            nutrient: nutrient.unpack().nutrient.unpack(),
            effect: nutrient.unpack().effect,
          })),
        };
      }),
      globalDiagnostics: entity.getGlobalDiagnostics().map(global => {
        const { code, criteriaUsed } = global.unpack();
        return {
          code: code.unpack(),
          criteriaUsed,
        };
      }),
      growthIndicatorValues: entity
        .getGrowthIndicatorValues()
        .map(indicator => {
          const { code, unit, ...otherProps } = indicator.unpack();
          return {
            code: code.unpack(),
            unit: unit.unpack(),
            ...otherProps,
          };
        }),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(
    record: NutritionalAssessmentResultPersistenceDto
  ): NutritionalAssessmentResult {
    const nutritionAssessmentResultRes = NutritionalAssessmentResult.create(
      record as CreateNutritionalAssessmentResult,
      record.id
    );
    if (nutritionAssessmentResultRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(
          nutritionAssessmentResultRes,
          NutritionalAssessmentResultInfraMapper.name
        )
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, id, ...props } =
      nutritionAssessmentResultRes.val.getProps();
    return new NutritionalAssessmentResult({
      id,
      props,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
