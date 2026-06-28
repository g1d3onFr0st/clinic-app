import Header from "./Header"
import Footer from "./Footer"
import type { ReactNode } from "react"
import { Toaster } from "sonner"

export function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <Toaster duration={5000} />
      <main className="mt-30  ">{children}</main>
      <Footer />
    </>
  )
}
// [view-transition-name:main-content]
