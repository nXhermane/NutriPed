import {
  APPETITE_TEST_PRODUCT_TYPE,
  APPETITE_TEST_SACHET_FRACTION_PARTITION,
  ConditionResult,
  TREATMENT_HISTORY_VARIABLES_CODES,
} from "@core/constants";
import {
  AdministrationRoute,
  Amount,
  APPETITE_TEST_RESULT_CODES,
  CarePhaseDto,
  CreateClinicalEvent,
  CreateMonitoringEntry,
  CreateNutritionalTreatmentAction,
  DosageUnit,
  RecommendedMilkPerDay,
  ValueTypeDto,
  WeightRange,
} from "@core/nutrition_care";
import {
  CreateTreatmentTrigger,
  IDuration,
  IFrequency,
  NextCore,
} from "@/core/nutrition_care/domain";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { UserResponseSummaryPersistenceDto } from "../../dtos/next/core";
import { CreateCriterion } from "@/core/shared";
import { CreateDosageScenario } from "@/core/nutrition_care/domain/modules/next";

// Type definitions for JSON fields
type NutritionalOrMedicalAction =
  | NextCore.INutritionalAction
  | NextCore.IMedicalAction;
type MonitoringTaskData = NextCore.IMonitoringTask;
type MonitoringParameterElementData = NextCore.IMonitoringParameterElement;
type OnGoingTreatmentRecommendationData =
  NextCore.IOnGoingTreatmentRecommendation;
type UserDecisionDataType = NextCore.UserDecisionData;

