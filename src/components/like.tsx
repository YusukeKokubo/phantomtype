import Cookies from 'js-cookie';
import { Photo } from '../../@types/Photo';
import { useState } from 'react';

function onLike(fb: firebase.default.app.App, photo: Photo) {
  const id = `${photo.city}-${photo.filename}`
  const data = {
    like: (photo.like || 0) + 1,
  }
  fb.firestore().collection('pics').doc(id).set(data, { merge: true }).then(() => {
    Cookies.set(id, '1')
    console.log('Liked: ', id)
  })
  return null
}

function onUnLike(fb: firebase.default.app.App, photo: Photo) {
  const id = `${photo.city}-${photo.filename}`
  const data = {
    like: (photo.like || 0) - 1,
  }
  fb.firestore().collection('pics').doc(id).set(data, { merge: true }).then(() => {
    Cookies.set(id, '0')
    console.log('UnLiked: ', id)
  })
  return null
}

function LikeView({ fb, photo }: { fb: firebase.default.app.App, photo: Photo }) {
  const id = `${photo.city}-${photo.filename}`
  const [liked, setLiked] = useState(Cookies.get(id) === '1')
  const [likedCount, setLikedCount] = useState(photo.like)

  return (
    <div className={`flex flex-col liked-${liked}`}>
      {liked ?
        <i
          onClick={() => { onUnLike(fb, photo); setLikedCount(likedCount - 1); setLiked(false) }}
          className='material-icons mx-1 pt-2 text-2xl cursor-pointer hover:text-white sm:text-red-600'
        >favorite</i>
        :
        <i onClick={() => { onLike(fb, photo); setLikedCount(likedCount + 1); setLiked(true) }}
          className='material-icons mx-1 pt-2 text-2xl cursor-pointer hover:text-red-600'
        >
          favorite_border
          </i>
      }
      <span className='text-base'>{likedCount || 0} like(s)</span>
    </div>
  )
}

export default LikeView;
