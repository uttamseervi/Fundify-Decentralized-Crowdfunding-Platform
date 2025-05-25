'use client'
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Wallet, Copy } from "lucide-react"
import { useActiveWallet } from "thirdweb/react"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    bio: "Blockchain enthusiast and tech entrepreneur. Passionate about decentralized applications and community-driven projects.",
  })


  const activeWallet = useActiveWallet()
  const smartWallet = activeWallet?.getAccount()?.address;
  const adminWallet = activeWallet?.getAdminAccount?.()?.address;


  const handleProfileChange = (e: any) => {
    const { name, value } = e.target
    setProfileData((prev) => ({ ...prev, [name]: value }))
  }

  const copyToClipboard = async (text: any, label: any) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      })
    } catch (error) {
      console.error('Failed to copy:', error)
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      })
    }
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)

    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000))
      // const response = await axios.post('/api/profile', profileData)

      toast({
        title: "Profile updated",
        description: "Your profile information has been saved.",
      })
    } catch (error) {
      console.error('Error saving profile:', error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your profile information.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full"
      >
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information and public profile.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wallet Information */}
            <div className="space-y-4 rounded-lg border bg-muted/20 p-4">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-muted-foreground" />
                <Label className="text-sm font-semibold">Wallet Information</Label>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Smart Wallet Address</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={smartWallet || "Not connected"}
                      readOnly
                      className="font-mono text-sm bg-background"
                    />
                    {smartWallet && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(smartWallet, "Smart wallet address")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Admin Wallet Address</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={adminWallet || "Not available"}
                      readOnly
                      className="font-mono text-sm bg-background"
                    />
                    {adminWallet && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(adminWallet, "Admin wallet address")}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                placeholder="Enter your display name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                placeholder="Enter your email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                value={profileData.bio}
                onChange={handleProfileChange}
                placeholder="Write a short bio about yourself..."
              />
              <p className="text-xs text-muted-foreground">
                Write a short bio that describes you and your projects.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveProfile} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}