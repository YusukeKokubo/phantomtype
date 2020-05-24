import { Button, createStyles, FormControl, makeStyles, MenuItem, Select, Theme } from '@material-ui/core'
import Link from 'next/link'
import Router from 'next/router'

const buttonStyle = (theme: Theme) => createStyles({
    root: {
        fontSize: 'medium',
        color: theme.palette.text.primary,
        background: theme.palette.background.default,
        backgroundColor: 'transparent',
        textTransform: 'uppercase',
        minWidth: 120,

        '&:hover': {
            backgroundColor: theme.palette.background.default,
        },
    },
})

const NavStyles = makeStyles((theme: Theme) => createStyles({
    SelectCity: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 100px)',
        gridGap: 30,
        '& button': buttonStyle(theme).root,
    },
}))

const FixedNavStyle = makeStyles(({ palette }: Theme) => createStyles({
    FixedNav: {
        display: 'flex',
        top: 0,
        padding: '0 5vw',
        width: '100%',
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'space-between',
    },
    LogoLink: {
        textDecoration: 'none',
    },
    NavTitle: {
        lineHeight: 2.0,
        color: palette.text.primary,
        '@media (max-width: 600px)': {
            display: 'none',
        },
    },
    CitySelect: {
        minWidth: 140,
        textTransform: 'uppercase',
        '& *': {
            fontSize: 'smaller',
        },
    },
    CityItem: {
        textTransform: 'uppercase',
        fontSize: 'smaller',
    },
}))

export const FixedNav = ({ city }: { city: string }) => {
    const classes = FixedNavStyle()
    return (
        <section className={classes.FixedNav}>
            <div>
                <Link href='/'>
                    <a className={classes.LogoLink}>
                        <img className='inline w-8 mr-1' src='/logomark-white.svg' alt='link to top' />
                        <span className={classes.NavTitle}>PHANTOM TYPE.</span>
                    </a>
                </Link>
            </div>
            <FormControl className={classes.CitySelect}>
                <Select
                    value={city}
                    displayEmpty={true}
                    onChange={(e) => { push(e.target.value as string)() }}
                >
                    {Cities.map((c) => (
                        <MenuItem key={c} className={classes.CityItem} value={c}>{c}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </section>
    )
}

export const Nav = () => {
    const classes = NavStyles()
    return (
        <section className={classes.SelectCity}>
            {Cities.map((c) => (
                <Button variant='outlined' onClick={push(c)} key={c}>{c}</Button>
            ))}
        </section>
    )
}

const push = (city: string) => () => {
    console.log(city)
    Router.push('/[city]', `/${city}`)
}

const Cities = ['kyoto', 'kanazawa', 'nagoya', 'matsushima']
