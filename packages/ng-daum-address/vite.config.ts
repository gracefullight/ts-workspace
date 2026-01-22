import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "NgDaumAddress",
      fileName: "ng-daum-address",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["@angular/core", "@angular/common", "@angular/platform-browser", "rxjs"],
      output: {
        globals: {
          "@angular/core": "ng.core",
          "@angular/common": "ng.common",
          "@angular/platform-browser": "ng.platformBrowser",
        },
      },
    },
    outDir: "dist",
    emptyOutDir: false,
    sourcemap: true,
    minify: false,
  },
});
