import { MedicineCategory, AdministrationRoute, IBaseDosage, IDosageRange } from "@core/nutrition_care";
import { EntityPersistenceDto } from "../../../../shared";

export interface MedicinePersistenceDto extends EntityPersistenceDto {
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
}
