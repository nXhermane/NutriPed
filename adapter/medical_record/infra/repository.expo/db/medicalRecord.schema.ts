import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  AnthropometricDataPersistenceDto,
  BiologicalDataPersistenceDto,
  ClinicalDataPersistenceDto,
  ComplicationDataPersistenceDto,
  DataFieldResponsePersistenceDto,
} from "../../dtos";

export const medical_records = sqliteTable("medical_records", {
  id: text("medical_record_id").primaryKey(),
  createdAt: text("created_at", { length: 50 }).notNull(),
  updatedAt: text("updated_at", { length: 50 }).notNull(),
  patientId: text("patient_id", { length: 50 }).notNull(),
  anthropometricData: text("anthropometric_data", { mode: "json" })
    .$type<AnthropometricDataPersistenceDto[]>()
    .notNull(),
  biologicalData: text("biological_data", { mode: "json" })
    .$type<BiologicalDataPersistenceDto[]>()
    .notNull(),
  clinicalData: text("clinical_data", { mode: "json" })
    .$type<ClinicalDataPersistenceDto[]>()
    .notNull(),
  complications: text("complications", { mode: "json" })
    .$type<ComplicationDataPersistenceDto[]>()
    .notNull(),
  dataFieldsResponse: text("data_fields_response", { mode: "json" })
    .$type<DataFieldResponsePersistenceDto[]>()
    .notNull(),
});
