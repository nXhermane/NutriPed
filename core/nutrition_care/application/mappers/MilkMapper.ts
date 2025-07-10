import { ApplicationMapper } from "@shared";
import { Milk } from "../../domain";
import { MilkDto } from "../dtos";

export class MilkMapper implements ApplicationMapper<Milk, MilkDto> {
  toResponse(entity: Milk): MilkDto {
    return {
      id: entity.id,
      condition: entity.getCondition(),
      doseFormula: entity.getDoseFormula(),
      name: entity.getName(),
      recommendationPerRanges: entity.getRanges(),
      recommendedMilkPerDay: entity.getRecommendedMilkPerDay(),
      type: entity.getType(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
