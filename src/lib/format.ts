import { startOfDay } from "date-fns"

export function formatDate(
  date: Date | string | number | undefined,
  opts: Intl.DateTimeFormatOptions = {},
) {
  if (!date) return ""

  try {
    return new Intl.DateTimeFormat("en-US", {
      month: opts.month ?? "long",
      day: opts.day ?? "numeric",
      year: opts.year ?? "numeric",
      ...opts,
    }).format(newDate(date))
  } catch (_err) {
    return ""
  }
}
export function formatPhone(phone: string) {
  const cleaned = phone.replace(/\D/g, "")

  return cleaned.replace(/(\d{4})(\d{3})(\d{4})/, "$1 $2 $3")
}

export function newDate(date?: string | number | Date) {
  if (date !== undefined) return startOfDay(new Date(date))
  return startOfDay(new Date())
}

export function calculateAge(date: string | Date) {
  const dob = newDate(date)
  const today = newDate()

  let age = today.getFullYear() - dob.getFullYear()

  const monthDiff = today.getMonth() - dob.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }

  return age
}
