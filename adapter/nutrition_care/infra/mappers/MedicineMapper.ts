import { Medicine } from "@core/nutrition_care";
import {
  formatError,
  InfraMapToDomainError,
  InfrastructureMapper,
} from "@shared";
import { MedicinePersistenceDto } from "../dtos";

export class MedicineInfraMapper
  implements InfrastructureMapper<Medicine, MedicinePersistenceDto>
{
  toPersistence(entity: Medicine): MedicinePersistenceDto {
    return {
      id: entity.id as string,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      code: entity.getCode(),
      name: entity.getName(),
      administrationRoutes: entity.getAdministrationRoutes(),
      baseDosage: entity.getBaseDosage(),
      category: entity.getCategory(),
      contraindications: entity.getContraindications(),
      dosageRanges: entity.getDosageRanges(),
      interactions: entity.getInteractions(),
      notes: entity.getNotes(),
      warnings: entity.getWarnings(),
    };
  }
  toDomain(record: MedicinePersistenceDto): Medicine {
    const medicineRes = Medicine.create(record, record.id);
    if (medicineRes.isFailure)
      throw new InfraMapToDomainError(
        formatError(medicineRes, MedicineInfraMapper.name)
      );
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, updatedAt, createdAt, ...props } = medicineRes.val.getProps();
    return new Medicine({
      id,
      props,
      updatedAt: record.updatedAt,
      createdAt: record.createdAt,
    });
  }
}
