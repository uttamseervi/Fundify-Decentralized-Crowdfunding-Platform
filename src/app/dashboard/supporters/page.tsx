"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { supporters } from "@/lib/data"

export default function SupportersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [campaignFilter, setCampaignFilter] = useState("all")

  const filteredSupporters = supporters.filter((supporter) => {
    const matchesSearch =
      supporter.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supporter.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCampaign = campaignFilter === "all" || supporter.campaignId === campaignFilter
    return matchesSearch && matchesCampaign
  })

  // Get unique campaign IDs for filter
  const uniqueCampaigns = Array.from(new Set(supporters.map((s) => s.campaignId)))

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bricolage text-3xl font-bold tracking-tight">Supporters</h1>
        <p className="text-muted-foreground">View all contributors across your campaigns.</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by wallet or campaign..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={campaignFilter} onValueChange={setCampaignFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {uniqueCampaigns.map((id) => (
              <SelectItem key={id} value={id}>
                Campaign #{id}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Supporter</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSupporters.length > 0 ? (
                filteredSupporters.map((supporter) => (
                  <TableRow key={supporter.id}>
                    <TableCell className="font-medium">{supporter.campaignTitle}</TableCell>
                    <TableCell className="font-mono text-sm">{supporter.walletAddress}</TableCell>
                    <TableCell>{supporter.amount} ETH</TableCell>
                    <TableCell>{supporter.date}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No supporters found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>
    </div>
  )
}
