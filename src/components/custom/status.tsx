import { AlertTriangle, Loader } from "lucide-react"

type ErrorProps = {
  title: string
  description?: string
  errorMessage?: string
}

export function ErrorComp({
  title = "An unexpected error occurred.",
  description = "",
  errorMessage,
}: ErrorProps) {
  return (
    <div
      className="w-screen! h-screen!
     flex flex-col items-center justify-center gap-4
      bg-black/90 text-white "
    >
      <AlertTriangle className="w-10 h-10 text-red-500" />
      <h1 className="text-xl font-semibold">
        Something went wrong , Please contact the developer
      </h1>
      <p className="text-sm text-muted-foreground max-w-md">{title}</p>
      <p>{description}</p>
      {errorMessage && <p>Error message : {errorMessage}</p>}
    </div>
  )
}

type LoadingProps = {
  title: string
  description?: string
}

export function LoadingComp({
  title = "Loading",
  description = "",
}: LoadingProps) {
  return (
    <div
      className="w-screen! h-screen!
     flex flex-col items-center justify-center gap-4
      bg-black/90 text-white "
    >
      <Loader className="size-100 animate-spin text-muted-foreground" />
      <h1 className="text-xl font-semibold">{title}</h1>
      <p>{description}</p>
      <p className="text-sm text-muted-foreground">Please wait a moment</p>
    </div>
  )
}
