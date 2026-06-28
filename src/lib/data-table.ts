/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { Column, FilterFn } from "@tanstack/react-table"
import {
  dataTableConfig,
  operatorMap,
  uniqueOperators,
  type OperatorMap,
} from "#/config/data-table.ts"
import type {
  AdvancedFilterState,
  ExtendedColumnFilter,
  FilterOperator,
  FilterVariant,
} from "#/types/data-table.ts"
import { isSameDay } from "date-fns"
import { rankItem } from "@tanstack/match-sorter-utils"
import { newDate } from "./format"

export function getColumnPinningStyle<TData>({
  column,
  withBorder = false,
}: {
  column: Column<TData>
  withBorder?: boolean
}): React.CSSProperties {
  const isPinned = column.getIsPinned()
  const isLastLeftPinnedColumn =
    isPinned === "left" && column.getIsLastColumn("left")
  const isFirstRightPinnedColumn =
    isPinned === "right" && column.getIsFirstColumn("right")

  return {
    boxShadow: withBorder
      ? isLastLeftPinnedColumn
        ? "-4px 0 4px -4px var(--border) inset"
        : isFirstRightPinnedColumn
          ? "4px 0 4px -4px var(--border) inset"
          : undefined
      : undefined,
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    opacity: isPinned ? 0.97 : 1,
    position: isPinned ? "sticky" : "relative",
    background: isPinned ? "var(--background)" : "var(--background)",
    width: column.getSize(),
    zIndex: isPinned ? 1 : undefined,
  }
}

export function getFilterOperators(filterVariant: FilterVariant) {
  const operatorMap: Record<
    FilterVariant,
    { label: string; value: FilterOperator }[]
  > = {
    text: dataTableConfig.textOperators,
    number: dataTableConfig.numericOperators,
    range: dataTableConfig.numericOperators,
    date: dataTableConfig.dateOperators,
    dateRange: dataTableConfig.dateOperators,
    boolean: dataTableConfig.booleanOperators,
    select: dataTableConfig.selectOperators,
    multiSelect: dataTableConfig.multiSelectOperators,
  }

  return operatorMap[filterVariant] ?? dataTableConfig.textOperators
}

export function getDefaultFilterOperator(filterVariant: FilterVariant) {
  const operators = getFilterOperators(filterVariant)

  return operators[0]?.value ?? (filterVariant === "text" ? "iLike" : "eq")
}

export function getValidFilters<TData>(
  filters: ExtendedColumnFilter<TData>[],
): ExtendedColumnFilter<TData>[] {
  return filters.filter(
    (filter) =>
      filter.operator === "isEmpty" ||
      filter.operator === "isNotEmpty" ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== "" &&
          filter.value !== null &&
          filter.value !== undefined),
  )
}

export function areFiltersValid<TData>(filters: ExtendedColumnFilter<TData>[]) {
  const errors: string[] = []
  filters.forEach((filter) => {
    const isValid =
      filter.operator === "isEmpty" ||
      filter.operator === "isNotEmpty" ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== "" &&
          filter.value !== null &&
          filter.value !== undefined)
    if (!isValid) errors.push(filter.id)
  })
  if (errors.length > 0) return { errors }
  else return { validFilters: getValidFilters(filters) }
}

// export function filtersConvertion<TData>(
//   filters: ExtendedColumnFilter<TData>[],
// ): ColumnFilter[] {
//   return filters.map((filter) => {
//     return {
//       id: filter.id,
//       // variant: filter.variant,
//       // operator: filter.operator,
//       value: {
//         value: filter.value,
//         operator: filter.operator,
//         variant: filter.variant,
//       },
//     }
//   })
// }

// export const advancedFilters: FilterFn<any> = (
//   row,
//   columnId,
//   filterValue: {
//     id: string
//     value: {
//       value: string | string[]
//       operator: FilterOperator
//       variant: FilterVariant
//     }
//   },
// ) => {
//   const {
//     value: { operator, value, variant },
//   } = filterValue
//   const data = row.getValue(columnId)
//   if (variant === "text") {
//     switch (operator) {
//       case "eq":
//         return data === value
//     }
//   }

//   if (variant === "number") {
//     switch (operator) {
//       case "eq":
//         return data === value
//     }
//   }

//   return true
// }

// export const advancedFilters: FilterFn<any> = (
//   row,
//   columnId,
//   filterValue: {
//     operator: FilterOperator
//     value: any
//     variant: FilterVariant
//   },
// ) => {
//   const { operator, value, variant } = filterValue

//   const rawData = row.getValue(columnId)

//   switch (variant) {
//     case "text": {
//       const data = String(rawData).trim().toLocaleLowerCase()
//       const str = String(value).trim().toLocaleLowerCase()
//       switch (operator) {
//         case "eq":
//           return data === str

//         case "iLike":
//           return data.toLowerCase().includes(str.toLowerCase())

//         case "isEmpty":
//           return rawData === null

//         case "isNotEmpty":
//           return rawData !== null
//         default:
//           return false
//       }
//     }

//     case "number": {
//       const data = Number(rawData)
//       const num = Number(value)
//       const firstNum = Number(value[0])
//       const secondNum = Number(value[1])
//       switch (operator) {
//         case "eq":
//           return data === num

//         case "ne":
//           return data !== num

//         case "gt":
//           return data > num

//         case "gte":
//           return data >= num

