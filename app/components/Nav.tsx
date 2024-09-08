"use client"

import { City } from "../../@types/Photo"
import Link from "next/link"

export const Header = ({ city, cities }: { city: string; cities: City[] }) => {
  return (
    <section className="flex px-5 w-full justify-between bg-black">
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
        {cities.map((c) => (
          <Link href={c.city} key={c.city} scroll={false}>
            <span
              className={`text-lg uppercase ${
                c.city == city ? "text-white" : "text-gray-500"
              } hover:text-white`}
            >
              {c.city}
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export const Nav = ({ city, cities }: { city?: string; cities: City[] }) => {
  return (
    <div className="flex gap-8 items-center justify-center">
      {cities
        .filter((c) => c.city !== city)
        .map((c) => {
          const examplePic = c.locations[0].pics[0]
          return (
            <Link href={c.city} key={c.city} className="relative">
              <img src={examplePic.url} width={200} height="auto" />
              <span className="top-0 absolute bg-black bg-opacity-50 px-4 text-lg uppercase text-white hover:underline">
                {c.city}
              </span>
            </Link>
          )
        })}
    </div>
  )
}
