import { CARE_PHASE_CODES } from "@/core/constants";
import { AggregateID, CreateCriterion } from "@shared";

export type UpdateOrientationReferenceRequest = {
  id: AggregateID;
  data: {
    name?: string;
    code?: string;
    criteria?: CreateCriterion[];
    treatmentPhase?: CARE_PHASE_CODES;
  };
};
