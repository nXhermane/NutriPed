import { ApplicationMapper } from "@shared";
import { NextClinicalDomain } from "@/core/evaluation/domain";
import { NextClinicalDtos } from "../../../dtos";

export class ClinicalSignReferenceMapper
  implements ApplicationMapper<NextClinicalDomain.ClinicalSignReference, NextClinicalDtos.ClinicalSignReferenceDto> {
  toResponse(entity: NextClinicalDomain.ClinicalSignReference): NextClinicalDtos.ClinicalSignReferenceDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      description: entity.getDescription(),
      name: entity.getName(),
      data: entity.getNeededDataFields(),
      evaluationRule: entity.getRule(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt
    }
  }
}
