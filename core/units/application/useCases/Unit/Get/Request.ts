import { AggregateID } from "@shared";
import { UnitType } from "../../../../domain";

export type GetUnitRequest = {
   id?: AggregateID;
   code?: string;
   type?: UnitType;
};
