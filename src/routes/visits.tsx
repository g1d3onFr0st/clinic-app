import { ErrorComp, LoadingComp } from "#/components/custom/status"
import { CustomDataTable } from "#/components/dt/CustomDataTable"
import { Badge } from "#/components/ui/badge"
import { Button } from "#/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip"
import { baseColumns } from "#/config/columns"
import { useColumns } from "#/hooks/useColumns"
import { formatDate, newDate } from "#/lib/format"
import { getAllVisitsServerFn } from "#/lib/serverFns"
import { cn } from "#/lib/utils"
import type { VisitsSummary } from "#/types/data-table"
import { useQuery, type InvalidateQueryFilters } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { differenceInDays } from "date-fns"
import { AlertCircle, BookCheck, CheckCircle, Clock } from "lucide-react"
import { useMemo, type ReactNode } from "react"

export const Route = createFileRoute("/visits")({
  component: RouteComponent,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData({
      queryKey: ["allVisits"],
      queryFn: getAllVisitsServerFn,
    }),
})

function RouteComponent() {
  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ["allVisits"],
    queryFn: getAllVisitsServerFn,
  })

  const columns = useColumns<VisitsSummary>(
    [
      ...(baseColumns as ColumnDef<VisitsSummary>[]),

      {
        id: "visitDate",
        accessorFn: ({ visitDate }) => {
          return visitDate ? newDate(visitDate) : Number.POSITIVE_INFINITY
        },

        meta: {
          label: "Visit Date",
          variant: "date",
        },
        cell: ({ row }) => {
          const { visitDate, visitId, patientId } = row.original
          const diff = differenceInDays(newDate(), newDate(visitDate))
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="default">
                  <Link
                    to="/patients/$id/visits/$visitId"
                    params={{ id: String(patientId), visitId: String(visitId) }}
                  >
                    {formatDate(visitDate)}
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                {diff === 0 ? (
                  <span>Today</span>
                ) : (
                  <span>{diff} Day(s) Ago</span>
                )}
              </TooltipContent>
            </Tooltip>
          )
        },
      },
      {
        id: "returnDate",

        accessorFn: ({ returnDate }) => {
          if (!returnDate) {
            return Number.POSITIVE_INFINITY
          }

          return newDate(returnDate).getTime()
        },
        meta: {
          label: "Return Date",
          variant: "date",
        },

        cell: ({ row }) => {
          const { returnDate } = row.original
          if (returnDate === null)
            return (
              <div className="w-full justify-center items-center flex">
                -----
              </div>
            )
          const formatedReturnDate = newDate(returnDate)
          const today = newDate()
          const diff = differenceInDays(formatedReturnDate, today)

          return (
            <div className="w-full justify-center items-center flex">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">
                    {formatDate(formatedReturnDate)}
                  </Button>
                </TooltipTrigger>

                <TooltipContent>
                  {diff > 0 ? (
                    <div>Due In {diff} Day(s)</div>
                  ) : diff === 0 ? (
                    <div>Due Today</div>
                  ) : (
                    <div>Due {diff * -1} Day(s) Ago</div>
                  )}
                </TooltipContent>
              </Tooltip>
            </div>
          )
        },
      },

      {
        id: "totalFees",

        accessorKey: "totalFees",

        meta: {
          label: "Fees",
          variant: "number",
        },

        cell: ({ row }) => {
          const { totalFees } = row.original

          return <div>{Number(totalFees).toLocaleString("en-US")} IQD</div>
        },
      },

      {
        id: "patientStatus",
        accessorKey: "patientStatus",

        meta: {
          label: "Patient Status",
          variant: "multiSelect",

          options: [
            { label: "Active", value: "Active", icon: CheckCircle },
            { label: "Complete", value: "Complete", icon: BookCheck },
            { label: "Pending", value: "Pending", icon: Clock },
            {
              label: "Follow-up Due",
              value: "Follow-Up Due",
              icon: AlertCircle,
            },
          ],
        },

        cell: ({ row }) => {
          const { patientStatus: status } = row.original
          let Icon: ReactNode = <BookCheck size={16} />
          // let Meaning: ReactNode = (
          //   <div>This Surgery was Due On {formatDate(surgeryDate)}</div>
          // )
          let className = "text-gray-200 bg-gray-700"
          if (status === "Active") {
            Icon = <CheckCircle size={16} />
            className = "bg-green-100 text-green-700"
          }
          if (status === "Pending") {
            Icon = <Clock size={16} />
            className = "bg-red-100 text-amber-500"
            // Meaning = (
            //   <div>This Surgery Is Due On {formatDate(surgeryDate)}</div>
            // )
          }
          if (status === "Follow-Up Due") {
            Icon = <AlertCircle size={16} />
            className = "bg-red-100 text-red-700"
          }
          return (
            <Button
              variant="outline"
              size={"icon"}
              className={cn(
                "rounded-md px-2 py-1 text-xs font-medium w-fit flex gap-2",
                className,
              )}
            >
              {status}
              {Icon}
            </Button>
            // <div>
            //   <Tooltip>
            //     <TooltipTrigger asChild>
            //     </TooltipTrigger>
            //      <TooltipContent>{Meaning}</TooltipContent>
            //   </Tooltip>
            // </div>
          )
        },
      },
    ],
    { filter: true, index: true, select: false },
  )

  if (isLoading || isPending)
    return <LoadingComp title="Loading Surgeries ..." />
  if (isError)
    return (
      <ErrorComp
        title="Error While Loading the Surgeries"
        errorMessage={error.message}
      />
    )
  return (
    <CustomDataTable
      data={data}
      columns={columns}
      name="v"
      queryKeys={["allVisits"] as InvalidateQueryFilters}
      toolbar={(_table) => {
        let num = 0
        data.forEach((d) => {
          if (d.patientStatus === "Active") num++
        })
        const dataLength = useMemo(() => data.length, [data])
        return (
          <>
            <Badge variant="secondary" className="font-bold">
              Total Visits = {dataLength}
            </Badge>

            <Badge variant="secondary" className="font-bold">
              Patients Coming Today = {num}
            </Badge>
          </>
        )
      }}
    />
  )
}
