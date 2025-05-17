import { AggregateID } from "@shared";
import { UnitType } from "./../../domain";

export interface UnitDto {
   id: AggregateID;
   name: string;
   code: string;
   baseUnitCode: string;
   conversionFactor: number;
   type: UnitType;
   updatedAt: string;
   createdAt: string;
}
