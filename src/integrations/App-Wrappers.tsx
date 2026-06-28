import { type QueryClient } from "@tanstack/react-query"
import type { ReactNode } from "react"
import TanstackQueryProvider from "./tanstack-query/root-provider"
import { AppContextProvider } from "./appContext/AppContextProvider"
import { Layout } from "#/components/layout/Layout"
import { TooltipProvider } from "#/components/ui/tooltip"

export function AppWrappers({
  children,
  queryClient,
  theme,
}: {
  children: ReactNode
  queryClient: QueryClient
  theme: "light" | "dark"
}) {
  return (
    <TanstackQueryProvider queryClient={queryClient}>
      <AppContextProvider initialTheme={theme}>
        <TooltipProvider>
          <Layout>{children}</Layout>
        </TooltipProvider>
      </AppContextProvider>
    </TanstackQueryProvider>
  )
}
