import React from "react";

function Photo({photo, src, align}) {
  const e = photo.Exif;
  return (
    <div className={`Photo ${align == 1 ? "Photo-right": null}`}>
      <img className='Photo-img' src={src} />
      <div className={`exif ${align == 1 ? "exif-right": null}`}>
        <span className="Place">{photo.place}</span>
        {/* <span>{e.Make} {e.Model}</span>
        <span>{e.DateTimeOriginal}</span>
        <span>{e.FocalLength.Numerator / e.FocalLength.Denominator}mm ({e.FocalLengthIn35mmFilm}mm) ／ F{e.FNumber.Numerator / e.FNumber.Denominator} ／ {e.ExposureTime.Numerator} / {e.ExposureTime.Denominator}S</span>
        <span>ISO {e.ISOSpeedRatings}</span>
        <span>{e.LensMake} {e.LensModel}</span> */}
      </div>
    </div>
  )
}

export default Photo;
