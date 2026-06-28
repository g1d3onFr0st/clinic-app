import {
  FieldSet,
  FieldLegend,
  FieldDescription,
  FieldGroup,
  FieldSeparator,
} from "#/components/ui/field"
import { createFileRoute } from "@tanstack/react-router"
import { Button } from "#/components/ui/button"
import { Card, CardContent } from "#/components/ui/card"
import { useForm } from "@tanstack/react-form-start"
import { AddPatientZodSchema } from "#/lib/zod-Schemas"
import type { AddPatientTypeZI } from "#/types/zod"
import { useServerFn } from "@tanstack/react-start"
import { addPatientServerFn } from "#/lib/serverFns"
import { toast } from "sonner"
import {
  LocalFormInput,
  LocalFormSelect,
  type SelectOption,
} from "#/components/custom/FormInput"

export const Route = createFileRoute("/patients/add")({
  component: RouteComponent,
})

function RouteComponent() {
  const useNavigate = Route.useNavigate()
  const addPatient = useServerFn(addPatientServerFn)
  const myForm = useForm({
    defaultValues: {
      name: "",
      dateOfBirth: null as AddPatientTypeZI["dateOfBirth"],
      gender: "male" as AddPatientTypeZI["gender"],
      address: null as AddPatientTypeZI["address"],
      notes: null as AddPatientTypeZI["notes"],
      phone: null as AddPatientTypeZI["phone"],
      pastMedicalHistory: null as AddPatientTypeZI["pastMedicalHistory"],
      pastSurgicalHistory: null as AddPatientTypeZI["pastSurgicalHistory"],
      FirstTimeLocation: "clinic" as AddPatientTypeZI["FirstTimeLocation"],
    } satisfies AddPatientTypeZI,
    validators: {
      onChange: AddPatientZodSchema,
      onSubmit: AddPatientZodSchema,
    },
    onSubmit: async ({ value }) => {
      const id = await addPatient({ data: value })
      myForm.reset()
      useNavigate({
        to: "/patients/$id",
        params: { id },
      })
      toast.success("Patient Added Successfully")
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
    name: keyof AddPatientTypeZI
    label?: string
    type?: string
    className?: string
    inputType?: "input" | "textarea"
    description?: string
    placeholder?: string
  }) {
    return (
      <LocalFormInput<AddPatientTypeZI>
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
    name: keyof AddPatientTypeZI & string
    label?: string
    className?: string
    description?: string

    options: SelectOption<AddPatientTypeZI[keyof AddPatientTypeZI]>[]
  }) {
    return (
      <LocalFormSelect<AddPatientTypeZI>
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
    <section className="flex justify-center items-center flex-col my-50!">
      {/* <Card className="min-w-lg"> */}
      <Card>
        <CardContent>
          <form
            className="flex w-[42vw] flex-col items-center justify-center gap-5"
            onSubmit={(e) => {
              e.preventDefault()
              myForm.handleSubmit()
            }}
          >
            <FieldSet className="w-lg">
              <FieldLegend>Add Patient Form</FieldLegend>

              <FieldDescription className="space-y-5">
                <div>
                  <p>
                    In this form, you can enter the necessary information to add a
                    patient into the system.
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

                <FormInput name="address" placeholder="Iraq , Baghdad , ..." />

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

            <myForm.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <div className="flex gap-2">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding Patient..." : "Add Patient"}
                  </Button>

                  <Button
                    type="button"
                    variant="secondary"
                    disabled={isSubmitting}
                    onClick={() => {
                      myForm.reset()
                    }}
                  >
                    Reset
                  </Button>
                </div>
              )}
            </myForm.Subscribe>
          </form>
        </CardContent>
      </Card>
    </section>
  )
}
/*
      <myForm.Field name="">
        {(field) => (
          <Field>
            <FieldLabel>{field.name}</FieldLabel>
            <Input
              value={field.state.value || ""}
              onChange={(e) => {
                field.handleChange(e.target.value)
              }}
            />
            <FieldContent>
              {field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                )}
            </FieldContent>
          </Field>
        )}
      </myForm.Field>
*/

{
  /* <Label htmlFor="male">male</Label>
                          <Input
                            className="w-5"
                            type="radio"
                            name="gender"
                            id="male"
                            value="male"
                            onChange={(e) => {
                              field.handleChange("male")
                            }}
                          />
                          <Label htmlFor="female">female</Label>
                          <Input
                            className="w-5"
                            type="radio"
                            name="gender"
                            id="female"
                            value="female"
                            onChange={(e) => {
                              field.handleChange("female")
                            }}
                          /> */
}
{
  /* <m.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex-1"
                        >
                          <myForm.Field name="gender">
                            {(field) => (
                              <Field>
                                <FieldLabel>
                                  {camelCaseToStringConverter(field.name)}
                                </FieldLabel>
                                <NativeSelect
                                  value={field.state.value}
                                  onChange={(e) =>
                                    field.handleChange(
                                      e.currentTarget
                                        .value as AddPatientTypeZI["gender"],
                                    )
                                  }
                                >
                                  <NativeSelectOption value="">
                                    Select Gender
                                  </NativeSelectOption>
                                  <NativeSelectOption value="male">
                                    Male
                                  </NativeSelectOption>
                                  <NativeSelectOption value="female">
                                    Female
                                  </NativeSelectOption>
                                </NativeSelect>
                                <FieldContent>
                                  {
                                    // field.state.meta.isTouched &&
                                    field.state.meta.errors.length > 0 && (
                                      <FieldError>
                                        {field.state.meta.errors[0]?.message}
                                      </FieldError>
                                    )
                                  }
                                </FieldContent>
                              </Field>
                            )}
                          </myForm.Field>
                        </m.div> */
}
{
  /* <m.div
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex-1"
                        >
                          <myForm.Field name="FirstTimeLocation">
                            {(field) => (
                              <Field>
                                <FieldLabel>
                                  {camelCaseToStringConverter(field.name)}
                                </FieldLabel>
                                <NativeSelect
                                  value={field.state.value}
                                  onChange={(e) => {
                                    field.handleChange(
                                      e.currentTarget
                                        .value as AddPatientTypeZI["FirstTimeLocation"],
                                    )
                                  }}
                                >
                                  <NativeSelectOption value="clinic">
                                    Clinic
                                  </NativeSelectOption>
                                  <NativeSelectOption value="hospital">
                                    Hospital
                                  </NativeSelectOption>
                                </NativeSelect>
                                <FieldContent>
                                  {
                                    // field.state.meta.isTouched &&
                                    field.state.meta.errors.length > 0 && (
                                      <FieldError>
                                        {field.state.meta.errors[0]?.message}
                                      </FieldError>
                                    )
                                  }
                                </FieldContent>
                              </Field>
                            )}
                          </myForm.Field>
                        </m.div> */
}
{
  /* <div className="visit w-lg">
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
                      <FormInput name="returnDate" type="date" />
                      <FormInput name="visitNotes" inputType="textarea" />
                      <FieldSeparator />
                      <Fees FormInput={FormInput} myForm={myForm} />
                    </FieldGroup>
                  </FieldSet>
                </div> */
}
