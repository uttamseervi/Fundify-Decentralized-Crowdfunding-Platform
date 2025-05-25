"use client"

import { useEffect, useMemo, useState } from "react"
import axios from "axios"
import { motion } from "framer-motion"
import { Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CampaignCard from "@/components/dashboard/campaign-card"
import Link from "next/link"
import { Campaign } from "@/lib/types"
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { getCampaignContract } from "@/utils/thirdweb"
import { resolveMethod, toEther } from "thirdweb";
import { id } from "ethers"

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setLoading] = useState(true)
  const contract = getCampaignContract();
  const activeAccount = useActiveAccount()

  const { data: campaignData, isLoading: contractLoading } = useReadContract({
    contract,
    method: resolveMethod("getCampaigns") as unknown as string,
    params: [],
  })
  console.log("the campaigns list are ", campaignData)

  // Normalize and parse campaign data from contract
  const parsedCampaigns = useMemo(() => {
    if (!campaignData) return []

    return campaignData.map((c: any, index: number) => {
      const deadline = Number(c.deadline)
      const now = Math.floor(Date.now() / 1000)
      const daysLeft = Math.max(0, Math.ceil((deadline - now) / (60 * 60 * 24)))

      // Convert BigInt values to numbers for comparison
      const targetAmount = Number(toEther(c.target))
      const collectedAmount = Number(toEther(c.amountCollected))

      // Determine campaign status
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
        target: Number(c.target),
        deadline,
        amountCollected: toEther(c.amountCollected),
        owner: c.owner,
        smartWallet: c.smartWallet,
        donations: c.donations,
        donators: c.donators,
        goal: targetAmount,
        raised: collectedAmount,
        daysLeft,
        creator: c.owner,
        status,
      }
    })
  }, [campaignData])

  useEffect(() => {
    if (!contractLoading) {
      setLoading(false);
    }
  }, [contractLoading]);

  // Enhanced filtering logic with search and status
  const filteredCampaigns = useMemo(() => {
    return parsedCampaigns.filter((campaign: any) => {
      // Filter by user's campaigns (smartWallet matches activeAccount)
      const isUserCampaign = campaign.smartWallet === activeAccount?.address
      if (!isUserCampaign) return false

      // Search functionality - check title and description
      const matchesSearch = searchQuery === "" ||
        campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        campaign.description.toLowerCase().includes(searchQuery.toLowerCase())

      // Status filter functionality
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [parsedCampaigns, searchQuery, statusFilter, activeAccount?.address])

  console.log("the filtered campaigns are ", filteredCampaigns)

  // Get campaign counts for each status
  const campaignCounts = useMemo(() => {
    const userCampaigns = parsedCampaigns.filter(
      (campaign: any) => campaign.smartWallet === activeAccount?.address
    )

    return {
      all: userCampaigns.length,
      active: userCampaigns.filter((c: any) => c.status === "active").length,
      completed: userCampaigns.filter((c: any) => c.status === "completed").length,
      expired: userCampaigns.filter((c: any) => c.status === "expired").length,
    }
  }, [parsedCampaigns, activeAccount?.address])

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bricolage text-3xl font-bold tracking-tight">My Campaigns</h1>
          <p className="text-muted-foreground">
            Manage and track your crowdfunding campaigns.
            {campaignCounts.all > 0 && (
              <span className="ml-2 text-sm">
                ({campaignCounts.active} active, {campaignCounts.completed} completed, {campaignCounts.expired} expired)
              </span>
            )}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/create">
            <Plus className="mr-2 h-4 w-4" /> Create Campaign
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search campaigns by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              All Campaigns ({campaignCounts.all})
            </SelectItem>
            <SelectItem value="active">
              Active ({campaignCounts.active})
            </SelectItem>
            <SelectItem value="completed">
              Completed ({campaignCounts.completed})
            </SelectItem>
            <SelectItem value="expired">
              Expired ({campaignCounts.expired})
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search and filter results summary */}
      {(searchQuery || statusFilter !== "all") && (
        <div className="text-sm text-muted-foreground">
          {filteredCampaigns.length === 0
            ? "No campaigns match your search criteria"
            : `Showing ${filteredCampaigns.length} of ${campaignCounts.all} campaigns`
          }
          {searchQuery && (
            <span> {`matching ${searchQuery}`}</span>
          )}
          {statusFilter !== "all" && (
            <span> {`with status ${statusFilter}`}</span>
          )}
        </div>
      )}

      {isLoading ? (
        <div className="flex h-[300px] items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
            <p>Loading campaigns...</p>
          </div>
        </div>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign: any, index: any) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <CampaignCard campaign={campaign} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-background p-8 text-center">
          {campaignCounts.all === 0 ? (
            <>
              <h3 className="mt-4 text-lg font-medium">No campaigns yet</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                You haven&apos;t created any campaigns yet. Start your first crowdfunding campaign today!
              </p>
              <Button asChild>
                <Link href="/dashboard/create">Create your first campaign</Link>
              </Button>
            </>
          ) : (
            <>
              <h3 className="mt-4 text-lg font-medium">No campaigns found</h3>
              <p className="mb-4 mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? `No campaigns match your search for "${searchQuery}"`
                  : `No ${statusFilter} campaigns found`
                }
                {(searchQuery || statusFilter !== "all") && ". Try adjusting your filters."}
              </p>
              {(searchQuery || statusFilter !== "all") && (
                <div className="flex gap-2">
                  {searchQuery && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchQuery("")}
                    >
                      Clear search
                    </Button>
                  )}
                  {statusFilter !== "all" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setStatusFilter("all")}
                    >
                      Show all campaigns
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}