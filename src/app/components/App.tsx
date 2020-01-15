// import Header from './Header'

const App = ({ children }: { children?: any }) => (
  <>
    <head>
      <title>PHANTOM TYPE</title>
      <meta charSet='utf-8'/>
      <meta name='viewport' content='initial-scale=1.0, width=device-width'/>
      <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css" />
      <link rel="stylesheet" href="http://fonts.googleapis.com/earlyaccess/notosansjp.css"/>
    </head>
    <style jsx global>{`
      body {
        font-family: 'Noto Sans JP', Helvetica, sans-serif;
        font-size: 100%;
        font-weight: 200;
        background: #000;
      }
    `}</style>
    {/* <Header /> */}
    {children}
  </>
)

export default App
