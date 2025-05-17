import { CreateAdmissionType } from "@core/nutrition_care";
import { ICondition } from "@shared";
import { EntityPersistenceDto } from "../../../../shared";


export interface OrientationReferencePersistenceDto extends EntityPersistenceDto {
   name: string;
   code: string;
   admissionCriteria: ICondition[];
   admissionTypes: CreateAdmissionType[];
}
