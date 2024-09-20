import {defineConfig} from "vite";
import wasm from 'vite-plugin-wasm'

export default defineConfig({
    plugins: [wasm()],
    base: "rapier-three-trimesh-bug",
    build: {
        target: "esnext"
    },
    optimizeDeps: {
        noDiscovery: true
    }
})