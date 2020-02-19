import { createStyles, makeStyles } from '@material-ui/core/styles'

import { Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import format from 'date-fns/format';
import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Photo } from '../../@types/Photo';

function datetime(src: firebase.firestore.Timestamp) {
  const result = format(src.toDate(), 'yyyy/MM/dd HH:mm:ss')
  return result
}

const useStyles = makeStyles(() => createStyles({
  root: {
    width: '90vw',
    maxHeight: '90vh',
  },
  Exif: {
    '& td': {
      fontSize: 'small',
      borderColor: '#222',
    },
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
      <div>
        <TableContainer>
          <Table size='small' aria-label='a dense table' className={classes.Exif}>
            <TableBody>
              <TableRow>
                <TableCell>DateTimeOriginal</TableCell>
                <TableCell>{datetime(e.exif.DateTimeOriginal)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Make  /Model</TableCell>
                <TableCell>{e.image.Make} {e.image.Model}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>FocalLength(mm) / In35mm</TableCell>
                <TableCell>{e.exif.FocalLength} / {e.exif.FocalLengthIn35mmFormat}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>FNumber</TableCell>
                <TableCell>F{e.exif.FNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ExposureTime (S)</TableCell>
                <TableCell>{e.exif.ExposureTime}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>ISO</TableCell>
                <TableCell>{e.exif.ISO}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Lens</TableCell>
                <TableCell>{e.exif.LensMake} {e.exif.LensModel}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Software</TableCell>
                <TableCell>{e.image.Software}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </section>
  )
}

export default PhotoDetail;
