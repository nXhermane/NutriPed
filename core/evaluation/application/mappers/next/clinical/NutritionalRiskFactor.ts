import { NextClinicalDomain } from "@/core/evaluation/domain";
import { ApplicationMapper } from "@/core/shared";
import { NextClinicalDtos } from "../../../dtos";

export class NutritionalRiskFactorMapper implements ApplicationMapper<NextClinicalDomain.NutritionalRiskFactor, NextClinicalDtos.NutritionalRiskFactorDto> {
    toResponse(entity: NextClinicalDomain.NutritionalRiskFactor): NextClinicalDtos.NutritionalRiskFactorDto {
        return {
            id: entity.id,
            associatedNutrients: entity.getAssociatedNutrients(),
            clinicalSignCode: entity.getClinicalSignCode(),
            createdAt: entity.createdAt,
            modulatingCondition: entity.getModulatingCondition(),
            recommendedTests: entity.getRecommendedTests(),
            updatedAt: entity.updatedAt
        }
    }

}