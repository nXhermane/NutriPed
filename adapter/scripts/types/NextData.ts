type ValueOf<T> = T[keyof T];

export interface ICondition {
  value: string;
  variables: string[];
}

export enum AnthroSystemCodes {
  HEIGHT = "height",
  LENGTH = "length",
  LENHEI = "lenhei",
  WEIGHT = "weight",
  BMI = "bmi",
  HEAD_CIRCUMFERENCE = "head_circumference",
  MUAC = "muac",
  TSF = "tsf",
  SSF = "ssf",
  WFLH = "wflh",
  WFLH_UNISEX = "wflh_unisex",
  WFH_UNISEX_NCHS = "wfh_unisex_nchs",
  WFA = "wfa",
  HFA = "hfa",
  BMI_FOR_AGE = "bmi_for_age",
  MUAC_FOR_AGE = "muac_for_age",
  TSF_FOR_AGE = "tsf_for_age",
  SSF_FOR_AGE = "ssf_for_age",
  HC_FOR_AGE = "hc_for_age",
  AGE_IN_DAY = "age_in_day",
  AGE_IN_MONTH = "age_in_month",
  SEX = "sex",
}

export const BIOCHEMICAL_REF_CODES = {
  BIOCHEMICAL_IONO_NA: "biochemical_iono_na",
  BIOCHEMICAL_IONO_K: "biochemical_iono_k",
  BIOCHEMICAL_IONO_CL: "biochemical_iono_cl",
  BIOCHEMICAL_IONO_CA: "biochemical_iono_ca",
  BIOCHEMICAL_IONO_MG: "biochemical_iono_mg",
  BIOCHEMICAL_KIDNEY_UREA: "biochemical_kidney_urea",
  BIOCHEMICAL_KIDNEY_CREA: "bichemical_kidney_creatinine",
  BIOCHEMICAL_BLOOD_GLUCOSE: "biochemical_blood_glucose",
  BIOCHEMICAL_ENZY_ALT: "biochemical_enzy_alt",
  BIOCHEMICAL_ENZY_GGT: "biochemical_enzy_ggt",
  BIOCHEMICAL_ENZY_BILIRUBIN_TOTAL: "biochemical_enzy_bilirubin_total",
  BIOCHEMICAL_FAT_CHELESTEROL_TOTAL: "biochemical_fat_cholesterol_total",
  BIOCHEMICAL_FAT_HDL: "biochemical_fat_hdl",
  BIOCHEMICAL_FAT_TG: "bichemical_fat_triglycerides",
} as const;

export const OBSERVATIONS = {
  SUBCOSTAL_RETRACTION: "observation_subcostal_retraction",
  EDEMA_PRESENCE: "observation_edema_presence",
  EDEMA_GODET_COUNT: "observation_edema_godet_count",
  SKIN_CHANGES: "observation_skin_changes",
  HAIR_CHANGES: "observation_hair_changes",
  NAIL_CHANGES: "observation_nail_changes",
  CORNEA_CHANGES: "observation_cornea_changes",
  MOUTH_CHANGES: "observation_mouth_changes",
  HEMORRHAGE_SIGNS: "observation_hemorrhage_signs",
  MUSCLE_LOSS: "observation_muscle_loss",
  NEURO_SIGNS: "observation_neuro_signs",
  HEPATOMEGALY: "observation_hepatomegaly",
  JOINT_ENLARGEMENT: "observation_joint_enlargement",
  TACHYCARDIA: "observation_tachycardia",
} as const;

export const VITAL_SIGNS = {
  TEMPERATURE: "vital_sign_temperature",
  RESPIRATORY_RATE: "vital_sign_respiratory_rate",
} as const;

export const DATA_POINTS = {
  LIQUID_STOOL_COUNT: "data_liquid_stool_count_per_day",
  VOMITING_COUNT: "data_vomiting_count",
  GENERAL_CONDITION: "data_general_condition",
  NUTRITIONAL_MILK_CONSUMPTION_G_PER_DAY:
    "data_nutritional_milk_consumption_in_g_per_day",
  IS_BREASTFED: "data_is_breastfed",
} as const;

export const QUESTIONS = {
  EYELIDS_DURING_SLEEP: "question_eyelids_during_sleep",
  CONSCIOUSNESS_LEVEL: "question_consciousness_level",
} as const;

export type DATA_FIELD_CODE_TYPE =
  | ValueOf<typeof OBSERVATIONS>
  | ValueOf<typeof VITAL_SIGNS>
  | ValueOf<typeof DATA_POINTS>
  | ValueOf<typeof QUESTIONS>;

export const CLINICAL_SIGNS = {
  HYPERTHERMIA: "clinical_hyperthermia",
  HYPOTHERMIA: "clinical_hypothermia",
  HYPOGLYCEMIA: "clinical_hypoglycemia",
  DIARRHEA: "clinical_diarrhea",
  VOMITING: "clinical_vomiting",
  SEVERE_SICKNESS: "clinical_severe_sickness",
  RESPIRATORY_DISTRESS: "clinical_respiratory_distress",
  EDEMA: "clinical_edema",
  SKIN: "clinical_skin_sign",
  HAIR: "clinical_hair_sign",
  NAILS: "clinical_nails_sign",
  CORNEA: "clinical_cornea_sign",
  MOUTH: "clinical_mouth_sign",
  HEMORRHAGE: "clinical_hemorrhage",
  MUSCLE: "clinical_muscle_sign",
  NEURO: "clinical_neuro_signs",
  LIVER: "clinical_liver_signs",
  JOINT: "clinical_joiint_signs",
  CARDIAC: "clinical_cardiac_signs",
} as const;

export enum MEDICINE_CODES {
  AMOX = "AMOX",
  AMP = "AMP",
  GENT = "GENT",
  CEFO = "CEFO",
  CIPRO = "CIPRO",
  CLOXA = "CLOXA",
  METRO = "METRO",
  NYST = "NYST",
  FLUC = "FLUC",
  FURO = "FURO",
  CEFT = "CEFT",
  AMOXI_ACIDE_CLAVULANIQUE = "AMOXI_ACIDE_CLAVULANIQUE",
}

export enum MilkType {
  F100 = "f100",
  F75 = "f75",
  F100Diluted = "f100_diluted",
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
  code:
    | AnthroSystemCodes
    | ValueOf<typeof BIOCHEMICAL_REF_CODES>
    | DATA_FIELD_CODE_TYPE
    | ValueOf<typeof CLINICAL_SIGNS>;
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
  code: MilkType | MEDICINE_CODES;
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
  code: MEDICINE_CODES;
  name: string;
  category: MedicineCategory;
  administrationRoutes: AdministrationRoute[];
  dosageCases: DosageCase[];
  warnings?: string[];
  contraindications?: string[];
  interactions?: string[];
  notes?: string[];
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
