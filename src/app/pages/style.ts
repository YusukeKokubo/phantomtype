import styled from 'styled-components'

export const Splash = styled.section`
  width: 100%;
  height: 100vh;

  .splash-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .title {
    display: inline-flex;
    flex-direction: column;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -60%, 0);
    align-items: center;

    svg.logo {
      width: 25vw;
    }

    .siteTitle {
      margin: 1vh 0;
      color: #fff;
      font-size: 5.52768vw;
      font-weight: 200;
    }

    .description {
      color: #fff;
      font-size: 2.0vw;
      @media (max-width: 600px){
        font-size: 5vw;
      }
    }
  }
`

export const City = styled.section`
display: grid;
grid-template-columns: 1fr;
grid-gap: 60px;
margin: 50px 1vw;

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
`

export const Photo = styled.section`
display: flex;
flex-direction: row;
justify-content: flex-start;
margin: 0 5vw;

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
`
