import { NextNutritionCare } from "@/core/nutrition_care";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@/core/shared";
import { MedicinePersistenceDto } from "../../../dtos/next/medicines";

export class MedicineInfraMapper
  implements
    InfrastructureMapper<NextNutritionCare.Medicine, MedicinePersistenceDto>
{
  toPersistence(entity: NextNutritionCare.Medicine): MedicinePersistenceDto {
    return {
      id: entity.id,
      code: entity.getCode(),
      name: entity.getName(),
      category: entity.getCategory(),
      administrationRoutes: entity.getAdministrationRoutes(),
      dosageCases: entity.getDosageCases(),
      warnings: entity.getWarings(),
      contraindications: entity.getContraIndications(),
      interactions: entity.getInteractions(),
      notes: entity.getNotes(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
  toDomain(record: MedicinePersistenceDto): NextNutritionCare.Medicine {
    const medicineRes = NextNutritionCare.Medicine.create(
      record as NextNutritionCare.CreateMedicine,
      record.id
    );

    if (medicineRes.isFailure) {
      throw new InfraMapToDomainError(
        formatError(medicineRes, NextNutritionCare.Medicine.name)
      );
    }
    const { id, createdAt, updatedAt, ...props } = medicineRes.val.getProps();
    return new NextNutritionCare.Medicine({ id, createdAt, updatedAt, props });
  }
}
