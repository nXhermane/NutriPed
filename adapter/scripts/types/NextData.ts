export interface ICondition {
  value: string;
  variables: string[];
}

export enum CARE_PHASE_CODES {
  CNT_PHASE1 = "cnt_phase_aiguë",
  CNT_TRANS_PHASE = "cnt_phase_transition",
  CNT_PHASE2 = "cnt_phase_rehabilitation",
  CNT_INFANT_LT6m_LT3kg = "cnt_infant_lt6m_lt3kg",
}

export interface PhaseCriterion {
  description: string;
  condition: ICondition;
  variablesExplanation: Record<string, string>;
}

export interface CarePhaseDuration {
  type: "days" | "hours" | "while_phase";
  value?: number;
}

export enum RECOMMENDED_TREATMENT_TYPE {
  NUTRITIONAL = "nutritional",
  SYSTEMATIC = "systematic",
}

export interface TreatmentDuration {
  type: "days" | "hours" | "while_in_phase";
  value?: number;
}

export interface TreatmentTrigger {
  action: "STOP_TREATMENT" | "START_TREATMENT";
  targetCode: string;
}

export enum MONITORING_VALUE_SOURCE {
  CALCULATED = "calculated_monitoring_value",
  NOT_CALCULATED = "not_calculated_monitoring_value",
}

export interface MonitoringFrequency {
  intervalUnit: "day" | "week" | "hours";
  intervalValue: number;
  countInUnit?: number;
}

export enum MONITORING_ELEMENT_CATEGORY {
  ANTHROPOMETRIC = "anthropometric_monitoring_element",
  BIOCHEMICAL = "biochemical_monitoring_element",
  CLINICAL_SIGNS = "clinical_signs_monitoring_element",
  DATA_FIELD = "data_field_monitoring_element",
}

export interface MonitoringElement {
  category: MONITORING_ELEMENT_CATEGORY;
  source: MONITORING_VALUE_SOURCE;
  code: any; // Using any for now, as I don't have all the codes
  frequency: MonitoringFrequency;
  duration: TreatmentDuration;
}

export interface FollowUpAction {
  applicabilities: {
    description: string;
    condition: ICondition;
    variableExplanation: {};
  }[];
  treatmentToApply: RecommendedTreatment[];
}

export interface RecommendedTreatment {
  identifier: string;
  applicabilityCondition: {
    condition: ICondition;
    descritpion: string;
    variableExplanation: { [variable: string]: string };
  };
  type: RECOMMENDED_TREATMENT_TYPE;
  code: any; // Using any for now
  duration: TreatmentDuration;
  frequency: MonitoringFrequency;
  triggers?: {
    onStart?: TreatmentTrigger[];
    onEnd?: TreatmentTrigger[];
  };
  adjustmentPercentage?: number;
}

export interface CarePhaseReference {
  applicabilyConditions: {
    condition: ICondition;
    description: string;
    varaibleExplaination: {};
  }[];
  code: CARE_PHASE_CODES;
  name: string;
  description: string;
  failureCriteria: PhaseCriterion[];
  transitionCriteria: PhaseCriterion[];
  recommendedTreatments: RecommendedTreatment[];
  monitoringPlan: MonitoringElement[];
  followUpPlan: FollowUpAction[];
  nextPhase?: CARE_PHASE_CODES;
  prevPhase?: CARE_PHASE_CODES;
  duration: CarePhaseDuration;
}

export enum MedicineCategory {
  ANTIBACTERIALS = "antibacterials",
  ANTIFUNGALS = "antifungals",
  ANTIMALARIALS = "antimalarials",
  SCABIES = "scabies",
  CARDIAC_FAILURE = "cardiac_failure",
  ALTERNATIVES = "alternatives",
}

export enum AdministrationRoute {
  ORAL = "oral",
  IV = "iv",
  IM = "im",
  IV_IM = "iv/im",
  RECTAL = "rectal",
  TOPICAL = "topical",
  ORAL_IV = "oral/iv",
  ORAL_IM = "oral/im",
}

export enum DosageUnit {
  MG = "mg",
  MG_KG = "mg/kg",
  MG_KG_DAY = "mg/kg/day",
  UI = "UI",
  ML = "ml",
  G = "g",
}

export type Amount =
  | { value: number; unit: DosageUnit }
  | { minValue: number; maxValue: number; unit: DosageUnit };

export interface WeightRange {
  min: number;
  max: number;
  description: string;
}

export interface BaseDosage {
  label: string;
  frequency: number;
  min: number;
  max: number;
  unit: DosageUnit;
}

export interface DosageRange {
  weightRange: WeightRange;
  amount: Amount;
  frequency: number;
}

export interface DosageCase {
  dosageCondition: {
    condition: ICondition;
    description: string;
    variableExplanation: Record<string, string>;
  };
  baseDosage: BaseDosage;
  dosageRanges: DosageRange[];
}

export interface Next_Medicine {
  code: any; // Using any for now
  name: string;
  category: MedicineCategory;
  administrationRoutes: AdministrationRoute[];
  dosageCases: DosageCase[];
  warnings?: string[];
  contraindications?: string[];
  interactions?: string[];
  notes?: string[];
}

export enum MilkType {
  F100 = "f100",
  F75 = "f75",
  F100Diluted = "f100_diluted",
}

export enum FeedingFrequenciePerDay {
  EIGHT = "8",
  FIVE = "5",
  SIX = "6",
}

export interface RecommendedMilkPerWeightRanges {
  weightRange: {
    min: number;
    max: number;
  };
  recommendedQuantityPerMilkRecommendationPerDay: Partial<
    Record<FeedingFrequenciePerDay, number>
  >;
}

export interface Milk {
  name: string;
  type: MilkType;
  doseFormula: ICondition;
  condition: ICondition;
  recommendedMilkPerDay: FeedingFrequenciePerDay[];
  notes: string[];
  recommendationPerRanges: RecommendedMilkPerWeightRanges[];
}

export interface MilkEntity {
  code: MilkType;
  name: string;
  notes: string[];
}

export enum DosageFormulaUnit {
  ML = 'ml',
  G = 'g',
  PACKET = 'packet'
}

export interface ConditionalDosageFormula {
  applicabilities: Array<{
    condition: ICondition;
    description: string;
    variableExplanation: Record<string, string>;
  }>;
  formula: {
    min: ICondition;
    max: ICondition | null;
    unit: DosageFormulaUnit;
    desciption: string;
    variableExplanation: Record<string, string>;
  };
}

export interface DosageByWeight {
  weight_kg: number;
  dosePerMeal: Partial<Record<FeedingFrequenciePerDay, number>>;
}

export interface DosageScenario {
  applicability: {
    condition: ICondition;
    descritption: string;
    variableExplanation: { [variable: string]: string };
  };
  conditionalDosageFormulas: ConditionalDosageFormula[];
  dosages: DosageByWeight[];
  isAdmissionWeight: boolean;
}

export interface NutitionalProduct {
  code: MilkType;
  dosageTables: DosageScenario[];
}

export interface AdmissionCriteria {
  condition: ICondition;
  description: string;
  variableExplanation: { [variable: string]: string };
}

export interface Next_OrientationRef {
  name: string;
  code: string;
  criteria: AdmissionCriteria[];
  treatmentPhase?: CARE_PHASE_CODES;
}
