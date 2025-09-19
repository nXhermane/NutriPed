import { ApplicationMapper } from "@/core/shared";
import { DataFieldReference } from "../../domain";
import { DataFieldReferenceDto } from "../dtos";

export class DataFieldReferenceMapper
  implements ApplicationMapper<DataFieldReference, DataFieldReferenceDto>
{
  toResponse(entity: DataFieldReference): DataFieldReferenceDto {
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
}
