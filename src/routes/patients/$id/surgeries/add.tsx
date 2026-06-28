import { Card, CardContent } from "#/components/ui/card"
import {
  FieldDescription,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "#/components/ui/field"

import { addPatientSurgeryInfoServerFn } from "#/lib/serverFns"
import type { AddPatientSurgeryZI } from "#/types/zod"
import { useForm } from "@tanstack/react-form-start"
import { createFileRoute, Link } from "@tanstack/react-router"
import { useServerFn } from "@tanstack/react-start"
import { AddPatientSurgeryZodSchema } from "#/lib/zod-Schemas"
import { Button } from "#/components/ui/button"
import { toast } from "sonner"
import { LocalFormInput } from "#/components/custom/FormInput"
import { cn } from "#/lib/utils"
import { Switch } from "#/components/ui/switch"
import { motion as m } from "framer-motion"
import { Fees } from "#/components/custom/Fees"

export const Route = createFileRoute("/patients/$id/surgeries/add")({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  const navigator = Route.useNavigate()
  // myForm.fieldInfo.fees?.instance?.state.value
  const addPatientSurgeryInfo = useServerFn(addPatientSurgeryInfoServerFn)
  const myForm = useForm({
    defaultValues: {
      fees: 0 as AddPatientSurgeryZI["fees"],
      notes: null as AddPatientSurgeryZI["notes"],
      cause: null as AddPatientSurgeryZI["cause"],
      returnDate: null as AddPatientSurgeryZI["returnDate"],
      date: "",
      location: "",
      type: "",
    } satisfies AddPatientSurgeryZI,
    validators: {
      onChange: AddPatientSurgeryZodSchema,
      onSubmit: AddPatientSurgeryZodSchema,
    },
    onSubmit: async ({ value }) => {
      await addPatientSurgeryInfo({
        data: {
          surgery: value,
          patientId: Number(id),
        },
      })
      navigator({
        to: "/patients/$id",
        params: { id },
      })
      toast.success("Surgery Added Successfully !")
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
    name: keyof AddPatientSurgeryZI
    label?: string
    type?: string
    className?: string
    inputType?: "input" | "textarea"
    description?: string
    placeholder?: string
  }) {
    return (
      <LocalFormInput<AddPatientSurgeryZI>
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
                <FieldLegend>Add Surgery</FieldLegend>
                <FieldDescription>
                  in this form, you can add a new Surgery for this patient .
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
                                if (e === true) {
                                  myForm.setFieldValue(
                                    "location",
                                    "Al-Yarmuk Teaching Hospital",
                                  )
                                }
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
              <myForm.Subscribe selector={({ isSubmitting }) => isSubmitting}>
                {(isSubmitting) => (
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Adding Surgery ..." : "Add Surgery"}
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
