import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import Link from "next/link"
import type { Campaign } from "@/lib/types"

interface CampaignCardProps {
  campaign: Campaign
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const percentFunded = Math.min(100, (campaign.raised / campaign.goal) * 100)

  return (
    <Card className="h-full overflow-hidden transition-all hover:shadow-md bg-[#f3f4f6] border-none">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={campaign.image || ""}
          alt={campaign.title}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <div className="absolute right-2 top-2 rounded-full bg-[#f3f4f6] px-2 py-1 text-xs font-medium text-neutral-700">
          {campaign.category}
        </div>
      </div>

      <CardContent className="p-4 pb-0">
        <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
          <h3 className="line-clamp-1 text-lg font-bold text-neutral-800">{campaign.title}</h3>
        </Link>
        <p className="line-clamp-2 text-sm text-neutral-600">{campaign.description}</p>
      </CardContent>

      <CardContent className="p-4 pt-2">
        <div className="mb-2 mt-4">
          <div className="mb-1 flex justify-between text-sm">
            <span className="text-neutral-700">{percentFunded.toFixed(0)}% Funded</span>
            <span className="text-neutral-700">{campaign.raised} ETH raised</span>
          </div>
          <Progress value={percentFunded} className="h-2 bg-neutral-200" />
        </div>

        <div className="mt-4 flex justify-between text-sm">
          <div>
            <p className="text-neutral-500">Goal</p>
            <p className="font-medium text-neutral-700">{campaign.goal} ETH</p>
          </div>
          <div className="text-right">
            <p className="text-neutral-500">Time Left</p>
            <p className="font-medium text-neutral-700">{campaign.daysLeft} days</p>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t border-neutral-200 p-4 text-xs text-neutral-500">
        <div className="flex items-center">
          <span>By </span>
          <span className="ml-1 font-mono">{campaign.creator}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
