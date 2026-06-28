import { DataTable } from "#/components/data-table/data-table"
import { DataTableAdvancedToolbar } from "#/components/data-table/data-table-advanced-toolbar"
import { DataTableColumnHeader } from "#/components/data-table/data-table-column-header"
import { DataTableSortList } from "#/components/data-table/data-table-sort-list"
import { DataTableFilterList } from "#/components/data-table/data-table-filter-list"
import { camelCaseToStringConverter } from "#/lib/utils"
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type Table,
  type InitialTableState,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from "@tanstack/react-table"
import { useState, type ReactNode } from "react"
import { advancedFilters } from "#/lib/data-table"
import { Card, CardContent } from "../ui/card"
import { type InvalidateQueryFilters } from "@tanstack/react-query"
import { Refresh } from "../custom/Refresh"

export function CustomDataTable<TData>({
  data,
  columns,
  toolbar,
  initialState,
  queryKeys,
  name,
}: {
  data: TData[]
  columns: ColumnDef<TData>[]
  toolbar?: (table: Table<TData>) => ReactNode
  initialState?: InitialTableState
  queryKeys: InvalidateQueryFilters<readonly unknown[]>
  name: "p" | "s" | "v"
}) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialState?.columnVisibility || {},
  )
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [sorting, setSorting] = useState<SortingState>(
    initialState?.sorting || [],
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialState?.columnFilters || [],
  )
  const enableRowSelection = columns.some((col) => col.id === "select")
  const table = useReactTable({
    data,
    columns,
    enableColumnResizing: true,
    enableSorting: true,
    enableFilters: true,
    enableColumnFilters: true,
    enableHiding: true,
    enableRowSelection,
    state: {
      pagination,
      sorting,
      columnVisibility,
      columnFilters,
    },
    columnResizeMode: "onChange",
    onPaginationChange: setPagination,
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
    filterFns: {
      advanced: advancedFilters,
    },
    meta: {
      name,
    },
    defaultColumn: {
      cell: ({ getValue }) => {
        const rowData = getValue<string | null>()
        if (rowData === null) return <div>-----</div>
        return <div>{String(rowData)}</div>
      },
      enableColumnFilter: true,
      enableSorting: true,
      enableHiding: true,
      enableResizing: true,
      header({ column }) {
        return (
          <DataTableColumnHeader
            column={column}
            label={
              column.columnDef.meta?.label ||
              camelCaseToStringConverter(column.id)
            }
          />
        )
      },
    },
  })

  return (
    <section className="flex min-h-screen w-screen items-center justify-center">
      <Card className="flex justify-center items-center">
        <CardContent className="max-w-350">
          <DataTable
            table={table}
            //  ActionBar={<DataTableActionBar table={table}/>}
          >
            <DataTableAdvancedToolbar table={table}>
              <DataTableSortList table={table} />
              <DataTableFilterList table={table} />
              <Refresh queryKeys={queryKeys} />
              {toolbar?.(table)}
            </DataTableAdvancedToolbar>
          </DataTable>
        </CardContent>
      </Card>
    </section>
  )
}
