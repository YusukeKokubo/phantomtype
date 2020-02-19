import { createStyles, makeStyles, Theme } from '@material-ui/core';
import { red } from '@material-ui/core/colors';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Cookies from 'js-cookie';
import { Photo } from '../../@types/Photo';

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
  LikeText: {
    fontSize: '2.0vw',
  },
}))

function onLike(fb: firebase.app.App, photo: Photo) {
  const id = `${photo.city}-${photo.filename}`
  fb.firestore().collection('pics').doc(id).set({
    ...photo,
    like: (photo.like || 0) + 1,
  }).then(() => {
    Cookies.set(id, '1')
    console.log('Liked: ', id)
  })
  return null
}

function onUnLike(fb: firebase.app.App, photo: Photo) {
  const id = `${photo.city}-${photo.filename}`
  fb.firestore().collection('pics').doc(id).set({
    ...photo,
    like: (photo.like || 0) - 1,
  }).then(() => {
    Cookies.set(id, '0')
    console.log('UnLiked: ', id)
  })
  return null
}

function LikeView({ fb, photo }: { fb: firebase.app.App, photo: Photo }) {
  const id = `${photo.city}-${photo.filename}`
  const liked = Cookies.get(id) === '1'
  const is = IconStyle()

  return (
    <>
      <span>
        {liked ?
          <Favorite
            onClick={() => onUnLike(fb, photo)}
            className={is.Liked}
          />
          :
          <FavoriteBorder
            onClick={() => onLike(fb, photo)}
            className={is.YetLiked}
          />
        }
      </span>
      <span className={is.LikeText}>{photo.like || 0} like(s)</span>
    </>
  )
}

export default LikeView;
