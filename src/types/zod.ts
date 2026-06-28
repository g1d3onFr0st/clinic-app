import type {
  AddPatientZodSchema,
  PatientInfoZodSchema,
  PatientVisitZodSchema,
  AddPatientVisitZodSchema,
  filterItemSchema,
  AddPatientSurgeryZodSchema,
  PatientSurgeryZodSchema,
} from "#/lib/zod-Schemas"
import type z from "zod"

export type AddPatientTypeZI = z.infer<typeof AddPatientZodSchema>
export type PatientInfoTypeZI = z.infer<typeof PatientInfoZodSchema>
export type AddPatientVisitZI = z.infer<typeof AddPatientVisitZodSchema>
export type PatientVisitTypeZI = z.infer<typeof PatientVisitZodSchema>
export type AddPatientSurgeryZI = z.infer<typeof AddPatientSurgeryZodSchema>
export type PatientSurgeryZI = z.infer<typeof PatientSurgeryZodSchema>
export type FilterItemSchema = z.infer<typeof filterItemSchema>
