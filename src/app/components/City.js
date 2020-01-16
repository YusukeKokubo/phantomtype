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
    <div className={`City`} id={city}>
      <h2 className='cityName'>{city}</h2>
      <p className="description">{description}</p>
      {
        photos.sort(byDateTime).map((p, i) => {
          const src = p.url;
          return <Photo key={i} photo={p} src={src} align={i % 2} />;
        })
      }
<style jsx>{`
.City{
display: grid;
grid-template-columns: 1fr;
grid-gap: 60px;
margin: 50px 1vw;
}

.cityName {
  color: #fff;
  text-align: center;
  font-size: 2.5rem;
  font-weight: 200;
  margin: 80px 0 0 0;
  text-transform: uppercase;
}
.description {
  text-align: center;
  font-size: 1.6rem;
  font-weight: 200;
  color: #ddd;
}
`}</style>
    </div>
  );
}

export default City

