import { defineConfig } from "vite";
import path from "path";
import babel from "@rollup/plugin-babel";

export default defineConfig({
  optimizeDeps: {
    include: [
      "src/loadConfig.js",
      "src/parse.js",
      "src/render.js",
      "src/report.js",
    ],
  },
  build: {
    lib: {
      entry: path.resolve("src", "index.js"),
      name: "Screenplayyy",
      formats: ["es", "cjs"],
      fileName: (format) =>
        format === "es" ? "screenplayyy.esm.js" : "screenplayyy.cjs.js",
    },
    rollupOptions: {
      input: path.resolve("src", "index.js"),
      output: {
        inlineDynamicImports: true,
        manualChunks: null, // Ensure no extra chunks are created
      },
      plugins: [
        babel({
          exclude: "node_modules/**", // Exclude node_modules from Babel transpiling
          babelHelpers: "bundled",
          presets: ["@babel/preset-env"],
        }),
      ],
      treeshake: {
        moduleSideEffects: true, // Allow side effects to be removed if not used
      },
    },
  },
});
