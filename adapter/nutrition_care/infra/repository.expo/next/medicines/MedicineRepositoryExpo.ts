import { EntityBaseRepositoryExpoWithCodeColumn } from "@/adapter/shared/repository.expo";
import {
  Medicine,
  MedicineRepository,
} from "../../../../../core/nutrition_care/domain/modules/next/medicines/models";
import { MedicinePersistenceDto } from "../../../dtos/next/medicines/MedicinePersistenceDto";
import { next_medicines } from "../../db/nutrition_care.schema";
import { MedicineInfraMapper } from "../../../mappers/next/medicines/MedicineInfraMapper";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";

export class MedicineRepositoryExpo
  extends EntityBaseRepositoryExpoWithCodeColumn<
    Medicine,
    MedicinePersistenceDto,
    typeof next_medicines
  >
  implements MedicineRepository
{
  constructor(
    db: ExpoSQLiteDatabase<Record<string, unknown>>,
    mapper: MedicineInfraMapper
  ) {
    super(db, next_medicines, mapper);
  }
}
