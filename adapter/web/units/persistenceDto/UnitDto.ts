import { UnitType } from "@core/units";
import { EntityPersistenceDto } from "../../common";

export interface UnitPersistenceDto extends EntityPersistenceDto {
   name: string;
   code: string;
   conversionFactor: number;
   baseUnitCode: string;
   type: UnitType;
}
