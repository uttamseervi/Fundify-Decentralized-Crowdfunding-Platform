'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Wallet } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import ConnectionButton from "./connection-button"
import { useActiveAccount } from "thirdweb/react"
import Link from "next/link"
import { ArrowBigRight } from "lucide-react"

export default function AuthPage() {
  const [tab, setTab] = useState("signin")
  const activeAccount = useActiveAccount()

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col justify-center items-center py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Tabs value={tab} onValueChange={setTab} className="space-y-6">
          <TabsList className="justify-center mb-6">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <div className="rounded-xl bg-gray-100 dark:bg-gray-900 p-8 shadow-lg space-y-6 text-center">
              <div className="flex justify-center">
                <Wallet className="h-12 w-12 text-gray-600 dark:text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold">Welcome to Fundify</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Sign in to continue with your wallet</p>
              <ConnectionButton type="signin" />
              <p className="text-xs text-gray-500 mt-4">
                By signing in, you agree to our{" "}
                <a href="#" className="underline hover:text-black dark:hover:text-white">Terms of Service</a> and{" "}
                <a href="#" className="underline hover:text-black dark:hover:text-white">Privacy Policy</a>.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="signup">
            <div className="rounded-xl bg-gray-100 dark:bg-gray-900 p-8 shadow-lg space-y-6 text-center">
              <div className="flex justify-center">
                <Wallet className="h-12 w-12 text-gray-600 dark:text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold">Create an Account</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Register with your wallet to get started</p>
              <ConnectionButton type="signup" />
              <p className="text-xs text-gray-500 mt-4">
                By signing up, you agree to our{" "}
                <a href="#" className="underline hover:text-black dark:hover:text-white">Terms of Service</a> and{" "}
                <a href="#" className="underline hover:text-black dark:hover:text-white">Privacy Policy</a>.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {activeAccount && (
          <Link href="/dashboard">
            <div className="mt-6 flex items-center justify-center text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition">
              Go to Dashboard <ArrowBigRight className="ml-2" />
            </div>
          </Link>
        )}
      </motion.div>
    </div>
  )
}
