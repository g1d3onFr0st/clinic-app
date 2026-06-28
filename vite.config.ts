import { defineConfig } from "vite"
import { devtools } from "@tanstack/devtools-vite"
import tsconfigPaths from "vite-tsconfig-paths"

import { tanstackStart } from "@tanstack/react-start/plugin/vite"
// vite-plugin-svgr
import viteReact from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { nitro } from "nitro/vite"

const config = defineConfig({
  plugins: [
    tanstackStart({
      spa: {
        enabled: true,
      },
    }),
    viteReact(),
    devtools({
      injectSource: {
        enabled: false,
      },
    }),
    tsconfigPaths({ projects: ["./tsconfig.json"] }),
    tailwindcss(),
    nitro({ preset: "node-server" }),
  ],
  server: {
    port: 8000,
  },
})

export default config
