import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        content: "src/content.ts",
      },
      output: {
        entryFileNames: "content.js",
        format: "iife", // Immediately Invoked Function Expression for browser compatibility
      },
    },
    target: "es2017",
  },
});
