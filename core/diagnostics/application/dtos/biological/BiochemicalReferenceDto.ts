import { AggregateID } from "@shared";
import { BiochemicalRangeDto } from "./BiochemicalRangeDto";

export interface BiochemicalReferenceDto {
  id: AggregateID;
  name: string;
  code: string;
  unit: string;
  availableUnits: string[];
  ranges: BiochemicalRangeDto[];
  source: string;
  notes: string[];
  createdAt: string;
  updatedAt: string;
}
