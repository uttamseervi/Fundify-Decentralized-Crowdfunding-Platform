import { Space_Grotesk } from "next/font/google"




const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
})






export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${spaceGrotesk.variable} font-sans bg-[#f7f7f7]`}>

                <div className="flex h-screen  flex-col">
                    <main className="flex-1">
                        {children}
                    </main>
                </div>

            </body>
        </html>
    )
}