//         case "lt":
//           return data < num

//         case "lte":
//           return data <= num

//         case "isBetween":
//           return data >= firstNum && data <= secondNum

//         case "isEmpty":
//           return data === null

//         case "isNotEmpty":
//           return data !== null

//         default:
//           return false
//       }
//     }

//     default:
//       return false
//   }
// }

// export function useColumnsWithFilterFn<TData>(columns: ColumnDef<TData>[]) {
//   return useMemo(() => {
//     return columns.map((column) => ({
//       ...column,
//       filterFn: column.filterFn ?? ("advanced" as FilterFnOption<TData>),
//     }))
//   }, [columns])
// }

// export function manuallyFilteredData<TData>(
//   data: TData[],
//   filters: ExtendedColumnFilter<TData>[],
// ) {
//   const manuallyFilteredData = useMemo(() => {
//     return data.filter((row) => {
//       return filters.some((filter) => evaluateFilter(row, filter))
//     })
//   }, [data, filters])
// }

export function evaluateFilter<TData extends Record<string, any>>(
  row: TData,
  filter: ExtendedColumnFilter<TData>,
) {
  const { id, operator, value, variant } = filter

  const rawData = row[id]

  switch (variant) {
    case "text": {
      const data = String(rawData).trim().toLowerCase()
      const str = String(value).trim().toLowerCase()

      switch (operator) {
        case "eq":
          return data === str
        case "ne":
          return data !== str

        case "iLike":
          return rankItem(data, str).passed
        case "notILike":
          return !rankItem(data, str).passed

        case "isEmpty":
          return rawData === null || rawData === undefined || rawData === ""
        case "isNotEmpty":
          return !(rawData === null || rawData === undefined || rawData === "")
      }
      break
    }

    case "number": {
      const data = Number(rawData)
      const num = Number(value)

      switch (operator) {
        case "eq":
          return data === num
        case "ne":
          return data !== num

        case "gt":
          return data > num
        case "lt":
          return data < num

        case "gte":
          return data >= num
        case "lte":
          return data <= num

        case "isBetween": {
          const min = Number(rawData[0])
          const max = Number(rawData[1])
          return num >= min && num <= max
        }
        case "isNotBetween": {
          const min = Number(rawData[0])
          const max = Number(rawData[1])
          return num <= min || num >= max
        }
        case "isEmpty":
          return rawData === null
        case "isNotEmpty":
          return rawData !== null
        case "iLike":
          return rankItem(String(rawData), String(num)).passed
        case "notILike":
          return !rankItem(String(rawData), String(num)).passed
      }
      break
    }

    case "date": {
      const data = newDate(rawData)
      const date = newDate(Number(value))
      // const now = new Date().getTime()
      switch (operator) {
        case "eq":
          return isSameDay(data, date)
        case "ne":
          return !isSameDay(data, date)

        case "gt":
          return data > date

        case "gte":
          return data >= date

        case "lt":
          return data < date
        case "lte":
          return data <= date
        case "isBetween": {
          const min = newDate(Number(value[0]))
          const max = newDate(Number(value[1]))
          return data >= min && data <= max
        }

        case "isNotBetween": {
          const min = newDate(Number(value[0]))
          const max = newDate(Number(value[1]))
          return data <= min || data >= max
        }
        case "isEmpty":
          return rawData === null
        case "isNotEmpty":
          return rawData !== null
      }
      break
    }

    case "multiSelect": {
      const data = String(rawData)
      const items = [...value]
      switch (operator) {
        case "inArray":
          return items.includes(data)
        case "notInArray":
          return !items.includes(data)
        case "isEmpty":
          return rawData === null
        case "isNotEmpty":
          return rawData !== null
      }
      break
    }
    case "select": {
      const data = String(rawData).trim().toLowerCase()
      const str = String(value).trim().toLowerCase()

      switch (operator) {
        case "eq":
          return data === str
        case "ne":
          return data !== str
        case "isEmpty":
          return rawData === null || rawData === undefined || rawData === ""
        case "isNotEmpty":
          return !(rawData === null || rawData === undefined || rawData === "")
      }
      break
    }
  }
}
export const advancedFilters: FilterFn<any> = (
  row,
  _columnId,
  filterValue: AdvancedFilterState<any>,
) => {
  const { joinOperator, filters } = filterValue

  if (joinOperator === "and") {
    return filters.every((filter) => evaluateFilter(row.original, filter))
  }

  return filters.some((filter) => evaluateFilter(row.original, filter))
}

export function getFilterOperatorsExcept<
  // eslint-disable-next-line @typescript-eslint/naming-convention
  OP extends keyof OperatorMap,
>(filterVariant: OP, excludedOperators: OperatorMap[OP][number]["value"][]) {
  const operators = operatorMap[filterVariant]

  return operators.filter(
    (operator) => !excludedOperators.includes(operator.value),
  )
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function getExtendedFilterOperators<OP extends keyof OperatorMap>(
  filterVariant: OP,
  extraOperators: FilterOperator[],
) {
  const baseOperators = operatorMap[filterVariant]

  const additionalOperators = uniqueOperators.filter((operator) =>
    extraOperators.includes(operator.value),
  )

  return Array.from(
    new Map(
      [...baseOperators, ...additionalOperators].map((operator) => [
        operator.value,
        operator,
      ]),
    ).values(),
  )
}
