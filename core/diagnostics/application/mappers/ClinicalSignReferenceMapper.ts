import { ApplicationMapper } from "@shared";
import { ClinicalSignReference, IClinicalSignData } from "../../domain";
import { ClinicalSignDataDto, ClinicalSignReferenceDto } from "../dtos";

export class ClinicalSignReferenceMapper
  implements ApplicationMapper<ClinicalSignReference, ClinicalSignReferenceDto> {
  toResponse(entity: ClinicalSignReference): ClinicalSignReferenceDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: entity.getName(),
      description: entity.getDesc(),
      evaluationRule: entity.getRule(),
      data: entity
        .getClinicalSignData()
        .map(clinicalSignData => this.mapClinicalSignData(clinicalSignData)),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  private mapClinicalSignData(
    clinicalSignData: IClinicalSignData
  ): ClinicalSignDataDto {
    const processedProps: ClinicalSignDataDto = {
      code: clinicalSignData.code.unpack(),
      dataType: clinicalSignData.dataType,
      name: clinicalSignData.name,
      question: clinicalSignData.question,
      dataRange: clinicalSignData.dataRange,
      required: clinicalSignData.required,
      enumValue: clinicalSignData.enumValue,
    };
    if (clinicalSignData.units) {
      processedProps["units"] = {
        available: clinicalSignData.units.available.map(unitCode =>
          unitCode.unpack()
        ),
        default: clinicalSignData.units.default.unpack(),
      };
    }
    return processedProps;
  }
}
