import { ApplicationMapper } from "@shared";
import { AnthropometricMeasure } from "../../domain";
import { AnthropometricMeasureDto } from "../dtos";

export class AnthropometricMeasureMapper
  implements ApplicationMapper<AnthropometricMeasure, AnthropometricMeasureDto>
{
  toResponse(entity: AnthropometricMeasure): AnthropometricMeasureDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: entity.getName(),
      unit: entity.getUnits().defaultUnit,
      availableUnit: entity.getUnits().availableUnits,
      validationRules: entity.getValidationRules(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
