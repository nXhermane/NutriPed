import { CARE_PHASE_CODES } from "@/core/constants";
import { AggregateID, ICriterion } from "@shared";

export interface OrientationReferenceDto {
  id: AggregateID;
  name: string;
  code: string;
  criteria: ICriterion[];
  treatmentPhase?: CARE_PHASE_CODES;
  updatedAt: string;
  createdAt: string;
}
