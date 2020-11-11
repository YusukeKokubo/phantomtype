import Head from 'next/head'
import Image from 'next/image'
import { Nav } from '../components/Nav'

const Template = () => {
  return (
    <>
      <Head>
        <meta property='og:title' content='PHANTOM TYPE' />
        <meta property='og:description' content='Japan photo gallery' />
        <meta property='og:image' content='https://phantomtype.com/ogkyoto.jpg' />
        <meta name='twitter:image' content='https://phantomtype.com/ogkyoto.jpg' />
      </Head>
      <Image className='object-cover w-screen h-screen absolute top-0' alt='kyoto shimogamo' src={'/kyoto.jpg'} layout='fill' priority={true} />
      {/* <img className='object-cover w-screen h-screen absolute top-0' alt='kyoto shimogamo' src={'/kyoto.jpg'} /> */}
      <section className='absolute w-screen h-screen flex flex-col-reverse justify-around'>
        <div className='mx-8 lg:mx-16 grid grid-cols-1 gap-16'>
          <div className='flex'>
            <div>
              <h1 className='font-light text-5xl leading-none'>PHANTOM TYPE
            </h1>
              <p className='font-light text-xl mt-2'>Japan Pics by
                <a target='_blank'
                  className='font-normal mx-1'
                  rel='noopener'
                  href='https://twitter.com/yusuke_kokubo'>@yusuke_kokubo</a>
              </p>
            </div>
            <div>
              <img className='inline w-32 mx-4' src='/logomark-white.svg' alt='phantomtype logo' />
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
