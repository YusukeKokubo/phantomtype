import { AppProps } from 'next/app'
import Head from 'next/head';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    text: {
      primary: '#fff',
    },
    primary: {
      main: '#000',
    },
    background: {
      default: '#000',
    },
  },
  typography: {
    fontFamily: 'Roboto, Noto Sans JP',
    fontSize: 24,
  },
})

function MyApp({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>PHANTOM TYPE</title>
      <meta charSet='utf-8' />
      <meta name='viewport' content='initial-scale=1.0, width=device-width' key='viewport' />
      <link rel='stylesheet' type='text/css' href='https://cdnjs.cloudflare.com/ajax/libs/normalize/7.0.0/normalize.min.css' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/earlyaccess/notosansjp.css' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
    </Head>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  </>
}

export default MyApp
