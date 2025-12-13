import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-pages'
import { renderer } from './renderer'
import HomePage from './pages/home'
import CityPage from './pages/city'
import citiesData from '../public/pics.json'
import { City } from '../@types/Photo'

const app = new Hono()

// Apply renderer middleware
app.use(renderer)

// Serve static files
app.use('/pics/*', serveStatic({ root: './' }))
app.use('/*.{svg,jpg,css}', serveStatic({ root: './public' }))
app.use('/styles.css', serveStatic({ path: './public/styles.css' }))

// Home page
app.get('/', (c) => {
  const cities: City[] = citiesData as City[]
  const publicHost = c.env?.PUBLIC_HOST || process.env.PUBLIC_HOST || ''

  return c.render(
    <HomePage cities={cities} />,
    {
      title: 'PHANTOM TYPE',
      description: 'Japan photo gallery',
      ogImage: `${publicHost}/ogkyoto.jpg`,
      ogUrl: publicHost,
    }
  )
})

// City pages
app.get('/:city', (c) => {
  const city = c.req.param('city')
  const cities: City[] = citiesData as City[]
  const cityPics = cities.find((p) => p.city === city)

  if (!cityPics) {
    return c.notFound()
  }

  const publicHost = c.env?.PUBLIC_HOST || process.env.PUBLIC_HOST || ''
  const ogImage = `${publicHost}${cityPics.locations[0].pics[0].url}`

  return c.render(
    <CityPage city={city} cityPics={cityPics} cities={cities} />,
    {
      title: `PHANTOM TYPE - ${city.toUpperCase()}`,
      description: 'Japan photo gallery',
      ogImage: ogImage,
      ogUrl: `${publicHost}/${city}`,
    }
  )
})

export default app
