import { defineConfig } from "vite";
import wasm from 'vite-plugin-wasm';

export default defineConfig({
  plugins: [wasm()],
  root: "src",
  build: {
    target: 'esnext',
    emptyOutDir: true,
    outDir: "../dist",
  },
});
