import { Link, useRouter } from "@tanstack/react-router"
import { ThemeToggle } from "../custom/ThemeToggle"
import clinicIcon from "@/assets/images/clinic-icon.png"
import { useAppContext } from "#/integrations/appContext/useAppContext"
import { Button } from "../ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import {
  ChevronRightIcon,
  DollarSign,
  Eye,
  LogOut,
  Plus,
  Search,
  Slice,
  Users,
} from "lucide-react"
import {
  Item,
  ItemContent,
  ItemTitle,
  ItemActions,
  ItemMedia,
} from "../ui/item"
import { toast } from "sonner"
import { useState } from "react"
import {
  useQuery,
  useQueryClient,
  type InvalidateQueryFilters,
} from "@tanstack/react-query"
import { getHeaderPatients } from "#/lib/serverFns"
import { ErrorComp } from "../custom/status"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command"
import { Refresh } from "../custom/Refresh"

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAppContext()
  const router = useRouter()
  // const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const { data, error } = useQuery({
    queryKey: ["allPatientsHeader"],
    queryFn: getHeaderPatients,
  })
  const queryClient = useQueryClient()
  if (error)
    return <ErrorComp title="couldn't fetch all patients in the header" />
  return (
    <header className="grid grid-cols-[1fr_2fr_1fr] grid-rows-1 h-20 w-screen fixed z-100 top-0  bg-primary text-background px-4 ">
      <div className="flex justify-start items-center gap-4">
        <Link to="/" className="whitespace-nowrap">
          <img src={clinicIcon} alt="" className="size-15 rounded-full" />
        </Link>
        <h3>
          {import.meta.env.VITE_ISTESTING === "true"
            ? "Surgical Clinic App"
            : ""}
        </h3>
      </div>
      {isLoggedIn ? (
        <nav className="flex justify-center items-center gap-4">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="text-foreground">
                <Users className="text-foreground" /> Patients
              </Button>
            </PopoverTrigger>
            <PopoverContent className="z-10000 flex flex-col gap-3">
              <Item
                variant="outline"
                size="sm"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link to="/patients">
                  <ItemMedia>
                    <Eye className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>View Patients</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </Link>
              </Item>
              <Item
                variant="outline"
                size="sm"
                asChild
                onClick={() => setIsOpen(false)}
              >
                <Link to="/patients/add">
                  <ItemMedia>
                    <Plus className="size-5" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>Add Patient</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </Link>
              </Item>
            </PopoverContent>
          </Popover>

          <Link to="/surgeries">
            <Button variant="outline" className="text-foreground">
              <Slice className="text-foreground" /> Surgeries
            </Button>
          </Link>

          <Link to="/visits">
            <Button variant="outline" className="text-foreground">
              <Eye className="text-foreground" /> Visits
            </Button>
          </Link>

          <Link to="/finance">
            <Button variant="outline" className="text-foreground">
              <DollarSign className="text-foreground" /> Finance
            </Button>
          </Link>
        </nav>
      ) : (
        <div></div>
      )}
      <div className="flex justify-end items-center gap-4 ">
        {isLoggedIn && (
          <div className="flex gap-2">
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => {
                  queryClient.invalidateQueries([
                    "allPatientsHeader",
                  ] as InvalidateQueryFilters)
                  setOpen(true)
                }}
                variant="outline"
                className="w-fit"
              >
                <Search />
              </Button>
              <CommandDialog open={open} onOpenChange={setOpen}>
                <Command>
                  <CommandInput placeholder="enter patient name" />
                  <Refresh
                    queryKeys={["allPatientsHeader"] as InvalidateQueryFilters}
                  />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="patients">
                      {data?.map((p, i) => (
                        <Link
                          key={i}
                          onClick={() => setOpen(false)}
                          to="/patients/$id"
                          params={{ id: String(p.id) }}
                        >
                          <CommandItem>{p.name}</CommandItem>
                        </Link>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </CommandDialog>
            </div>
            <Button
              variant={"destructive"}
              onClick={() => {
                setIsLoggedIn(false)
                router.navigate({ to: "/" })
                toast.success("Logged Out Successfully")
              }}
            >
              <LogOut />
              Logout
            </Button>
          </div>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
