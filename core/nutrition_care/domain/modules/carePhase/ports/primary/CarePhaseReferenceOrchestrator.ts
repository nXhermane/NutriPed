import {
  AdmissionVariable,
  AnthroSystemCodes,
  APPETITE_TEST_CODES,
  CALCULATED_MONITORING_ELEMENT,
  CARE_SESSION,
  CLINICAL_SIGNS,
  ClinicalSignChangeDay,
  COMPLICATION_CODES,
  OBSERVATIONS,
  CARE_PHASE_CODES,
} from "@/core/constants";
import { BaseEntityProps, Result, SystemCode } from "@/core/shared";
import { IMonitoringElement, IRecommendedTreatment } from "../../models";

export type CarePhaseEvaluationContext = {
  [AnthroSystemCodes.AGE_IN_MONTH]: number;
  [AnthroSystemCodes.WEIGHT]: number;
  [CARE_SESSION.DAYS_IN_PHASE]: number;
  [APPETITE_TEST_CODES.CODE]: number; // TODO: ici on a penser a transformer les strings des resultats de test d'appetite en nombre au lieu de devoir gérer cette complexité et formattage de string a chaque fois.
  [OBSERVATIONS.EDEMA_GODET_COUNT]: number;
  [CLINICAL_SIGNS.EDEMA]: number;
  [COMPLICATION_CODES.COMPLICATIONS_NUMBER]: number; // TODO: je pense qu'on a même oublié les complications;
  [CLINICAL_SIGNS.LIVER]: number;
  [CALCULATED_MONITORING_ELEMENT.WEIGHT_GAIN_RATE_KG_DAY]: number;
  [CLINICAL_SIGNS.RESPIRATORY_DISTRESS]: number;
  [CLINICAL_SIGNS.DIARRHEA]: number;
  [CALCULATED_MONITORING_ELEMENT.WEIGHT_CHANGE_RATE_DURING_DIARRHEA]: number;
  [CALCULATED_MONITORING_ELEMENT.NUTRITIONAL_MILK_CONSUMPTION_RATE_PERCENT_PER_DAY]: number;
  [CALCULATED_MONITORING_ELEMENT.WEIGHT_LOSS_PERCENT_BETWEEN_TWO_CONSECUTIVE_MEASUREMENTS]: number;
  [CALCULATED_MONITORING_ELEMENT.WEIGHT_LOSS_PERCENT_BETWEEN_THREE_CONSECUTIVE_MEASUREMENTS]: number;
  [CALCULATED_MONITORING_ELEMENT.WEIGHT_GAIN_RATE_DURING_PHASE]: number;
  [AnthroSystemCodes.WFLH_UNISEX]: number;
  [AnthroSystemCodes.WFLH]: number;
  [AnthroSystemCodes.MUAC]: number;
  [AnthroSystemCodes.WFH_UNISEX_NCHS]: number;
} & {
  [k in AdmissionVariable<typeof OBSERVATIONS.EDEMA_GODET_COUNT>]: number;
} & {
  [k in ClinicalSignChangeDay<typeof CLINICAL_SIGNS.EDEMA>]: number;
};
export enum CarePhaseDecision {
  CONTINUE = "continue",
  TRANSITION_TO_NEXT = "transition_to_next",
  FAILURE = "failure",
}
export interface CarePhaseEvaluationStatusResult {
  decision: CarePhaseDecision;
  nextPhaseCode?: CARE_PHASE_CODES;
}
export interface CarePlanRecommendation {
  applicableTreatments: (BaseEntityProps & IRecommendedTreatment)[];
  monitoringElements: (BaseEntityProps & IMonitoringElement)[];
}
export interface CarePlanAjustement {
  treatments: (BaseEntityProps & IRecommendedTreatment)[];
}
export interface ICarePhaseReferenceOrchestrator {
  evaluatePhaseStatus(
    carePhaseCode: SystemCode<CARE_PHASE_CODES>,
    context: CarePhaseEvaluationContext
  ): Promise<Result<CarePhaseDecision>>;
  determineApplicableCare(
    carePhaseCode: SystemCode<CARE_PHASE_CODES>,
    context: CarePhaseEvaluationContext
  ): Promise<Result<CarePlanRecommendation>>;
  ajustOnGoingCarePlan(
    carePhaseCode: SystemCode<CARE_PHASE_CODES>,
    context: CarePhaseEvaluationContext
  ): Promise<CarePlanAjustement>;
}
