
import { build } from "bun";
import dts from "bun-plugin-dts";

await build({
    entrypoints: ["./src/index.ts"],
    minify: true,
    format: "esm",
    target: "node",
    outdir: "dist",
    plugins: [ dts() ],
    naming: "index.mjs"
})

await build({
    entrypoints: ["./src/index.ts"],
    minify: true,
    format: "cjs",
    target: "node",
    outdir: "dist",
    naming: "index.cjs"
})
