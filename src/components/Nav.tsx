import Link from 'next/link'
import Router from 'next/router'
import { Listbox, Transition } from "@headlessui/react"
import { ChevronDownIcon } from "@heroicons/react/solid"
import { Fragment } from 'react'

export const FixedNav = ({ city }: { city: string }) => {
    return (
        <section className='flex top-0 px-5 w-full fixed justify-between bg-black bg-opacity-50 z-50'>
            <div className='mt-2'>
                <Link href='/'>
                    <a>
                        <img className='inline align-baseline w-8 mr-1' src='/logomark-white.svg' alt='link to top' />
                        <span className='hidden md:inline leading-loose text-2xl'>PHANTOM TYPE</span>
                    </a>
                </Link>
            </div>
            <div className='relative'>
                <Listbox value={city} onChange={(v) => { console.log(v) }}>
                    {({ open }) => (
                        <div className="relative mt-1">
                            <Listbox.Button className='relative w-full py-2 pl-3 pr-10 uppercase text-left text-gray-400 rounded-lg shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-indigo-500'>
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
                                <Listbox.Options>
                                    {({ selected, active }) => (
                                        Cities.map((c) => (
                                            <Listbox.Option
                                                key={c}
                                                value={c}
                                                className='uppercase'
                                            >
                                                <Link href={`${c}`}>{c}</Link>
                                            </Listbox.Option>
                                        ))
                                    )}
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
        <section className='grid grid-cols-1 md:grid-cols-4 gap-2'>
            {Cities.map((c) => (
                <button className='py-2 text-lg font-light uppercase rounded border border-gray-700 hover:bg-black' onClick={push(c)} key={c}>{c}</button>
            ))}
        </section>
    )
}

const push = (city: string) => () => {
    console.log(city)
    Router.push('/[city]', `/${city}`)
}

const Cities = ['kyoto', 'kanazawa', 'nagoya', 'matsushima']
