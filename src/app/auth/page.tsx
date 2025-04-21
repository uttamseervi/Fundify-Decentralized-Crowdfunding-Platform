"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { ConnectButton, useActiveAccount } from "thirdweb/react"
import { client } from "../client"
import { useDispatch } from "react-redux"
import { setWalletConnectionStatus } from "@/store/reducers/userReducer"

export default function AuthPage() {
  const router = useRouter()
  const dispatch = useDispatch()
  const activeAccount = useActiveAccount()
  const [walletAddress, setWalletAddress] = useState("")

  // Save wallet address once connected
  useEffect(() => {
    if (activeAccount?.address) {
      setWalletAddress(activeAccount.address)
      localStorage.setItem("walletAddress", activeAccount.address)
    }
  }, [activeAccount])
  useEffect(() => {
    if (activeAccount?.address) {
      dispatch(setWalletConnectionStatus(true))
      router.push("/dashboard")
    }
  }, [activeAccount])

  return (
    <div className="container flex min-h-[80vh] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="font-playfair text-2xl">Welcome to Fundify</CardTitle>
            <CardDescription>Connect your wallet to continue</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center">
            <div className="mb-6 rounded-full bg-gray-100 p-6">
              <Wallet className="h-12 w-12" />
            </div>
            <ConnectButton client={client} />
          </CardContent>

          <CardFooter className="flex flex-col text-center text-sm text-gray-500">
            <p>By connecting your wallet, you agree to our</p>
            <p>
              <a href="#" className="underline hover:text-black">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-black">
                Privacy Policy
              </a>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
