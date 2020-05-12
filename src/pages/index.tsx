import { createStyles, makeStyles, Theme } from '@material-ui/core'

import Head from 'next/head'
import { Nav } from '../components/Nav'

const useStyles = makeStyles((theme: Theme) => createStyles({
  Splash: {
    width: '100%',
    height: '100vh',
  },
  SplashImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  Title: {
    position: 'absolute',
    width: '70vw',
    top: '65%',
    left: '50%',
    transform: 'translate3d(-50%, -40%, 0)',
    '& img': {
      width: '65px',
      margin: '0 30px',
    },
    '& h1': {
      fontWeight: 'lighter',
      fontSize: 'xxx-large',
      lineHeight: '1.2',
      margin: '10px 0',
    },
    '& p': {
      fontWeight: 'lighter',
      fontSize: 'smaller',
    },
  },
  Nav: {
    margin: '10vh 0',
  },
  TwitterLink: {
    color: theme.palette.text.primary,
    fontWeight: 'normal',
    textDecoration: 'none',
    margin: '0 5px',
  },
}))

export default () => {
  const classes = useStyles()
  return (
    <>
      <Head>
        <meta property='og:title' content='phantomtype' />
        <meta property='og:description' content='Japan photo gallery' />
        <meta property='og:image' content='/kyoto.jpg' />
      </Head>
      <section className={classes.Splash}>
        <picture>
          <source type='webp' srcSet='/kyoto.webp' />
          <img alt='logo' className={classes.SplashImage} src='/kyoto.jpg' />
        </picture>
        <div className={classes.Title}>
          <h1>PHANTOM TYPE<img src='/logomark-white.svg' alt='phantomtype logo' /></h1>
          <p>a Japan photo gallery by
            <a target='_blank'
              className={classes.TwitterLink}
              rel='noopener'
              href='https://twitter.com/yusuke_kokubo'>@yusuke_kokubo</a>
          </p>
          <div className={classes.Nav}>
            <Nav />
          </div>
        </div>
      </section>
    </>
  )
}
