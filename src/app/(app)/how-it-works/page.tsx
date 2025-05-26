"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Zap, BarChart, Users, Globe, Bolt, Database, ArrowBigLeft, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function HowItWorksPage() {
  const router = useRouter()
  const features = [
    {
      icon: <Shield className="h-10 w-10 text-neutral-700" />,
      title: "Trustless Transactions",
      description:
        "Smart contracts automatically execute funding transfers when conditions are met, eliminating the need for intermediaries.",
    },
    {
      icon: <Lock className="h-10 w-10 text-neutral-700" />,
      title: "Immutable Records",
      description:
        "All campaign details and transactions are permanently recorded on the blockchain, ensuring complete transparency.",
    },
    {
      icon: <Zap className="h-10 w-10 text-neutral-700" />,
      title: "Instant Settlement",
      description:
        "Funds are transferred directly between wallets with no delays or holds from traditional payment processors.",
    },
    {
      icon: <BarChart className="h-10 w-10 text-neutral-700" />,
      title: "Real-time Tracking",
      description:
        "Monitor funding progress and campaign milestones with verifiable on-chain data that cannot be manipulated.",
    },
    {
      icon: <Users className="h-10 w-10 text-neutral-700" />,
      title: "Community Governance",
      description:
        "Backers can participate in key decisions about funded projects through decentralized voting mechanisms.",
    },
    {
      icon: <Globe className="h-10 w-10 text-neutral-700" />,
      title: "Global Accessibility",
      description:
        "Anyone with an internet connection and crypto wallet can participate, regardless of location or banking status.",
    },
    {
      icon: <Bolt className="h-10 w-10 text-neutral-700" />,
      title: "Gasless Transactions",
      description:
        "If you use our smart wallet, a relayer pays your gas—no ETH required! Your experience is completely fee-free on-chain.",
    },
    {
      icon: <Database className="h-10 w-10 text-neutral-700" />,
      title: "Standard EOA Fees",
      description:
        "Using a regular wallet (EOA) requires you to pay the network gas fees for each transaction.",
    },
  ]

  const steps = [
    {
      step: "01",
      title: "Connect Your Wallet",
      description: "Link your cryptocurrency wallet (EOA or Smart Wallet) to create or support campaigns securely.",
    },
    {
      step: "02",
      title: "Gas Payment",
      description:
        "EOA users pay standard network gas fees. Smart Wallet users enjoy gasless UX—our relayer covers the fees for you.",
    },
    {
      step: "03",
      title: "Create or Fund",
      description: "Launch your own campaign or browse existing projects to support with cryptocurrency.",
    },
    {
      step: "04",
      title: "Transparent Execution",
      description:
        "Smart contracts automatically handle funds based on predefined milestones and conditions.",
    },
  ]

  return (
    <div className="bg-[#f7f7f7]">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2 text-neutral-700 hover:bg-neutral-200/70 hover:text-neutral-900"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Button>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="font-bricolage text-4xl font-bold tracking-tight text-neutral-800 md:text-5xl">
              Decentralized Crowdfunding, Reimagined
            </h1>
            <p className="mt-6 text-lg text-neutral-600 md:text-xl">
              A transparent, trustless platform that puts creators and backers in direct control.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="bg-[#eaeaea] py-16">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="rounded-lg bg-[#f3f4f6] p-8 shadow-sm"
          >
            <h2 className="font-bricolage text-2xl font-bold text-neutral-800 md:text-3xl">Our Mission</h2>
            <p className="mt-4 text-neutral-700">
              This is a fully decentralized crowdfunding platform designed to eliminate trust barriers. Campaigns are transparent, traceable, and censorship-resistant. All transactions are secured on-chain, ensuring end-to-end accountability for both backers and creators. No intermediaries. No centralized control. Just pure community-driven funding.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <h2 className="font-bricolage text-3xl font-bold text-neutral-800">How It Works</h2>
            <p className="mt-4 text-neutral-600">The decentralized approach to bringing ideas to life</p>
          </motion.div>

          <div className="grid gap-8 mt-8 md:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="flex flex-col rounded-lg bg-[#f3f4f6] p-8 shadow-sm"
              >
                <div className="mb-4 text-4xl font-light text-neutral-400">{step.step}</div>
                <h3 className="mb-2 text-xl font-bold text-neutral-800">{step.title}</h3>
                <p className="text-neutral-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-bricolage text-3xl font-bold text-neutral-800">Key Features</h2>
            <p className="mt-4 text-neutral-600">What makes our decentralized platform different</p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full border-none bg-[#f3f4f6] shadow-sm">
                  <CardHeader>
                    <div className="mb-4 rounded-full bg-[#f7f7f7] p-3 w-fit">{feature.icon}</div>
                    <CardTitle className="text-xl text-neutral-800">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-neutral-600 text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-[#eaeaea] py-16">
        <div className="container max-w-4xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-bricolage text-3xl font-bold text-neutral-800">Frequently Asked Questions</h2>
            <p className="mt-4 text-neutral-600">Common questions about our decentralized platform</p>
          </motion.div>

          <div className="space-y-6">
            <Card className="border-none bg-[#f3f4f6] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-neutral-800">Why do I pay gas fees?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  If you connect with a standard wallet (EOA), you cover the network transaction fees (gas) directly from your ETH balance. Transactions won’t proceed without enough ETH.
                </p>
              </CardContent>
            </Card>
            <Card className="border-none bg-[#f3f4f6] shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-neutral-800">What about gasless transactions?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-neutral-600">
                  Connecting via our Smart Wallet leverages meta-transactions (EIP-4337) where a relayer pays the gas on your behalf via <code>handleOps</code>. You don’t need ETH; the relayer is reimbursed off-chain or via token deductions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 text-center">
        <div className="container max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-bricolage text-3xl font-bold text-neutral-800 mb-4">Ready to Join the Revolution?</h2>
            <p className="text-neutral-600 mb-8">
              Experience the future of crowdfunding—with or without ETH in your wallet.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/campaigns" className="rounded-md bg-[#4c6ef5] px-6 py-3 font-medium text-white shadow-sm hover:bg-[#4c6ef5]/90">
                Explore Campaigns
              </Link>
              <Link href="/auth" className="rounded-md bg-neutral-700 px-6 py-3 font-medium text-white shadow-sm hover:bg-neutral-600">
                Connect Wallet
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}