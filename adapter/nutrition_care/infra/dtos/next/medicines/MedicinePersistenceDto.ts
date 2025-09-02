import {
  AdministrationRoute,
  MEDICINE_CODES,
  MedicineCategory,
} from "@/core/constants";
import { AggregateID } from "@/core/shared";
import { IDosageCase } from "../../../../../core/nutrition_care/domain/modules/next/medicines/models/valueObjects";

export interface MedicinePersistenceDto {
  id: AggregateID;
  code: MEDICINE_CODES;
  name: string;
  category: MedicineCategory;
  administrationRoutes: AdministrationRoute[];
  dosageCases: IDosageCase[];
  warnings: string[];
  contraindications: string[];
  interactions: string[];
  notes: string[];
  createdAt: string;
  updatedAt: string;
}
