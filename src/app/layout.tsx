import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, Bricolage_Grotesque } from "next/font/google"
import "./globals.css"

import { ThirdwebProvider } from "thirdweb/react";
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { StoreProvider } from "@/store/storeProvider";
import AuthUtil from "@/components/authUtil";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
})

export const metadata: Metadata = {
  title: "Fundify | Decentralized Crowdfunding Platform",
  description: "A transparent, trustless platform that puts creators and backers in direct control.",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${bricolage.variable} font-sans bg-[#f7f7f7]`}>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <ThirdwebProvider>
              <AuthUtil>
                <div className="flex min-h-screen flex-col">
                  <Navbar />
                  <main className="flex-1">
                    {children}
                  </main>
                  <Footer />
                </div>
              </AuthUtil>
            </ThirdwebProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
