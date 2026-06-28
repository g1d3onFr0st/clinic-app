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
  changePatientInfoServerFn,
  deletePatientServerFn,
  fetchPatientInfoServerFn,
} from "#/lib/serverFns"
import type { PatientInfoTypeZI } from "#/types/zod"
import { useForm } from "@tanstack/react-form-start"
import { useQuery, type InvalidateQueryFilters } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { PatientInfoZodSchema } from "#/lib/zod-Schemas"
import { Button } from "#/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "#/components/ui/alert-dialog"
import { MoveLeft, MoveRight, Trash2Icon } from "lucide-react"
import { toast } from "sonner"
import {
  LocalFormInput,
  LocalFormSelect,
  type SelectOption,
} from "#/components/custom/FormInput"
import { Refresh } from "#/components/custom/Refresh"

export const Route = createFileRoute("/patients/$id/")({
  ssr: false,
  component: RouteComponent,
  loader: async ({ params: { id }, context }) => {
    await context.queryClient.ensureQueryData({
      queryKey: ["patient", id],
      queryFn: () =>
        fetchPatientInfoServerFn({
          data: {
            id,
          },
        }),
    })
  },
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigator = Route.useNavigate()
  const deletePatient = useServerFn(deletePatientServerFn)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["patient", id], // ✅ SAME KEY as loader
    queryFn: () =>
      fetchPatientInfoServerFn({
        data: { id },
      }),
  })
  if (isLoading) return <LoadingComp title="Fetching Patient Information" />

  if (isError)
    return (
      <ErrorComp
        title="Error while fetching patient"
        errorMessage={error.message}
      />
    )
  if (!data) return <ErrorComp title="Patient not found data" />
  const changePatientInfo = useServerFn(changePatientInfoServerFn)
  const myForm = useForm({
    defaultValues: data.patient,
    validators: {
      onChange: PatientInfoZodSchema,
      onSubmit: PatientInfoZodSchema,
    },
    onSubmit: async ({ value }) => {
      await changePatientInfo({ data: value })
      toast.success("Patient Updated Successfully")
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
    name: keyof PatientInfoTypeZI
    label?: string
    type?: string
    className?: string
    inputType?: "input" | "textarea"
    description?: string
    placeholder?: string
  }) {
    return (
      <LocalFormInput<PatientInfoTypeZI>
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

  function FormSelect({
    name,
    label,
    className,
    description,
    options,
  }: {
    name: keyof PatientInfoTypeZI & string
    label?: string
    className?: string
    description?: string

    options: SelectOption<PatientInfoTypeZI[keyof PatientInfoTypeZI]>[]
  }) {
    return (
      <LocalFormSelect<PatientInfoTypeZI>
        myForm={myForm}
        name={name}
        label={label}
        className={className}
        description={description}
        options={options}
      />
    )
  }

  return (
    <section className="flex justify-center items-center flex-col my-50! ">
      <Card>
        <CardContent className="max-w-[45vw] ">
          <div>
            <form
              className="w-[42vw] flex justify-center items-center flex-col gap-5"
              onSubmit={async (e) => {
                e.preventDefault()
                await myForm.handleSubmit()
              }}
            >
              <FieldSet className="w-lg">
                <FieldLegend>Add Patient Form</FieldLegend>

                <FieldDescription className="space-y-5">
                  <div>
                    <p>
                      In this form, you can view this patients information to add
                      a patient into the system.
                    </p>
                    <p>
                      <span className="font-extrabold">Note</span>: Only the name,
                      First-Time Location, and gender are required. The rest is
                      optional.
                    </p>
                  </div>
                </FieldDescription>

                <FieldGroup>
                  <FormInput name="name" />

                  <section className="flex justify-around gap-10">
                    <FormSelect
                      className="w-75"
                      name="gender"
                      options={[
                        {
                          label: "Male",
                          value: "male",
                        },
                        {
                          label: "Female",
                          value: "female",
                        },
                      ]}
                    />

                    <FormInput
                      name="dateOfBirth"
                      type="date"
                      className="min-w-50"
                    />
                  </section>

                  <FormInput
                    name="address"
                    placeholder="Iraq , Baghdad , ..."
                  />

                  <section className="flex justify-around gap-10">
                    <FormInput
                      name="phone"
                      className="min-w-50"
                      placeholder="+964 ..."
                    />

                    <FormSelect
                      className="w-75"
                      name="FirstTimeLocation"
                      label="First Time Visit"
                      options={[
                        { label: "Clinic", value: "clinic" },
                        { label: "Hospital", value: "hospital" },
                      ]}
                    />
                  </section>

                  <FieldSeparator />

                  <FormInput
                    name="pastMedicalHistory"
                    inputType="textarea"
                    placeholder="Allergies , Medications , ..."
                  />

                  <FormInput name="pastSurgicalHistory" inputType="textarea" />

                  <FieldSeparator />

                  <FormInput name="notes" inputType="textarea" />
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
                    <div className="flex gap-5">
                      <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Saving" : "Save"}
                      </Button>
                      <Button
                        onClick={() => {
                          myForm.reset()
                          toast.success("Form Reset To Original Information")
                        }}
                        disabled={isSubmitting}
                        type="button"
                      >
                        reset
                      </Button>
                    </div>
                  )
                }
              </myForm.Subscribe>
            </form>
            <div className="mt-10 flex flex-col justify-center items-center gap-5">
              <myForm.Subscribe
                selector={({ isSubmitting, isDirty }) => ({
                  isSubmitting,
                  isDirty,
                })}
              >
                {({ isSubmitting, isDirty }) => (
                  <div className="flex gap-5">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          disabled={isSubmitting || isDirty}
                        >
                          Delete Patient
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent size="sm">
                        <AlertDialogHeader>
                          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                            <Trash2Icon />
                          </AlertDialogMedia>
                          <AlertDialogTitle>Delete Patient ?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete this patient.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel variant="outline">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            variant="destructive"
                            onClick={async () => {
                              await deletePatient({ data: { id } })
                              navigator({
                                to: "/patients",
                              })
                              toast.success("Patient Deleted Successfully")
                            }}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Refresh
                      disabled={isSubmitting || isDirty}
                      queryKeys={["patient", id] as InvalidateQueryFilters}
                    />
                    <Button variant="secondary">
                      <Link to="/patients/$id/visits/add" params={{ id }}>
                        Add Visit
                      </Link>
                    </Button>
                    <Button variant="secondary">
                      <Link to="/patients/$id/surgeries/add" params={{ id }}>
                        Add Surgery
                      </Link>
                    </Button>
                  </div>
                )}
              </myForm.Subscribe>
              <h3>Visits</h3>

              <div className="max-w-150 overflow-x-auto pb-6">
                {data.patient_visits.length === 0 ? (
                  <div className="text-muted-foreground text-sm">
                    No Visits Yet
                  </div>
                ) : (
                  <div className="flex w-max items-center gap-5 py-2">
                    <div className="text-muted-foreground flex shrink-0 gap-2 text-sm">
                      First <MoveRight size={16} />
                    </div>

                    {data.patient_visits.map((visit, i) => {
                      return (
                        <div
                          key={i}
                          className="bg-accent text-accent-foreground inline-flex w-30 shrink-0 items-center justify-center rounded-4xl text-lg"
                        >
                          <Link
                            to="/patients/$id/visits/$visitId"
                            params={{
                              id,
                              visitId: String(visit.visitId),
                            }}
                          >
                            {visit.visitDate}
                          </Link>
                        </div>
                      )
                    })}

                    {data.patient_visits.length > 1 && (
                      <div className="text-muted-foreground flex shrink-0 gap-2 text-sm">
                        <MoveLeft size={16} />
                        Last
                      </div>
                    )}
                  </div>
                )}
              </div>

              <h3>Surgeries</h3>

              <div className="max-w-150 overflow-x-auto pb-6">
                {data.patient_surgeries.length === 0 ? (
                  <div className="text-muted-foreground text-sm">
                    No Surgeries Yet
                  </div>
                ) : (
                  <div className="flex w-max items-center gap-5 py-2">
                    <div className="text-muted-foreground flex shrink-0 gap-2 text-sm">
                      First <MoveRight size={16} />
                    </div>

                    {data.patient_surgeries.map(
                      ({ surgeriesDate, surgeryId }, i) => {
                        return (
                          <div
                            key={i}
                            className="bg-accent text-accent-foreground inline-flex w-30 shrink-0 items-center justify-center rounded-4xl text-lg"
                          >
                            <Link
                              to="/patients/$id/surgeries/$surgeryId"
                              params={{
                                id,
                                surgeryId: String(surgeryId),
                              }}
                            >
                              {surgeriesDate}
                            </Link>
                          </div>
                        )
                      },
                    )}

                    {data.patient_surgeries.length > 1 && (
                      <div className="text-muted-foreground flex shrink-0 gap-2 text-sm">
                        <MoveLeft size={16} />
                        Last
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="secondary">
                  <Link to="/patients">Go To The Patients Table</Link>
                </Button>
                <Button variant="secondary">
                  <Link to="/visits">Go To The Visits Table</Link>
                </Button>
                <Button variant="secondary">
                  <Link to="/finance">Go To The Finance Table</Link>
                </Button>
                <Button variant="secondary">
                  <Link to="/surgeries">Go To The Surgeries Table</Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  )
} // <section className="flex justify-center items-center min-h-screen">
//   <div>
//     <Table>
//       <TableHeader>
//         <TableRow>
//           <TableHead>Field</TableHead>
//           <TableHead>Value</TableHead>
//         </TableRow>
//       </TableHeader>
//       <TableBody>
//         {Object.entries(patient.patient).map(([key, value]) => (
//           <TableRow>
//             <TableCell>{formatLabel(key)}</TableCell>
//             <TableCell>{value}</TableCell>
//           </TableRow>
//         ))}
//       </TableBody>
//     </Table>
//     <div className="flex gap-4">
//       {patient.patient_visits.map((visit) => {
//         return (
//           <div className="rounded-4xl bg-accent text-accent-foreground text-3xl">
//             <Link
//               to="/patient/$patient_id/visit/$visit_id"
//               params={{
//                 patient_id: String(patient_id),
//                 visit_id: String(visit.visit_id),
//               }}
//             >
//               {visit.visit_date}
//             </Link>
//           </div>
//         )
//       })}
//     </div>
//   </div>
// </section>

// )
// }
