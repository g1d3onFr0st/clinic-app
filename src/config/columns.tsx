import { DataTableColumnHeader } from "#/components/data-table/data-table-column-header"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip"
import { getExtendedFilterOperators } from "#/lib/data-table"
import { calculateAge, formatDate, formatPhone } from "#/lib/format"
import { Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { Cross, Building2, Mars, Venus } from "lucide-react"

export const baseColumns: ColumnDef<any>[] = [
  {
    id: "name",
    accessorKey: "name",

    meta: {
      label: "Name",
      placeholder: "Search names...",
      variant: "text",
    },
    cell: ({ row }) => {
      const { patientId, name } = row.original

      return (
        <Link to="/patients/$id" params={{ id: String(patientId) }}>
          {name}
        </Link>
      )
    },
  },

  {
    id: "age",

    meta: {
      label: "Age",
      variant: "number",
    },

    accessorFn: ({ dateOfBirth }) =>
      dateOfBirth ? calculateAge(dateOfBirth) : Number.POSITIVE_INFINITY,
    cell: ({ row }) => {
      const { dateOfBirth } = row.original

      if (dateOfBirth === null)
        return (
          <div className="w-full justify-center items-center flex">-----</div>
        )

      const age = calculateAge(dateOfBirth)

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon-sm">
              {age}
            </Button>
          </TooltipTrigger>

          <TooltipContent>
            Date Of Birth : {formatDate(dateOfBirth)}
          </TooltipContent>
        </Tooltip>
      )
    },
  },

  {
    id: "gender",
    accessorKey: "gender",
    cell: ({ row }) => {
      const { gender } = row.original
      if (gender === "male")
        return (
          <Badge variant="secondary">
            <Mars />
            Male
          </Badge>
        )
      return (
        <Badge variant="secondary">
          <Venus />
          Female
        </Badge>
      )
    },
    meta: {
      label: "Gender",
      variant: "select",
      options: [
        { label: "Male", value: "Male", icon: Mars },
        { label: "Female", value: "Female", icon: Venus },
      ],
    },
  },
  {
    id: "phone",

    accessorKey: "phone",
    enableSorting: false,
    meta: {
      label: "Phone",
      placeholder: "Search phone...",
      variant: "number",

      FilterOperations: getExtendedFilterOperators("number", [
        "iLike",
        "notILike",
      ]),
    },

    cell: ({ row }) => {
      const { phone } = row.original

      if (phone === null) return <div>-----</div>

      return (
        <a
          target="_blank"
          href={`https://api.whatsapp.com/send/?phone=%2B964${phone}`}
        >
          {formatPhone(phone)}
        </a>
      )
    },
  },
  {
    id: "FirstTimeVisit",
    accessorKey: "FirstTimeLocation",
    header: ({ column }) => {
      return (
        <DataTableColumnHeader
          column={column}
          label="FTV"
          title="First Time Visit"
        />
      )
    },
    meta: {
      label: "First-Time Visit",
      options: [
        { label: "Clinic", value: "clinic", icon: Building2 },
        { label: "Hospital", value: "hospital", icon: Cross },
      ],
      variant: "select",
    },
    cell: ({ row }) => {
      const { FirstTimeLocation } = row.original
      if (FirstTimeLocation === "clinic")
        return (
          <Badge variant="secondary">
            <Building2 />
            Clinic
          </Badge>
        )
      return (
        <Badge variant="secondary">
          <Cross />
          Hospital
        </Badge>
      )
    },
  },
]
