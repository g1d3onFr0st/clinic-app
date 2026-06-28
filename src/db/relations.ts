import { relations } from "drizzle-orm/relations"
import { patients, visits } from "./schema"

export const visitsRelations = relations(visits, ({ one }) => ({
  patient: one(patients, {
    fields: [visits.patientId],
    references: [patients.id],
  }),
}))

export const patientsRelations = relations(patients, ({ many }) => ({
  visits: many(visits),
}))
