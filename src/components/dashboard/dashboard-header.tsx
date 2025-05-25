"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Bell } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useDisconnect, useActiveWallet } from "thirdweb/react"
import { useDispatch } from "react-redux"
import { client } from "@/app/client"
import ConnectionButton from "@/app/auth/connection-button"

export default function DashboardHeader() {
  const router = useRouter()
  const wallet = useActiveWallet()
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  useEffect(() => {
    // Get wallet address from active wallet directly instead of localStorage

    if (wallet) {
      console.log("the active wallet is", wallet)
      setWalletAddress(wallet.getAccount()?.address ?? null)
    }
  }, [wallet])



  return (
    <header className="border-b border-neutral-200 bg-[#f3f4f6] px-6 py-3">
      <div className="flex items-center justify-between">
        <div>{/* Left side - can be used for breadcrumbs or page title */}</div>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 md:flex">
            <div className="text-sm">
              <ConnectionButton />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
