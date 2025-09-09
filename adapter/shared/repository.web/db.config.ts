export const DB_CONFIG = {
  name: "nutrition_app_db",
  version: 4,
  stores: {
    // Next modules
    next_medicines: { keyPath: "id", indexes: ["code"] },
    next_nutritional_products: { keyPath: "id", indexes: ["code"] },
    next_milks: { keyPath: "id", indexes: ["code"] },
    next_orientation_references: { keyPath: "id", indexes: ["code"] },
    
    // Next core tables
    care_phases: { keyPath: "id" },
    daily_care_actions: { keyPath: "id", indexes: ["treatmentId"] },
    daily_monitoring_tasks: { keyPath: "id", indexes: ["monitoringId"] },
    daily_care_records: { keyPath: "id", indexes: ["phaseId"] },
    messages: { keyPath: "id" },
    monitoring_parameters: { keyPath: "id" },
    on_going_treatments: { keyPath: "id", indexes: ["code"] },
    user_response_summaries: { keyPath: "id", indexes: ["messageId"] },
    patient_care_session_aggregates: { keyPath: "id", indexes: ["patientId"] },
    
    // Nutrition care tables
    formula_field_references: { keyPath: "id", indexes: ["code"] },
    appetite_test_refs: { keyPath: "id", indexes: ["code"] },
    complications: { keyPath: "id", indexes: ["code"] },
    medicines: { keyPath: "id", indexes: ["code"] },
    milks: { keyPath: "id", indexes: ["code"] },
    orientation_refs: { keyPath: "id", indexes: ["code"] },
    patient_current_states: { keyPath: "id" },
    daily_care_journals: { keyPath: "id" },
    patient_care_sessions: { keyPath: "id", indexes: ["patientId"] },
    
    // Other domain tables
    nutritional_diagnostics: { keyPath: "id", indexes: ["patientId"] },
    diagnostic_rules: { keyPath: "id", indexes: ["code"] },
    anthropometric_measures: { keyPath: "id", indexes: ["code"] },
    growth_reference_charts: { keyPath: "id", indexes: ["code"] },
    growth_reference_tables: { keyPath: "id", indexes: ["code"] },
    indicators: { keyPath: "id", indexes: ["code"] },
    clinical_sign_references: { keyPath: "id", indexes: ["code"] },
    nutritional_risk_factors: { keyPath: "id", indexes: ["clinicalSignCode"] },
    biochemical_references: { keyPath: "id", indexes: ["code"] },
    medical_records: { keyPath: "id", indexes: ["patientId"] },
    patients: { keyPath: "id" },
    units: { keyPath: "id", indexes: ["code", "tyype"] },
    reminders: { keyPath: "id" },
  },
};

export const createStoreIndexes = (db: IDBDatabase) => {
  Object.entries(DB_CONFIG.stores).forEach(([storeName, config]) => {
    if (!db.objectStoreNames.contains(storeName)) {
      const store = db.createObjectStore(storeName, {
        keyPath: config.keyPath,
      });
      if ("indexes" in config && config.indexes) {
        config.indexes.forEach(index => {
          const indexConfig =
            typeof index === "string" ? { name: index, unique: false } : index;
          store.createIndex(indexConfig.name, indexConfig.name, {
            unique: indexConfig.unique,
          });
        });
      }
    }
  });
};
