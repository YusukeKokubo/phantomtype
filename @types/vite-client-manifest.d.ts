declare module "virtual:client-manifest" {
  const manifest: Record<
    string,
    {
      file: string
      src?: string
      isEntry?: boolean
    }
  >
  export default manifest
}
