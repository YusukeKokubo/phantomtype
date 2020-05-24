import Head from 'next/head'
import { Nav } from '../components/Nav'

export default () => {
  return (
    <>
      <Head>
        <meta property='og:title' content='phantomtype' />
        <meta property='og:description' content='Japan photo gallery' />
        <meta property='og:image' content='/kyoto.jpg' />
      </Head>
      <picture>
        <source type='webp' srcSet='/kyoto.webp' />
        <img alt='logo' className="object-cover w-full h-full absolute top-0" src='/kyoto.jpg' />
      </picture>
      <section className='absolute w-full h-screen grid grid-rows-2'>
        <div />
        <div className='mx-8'>
          <div className=''>
            <h1 className='font-light text-5xl leading-none'>PHANTOM TYPE
            <img className='inline w-16 m-8' src='/logomark-white.svg' alt='phantomtype logo' />
            </h1>
            <p className='font-light text-xl'>a Japan photo gallery by
            <a target='_blank'
                className='font-normal mx-1'
                rel='noopener'
                href='https://twitter.com/yusuke_kokubo'>@yusuke_kokubo</a>
            </p>
            <div className='mt-20'>
              <Nav />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
