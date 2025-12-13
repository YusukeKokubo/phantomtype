import 'hono'

type AppEnv = {
  Bindings: {
    PUBLIC_HOST?: string
  }
}

declare module 'hono' {
  interface ContextVariableMap {
    title?: string
    description?: string
    ogImage?: string
    ogUrl?: string
  }
}

export type { AppEnv }

