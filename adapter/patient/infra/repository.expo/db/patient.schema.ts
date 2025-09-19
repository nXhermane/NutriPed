import { sqliteTable, text } from "drizzle-orm/sqlite-core";
export const patients = sqliteTable("patients", {
  id: text("patient_id").primaryKey(),
  createdAt: text("createdAt", { length: 50 }).notNull(),
  updatedAt: text("updatedAt", { length: 50 }).notNull(),
  name: text("patient_name", { length: 200 }).notNull(),
  gender: text("patient_sex", { enum: ["M", "F", "O"] }).notNull(),
  birthday: text("patient_birthday", { length: 50 }).notNull(),
  patents: text("patient_parents", { mode: "json" })
    .$type<{
      mother?: string;
      father?: string;
    }>()
    .default({}),
  contact: text("patient_contact", { mode: "json" })
    .$type<{
      email: string;
      tel: string;
    }>()
    .notNull(),
  address: text("patient_address", { mode: "json" })
    .$type<{
      street?: string;
      city?: string;
      postalCode?: string;
      country: string;
    }>()
    .notNull(),
  registrationDate: text("patient_registration_date", { length: 50 }).notNull(),
});
