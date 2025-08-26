import { NextClinicalDomain } from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@/core/shared";
import { NextClinicalInfraDtos } from "../../../dtos";

export class ClinicalSignReferenceInfraMapper
  implements
    InfrastructureMapper<
      NextClinicalDomain.ClinicalSignReference,
      NextClinicalInfraDtos.ClinicalSignReferencePersistenceDto
    >
{
  toPersistence(
    entity: NextClinicalDomain.ClinicalSignReference
  ): NextClinicalInfraDtos.ClinicalSignReferencePersistenceDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      description: entity.getDescription(),
      name: entity.getName(),
      data: entity.getNeededDataFields(),
      evaluationRule: entity.getRule(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(
    record: NextClinicalInfraDtos.ClinicalSignReferencePersistenceDto
  ): NextClinicalDomain.ClinicalSignReference {
    const clinicalRefRes = NextClinicalDomain.ClinicalSignReference.create(
      {
        code: record.code,
        description: record.description,
        name: record.name,
        neededDataFields: record.data,
        rule: record.evaluationRule,
      },
      record.id
    );
    if (clinicalRefRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(clinicalRefRes, ClinicalSignReferenceInfraMapper.name)
      );
    const { createdAt, updatedAt, id, ...props } =
      clinicalRefRes.val.getProps();
    return new NextClinicalDomain.ClinicalSignReference({
      id,
      props,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }
}
