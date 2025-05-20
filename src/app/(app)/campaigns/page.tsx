"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import CampaignCard from "@/components/campaign-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowBigLeft, ArrowLeft, Search } from "lucide-react"
import { campaigns } from "@/lib/data"
import Link from "next/link"
import { useReadContract } from "thirdweb/react"
import { resolveMethod } from "thirdweb";
import { getCampaignContract } from "@/utils/thirdweb"
import { toEther } from "thirdweb/utils"
import ConnectionButton from "@/app/auth/connection-button"
import { useRouter } from "next/navigation"

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const contract = getCampaignContract()

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
        goal: Number(toEther(c.target)),
        raised: Number(toEther(c.amountCollected)),
        daysLeft,
        creator: c.owner,
        status: (deadline < now
          ? "expired"
          : toEther(c.amountCollected) >= toEther(c.target)
            ? "completed"
            : "active") as "expired" | "completed" | "active",
      }
    })
  }, [campaignData])

  // Filter logic
  const filteredCampaigns = parsedCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // const categories = ["all", "technology", "art", "community", "education", "environment"]

  return (
    <div className="container py-12">
      <div className="container flex flex-row justify-between">
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2 text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
        <ConnectionButton />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center"
      >
        <h1 className="font-playfair text-3xl font-bold md:text-4xl">Discover Campaigns</h1>
        <p className="mt-4 text-gray-600">Find and support innovative ideas from creators worldwide</p>
      </motion.div>

      {/* Search and Filter */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 md:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search campaigns..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCampaigns.length > 0 ? (
          filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CampaignCard campaign={campaign} />
            </motion.div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center">
            <p className="text-lg text-gray-500">No campaigns found.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
              }}
            >
              No Campaigns
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
