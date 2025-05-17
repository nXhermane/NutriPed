import { ApplicationMapper } from "@shared";
import { GrowthReferenceChart } from "../../domain";
import { GrowthReferenceChartDto } from "../dtos";

export class GrowthReferenceChartMapper implements ApplicationMapper<GrowthReferenceChart, GrowthReferenceChartDto> {
   toResponse(entity: GrowthReferenceChart): GrowthReferenceChartDto {
      return {
         id: entity.id,
         code: entity.getCode(),
         name: entity.getName(),
         sex: entity.getSex() as "M" | "F",
         standard: entity.getStandard(),
         data: entity.getChartData(),
         createdAt: entity.createdAt,
         updatedAt: entity.updatedAt,
      };
   }
}
