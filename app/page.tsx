import Image from "next/image"
import { Nav } from "./components/Nav"
import { Metadata } from "next"

export const metadata: Metadata = {
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_HOST}/ogkyoto.jpg`,
        width: 1200,
        height: 630,
        alt: "kyoto shimogamo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@yusuke_kokubo",
    images: `${process.env.NEXT_PUBLIC_HOST}/ogkyoto.jpg`,
  },
}

const Template = () => {
  return (
    <>
      <div className="absolute w-screen h-screen top-0">
        <Image
          className="object-cover"
          fill={true}
          alt="kyoto shimogamo"
          src={"/kyoto.jpg"}
          priority={true}
        />
      </div>
      <section className="absolute w-screen h-screen flex flex-col-reverse justify-around">
        <div className="mx-8 lg:mx-16 grid grid-cols-1 gap-16">
          <div className="flex">
            <div>
              <h1 className="font-light text-5xl leading-none">PHANTOM TYPE</h1>
              <p className="font-light text-xl mt-2">
                Japan Pics by
                <a
                  target="_blank"
                  className="font-normal mx-1"
                  rel="noopener"
                  href="https://twitter.com/yusuke_kokubo"
                >
                  @yusuke_kokubo
                </a>
              </p>
            </div>
            <div>
              <img
                className="inline w-32 mx-4"
                src="/logomark-white.svg"
                alt="phantomtype logo"
              />
            </div>
          </div>
          <Nav />
        </div>
        <div />
      </section>
    </>
  )
}
export default Template
