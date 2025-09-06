import { ApplicationMapper } from "@/core/shared";
import { MilkDto } from "../../../dtos/next/milk";
import { NextNutritionCare } from "../../../../domain";

export class MilkMapper implements ApplicationMapper<NextNutritionCare.Milk, MilkDto> {
  toResponse(entity: NextNutritionCare.Milk): MilkDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: entity.getName(),
      notes: entity.getNotes(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
