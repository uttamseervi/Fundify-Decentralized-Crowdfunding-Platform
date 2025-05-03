"use client"

import { Suspense } from "react"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bricolage text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your dashboard.</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardOverview />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <Skeleton key={i} className="h-[180px] rounded-xl" />
        ))}
      <Skeleton className="col-span-full h-[300px] rounded-xl" />
    </div>
  )
}
