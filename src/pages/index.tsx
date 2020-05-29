import Head from 'next/head'
import { Nav } from '../components/Nav'

export default () => {
  return (
    <>
      <Head>
        <meta property='og:title' content='PHANTOM TYPE' />
        <meta property='og:description' content='Japan photo gallery' />
        <meta property='og:image' content='https://phantomtype.com/ogkyoto.jpg' />
        <meta name='twitter:image' content='https://phantomtype.com/ogkyoto.jpg' />
      </Head>
      <picture>
        <source type='webp' srcSet='/kyoto.webp' />
        <img alt='logo' className="object-cover w-screen h-screen absolute top-0" src='/kyoto.jpg' />
      </picture>
      <section className='absolute w-screen h-screen flex flex-col-reverse justify-around'>
        <div className='mx-8 lg:mx-16 grid grid-cols-1 gap-16'>
          <div>
            <h1 className='font-light text-5xl leading-none'>PHANTOM TYPE
            <img className='inline w-20 mx-4' src='/logomark-white.svg' alt='phantomtype logo' />
            </h1>
            <p className='font-light text-xl mt-2'>Japan Pics by
            <a target='_blank'
                className='font-normal mx-1'
                rel='noopener'
                href='https://twitter.com/yusuke_kokubo'>@yusuke_kokubo</a>
            </p>
          </div>
          <Nav />
        </div>
        <div />
      </section>
    </>
  )
}
