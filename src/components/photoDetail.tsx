import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'

import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Photo } from '../../@types/Photo';

const useStyles = makeStyles(({ palette }: Theme) => createStyles({
  root: {
    width: '90vw',
    maxHeight: '90vh',
  },
}))

function PhotoDetail({ photo }: { photo: Photo }) {
  const e = photo
  console.log(e.filePath)
  const classes = useStyles()

  return (
    <section>
      <picture>
        <source type='image/webp' srcSet={e.urls.webp} />
        <LazyLoadImage className={classes.root} src={e.urls.lowQuality} />
      </picture>
    </section>
  )
}

export default PhotoDetail;
