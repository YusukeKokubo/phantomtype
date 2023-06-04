"use client"

import { Listbox, Transition } from "@headlessui/react"
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { Fragment } from "react"

export const FixedNav = ({ city }: { city: string }) => {
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
      <div className="relative w-40">
        <Listbox
          value={city}
          onChange={(v) => {
            console.log(v)
          }}
        >
          {({ open }) => (
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full py-2 pl-3 pr-10 uppercase text-left text-gray-400 rounded-lg shadow-md cursor-default focus:outline-none">
                <span className="block truncate">{city}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDownIcon
                    className="w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute px-2 py-1 mt-1 bg-gray-500 bg-opacity-75 text-gray-100 rounded-md shadow-lg focus:outline-none">
                  {Cities.map((c) => (
                    <Listbox.Option
                      key={c}
                      value={c}
                      className="uppercase hover:bg-gray-400 px-2 py-1 pl-6"
                    >
                      {({ selected }) => (
                        <span className={`flex items-center`}>
                          {selected ? (
                            <CheckIcon
                              className="w-5 h-5 absolute left-2"
                              aria-hidden="true"
                            />
                          ) : (
                            <span />
                          )}
                          <Link href={`${c}`}>{c}</Link>
                        </span>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
      </div>
    </section>
  )
}

export const Nav = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-2">
      {Cities.map((c) => (
        <Link
          className="py-2 text-lg text-center font-light uppercase hover:bg-black hover:bg-opacity-50"
          href={`/${c}`}
          key={c}
        >
          <span className="border-b px-2">{c}</span>
        </Link>
      ))}
    </section>
  )
}

const Cities = ["kyoto", "kanazawa", "nagoya", "matsushima"]
