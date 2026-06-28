import { Refresh } from "#/components/custom/Refresh"
import { ErrorComp, LoadingComp } from "#/components/custom/status"
import { DataTable } from "#/components/data-table/data-table"
import { DataTableAdvancedToolbar } from "#/components/data-table/data-table-advanced-toolbar"
import { DataTableColumnHeader } from "#/components/data-table/data-table-column-header"
import { DataTableSortList } from "#/components/data-table/data-table-sort-list"
import { Card, CardContent } from "#/components/ui/card"
import { Input } from "#/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select"
import { Switch } from "#/components/ui/switch"
import { useColumns } from "#/hooks/useColumns"
import { getFilterOperatorsExcept } from "#/lib/data-table"
import { newDate } from "#/lib/format"
import { financeServerFn } from "#/lib/serverFns"
import { camelCaseToStringConverter } from "#/lib/utils"
import type { FilterOperator, Finance } from "#/types/data-table"
import { useQuery, type InvalidateQueryFilters } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
  type Table,
  type VisibilityState,
} from "@tanstack/react-table"
import { endOfDay, isSameDay } from "date-fns"
import { useMemo, useState } from "react"

export const Route = createFileRoute("/finance")({
  component: RouteComponent,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData({
      queryKey: ["finance"],
      queryFn: financeServerFn,
    }),
})

