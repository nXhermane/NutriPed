import { ApplicationMapper } from "@shared";
import { BiochemicalReference } from "../../domain";
import { BiochemicalReferenceDto } from "../dtos";

export class BiochemicalReferenceMapper
  implements ApplicationMapper<BiochemicalReference, BiochemicalReferenceDto>
{
  toResponse(entity: BiochemicalReference): BiochemicalReferenceDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: entity.getName(),
      notes: entity.getNotes(),
      unit: entity.getUnits().defaultUnit,
      availableUnits: entity.getUnits().availableUnits,
      ranges: entity.getRanges().map(range => ({
        condition: range.condition.unpack(),
        range: range.range,
        over: range.over,
        under: range.under,
      })),
      source: entity.getSource(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
