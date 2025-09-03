import { CARE_PHASE_CODES } from "@/core/constants";
import { AggregateID, CreateCriterion } from "@shared";

export interface UpdateOrientationReferenceRequest {
  id: AggregateID;
  name?: string;
  code?: string;
  criteria?: CreateCriterion[];
  treatmentPhase?: CARE_PHASE_CODES;
}
