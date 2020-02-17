import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Router from 'next/router'

const buttonStyle = (theme: Theme) => ({
    fontSize: 'medium',
    fontWeight: 'lighter',
    color: theme.palette.text.primary,
    textDecoration: 'none',
    background: theme.palette.background.default,
    backgroundColor: 'transparent',
    border: 'none',
    textTransform: 'uppercase',
    padding: '15px 2vw',
    cursor: 'pointer',

    '&:hover': {
        backgroundColor: theme.palette.background.default,
    },
})

const useStyles = makeStyles((theme: Theme) => createStyles({
    SelectCity: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'absolute',
        left: '50%',
        bottom: '10vh',
        transform: 'translate3d(-50%, -60%, 0)',
        '& button': buttonStyle(theme),
    },
    FixedNav: {
        top: 0,
        width: '100%',
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        display: 'flex',
        justifyContent: 'center',
        '& img': {
            width: 30,
        },
        '& button': buttonStyle(theme),
    },
}))

export default ({ }: {}) => {
    const classes = useStyles()
    return (
        <section className={classes.SelectCity}>
            <button onClick={serverPush(Cities.Kyoto)}>Kyoto</button>
            <button onClick={serverPush(Cities.Kanazawa)}>Kanazawa</button>
            <button onClick={serverPush(Cities.Nagoya)}>nagoya</button>
            <button onClick={serverPush(Cities.Matsushima)}>matsushima</button>
        </section>
    )
}

export const FixedNav = () => {
    const classes = useStyles()
    return (
        <section className={classes.FixedNav}>
            <button onClick={serverPush('')}>
                <img src='/logomark-white.svg' />
            </button>
            <button onClick={serverPush(Cities.Kyoto)}>Kyoto</button>
            <button onClick={serverPush(Cities.Kanazawa)}>Kanazawa</button>
            <button onClick={serverPush(Cities.Nagoya)}>nagoya</button>
            <button onClick={serverPush(Cities.Matsushima)}>matsushima</button>
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
