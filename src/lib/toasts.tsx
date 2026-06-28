import { Check, X, type LucideIcon } from "lucide-react"
import { toast, type ExternalToast } from "sonner"
import { cn } from "./utils"

type BaseProps = {
  baseClassName?: string
  iconClassName?: string
  Icon: LucideIcon
  message: string
  options?: ExternalToast
  toastType:
    | "success"
    | "info"
    | "warning"
    | "error"
    | "message"
    | "getToasts"
    | "getHistory"
    | "loading"
}
const base = ({
  toastType,
  baseClassName = "",
  message,
  Icon,
  iconClassName = "",
  options = { duration: 5000 },
}: BaseProps) =>
  toast[toastType](
    <div
      className={cn("flex justify-between items-center w-75", baseClassName)}
    >
      <span>{message}</span>
      <Icon className={cn("size-4 rounded-full ", iconClassName)} />
    </div>,
    options,
  )

export const myToast = {
  toastError: (message: string) =>
    base({
      toastType: "error",
      message,
      Icon: X,
      iconClassName: "bg-red-500 animate-ping",
    }),
  toastSuccess: (message: string) =>
    base({
      toastType: "success",
      message,
      Icon: Check,
      iconClassName: "bg-green-500 animate-ping",
    }),
}
