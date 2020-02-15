import Head from 'next/head'

const App = ({ children }: { children?: any }) => (
  <>
    <Head>
      <title>PHANTOM TYPE</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' key='viewport' />
      <link rel='stylesheet' type='text/css' href='https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/earlyaccess/notosansjp.css' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
    </Head>
    <style jsx={true} global={true}>{`
      body {
        font-family: 'Noto Sans JP';
        font-size: 100%;
        font-weight: 200;
        background: #000;
        color: #fff;
      }
    `}</style>
    {children}
  </>
)

export default App
