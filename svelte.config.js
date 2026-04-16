import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter(),
    // Поки не деплоїмо на GitHub Pages, base краще залишити порожнім
    paths: {
      base: "",
    },
    alias: {
      $lib: "./src/lib",
      "$lib/*": "./src/lib/*",
      $components: "./src/lib/components",
      "$components/*": "./src/lib/components/*",
      $server: "./src/lib/server",
      "$server/*": "./src/lib/server/*",
      $types: "./src/lib/types",
      "$types/*": "./src/lib/types/*",
      $stores: "./src/lib/stores",
      "$stores/*": "./src/lib/stores/*",
      $utils: "./src/lib/utils",
      "$utils/*": "./src/lib/utils/*",
    },
  },
  compilerOptions: {
    runes: true,
  },
};

export default config;
