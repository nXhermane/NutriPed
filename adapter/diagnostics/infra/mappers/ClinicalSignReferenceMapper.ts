import { ClinicalSignReference } from "@core/diagnostics";
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
      data: entity.getClinicalSignData().map(sign => ({
        name: sign.name,
        code: sign.code.unpack(),
        question: sign.question,
        dataType: sign.dataType,
        required: sign.required,
        dataRange: sign.dataRange,
        enumValue: sign.enumValue,
      })),
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
}
