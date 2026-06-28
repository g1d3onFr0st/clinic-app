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
import { getAllSurgeriesServerFn } from "#/lib/serverFns"
import { cn } from "#/lib/utils"
import type { SurgeriesSummary } from "#/types/data-table"
import { useQuery, type InvalidateQueryFilters } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import type { ColumnDef } from "@tanstack/react-table"
import { differenceInDays } from "date-fns"
import { BookCheck, CheckCircle, Clock } from "lucide-react"
import { useMemo, type ReactNode } from "react"

export const Route = createFileRoute("/surgeries")({
  component: RouteComponent,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData({
      queryKey: ["allSurgeries"],
      queryFn: getAllSurgeriesServerFn,
    }),
})

function RouteComponent() {
  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ["allSurgeries"],
    queryFn: getAllSurgeriesServerFn,
  })

  const columns = useColumns<SurgeriesSummary>(
    [
      ...(baseColumns as ColumnDef<SurgeriesSummary>[]),
      {
        id: "surgeryType",
        accessorKey: "surgeryType",
        cell: ({ row }) => {
          const { surgeryType, patientId, surgeryId } = row.original
          return (
            <Link
              to="/patients/$id/surgeries/$surgeryId"
              params={{ id: String(patientId), surgeryId: String(surgeryId) }}
              className="block max-w-30 overflow-hidden whitespace-nowrap text-ellipsis"
              title={surgeryType}
            >
              {surgeryType}
            </Link>
          )
        },
        meta: {
          label: "Surgery Type",
          variant: "text",
        },
      },

      {
        id: "surgeryDate",
        accessorFn: ({ surgeryDate }) => {
          return surgeryDate ? newDate(surgeryDate) : Number.POSITIVE_INFINITY
        },

        meta: {
          label: "Surgery Date",
          variant: "date",
        },
        cell: ({ row }) => {
          const { surgeryDate } = row.original
          const diff = differenceInDays(newDate(), newDate(surgeryDate))
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="default">
                  {formatDate(surgeryDate)}
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                {diff === 0 ? (
                  <span>Today</span>
                ) : diff > 0 ? (
                  <span>{diff} Day(s) Ago</span>
                ) : (
                  <span>In {diff * -1} Day(s)</span>
                )}
              </TooltipContent>
            </Tooltip>
          )
        },
      },
      {
        id: "surgeryLocation",
        accessorKey: "surgeryLocation",
        meta: {
          label: "Surgery Location",
          variant: "text",
        },
      },
      // {
      //   id: "returnDate",

      //   accessorFn: ({ returnDate }) => {
      //     if (!returnDate) {
      //       return Number.POSITIVE_INFINITY
      //     }

      //     return newDate(returnDate).getTime()
      //   },
      //   meta: {
      //     label: "Return Date",
      //     variant: "date",
      //   },

      //   cell: ({ row }) => {
      //     const { returnDate } = row.original
      //     if (returnDate === null)
      //       return (
      //         <div className="w-full justify-center items-center flex">
      //           -----
      //         </div>
      //       )
      //     const formatedReturnDate = newDate(returnDate)
      //     const today = newDate()
      //     const diff = differenceInDays(formatedReturnDate, today)

      //     return (
      //       <div className="w-full justify-center items-center flex">
      //         <Tooltip>
      //           <TooltipTrigger asChild>
      //             <Button variant="outline">
      //               {formatDate(formatedReturnDate)}
      //             </Button>
      //           </TooltipTrigger>

      //           <TooltipContent>
      //             {diff > 0 ? (
      //               <div>
      //                 Due In {differenceInDays(formatedReturnDate, today)} Days
      //               </div>
      //             ) : diff === 0 ? (
      //               <div>Due Today</div>
      //             ) : (
      //               <div>
      //                 Due {differenceInDays(today, formatedReturnDate)} Days Ago
      //               </div>
      //             )}
      //           </TooltipContent>
      //         </Tooltip>
      //       </div>
      //     )
      //   },
      // },

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
      name="s"
      queryKeys={["allSurgeries"] as InvalidateQueryFilters}
      toolbar={(_table) => {
        let num = 0
        data.forEach((d) => {
          if (d.patientStatus === "Active") num++
        })
        const dataLength = useMemo(() => data.length, [data])
        return (
          <>
            <Badge variant="secondary" className="font-bold">
              Total Surgeries = {dataLength}
            </Badge>

            <Badge variant="secondary" className="font-bold">
              Surgeries Today = {num}
            </Badge>
          </>
        )
      }}
    />
  )
}
