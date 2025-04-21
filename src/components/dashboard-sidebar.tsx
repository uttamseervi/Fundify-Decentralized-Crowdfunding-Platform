"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  BarChart3,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { useDispatch } from "react-redux"
import { setWalletConnectionStatus } from "@/store/reducers/userReducer"
import { useActiveWallet, useDisconnect } from "thirdweb/react"

export default function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useDispatch()
  const handleLogout = () => {
    const { disconnect } = useDisconnect();
    const wallet = useActiveWallet();

    localStorage.removeItem("walletAddress")
    dispatch(setWalletConnectionStatus(false))
    if (wallet) {
      disconnect(wallet)
    }
    router.push("/")
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BarChart3, label: "My Campaigns", href: "/dashboard/campaigns" },
    { icon: PlusCircle, label: "Create New", href: "/create" },
    { icon: Users, label: "Supporters", href: "/dashboard/supporters" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ]

  return (
    <div
      className={`relative flex h-screen flex-col border-r bg-white transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"
        }`}
    >
      <div className="flex h-16 items-center justify-between border-b px-4">
        {!isCollapsed && (
          <Link href="/" className="font-playfair text-xl font-bold">
            Fundify
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`${isCollapsed ? "ml-auto" : ""}`}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center rounded-md px-3 py-2 transition-colors ${isActive ? "bg-gray-100 text-black" : "text-gray-600 hover:bg-gray-50 hover:text-black"
                }`}
            >
              <item.icon className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-gray-50 hover:text-black"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </div>
  )
}
