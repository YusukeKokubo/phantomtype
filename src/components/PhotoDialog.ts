import type { Photo } from "../../@types/Photo"
import { calcSize } from "../lib/calc-size"

type State =
  | { type: "closed" }
  | { type: "open"; index: number; savedScrollY: number }

export class PhotoDialog {
  private state: State = { type: "closed" }
  private readonly dialog: HTMLDialogElement
  private readonly lqipBgEl: HTMLDivElement
  private readonly imgEl: HTMLImageElement
  private readonly exifTbody: HTMLTableSectionElement
  private readonly prevBtn: HTMLButtonElement
  private readonly nextBtn: HTMLButtonElement

  constructor(
    private readonly photos: Photo[],
    private readonly city: string,
  ) {
    this.dialog = document.createElement("dialog")
    this.dialog.className =
      "fixed inset-0 m-0 w-full h-full max-w-full max-h-full p-0 bg-background border-none overflow-hidden"
    this.dialog.innerHTML = `
      <div class="flex flex-col h-full">
        <nav class="flex items-center justify-between px-4 py-3 shrink-0" aria-label="写真ナビゲーション">
          <button data-action="close" class="text-text-secondary hover:text-foreground text-lg uppercase focus-visible:outline-2 focus-visible:outline-offset-2">← ${city}</button>
          <div class="flex gap-4">
            <button data-action="prev" class="text-text-secondary hover:text-foreground text-lg disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2" aria-label="前の写真">←</button>
            <button data-action="next" class="text-text-secondary hover:text-foreground text-lg disabled:opacity-30 focus-visible:outline-2 focus-visible:outline-offset-2" aria-label="次の写真">→</button>
          </div>
        </nav>
        <div class="flex-1 overflow-y-auto px-4 pb-4 flex flex-col gap-3">
          <div data-role="photo-wrap" class="relative overflow-hidden mx-auto w-max max-w-full">
            <div data-role="lqip-bg" class="absolute inset-0 bg-cover bg-center scale-110 blur-lg hidden" aria-hidden="true"></div>
            <img data-role="photo" src="" alt="" class="relative w-auto h-auto max-w-full max-h-[calc(100svh-11rem)] mx-auto block" />
          </div>
          <table class="w-full"><tbody data-role="exif"></tbody></table>
        </div>
      </div>`

    this.lqipBgEl = this.dialog.querySelector<HTMLDivElement>("[data-role='lqip-bg']")!
    this.imgEl = this.dialog.querySelector<HTMLImageElement>("[data-role='photo']")!
    this.exifTbody = this.dialog.querySelector<HTMLTableSectionElement>("[data-role='exif']")!
    this.prevBtn = this.dialog.querySelector<HTMLButtonElement>("[data-action='prev']")!
    this.nextBtn = this.dialog.querySelector<HTMLButtonElement>("[data-action='next']")!

    document.body.appendChild(this.dialog)
    this.setupListeners()
    history.replaceState({ type: "gallery", scrollY: window.scrollY }, "")
  }

  // ── 公開遷移メソッド ─────────────────────────────────────

  open(index: number): void {
    const scrollY = window.scrollY
    history.replaceState({ type: "gallery", scrollY }, "")
    history.pushState({ type: "photo", index }, "", this.photoUrl(index))
    this.transition({ type: "open", index, savedScrollY: scrollY })
  }

  close(): void {
    if (this.state.type !== "open") return
    const { savedScrollY } = this.state
    history.replaceState({ type: "gallery", scrollY: savedScrollY }, "", `/${this.city}`)
    this.transition({ type: "closed" })
    window.scrollTo(0, savedScrollY)
  }

  navigate(index: number): void {
    if (this.state.type !== "open") return
    history.replaceState({ type: "photo", index }, "", this.photoUrl(index))
    this.transition({ type: "open", index, savedScrollY: this.state.savedScrollY })
  }

  destroy(): void {
    window.removeEventListener("popstate", this.handlePopState)
    this.dialog.remove()
  }

  // ── プライベート ─────────────────────────────────────────

  private transition(next: State): void {
    this.state = next
    if (next.type === "open") {
      this.render(next.index)
      if (!this.dialog.open) this.dialog.showModal()
    } else if (this.dialog.open) {
      this.dialog.close()
    }
  }

  private getCardLink(filename: string): HTMLAnchorElement | null {
    return document.querySelector<HTMLAnchorElement>(
      `[data-filename="${CSS.escape(filename)}"]`,
    )
  }

