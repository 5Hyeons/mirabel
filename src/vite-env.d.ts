/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LIVEKIT_URL: string
  readonly VITE_ROOM_PREFIX: string
  readonly VITE_TOKEN_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Audio file modules
declare module '*.wav' {
  const src: string;
  export default src;
}

declare module '*.mp3' {
  const src: string;
  export default src;
}
