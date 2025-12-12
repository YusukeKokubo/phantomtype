import { City } from "../../@types/Photo"

export const Header = ({ city, cities }: { city: string; cities: City[] }) => {
  return (
    <section class="flex px-5 w-full justify-between bg-black">
      <div class="mt-2">
        <a href="/">
          <img
            class="inline align-baseline w-8 mr-1"
            src="/logomark-white.svg"
            alt="link to top"
          />
          <span class="hidden md:inline leading-loose text-2xl">
            PHANTOM TYPE
          </span>
        </a>
      </div>
      <div class="flex flex-col md:flex-row md:gap-4 items-center justify-center">
        {cities.map((c) => (
          <a href={`/${c.city}`} key={c.city}>
            <span
              class={`text-lg uppercase ${
                c.city == city ? "text-white" : "text-gray-500"
              } hover:text-white`}
            >
              {c.city}
            </span>
          </a>
        ))}
      </div>
    </section>
  )
}

export const Nav = ({ city, cities }: { city?: string; cities: City[] }) => {
  return (
    <div class="flex flex-col gap-4 md:flex-row md:gap-8 items-center justify-center">
      {cities
        .filter((c) => c.city !== city)
        .map((c) => {
          const examplePic = c.locations[0].pics[0]
          return (
            <a href={`/${c.city}`} key={c.city} class="relative">
              <img
                src={examplePic.url}
                width={200}
                height="auto"
                class="w-12 md:w-32"
              />
              <span class="top-0 absolute bg-black bg-opacity-50 px-4 text-lg uppercase text-white hover:underline">
                {c.city}
              </span>
            </a>
          )
        })}
    </div>
  )
}
