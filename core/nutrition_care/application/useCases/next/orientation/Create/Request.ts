import { CARE_PHASE_CODES } from "@/core/constants";
import { CreateCriterion } from "@/core/shared";

export interface Request {
  name: string;
  code: string;
  criteria: CreateCriterion[];
  treatmentPhase: CARE_PHASE_CODES | undefined;
}
