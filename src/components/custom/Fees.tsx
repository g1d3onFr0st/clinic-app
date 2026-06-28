import { useState } from "react";
import { Switch } from "../ui/switch";
import { cn } from "#/lib/utils";
import { motion as m } from "framer-motion"

export function Fees({ myForm, FormInput, name }: { myForm: any, FormInput: any, name: "s" | "v" }) {
    const [isFree, setIsFree] = useState(false)
    const fee = name === "s" ? 0 : 25000
    return (
        <div className="flex items-center justify-center gap-5">
            <FormInput
                name="fees"
                type="number"
                className={cn(
                    "w-90!",
                    isFree && "opacity-0 pointer-events-none",
                )}
            />
            <m.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-3 h-full"
            >
                <Switch
                    checked={isFree}
                    onCheckedChange={(e) => {
                        if (e === true) {
                            myForm.setFieldValue("fees", 0)
                            setIsFree(true)
                        }
                        else {
                            myForm.setFieldValue("fees", fee)
                            setIsFree(false)
                        }

                    }}
                />
                <div className="whitespace-nowrap">Free {name === "s" ? "Surgery" : "Visit"}</div>
            </m.div>
        </div>

    )
}