export const appetite_test_references = sqliteTable(
  "appetite_test_references",
  {
    id: text("appetite_test_reference_id").primaryKey(),
    createdAt: text("created_at", { length: 50 }).notNull(),
    updatedAt: text("updated_at", { length: 50 }).notNull(),
    name: text("name", { length: 255 }).notNull(),
    code: text("code", { length: 255 }).notNull(),
    productType: text("product_type", { mode: "json" }).$type<
      APPETITE_TEST_PRODUCT_TYPE[]
    >(),
    appetiteTestTable: text("appetite_test_table", { mode: "json" })
      .$type<
        {
          weightRange: [number, number];
          sachetRange: [
            APPETITE_TEST_SACHET_FRACTION_PARTITION,
            APPETITE_TEST_SACHET_FRACTION_PARTITION,
          ];
          potRange: [number, number];
        }[]
      >()
      .notNull(),
  }
);
export const complications = sqliteTable("complications", {
  id: text("complication_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  name: text("name", { length: 255 }).notNull(),
  code: text("code", { length: 255 }).notNull(),
  description: text("description", { mode: "json" }).$type<string>().notNull(),
});

export const medicines = sqliteTable("medicines", {
  id: text("medicine_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  name: text("name", { length: 255 }).notNull(),
  code: text("code", { length: 255 }).notNull(),
  category: text("category", {
    enum: [
      "antibacterials",
      "antifungals",
      "antimalarials",
      "scabies",
      "cardiac_failure",
      "alternatives",
    ],
  }).notNull(),
  administrationRoutes: text("administration_routes", { mode: "json" }).$type<
    AdministrationRoute[]
  >(),
  baseDosage: text("base_dosage", { mode: "json" })
    .$type<{
      label: string;
      frequency: number;
      min: number;
      max: number;
      unit: DosageUnit;
    }>()
    .notNull(),
  dosageRanges: text("dosage_ranges", { mode: "json" })
    .$type<
      {
        weightRange: WeightRange;
        amount: Amount;
        frequency: number;
      }[]
    >()
    .notNull(),
  warnings: text("warnings", { mode: "json" }).$type<string[]>(),
  contraindications: text("contraindications", { mode: "json" }).$type<
    string[]
  >(),
  interactions: text("interactions", { mode: "json" }).$type<string[]>(),
  notes: text("notes", { mode: "json" }).$type<string[]>(),
});

export const milks = sqliteTable("milks", {
  id: text("milk_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  name: text("name", { length: 255 }).notNull(),
  type: text("type", { enum: ["f100", "f75", "f100_diluted"] }).notNull(),
  doseFormula: text("dose_formula", { mode: "json" })
    .$type<{ value: string; variables: string[] }>()
    .notNull(),
  condition: text("condition", { mode: "json" })
    .$type<{ value: string; variables: string[] }>()
    .notNull(),
  recommendedMilkPerDay: text("recommended_milk_per_day", { mode: "json" })
    .$type<RecommendedMilkPerDay[]>()
    .notNull(),
  recommendationPerRanges: text("recommendation_per_ranges", {
    mode: "json",
  })
    .$type<
      {
        weightRange: {
          min: number;
          max: number;
        };
        recommendedQuantityPerMilkRecommendationPerDay: Partial<
          Record<RecommendedMilkPerDay, number>
        >;
      }[]
    >()
    .notNull(),
});
export const orientation_references = sqliteTable("orientation_references", {
  id: text("orientation_reference_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  name: text("name", { length: 255 }).notNull(),
  code: text("code", { length: 255 }).notNull(),
  admissionCriteria: text("admission_criteria", { mode: "json" })
    .$type<{ value: string; variables: string[] }[]>()
    .notNull(),
  admissionTypes: text("admission_types", { mode: "json" })
    .$type<
      {
        code: string;
        name: string;
        condition: { value: string; variables: string[] };
      }[]
    >()
    .notNull(),
});

export const daily_care_journals = sqliteTable("daily_care_journals", {
  id: text("daily_care_journal_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  date: text("date", { length: 50 }).notNull(),
  dayNumber: integer("day_number").notNull(),
  monitoringValues: text("monitoring_values", { mode: "json" })
    .$type<CreateMonitoringEntry[]>()
    .notNull(),
  observations: text("observations", { mode: "json" })
    .$type<CreateClinicalEvent[]>()
    .notNull(),
  treatmentActions: text("treatment_actions", { mode: "json" })
    .$type<CreateNutritionalTreatmentAction[]>()
    .notNull(),
  appetiteTestResults: text("appetite_test_results", { mode: "json" })
    .$type<{ code: string; result: APPETITE_TEST_RESULT_CODES }[]>()
    .notNull(),
});

export const patient_current_states = sqliteTable("patient_current_states", {
  id: text("patient_current_state_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  anthropometricData: text("anthropometric_data", { mode: "json" })
    .$type<{ [key: string]: ValueTypeDto<number> }>()
    .notNull(),
  clinicalSignData: text("clinical_sign_data", { mode: "json" })
    .$type<{
      [key: string]: ValueTypeDto<
        (typeof ConditionResult)[keyof typeof ConditionResult]
      >;
    }>()
    .notNull(),
  biologicalData: text("biological_data", { mode: "json" })
    .$type<{ [key: string]: ValueTypeDto<number> }>()
    .notNull(),
  appetiteTestResult: text("appetite_test_result", { mode: "json" })
    .$type<
      { code: string; result: ValueTypeDto<APPETITE_TEST_RESULT_CODES> }[]
    >()
    .notNull(),
  complicationData: text("complication_data", { mode: "json" })
    .$type<{
      [key: string]: ValueTypeDto<
        (typeof ConditionResult)[keyof typeof ConditionResult]
      >;
    }>()
    .notNull(),
  otherData: text("other_data", { mode: "json" })
    .$type<{
      [TREATMENT_HISTORY_VARIABLES_CODES.PREVIOUS_TREATMENT]:
        | "ORIENTATION_HOME"
        | "ORIENTATION_CRENAM"
        | "ORIENTATION_CNT"
        | "ORIENTATION_CNA";
    }>()
    .notNull(),
});

export const patient_care_sessions = sqliteTable("patient_care_sessions", {
  id: text("patient_care_session_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  patientId: text("patient_id", { length: 50 }).notNull(),
  startDate: text("start_date", { length: 50 }).notNull(),
  endDate: text("end_date", { length: 50 }),
  orientation: text("orientation", { mode: "json" })
    .$type<{ name: string; code: string }>()
    .notNull(),
  carePhases: text("care_phases", { mode: "json" }).$type<any[]>().notNull(),
  currentState: text("current_state_id", { length: 50 }).notNull(),
  dailyJournals: text("daily_journals", { mode: "json" })
    .$type<{ id: string; date: string }[]>()
    .notNull(),
  currentDailyJournal: text("current_daily_journal_id", { length: 50 }),
  status: text("status", {
    enum: ["not_ready", "in_progress", "completed"],
  }).notNull(),
});

export const next_medicines = sqliteTable("next_medicines", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  administrationRoutes: text("administration_routes", {
    mode: "json",
  }).notNull(),
  dosageCases: text("dosage_cases", { mode: "json" }).notNull(),
  warnings: text("warnings", { mode: "json" }).notNull(),
  contraindications: text("contraindications", { mode: "json" }).notNull(),
  interactions: text("interactions", { mode: "json" }).notNull(),
  notes: text("notes", { mode: "json" }).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Next Nutritional Product Tables
export const next_nutritional_products = sqliteTable(
  "next_nutritional_products",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    dosageTables: text("dosage_tables", { mode: "json" })
      .$type<CreateDosageScenario[]>()
      .notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  }
);

export const next_milks = sqliteTable("next_milks", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  notes: text("notes", { mode: "json" }).$type<string[]>().notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

// Next Orientation Tables
export const next_orientation_references = sqliteTable(
  "next_orientation_references",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    code: text("code").notNull(),
    criteria: text("criteria", { mode: "json" })
      .$type<CreateCriterion[]>()
      .notNull(),
    treatmentPhase: text("treatment_phase"),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  }
);

// Next Core Tables
export const care_phases = sqliteTable("care_phases", {
  id: text("id").primaryKey(),
  status: text("status").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  monitoringParameters: text("monitoring_parameters", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  onGoingTreatments: text("on_going_treatments", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const daily_care_actions = sqliteTable("daily_care_actions", {
  id: text("id").primaryKey(),
  treatmentId: text("treatment_id").notNull(),
  status: text("status").notNull(),
  type: text("type").notNull(),
  action: text("action", { mode: "json" })
    .$type<NutritionalOrMedicalAction>()
    .notNull(),
  effectiveDate: text("effective_date").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const daily_monitoring_tasks = sqliteTable("daily_monitoring_tasks", {
  id: text("id").primaryKey(),
  monitoringId: text("monitoring_id").notNull(),
  status: text("status").notNull(),
  task: text("task", { mode: "json" }).$type<MonitoringTaskData>().notNull(),
  effectiveDate: text("effective_date").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const daily_care_records = sqliteTable("daily_care_records", {
  id: text("id").primaryKey(),
  date: text("date").notNull(),
  status: text("status").notNull(),
  treatmentActions: text("treatment_actions", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  monitoringTasks: text("monitoring_tasks", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  type: text("type").notNull(),
  content: text("content").notNull(),
  timestamp: text("timestamp").notNull(),
  requiresResponse: integer("requires_response", { mode: "boolean" }).notNull(),
  decisionType: text("decision_type"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const monitoring_parameters = sqliteTable("monitoring_parameters", {
  id: text("id").primaryKey(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  nextTaskDate: text("next_task_date"),
  lastExecutionDate: text("last_execution_date"),
  element: text("element", { mode: "json" })
    .$type<MonitoringParameterElementData>()
    .notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const on_going_treatments = sqliteTable("on_going_treatments", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  status: text("status").notNull(),
  nextActionDate: text("next_action_date"),
  lastExecutionDate: text("last_execution_date"),
  recommendation: text("recommendation", { mode: "json" })
    .$type<OnGoingTreatmentRecommendationData>()
    .notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const user_response_summaries = sqliteTable("user_response_summaries", {
  id: text("id").primaryKey(),
  messageId: text("message_id").notNull(),
  response: text("response").notNull(),
  timestamp: text("timestamp").notNull(),
  decisionData: text("decision_data", { mode: "json" })
    .$type<UserDecisionDataType>()
    .notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const patient_care_session_aggregates = sqliteTable(
  "patient_care_session_aggregates",
  {
    id: text("id").primaryKey(),
    patientId: text("patient_id").notNull(),
    status: text("status").notNull(),
    startDate: text("start_date").notNull(),
    endDate: text("end_date"),
    currentPhase: text("current_phase"),
    currentDailyRecord: text("current_daily_record"),
    phaseHistory: text("phase_history", { mode: "json" })
      .$type<string[]>()
      .notNull(),
    dailyRecords: text("daily_records", { mode: "json" })
      .$type<string[]>()
      .notNull(),
    inbox: text("inbox", { mode: "json" }).$type<string[]>().notNull(),
    responses: text("responses", { mode: "json" })
      .$type<UserResponseSummaryPersistenceDto[]>()
      .notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
  }
);

export const care_phase_references = sqliteTable("care_phase_references", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  nextPhaseCode: text("next_phase_code"),
  prevPhaseCode: text("prev_phase_code"),
  applicabilyConditions: text("applicabily_conditions", {
    mode: "json",
  }).notNull(),
  failureCriteria: text("failure_criteria", { mode: "json" }).notNull(),
  transitionCriteria: text("transition_criteria", { mode: "json" }).notNull(),
  recommendedTreatments: text("recommended_treatments", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  monitoringElements: text("monitoring_elements", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  followUpActions: text("follow_up_actions", { mode: "json" }).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const recommended_treatments = sqliteTable("recommended_treatments", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  triggers: text("treatment_triggers", { mode: "json" })
    .$type<{
      onStart: CreateTreatmentTrigger[];
      onEnd: CreateTreatmentTrigger[];
    }>()
    .notNull(),
  duration: text("duration", { mode: "json" }).$type<IDuration>().notNull(),
  frequency: text("frequency", { mode: "json" }).$type<IFrequency>().notNull(),
  ajustmentPercentage: integer("ajustment_percentage"),
  type: text("type", { enum: ["nutritional", "systematic"] }),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const monitoring_elements = sqliteTable("monitoring_elements", {
  id: text("id").primaryKey(),
  code: text("code").notNull(),
  category: text("category", {
    enum: [
      "anthropometric_monitoring_element",
      "biochemical_monitoring_element",
      "clinical_signs_monitoring_element",
      "data_field_monitoring_element",
    ],
  }).notNull(),
  source: text("source", {
    enum: ["calculated_monitoring_value", "not_calculated_monitoring_value"],
  }).notNull(),
  frequency: text("frequency", { mode: "json" }).$type<IFrequency>().notNull(),
  duration: text("duration", { mode: "json" }).$type<IDuration>().notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});
