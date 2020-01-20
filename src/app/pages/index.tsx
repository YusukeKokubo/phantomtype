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
           src="https://storage.googleapis.com/phantomtype-180814.appspot.com/splash/splash-1.jpg"/>
      <div className={css.title}>
        <img src='/logomark-white.svg' className={css.logo} />
        <h1 className={ css.siteTitle }>PHANTOM TYPE</h1>
        <p className={ css.description }>a Japan photo gallery.</p>
      </div>
    </section>
    <Nav />
  </App>
