"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { LayoutDashboard, BarChart3, PlusCircle, Users, Settings, User, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ConnectionButton from "@/app/auth/connection-button"
const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Campaigns",
    href: "/dashboard/campaigns",
    icon: BarChart3,
  },
  {
    title: "Create Campaign",
    href: "/create",
    icon: PlusCircle,
  },
  {
    title: "Supporters",
    href: "/dashboard/supporters",
    icon: Users,
  },
  {
    title: "Account",
    href: "/dashboard/account",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div
      className={cn(
        "relative flex h-screen flex-col border-r border-neutral-200 bg-[#f3f4f6] transition-all duration-300",
        isCollapsed ? "w-[70px]" : "w-[240px]",
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-neutral-200 px-3 py-4">
        {!isCollapsed && (
          <Link href="/" className="font-bricolage text-xl font-bold text-neutral-800">
            Fundify
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "h-8 w-8 text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900",
            isCollapsed && "mx-auto",
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex-1 overflow-auto py-6">
        <nav className="grid gap-1 px-2">
          {sidebarLinks.map((link, index) => {
            const isActive = pathname === link.href

            return (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "group flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium transition-all hover:bg-neutral-200/70 hover:text-neutral-900",
                    isActive ? "bg-neutral-200/70 text-neutral-900" : "text-neutral-600",
                  )}
                >
                  <link.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-[#4c6ef5]" : "text-neutral-600")} />
                  {!isCollapsed && <span>{link.title}</span>}
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto border-t border-neutral-200 p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3 rounded-md bg-neutral-200/50 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-neutral-300"></div>
            <div>
              <ConnectionButton type="signin" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
