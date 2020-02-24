import { AppProps } from 'next/app'
import Head from 'next/head';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    text: {
      primary: '#faf8f7',
    },
    primary: {
      main: '#000',
    },
    background: {
      default: '#1c1a1a',
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
      <meta name='description' content='Japan photo gallery' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/earlyaccess/notosansjp.css' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
      <meta property='og:site_name' content='PHANTOM TYPE' />
      <meta property='og:type' content='article' />
      <meta property='twitter:card' content='summary_large_image' />
      <meta property='twitter:site' content='@yusuke_kokubo' />
    </Head>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  </>
}

export default MyApp
