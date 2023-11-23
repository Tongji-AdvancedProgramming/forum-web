import { defineConfig } from "vite"
import { resolve } from "path"
import vue from "@vitejs/plugin-vue"
import Components from "unplugin-vue-components/vite"
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers"
import { prismjsPlugin } from "vite-plugin-prismjs"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      dts: true,
      resolvers: [
        AntDesignVueResolver({
          importStyle: false, // css in js
        }),
      ],
    }),
    prismjsPlugin({
      theme: "coy",
      languages: ["java", "clike", "c#", "rust", "go", "javascript"],
      plugins: ["toolbar", "line-numbers", "show-language", "copy-to-clipboard", "match-braces"],
    }),
    eslintPlugin({
      include: ["src/**/*.ts", "src/**/*.vue", "src/*.ts", "src/*.vue"],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:9001",
        changeOrigin: true,
        secure: false,
        ws: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
