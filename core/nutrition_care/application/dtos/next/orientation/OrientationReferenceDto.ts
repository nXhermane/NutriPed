import { CARE_PHASE_CODES } from "@/core/constants";
import { AggregateID, ICriterion } from "@/core/shared";

export interface OrientationReferenceDto {
  id: AggregateID;
  name: string;
  code: string;
  criteria: ICriterion[];
  treatmentPhase?: CARE_PHASE_CODES;
  createdAt: string;
  updatedAt: string;
}
