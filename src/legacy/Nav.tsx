import type { City } from "../../@types/Photo"

export const Header = ({ city, cities }: { city: string; cities: City[] }) => {
  return (
    <nav
      class="flex px-5 w-full justify-between bg-surface"
      aria-label="メインナビゲーション"
    >
      <div class="mt-2">
        <a href="/" aria-label="トップページへ戻る">
          <img
            class="inline align-baseline w-8 mr-1"
            src="/logomark-white.svg"
            alt="PHANTOM TYPE ロゴ"
          />
          <span class="hidden md:inline leading-loose text-2xl">
            PHANTOM TYPE
          </span>
        </a>
      </div>
      <div class="flex flex-col md:flex-row md:gap-4 items-center justify-center">
        {cities.map((c) => (
          <a
            href={`/${c.city}`}
            key={c.city}
            aria-current={c.city === city ? "page" : undefined}
          >
            <span
              class={`text-lg uppercase ${
                c.city == city ? "text-foreground" : "text-text-secondary"
              } hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2`}
            >
              {c.city}
            </span>
          </a>
        ))}
      </div>
    </nav>
  )
}

export const Nav = ({ city, cities }: { city?: string; cities: City[] }) => {
  return (
    <nav
      class="flex flex-col gap-4 md:flex-row md:gap-8 items-center justify-center"
      aria-label="都市選択ナビゲーション"
    >
      {cities
        .filter((c) => c.city !== city)
        .map((c) => {
          const examplePic = c.locations[0]?.pics[0]
          if (!examplePic) return null
          return (
            <a
              href={`/${c.city}`}
              key={c.city}
              class="relative focus-visible:outline-2 focus-visible:outline-offset-2"
              aria-label={`${c.city}の写真を見る`}
            >
              <img
                src={examplePic.url}
                width={200}
                height="auto"
                class="w-12 md:w-32"
                alt={`${c.city}のサムネイル画像`}
              />
              <span class="top-0 absolute bg-surface-overlay px-4 text-lg uppercase text-foreground hover:underline">
                {c.city}
              </span>
            </a>
          )
        })}
    </nav>
  )
}
