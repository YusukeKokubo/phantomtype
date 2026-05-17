import { Nav } from "../components/Nav"
import type { City } from "../../@types/Photo"

export default function HomePage({ cities }: { cities: City[] }) {
  return (
    <>
      <a href="#main-content" class="skip-link">
        メインコンテンツへスキップ
      </a>
      <div
        class="absolute w-screen h-screen top-0"
        role="presentation"
        aria-hidden="true"
      >
        <img class="object-cover w-full h-full" alt="" src="/kyoto.jpg" />
      </div>
      <section class="absolute w-screen h-screen flex flex-col-reverse justify-around">
        <main id="main-content" class="mx-8 lg:mx-16 grid grid-cols-1 gap-16">
          <div class="flex">
            <div>
              <h1 class="font-light text-5xl leading-none text-white!">
                PHANTOM TYPE
              </h1>
              <p class="font-light text-xl mt-2 text-white!">
                Japan Pics by
                <a
                  target="_blank"
                  class="font-normal mx-1 text-white! focus-visible:outline-2 focus-visible:outline-offset-2"
                  rel="noopener noreferrer"
                  href="https://twitter.com/yusuke_kokubo"
                  aria-label="作者のTwitterアカウント（新しいタブで開きます）"
                >
                  @yusuke_kokubo
                </a>
              </p>
            </div>
            <div>
              <img
                class="inline w-32 mx-4"
                src="/logomark-white.svg"
                alt="PHANTOM TYPE ロゴ"
              />
            </div>
          </div>
          <Nav cities={cities} />
        </main>
        <div />
      </section>
    </>
  )
}
