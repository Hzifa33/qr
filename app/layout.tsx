import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Montserrat, Open_Sans, Noto_Naskh_Arabic } from "next/font/google"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "900"],
})

const openSans = Open_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
  weight: ["400", "500", "600"],
})

const notoArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-noto-arabic",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "QR Studio - Premium QR Code Generator & Reader",
  description:
    "Create stunning, artistic QR codes with advanced customization. Professional-grade QR generator with glassmorphism effects, logo integration, and multi-format export.",
  generator: "QR Studio",
  keywords: ["QR code", "generator", "reader", "scanner", "artistic", "premium", "logo", "custom"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" dir="ltr">
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable} ${montserrat.variable} ${openSans.variable} ${notoArabic.variable}`}
      >
        {children}
      </body>
    </html>
  )
}
