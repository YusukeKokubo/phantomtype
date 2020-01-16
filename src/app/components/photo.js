import React from "react";

import { format } from 'date-fns'

function datetime(src) {
  const result = format(src.toDate(), 'yyyy/MM/dd')
  return result
}

function Photo({photo, src, align}) {
  console.log(photo)
  const e = photo
  return (
    <section className={`Photo ${align == 1 ? "Photo-right": null}`}>
      <img className='Photo-img' src={src} style={{width: '500px'}} />
      <div className={`exif ${align == 1 ? "exif-right": null}`}>
        <span>{e.image.Make} {e.image.Model}</span>
        <span>{datetime(e.exif.DateTimeOriginal)}</span>
        {/* <span>{e.exif.FocalLength.Numerator / e.exif.FocalLength.Denominator}mm ({e.exif.FocalLengthIn35mmFilm}mm) ／ F{e.exif.FNumber.Numerator / e.exif.FNumber.Denominator} ／ {e.exif.ExposureTime.Numerator} / {e.exif.ExposureTime.Denominator}S</span> */}
        <span>ISO {e.exif.ISO}</span>
        <span>{e.exif.LensMake} {e.exif.LensModel}</span>
      </div>
<style jsx>{`
.Photo{
display: flex;
flex-direction: row;
justify-content: flex-start;
margin: 0 5vw;
}

.Photo-img {
  max-width: 540px;
  max-height: 540px;
}
.Place {
  font-weight: 300;
  font-size: 1.2rem;
  margin-bottom: 10px;
  text-transform: capitalize;
}
.exif {
  margin: 0 15px;
  display: flex;
  flex-direction: column;
  justify-content: start;
  color: #ccc;
  font-size: 1.0rem;
  font-weight: 200;
}
.exif-right {
  text-align: right;
}
`}</style>
    </section>
  )
}

export default Photo;
