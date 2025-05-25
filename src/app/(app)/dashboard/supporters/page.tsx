"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { motion } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Calendar, Wallet, DollarSign, RefreshCw } from "lucide-react"
import { useActiveAccount, useActiveWallet, useReadContract } from "thirdweb/react"
import { getCampaignContract } from "@/utils/thirdweb"
import { resolveMethod, toEther } from "thirdweb"

// Cache management utilities
const CACHE_KEY = 'supporters_data_cache'
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

interface CacheData {
  data: any[]
  timestamp: number
  userAddress: string
}

const getCachedData = (userAddress: string): any[] | null => {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (!cached) return null

    const parsedCache: CacheData = JSON.parse(cached)
    const now = Date.now()

    // Check if cache is valid (not expired and for same user)
    if (
      parsedCache.userAddress === userAddress &&
      (now - parsedCache.timestamp) < CACHE_DURATION
    ) {
      return parsedCache.data
    }

    // Cache expired or different user, remove it
    localStorage.removeItem(CACHE_KEY)
    return null
  } catch (error) {
    console.error('Error reading cache:', error)
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

const setCachedData = (data: any[], userAddress: string) => {
  try {
    const cacheData: CacheData = {
      data,
      timestamp: Date.now(),
      userAddress
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData))
  } catch (error) {
    console.error('Error setting cache:', error)
  }
}

