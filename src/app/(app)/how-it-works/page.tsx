"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Zap, BarChart, Users, Globe, ArrowBigLeft } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

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
  ]

  return (
    <div className="bg-[#f7f7f7]">
        <Link href="/" className="p-2 m-2 hover:underline">
          <div className="flex flex-row hover:underline ml-8">
            <span><ArrowBigLeft /> </span>
            <h4>Go back to home</h4>
          </div>
        </Link>
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

      {/* Mission Statement */}
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
              This is a fully decentralized crowdfunding platform designed to eliminate trust barriers. Campaigns are
              transparent, traceable, and censorship-resistant. All transactions are secured on-chain, ensuring
              end-to-end accountability for both backers and creators. No intermediaries. No centralized control. Just
              pure community-driven funding.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Steps */}
      <section className="py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mb-12 text-center"
          >
            <h2 className="font-bricolage text-3xl font-bold text-neutral-800">How It Works</h2>
            <p className="mt-4 text-neutral-600">The decentralized approach to bringing ideas to life</p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Connect Your Wallet",
                description: "Link your cryptocurrency wallet to create or support campaigns securely.",
              },
              {
                step: "02",
                title: "Create or Fund",
                description: "Launch your own campaign or browse existing projects to support with cryptocurrency.",
              },
              {
                step: "03",
                title: "Transparent Execution",
                description:
                  "Smart contracts automatically handle funds based on predefined milestones and conditions.",
              },
            ].map((step, index) => (
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
      <section className="bg-[#eaeaea] py-16">
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
      <section className="py-16">
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
            {[
              {
                question: "What cryptocurrencies can I use?",
                answer:
                  "Our platform currently supports Ethereum (ETH) and ERC-20 tokens. We plan to expand to additional blockchains in the future.",
              },
              {
                question: "How are funds protected?",
                answer:
                  "All funds are held in smart contracts that execute based on predefined conditions. Neither we nor campaign creators can access funds until those conditions are met.",
              },
              {
                question: "What happens if a campaign doesn't reach its goal?",
                answer:
                  "If a campaign doesn't reach its funding goal by the deadline, all contributions are automatically returned to the respective backers.",
              },
              {
                question: "Are there any fees?",
                answer:
                  "The platform charges a minimal 2% fee on successfully funded campaigns to cover operational costs. Standard network transaction fees also apply.",
              },
              {
                question: "How is this different from traditional crowdfunding?",
                answer:
                  "Traditional platforms act as intermediaries, holding funds and taking higher fees. Our decentralized approach connects creators and backers directly through smart contracts, offering greater transparency, lower fees, and automated accountability.",
              },
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="border-none bg-[#f3f4f6] shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg text-neutral-800">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-neutral-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-neutral-800 py-16 text-white">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="font-bricolage text-3xl font-bold md:text-4xl">Ready to Join the Revolution?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-neutral-300">
              Experience the future of crowdfunding with complete transparency, security, and control.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <motion.a
                href="/campaigns"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-md bg-[#4c6ef5] px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-[#4c6ef5]/90"
              >
                Explore Campaigns
              </motion.a>
              <motion.a
                href="/auth"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="rounded-md bg-neutral-700 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-neutral-600"
              >
                Connect Wallet
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
