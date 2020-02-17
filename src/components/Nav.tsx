import { createStyles, makeStyles, Theme } from '@material-ui/core'
import Router from 'next/router'

const buttonStyle = (theme: Theme) => createStyles({
    root: {
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
        '& button': buttonStyle(theme).root,
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
        '& button': buttonStyle(theme).root,
    },
}))

export default ({ fixed }: { fixed: boolean }) => {
    const classes = useStyles()
    return (
        <section className={fixed ? classes.FixedNav : classes.SelectCity}>
            {fixed ? <button onClick={push('')}>
                <img src='/logomark-white.svg' />
            </button> : null}
            {City.map((city) => (
                <button onClick={push(city)}>{city}</button>
            ))}
        </section>
    )
}

const push = (city: string) => () => {
    Router.push(`/${city}`)
}

const City = ['kyoto', 'kanazawa', 'nagoya', 'matsushima']
