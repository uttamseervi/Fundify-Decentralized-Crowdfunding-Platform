"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { campaigns } from "@/lib/data"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

export default function AccountOverviewChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="flex h-full items-center justify-center">Loading chart...</div>
  }

  // Prepare data for the chart
  const chartData = campaigns.slice(0, 6).map((campaign) => ({
    name: campaign.title.split(" ").slice(0, 2).join(" "),
    goal: Number(campaign.goal),
    raised: Number(campaign.raised),
    progress: campaign.goal > 0 ? Math.round((campaign.raised / campaign.goal) * 100) : 0,
  }))

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip
            formatter={(value, name) => {
              if (name === "progress") return [`${value}%`, "Progress"]
              const nameStr = String(name)
              return [`${value} ETH`, nameStr.charAt(0).toUpperCase() + nameStr.slice(1)]
            }}
          />
          <Legend />
          <Bar dataKey="goal" fill="#e2e8f0" name="Goal (ETH)" />
          <Bar dataKey="raised" fill="#94a3b8" name="Raised (ETH)" />
          <Bar dataKey="progress" fill="#0ea5e9" name="Progress (%)" />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