function RouteComponent() {
  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ["finance"],
    queryFn: financeServerFn,
  })
  if (isLoading || isPending)
    return <LoadingComp title="Loading Surgeries ..." />
  if (isError)
    return (
      <ErrorComp
        title="Error While Loading the Surgeries"
        errorMessage={error.message}
      />
    )
  const now = newDate()

  const firstDayOfMonth = endOfDay(
    new Date(now.getFullYear(), now.getMonth(), 1),
  )

  const lastDayOfMonth = endOfDay(
    new Date(now.getFullYear(), now.getMonth() + 1, 0),
  )
  const [filterOperation, setFilterOperation] =
    useState<FilterOperator>("isBetween")
  const [singleDate, setSingleDate] = useState(now.toISOString().split("T")[0])
  const [dateRange, setDateRange] = useState<[string, string]>([
    firstDayOfMonth.toISOString().split("T")[0],
    lastDayOfMonth.toISOString().split("T")[0],
  ])
  const filteredRecords = useMemo(() => {
    return data.records.filter((rec) => {
      const filterDate = newDate(rec.date)

      switch (filterOperation) {
        case "eq": {
          const date = newDate(singleDate)

          return isSameDay(filterDate, date)
        }

        case "ne": {
          const date = newDate(singleDate)

          return !isSameDay(filterDate, date)
        }

        case "gt": {
          const date = newDate(singleDate)

          return filterDate > date
        }

        case "gte": {
          const date = newDate(singleDate)

          return filterDate >= date
        }

        case "lt": {
          const date = newDate(singleDate)

          return filterDate < date
        }

        case "lte": {
          const date = newDate(singleDate)

          return filterDate <= date
        }

        case "isBetween": {
          const min = newDate(dateRange[0])
          const max = newDate(dateRange[1])

          return filterDate >= min && filterDate <= max
        }

        case "isNotBetween": {
          const min = newDate(dateRange[0])
          const max = newDate(dateRange[1])

          return filterDate < min || filterDate > max
        }

        default:
          return true
      }
    })
  }, [data.records, dateRange, singleDate, filterOperation])
  const records = useMemo(() => {
    const visits = filteredRecords
      .filter((d) => d.type === "Visit")
      .reduce((sum, r) => sum + (r.fee ?? 0), 0)
    const visitsLength = filteredRecords.filter(
      (rec) => rec.type === "Visit",
    ).length
    const surguries = filteredRecords
      .filter((d) => d.type === "Surgery")
      .reduce((sum, r) => sum + (r.fee ?? 0), 0)
    const surgeriesLength = filteredRecords.filter(
      (rec) => rec.type === "Surgery",
    ).length
    return [
      {
        type: "Visits" as "Surguries" | "Visits" | "Total",
        fees: visits,
        length: visitsLength,
      },
      {
        type: "Surguries" as "Surguries" | "Visits" | "Total",
        fees: surguries,
        length: surgeriesLength,
      },
      {
        type: "Total" as "Surguries" | "Visits" | "Total",
        fees: surguries + visits,
        length: surgeriesLength + visitsLength,
      },
    ]
  }, [filteredRecords])
  const dashBoardColumns = useColumns<Finance["dashboard"][number]>(
    [
      {
        accessorKey: "type",
        id: "type",
      },
      {
        id: "count",
        accessorFn: ({ type }) => {
          const num =
            type === "Visit"
              ? data.records.filter((rec) => rec.type === "Visit").length
              : type === "Surgeries"
                ? data.records.filter((rec) => rec.type === "Surgery").length
                : data.records.length
          return num
        },
        cell: ({ row }) => {
          const { type } = row.original
          const num =
            type === "Visit"
              ? data.records.filter((rec) => rec.type === "Visit").length
              : type === "Surgeries"
                ? data.records.filter((rec) => rec.type === "Surgery").length
                : data.records.length
          return <div>{Number(num).toLocaleString("en-US")}</div>
        },
      },
      {
        accessorKey: "todayFees",
        id: "feesPerDay",
      },
      {
        accessorKey: "weekFees",
        id: "feesPerWeek",
      },
      {
        accessorKey: "monthFees",
        id: "feesPerMonth",
      },
      {
        accessorKey: "yearFees",
        id: "feesPerYear",
      },
      {
        accessorKey: "totalFees",
        id: "totalFees",
      },
    ],
    { filter: false, index: true, select: false },
  )

  const recordsColumns = useColumns<{
    type: "Surguries" | "Visits" | "Total"
    fees: number
    length: number
  }>(
    [
      {
        accessorKey: "type",
        cell: ({ row }) => {
          const { type } = row.original
          return (
            <Link to={type === "Surguries" ? "/surgeries" : "/visits"}>
              {type}
            </Link>
          )
        },
      },
      {
        id: "count",
        accessorKey: "length",
        cell: ({ row }) => {
          return (
            <div>{Number(row.original.length).toLocaleString("en-US")}</div>
          )
        },
      },
      {
        accessorKey: "fees",
        cell: ({ row }) => {
          return (
            <div>{Number(row.original.fees).toLocaleString("en-US")} IQD</div>
          )
        },
      },
    ],
    {
      filter: false,
      index: true,
      select: false,
    },
  )

  const [mode, setMode] = useState<"dashboard" | "records">("dashboard")

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const dashboardTable = useReactTable({
    data: data.dashboard,
    columns: dashBoardColumns,
    enableSorting: true,
    enableRowSelection: false,
    enableHiding: true,
    state: {
      sorting,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: {
      cell: ({ getValue, column }) => {
        const rowData = getValue<string | null | number>()
        if (rowData === null) return <div>-----</div>
        if (typeof rowData === "number" && column.id !== "index")
          return <div>{Number(rowData).toLocaleString("en-US")} IQD</div>
        return <div>{String(rowData)}</div>
      },
      enableSorting: true,
      enableHiding: true,
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

  const recordsTable = useReactTable({
    data: records,
    columns: recordsColumns,
    enableSorting: true,
    enableHiding: true,
    enableRowSelection: false,
    state: {
      sorting,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    defaultColumn: {
      cell: ({ getValue }) => {
        const rowData = getValue<string | null>()
        if (rowData === null) return <div>-----</div>
        return <div>{String(rowData)}</div>
      },
      enableSorting: true,
      enableHiding: true,
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
  const table = mode === "dashboard" ? dashboardTable : recordsTable
  return (
    <section className="flex min-h-screen w-screen items-center justify-center">
      <Card className="flex justify-center items-center">
        <CardContent className="max-w-350">
          <DataTable
            table={table as Table<any>}
            //  ActionBar={<DataTableActionBar table={table}/>}
          >
            <DataTableAdvancedToolbar table={table as Table<any>}>
              <DataTableSortList table={table as Table<any>} />
              <Refresh queryKeys={["finance"] as InvalidateQueryFilters} />
              <div className="flex gap-10 justify-center items-center *:px-2 *:border-slate-500 *:border-x-4 ">
                <div className="flex gap-5 items-center justify-center">
                  Dashboard
                  <Switch
                    checked={mode === "records"}
                    onCheckedChange={() =>
                      setMode(mode === "dashboard" ? "records" : "dashboard")
                    }
                  />
                  Records
                </div>
                {mode == "records" && (
                  <div className="flex gap-2 items-center justify-center">
                    Date
                    <Select
                      value={filterOperation}
                      onValueChange={(value: FilterOperator) =>
                        setFilterOperation(value)
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        className="w-32 rounded lowercase"
                      >
                        <div className="truncate">
                          <SelectValue placeholder={filterOperation} />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {getFilterOperatorsExcept("date", [
                          "isEmpty",
                          "isNotEmpty",
                        ]).map((operator) => (
                          <SelectItem
                            key={operator.value}
                            value={operator.value}
                            className="lowercase"
                          >
                            {operator.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {filterOperation === "isBetween" ||
                    filterOperation === "isNotBetween" ? (
                      <div>
                        <Input
                          type="date"
                          value={dateRange[0]}
                          onChange={(e) =>
                            setDateRange([e.currentTarget.value, dateRange[1]])
                          }
                        />
                        And
                        <Input
                          type="date"
                          value={dateRange[1]}
                          onChange={(e) =>
                            setDateRange([dateRange[0], e.currentTarget.value])
                          }
                        />
                      </div>
                    ) : (
                      <Input
                        type="date"
                        value={singleDate}
                        onChange={(e) =>
                          setSingleDate(
                            new Date(e.currentTarget.value)
                              .toISOString()
                              .split("T")[0],
                          )
                        }
                      />
                    )}
                  </div>
                )}
              </div>
            </DataTableAdvancedToolbar>
          </DataTable>
        </CardContent>
      </Card>
    </section>
  )

  return (
    <section className="flex min-h-screen w-screen items-center justify-center">
      <Card className="flex justify-center items-center">
        <CardContent className="max-w-350">
          <DataTable
            table={recordsTable}
            //  ActionBar={<DataTableActionBar table={table}/>}
          >
            <DataTableAdvancedToolbar table={recordsTable}>
              <DataTableSortList table={recordsTable} />
              <Refresh queryKeys={["finance"] as InvalidateQueryFilters} />
              {/* <div className="flex gap-10 justify-center items-center *:px-2 *:border-slate-500 *:border-x-4 ">
                <div className="flex gap-5 items-center justify-center">
                  Dashboard
                  <Switch
                    checked={true}
                    onCheckedChange={() => setMode("dashboard")}
                  />
                  Records
                </div>
                <div className="flex gap-2 items-center justify-center">
                  Date
                  <Select
                    value={filterOperation}
                    onValueChange={(value: FilterOperator) =>
                      setFilterOperation(value)
                    }
                  >
                    <SelectTrigger size="sm" className="w-32 rounded lowercase">
                      <div className="truncate">
                        <SelectValue placeholder={filterOperation} />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {getFilterOperatorsExcept("date", [
                        "isEmpty",
                        "isNotEmpty",
                      ]).map((operator) => (
                        <SelectItem
                          key={operator.value}
                          value={operator.value}
                          className="lowercase"
                        >
                          {operator.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {filterOperation === "isBetween" ||
                  filterOperation === "isNotBetween" ? (
                    <div>
                      <Input
                        type="date"
                        value={dateRange[0]}
                        onChange={(e) =>
                          setDateRange([e.currentTarget.value, dateRange[1]])
                        }
                      />
                      And
                      <Input
                        type="date"
                        value={dateRange[1]}
                        onChange={(e) =>
                          setDateRange([dateRange[0], e.currentTarget.value])
                        }
                      />
                    </div>
                  ) : (
                    <Input
                      type="date"
                      value={singleDate}
                      onChange={(e) =>
                        setSingleDate(
                          new Date(e.currentTarget.value)
                            .toISOString()
                            .split("T")[0],
                        )
                      }
                    />
                  )}
                </div>
              </div> */}
            </DataTableAdvancedToolbar>
          </DataTable>
        </CardContent>
      </Card>
    </section>
  )
}
