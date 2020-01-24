import App from '../components/App'
import css from './index.module.css'
import Nav from '../components/Nav'

export default () => {
  return view()
}

const view = () =>
  <App>
    <section className={css.splash}>
      <img className={css.splash_image}
        src="https://firebasestorage.googleapis.com/v0/b/phantomtype.appspot.com/o/kyoto%2FDSCF8041.jpg?alt=media" />
      <div className={css.title}>
        <img src='/logomark-white.svg' className={css.logo} />
        <h1 className={css.siteTitle}>PHANTOM TYPE</h1>
        <p className={css.description}>a Japan photo gallery.</p>
      </div>
    </section>
    <Nav />
  </App>
