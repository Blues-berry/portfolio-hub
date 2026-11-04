import { defineConfig } from "vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const locale = process.env.GAME_LOCALE ?? "zh";
const source = process.env.GAME_SOURCE ?? "src";

const localizedIndex = {
  name: "stellar-forge-index-localization",
  transformIndexHtml(html: string) {
    if (locale !== "en") return html;
    return html
      .replace('<html lang="zh-CN">', '<html lang="en">')
      .replace('content="星核熔炉 — 融合、元素塔防与星海冒险。"', 'content="STELLAR FORGE — Merge elemental star cores, defend against the Void, and survive the waves."')
      .replace("<title>星核熔炉 · STELLAR FORGE</title>", "<title>STELLAR FORGE</title>")
      .replace('src="/src/main.tsx"', `src="/${source}/main.tsx"`);
  },
};

export default defineConfig({
  root,
  base: process.env.GAME_BASE || "/project-demos/game1/",
  plugins: [localizedIndex],
  resolve: {
    alias: { "@": path.resolve(root, source) },
  },
  build: {
    outDir: path.resolve(root, process.env.GAME_OUT_DIR || "dist"),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("lucide-react")) return "vendor-icons";
          if (id.includes("zustand")) return "vendor-state";
          if (id.includes("react")) return "vendor-react";
        },
      },
    },
  },
});
