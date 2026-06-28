/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { flexRender, type Table as TanstackTable } from "@tanstack/react-table"
import type * as React from "react"

import { DataTablePagination } from "#/components/data-table/data-table-pagination.tsx"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table.tsx"
import { getColumnPinningStyle } from "@/lib/data-table"

interface DataTableProps<TData> {
  table: TanstackTable<TData>
  ActionBar?: React.ReactNode
  children?: React.ReactNode
}

export function DataTable<TData>({
  table,
  ActionBar,
  children,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows
  return (
    <div className="flex w-full flex-col gap-2.5 overflow-auto">
      {children}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      ...getColumnPinningStyle({ column: header.column }),
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows?.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getColumnPinningStyle({ column: cell.column }),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-2.5">
        <DataTablePagination table={table} />
        {ActionBar &&
          table.getFilteredSelectedRowModel().rows.length > 0 &&
          ActionBar}
      </div>
    </div>
  )
}