  private getLqipFromDom(filename: string): string | undefined {
    return this.getCardLink(filename)?.dataset.lqip
  }

  private getImageSrcFromDom(filename: string): string | undefined {
    const img = this.getCardLink(filename)?.querySelector("img")
    return img?.currentSrc || img?.src || undefined
  }

  private applyLqip(filename: string): void {
    const lqip = this.getLqipFromDom(filename)

    this.imgEl.removeAttribute("data-lqip")
    delete this.imgEl.dataset.lqipLoaded
    this.lqipBgEl.classList.add("hidden")
    this.lqipBgEl.style.backgroundImage = ""

    if (!lqip) return

    this.lqipBgEl.style.backgroundImage = `url(${lqip})`
    this.lqipBgEl.classList.remove("hidden")
    this.imgEl.setAttribute("data-lqip", "")
  }

  private render(index: number): void {
    const photo = this.photos[index]
    const exif = photo.exif!
    const { width, height } = calcSize(exif, 1920, 1080)

    this.applyLqip(photo.filename)

    this.imgEl.onload = () => {
      if (this.state.type === "open" && this.photos[this.state.index]?.filename === photo.filename) {
        this.imgEl.dataset.lqipLoaded = ""
      }
    }

    const src = this.getImageSrcFromDom(photo.filename)
    if (!src) throw new Error(`Missing optimized src in DOM for ${photo.filename}`)
    this.imgEl.src = src
    this.imgEl.width = width
    this.imgEl.height = height
    this.imgEl.alt = `${this.city} ${photo.location}の写真`

    if (this.imgEl.hasAttribute("data-lqip") && this.imgEl.complete) {
      this.imgEl.dataset.lqipLoaded = ""
    }

    this.prevBtn.disabled = index === 0
    this.nextBtn.disabled = index === this.photos.length - 1

    this.exifTbody.innerHTML = (
      [
        ["撮影日時", exif.DateTimeOriginal],
        ["カメラ", `${exif.Make} ${exif.Model}`],
        ["レンズ", exif.LensModel.replace(/\0/g, "")],
        ["絞り", String(exif.FNumber)],
        ["焦点距離", `${exif.FocalLength} (${exif.FocalLengthIn35mmFormat} mm)`],
        ["シャッター速度", `${exif.ExposureTime}S`],
        ["ISO", `ISO ${exif.ISO}`],
      ] as [string, string][]
    )
      .map(
        ([label, value]) => `
        <tr class="border-b border-border">
          <th scope="row" class="text-text-secondary text-right pr-4 py-1 font-normal">${label}</th>
          <td class="text-foreground py-1">${value}</td>
        </tr>`,
      )
      .join("")
  }

  private photoUrl(index: number): string {
    return `/${this.city}/photo/${encodeURIComponent(this.photos[index].filename)}`
  }

  private readonly handlePopState = (e: PopStateEvent): void => {
    if (e.state?.type === "gallery") {
      this.transition({ type: "closed" })
      window.scrollTo(0, e.state.scrollY || 0)
    } else if (e.state?.type === "photo") {
      const savedScrollY = this.state.type === "open" ? this.state.savedScrollY : 0
      this.transition({ type: "open", index: e.state.index as number, savedScrollY })
    }
  }

  private setupListeners(): void {
    document.querySelectorAll<HTMLAnchorElement>("[data-filename]").forEach((link) => {
      link.addEventListener("click", (e) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        const index = this.photos.findIndex((p) => p.filename === link.dataset.filename)
        if (index !== -1) this.open(index)
      })
    })

    this.dialog.querySelector("[data-action='close']")!.addEventListener("click", () => this.close())
    this.prevBtn.addEventListener("click", () => {
      if (this.state.type === "open" && this.state.index > 0) this.navigate(this.state.index - 1)
    })
    this.nextBtn.addEventListener("click", () => {
      if (this.state.type === "open" && this.state.index < this.photos.length - 1)
        this.navigate(this.state.index + 1)
    })

    this.dialog.addEventListener("keydown", (e) => {
      if (this.state.type !== "open") return
      if (e.key === "ArrowLeft" && this.state.index > 0) this.navigate(this.state.index - 1)
      else if (e.key === "ArrowRight" && this.state.index < this.photos.length - 1)
        this.navigate(this.state.index + 1)
    })

    this.dialog.addEventListener("cancel", (e) => {
      e.preventDefault()
      this.close()
    })

    window.addEventListener("popstate", this.handlePopState)
  }
}
