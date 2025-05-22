import { ApplicationMapper } from "@shared";
import { GrowthReferenceTable } from "../../domain";
import { GrowthReferenceTableDto } from "../dtos";

export class GrowthReferenceTableMapper
  implements ApplicationMapper<GrowthReferenceTable, GrowthReferenceTableDto>
{
  toResponse(entity: GrowthReferenceTable): GrowthReferenceTableDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: entity.getName(),
      standard: entity.getStandard(),
      data: entity.getTableData(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
