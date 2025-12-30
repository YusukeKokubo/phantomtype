import { Nav } from "../components/Nav"
import type { City } from "../../@types/Photo"

export default function HomePage({ cities }: { cities: City[] }) {
  return (
    <>
      <div class="absolute w-screen h-screen top-0">
        <img
          class="object-cover w-full h-full"
          alt="kyoto shimogamo"
          src="/kyoto.jpg"
        />
      </div>
      <section class="absolute w-screen h-screen flex flex-col-reverse justify-around">
        <div class="mx-8 lg:mx-16 grid grid-cols-1 gap-16">
          <div class="flex">
            <div>
              <h1 class="font-light text-5xl leading-none text-white!">
                PHANTOM TYPE
              </h1>
              <p class="font-light text-xl mt-2 text-white!">
                Japan Pics by
                <a
                  target="_blank"
                  class="font-normal mx-1 text-white!"
                  rel="noopener"
                  href="https://twitter.com/yusuke_kokubo"
                >
                  @yusuke_kokubo
                </a>
              </p>
            </div>
            <div>
              <img
                class="inline w-32 mx-4"
                src="/logomark-white.svg"
                alt="phantomtype logo"
              />
            </div>
          </div>
          <Nav cities={cities} />
        </div>
        <div />
      </section>
    </>
  )
}
