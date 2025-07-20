import { ApplicationMapper } from "@shared";
import { ClinicalSignReference } from "../../domain";
import { ClinicalSignReferenceDto } from "../dtos";

export class ClinicalSignReferenceMapper
  implements ApplicationMapper<ClinicalSignReference, ClinicalSignReferenceDto>
{
  toResponse(entity: ClinicalSignReference): ClinicalSignReferenceDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: entity.getName(),
      description: entity.getDesc(),
      evaluationRule: entity.getRule(),
      data: entity.getClinicalSignData().map(clinicalSignData => ({
        code: clinicalSignData.code.unpack(),
        dataType: clinicalSignData.dataType,
        name: clinicalSignData.name,
        question: clinicalSignData.question,
        dataRange: clinicalSignData.dataRange,
        required: clinicalSignData.required,
        enumValue: clinicalSignData.enumValue,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
