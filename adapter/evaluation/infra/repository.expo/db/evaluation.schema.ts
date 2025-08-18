import {
  BiochemicalRangeStatus,
  ClinicalDataType,
  GrowthIndicatorRange,
  GrowthRefChartAndTableCodes,
  GrowthStandard,
  StandardShape,
} from "@core/constants";
import { Sex } from "@shared";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { NutritionalAssessmentResultPersistenceDto } from "../../dtos";

export const anthropometric_measures = sqliteTable("anthropometric_measures", {
  id: text("anthropometric_measure_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  name: text("anthropometric_measure_name", { length: 200 }).notNull(),
  code: text("anthropometric_measure_code", { length: 10 }).notNull(),
  validationRules: text("anthropometric_measure_validation_rules", {
    mode: "json",
  }).$type<{ condition: string; rule: string; variables: string[] }[]>(),
  availableUnit: text("anthropometric_measure_available_unit", {
    mode: "json",
  }).$type<string[]>(),
  unit: text("anthropometric_measure_unit", { length: 10 }).notNull(),
});

export const growth_reference_charts = sqliteTable("growth_reference_charts", {
  id: text("growth_reference_chart_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  code: text("growth_reference_chart_code", { length: 10 }).notNull(),
  name: text("growth_reference_chart_name", { length: 255 }).notNull(),
  standard: text("growth_reference_chart_standard", {
    enum: ["oms", "nchs", "cdc"],
  }).notNull(),
  sex: text("growth_reference_sex", { enum: ["M", "F", "O"] }).notNull(),
  data: text("growth_reference_chart_data", { mode: "json" })
    .$type<
      {
        value: number;
        median: number;
        l: number;
        s: number;
        curvePoints: Record<string, number>;
      }[]
    >()
    .notNull(),
});

export const growth_reference_tables = sqliteTable("growth_reference_tables", {
  id: text("growth_reference_table_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  name: text("growth_reference_table_name", { length: 255 }).notNull(),
  code: text("growth_reference_table_code", { length: 10 }).notNull(),
  standard: text("growth_reference_table_standard", {
    enum: ["oms", "nchs", "cdc"],
  }).notNull(),
  data: text("growth_reference_table_data", { mode: "json" })
    .$type<
      {
        value: number;
        median: number;
        normalNeg: number;
        moderateNeg: number;
        hightSeverNeg: number;
        outComeTargetValueNeg: number;
        severeNeg: number;
        isUnisex: boolean;
        sex: `${Sex}`;
      }[]
    >()
    .notNull(),
});

export const indicators = sqliteTable("indicators", {
  id: text("indicator_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  name: text("indicator_name", { length: 255 }).notNull(),
  code: text("indicator_code", { length: 10 }).notNull(),
  neededMeasureCodes: text("indicator_needed_measure_codes", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  axeX: text("indicator_axe_x", { mode: "json" })
    .$type<{ value: string; variables: string[] }>()
    .notNull(),
  axeY: text("indicator_axe_y", { mode: "json" })
    .$type<{ value: string; variables: string[] }>()
    .notNull(),
  availableRefCharts: text("indicator_available_ref_charts", { mode: "json" })
    .$type<
      { chartCode: string; condition: { value: string; variables: string[] } }[]
    >()
    .notNull(),
  usageConditions: text("indicator_usage_conditions", { mode: "json" })
    .$type<{ value: string; variables: string[] }>()
    .notNull(),
  interpretations: text("indicator_interpretations", { mode: "json" })
    .$type<
      {
        name: string;
        code: string;
        range: GrowthIndicatorRange;
        condition: { value: string; variables: string[] };
      }[]
    >()
    .notNull(),
  zScoreComputingStrategy: text("indicator_z_score_computing_strategy", {
    enum: ["age_based", "lenhei_based", "table_based"],
  }).notNull(),
  standardShape: text("indicator_standard_shape", {
    enum: ["growth_table", "growth_curve"],
  }).notNull(),
  availableRefTables: text("indicator_available_ref_tables", { mode: "json" })
    .$type<
      { tableCode: string; condition: { value: string; variables: string[] } }[]
    >()
    .notNull(),
});

export const biochemical_references = sqliteTable("biochemical_references", {
  id: text("biochemical_reference_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  name: text("biochemical_reference_name", { length: 255 }).notNull(),
  code: text("biochemical_reference_code", { length: 10 }).notNull(),
  unit: text("biochemical_reference_unit", { length: 10 }).notNull(),
  availableUnits: text("biochemical_reference_available_units", {
    mode: "json",
  })
    .$type<string[]>()
    .notNull(),
  ranges: text("biochemical_reference_ranges", { mode: "json" })
    .$type<
      {
        condition: { value: string; variables: string[] };
        range: {
          min: [value: number, notStrict: boolean];
          max: [value: number, notStrict: boolean];
        };
        under: string[];
        over: string[];
      }[]
    >()
    .notNull(),
  source: text("biochemical_reference_source", { length: 255 }).notNull(),
  notes: text("biochemical_reference_notes", { mode: "json" })
    .$type<string[]>()
    .notNull(),
});

export const clinical_sign_references = sqliteTable(
  "clinical_sign_references",
  {
    id: text("clinical_sign_reference_id").primaryKey(),
    createdAt: text("created_at", { length: 50 }).notNull(),
    updatedAt: text("updated_at", { length: 50 }).notNull(),
    name: text("clinical_sign_reference_name", { length: 255 }).notNull(),
    code: text("clinical_sign_reference_code", { length: 10 }).notNull(),
    description: text("clinical_sign_reference_description", { mode: "json" })
      .$type<string>()
      .notNull(),
    evaluationRule: text("clinical_sign_reference_evaluation_rule", {
      mode: "json",
    })
      .$type<{ value: string; variables: string[] }>()
      .notNull(),
    data: text("clinical_sign_reference_data", { mode: "json" })
      .$type<
        {
          name: string;
          code: string;
          question: string;
          dataType: ClinicalDataType;
          required: boolean;
          dataRange?: [number, number];
          enumValue?: { label: string; value: string }[];
          units?: { default: string; available: string[] };
        }[]
      >()
      .notNull(),
  }
);

export const nutritional_risk_factors = sqliteTable(
  "nutritional_risk_factors",
  {
    id: text("nutritional_risk_factor_id").primaryKey(),
    createdAt: text("created_at", { length: 50 }).notNull(),
    updatedAt: text("updated_at", { length: 50 }).notNull(),
    clinicalSignCode: text("nutritional_risk_factor_clinical_sign_code", {
      length: 10,
    }).notNull(),
    associatedNutrients: text("nutritional_risk_factor_associated_nutrients", {
      mode: "json",
    })
      .$type<{ nutrient: string; effect: "deficiency" | "excess" }[]>()
      .notNull(),
    modulatingCondition: text("nutritional_risk_factor_modulating_condition", {
      mode: "json",
    })
      .$type<{ value: string; variables: string[] }>()
      .notNull(),
    recommendedTests: text("nutritional_risk_factor_recommended_tests", {
      mode: "json",
    })
      .$type<{ testName: string; reason: string }[]>()
      .notNull(),
  }
);

export const diagnostic_rules = sqliteTable("diagnostic_rules", {
  id: text("diagnostic_rule_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  name: text("diagnostic_rule_name", { length: 255 }).notNull(),
  code: text("diagnostic_rule_code", { length: 10 }).notNull(),
  conditions: text("diagnostic_rule_conditions", { mode: "json" })
    .$type<{ value: string; variables: string[] }[]>()
    .notNull(),
});

export const nutritional_assessment_results = sqliteTable(
  "nutritional_assessment_results",
  {
    id: text("nutritional_assessment_result_id").primaryKey(),
    createdAt: text("created_at", { length: 50 }).notNull(),
    updatedAt: text("updated_at", { length: 50 }).notNull(),
    globalDiagnostics: text(
      "nutritional_assessment_result_global_diagnostics",
      { mode: "json" }
    )
      .$type<{ code: string; criteriaUsed: string[] }[]>()
      .notNull(),
    growthIndicatorValues: text(
      "nutritional_assessment_result_growth_indicator_values",
      { mode: "json" }
    )
      .$type<
        {
          code: string;
          unit: string;
          reference: {
            standard: `${GrowthStandard}`;
            sourceType: `${StandardShape}`;
            source: `${GrowthRefChartAndTableCodes}`;
          };
          valueRange: `${GrowthIndicatorRange}`;
          interpretation: string;
          value: number;
          isValid: boolean;
          computedValue: [xAxis: number, yAxis: number];
        }[]
      >()
      .notNull(),
    clinicalAnalysis: text("nutritional_assessment_result_clinical_analysis", {
      mode: "json",
    })
      .$type<
        {
          clinicalSign: string;
          suspectedNutrients: {
            nutrient: string;
            effect: "deficiency" | "excess";
          }[];
          recommendedTests: {
            testName: string;
            reason: string;
          }[];
        }[]
      >()
      .notNull(),
    biologicalInterpretation: text(
      "nutritional_assessment_result_biological_interpretation",
      { mode: "json" }
    )
      .$type<
        {
          code: string;
          interpretation: string[];
          status?: `${BiochemicalRangeStatus}`;
        }[]
      >()
      .notNull(),
  }
);

export const patient_diagnostic_data = sqliteTable("patient_diagnostic_data", {
  id: text("patient_diagnostic_data_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  sex: text("patient_diagnostic_data_sex", { enum: ["F", "M", "O"] }).notNull(),
  birthday: text("patient_diagnostic_data_birthday", { length: 50 }).notNull(),
  anthropMeasures: text("patient_diagnostic_data_anthrop_measures", {
    mode: "json",
  })
    .$type<{ code: string; value: number; unit: string }[]>()
    .notNull(),
  clinicalSigns: text("patient_diagnostic_data_clinical_signs", {
    mode: "json",
  })
    .$type<
      {
        clinicalSigns: { code: string; data: Record<string, any> }[];
      }[]
    >()
    .notNull(),
  biologicalTestResults: text(
    "patient_diagnostic_data_biological_test_results",
    { mode: "json" }
  )
    .$type<{ code: string; value: number; unit: string }[]>()
    .notNull(),
});

export const nutritional_diagnostics = sqliteTable("nutritional_diagnostics", {
  id: text("nutritional_diagnostic_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  patientId: text("patient_id", { length: 50 }).notNull(),
  patientData: text("patient_data_id", { length: 50 }).notNull(),
  result: text("nutritional_diagnostic_results_id", { length: 50 }),
  date: text("nutritional_diagnostic_date", { length: 50 }).notNull(),
  notes: text("nutritional_diagnostic_notes", { mode: "json" })
    .$type<string[]>()
    .notNull(),
  atInit: integer("nutritional_diagnostic_at_init", {
    mode: "boolean",
  }).notNull(),
  modificationHistories: text("nutritional_diagnostic_modification_histories", {
    mode: "json",
  })
    .$type<
      {
        prevResult: NutritionalAssessmentResultPersistenceDto;
        nextResult: NutritionalAssessmentResultPersistenceDto;
        date: string;
        reason: string;
      }[]
    >()
    .notNull(),
});


/**
 * @version v0.0.1-next
 **/
export const data_field_references = sqliteTable("data_field_references", {
  id: text('field_id').primaryKey(),
  code: text('field_code', { length: 50 }).notNull(),
  label: text("field_label", { length: 250 }).notNull(),
  question: text('field_question', { length: 500 }).notNull(),
  category: text("field_category", { enum: ["observation_data_field", "vital_sign_data_field", "question_data_field", "data_points_data_field"] }).notNull(),
  type: text('field_type', { enum: ["string", "number", "boolean", "enum", "range", "quantity"] }).notNull(),
  range: text('field_range', { mode: 'json' }).$type<[number, number] | undefined>(),
  enum: text('field_enum', { mode: 'json' }).$type<{ label: string, value: string }[]>(),
  units: text('field_units', { mode: 'json' }).$type<{ default: string, available: string[] }>(),
  defaultValue: text('field_value', { mode: 'json' }).$type<any>(),
  createdAt: text('createdAt', { length: 50 }).notNull(),
  updatedAt: text("updatedAt", { length: 50 }).notNull()
}) 