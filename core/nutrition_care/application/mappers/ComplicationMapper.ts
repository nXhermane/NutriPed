import { ApplicationMapper } from "@shared";
import { ComplicationDto } from "../dtos";
import { Complication } from "../../domain";

export class ComplicationMapper
  implements ApplicationMapper<Complication, ComplicationDto>
{
  toResponse(entity: Complication): ComplicationDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: entity.getName(),
      description: entity.getDescription(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
