import { useState } from "react"
import {
  ActionBar,
  ActionBarSelection,
  ActionBarSeparator,
  ActionBarClose,
  ActionBarGroup,
  ActionBarItem,
} from "../ui/action-bar"
import type { Table } from "@tanstack/react-table"

type DataTableActionBarProps<TData> = {
  table: Table<TData>
}

export function DataTableActionBar<TData>({
  table,
}: DataTableActionBarProps<TData>) {
  // const [open, onOpenChange] = useState(true)
  return (
    <ActionBar open={true}>
      <ActionBarSelection>
        {table.getSelectedRowModel().rows.length} selected
        {/* <ActionBarSeparator /> */}
        {/* <ActionBarClose>close </ActionBarClose> */}
      </ActionBarSelection>
      <ActionBarSeparator />
      <ActionBarGroup>
        <ActionBarItem>Duplicate</ActionBarItem>
        <ActionBarItem variant="destructive">Delete</ActionBarItem>
      </ActionBarGroup>
    </ActionBar>
  )
}
