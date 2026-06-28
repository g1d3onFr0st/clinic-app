import { Card, CardContent } from "#/components/ui/card"
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "#/components/ui/field"

import { addPatientVisitInfoServerFn } from "#/lib/serverFns"
import type { AddPatientVisitZI } from "#/types/zod"
import { useForm } from "@tanstack/react-form-start"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { AddPatientVisitZodSchema } from "#/lib/zod-Schemas"
import { Button } from "#/components/ui/button"
import { toast } from "sonner"
import { LocalFormInput } from "#/components/custom/FormInput"
import { Fees } from "#/components/custom/Fees"

export const Route = createFileRoute("/patients/$id/visits/add")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigator = Route.useNavigate()
  // myForm.fieldInfo.fees?.instance?.state.value
  const addPatientVisitInfo = useServerFn(addPatientVisitInfoServerFn)
  const myForm = useForm({
    defaultValues: {
      fees: 25000 as AddPatientVisitZI["fees"],
      investigations: null as AddPatientVisitZI["investigations"],
      treatment: null as AddPatientVisitZI["treatment"],
      notes: null as AddPatientVisitZI["notes"],
      visitCause: null as AddPatientVisitZI["visitCause"],
      returnDate: null as AddPatientVisitZI["returnDate"],
    } satisfies AddPatientVisitZI,
    validators: {
      onChange: AddPatientVisitZodSchema,
      onSubmit: AddPatientVisitZodSchema,
    },
    onSubmit: async ({ value }) => {
      await addPatientVisitInfo({
        data: {
          visit: value,
          patientId: Number(id),
        },
      })
      navigator({
        to: "/patients/$id",
        params: { id },
      })
      toast.success("Visit Added Successfully !")
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
    name: keyof AddPatientVisitZI
    label?: string
    type?: string
    className?: string
    inputType?: "input" | "textarea"
    description?: string
    placeholder?: string
  }) {
    return (
      <LocalFormInput<AddPatientVisitZI>
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
                <FieldLegend>Add Visit</FieldLegend>
                <FieldDescription>
                  in this form, you can add a new visit for this patient .
                </FieldDescription>
                <FieldGroup>
                  <FormInput name="visitCause" inputType="textarea" />
                  <FormInput name="investigations" inputType="textarea" />
                  <FormInput name="treatment" inputType="textarea" />
                  <FieldSeparator />
                  <FormInput name="returnDate" type="date" />
                  <FormInput name="notes" inputType="textarea" />
                  <FieldSeparator />
                  <Fees myForm={myForm} FormInput={FormInput} name="v" />
                </FieldGroup>
              </FieldSet>
              <myForm.Subscribe selector={({ isSubmitting }) => isSubmitting}>
                {(isSubmitting) => (
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adding Visit ..." : "Add Visit"}
                    </Button>
                    <Button
                      disabled={isSubmitting}
                      type="button"
                      variant={"secondary"}
                      onClick={() => {
                        myForm.reset()
                        toast.success("Form Reset To Original Information")
                      }}
                    >
                      Reset
                    </Button>
                    <Button
                      variant="secondary"
                      disabled={isSubmitting}
                      type="button"
                    >
                      <Link to="/patients/$id" params={{ id }}>
                        Back To Patient
                      </Link>
                    </Button>
                  </div>
                )}
              </myForm.Subscribe>
            </form>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
