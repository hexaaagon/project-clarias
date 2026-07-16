"use client"

import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

function IoTIcon() {
  return <Cpu className="size-4" />
}

export function SignIn6() {
  const router = useRouter()

  function handleGuest() {
    document.cookie = "clarias-auth=guest; path=/; max-age=86400"
    router.push("/")
  }

  function handleIoT() {
    toast("IoT login is coming soon!", {
      description: "This feature is still under development. Stay tuned.",
    })
  }

  return (
    <Card className="grid w-full gap-0 p-0 md:grid-cols-2">
      <div className="from-primary to-primary/80 text-primary-foreground relative hidden flex-col justify-between overflow-hidden bg-gradient-to-b p-10 md:flex">
        <div className="bg-primary-foreground/10 pointer-events-none absolute -top-24 -right-24 size-64 rounded-full blur-3xl" />

        <div className="relative flex items-center gap-2.5">
          <div className="bg-primary-foreground/15 ring-primary-foreground/25 flex size-8 items-center justify-center rounded-lg ring-1">
            <div className="bg-primary-foreground size-3 rotate-45 rounded-[3px]" />
          </div>
          <span className="text-sm font-semibold tracking-tight">Project Clarias</span>
        </div>

        <h2 className="relative mt-auto max-w-[15ch] text-[26px] leading-[1.15] font-semibold tracking-tight text-balance">
          Smart aquaculture, simplified.
        </h2>

        <div className="relative mt-8 flex items-center gap-3">
          <span className="text-primary-foreground/85 text-xs">
            Monitor water quality, track harvests, and manage your ponds — all in one place.
          </span>
        </div>
      </div>

      <div className="flex flex-col justify-center gap-5 p-8">
        <div className="flex flex-col gap-1">
          <span className="text-lg font-semibold">Welcome</span>
          <span className="text-muted-foreground text-xs">
            Choose how you'd like to continue.
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            className="w-full justify-center gap-2"
            onClick={handleIoT}
          >
            <IoTIcon />
            Continue with IoT
          </Button>

          <div className="flex items-center gap-3">
            <span className="bg-border h-px flex-1" />
            <span className="text-muted-foreground text-[11px] uppercase">
              or
            </span>
            <span className="bg-border h-px flex-1" />
          </div>

          <Button className="w-full" onClick={handleGuest}>
            Continue as Guest
          </Button>
        </div>

        <p className="text-muted-foreground text-center text-xs">
          Guest access provides full dashboard visibility with sample data.
        </p>
      </div>
    </Card>
  )
}

export default SignIn6
