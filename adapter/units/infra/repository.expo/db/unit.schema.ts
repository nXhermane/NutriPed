import { UnitType } from "@core/constants";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const units = sqliteTable("units", {
  id: text("unit_id").primaryKey(),
  createdAt: text("createdAt", { length: 50 }).notNull(),
  updatedAt: text("updatedAt", { length: 50 }).notNull(),
  name: text("unit_name", { length: 200 }).notNull(),
  code: text("unit_code", { length: 10 }).notNull(),
  conversionFactor: integer("unit_conversion_factor").notNull(),
  baseUnitCode: text("unit_base_unit", { length: 10 }).notNull(),
  type: text("unit_type", {
    enum: [
      "LENGTH",
      "WEIGHT",
      "CONCENTRATION",
      "ENZYME",
      "TIME",
      "VOLUME",
      "TEMPERATURE",
      "FREQUENCY",
      "PERCENTAGE",
      "PRESSURE",
      "SURFACE",
      "FLUID_RATE",
      "FLOW_RATE",
      "SCORE",
      "PERCENTILE",
    ],
  }).notNull(),
  
});
