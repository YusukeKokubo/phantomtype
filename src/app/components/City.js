import React, { useState } from "react";

import Photo from "./photo";

function byDateTime(a, b) {
  if (!a) return 1;
  if (!b) return -1;
  return a.exif.DateTimeOriginal < b.exif.DateTimeOriginal ? 1 : -1;
  return 1
}

function City({city, description, photos}) {
  return (
    <section className={`City`} id={city}>
      <h2 className='cityName'>{city}</h2>
      <p className="description">{description}</p>
      {
        photos.sort(byDateTime).map((p, i) => {
          const src = p.url;
          return <Photo key={i} photo={p} src={src} align={i % 2} />;
        })
      }
    </section>
  );
}

export default City

