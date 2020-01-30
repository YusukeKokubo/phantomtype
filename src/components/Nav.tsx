import Router from 'next/router'
import css from './nav.module.css'

export default ({ }: {}) => {
    return (
        <section className={css.selectcity}>
            <button className={css.selectButton} onClick={serverPush(Cities.Kyoto)}>Kyoto</button>
            <button className={css.selectButton} onClick={serverPush(Cities.Kanazawa)}>Kanazawa</button>
            <button className={css.selectButton} onClick={serverPush(Cities.Nagoya)}>nagoya</button>
            <button className={css.selectButton} onClick={serverPush(Cities.Matsushima)}>matsushima</button>
        </section>
    )
}

export const FixedNav = () => {
    return (
        <section className={css.fixedNav}>
            <button className={css.selectButton} onClick={serverPush('')}>
                <img src='/logomark-white.svg' className={css.backToHomeButton} />
            </button>
            <button className={css.selectButton} onClick={serverPush(Cities.Kyoto)}>Kyoto</button>
            <button className={css.selectButton} onClick={serverPush(Cities.Kanazawa)}>Kanazawa</button>
            <button className={css.selectButton} onClick={serverPush(Cities.Nagoya)}>nagoya</button>
            <button className={css.selectButton} onClick={serverPush(Cities.Matsushima)}>matsushima</button>
        </section>
    )
}

const serverPush = (city: Cities | string) => () => {
    Router.push(`/${city}`)
}

enum Cities {
    Kyoto = 'kyoto',
    Kanazawa = 'kanazawa',
    Nagoya = 'nagoya',
    Matsushima = 'matsushima',
}
