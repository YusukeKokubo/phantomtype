import { createStyles, makeStyles, Theme } from '@material-ui/core'

import Nav from '../components/Nav'

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
    top: '50%',
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
    },
    '& p': {
      fontWeight: 'lighter',
      fontSize: 'smaller',
    },
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
      <section className={classes.Splash}>
        <picture>
          <source type='webp' srcSet={'https://firebasestorage.googleapis.com/v0/b/phantomtype.appspot.com/o/kyoto%2FDSCF8041.webp?alt=media'} />
          <img className={classes.SplashImage} src='https://firebasestorage.googleapis.com/v0/b/phantomtype.appspot.com/o/kyoto%2FDSCF8041-comp.jpg?alt=media' />
        </picture>
        <div className={classes.Title}>
          <h1>PHANTOM TYPE<img src='/logomark-white.svg' /></h1>
          <p>a Japan photo gallery by
            <a target='_blank'
              className={classes.TwitterLink}
              href='https://twitter.com/yusuke_kokubo'>@yusuke_kokubo</a>
          </p>
        </div>
      </section>
      <Nav fixed={false} />
    </>
  )
}
