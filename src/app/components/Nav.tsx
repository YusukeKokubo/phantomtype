import Router from 'next/router'
import css from './nav.module.css'

export default ({ }: {}) => {
    return (
        <section className={css.selectcity}>
            <button className={css.selectButton} onClick={() => { Router.push('/kyoto') }}>Kyoto</button>
            <button className={css.selectButton} onClick={() => { Router.push('/') }}>Kanazawa</button>
            <button className={css.selectButton} onClick={() => { Router.push('/nagoya') }}>nagoya</button>
            <button className={css.selectButton} onClick={() => { Router.push('/') }}>matsushima</button>
        </section>
    )
}

export const FixedNav = () => {
    return (
        <section className={css.fixedNav}>
            <button className={css.selectButton} onClick={() => { Router.push('/kyoto') }}>Kyoto</button>
            <button className={css.selectButton} onClick={() => { Router.push('/') }}>Kanazawa</button>
            <button className={css.selectButton} onClick={() => { Router.push('/nagoya') }}>nagoya</button>
            <button className={css.selectButton} onClick={() => { Router.push('/') }}>matsushima</button>
        </section>
    )
}
