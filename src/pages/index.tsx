import Head from 'next/head'
import { Nav } from '../components/Nav'

export default () => {
  return (
    <>
      <Head>
        <meta property='og:title' content='phantomtype' />
        <meta property='og:description' content='Japan photo gallery' />
        <meta property='og:image' content='https://phantomtype.com/kyoto.jpg' />
      </Head>
      <picture>
        <source type='webp' srcSet='/kyoto.webp' />
        <img alt='logo' className="object-cover w-full h-full absolute top-0" src='/kyoto.jpg' />
      </picture>
      <section className='absolute w-full h-screen flex flex-col justify-around'>
        <div />
        <div />
        <div />
        <div className='mx-8 lg:mx-16 grid grid-cols-1 gap-16'>
          <div>
            <h1 className='font-light text-5xl leading-none'>PHANTOM TYPE
            <img className='inline w-16 mx-4' src='/logomark-white.svg' alt='phantomtype logo' />
            </h1>
            <p className='font-light text-xl'>a Japan photo gallery by
            <a target='_blank'
                className='font-normal mx-1'
                rel='noopener'
                href='https://twitter.com/yusuke_kokubo'>@yusuke_kokubo</a>
            </p>
          </div>
          <div className=''>
            <Nav />
          </div>
        </div>
        <div />
      </section>
    </>
  )
}
