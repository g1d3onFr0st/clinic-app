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

export default function Header() {
  const { isLoggedIn, setIsLoggedIn } = useAppContext()
  const router = useRouter()
  const [isOpen , setIsOpen] = useState(false)

  return (
    <header className="grid grid-cols-[1fr_2fr_1fr] grid-rows-1 h-20 w-screen fixed z-100 top-0  bg-primary text-background px-4 ">
      <div className="flex justify-start items-center gap-4">
        <img src={clinicIcon} alt="" className="size-15 rounded-full" />
        <h3>
          <Link to="/"className="whitespace-nowrap">Dr Samer Sabah Al-Obaidi Clinic App </Link>
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
              <Item variant="outline" size="sm" asChild onClick={()=>setIsOpen(false)}>
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
              <Item variant="outline" size="sm" asChild onClick={()=>setIsOpen(false)}>
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
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}
