import { AggregateID } from "@shared";
import { GrowthStandard } from "../../../domain";
import { TableDataDto } from "./TableData";

export interface GrowthReferenceTableDto {
   id: AggregateID;
   code: string;
   name: string;
   standard: GrowthStandard;
   data: TableDataDto[];
   createdAt: string;
   updatedAt: string;
}
