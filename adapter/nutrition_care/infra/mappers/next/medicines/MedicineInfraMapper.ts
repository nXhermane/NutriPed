import {
  Medicine,
  CreateMedicine,
} from "../../../../../core/nutrition_care/domain/modules/next/medicines/models";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@/core/shared";
import { MedicinePersistenceDto } from "../../dtos/next/medicines/MedicinePersistenceDto";

export class MedicineInfraMapper
  implements InfrastructureMapper<Medicine, MedicinePersistenceDto>
{
  toPersistence(entity: Medicine): MedicinePersistenceDto {
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
  toDomain(record: MedicinePersistenceDto): Medicine {
    const medicineRes = Medicine.create(
      record as CreateMedicine,
      record.id
    );

    if (medicineRes.isFailure) {
      throw new InfraMapToDomainError(
        formatError(medicineRes, Medicine.name)
      );
    }
    const { id, createdAt, updatedAt, ...props } = medicineRes.val.getProps();
    return new Medicine({ id, createdAt, updatedAt, props });
  }
}
