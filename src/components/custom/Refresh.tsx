import {
  useQueryClient,
  type InvalidateQueryFilters,
} from "@tanstack/react-query"
import { Button } from "../ui/button"
import { useCallback, type ComponentProps } from "react"
import { RefreshCw } from "lucide-react"
import { toast } from "sonner"

interface Button extends ComponentProps<"button"> {
  queryKeys: InvalidateQueryFilters
}
export function Refresh({ queryKeys, ...props }: Button) {
  const queryClient = useQueryClient()
  const handleClick = useCallback(async () => {
    toast.promise(queryClient.invalidateQueries(queryKeys), {
      loading: "Refreshing...",
      success: "Data Refreshed!",
      error: "Error",
    })
  }, [toast, queryClient, queryKeys])
  return (
    <Button
      variant="outline"
      size="sm"
      className="font-normal"
      onClick={handleClick}
      {...props}
    >
      <RefreshCw className="text-muted-foreground" />
      Refresh
      {/* <Badge
                  variant="secondary"
                  className="h-[18.24px] rounded-[3.2px] px-[5.12px] font-mono font-normal text-[10.4px]"
                ></Badge> */}
    </Button>
  )
}
