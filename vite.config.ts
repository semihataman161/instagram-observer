import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        content: "src/content.ts",
        webAccessibleResource: "src/web.accessible.resource.ts",
      },
      output: {
        entryFileNames: "[name].js",
        format: "es",
        inlineDynamicImports: false,
      },
    },
    target: "es2017",
  },
});
