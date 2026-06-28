import { ErrorComp, LoadingComp } from "#/components/custom/status"
import { Card, CardContent } from "#/components/ui/card"
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "#/components/ui/field"

import {
  changePatientSurgeryInfoServerFn,
  deleteSurgeryServerFn,
  getPatientSurgeryInfoServerFn,
} from "#/lib/serverFns"
import type { PatientSurgeryZI } from "#/types/zod"
import { cn } from "#/lib/utils"
import { useForm } from "@tanstack/react-form-start"
import { useQuery, type InvalidateQueryFilters } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { motion as m } from "framer-motion"
import { PatientSurgeryZodSchema } from "#/lib/zod-Schemas"
import { Button } from "#/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "#/components/ui/alert-dialog"
import { Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import { Switch } from "#/components/ui/switch"
import { LocalFormInput } from "#/components/custom/FormInput"
import { Refresh } from "#/components/custom/Refresh"
import { Fees } from "#/components/custom/Fees"

export const Route = createFileRoute("/patients/$id/surgeries/$surgeryId")({
  component: RouteComponent,
  loader: async ({ params: { surgeryId }, context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["surgery", surgeryId],
      queryFn: () =>
        getPatientSurgeryInfoServerFn({
          data: {
            surgeryId,
          },
        }),
    })
  },
})

function RouteComponent() {
  const { surgeryId, id } = Route.useParams()
  const navigator = Route.useNavigate()
  const deleteSurgery = useServerFn(deleteSurgeryServerFn)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["surgery", surgeryId], // ✅ SAME KEY as loader
    queryFn: () =>
      getPatientSurgeryInfoServerFn({
        data: { surgeryId },
      }),
  })
  // 🟡 Loading
  if (isLoading) return <LoadingComp title="Fetching Patient Information" />

  // 🔴 Error (includes "Patient not found")
  if (isError)
    return (
      <ErrorComp
        title="Error while fetching patient"
        errorMessage={error.message}
      />
    )
  if (!data) return <ErrorComp title="Patient not found data" />
  // 🟢 At this point → data is guaranteed

  const changePatientSurgeryInfo = useServerFn(changePatientSurgeryInfoServerFn)
  const myForm = useForm({
    defaultValues: data,
    validators: {
      onChange: PatientSurgeryZodSchema,
      onSubmit: PatientSurgeryZodSchema,
    },
    onSubmit: ({ value }) => {
      changePatientSurgeryInfo({ data: value })
      toast.success("Surgery updated Successfully")
      myForm.reset(value)
    },
  })
  function FormInput({
    name,
    label,
    type,
    className,
    inputType,
    description,
    placeholder,
  }: {
    name: keyof PatientSurgeryZI
    label?: string
    type?: string
    className?: string
    inputType?: "input" | "textarea"
    description?: string
    placeholder?: string
  }) {
    return (
      <LocalFormInput<PatientSurgeryZI>
        className={className}
        description={description}
        inputType={inputType}
        label={label}
        name={name}
        type={type}
        placeholder={placeholder}
        myForm={myForm}
      />
    )
  }

  return (
    <section className="flex justify-center items-center flex-col my-50!">
      <Card className="min-w-lg">
        <CardContent>
          <div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                myForm.handleSubmit()
              }}
            >
              <FieldSet>
                <FieldLegend>Surgery Information</FieldLegend>
                <FieldDescription>
                  in here you can add this patient's Surgery details .
                </FieldDescription>
                <FieldGroup>
                  <FormInput name="type" />
                  <FormInput name="cause" />
                  <FieldSeparator />
                  <myForm.Subscribe selector={(state) => state.values.location}>
                    {(location) => {
                      const isFree = location === "Al-Yarmuk Teaching Hospital"
                      return (
                        <div className="flex items-center justify-center gap-5 ">
                          <FormInput
                            name="location"
                            className={cn(
                              isFree && "opacity-60 pointer-events-none",
                              "w-90!",
                            )}
                          />
                          <m.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-3 h-full"
                          >
                            <Switch
                              checked={isFree}
                              onCheckedChange={(e) => {
                                if (e === true)
                                  myForm.setFieldValue(
                                    "location",
                                    "Al-Yarmuk Teaching Hospital",
                                  )
                                else myForm.setFieldValue("location", "")
                              }}
                            />
                            <div className="whitespace-nowrap">Govermental</div>
                          </m.div>
                        </div>
                      )
                    }}
                  </myForm.Subscribe>
                  <FormInput name="date" type="date" />
                  <FormInput name="returnDate" type="date" />
                  <FormInput name="notes" />
                  <FieldSeparator />
                  <Fees myForm={myForm} FormInput={FormInput} name="s" />
                </FieldGroup>
              </FieldSet>
              <myForm.Subscribe
                selector={({ isDirty, isSubmitting }) => ({
                  isDirty,
                  isSubmitting,
                })}
              >
                {({ isDirty, isSubmitting }) =>
                  isDirty && (
                    <div className="space-x-3">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => {
                          myForm.reset()
                          toast.success("Form Reset To Original Information")
                        }}
                      >
                        reset
                      </Button>
                    </div>
                  )
                }
              </myForm.Subscribe>
            </form>
            <myForm.Subscribe
              selector={({ isSubmitting, isDirty }) => ({
                isSubmitting,
                isDirty,
              })}
            >
              {({ isSubmitting, isDirty }) => (
                <div className="mt-10 flex justify-center items-center gap-5">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={isSubmitting || isDirty}
                      >
                        Delete Surgery
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                      <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                          <Trash2Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete Surgery ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this Surgery.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => {
                            deleteSurgery({ data: { surgeryId } })
                            navigator({ to: "/patients/$id" })
                            toast.success("Visit Has Been Deleted Successfully")
                          }}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Refresh
                    queryKeys={["surgery", surgeryId] as InvalidateQueryFilters}
                    disabled={isSubmitting || isDirty}
                  />
                  <Link to="/patients/$id" params={{ id }}>
                    <Button variant={"secondary"}>Go Back To Patient</Button>
                  </Link>
                </div>
              )}
            </myForm.Subscribe>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
