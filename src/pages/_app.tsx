import { AppProps } from 'next/app'
import Head from 'next/head';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import './tailwind.css'

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
      <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Roboto:300,500&display=swap' />
      <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
      <meta name='og:site_name' content='PHANTOM TYPE' />
      <meta name='og:type' content='article' />
      <meta name='twitter:title' content='PHANTOM TYPE' />
      <meta name='twitter:description' content='a Japan photo gallery' />
      <meta name='twitter:card' content='photo' />
      <meta name='twitter:site' content='@yusuke_kokubo' />
    </Head>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Component {...pageProps} />
    </ThemeProvider>
  </>
}

export default MyApp
