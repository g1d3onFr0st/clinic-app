// import { scan } from "react-scan"
// import { useEffect } from "react"
import {
  HeadContent,
  Outlet as App,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router"
import appCss from "../styles.css?url"
import { useQuery, type QueryClient } from "@tanstack/react-query"
import { AppWrappers } from "#/integrations/App-Wrappers"
import { TSSDevTools } from "#/integrations/TSSDevTools"
import { NotFoundPage } from "#/pages/NotFoundPage"
import { fetchContextServerFn } from "#/lib/serverFns"
import { ErrorComp, LoadingComp } from "#/components/custom/status"

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: `Dad's clinic app`,
      },
      {
        name: "description",
        content: `Dad's clinic app`,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/svg+xml",
        href: "/favicon.png",
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <NotFoundPage />,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData({
      queryKey: ["context"],
      queryFn: fetchContextServerFn,
    }),
})

// const

function RootDocument() {
  const { queryClient } = Route.useRouteContext()
  // const theme = Route.useLoaderData()
  const {
    data: theme,
    error,
    isError,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["context"],
    queryFn: fetchContextServerFn,
  })
  if (isLoading || isPending) return <LoadingComp title="Loading Theme ..." />
  if (isError || !theme)
    return (
      <ErrorComp
        title="Error while Loading the theme"
        errorMessage={error?.message}
      />
    )

  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* <script
          crossOrigin="anonymous"
          src="//unpkg.com/react-scan/dist/auto.global.js"
        /> */}
        {/* <script src="https://tweakcn.com/live-preview.min.js" /> */}
        <HeadContent />
      </head>
      <body
        cz-shortcut-listen="true"
        className="overflow-x-hidden transition-colors duration-300 bg-background text-foreground dark"
      >
        <AppWrappers queryClient={queryClient} theme={theme}>
          <App />
        </AppWrappers>
        <TSSDevTools />
        <Scripts />
      </body>
    </html>
  )
}

{
  /* <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} /> */
}
// const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.body;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`

// {
//   rel: "preconnect",
//   href: "https://fonts.googleapis.com",
// },
// {
//   rel: "preconnect",
//   href: "https://fonts.gstatic.com",
// },
// {
//   rel: "stylesheet",
//   href: "https://fonts.googleapis.com/css2?family=Monsieur+La+Doulaise&display=swap",
// },
