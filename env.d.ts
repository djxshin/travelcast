/// <reference types="next" />
/// <reference types="next/env" />

declare namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_OPENWEATHER_KEY: string
    }
  }
  