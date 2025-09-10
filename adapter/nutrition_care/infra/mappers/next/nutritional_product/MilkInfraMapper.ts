import { NextNutritionCare } from "@/core/nutrition_care";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@/core/shared";
import { MilkPersistenceDto } from "../../../dtos/next/nutritional_product";

export class MilkInfraMapper
  implements InfrastructureMapper<NextNutritionCare.Milk, MilkPersistenceDto>
{
  toPersistence(entity: NextNutritionCare.Milk): MilkPersistenceDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: entity.getName(),
      notes: entity.getNotes(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  toDomain(record: MilkPersistenceDto): NextNutritionCare.Milk {
    const milkRes = NextNutritionCare.Milk.create(
      record as NextNutritionCare.CreateMilk,
      record.id
    );

    if (milkRes.isFailure) {
      throw new InfraMapToDomainError(
        formatError(milkRes, NextNutritionCare.Milk.name)
      );
    }
    const { id, createdAt, updatedAt, ...props } = milkRes.val.getProps();
    return new NextNutritionCare.Milk({ id, createdAt, updatedAt, props });
  }
}
