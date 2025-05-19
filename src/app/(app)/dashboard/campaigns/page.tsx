"use client"

import { useEffect, useState } from "react"
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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await axios.get("/api/campaigns", { withCredentials: true })
        console.log("the reponse is ", res.data)
        setCampaigns(res.data)
      } catch (error) {
        console.error("Error fetching campaigns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || campaign.status.toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bricolage text-3xl font-bold tracking-tight">My Campaigns</h1>
          <p className="text-muted-foreground">Manage and track your crowdfunding campaigns.</p>
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
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p>Loading campaigns...</p>
      ) : filteredCampaigns.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign?.id}
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
          <h3 className="mt-4 text-lg font-medium">No campaigns found</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            We couldn't find any campaigns matching your criteria.
          </p>
          <Button asChild variant="outline">
            <Link href="/create">Create your first campaign</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
