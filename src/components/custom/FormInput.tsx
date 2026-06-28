import { motion as m } from "framer-motion"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field"
import { camelCaseToStringConverter, cn } from "#/lib/utils"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"
import { NativeSelect, NativeSelectOption } from "../ui/native-select"

// type FormInputProps<T> = {
//   name: keyof T
//   label?: string
//   type?: string
//   className?: string
//   inputType?: "input" | "textarea"
//   description?: string
//   myForm: any
// }
type FormInputProps<T> = {
  name: keyof T
  label?: string
  type?: string
  className?: string
  inputType?: "input" | "textarea"
  description?: string
  myForm: any
  placeholder?: string
}

export function LocalFormInput<T>({
  myForm,
  placeholder,
  name,
  label,
  type = "text",
  className,
  inputType = "input",
  description,
}: FormInputProps<T>) {
  return (
    <m.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
      <myForm.Field name={name}>
        {(field: any) => (
          <Field>
            <FieldLabel>
              {label ?? camelCaseToStringConverter(field.name)}
            </FieldLabel>
            {inputType === "input" ? (
              <Input
                step={type === "number" ? 1000 : undefined}
                placeholder={placeholder}
                className={className}
                value={field.state.value || ""}
                type={type}
                onChange={(e) => {
                  const value = e.target.value
                  field.handleChange(
                    !value ? null : type === "number" ? Number(value) : value,
                  )
                }}
              />
            ) : (
              <Textarea
                className={className}
                placeholder={placeholder}
                value={field.state.value || ""}
                onChange={(e) => {
                  const value = e.target.value
                  field.handleChange(!value ? null : value)
                }}
              />
            )}
            <FieldContent>
              {description && (
                <FieldDescription
                  className={cn(description === "HHH" ? "invisible" : "")}
                >
                  {description}
                </FieldDescription>
              )}
              {
                // field.state.meta.isTouched &&
                field.state.meta.errors.length > 0 && (
                  <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
                )
              }
            </FieldContent>
          </Field>
        )}
      </myForm.Field>
    </m.div>
  )
}

export type SelectOption<T> = {
  label: string
  value: T
}

type FormSelectProps<T> = {
  name: keyof T & string
  label?: string
  className?: string
  description?: string

  myForm: any

  options: SelectOption<T[keyof T]>[]
}

export function LocalFormSelect<T>({
  myForm,
  name,
  label,
  className,
  description,
  options,
}: FormSelectProps<T>) {
  return (
    <m.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}>
      <myForm.Field name={name}>
        {(field: any) => (
          <Field>
            <FieldLabel>
              {label ?? camelCaseToStringConverter(field.name)}
            </FieldLabel>

            <NativeSelect
              className={className}
              value={field.state.value ?? ""}
              onChange={(e) => {
                const selected = options.find(
                  (option) => String(option.value) === e.currentTarget.value,
                )

                if (selected) {
                  field.handleChange(selected.value)
                }
              }}
            >
              {/* <NativeSelectOption value="">Select Option</NativeSelectOption> */}

              {options.map((option) => (
                <NativeSelectOption
                  key={String(option.value)}
                  value={String(option.value)}
                >
                  {option.label}
                </NativeSelectOption>
              ))}
            </NativeSelect>

            <FieldContent>
              {description && (
                <FieldDescription
                  className={cn(description === "HIDE!" && "invisible")}
                >
                  {description}
                </FieldDescription>
              )}

              {field.state.meta.errors.length > 0 && (
                <FieldError>{field.state.meta.errors[0]?.message}</FieldError>
              )}
            </FieldContent>
          </Field>
        )}
      </myForm.Field>
    </m.div>
  )
}
