import { AppProps } from "next/app"
import Head from "next/head"

import "tailwindcss/tailwind.css"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>PHANTOM TYPE</title>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width"
          key="viewport"
        />
        <meta name="description" content="Japan photo gallery" />
        <meta property="og:site_name" content="PHANTOM TYPE" />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content="PHANTOM TYPE" />
        <meta name="twitter:description" content="a Japan photo gallery" />
        <meta name="twitter:card" content="photo" />
        <meta name="twitter:site" content="@yusuke_kokubo" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
