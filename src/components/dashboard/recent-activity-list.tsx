"use client"

import { motion } from "framer-motion"
import { ArrowUpRight, Users, Wallet } from "lucide-react"
import { supporters } from "@/lib/data"

export default function RecentActivityList() {
  // Create recent activity items from supporters data
  const recentActivity = supporters.slice(0, 5).map((supporter) => {
    return {
      id: supporter.id,
      type: "funding",
      title: `New funding received`,
      description: `${supporter.walletAddress} funded ${supporter.amount} ETH`,
      campaign: supporter.campaignTitle,
      date: supporter.date,
      icon: Wallet,
    }
  })

  // Add some campaign updates
  recentActivity.splice(1, 0, {
    id: "update-1",
    type: "update",
    title: "Campaign milestone reached",
    description: "Eco-Friendly Water Bottle reached 75% of funding goal",
    campaign: "Eco-Friendly Water Bottle with Built-in Purifier",
    date: "2 days ago",
    icon: ArrowUpRight,
  })

  recentActivity.splice(3, 0, {
    id: "update-2",
    type: "supporter",
    title: "New supporter joined",
    description: "You have a new supporter for your campaign",
    campaign: "Community Garden in Urban Neighborhood",
    date: "3 days ago",
    icon: Users,
  })

  return (
    <div className="space-y-4">
      {recentActivity.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="flex gap-3"
        >
          <div className={`mt-0.5 rounded-full p-1.5 ${getActivityColor(activity.type)}`}>
            <activity.icon className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-muted-foreground">{activity.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{activity.campaign}</p>
              <p className="text-xs text-muted-foreground">{activity.date}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function getActivityColor(type: string) {
  switch (type) {
    case "funding":
      return "bg-green-500"
    case "update":
      return "bg-blue-500"
    case "supporter":
      return "bg-purple-500"
    default:
      return "bg-gray-500"
  }
}
