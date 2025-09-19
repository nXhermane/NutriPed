import { CARE_PHASE_CODES } from "@/core/constants";
import { AggregateID, CreateCriterion } from "@/core/shared";
import { EntityPersistenceDto } from "../../../../shared";
import {
  CreateFollowUpAction,
  MonitoringElement,
  RecommendedTreatment,
} from "@/core/nutrition_care/domain";

export interface CarePhaseReferencePersistenceDto extends EntityPersistenceDto {
  code: CARE_PHASE_CODES;
  name: string;
  description: string;
  nextPhaseCode?: CARE_PHASE_CODES;
  prevPhaseCode?: CARE_PHASE_CODES;
  applicabilyConditions: CreateCriterion[];
  failureCriteria: CreateCriterion[];
  transitionCriteria: CreateCriterion[];
  recommendedTreatments: AggregateID[];
  monitoringElements: AggregateID[];
  followUpActions: CreateFollowUpAction[];
}

export interface CarePhaseReferencePersistenceRecordDto
  extends EntityPersistenceDto {
  code: CARE_PHASE_CODES;
  name: string;
  description: string;
  nextPhaseCode?: CARE_PHASE_CODES;
  prevPhaseCode?: CARE_PHASE_CODES;
  applicabilyConditions: CreateCriterion[];
  failureCriteria: CreateCriterion[];
  transitionCriteria: CreateCriterion[];
  recommendedTreatments: RecommendedTreatment[];
  monitoringElements: MonitoringElement[];
  followUpActions: CreateFollowUpAction[];
}
