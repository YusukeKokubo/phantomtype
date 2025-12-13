import { jsxRenderer } from 'hono/jsx-renderer'

export interface PageMetadata {
  title?: string
  description?: string
  ogImage?: string
  ogUrl?: string
}

export const renderer = jsxRenderer(({ children, ...props }) => {
  const metadata = props as PageMetadata
  const title = metadata.title || 'PHANTOM TYPE'
  const description = metadata.description || 'Japan photo gallery'
  const ogImage = metadata.ogImage || `${process.env.PUBLIC_HOST || ''}/ogkyoto.jpg`
  const ogUrl = metadata.ogUrl || process.env.PUBLIC_HOST || ''

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="black" />
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
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet" />

        {/* Tailwind CSS */}
        <link rel="stylesheet" href="/styles.css" />
      </head>
      <body class="bg-black text-white font-body">
        {children}
      </body>
    </html>
  )
})
