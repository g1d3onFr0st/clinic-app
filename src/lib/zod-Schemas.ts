import { dataTableConfig } from "#/config/data-table"
import z from "zod"

export const AddPatientZodSchema = z.object({
  name: z.string("Name Is Required").min(1, "Name Is Required").trim(),
  dateOfBirth: z.string().trim().trim().nullable(),
  phone: z.string().trim().nullable(),
  address: z.string().trim().nullable(),
  gender: z.enum(["male", "female"], "Please Choose The Gender"),
  pastMedicalHistory: z.string().trim().nullable(),
  pastSurgicalHistory: z.string().trim().nullable(),
  FirstTimeLocation: z.enum(["clinic", "hospital"]),
  notes: z.string().trim().nullable(),
})
export const PatientInfoZodSchema = z.object({
  id: z.number(),
  ...AddPatientZodSchema.shape,
})

export const AddPatientVisitZodSchema = z.object({
  visitCause: z.string().trim().nullable(),
  investigations: z.string().trim().nullable(),
  treatment: z.string().trim().nullable(),
  returnDate: z.string().trim().nullable(),
  notes: z.string().trim().nullable(),
  fees: z.number("Please Enter A Number"),
})

export const PatientVisitZodSchema = z.object({
  visitId: z.number(),
  patientId: z.number(),
  visitDate: z.string().trim(),
  ...AddPatientVisitZodSchema.shape,
})

export const AddPatientSurgeryZodSchema = z.object({
  type: z.string().min(1, "Type Is Requires"),
  date: z.string().min(1, "Date Is Requires"),
  location: z.string().min(1, "Location Is Requires"),
  cause: z.string().nullable(),
  returnDate: z.string().nullable(),
  fees: z.number("Please Enter A Number"),
  notes: z.string().nullable(),
})
export const PatientSurgeryZodSchema = z.object({
  surgeryId: z.number(),
  patientId: z.number(),
  ...AddPatientSurgeryZodSchema.shape,
})

export const filterItemSchema = z.object({
  id: z.string(),
  value: z.union([z.string(), z.array(z.string())]),
  variant: z.enum(dataTableConfig.filterVariants),
  operator: z.enum(dataTableConfig.operators),
  filterId: z.string(),
})
