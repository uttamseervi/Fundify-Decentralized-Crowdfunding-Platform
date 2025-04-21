"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { campaigns } from "@/lib/data"
import AccountOverviewChart from "@/components/dashboard/account-overview-chart"
import FundingHistoryChart from "@/components/dashboard/funding-history-chart"

export default function AccountPage() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Calculate total stats
  const totalCampaigns = campaigns.slice(0, 6).length
  const totalRaised = campaigns.slice(0, 6).reduce((sum, campaign) => sum + campaign.raised, 0)
  const totalGoal = campaigns.slice(0, 6).reduce((sum, campaign) => sum + campaign.goal, 0)

  useEffect(() => {
    // Get wallet address from localStorage
    const storedAddress = localStorage.getItem("walletAddress") || "0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
    setWalletAddress(storedAddress)
  }, [])

  const copyToClipboard = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bricolage text-3xl font-bold tracking-tight">Account Overview</h1>
        <p className="text-muted-foreground">View your account statistics and performance.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCampaigns}</div>
              <p className="text-xs text-muted-foreground">
                Across {campaigns.filter((c) => c.status === "active").length} active campaigns
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRaised.toFixed(2)} ETH</div>
              <p className="text-xs text-muted-foreground">
                {((totalRaised / totalGoal) * 100).toFixed(0)}% of total goals
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Supporters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">Across all your campaigns</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Wallet Information</CardTitle>
            <CardDescription>Your connected wallet details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm text-muted-foreground">Connected Wallet</p>
                <p className="font-mono text-sm">{walletAddress}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={copyToClipboard} className="h-8 w-8">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy address</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Tabs defaultValue="performance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="performance">Campaign Performance</TabsTrigger>
            <TabsTrigger value="history">Funding History</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Overview of your campaign funding progress</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <AccountOverviewChart />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Funding History</CardTitle>
                <CardDescription>Funding received over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[350px]">
                <FundingHistoryChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  )
}
