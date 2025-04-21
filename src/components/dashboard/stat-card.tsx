import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string
  description: string
  icon: ReactNode
  trend?: ReactNode
  trendText?: string
}

export default function StatCard({ title, value, description, icon, trend, trendText }: StatCardProps) {
  return (
    <Card className="border-none bg-[#f3f4f6] shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-neutral-700">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-neutral-800">{value}</div>
        <p className="text-xs text-neutral-600">{description}</p>
        {trend && trendText && (
          <div className="mt-2 flex items-center gap-1 text-xs text-neutral-600">
            {trend}
            <span>{trendText}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
