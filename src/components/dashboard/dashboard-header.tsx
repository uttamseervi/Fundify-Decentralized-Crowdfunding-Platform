"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Bell } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useDisconnect, useActiveWallet } from "thirdweb/react"
import { useDispatch } from "react-redux"
import { setWalletConnectionStatus } from "@/store/reducers/userReducer"


export default function DashboardHeader() {
  const router = useRouter()
  const dispatch = useDispatch()
  const wallet = useActiveWallet()
  const { disconnect } = useDisconnect()
  const { toast } = useToast()
  const [walletAddress, setWalletAddress] = useState<string | null>(null)

  useEffect(() => {
    // Get wallet address from active wallet directly instead of localStorage
    if (wallet) {
      setWalletAddress(wallet.getAccount()?.address ?? null)
    }
  }, [wallet])

  const handleLogout = () => {
    dispatch(setWalletConnectionStatus(false))
    // Clear wallet address from localStorage
    localStorage.removeItem("walletAddress")

    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })

    // Disconnect the wallet
    if (wallet) {
      disconnect(wallet)
    }

    router.push("/")
  }

  return (
    <header className="border-b border-neutral-200 bg-[#f3f4f6] px-6 py-3">
      <div className="flex items-center justify-between">
        <div>{/* Left side - can be used for breadcrumbs or page title */}</div>

        <div className="flex items-center gap-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#4c6ef5]"></span>
                  <span className="sr-only">Notifications</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Notifications</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleLogout} // Use the single logout function
                  className="text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Logout</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Disconnect Wallet</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="hidden items-center gap-2 md:flex">
            <div className="h-8 w-8 rounded-full bg-neutral-300">
              <span className="sr-only">Profile</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-neutral-800">Account</p>
              <p className="font-mono text-xs text-neutral-600">
                {walletAddress
                  ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
                  : ""}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
