import { AggregateID } from "@shared";
import {
  AdministrationRoute,
  IBaseDosage,
  IDosageRange,
  MedicineCategory,
} from "../../../domain";

export interface MedicineDto {
  id: AggregateID;
  name: string;
  code: string;
  category: MedicineCategory;
  administrationRoutes: AdministrationRoute[];
  baseDosage: IBaseDosage;
  dosageRanges: IDosageRange[];
  warnings: string[];
  contraindications: string[];
  interactions: string[];
  notes: string[];
  updatedAt: string;
  createdAt: string;
}
