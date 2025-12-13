import { jsxRenderer, useRequestContext } from "hono/jsx-renderer"
import { ViteClient } from "vite-ssr-components/hono"

export interface PageMetadata {
  title?: string
  description?: string
  ogImage?: string
  ogUrl?: string
}

export const renderer = jsxRenderer(({ children }) => {
  const c = useRequestContext()
  const title = (c.get("title") as string) || "PHANTOM TYPE"
  const description = (c.get("description") as string) || "Japan photo gallery"
  const publicHost = c.env?.PUBLIC_HOST || ""
  const ogImage = (c.get("ogImage") as string) || `${publicHost}/ogkyoto.jpg`
  const ogUrl = (c.get("ogUrl") as string) || publicHost

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="black" />
        <ViteClient />
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Open Graph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={ogUrl} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@yusuke_kokubo" />
        <meta name="twitter:image" content={ogImage} />

        {/* Google Fonts - Inter */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />

        {/* Tailwind CSS */}
        <link href="/styles.css" rel="stylesheet" />
      </head>
      <body class="">{children}</body>
    </html>
  )
})
