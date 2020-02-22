import { Button, ButtonGroup, createStyles, FormControl, makeStyles, MenuItem, Select, Theme } from '@material-ui/core'
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
        padding: '0 5vw',
        width: '100%',
        position: 'fixed',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'space-between',
        '& img': {
            width: 38,
        },
        '& button': buttonStyle(theme).root,
        '& span': {
            lineHeight: 2.0,
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

export default ({ fixed, city }: { fixed: boolean, city?: string }) => {
    const classes = useStyles()
    return (
        <section className={fixed ? classes.FixedNav : classes.SelectCity}>
            {fixed ?
                <>
                    <div>
                        <Button onClick={push('')}>
                            <img src='/logomark-white.svg' />
                        </Button>
                        <span>PHANTOM TYPE.</span>
                    </div>
                    <FormControl className={classes.CitySelect}>
                        <Select
                            value={city}
                            displayEmpty={true}
                            onChange={(e) => { push(e.target.value as string)() }}
                        >
                            {Cities.map((c) => (
                                <MenuItem className={classes.CityItem} value={c}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </>
                :
                <ButtonGroup variant='text' color='primary' aria-label='text primary button group'>
                    {Cities.map((c) => (
                        <Button onClick={push(c)} key={c}>{c}</Button>
                    ))}
                </ButtonGroup>
            }
        </section>
    )
}

const push = (city: string) => () => {
    console.log(city)
    Router.push(`/${city}`)
}

const Cities = ['kyoto', 'kanazawa', 'nagoya', 'matsushima']
