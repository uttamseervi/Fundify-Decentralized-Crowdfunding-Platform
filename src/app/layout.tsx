import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import "./globals.css"

import { ThirdwebProvider } from "thirdweb/react";
import { ThemeProvider } from "@/components/theme-provider"

import { StoreProvider } from "@/store/storeProvider";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
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
      <body className={`${spaceGrotesk.variable} font-sans bg-[#f7f7f7]`}>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
            <ThirdwebProvider>
              <div className="flex min-h-screen flex-col">
                <main className="flex-1">
                  {children}
                </main>
              </div>
            </ThirdwebProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
