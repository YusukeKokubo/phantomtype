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
    {/* <Header /> */}
    {children}
  </>
)

export default App
