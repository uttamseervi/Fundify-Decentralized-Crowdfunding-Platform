"use client"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Lightbulb, Users, Rocket } from "lucide-react"
import Image from "next/image"
import placeholder from "../public/placeholder.svg"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { useEffect } from "react"
import { useRouter } from "next/router"
export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {

    if (router.pathname === '/') {
      window.location.reload();
    }
  }, [router.pathname]);
  return (
    <>
      <Navbar />
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden bg-[#f3f4f6] px-4 py-20 text-center md:py-32">
          {/* Glowing, Fast-Animated Blobs */}
          <motion.div
            className="absolute top-10 left-[-25%] w-96 h-96 rounded-full bg-gradient-to-tr from-[#4c6ef5] to-[#3bc9db] opacity-40 filter blur-3xl shadow-[0_0_50px_rgba(76,110,245,0.6)]"
            animate={{ rotate: 360, scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          />

          <motion.div
            className="absolute bottom-0 right-[-15%] w-[550px] h-[550px] rounded-full bg-gradient-to-br from-[#845ef7] to-[#5c7cfa] opacity-35 filter blur-4xl shadow-[0_0_60px_rgba(132,94,247,0.5)]"
            animate={{ scale: [1, 1.15, 1], rotate: [0, 60, 0] }}
            transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full bg-gradient-to-l from-[#ffd43b] to-[#ff6b6b] opacity-30 filter blur-2xl shadow-[0_0_40px_rgba(255,214,59,0.4)]"
            animate={{ x: [0, 80, 0], y: [0, -50, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          />

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 container max-w-4xl"
          >
            <h1 className="font-bricolage text-4xl font-bold tracking-tight text-neutral-800 sm:text-5xl md:text-6xl lg:text-7xl">
              Power the Ideas of Tomorrow
            </h1>
            <p className="mt-6 text-lg text-neutral-600 md:text-xl">
              Fund, Support, and Launch Ideas Worldwide
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-md bg-[#4c6ef5] px-8 hover:bg-[#4c6ef5]/90">
                <Link href="/campaigns">
                  Explore Campaigns <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-md border-neutral-300 px-8 text-neutral-700">
                <Link href="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </motion.div>
        </section>

        {/* How It Works Section */}
        <section className="bg-[#eaeaea] py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="font-bricolage text-3xl font-bold text-neutral-800 md:text-4xl">How It Works</h2>
              <p className="mt-4 text-neutral-600">Three simple steps to bring your ideas to life</p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  icon: <Lightbulb className="h-10 w-10 text-neutral-700" />,
                  title: "Create Your Campaign",
                  description: "Share your story, set your funding goal, and launch your campaign in minutes.",
                },
                {
                  icon: <Users className="h-10 w-10 text-neutral-700" />,
                  title: "Get Funded",
                  description: "Receive support from backers around the world who believe in your vision.",
                },
                {
                  icon: <Rocket className="h-10 w-10 text-neutral-700" />,
                  title: "Bring Ideas to Life",
                  description: "Use the funds to turn your idea into reality and keep your supporters updated.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center rounded-lg bg-[#f3f4f6] p-8 text-center shadow-sm"
                >
                  <div className="mb-4 rounded-full bg-[#f7f7f7] p-4">{step.icon}</div>
                  <h3 className="mb-2 text-xl font-bold text-neutral-800">{step.title}</h3>
                  <p className="text-neutral-600">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-20">
          <div className="container">
            <div className="grid items-center gap-12 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="font-bricolage text-3xl font-bold text-neutral-800 md:text-4xl">
                  About the Platform
                </h2>

                <p className="mt-4 text-neutral-600">
                  Fundify is a global decentralized crowdfunding platform that connects creators with backers. We believe
                  that great ideas can come from anywhere, and we&rsquo;re committed to helping creators bring their visions to
                  life.
                </p>

                <p className="mt-4 text-neutral-600">
                  Our platform provides the tools and resources needed to run a successful campaign&mdash;from campaign
                  creation to fulfillment. We&rsquo;ve helped thousands of creators raise millions in cryptocurrency for their
                  projects.
                </p>

                <Button asChild className="mt-6 rounded-md bg-[#4c6ef5] hover:bg-[#4c6ef5]/90">
                  <Link href="/campaigns">Discover Projects</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                className="relative aspect-square overflow-hidden rounded-lg"
              >
                {/* <Image src={placeholder} width={600} height={600}  alt="About Fundify" fill className="object-cover" /> */}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-[#eaeaea] py-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="mb-12 text-center"
            >
              <h2 className="font-bricolage text-3xl font-bold text-neutral-800 md:text-4xl">
                What Creators Say
              </h2>
              <p className="mt-4 text-neutral-600">
                Hear from the creators who&rsquo;ve successfully funded their projects
              </p>
            </motion.div>

            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote:
                    'Fundify helped me turn my idea into a thriving business. The platform was easy to use and the community was incredibly supportive.',
                  name: 'Sarah Johnson',
                  role: 'Tech Entrepreneur',
                  image: '', // Replace with real image URLs later
                },
                {
                  quote:
                    'I was able to fund my documentary film in just 30 days. The exposure I got through Fundify was invaluable.',
                  name: 'Michael Chen',
                  role: 'Filmmaker',
                  image: '',
                },
                {
                  quote:
                    'As a first-time creator, I was nervous about launching a campaign. Fundify made the process simple and straightforward.',
                  name: 'Emma Rodriguez',
                  role: 'Product Designer',
                  image: '',
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="flex flex-col rounded-lg bg-[#f3f4f6] p-8 shadow-sm"
                >
                  <p className="mb-6 text-neutral-600">&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className="mt-auto flex items-center">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full bg-neutral-300">
                      {testimonial.image ? (
                        <Image
                          src={testimonial.image}
                          alt={`${testimonial.name}'s profile picture`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="flex h-full w-full items-center justify-center text-sm text-neutral-500">
                          {testimonial.name.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-bold text-neutral-800">{testimonial.name}</h4>
                      <p className="text-sm text-neutral-600">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="bg-neutral-800 py-20 text-white">
          <div className="container text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="font-bricolage text-3xl font-bold md:text-4xl">Ready to Launch Your Idea?</h2>
              <p className="mx-auto mt-4 max-w-2xl text-neutral-300">
                Join thousands of creators who have successfully funded their projects on Fundify.
              </p>
              <Button asChild size="lg" className="mt-8 rounded-md bg-[#4c6ef5] px-8 text-white hover:bg-[#4c6ef5]/90">
                <Link href="/auth">Connect Your Wallet</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}
