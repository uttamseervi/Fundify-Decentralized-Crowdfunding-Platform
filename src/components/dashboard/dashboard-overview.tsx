"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { campaigns, supporters } from "@/lib/data"
import { ArrowUpRight, TrendingUp, Users, Wallet } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import RecentActivityList from "@/components/dashboard/recent-activity-list"
import StatCard from "@/components/dashboard/stat-card"

export default function DashboardOverview() {
  // Calculate stats from dummy data
  const totalRaised = campaigns.slice(0, 6).reduce((sum, campaign) => sum + campaign.raised, 0)
  const totalGoal = campaigns.slice(0, 6).reduce((sum, campaign) => sum + campaign.goal, 0)
  const totalCampaigns = campaigns.slice(0, 6).length
  const activeCampaigns = campaigns.slice(0, 6).filter((c) => c.status === "active").length
  const totalSupporters = supporters.length

  // Calculate percentage of goal reached
  const percentageReached = (totalRaised / totalGoal) * 100

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <StatCard
            title="Total Raised"
            value={`${totalRaised.toFixed(2)} ETH`}
            description={`${percentageReached.toFixed(0)}% of ${totalGoal} ETH goal`}
            icon={<Wallet className="h-4 w-4 text-[#4c6ef5]" />}
            trend={<TrendingUp className="h-4 w-4 text-emerald-600" />}
            trendText="+12.5% from last month"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatCard
            title="Active Campaigns"
            value={`${activeCampaigns}`}
            description={`Out of ${totalCampaigns} total campaigns`}
            icon={<ArrowUpRight className="h-4 w-4 text-[#4c6ef5]" />}
            trend={<TrendingUp className="h-4 w-4 text-emerald-600" />}
            trendText="+2 new this month"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatCard
            title="Total Supporters"
            value={totalSupporters.toString()}
            description="Unique contributors to your campaigns"
            icon={<Users className="h-4 w-4 text-[#4c6ef5]" />}
            trend={<TrendingUp className="h-4 w-4 text-emerald-600" />}
            trendText="+8 new supporters"
          />
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card className="border-none bg-[#f3f4f6] shadow-sm">
            <CardHeader>
              <CardTitle className="text-neutral-800">Funding Progress</CardTitle>
              <CardDescription className="text-neutral-600">Overall progress across all campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-neutral-700">Total Progress</div>
                    <div className="font-medium text-neutral-800">{percentageReached.toFixed(0)}%</div>
                  </div>
                  <Progress
                    value={percentageReached}
                    className="h-2 bg-neutral-200"
                    style={{ backgroundColor: '#4c6ef5' }}
                  />
                </div>

                {campaigns.slice(0, 3).map((campaign) => {
                  const progress = (campaign.raised / campaign.goal) * 100

                  return (
                    <div key={campaign.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="truncate text-neutral-700">{campaign.title}</div>
                        <div className="font-medium text-neutral-800">{progress.toFixed(0)}%</div>
                      </div>
                      <Progress value={progress} className="h-2 bg-neutral-200" style={{ '--progress-color': '#4c6ef5' } as React.CSSProperties} />
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="h-full border-none bg-[#f3f4f6] shadow-sm">
            <CardHeader>
              <CardTitle className="text-neutral-800">Recent Activity</CardTitle>
              <CardDescription className="text-neutral-600">Latest funding and campaign updates</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentActivityList />
            </CardContent>
          </Card>
        </motion.div> */}
      </div>
    </div>
  )
}
