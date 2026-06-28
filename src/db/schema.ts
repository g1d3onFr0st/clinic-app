import {
  pgTable,
  serial,
  text,
  date,
  index,
  foreignKey,
  integer,
  pgEnum,
} from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const genderType = pgEnum("gender_type", ["male", "female"])
export const themeType = pgEnum("theme_type", ["light", "dark"])
export const loactionType = pgEnum("location_type", ["hospital", "clinic"])

export const config = pgTable("config", {
  id: serial().primaryKey().notNull(),
  theme: themeType().notNull(),
  password: text().notNull(),
})

export const patients = pgTable("patients", {
  id: serial().primaryKey().notNull(),
  name: text().notNull(),
  dateOfBirth: date("date_of_birth"),
  phone: text(),
  address: text(),
  gender: genderType().notNull(),
  FirstTimeLocation: loactionType().notNull(),
  pastMedicalHistory: text("past_medical_history"),
  pastSurgicalHistory: text("past_surgical_history"),
  notes: text(),
})

export const visits = pgTable(
  "visits",
  {
    visitId: serial("visit_id").primaryKey().notNull(),
    patientId: integer("patient_id").notNull(),
    visitDate: date("visit_date")
      .default(sql`CURRENT_DATE`)
      .notNull(),
    returnDate: date("return_date"),
    visitCause: text("visit_cause"),
    investigations: text(),
    treatment: text(),
    notes: text(),
    fees: integer().notNull(),
  },
  (table) => [
    index("idx_visits_patient_id").using(
      "btree",
      table.patientId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patients.id],
      name: "visits_patient_id_fkey",
    }).onDelete("cascade"),
  ],
)

export const surgeries = pgTable(
  "surgeries",
  {
    surgeryId: serial("surgery_id").primaryKey().notNull(),
    patientId: integer("patient_id").notNull(),
    type: text().notNull(),
    date: date().notNull(),
    location: text().notNull(),

    cause: text(),
    returnDate: date("return_date"),
    fees: integer().notNull(),
    notes: text(),
  },
  (table) => [
    index("idx_surgery_id").using(
      "btree",
      table.surgeryId.asc().nullsLast().op("int4_ops"),
    ),
    foreignKey({
      columns: [table.patientId],
      foreignColumns: [patients.id],
      name: "surgeries_patient_id_fkey",
    }).onDelete("cascade"),
  ],
)
