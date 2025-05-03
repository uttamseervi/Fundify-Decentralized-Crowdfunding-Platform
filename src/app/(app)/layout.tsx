import { Space_Grotesk, Bricolage_Grotesque } from "next/font/google"




const spaceGrotesk = Space_Grotesk({
    subsets: ["latin"],
    variable: "--font-space-grotesk",
})

const bricolage = Bricolage_Grotesque({
    subsets: ["latin"],
    variable: "--font-bricolage",
})





export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${spaceGrotesk.variable} ${bricolage.variable} font-sans bg-[#f7f7f7]`}>

                <div className="flex h-screen  flex-col">
                    <main className="flex-1">
                        {children}
                    </main>
                </div>

            </body>
        </html>
    )
}
