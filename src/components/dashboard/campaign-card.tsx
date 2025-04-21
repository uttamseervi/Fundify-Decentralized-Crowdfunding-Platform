"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, ExternalLink } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import type { Campaign } from "@/lib/types"

interface CampaignCardProps {
  campaign: Campaign
}

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)
  const percentFunded = Math.min(100, (campaign.raised / campaign.goal) * 100)

  const handleDelete = () => {
    toast({
      title: "Campaign deleted",
      description: "The campaign has been successfully deleted.",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-100/80"
      case "completed":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      case "expired":
        return "bg-amber-100 text-amber-800 hover:bg-amber-100/80"
      default:
        return "bg-neutral-100 text-neutral-800 hover:bg-neutral-100/80"
    }
  }

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden border-none bg-[#f3f4f6] shadow-sm">
        <div className="relative">
          <div className="aspect-video overflow-hidden">
            <Image
              src={campaign.image || "/placeholder.svg?height=300&width=600"}
              alt={campaign.title}
              width={600}
              height={300}
              className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>

          <Badge variant="secondary" className={`absolute right-2 top-2 capitalize ${getStatusColor(campaign.status)}`}>
            {campaign.status}
          </Badge>

          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute right-2 top-2 z-10 flex gap-1"
            >
              <Button asChild size="icon" variant="secondary" className="h-8 w-8 bg-[#f7f7f7]/90">
                <Link href={`/dashboard/campaigns/edit/${campaign.id}`}>
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Edit</span>
                </Link>
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="icon" variant="secondary" className="h-8 w-8 bg-[#f7f7f7]/90">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#f7f7f7]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the campaign and remove it from our
                      servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-neutral-300 text-neutral-700">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-[#4c6ef5] hover:bg-[#4c6ef5]/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Button asChild size="icon" variant="secondary" className="h-8 w-8 bg-[#f7f7f7]/90">
                <Link href={`/campaigns/${campaign.id}`}>
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">View</span>
                </Link>
              </Button>
            </motion.div>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="line-clamp-1 text-lg font-bold text-neutral-800">{campaign.title}</h3>
          <p className="line-clamp-2 mt-1 text-sm text-neutral-600">{campaign.description}</p>

          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-700">{percentFunded.toFixed(0)}% Funded</span>
              <span className="text-neutral-700">{campaign.raised} ETH raised</span>
            </div>
            <Progress value={percentFunded} className="h-2 bg-neutral-200 [&>div]:bg-[#4c6ef5]" />
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

        <CardFooter className="border-t border-neutral-200 p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-xs text-neutral-500">Created {new Date().toLocaleDateString()}</div>
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900"
            >
              <Link href={`/campaigns/${campaign.id}`}>
                View Details
                <ExternalLink className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
