"use client"

import { motion } from "framer-motion"
import { useMemo, useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, TrendingUp, Users, Wallet, Target, Calendar, Activity } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import RecentActivityList from "@/components/dashboard/recent-activity-list"
import StatCard from "@/components/dashboard/stat-card"
import { useActiveAccount, useReadContract } from "thirdweb/react"
import { getCampaignContract } from "@/utils/thirdweb"
import { resolveMethod, toEther } from "thirdweb"

export default function DashboardOverview() {
  const [isLoading, setLoading] = useState(true)
  const contract = getCampaignContract()
  const activeAccount = useActiveAccount()

  const { data: campaignData, isLoading: contractLoading } = useReadContract({
    contract,
    method: resolveMethod("getCampaigns") as unknown as string,
    params: [],
  })

  // Parse user's campaigns with enhanced data
  const userCampaigns = useMemo(() => {
    if (!campaignData || !activeAccount?.address) return []

    return campaignData
      .filter((campaign: any) => campaign.smartWallet === activeAccount.address)
      .map((c: any) => {
        const deadline = Number(c.deadline)
        const now = Math.floor(Date.now() / 1000)
        const daysLeft = Math.max(0, Math.ceil((deadline - now) / (60 * 60 * 24)))

        const targetAmount = Number(toEther(c.target))
        const collectedAmount = Number(toEther(c.amountCollected))

        let status: "expired" | "completed" | "active"
        if (deadline < now) {
          status = "expired"
        } else if (collectedAmount >= targetAmount) {
          status = "completed"
        } else {
          status = "active"
        }

        return {
          id: String(c.campaignId),
          title: c.title,
          description: c.description,
          image: c.image.startsWith("ipfs://")
            ? c.image.replace("ipfs://", "https://ipfs.io/ipfs/")
            : c.image,
          target: targetAmount,
          raised: collectedAmount,
          deadline,
          daysLeft,
          status,
          donators: c.donators || [],
          donations: c.donations || [],
        }
      })
  }, [campaignData, activeAccount?.address])

  // Calculate comprehensive statistics
  const stats = useMemo(() => {
    const totalRaised = userCampaigns.reduce((sum, campaign) => sum + campaign.raised, 0)
    const totalGoal = userCampaigns.reduce((sum, campaign) => sum + campaign.target, 0)
    const totalCampaigns = userCampaigns.length
    const activeCampaigns = userCampaigns.filter(c => c.status === "active").length
    const completedCampaigns = userCampaigns.filter(c => c.status === "completed").length
    const expiredCampaigns = userCampaigns.filter(c => c.status === "expired").length

    // Calculate unique supporters across all campaigns
    const allDonators = new Set()
    let totalDonations = 0

    userCampaigns.forEach(campaign => {
      campaign.donators.forEach((donator: string) => {
        allDonators.add(donator)
      })
      totalDonations += campaign.donations.length
    })

    const totalSupporters = allDonators.size
    const percentageReached = totalGoal > 0 ? (totalRaised / totalGoal) * 100 : 0
    const avgDonation = totalDonations > 0 ? totalRaised / totalDonations : 0

    // Calculate success rate
    const successRate = totalCampaigns > 0 ? (completedCampaigns / totalCampaigns) * 100 : 0

    return {
      totalRaised,
      totalGoal,
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      expiredCampaigns,
      totalSupporters,
      totalDonations,
      percentageReached,
      avgDonation,
      successRate,
    }
  }, [userCampaigns])

  // Get recent activity (latest donations across all campaigns)
  const recentActivity = useMemo(() => {
    const activities: any[] = []

    userCampaigns.forEach(campaign => {
      campaign.donators.forEach((donator: string, index: number) => {
        const donationAmount = campaign.donations[index]
        if (donationAmount && Number(donationAmount) > 0) {
          activities.push({
            id: `${campaign.id}-${index}`,
            type: 'donation',
            campaignTitle: campaign.title,
            donator,
            amount: Number(toEther(donationAmount)),
            // Estimate date based on index (newer donations have higher indices)
            date: new Date(Date.now() - (campaign.donators.length - index) * 24 * 60 * 60 * 1000),
            sortDate: Date.now() - (campaign.donators.length - index) * 24 * 60 * 60 * 1000,
          })
        }
      })
    })

    // Sort by date (most recent first) and take top 5
    return activities
      .sort((a, b) => b.sortDate - a.sortDate)
      .slice(0, 5)
  }, [userCampaigns])

  useEffect(() => {
    if (!contractLoading) {
      setLoading(false)
    }
  }, [contractLoading])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 rounded-lg border bg-card animate-pulse" />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 rounded-lg border bg-card animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <StatCard
            title="Total Raised"
            value={`${stats.totalRaised.toFixed(4)} ETH`}
            description={stats.totalGoal > 0
              ? `${stats.percentageReached.toFixed(1)}% of ${stats.totalGoal.toFixed(2)} ETH goal`
              : "No funding goals set yet"
            }
            icon={<Wallet className="h-4 w-4 text-[#4c6ef5]" />}
            trend={stats.totalRaised > 0 ? <TrendingUp className="h-4 w-4 text-emerald-600" /> : null}
            trendText={stats.totalRaised > 0 ? `Avg: ${stats.avgDonation.toFixed(4)} ETH per donation` : "Start your first campaign"}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <StatCard
            title="Active Campaigns"
            value={`${stats.activeCampaigns}`}
            description={`${stats.completedCampaigns} completed, ${stats.expiredCampaigns} expired`}
            icon={<ArrowUpRight className="h-4 w-4 text-[#4c6ef5]" />}
            trend={stats.successRate > 0 ? <Target className="h-4 w-4 text-emerald-600" /> : null}
            trendText={stats.totalCampaigns > 0 ? `${stats.successRate.toFixed(1)}% success rate` : "No campaigns yet"}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <StatCard
            title="Total Supporters"
            value={stats.totalSupporters.toString()}
            description={`${stats.totalDonations} total donations across all campaigns`}
            icon={<Users className="h-4 w-4 text-[#4c6ef5]" />}
            trend={stats.totalSupporters > 0 ? <Activity className="h-4 w-4 text-emerald-600" /> : null}
            trendText={stats.totalSupporters > 0
              ? `${(stats.totalDonations / Math.max(stats.totalSupporters, 1)).toFixed(1)} donations per supporter`
              : "No supporters yet"
            }
          />
        </motion.div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="border-none bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Campaigns</p>
                  <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="border-none bg-gradient-to-br from-green-50 to-emerald-50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-emerald-600">{stats.completedCampaigns}</p>
                </div>
                <Target className="h-8 w-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Card className="border-none bg-gradient-to-br from-amber-50 to-orange-50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.activeCampaigns}</p>
                </div>
                <Activity className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Card className="border-none bg-gradient-to-br from-red-50 to-pink-50 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Expired</p>
                  <p className="text-2xl font-bold text-red-600">{stats.expiredCampaigns}</p>
                </div>
                <Calendar className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <Card className="border-none bg-[#f3f4f6] shadow-sm">
            <CardHeader>
              <CardTitle className="text-neutral-800">Funding Progress</CardTitle>
              <CardDescription className="text-neutral-600">
                Overall progress across all campaigns
                {stats.totalCampaigns > 0 && (
                  <span className="ml-2">• {stats.totalCampaigns} campaigns</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {stats.totalGoal > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-neutral-700">Overall Progress</div>
                      <div className="font-medium text-neutral-800">
                        {stats.percentageReached.toFixed(1)}%
                        <span className="text-xs text-muted-foreground ml-1">
                          ({stats.totalRaised.toFixed(2)}/{stats.totalGoal.toFixed(2)} ETH)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={Math.min(stats.percentageReached, 100)}
                      className="h-3 bg-neutral-200"
                    />
                  </div>
                )}

                {userCampaigns.slice(0, 4).map((campaign, index) => {
                  const progress = campaign.target > 0 ? (campaign.raised / campaign.target) * 100 : 0

                  return (
                    <motion.div
                      key={campaign.id}
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                    >
                      <div className="flex items-center justify-between text-sm">
                        <div className="truncate text-neutral-700 flex-1 mr-2">
                          {campaign.title}
                          <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${campaign.status === 'active' ? 'bg-green-100 text-green-700' :
                              campaign.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-700'
                            }`}>
                            {campaign.status}
                          </span>
                        </div>
                        <div className="font-medium text-neutral-800">
                          {progress.toFixed(1)}%
                        </div>
                      </div>
                      <Progress
                        value={Math.min(progress, 100)}
                        className="h-2 bg-neutral-200"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{campaign.raised.toFixed(4)} ETH raised</span>
                        <span>{campaign.daysLeft} days left</span>
                      </div>
                    </motion.div>
                  )
                })}

                {userCampaigns.length === 0 && (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-medium text-neutral-700 mb-2">No campaigns yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Create your first campaign to start raising funds
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.8 }}
        >
          <Card className="h-full border-none bg-[#f3f4f6] shadow-sm">
            <CardHeader>
              <CardTitle className="text-neutral-800">Recent Activity</CardTitle>
              <CardDescription className="text-neutral-600">
                Latest donations across your campaigns
                {recentActivity.length > 0 && (
                  <span className="ml-2">• {stats.totalDonations} total donations</span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-white/50 border border-neutral-200/50"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm text-neutral-800 truncate">
                          {activity.campaignTitle}
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {activity.donator.slice(0, 6)}...{activity.donator.slice(-4)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm text-emerald-600">
                          +{activity.amount.toFixed(4)} ETH
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.date.toLocaleDateString()}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <h3 className="font-medium text-neutral-700 mb-2">No activity yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Donations will appear here once your campaigns receive funding
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}