import React, { useState } from "react";

import Photo from "./photo";
import css from './city.module.css'

function byDateTime(a, b) {
  if (!a) return 1;
  if (!b) return -1;
  return a.exif.DateTimeOriginal < b.exif.DateTimeOriginal ? 1 : -1;
  return 1
}

function City({city, description, photos}) {
  return (
    <div className={css.City} id={city}>
      <h2 className={css.name}>{city}</h2>
      <p className={css.description}>{description}</p>
      {
        photos.sort(byDateTime).map((p, i) => {
          const src = p.url;
          return <Photo key={i} photo={p} src={src} align={i % 2} />;
        })
      }
    </div>
  );
}

export default City

