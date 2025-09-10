import { CARE_PHASE_CODES } from "@/core/constants";
import {
  CreateFollowUpAction,
  CreateMonitoringElement,
  CreateRecommededTreatment,
} from "@/core/nutrition_care/domain";
import { AggregateID, CreateCriterion } from "@/core/shared";

export interface CarePhaseReferenceDto {
  id: AggregateID;
  code: CARE_PHASE_CODES;
  name: string;
  description: string;
  nextPhaseCode?: CARE_PHASE_CODES;
  prevPhaseCode?: CARE_PHASE_CODES;
  applicabilyConditions: CreateCriterion[];
  failureCriteria: CreateCriterion[];
  transitionCriteria: CreateCriterion[];
  recommendedTreatments: (CreateRecommededTreatment & { id: AggregateID })[];
  monitoringElements: (CreateMonitoringElement & { id: AggregateID })[];
  followUpActions: CreateFollowUpAction[];
  createdAt: string;
  updatedAt: string;
}
