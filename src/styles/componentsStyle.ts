import { createStyles, makeStyles, Theme } from '@material-ui/core'
import { red } from '@material-ui/core/colors'

export const IconStyle = makeStyles(({ palette }: Theme) => createStyles({
  YetLiked: {
    margin: '-3px 2px',
    fontSize: '2.0vw',
    color: palette.text.primary,
    '&:hover': {
      cursor: 'pointer',
      color: red[600],
    },
    '@media (max-width: 600px)': {
      'font-size': '1.0rem',
    },
  },
  Liked: {
    margin: '-3px 2px',
    fontSize: '2.0vw',
    color: red[600],
    '&:hover': {
      cursor: 'pointer',
      color: '#fff',
    },
    '@media (max-width: 600px)': {
      'font-size': '1.0rem',
    },
  },
}))
