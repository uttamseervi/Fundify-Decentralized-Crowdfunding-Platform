"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, User, Clock, Share2, Flag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { campaigns } from "@/lib/data"
import CampaignCard from "@/components/campaign-card"
import { getCampaignContract } from "@/utils/thirdweb"
import { prepareContractCall, resolveMethod } from "thirdweb";
import { toWei,toEther } from "thirdweb/utils";
import { useActiveWallet, useReadContract } from "thirdweb/react"

export default function CampaignDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [campaign, setCampaign] = useState<any>()
    const [isLoading, setIsLoading] = useState(false)
    const [contributionAmount, setContributionAmount] = useState("0.1")
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const contract = getCampaignContract()
    const activeWallet = useActiveWallet()

    useEffect(() => {
        if (!activeWallet) {
            setIsLoading(false);
        }
    }, [activeWallet, router,])
    const { data } = useReadContract({
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
                amountCollected: toEther(c.amountCollected),
                owner: c.owner,
                smartWallet: c.smartWallet,
                donations: c.donations,
                donators: c.donators,
                category: c.category || "uncategorized", // Assuming your smart contract includes category
                // Add required Campaign fields
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
    useEffect(() => {
        if (!params?.id || !parsedCampaigns.length) return;

        const campaignId = parseInt(params.id as string);
        const matchedCampaign = parsedCampaigns.find(c => c.id === campaignId);

        if (matchedCampaign) {
            setCampaign(matchedCampaign);
        } else {
            toast({
                title: "Campaign not found",
                description: "The campaign you're looking for doesn't exist.",
                variant: "destructive",
            });
        }
    }, [params?.id, parsedCampaigns]);



    const handleContribute = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoggedIn) {
            toast({
                title: "Wallet not connected",
                description: "Please connect your wallet to contribute to this campaign.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        toast({
            title: "Contribution successful!",
            description: `You have successfully contributed ${contributionAmount} ETH to this campaign.`,
        })

        setIsLoading(false)
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

    // Get related campaigns (excluding current one)
    const relatedCampaigns = campaigns.filter((c) => c.category === campaign.category && c.id !== campaign.id).slice(0, 3)

    return (
        <div className="bg-[#f7f7f7] pb-16 pt-8">
            <div className="container">
                {/* Back button */}
                <Button
                    variant="ghost"
                    className="mb-6 flex items-center gap-2 text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to campaigns
                </Button>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main content - 2/3 width on desktop */}
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            {/* Campaign Image */}
                            <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                <Image
                                    src={campaign.image || ""}
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
                                        value="updates"
                                        className="text-neutral-700 data-[state=active]:bg-[#4c6ef5]/10 data-[state=active]:text-[#4c6ef5]"
                                    >
                                        Updates
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="backers"
                                        className="text-neutral-700 data-[state=active]:bg-[#4c6ef5]/10 data-[state=active]:text-[#4c6ef5]"
                                    >
                                        Backers
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="comments"
                                        className="text-neutral-700 data-[state=active]:bg-[#4c6ef5]/10 data-[state=active]:text-[#4c6ef5]"
                                    >
                                        Comments
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
                                            <h3 className="text-xl font-bold text-neutral-800">The Problem</h3>
                                            <p>In today&rsquo;s rapidly changing world, we face numerous challenges that require creative thinking
                                                and collective action. Our project focuses on developing sustainable solutions that not only
                                                address immediate needs but also contribute to long-term positive outcomes.</p>
                                            <h3 className="text-xl font-bold text-neutral-800">Our Solution</h3>
                                            <p>We&rsquo;ve developed a comprehensive approach that leverages cutting-edge technology and
                                                community-driven initiatives. By combining these elements, we can create a scalable and
                                                effective solution that benefits everyone involved.</p>
                                            <h3 className="text-xl font-bold text-neutral-800">How Funds Will Be Used</h3>
                                            <ul>
                                                <li>Research and development: 40%</li>
                                                <li>Implementation and deployment: 30%</li>
                                                <li>Community outreach and education: 20%</li>
                                                <li>Administrative costs: 10%</li>
                                            </ul>
                                            <h3 className="text-xl font-bold text-neutral-800">Timeline</h3>
                                            <p>
                                                Our project will be implemented in phases, with regular updates provided to all supporters.
                                                We&rsquo;re committed to transparency and accountability throughout the process.
                                            </p>
                                        </div>

                                        <Separator className="bg-neutral-200" />

                                        <div>
                                            <h3 className="text-xl font-bold text-neutral-800">Risks & Challenges</h3>
                                            <p className="mt-2 text-neutral-700">
                                                As with any ambitious project, there are potential challenges we may face. These include
                                                regulatory hurdles, technical complexities, and market adoption. However, our experienced team
                                                is well-equipped to navigate these challenges and adapt our approach as needed.
                                            </p>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="updates" className="mt-6">
                                    <div className="space-y-6">
                                        <Card className="border-none bg-[#f3f4f6] shadow-sm">
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-neutral-800">First milestone reached!</CardTitle>
                                                        <CardDescription className="text-neutral-600">Posted 3 days ago</CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-neutral-700">
                                                    We&rsquo;re excited to announce that we&rsquo;ve reached our first milestone! Thanks to your generous
                                                    support, we&rsquo;ve been able to complete the initial phase of our project ahead of schedule.
                                                </p>
                                                <p className="mt-4 text-neutral-700">
                                                    Next steps include finalizing our prototype and beginning user testing. We&rsquo;ll keep you updated
                                                    on our progress.
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card className="border-none bg-[#f3f4f6] shadow-sm">
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <CardTitle className="text-neutral-800">Campaign launched</CardTitle>
                                                        <CardDescription className="text-neutral-600">Posted 2 weeks ago</CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-neutral-700">
                                                    Today marks the official launch of our campaign! We&apos;re thrilled to embark on this journey and
                                                    grateful for your interest and support.
                                                </p>
                                                <p className="mt-4 text-neutral-700">
                                                    Our team has been working tirelessly to prepare for this moment, and we&apos;re confident that
                                                    together, we can achieve our goals and make a real difference.
                                                </p>
                                            </CardContent>
                                        </Card>

                                    </div>
                                </TabsContent>

                                <TabsContent value="backers" className="mt-6">
                                    <div className="space-y-6">
                                        <p className="text-neutral-700">
                                            This campaign has received support from {Math.floor(Math.random() * 30) + 10} backers so far. Join
                                            them in bringing this project to life!
                                        </p>

                                        <div className="space-y-4">
                                            {Array.from({ length: 5 }).map((_, index) => (
                                                <div key={index} className="flex items-center justify-between rounded-lg bg-[#f3f4f6] p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-neutral-300"></div>
                                                        <div>
                                                            <p className="font-medium text-neutral-800">
                                                                {`0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`}
                                                            </p>
                                                            <p className="text-sm text-neutral-600">{Math.floor(Math.random() * 5) + 1} days ago</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-medium text-neutral-800">{(Math.random() * 2 + 0.1).toFixed(2)} ETH</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="comments" className="mt-6">
                                    <div className="space-y-6">
                                        <p className="text-neutral-700">
                                            Join the conversation about this campaign. Share your thoughts, ask questions, and connect with
                                            other supporters.
                                        </p>

                                        <div className="rounded-lg border border-neutral-200 bg-[#f3f4f6] p-4">
                                            <textarea
                                                className="w-full resize-none rounded-md border-none bg-white p-3 text-neutral-800 focus:ring-2 focus:ring-[#4c6ef5]"
                                                placeholder="Write a comment..."
                                                rows={3}
                                            ></textarea>
                                            <div className="mt-2 flex justify-end">
                                                <Button className="bg-[#4c6ef5] hover:bg-[#4c6ef5]/90">Post Comment</Button>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="space-y-4">
                                                <div className="rounded-lg bg-white p-4 shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-neutral-300"></div>
                                                        <div>
                                                            <p className="font-medium text-neutral-800">Alex Thompson</p>
                                                            <p className="text-sm text-neutral-600">2 days ago</p>
                                                        </div>
                                                    </div>
                                                    <p className="mt-3 text-neutral-700">
                                                        This is exactly the kind of innovation we need right now. I&apos;m excited to see how this
                                                        project develops!
                                                    </p>

                                                </div>

                                                <div className="rounded-lg bg-white p-4 shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 rounded-full bg-neutral-300"></div>
                                                        <div>
                                                            <p className="font-medium text-neutral-800">Jamie Rodriguez</p>
                                                            <p className="text-sm text-neutral-600">5 days ago</p>
                                                        </div>
                                                    </div>
                                                    <p className="mt-3 text-neutral-700">
                                                        I have a question about the implementation timeline. Will there be a beta testing phase
                                                        before the full launch?
                                                    </p>
                                                    <div className="mt-4 rounded-lg bg-[#f3f4f6] p-3">
                                                        <p className="text-sm text-neutral-600">
                                                            <span className="font-medium text-neutral-800">Creator Response:</span> Yes, we&apos;re
                                                            planning a beta testing phase in month 3 of our timeline. We&apos;ll be reaching out to early
                                                            supporters for participation!
                                                        </p>

                                                    </div>
                                                </div>
                                            </div>
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
                                                <span>Created by {campaign.creator}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-neutral-700">
                                                <Clock className="h-4 w-4 text-neutral-500" />
                                                <span>Launched {Math.floor(Math.random() * 30) + 5} days ago</span>
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

                                            <Button type="submit" className="w-full bg-[#4c6ef5] hover:bg-[#4c6ef5]/90" disabled={isLoading}>
                                                {isLoading ? "Processing..." : "Contribute Now"}
                                            </Button>

                                            {!isLoggedIn && (
                                                <p className="text-center text-sm text-neutral-600">
                                                    <Link href="/auth" className="text-[#4c6ef5] hover:underline">
                                                        Connect your wallet
                                                    </Link>{" "}
                                                    to contribute to this campaign
                                                </p>
                                            )}
                                        </form>

                                        <div className="flex items-center justify-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-neutral-300 text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900"
                                                onClick={() => {
                                                    toast({
                                                        title: "Campaign reported",
                                                        description: "Thank you for your feedback. We'll review this campaign.",
                                                    })
                                                }}
                                            >
                                                <Flag className="mr-2 h-4 w-4" />
                                                Report Campaign
                                            </Button>
                                        </div>
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
                                            <p className="font-medium text-neutral-800">Creator Name</p>
                                            <p className="text-sm text-neutral-600">
                                                {campaign.creator} · {Math.floor(Math.random() * 5) + 1} campaigns
                                            </p>
                                        </div>
                                    </div>
                                    <p className="mt-4 text-sm text-neutral-700">
                                        Experienced creator with a passion for innovative solutions. Committed to transparency and
                                        delivering value to supporters.
                                    </p>
                                    <Button
                                        variant="outline"
                                        className="mt-4 w-full border-neutral-300 text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900"
                                        onClick={() => {
                                            toast({
                                                title: "Message sent",
                                                description: "Your message has been sent to the creator.",
                                            })
                                        }}
                                    >
                                        Contact Creator
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>

                {/* Related Campaigns */}
                <div className="mt-16">
                    <h2 className="mb-6 font-bricolage text-2xl font-bold text-neutral-800">Similar Campaigns</h2>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {relatedCampaigns.map((relatedCampaign) => (
                            <motion.div
                                key={relatedCampaign.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <CampaignCard campaign={relatedCampaign} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
