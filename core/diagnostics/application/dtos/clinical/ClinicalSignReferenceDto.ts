import { AggregateID } from "@shared";
import { ICondition } from "../../../domain";
import { ClinicalSignDataDto } from "./ClinicalSignDataDto";

export interface ClinicalSignReferenceDto {
  id: AggregateID;
  name: string;
  code: string;
  description: string;
  evaluationRule: ICondition;
  data: ClinicalSignDataDto[];
  createdAt: string;
  updatedAt: string;
}
