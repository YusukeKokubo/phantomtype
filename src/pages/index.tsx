import App from '../components/App'
import Nav from '../components/Nav'
import css from './index.module.css'

export default () => (
  <App>
    <section className={css.splash}>
      <picture>
        <source type='webp' srcSet={'https://firebasestorage.googleapis.com/v0/b/phantomtype.appspot.com/o/kyoto%2FDSCF8041.webp?alt=media'} />
        <img className={css.splash_image} src='https://firebasestorage.googleapis.com/v0/b/phantomtype.appspot.com/o/kyoto%2FDSCF8041-comp.jpg?alt=media' />
      </picture>
      <div className={css.title}>
        <img src='/logomark-white.svg' className={css.logo} />
        <h1 className={css.siteTitle}>PHANTOM TYPE</h1>
        <p className={css.description}>
          a Japan photo gallery
          by <a target='_blank' className={css.twitterLink} href='https://twitter.com/yusuke_kokubo'>@yusuke_kokubo</a>
        </p>
      </div>
    </section>
    <Nav />
  </App>
)
