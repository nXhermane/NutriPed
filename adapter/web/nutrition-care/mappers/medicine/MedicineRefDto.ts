import { AdministrationRoute, IDosageRange, IBaseDosage, MedicineCategory } from "@core/nutrition_care";
import { EntityPersistenceDto } from "../../../common";

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
