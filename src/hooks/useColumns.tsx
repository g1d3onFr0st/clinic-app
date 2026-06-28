import { DataTableColumnHeader } from "#/components/data-table/data-table-column-header"
import { Checkbox } from "#/components/ui/checkbox"
import type { UseColumnsOptionsType } from "#/types/data-table"
import type { ColumnDef, FilterFnOption } from "@tanstack/react-table"
import { useMemo } from "react"

export function useColumns<TData>(
  mainColumns: ColumnDef<TData>[],
  options: UseColumnsOptionsType,
) {
  const { filter, index, select } = options
  const columns = useMemo<ColumnDef<TData>[]>(
    () => [
      ...(index
        ? ([
            {
              id: "index",
              accessorFn: (_row, i) => i + 1,
              header: ({ column }) => (
                <DataTableColumnHeader column={column} label="#" />
              ),
              enableSorting: false,
              enableColumnFilter: false,
              size: 60,
            },
          ] as ColumnDef<TData>[])
        : []),
      ...(select
        ? ([
            {
              id: "select",
              header: ({ table }) => (
                <Checkbox
                  checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                  }
                  onCheckedChange={(value) =>
                    table.toggleAllRowsSelected(!!value)
                  }
                />
              ),

              cell: ({ row }) => (
                <Checkbox
                  checked={row.getIsSelected()}
                  onCheckedChange={(value) => row.toggleSelected(!!value)}
                />
              ),

              enableSorting: false,
              enableColumnFilter: false,
              size: 40,
            },
          ] as ColumnDef<TData>[])
        : []),
      ...mainColumns,

      ...(filter
        ? ([
            {
              id: "filter",
              accessorFn: (row) => row,
              filterFn: "advanced" as FilterFnOption<TData>,
              enableColumnFilter: false,
              enableSorting: false,
              enableHiding: false,
              header: () => null,
              cell: () => null,
              size: 0,
            },
          ] as ColumnDef<TData>[])
        : []),
    ],
    [],
  )
  return columns
}
