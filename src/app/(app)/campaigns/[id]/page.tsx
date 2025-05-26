"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowLeft, Calendar, User, Clock, Share2, Flag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { getCampaignContract } from "@/utils/thirdweb"
import { prepareContractCall, resolveMethod, sendTransaction, waitForReceipt } from "thirdweb"
import { toWei, toEther } from "thirdweb/utils"
import { useActiveAccount, useReadContract, useSendTransaction } from "thirdweb/react"
import { sepolia } from "thirdweb/chains"
import { getWalletBalance } from "thirdweb/wallets";
import ConnectionButton from "@/app/auth/connection-button"
import { client } from "@/app/client"

export default function CampaignDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [campaign, setCampaign] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [contributionAmount, setContributionAmount] = useState("0.1")
    const [walletBalance, setWalletBalance] = useState(0)
    const activeAccount: any = useActiveAccount()
    console.log("the active wallet is ", activeAccount)
    const contract = getCampaignContract()
    const { mutate: sendTx, data: transactionResult } = useSendTransaction();

    // Check if wallet is connected
    const isLoggedIn = Boolean(activeAccount)

    const { data } = useReadContract({
        contract,
        method: resolveMethod("getCampaigns") as unknown as string,
        params: [],
    })
    const { data: backers } = useReadContract({
        contract,
        method: resolveMethod("getDonators") as unknown as string,
        params: [BigInt(params.id as string)],
    })
    const backersData: string[] = backers ? (backers[0] as string[]) : [];
    console.log("the backers are ", backers)
    // Parse campaigns data from smart contract
    const parsedCampaigns = useMemo(() => {
        if (!data) return []

        return data.map((c: any) => {
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
                amountCollected: toEther(c.amountCollected),
                owner: c.owner,
                smartWallet: c.smartWallet,
                donations: c.donations,
                donators: c.donators,
                category: c.category || "uncategorized",
                goal: toEther(c.target),
                raised: toEther(c.amountCollected),
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

    // Find the campaign by ID when data changes
    useEffect(() => {
        if (!params?.id || !parsedCampaigns.length) return;

        const campaignId = parseInt(params.id as string);
        const matchedCampaign = parsedCampaigns.find(c => c.id === campaignId);

        if (matchedCampaign) {
            setCampaign(matchedCampaign);
        } else {
            // Only show toast if we have campaigns data but can't find the campaign
            if (parsedCampaigns.length > 0) {
                toast({
                    title: "Campaign not found",
                    description: "The campaign you're looking for doesn't exist.",
                    variant: "destructive",
                });
            }
        }
    }, [params?.id, parsedCampaigns, toast]);

    const handleContribute = async (e: React.FormEvent) => {
        e.preventDefault()
        console.log("inside the handle contribute functions")
        try {
            // Get campaign ID from params
            const campaignIdStr = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : '';
            console.log("Campaign ID:", campaignIdStr);

            // Prepare transaction
            const preparedTx = prepareContractCall({
                contract,
                method: "function donateToCampaign(uint256 _id)",
                params: [BigInt(campaignIdStr)],
                value: toWei(contributionAmount)
            });

            console.log("Prepared transaction:", preparedTx);

            // Get the wallet account

            if (!activeAccount) {
                throw new Error("Could not get wallet account");

            }
            // sendTx(preparedTx as any)
            // console.log("the transaction result is ", transactionResult?.transactionHash)
            // Send transaction with proper wallet connection
            const txResult = await sendTransaction({
                transaction: preparedTx,
                account: activeAccount,
            });

            console.log("Transaction sent:", txResult);

            // Wait for confirmation
            const receipt = await waitForReceipt({
                client: preparedTx.client,
                chain: sepolia,
                transactionHash: txResult.transactionHash,
            });
            console.log("Transaction confirmed:", receipt.transactionHash);

            toast({
                title: "Contribution successful!",
                description: `You have successfully contributed ${contributionAmount} ETH to this campaign.`,
            })
        } catch (error) {
            console.error("Transaction error:", error);
            toast({
                title: "Transaction failed",
                description: error instanceof Error ? error.message : "There was an error processing your contribution.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (!campaign) {
        return (
            <div className="container py-12">
                <div className="flex h-[60vh] items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-neutral-800">Loading campaign...</h2>
                        <p className="mt-2 text-neutral-600">Please wait while we fetch the campaign details.</p>
                    </div>
                </div>
            </div>
        )
    }

    const percentFunded = Math.min(100, (campaign.raised / campaign.goal) * 100)

    // Get related campaigns based on category (removed undefined campaigns reference)
    const relatedCampaigns = parsedCampaigns
        .filter((c) => c.category === campaign.category && c.id !== campaign.id)
        .slice(0, 3)

    return (
        <div className="bg-[#f7f7f7] pb-16 pt-8">
            <div className="container">
                {/* Back button */}
                <div className="container flex flex-row justify-between">
                    <Button
                        variant="ghost"
                        className="mb-6 flex items-center gap-2 text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to campaigns
                    </Button>
                    <ConnectionButton />
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main content - 2/3 width on desktop */}
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            {/* Campaign Image */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                <Image
                                    src={campaign.image || "/placeholder-campaign.jpg"}
                                    alt={campaign.title}
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute right-4 top-4 flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast({
                                                title: "Campaign shared",
                                                description: "Campaign link copied to clipboard",
                                            })
                                        }}
                                    >
                                        <Share2 className="h-4 w-4 text-neutral-700" />
                                        <span className="sr-only">Share</span>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white/90"
                                        onClick={() => {
                                            toast({
                                                title: "Campaign saved",
                                                description: "Campaign added to your favorites",
                                            })
                                        }}
                                    >
                                        <Heart className="h-4 w-4 text-neutral-700" />
                                        <span className="sr-only">Save</span>
                                    </Button>
                                </div>
                            </div>

                            {/* Campaign Title & Category */}
                            <div className="mt-6">
                                <div className="flex items-center gap-2">
                                    <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-medium text-neutral-700 capitalize">
                                        {campaign.category}
                                    </span>
                                    <span className="rounded-full bg-[#f3f4f6] px-3 py-1 text-xs font-medium text-neutral-700 capitalize">
                                        {campaign.status}
                                    </span>
                                </div>
                                <h1 className="mt-2 font-bricolage text-3xl font-bold text-neutral-800 md:text-4xl">
                                    {campaign.title}
                                </h1>
                            </div>

                            {/* Campaign Tabs */}
                            <Tabs defaultValue="about" className="mt-8">
                                <TabsList className="bg-[#f3f4f6]">
                                    <TabsTrigger
                                        value="about"
                                        className="text-neutral-700 data-[state=active]:bg-[#4c6ef5]/10 data-[state=active]:text-[#4c6ef5]"
                                    >
                                        About
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="backers"
                                        className="text-neutral-700 data-[state=active]:bg-[#4c6ef5]/10 data-[state=active]:text-[#4c6ef5]"
                                    >
                                        Backers
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="about" className="mt-6">
                                    <div className="space-y-6">
                                        <div className="prose prose-neutral max-w-none text-neutral-700">
                                            <p className="text-lg">{campaign.description}</p>
                                            <p>
                                                This campaign aims to address a significant challenge in our community. Through innovative
                                                solutions and collaborative efforts, we believe we can make a meaningful impact and create
                                                lasting change.
                                            </p>
                                            <br />
                                            <h3 className="text-xl font-bold text-neutral-800">The Problem</h3>
                                            <p>In today&rsquo;s rapidly changing world, we face numerous challenges that require creative thinking
                                                and collective action. Our project focuses on developing sustainable solutions that not only
                                                address immediate needs but also contribute to long-term positive outcomes.</p>
                                            <br />
                                            <h3 className="text-xl font-bold text-neutral-800">Our Solution</h3>
                                            <p>We&rsquo;ve developed a comprehensive approach that leverages cutting-edge technology and
                                                community-driven initiatives. By combining these elements, we can create a scalable and
                                                effective solution that benefits everyone involved.</p>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value="backers" className="mt-6">
                                    <div className="space-y-6">
                                        <p className="text-neutral-700">
                                            This campaign has received support from {backersData?.length || 0} backers so far. Join
                                            them in bringing this project to life!
                                        </p>

                                        <div className="space-y-4">
                                            {backersData && backersData?.length > 0 ? (
                                                backersData?.map((backer: string, index: number) => (
                                                    <div key={index} className="flex items-center justify-between rounded-lg bg-[#f3f4f6] p-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-10 rounded-full bg-neutral-300"></div>
                                                            <div>
                                                                <p className="font-medium text-neutral-800">
                                                                    {backer.slice(0, 6)}...{backer.slice(-4)}
                                                                </p>
                                                                <p className="text-sm text-neutral-600">Backer #{index + 1}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-8 text-neutral-600">
                                                    No backers yet. Be the first to support this campaign!
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </div>

                    {/* Sidebar - 1/3 width on desktop */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {/* Funding Progress Card */}
                            <Card className="border-none bg-[#f3f4f6] shadow-sm">
                                <CardContent className="p-6">
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-2xl font-bold text-neutral-800">{campaign.raised} ETH</h3>
                                                <span className="text-sm text-neutral-600">of {campaign.goal} ETH goal</span>
                                            </div>
                                            <Progress
                                                value={percentFunded}
                                                className="mt-2 h-2 bg-neutral-200 [&>div]:bg-[#4c6ef5]"
                                            />
                                            <div className="mt-2 flex items-center justify-between text-sm">
                                                <span className="text-neutral-700">{percentFunded.toFixed(0)}% Funded</span>
                                                <span className="text-neutral-700">{campaign.daysLeft} days left</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-2 text-sm text-neutral-700">
                                                <Calendar className="h-4 w-4 text-neutral-500" />
                                                <span>
                                                    Campaign ends on {new Date(Date.now() + campaign.daysLeft * 86400000).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-neutral-700">
                                                <User className="h-4 w-4 text-neutral-500" />
                                                <span>Created by {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-neutral-700">
                                                <Clock className="h-4 w-4 text-neutral-500" />
                                                <span>Launched 2 days ago</span>
                                            </div>
                                        </div>

                                        <Separator className="bg-neutral-200" />

                                        {/* Contribution Form */}
                                        <form onSubmit={handleContribute} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="amount" className="text-neutral-800">
                                                    Contribution Amount (ETH)
                                                </Label>
                                                <Input
                                                    id="amount"
                                                    type="number"
                                                    step="0.01"
                                                    min="0.01"
                                                    value={contributionAmount}
                                                    onChange={(e) => setContributionAmount(e.target.value)}
                                                    className="border-neutral-300 bg-white focus:border-[#4c6ef5] focus:ring-[#4c6ef5]"
                                                    required
                                                />
                                            </div>

                                            <Button
                                                type="submit"
                                                className="w-full bg-[#4c6ef5] hover:bg-[#4c6ef5]/90"
                                                disabled={isLoading || (campaign.raised >= campaign.goal)}
                                            >
                                                {isLoading ? "Processing..." : (campaign.raised >= campaign.goal) ? "Campaign Completed 🫡" : "Contribute now "}
                                            </Button>
                                        </form>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Creator Card */}
                            <Card className="mt-6 border-none bg-[#f3f4f6] shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-lg text-neutral-800">About the Creator</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-12 rounded-full bg-neutral-300"></div>
                                        <div>
                                            <p className="font-medium text-neutral-800">Creator Wallet</p>
                                            <p className="text-sm text-neutral-600">
                                                {campaign.creator.slice(0, 6)}...{campaign.creator.slice(-4)}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-neutral-700">
                                        Experienced creator with a passion for innovative solutions. Committed to transparency and
                                        delivering value to supporters.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Related Campaigns */}
                            {relatedCampaigns.length > 0 && (
                                <Card className="mt-6 border-none bg-[#f3f4f6] shadow-sm">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-neutral-800">Similar Campaigns</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            {relatedCampaigns.map((relatedCampaign) => (
                                                <div
                                                    key={relatedCampaign.id}
                                                    className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-neutral-200/50"
                                                    onClick={() => router.push(`/campaigns/${relatedCampaign.id}`)}
                                                >
                                                    <div className="relative h-16 w-24 overflow-hidden rounded">
                                                        <Image
                                                            src={relatedCampaign.image || "/placeholder-campaign.jpg"}
                                                            alt={relatedCampaign.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-neutral-800 line-clamp-1">{relatedCampaign.title}</p>
                                                        <p className="text-sm text-neutral-600">{relatedCampaign.raised} ETH raised</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    )
}