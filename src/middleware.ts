import { defineMiddleware } from "astro:middleware"

export const onRequest = defineMiddleware((context, next) => {
  const { pathname } = context.url

  if (pathname !== "/" && pathname.endsWith("/")) {
    const url = new URL(context.url)
    url.pathname = pathname.slice(0, -1)
    return context.redirect(url.toString(), 301)
  }

  return next()
})
