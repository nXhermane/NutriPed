import { ApplicationMapper } from "@shared";
import { Medicine } from "../../domain";
import { MedicineDto } from "../dtos";

export class MedicineMapper
  implements ApplicationMapper<Medicine, MedicineDto>
{
  toResponse(entity: Medicine): MedicineDto {
    return {
      id: entity.id,
      name: entity.getName(),
      administrationRoutes: entity.getAdministrationRoutes(),
      baseDosage: entity.getBaseDosage(),
      category: entity.getCategory(),
      code: entity.getCode(),
      dosageRanges: entity.getDosageRanges(),
      warnings: entity.getWarnings(),
      contraindications: entity.getContraindications(),
      interactions: entity.getInteractions(),
      notes: entity.getNotes(),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
