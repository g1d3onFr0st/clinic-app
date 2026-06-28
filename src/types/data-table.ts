import type { ColumnSort, Row, RowData } from "@tanstack/react-table"
import type { DataTableConfig } from "@/config/data-table"
import type { LucideIcon } from "lucide-react"
import type { FilterItemSchema } from "./zod"
import type {
  financeServerFn,
  getAllPatientsServerFn,
  getAllSurgeriesServerFn,
  getAllVisitsServerFn,
} from "#/lib/serverFns"
// import type { Dispatch, SetStateAction } from "react"

declare module "@tanstack/react-table" {
  // setFilters: Dispatch<SetStateAction<ExtendedColumnFilter<TData>[]>>
  // setColumnFilters: Dispatch<SetStateAction<ColumnFilter[]>>
  // joinOperator: JoinOperator
  // setJoinOperator: Dispatch<SetStateAction<JoinOperator>>
  interface TableMeta<TData extends RowData> {
    name: "p" | "s" | "v"
    // initFilters: ExtendedColumnFilter<TData>[]
  }

  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
    placeholder?: string
    variant?: FilterVariant
    options?: Option[]
    FilterOperations?: {
      label: string
      value: FilterOperator
    }[]
    // range?: [number, number]
    unit?: string
    icon?: LucideIcon
  }
}

export interface Option {
  label: string
  value: string
  count?: number
  icon?: LucideIcon
}

export type FilterOperator = DataTableConfig["operators"][number]
export type FilterVariant = DataTableConfig["filterVariants"][number]
export type JoinOperator = DataTableConfig["joinOperators"][number]

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: Extract<keyof TData, string>
}

export interface ExtendedColumnFilter<TData> extends FilterItemSchema {
  id: Extract<keyof TData, string>
}

export interface DataTableRowAction<TData> {
  row: Row<TData>
  variant: "update" | "delete"
}
export type AdvancedFilterState<TData> = {
  joinOperator: JoinOperator
  filters: ExtendedColumnFilter<TData>[]
}

export type UseColumnsOptionsType = {
  index: boolean
  select: boolean
  filter: boolean
}

export type AllPatientsType = {
  age: number | null
  status: "New" | "Follow-up" | "Active" | "Inactive"
  urgency: "none" | "soon"
  id: number
  name: string
  dateOfBirth: string | null
  phone: string | null
  gender: "male" | "female" | null
  lastVisitDate: string | null
  nextReturnDate: string | null
  visitCount: number
}
export type PatientSummary = Awaited<
  ReturnType<typeof getAllPatientsServerFn>
>[number]

export type SurgeriesSummary = Awaited<
  ReturnType<typeof getAllSurgeriesServerFn>
>[number]

export type VisitsSummary = Awaited<
  ReturnType<typeof getAllVisitsServerFn>
>[number]

export type Finance = Awaited<ReturnType<typeof financeServerFn>>
