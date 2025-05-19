"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import CampaignCard from "@/components/campaign-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ArrowBigLeft, Search } from "lucide-react"
import Link from "next/link"
import { useReadContract } from "thirdweb/react"
import { resolveMethod } from "thirdweb"
import { getCampaignContract } from "@/utils/thirdweb"

export default function CampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState("all")

  const contract = getCampaignContract()

  const { data, isLoading } = useReadContract({
    contract,
    method: resolveMethod("getCampaigns"),
    params: [],
  })
  console.log("the campaigns list are ", data)

  // Normalize and parse campaign data from contract
  const parsedCampaigns = useMemo(() => {
    if (!data) return []

    return data.map((c: any, index: number) => {
      const deadline = Number(c.deadline)
      const now = Math.floor(Date.now() / 1000)
      const daysLeft = Math.max(0, Math.ceil((deadline - now) / (60 * 60 * 24)))
      return {
        id: Number(c.campaignId),
        title: c.title,
        description: c.description,
        image: c.image.startsWith("ipfs://")
          ? c.image.replace("ipfs://", "https://ipfs.io/ipfs/")
          : c.image,
        target: Number(c.target),
        deadline,
        amountCollected: Number(c.amountCollected),
        owner: c.owner,
        smartWallet: c.smartWallet,
        donations: c.donations,
        donators: c.donators,
        category: c.category || "uncategorized", // Assuming your smart contract includes category
        // Add required Campaign fields
        goal: Number(c.target),
        raised: Number(c.amountCollected),
        daysLeft,
        creator: c.owner,
        status: deadline < now
          ? "ended"
          : Number(c.amountCollected) >= Number(c.target)
            ? "successful"
            : "active",
      }
    })
  }, [data])

  // Filter logic
  const filteredCampaigns = parsedCampaigns.filter((campaign) => {
    const matchesSearch =
      campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = category === "all" || campaign.category === category
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "technology", "art", "community", "education", "environment"]

  return (
    <div className="container py-12">
      <Link href="/" className="p-2 m-2 hover:underline">
        <div className="flex flex-row hover:underline">
          <ArrowBigLeft />
          <h4>Go back to home</h4>
        </div>
      </Link>

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
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setCategory(cat)}
              className="capitalize"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Campaign Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <p className="col-span-full text-center text-gray-500">Loading campaigns...</p>
        ) : filteredCampaigns.length > 0 ? (
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
            <p className="text-lg text-gray-500">No campaigns found matching your criteria.</p>
            <Button
              variant="link"
              onClick={() => {
                setSearchQuery("")
                setCategory("all")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
