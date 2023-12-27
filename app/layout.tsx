import { Metadata, Viewport } from "next"
import "./globals.css"
import { Inter } from "next/font/google"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PHANTOM TYPE",
  description: "Japan photo gallery",
  openGraph: {
    title: "PHANTOM TYPE",
    description: "Japan photo gallery",
    type: "website",
    url: process.env.NEXT_PUBLIC_HOST,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_HOST || ""),
}

export const viewport: Viewport = {
  themeColor: "black",
  initialScale: 1.0,
  width: "device-width",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`bg-black text-white font-body ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