export default function SupportersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [campaignFilter, setCampaignFilter] = useState("all")
  const [sortBy, setSortBy] = useState("amount")
  const [sortOrder, setSortOrder] = useState("desc")
  const [isLoading, setLoading] = useState(true)
  const [cachedSupporters, setCachedSupporters] = useState<any[]>([])
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const contract = getCampaignContract()
  const activeAccount = useActiveAccount()
  const adminWallet = useActiveWallet()

  // Only fetch if we don't have cached data
  const shouldFetch = !cachedSupporters.length || isRefreshing

  const { data: campaignData, isLoading: contractLoading, refetch } = useReadContract({
    contract,
    method: resolveMethod("getCampaigns") as unknown as string,
    params: [],
    // Disable automatic refetching
    queryOptions: {
      enabled: shouldFetch && !!activeAccount?.address,
    }
  })

  // Parse and flatten all supporters from all user campaigns
  const parseSupportersData = useCallback((data: any) => {
    if (!data || !activeAccount?.address) return []

    const supporters: any[] = []

    data.forEach((campaign: any) => {
      // Only include campaigns owned by the current user
      if (campaign.smartWallet !== activeAccount.address || campaign.owner !== adminWallet?.getAdminAccount?.()?.address) return

      const { donators, donations, title, campaignId } = campaign

      // Create supporter entries for each donation
      donators.forEach((donator: string, index: number) => {
        const donationAmount = donations[index]
        if (donationAmount && Number(donationAmount) > 0) {
          supporters.push({
            id: `${campaignId}-${index}`,
            campaignId: String(campaignId),
            campaignTitle: title || `Campaign #${campaignId}`,
            walletAddress: donator,
            amount: Number(toEther(donationAmount)),
            amountWei: donationAmount,
          })
        }
      })
    })

    return supporters
  }, [activeAccount?.address, adminWallet])

  // Load cached data on component mount
  useEffect(() => {
    if (activeAccount?.address) {
      const cached = getCachedData(activeAccount.address)
      if (cached && cached.length > 0) {
        setCachedSupporters(cached)
        setLastRefresh(new Date())
        setLoading(false)
      }
    }
  }, [activeAccount?.address])

  // Handle new data from contract
  useEffect(() => {
    if (campaignData && activeAccount?.address) {
      const supporters = parseSupportersData(campaignData)
      setCachedSupporters(supporters)
      setCachedData(supporters, activeAccount.address)
      setLastRefresh(new Date())
      setIsRefreshing(false)
    }
  }, [campaignData, activeAccount?.address, parseSupportersData])

  // Handle loading states
  useEffect(() => {
    if (!contractLoading) {
      setLoading(false)
    }
  }, [contractLoading])

  // Use cached data as the source of truth
  const allSupporters = cachedSupporters

  // Manual refresh function
  const handleRefresh = async () => {
    setIsRefreshing(true)
    setLoading(true)
    try {
      await refetch()
    } catch (error) {
      console.error('Error refreshing data:', error)
      setIsRefreshing(false)
      setLoading(false)
    }
  }

  // Clear cache function (for debugging/admin purposes)
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    setCachedSupporters([])
    setLastRefresh(null)
    handleRefresh()
  }

  // Filter supporters based on search and campaign filter
  const filteredSupporters = useMemo(() => {
    return allSupporters.filter((supporter) => {
      const matchesSearch = searchQuery === "" ||
        supporter.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        supporter.campaignTitle.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCampaign = campaignFilter === "all" || supporter.campaignId === campaignFilter

      return matchesSearch && matchesCampaign
    })
  }, [allSupporters, searchQuery, campaignFilter])

  // Sort filtered supporters
  const sortedSupporters = useMemo(() => {
    const sorted = [...filteredSupporters].sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "amount":
          comparison = a.amount - b.amount
          break
        case "campaign":
          comparison = a.campaignTitle.localeCompare(b.campaignTitle)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return sorted
  }, [filteredSupporters, sortBy, sortOrder])

  // Get unique campaigns for filter dropdown
  const uniqueCampaigns = useMemo(() => {
    const campaigns = Array.from(
      new Map(
        allSupporters.map(s => [s.campaignId, { id: s.campaignId, title: s.campaignTitle }])
      ).values()
    )
    return campaigns.sort((a, b) => a.title.localeCompare(b.title))
  }, [allSupporters])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSupporters = new Set(allSupporters.map(s => s.walletAddress)).size
    const totalDonations = allSupporters.length
    const totalAmount = allSupporters.reduce((sum, s) => sum + s.amount, 0)
    const avgDonation = totalDonations > 0 ? totalAmount / totalDonations : 0

    return {
      totalSupporters,
      totalDonations,
      totalAmount: totalAmount.toFixed(4),
      avgDonation: avgDonation.toFixed(4)
    }
  }, [allSupporters])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (field: string) => {
    if (sortBy !== field) return null
    return sortOrder === "asc" ? "↑" : "↓"
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bricolage text-3xl font-bold tracking-tight">Supporters</h1>
          <p className="text-muted-foreground">
            View all contributors across your campaigns.
            {stats.totalSupporters > 0 && (
              <span className="ml-2 text-sm">
                ({stats.totalSupporters} unique supporters, {stats.totalDonations} total donations)
              </span>
            )}
            {lastRefresh && (
              <span className="ml-2 text-xs text-muted-foreground">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
            )}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {process.env.NODE_ENV === 'development' && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearCache}
              className="text-red-600 hover:text-red-700"
            >
              Clear Cache
            </Button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      {!isLoading && allSupporters.length > 0 && (
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Unique Supporters</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalSupporters}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Donations</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalDonations}</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Total Raised</span>
            </div>
            <p className="text-2xl font-bold">{stats.totalAmount} ETH</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Avg Donation</span>
            </div>
            <p className="text-2xl font-bold">{stats.avgDonation} ETH</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by wallet address or campaign name..."
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
            <SelectItem value="all">All Campaigns ({allSupporters.length})</SelectItem>
            {uniqueCampaigns.map((campaign) => {
              const count = allSupporters.filter(s => s.campaignId === campaign.id).length
              return (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.title} ({count})
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>

        <Select value={`${sortBy}-${sortOrder}`} onValueChange={(value) => {
          const [field, order] = value.split('-')
          setSortBy(field)
          setSortOrder(order)
        }}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="amount-desc">Highest Amount</SelectItem>
            <SelectItem value="amount-asc">Lowest Amount</SelectItem>
            <SelectItem value="campaign-asc">Campaign A-Z</SelectItem>
            <SelectItem value="campaign-desc">Campaign Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Results Summary */}
      {(searchQuery || campaignFilter !== "all") && (
        <div className="text-sm text-muted-foreground">
          {sortedSupporters.length === 0
            ? "No supporters match your search criteria"
            : `Showing ${sortedSupporters.length} of ${allSupporters.length} supporters`
          }
          {searchQuery && (
            <span> {`matching ${searchQuery}`}</span>
          )}
          {campaignFilter !== "all" && (
            <span> from selected campaign</span>
          )}
        </div>
      )}

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("campaign")}
                >
                  Campaign {getSortIcon("campaign")}
                </TableHead>
                <TableHead>Supporter</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort("amount")}
                >
                  Amount {getSortIcon("amount")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                      {isRefreshing ? 'Refreshing data...' : 'Loading supporters...'}
                    </div>
                  </TableCell>
                </TableRow>
              ) : sortedSupporters.length > 0 ? (
                sortedSupporters.map((supporter, index) => (
                  <motion.tr
                    key={supporter.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="group"
                  >
                    <TableCell className="font-medium">{supporter.campaignTitle}</TableCell>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {supporter.walletAddress.slice(0, 6)}...{supporter.walletAddress.slice(-4)}
                      </div>
                      <div className="text-xs text-muted-foreground group-hover:opacity-100 opacity-0 transition-opacity">
                        {supporter.walletAddress}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{supporter.amount.toFixed(4)} ETH</TableCell>
                  </motion.tr>
                ))
              ) : allSupporters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Wallet className="h-8 w-8 text-muted-foreground/50" />
                      <h3 className="font-medium">No supporters yet</h3>
                      <p className="text-sm text-muted-foreground">
                        Your campaigns haven&#39;t received any donations yet.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <p className="font-medium">No supporters found</p>
                      <p className="text-sm text-muted-foreground">
                        {searchQuery
                          ? `No supporters match your search for "${searchQuery}"`
                          : "No supporters found for the selected campaign"
                        }
                      </p>
                      <div className="flex gap-2 mt-2">
                        {searchQuery && (
                          <button
                            className="text-xs text-primary hover:underline"
                            onClick={() => setSearchQuery("")}
                          >
                            Clear search
                          </button>
                        )}
                        {campaignFilter !== "all" && (
                          <button
                            className="text-xs text-primary hover:underline"
                            onClick={() => setCampaignFilter("all")}
                          >
                            Show all campaigns
                          </button>
                        )}
                      </div>
                    </div>
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