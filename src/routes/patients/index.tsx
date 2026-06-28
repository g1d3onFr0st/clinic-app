import { getAllPatientsServerFn } from "#/lib/serverFns"
// import { NuqsAdapter } from "nuqs/adapters/tanstack-router"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useQuery, type InvalidateQueryFilters } from "@tanstack/react-query"
import { ErrorComp, LoadingComp } from "#/components/custom/status"
import { CustomDataTable } from "#/components/dt/CustomDataTable"
import { useColumns } from "#/hooks/useColumns"
import type { PatientSummary } from "#/types/data-table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/components/ui/tooltip"
import { Button } from "#/components/ui/button"
import { formatDate, newDate } from "#/lib/format"
import { differenceInDays } from "date-fns"
import { useMemo, type ReactNode } from "react"
import { Badge } from "#/components/ui/badge"
import { baseColumns } from "#/config/columns"
import type { ColumnDef } from "@tanstack/react-table"
import { AlertCircle, BookCheck, CheckCircle, Clock } from "lucide-react"
import { cn } from "#/lib/utils"
import { DataTableColumnHeader } from "#/components/data-table/data-table-column-header"

export const Route = createFileRoute("/patients/")({
  ssr: false,
  component: RouteComponent,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData({
      queryKey: ["allPatients"],
      queryFn: getAllPatientsServerFn,
    }),
})

