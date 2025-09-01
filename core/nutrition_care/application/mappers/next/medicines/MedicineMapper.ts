import { ApplicationMapper } from "@/core/shared";
import { Medicine } from "../../../../domain/modules/next/medicines/models";
import { MedicineDto } from "../../../dtos/next/medicines/MedicineDto";

export class MedicineMapper
  implements ApplicationMapper<Medicine, MedicineDto>
{
  toResponse(entity: Medicine): MedicineDto {
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
}
