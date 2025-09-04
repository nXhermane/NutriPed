import { CARE_PHASE_CODES } from "@/core/constants";
import { CreateCriterion } from "@shared";

export type CreateOrientationReferenceRequest = {
  name: string;
  code: string;
  criteria: CreateCriterion[];
  treatmentPhase: CARE_PHASE_CODES | undefined;
};
