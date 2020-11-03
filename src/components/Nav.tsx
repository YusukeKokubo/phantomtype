import Link from 'next/link'
import Router from 'next/router'

export const FixedNav = ({ city }: { city: string }) => {
    return (
        <section className='flex top-0 px-5 w-full fixed justify-between bg-black bg-opacity-50'>
            <div className='mt-2'>
                <Link href='/'>
                    <a>
                        <img className='inline align-baseline w-8 mr-1' src='/logomark-white.svg' alt='link to top' />
                        <span className='hidden md:inline leading-loose text-2xl'>PHANTOM TYPE</span>
                    </a>
                </Link>
            </div>
            <div className="relative">
                <label className='hidden' id='LabelChooseCity' htmlFor='ChooseCity'>Choose city</label>
                <select id='ChooseCity' aria-labelledby='LabelChooseCity' onChange={(e: any) => { push(e.target.value as string)() }} value={city} className="bg-transparent w-full text-base appearance-none uppercase border-b border-gray-200 text-gray-500 py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-black focus:border-gray-500">
                    {Cities.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                </div>
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
