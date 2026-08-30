import { ErrorComp, LoadingComp } from "#/components/custom/status"
import { Button } from "#/components/ui/button"
import { Label } from "#/components/ui/label"
import { Textarea } from "#/components/ui/textarea"
import { calculateAge } from "#/lib/format"
import { fetchPatientPrintServerFn } from "#/lib/serverFns"
import { useQuery } from "@tanstack/react-query"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Phone } from "lucide-react"
import { useRef, useState } from "react"
import { useReactToPrint } from "react-to-print"
import { FaWhatsapp } from "react-icons/fa"
import { Separator } from "#/components/ui/separator"
import waveSrc from "#/assets/images/wave.png"

export const Route = createFileRoute("/patients/$id/print")({
  component: RouteComponent,
})

function RouteComponent() {
  const [meds, setMeds] = useState("")
  const [insts, setInst] = useState("")
  const contentRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: contentRef,
    documentTitle: "Patient Report",
  })
  const { id } = Route.useParams()

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["print", id], // ✅ SAME KEY as loader
    queryFn: () =>
      fetchPatientPrintServerFn({
        data: { id },
      }),
  })
  if (isLoading) return <LoadingComp title="Fetching Patient Information" />

  if (isError)
    return (
      <ErrorComp
        title="Error while fetching patient"
        errorMessage={error.message}
      />
    )
  if (!data) return <ErrorComp title="Patient not found data" />

  return (
    <section className="min-h-screen">
      <div className="flex flex-col gap-5 p-10">
        <h2>Print Patient Information</h2>
        <Label>Enter Medications : </Label>
        <Textarea value={meds} onChange={(e) => setMeds(e.target.value)} />
        <Label>Enter Instructions : </Label>
        <Textarea value={insts} onChange={(e) => setInst(e.target.value)} />
        <Button
          onClick={() => {
            contentRef.current?.classList.remove("hidden")
            contentRef.current?.classList.add("flex")
            handlePrint()
            contentRef.current?.classList.remove("flex")
            contentRef.current?.classList.add("hidden")
          }}
        >
          Print
        </Button>
        <Button variant="secondary">
          <Link to="/patients/$id" params={{ id }}>
            Back To Patient
          </Link>
        </Button>
      </div>
      <div
        className="hidden bg-white text-black print:w-[210mm] print:min-h-[297mm] flex-col gap-5 items-center justify-between pt-10"
        ref={contentRef}
        dir="rtl"
      >
        <div className="w-full flex flex-col items-center justify-center ">
          {/* <div className="flex items-center justify-center w-full px-5">
            <h1 className="amiri">الدُّكْتُورُ سَامِرُ صَبَاح الْعُبَيْدِيّ</h1>
          </div> */}
          <div
            dir="rtl"
            className="flex justify-between items-center px-10 w-full bg-size-[100%_75%] pt-20 bg-no-repeat"
            style={{ backgroundImage: `url(${waveSrc})` }}
            //             backgroundImage: `
            //   linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)),
            //   url(${waveSrc})
            // `,
          >
            <div className="flex pt-20 flex-col items-start justify-start">
              <h3 className="pb-5">الدكتور</h3>
              <h1 className="text-red-600 amiri text-[50px]!">
                سَامِرُ صَبَاح الْعُبَيْدِيّ
              </h1>
            </div>

            <div className="flex pt-40 flex-col items-center justify-center">
              <h3>جراح إختصاص</h3>
              <h3>زميل كلية الجراحين الأمريكية</h3>
              <h3>شهادة البورد العربي (دكتوراه)</h3>
              <h3>في الجراحة العامة والجراحة المنظارية</h3>
              <h4>M.B.Ch.B, CABS, FACS</h4>
            </div>
          </div>
          <Separator />

          <div className="pt-5 flex gap-7 items-center justify-around w-full ">
            <h1>
              <span className="text-[25px]">الاسم</span>: {data.name}
            </h1>
            {data.dateOfBirth ? (
              <h2 className="flex gap-5">
                <span>
                  <span className="text-[25px]">العمر</span>:{" "}
                  {calculateAge(data.dateOfBirth)}
                </span>
              </h2>
            ) : (
              ""
            )}
            <h2>{new Date().toISOString().split("T")[0]}</h2>
          </div>
          <div dir="ltr" className="flex flex-col gap-5 pt-1 px-10 w-full">
            <div dir="ltr" className="flex flex-col  w-full">
              <h3 className="pb-5">Rx: </h3>
              <div>
                {meds
                  .split("\n")
                  .filter((med) => med !== "")
                  .map((med, i) => (
                    <h4 key={i}>{med}</h4>
                  ))}
              </div>
            </div>

            <div
              dir="rtl"
              className="flex flex-col items-start justify-end w-full"
            >
              <h3 className="pb-5">التوصيات: </h3>
              <div>
                {insts
                  .split("\n")
                  .filter((inst) => inst !== "")
                  .map((inst, i) => (
                    <h4 key={i}>{inst}</h4>
                  ))}
              </div>
            </div>
          </div>
        </div>
        <Separator />

        <div className="flex flex-col items-center justify-center w-full px-5 pb-10 font-[5px]">
          {/* <h2 dir="ltr">M.B.Ch.B, CABS, FACS</h2>
          <h2 dir="ltr">+964 078 099 59129</h2> */}
          <h2 className="w-full flex justify-center items-center pb-10">
            الشفاء بإذن الله
          </h2>
          <div
            dir="ltr"
            className="flex justify-between items-center px-10 w-full"
          >
            <div className="flex flex-col">
              <h3>+964 078 099 59129 </h3>
              <div className="flex gap-5">
                <FaWhatsapp size={30} />
                <Phone size={30} />
              </div>
            </div>
            <h3>بغداد ، حي الجامعة ، مجمع تاج الماس الطبي</h3>
          </div>
        </div>
      </div>
    </section>
  )
}
