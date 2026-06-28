import { createFileRoute, Link } from "@tanstack/react-router"
import dp from "@/assets/images/doctor-portrait2.png"
import { motion as m, type Variants } from "framer-motion"
import { useAppContext } from "#/integrations/appContext/useAppContext"
import { Label } from "#/components/ui/label"
import { Input } from "#/components/ui/input"
import { Button } from "#/components/ui/button"
import { useState } from "react"
import { fetchPasswordAndVisitsServerFn } from "#/lib/serverFns"
import { useQuery, type InvalidateQueryFilters } from "@tanstack/react-query"
import { ErrorComp, LoadingComp } from "#/components/custom/status"
import { toast } from "sonner"
import { Item, ItemActions, ItemContent, ItemTitle } from "#/components/ui/item"
import { Refresh } from "#/components/custom/Refresh"

export const Route = createFileRoute("/")({
  component: App,
  loader: async ({ context }) =>
    await context.queryClient.ensureQueryData({
      queryKey: ["password"],
      queryFn: fetchPasswordAndVisitsServerFn,
    }),
})

function App() {
  const [passwordValue, setPasswordValue] = useState("")
  const { isLoggedIn, setIsLoggedIn } = useAppContext()

  // const password = Route.useLoaderData()
  const { data, isLoading, isPending, isError, error } = useQuery({
    queryKey: ["password"],
    queryFn: fetchPasswordAndVisitsServerFn,
  })
  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  }

  // const imageVariant: Variants = {
  //   hidden: { opacity: 0, scale: 0.95, y: 40 },
  //   show: {
  //     opacity: 1,
  //     scale: 1,
  //     y: 0,
  //     transition: {
  //       duration: 0.7,
  //       ease: "easeOut",
  //       delay: 1,
  //     },
  //   },
  // }

  if (isLoading || isPending)
    return <LoadingComp title="Loading Password ..." />
  if (isError) {
    return (
      <ErrorComp
        title="Error While Loading the Password"
        errorMessage={error.message}
      />
    )
  }
  const { password, visits, surgeries } = data

  return (
    <section className="flex flex-col min-h-screen loading-page">
      <m.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col justify-st items-center gap-4"
      >
        <m.h1 variants={item} className="scale-140">
          Dr Samer Sabah Al-Obaidi Surgical Clinic
        </m.h1>

        <m.h2 variants={item}>Specialist Surgeon</m.h2>

        <m.h3 variants={item}>
          Specialist in General, Laparoscopic and Plastic Surgery
        </m.h3>

        <m.h4 variants={item}>FACS, CABS, MBChB</m.h4>

        <m.mark variants={item}>"do no harm"</m.mark>

        <m.img
          src={dp}
          // variants={imageVariant}
          initial={{ opacity: 0, scale: 0.95, x: 1000 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            delay: 2,
            type: "spring",
          }}
          alt=""
          className="w-100 absolute left-[70%] bottom-[10%] scale-110"
        />

        <m.div
          initial={{ opacity: 0 }}
          transition={{ duration: 1, delay: 2 }}
          animate={{ opacity: 1 }}
        >
          {!isLoggedIn ? (
            <div className="mt-[40vh] flex gap-2 w-full justify-center items-center">
              <Label className="whitespace-nowrap" htmlFor="input">
                Enter Password :
              </Label>
              <Input
                id="input"
                value={passwordValue}
                type="password"
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                onChange={(e) => setPasswordValue(e.currentTarget.value.trim())}
              />
              <Button
                onClick={() => {
                  if (passwordValue === password) {
                    setIsLoggedIn(true)
                    toast.success("Logged In Successfully !!")
                    setPasswordValue("")
                  } else if (!passwordValue)
                    toast.error("Please Enter the Password")
                  else toast.error("Wrong Password")
                }}
              >
                Log In
              </Button>
            </div>
          ) : (
            <div className="mt-[20vh] flex flex-col gap-5 ">
              <div className=" flex flex-col gap-2 w-full justify-center items-center">
                <h3>Visits</h3>
                {visits.length === 0 ? (
                  <Item variant={"muted"}>
                    <ItemContent>
                      <ItemTitle>No Visits Today</ItemTitle>
                    </ItemContent>
                    <ItemActions></ItemActions>
                  </Item>
                ) : (
                  <div className="grid grid-cols-3 gap-5">
                    {/* <div className="flex justify-center items-center flex-wrap max-w-25 gap-5"> */}
                    {visits.map(({ name, id }) => (
                      <Item variant={"muted"} key={id}>
                        <ItemContent>
                          <ItemTitle>{name}</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                          <Button variant="secondary">
                            <Link
                              to="/patients/$id"
                              params={{ id: String(id) }}
                            >
                              Go
                            </Link>
                          </Button>
                        </ItemActions>
                      </Item>
                    ))}
                  </div>
                )}
              </div>

              <div className=" flex flex-col gap-2 w-full justify-center items-center">
                <h3>Surgeries</h3>
                {surgeries.length === 0 ? (
                  <Item variant={"muted"}>
                    <ItemContent>
                      <ItemTitle>No Surgeries Today</ItemTitle>
                    </ItemContent>
                    <ItemActions></ItemActions>
                  </Item>
                ) : (
                  <div className="grid grid-cols-3 gap-5">
                    {/* <div className="flex justify-center items-center flex-wrap max-w-25 gap-5"> */}
                    {surgeries.map(({ name, patientId, surgeryId }) => (
                      <Item variant={"muted"} key={patientId}>
                        <ItemContent>
                          <Link
                            to="/patients/$id"
                            params={{ id: String(patientId) }}
                          >
                            <ItemTitle>{name}</ItemTitle>
                          </Link>
                        </ItemContent>
                        <ItemActions>
                          <Button variant="secondary">
                            <Link
                              to="/patients/$id/surgeries/$surgeryId"
                              params={{
                                id: String(patientId),
                                surgeryId: String(surgeryId),
                              }}
                            >
                              Go To Surgery
                            </Link>
                          </Button>
                        </ItemActions>
                      </Item>
                    ))}
                  </div>
                )}
              </div>

              <Refresh queryKeys={["password"] as InvalidateQueryFilters} />
            </div>
          )}
        </m.div>
        <m.p variants={item}></m.p>
      </m.div>
    </section>
  )
}
// ngrok config add-authtoken 30GcT62UCzZUHhlpRkPMJFrgE3D_XGbsCqtXJh91kEQ5mELR
// ngrok http 80
