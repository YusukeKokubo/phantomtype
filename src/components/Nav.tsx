import { Button, createStyles, makeStyles, Theme } from '@material-ui/core'
import Router from 'next/router'

const buttonStyle = (theme: Theme) => createStyles({
    root: {
        fontSize: 'medium',
        color: theme.palette.text.primary,
        background: theme.palette.background.default,
        backgroundColor: 'transparent',
        textTransform: 'uppercase',
        padding: '15px 2vw',

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
        display: 'flex',
        top: 0,
        width: '100%',
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
            {fixed ? <Button onClick={push('')}>
                <img src='/logomark-white.svg' />
            </Button> : null}
            {Cities.map((city) => (
                <Button onClick={push(city)}>{city}</Button>
            ))}
        </section>
    )
}

const push = (city: string) => () => {
    Router.push(`/${city}`)
}

const Cities = ['kyoto', 'kanazawa', 'nagoya', 'matsushima']
