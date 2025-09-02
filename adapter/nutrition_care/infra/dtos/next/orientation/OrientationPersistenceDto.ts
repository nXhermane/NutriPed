import { CARE_PHASE_CODES } from "@/core/constants";
import { ICriterion } from "@/core/shared";

export interface OrientationPersistenceDto {
  id: string;
  name: string;
  code: string;
  criteria: ICriterion[];
  treatmentPhase?: CARE_PHASE_CODES;
  createdAt: string;
  updatedAt: string;
}
