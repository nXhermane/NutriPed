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
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
    AdministrationRoute[]>(),
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
  carePhases: text("care_phases", { mode: "json" })
    .$type<CarePhaseDto[]>()
    .notNull(),
  currentState: text("current_state_id", { length: 50 }).notNull(),
  dailyJournals: text("daily_journals", { mode: "json" })
    .$type<{ id: string; date: string }[]>()
    .notNull(),
  currentDailyJournal: text("current_daily_journal_id", { length: 50 }),
  status: text("status", {
    enum: ["not_ready", "in_progress", "completed"],
  }).notNull(),
});
