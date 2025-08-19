import { DATA_FIELD_CODE_TYPE } from "@/core/constants";
import { AggregateID, ICondition } from "@/core/shared";

export interface ClinicalSignReferencePersistenceDto {
      id: AggregateID;
  name: string;
  code: string;
  description: string;
  evaluationRule: ICondition;
  data: { code: DATA_FIELD_CODE_TYPE, required: boolean }[];
  createdAt: string;
  updatedAt: string;
}