/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MEDIUM_API: string
    readonly VITE_TINYMCE_KEY: string
    readonly VITE_GOOGLE_AUTH_KEY: string
    readonly VITE_GOOGLE_AUTH_SECRET: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}