import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function camelCaseToStringConverter(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
    .replace(/^./, (s) => s.toUpperCase()) // capitalize first letter
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export function FunctionalOmit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>
}
