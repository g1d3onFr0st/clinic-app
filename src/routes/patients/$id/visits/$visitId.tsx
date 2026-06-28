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
  changePatientVisitInfoServerFn,
  deleteVisitServerFn,
  getPatientVisitInfoServerFn,
} from "#/lib/serverFns"
import type { PatientVisitTypeZI } from "#/types/zod"
import { useForm } from "@tanstack/react-form-start"
import { useQuery, type InvalidateQueryFilters } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { PatientVisitZodSchema } from "#/lib/zod-Schemas"
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
import { LocalFormInput } from "#/components/custom/FormInput"
import { Refresh } from "#/components/custom/Refresh"
import { Fees } from "#/components/custom/Fees"

export const Route = createFileRoute("/patients/$id/visits/$visitId")({
  component: RouteComponent,
  loader: async ({ params: { visitId }, context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["visit", visitId],
      queryFn: () =>
        getPatientVisitInfoServerFn({
          data: {
            visitId,
          },
        }),
    })
  },
})

function RouteComponent() {
  const { visitId, id } = Route.useParams()
  const navigator = Route.useNavigate()
  const deleteVisit = useServerFn(deleteVisitServerFn)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["visit", visitId], // ✅ SAME KEY as loader
    queryFn: () =>
      getPatientVisitInfoServerFn({
        data: { visitId },
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

  const changePatientVisitInfo = useServerFn(changePatientVisitInfoServerFn)
  const myForm = useForm({
    defaultValues: data,
    validators: {
      onChange: PatientVisitZodSchema,
      onSubmit: PatientVisitZodSchema,
    },
    onSubmit: ({ value }) => {
      changePatientVisitInfo({ data: value })
      toast.success("Visit updated Successfully")
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
    name: keyof PatientVisitTypeZI
    label?: string
    type?: string
    className?: string
    inputType?: "input" | "textarea"
    description?: string
    placeholder?: string
  }) {
    return (
      <LocalFormInput<PatientVisitTypeZI>
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
                <FieldLegend>Visit Information</FieldLegend>
                <FieldDescription>
                  in here you can add this patient's visit details .
                </FieldDescription>
                <FieldGroup>
                  <FormInput name="visitCause" inputType="textarea" />
                  <FormInput name="investigations" inputType="textarea" />
                  <FormInput name="treatment" inputType="textarea" />
                  <FieldSeparator />
                  <FormInput name="visitDate" type="date" />
                  <FormInput name="returnDate" type="date" />
                  <FormInput name="notes" inputType="textarea" />
                  <FieldSeparator />
                  <Fees myForm={myForm} FormInput={FormInput} name="v" />

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
                        Delete Visit
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent size="sm">
                      <AlertDialogHeader>
                        <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                          <Trash2Icon />
                        </AlertDialogMedia>
                        <AlertDialogTitle>Delete Visit ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete this Visit.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel variant="outline">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => {
                            deleteVisit({ data: { visitId } })
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
                    queryKeys={["visit", visitId] as InvalidateQueryFilters}
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
