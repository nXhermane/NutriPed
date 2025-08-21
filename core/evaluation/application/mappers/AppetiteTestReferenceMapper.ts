import { ApplicationMapper } from "@shared";
import { AppetiteTestRef } from "../../domain";
import { AppetiteTestRefDto } from "../dtos";

export class AppetiteTestReferenceMapper
  implements ApplicationMapper<AppetiteTestRef, AppetiteTestRefDto> {
  toResponse(entity: AppetiteTestRef): AppetiteTestRefDto {
    return {
      id: entity.id,
      appetiteTestTable: entity.getAppetiteTestTable(),
      code: entity.getCode(),
      name: entity.getName(),
      productType: entity.getProductType(),
      neededDataFields: entity.getNeededFields(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
