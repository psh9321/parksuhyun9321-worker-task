import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["index.ts"],
    format: ["esm", "cjs"],
    splitting: false,
    sourcemap: false,
    clean: true,
    external: ["react"],
    outDir: "dist",
    dts : true,
    outExtension({ format }) {
        return {
            js: format === "esm" ? ".mjs" : ".cjs",
        };
    },
});
