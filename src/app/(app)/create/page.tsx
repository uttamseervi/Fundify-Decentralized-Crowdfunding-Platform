"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ArrowBigLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useActiveWallet, useSendTransaction } from "thirdweb/react"
import { getCampaignContract, uploadImageToIPFS } from "@/utils/thirdweb"
import { prepareContractCall,sendTransaction, waitForReceipt } from "thirdweb"
import { useAutoConnect } from "thirdweb/react"
import { createWallet } from "thirdweb/wallets"
import { client } from "@/app/client"
// import 
export default function CreateCampaignPage() {
  const router = useRouter()
  const { toast } = useToast()

  const wallets = [createWallet("io.metamask")];
  const activeWallet = useActiveWallet()
  const contract = getCampaignContract()
  const { data: autoConnected } = useAutoConnect({
    client,
    wallets
  })
  console.log("the auto connect is ", autoConnected)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState<Date>()
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goal: "",
    category: "",
    ipfsHash: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!date) {
      toast({
        title: "Error",
        description: "Please select a deadline for your campaign",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    try {
      // Validate inputs
      const goalAmount = parseFloat(formData.goal)
      if (isNaN(goalAmount) || goalAmount <= 0) {
        toast({
          title: "Error",
          description: "Please enter a valid goal amount",
          variant: "destructive"
        })
        setIsLoading(false)
        return
      }

      // Upload image to IPFS
      let ipfsUrl = ""
      if (imageFile) {
        ipfsUrl = await uploadImageToIPFS(imageFile)
        console.log("the image url is ", ipfsUrl)
      }

      // Prepare contract call parameters
      const deadlineTimestamp = Math.floor(date.getTime() / 1000)
      const targetAmountInWei = BigInt(Math.floor(goalAmount * 1e18)) // Convert ETH to Wei

      // Verify wallet is connected
      // if (!activeWallet) {
      //   toast({
      //     title: "Error",
      //     description: "Please connect your wallet first",
      //     variant: "destructive"
      //   })
      //   setIsLoading(false)
      //   return
      // }
      // // Prepare the contract call for creating a campaign
      // console.log("preparing the transaction call");

      // const transaction = prepareContractCall({
      //   contract,
      //   method: "function createCampaign(address owner, address wallet, string title, string description, uint256 goal, uint256 deadline, string image)",
      //   params: [
      //     activeWallet.getAccount()?.address || "",
      //     activeWallet.getAccount()?.address || "",
      //     formData.title,
      //     formData.description,
      //     BigInt(targetAmountInWei),
      //     BigInt(deadlineTimestamp),
      //     ipfsUrl,  // 🚨 We'll fix the URL in a sec
      //   ],
      // });
      // console.log("the transaction prep is ", transaction)
      // await sendTx(transaction)
      // console.log("the transaction is ", transactionResult?.transactionHash);




      // 👇 Prepare the transaction
      const preparedTx = prepareContractCall({
        contract,
        method: "function createCampaign(address owner, address wallet, string title, string description, uint256 goal, uint256 deadline, string image)",
        params: [
          activeWallet.getAccount()?.address || "",
          activeWallet.getAccount()?.address || "",
          formData.title,
          formData.description,
          BigInt(targetAmountInWei),
          BigInt(deadlineTimestamp),
          ipfsUrl,
        ],
      });

      console.log("✅ Prepared Transaction:", preparedTx);

      // 👇 Send the transaction using Thirdweb's sendTransaction helper
      const txResult = await sendTransaction({
        transaction: preparedTx,
        account: activeWallet.getAccount(),
        chain: preparedTx.chain,
        client: preparedTx.client,
      });

      console.log("📤 Transaction sent! Hash:", txResult.transactionHash);

      // 👇 Wait for confirmation
      const receipt = await waitForReceipt({
        client: preparedTx.client,
        chain: preparedTx.chain,
        transactionHash: txResult.transactionHash,
      });

      console.log("🎉 Transaction Confirmed! Receipt:", receipt);

      toast({
        title: "Success",
        description: "Campaign created successfully!",
      })

      // Redirect to dashboard
      // router.push("/dashboard")
    } catch (error: any) {
      console.error("Error creating campaign:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create campaign",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-3xl h-[70vh] py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link href="/dashboard" className="p-2 m-2 hover:underline">
          <div className="flex flex-row items-center gap-2">
            <ArrowBigLeft /> <h4>Go back to dashboard</h4>
          </div>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle className="font-playfair text-2xl">Create a New Campaign</CardTitle>
            <CardDescription>Fill in the details to launch your crowdfunding campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Campaign Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a compelling title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your campaign in detail"
                  value={formData.description}
                  onChange={handleChange}
                  rows={5}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="goal">Funding Goal (ETH)</Label>
                  <Input
                    id="goal"
                    name="goal"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={formData.goal}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="art">Art</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="environment">Environment</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Campaign Deadline</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Select a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(d) => d < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Campaign Image</Label>
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Campaign"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}