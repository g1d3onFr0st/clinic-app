import { TanStackDevtools } from "@tanstack/react-devtools"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import { formDevtoolsPlugin } from "@tanstack/react-form-devtools"
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"

export function TSSDevTools() {
  return (
    <TanStackDevtools
      config={{
        position: "bottom-right",
      }}
      plugins={[
        {
          name: "Tanstack Router",
          render: <TanStackRouterDevtoolsPanel />,
        },
        TanStackQueryDevtools,
        formDevtoolsPlugin(),
      ]}
    />
  )
}
