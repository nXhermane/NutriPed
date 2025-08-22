import { OrientationReference } from "@core/nutrition_care";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { OrientationReferencePersistenceDto } from "../dtos";

export class OrientationReferenceInfraMapper
  implements
    InfrastructureMapper<
      OrientationReference,
      OrientationReferencePersistenceDto
    >
{
  toPersistence(
    entity: OrientationReference
  ): OrientationReferencePersistenceDto {
    return {
      id: entity.id as string,
      code: entity.getCode(),
      name: entity.getName(),
      admissionCriteria: entity.getAdmissionCriteria(),
      admissionTypes: entity.getAdmissionTypes().map(admissionType => ({
        code: admissionType.code.unpack(),
        condition: admissionType.condition.unpack(),
        name: admissionType.name,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: OrientationReferencePersistenceDto): OrientationReference {
    const orientationRefRes = OrientationReference.create(record, record.id);
    if (orientationRefRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(orientationRefRes, OrientationReferenceInfraMapper.name)
      );

    const { id, createdAt, updatedAt, ...props } =
      orientationRefRes.val.getProps();
    return new OrientationReference({
      id,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      props,
    });
  }
}
