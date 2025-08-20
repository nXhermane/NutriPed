import {
  CreateDataFieldReference,
  DataFieldReference,
} from "@/core/evaluation";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@/core/shared";
import { DataFieldReferencePersistenceDto } from "../dtos";

export class DataFieldReferenceInfraMapper
  implements
    InfrastructureMapper<DataFieldReference, DataFieldReferencePersistenceDto>
{
  toPersistence(entity: DataFieldReference): DataFieldReferencePersistenceDto {
    return {
      id: entity.id,
      category: entity.getCategory(),
      code: entity.getCode(),
      defaultValue: entity.getValue(),
      label: entity.getLabel(),
      question: entity.getQuestion(),
      type: entity.getType(),
      enum: entity.getEnum(),
      range: entity.getRange(),
      units: entity.getUnits(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: DataFieldReferencePersistenceDto): DataFieldReference {
    const fieldRefRes = DataFieldReference.create(
      record as CreateDataFieldReference,
      record.id
    );
    if (fieldRefRes.isFailure) {
      throw new InfraMapToDomainError(
        formatError(fieldRefRes, DataFieldReference.name)
      );
    }
    const { id, createdAt, updatedAt, ...props } = fieldRefRes.val.getProps();
    return new DataFieldReference({ id, createdAt, updatedAt, props });
  }
}
