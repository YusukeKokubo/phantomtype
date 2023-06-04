import { Metadata } from "next"
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
  viewport: "initial-scale=1.0, width=device-width",
  twitter: {
    site: "@yusuke_kokubo",
    card: "summary_large_image",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className={`bg-black text-white font-body ${inter.className}`}>
        {children}
      </body>
    </html>
  )
}
