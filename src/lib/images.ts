import type { ImageMetadata } from "astro"

const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "/src/assets/pics/**/*.{jpg,JPG,jpeg,JPEG}",
)

export async function loadImage(assetPath: string): Promise<ImageMetadata> {
  const loader = imageModules[assetPath]
  if (!loader) {
    const available = Object.keys(imageModules)
      .filter((key) => key.includes(assetPath.split("/").pop() ?? ""))
      .slice(0, 5)
    throw new Error(
      `Image not found: ${assetPath}${available.length ? ` (similar: ${available.join(", ")})` : ""}`,
    )
  }
  return (await loader()).default
}
