"use client"

import Link from "next/link"

export const Header = ({ city }: { city: string }) => {
  return (
    <section className="flex top-0 px-5 w-full fixed justify-between bg-black bg-opacity-50 z-50">
      <div className="mt-2">
        <Link href="/">
          <img
            className="inline align-baseline w-8 mr-1"
            src="/logomark-white.svg"
            alt="link to top"
          />
          <span className="hidden md:inline leading-loose text-2xl">
            PHANTOM TYPE
          </span>
        </Link>
      </div>
      <div className="flex gap-4 items-center justify-center">
        {Cities.map((c) => (
          <Link href={c} key={c} scroll={false}>
            <span
              className={`text-lg uppercase ${
                c == city ? "text-white" : "text-gray-500"
              } hover:text-white`}
            >
              {c}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export const Nav = ({ city }: { city?: string }) => {
  return (
    <div className="flex gap-8 items-center justify-center">
      {Cities.filter((c) => c !== city).map((c) => (
        <Link href={c} key={c}>
          <span className="text-lg uppercase text-white hover:underline">
            {c}
          </span>
        </Link>
      ))}
    </div>
  )
}

const Cities = ["kyoto", "kanazawa", "nagoya", "matsushima"]