function RouteComponent() {
  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ["allPatients"],
    queryFn: getAllPatientsServerFn,
  })

  const columns = useColumns<PatientSummary>(
    [
      ...(baseColumns as ColumnDef<PatientSummary>[]),
      // {
      //   id: "visitCount",
      //   accessorKey: "visitCount",

      //   meta: {
      //     label: "Visit Count",
      //     variant: "number",
      //   },
      // },
      // {
      //   id: "lastVisitDay",
      //   accessorFn: ({ lastVisitDate }) => {
      //     return lastVisitDate
      //       ? differenceInDays(newDate(), newDate(lastVisitDate))
      //       : Number.POSITIVE_INFINITY
      //   },

      //   meta: {
      //     label: "Last Visit Date",
      //     variant: "date",
      //   },
      //   cell: ({ row }) => {
      //     const { lastVisitDate, lastVisitId, patientId } = row.original
      //     if (lastVisitDate === null || lastVisitId === null)
      //       return <div>-----</div>
      //     const diff = differenceInDays(newDate(), newDate(lastVisitDate))
      //     return (
      //       <Tooltip>
      //         <TooltipTrigger asChild>
      //           <Button
      //             variant="outline"
      //             size={diff === 0 ? "default" : "icon-sm"}
      //           >
      //             <Link
      //               to="/patients/$id/visits/$visitId"
      //               params={{
      //                 id: String(patientId),
      //                 visitId: String(lastVisitId),
      //               }}
      //             >
      //               {diff === 0 ? "Today" : diff}
      //             </Link>
      //           </Button>
      //         </TooltipTrigger>

      //         <TooltipContent>
      //           Date : {formatDate(lastVisitDate)}
      //         </TooltipContent>
      //       </Tooltip>
      //     )
      //   },
      // },
      // {
      //   id: "returnDate",

      //   accessorFn: ({ nextReturnDate }) => {
      //     if (!nextReturnDate) {
      //       return Number.POSITIVE_INFINITY
      //     }

      //     return newDate(nextReturnDate).getTime()
      //   },
      //   meta: {
      //     label: "Return Date",
      //     variant: "date",
      //   },

      //   cell: ({ row }) => {
      //     const { nextReturnDate } = row.original
      //     if (nextReturnDate === null)
      //       return (
      //         <div className="w-full justify-center items-center flex">
      //           -----
      //         </div>
      //       )
      //     const formatedReturnDate = newDate(nextReturnDate)
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

      // {
      //   id: "totalFees",

      //   accessorKey: "totalFees",

      //   meta: {
      //     label: "Total Fees",
      //     variant: "number",
      //   },

      //   cell: ({ row }) => {
      //     const { totalFees } = row.original

      //     return <div>{Number(totalFees).toLocaleString("en-US")} IQD</div>
      //   },
      // },

      // {
      //   id: "patientStatus",
      //   accessorKey: "patientStatus",

      //   meta: {
      //     label: "Patient Status",
      //     variant: "multiSelect",

      //     options: [
      //       { label: "New", value: "New", icon: PlusCircle },
      //       { label: "Active", value: "Active", icon: CheckCircle },
      //       { label: "finish", value: "finish", icon: BookCheck },
      //       {
      //         label: "Follow-up Due",
      //         value: "Follow-up Due",
      //         icon: AlertCircle,
      //       },
      //     ],
      //   },

      //   cell: ({ row }) => {
      //     const { patientStatus: status, nextReturnDate } = row.original
      //     let Icon: ReactNode = <BookCheck size={16} />
      //     let Meaning: ReactNode = ""
      //     let className = "text-gray-200 bg-gray-700"
      //     if (status === "Active") {
      //       Icon = <CheckCircle size={16} />
      //       className = "bg-green-100 text-green-700"
      //       Meaning = (
      //         <div>Next Appointment Is On {formatDate(nextReturnDate!)}</div>
      //       )
      //     }
      //     if (status === "Follow-up Due") {
      //       Icon = <AlertCircle size={16} />
      //       className = "bg-red-100 text-red-700"
      //       Meaning = (
      //         <div>last Appointment Was Due {formatDate(nextReturnDate!)}</div>
      //       )
      //     }
      //     if (!Meaning)
      //       return (
      //         <Button
      //           variant="outline"
      //           size={"icon"}
      //           className={cn(
      //             "rounded-md px-2 py-1 text-xs font-medium w-fit flex gap-2",
      //             className,
      //           )}
      //         >
      //           {status}
      //           {Icon}
      //         </Button>
      //       )
      //     return (
      //       <div>
      //         <Tooltip>
      //           <TooltipTrigger asChild>
      //             <Button
      //               variant="outline"
      //               size={"icon"}
      //               className={cn(
      //                 "rounded-md px-2 py-1 text-xs font-medium w-fit flex gap-2",
      //                 className,
      //               )}
      //             >
      //               {status}
      //               {Icon}
      //             </Button>
      //           </TooltipTrigger>
      //           <TooltipContent>{Meaning}</TooltipContent>
      //         </Tooltip>
      //       </div>
      //     )
      //   },
      // },

      // =========================
      // VISITS
      // =========================

      {
        accessorKey: "visitCount",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label="VC"
            title="Visit Count"
          />
        ),
        meta: {
          label: "Visit Count",
          variant: "number",
        },
      },

      {
        accessorKey: "lastVisitDate",
        meta: {
          label: "Last Visit Date",
          variant: "date",
        },
        cell: ({ row }) => {
          const { lastVisitDate, lastVisitId, patientId } = row.original

          if (lastVisitDate === null || lastVisitId === null)
            return <div>-----</div>
          const diff = differenceInDays(newDate(), newDate(lastVisitDate))
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/patients/$id/visits/$visitId"
                  params={{
                    id: String(patientId),
                    visitId: String(lastVisitId),
                  }}
                >
                  <Button variant="outline">{formatDate(lastVisitDate)}</Button>
                </Link>
              </TooltipTrigger>

              <TooltipContent>
                {diff === 0 ? <div>Today</div> : <div>{diff} Day(s) Ago</div>}
              </TooltipContent>
            </Tooltip>
          )
        },
      },

      // =========================
      // SURGERIES
      // =========================

      {
        accessorKey: "surgeryCount",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label="SC"
            title="Surguries Count"
          />
        ),
        meta: {
          label: "Surgeries Count",
          variant: "number",
        },
      },

      {
        accessorKey: "lastSurgeryDate",
        meta: {
          label: "Last Surgery Date",
          variant: "date",
        },

        cell: ({ row }) => {
          const { lastSurgeryDate, lastSurgeryId, patientId } = row.original

          if (lastSurgeryDate === null || lastSurgeryId === null)
            return <div>-----</div>
          const diff = differenceInDays(newDate(), newDate(lastSurgeryDate))
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  to="/patients/$id/surgeries/$surgeryId"
                  params={{
                    id: String(patientId),
                    surgeryId: String(lastSurgeryId),
                  }}
                >
                  <Button variant="outline">
                    {formatDate(lastSurgeryDate)}
                  </Button>
                </Link>
              </TooltipTrigger>

              <TooltipContent>
                {diff === 0 ? <div>Today</div> : <div>{diff} Day(s) Ago</div>}
              </TooltipContent>
            </Tooltip>
          )
        },
      },

      // =========================
      // NEXT RETURN DATE
      // =========================

      {
        accessorKey: "lastReturnDate",
        meta: {
          label: "Last Return Date",
          variant: "date",
        },
        cell: ({ row }) => {
          const { lastReturnSource, lastReturnDate, lastReturnId, patientId } =
            row.original

          if (
            lastReturnSource === null ||
            lastReturnDate === null ||
            lastReturnId === null
          )
            return <div>-----</div>
          const diff = differenceInDays(newDate(), newDate(lastReturnDate))
          return (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline">
                  <Link
                    to={
                      lastReturnSource === "surgery"
                        ? "/patients/$id/surgeries/$surgeryId"
                        : "/patients/$id/visits/$visitId"
                    }
                    params={{
                      id: String(patientId),
                      surgeryId: String(lastReturnId),
                      visitId: String(lastReturnId),
                    }}
                  >
                    {formatDate(lastReturnDate)}
                  </Link>
                </Button>
              </TooltipTrigger>

              <TooltipContent>
                {diff === 0 ? (
                  <div>Today</div>
                ) : diff > 0 ? (
                  <div>{diff} Day(s) Ago</div>
                ) : (
                  <div>Due In {diff * -1} Days</div>
                )}
              </TooltipContent>
            </Tooltip>
          )
        },
      },
      // =========================
      // TOTAL FEES
      // =========================

      {
        accessorKey: "totalFees",
        meta: {
          label: "Total Fees",
          variant: "number",
        },
        cell: ({ row }) => {
          const value = row.original.totalFees

          return <div>{Number(value).toLocaleString()} IQD</div>
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
          const { lastReturnDate, patientStatus } = row.original

          let Icon: ReactNode = <BookCheck size={16} />
          let Meaning: ReactNode = ""
          let className = "text-gray-200 bg-gray-700"
          if (patientStatus === "Active") {
            Icon = <CheckCircle size={16} />
            className = "bg-green-100 text-green-700"
            Meaning = (
              <div>Next Appointment Is On {formatDate(lastReturnDate!)}</div>
            )
          }
          if (patientStatus === "Follow-Up Due") {
            Icon = <AlertCircle size={16} />
            className = "bg-red-100 text-red-700"
            Meaning = (
              <div>last Appointment Was Due {formatDate(lastReturnDate!)}</div>
            )
          }
          if (patientStatus === "Pending")
            if (!Meaning)
              return (
                <Button
                  variant="outline"
                  size={"icon"}
                  className={cn(
                    "rounded-md px-2 py-1 text-xs font-medium w-fit flex gap-2",
                    className,
                  )}
                >
                  {patientStatus}
                  {Icon}
                </Button>
              )
          return (
            <div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size={"icon"}
                    className={cn(
                      "rounded-md px-2 py-1 text-xs font-medium w-fit flex gap-2",
                      className,
                    )}
                  >
                    {patientStatus}
                    {Icon}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{Meaning}</TooltipContent>
              </Tooltip>
            </div>
          )
        },
      },
    ],
    {
      filter: true,
      index: true,
      select: false,
    },
  )
  if (isLoading || isPending)
    return <LoadingComp title="Loading Patients ..." />
  if (isError)
    return (
      <ErrorComp
        title="Error while Loading the Patients"
        errorMessage={error.message}
      />
    )

  return (
    <CustomDataTable
      data={data}
      columns={columns}
      name="p"
      queryKeys={["allPatients"] as InvalidateQueryFilters<readonly unknown[]>}
      toolbar={(_table) => {
        let num = 0
        data.forEach((d) => {
          if (d.patientStatus === "Active") num++
        })
        const dataLength = useMemo(() => data.length, [data])
        return (
          <>
            <Badge variant="secondary" className="font-bold">
              Total Patients = {dataLength}
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
