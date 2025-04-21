"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function FundingHistoryChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="flex h-full items-center justify-center">Loading chart...</div>
  }

  // Generate dummy funding history data
  const generateFundingData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
    return months.map((month, index) => {
      // Generate some random but increasing values
      const base = index * 0.8
      return {
        name: month,
        amount: +(base + Math.random() * 2).toFixed(2),
        supporters: Math.floor(base * 2 + Math.random() * 5),
      }
    })
  }

  const fundingData = generateFundingData()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={fundingData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
          <Tooltip />
          <Legend />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="amount"
            name="Funding (ETH)"
            stroke="#0ea5e9"
            activeDot={{ r: 8 }}
            strokeWidth={2}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="supporters"
            name="Supporters"
            stroke="#94a3b8"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
