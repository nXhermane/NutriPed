import {
  ClinicalSignDataDto,
  ClinicalSignReference,
  IClinicalSignData,
} from "@core/diagnostics";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { ClinicalSignReferencePersistenceDto } from "../dtos";

export class ClinicalSignReferenceInfraMapper
  implements
    InfrastructureMapper<
      ClinicalSignReference,
      ClinicalSignReferencePersistenceDto
    >
{
  toPersistence(
    entity: ClinicalSignReference
  ): ClinicalSignReferencePersistenceDto {
    
    return {
      id: entity.id as string,
      code: entity.getCode(),
      name: entity.getName(),
      data: entity
        .getClinicalSignData()
        .map(sign => this.mapClinicalSignData(sign)),
      description: entity.getDesc(),
      evaluationRule: entity.getRule(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: ClinicalSignReferencePersistenceDto): ClinicalSignReference {
    const clinicalRefRes = ClinicalSignReference.create(record, record.id);
    if (clinicalRefRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(clinicalRefRes, ClinicalSignReferenceInfraMapper.name)
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, id, ...props } =
      clinicalRefRes.val.getProps();
    return new ClinicalSignReference({
      id,
      props,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
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
