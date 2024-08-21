#!/usr/bin/env node

import process from "process";
import * as esbuild from "esbuild";


let watch = process.argv.includes("--watch");
let minify = process.argv.includes("--minify");
let disable_sourcemap = process.argv.includes("--sourcemap=no");
let build_sourcemap = disable_sourcemap ? null : { sourcemap: "inline" };

const fontLoader = "copy";

const buildConfig = {
    tsconfig: "tsconfig.json",
    entryPoints: ["./src/index.ts"],
    bundle: true,
    outdir: "./dist",
    ...build_sourcemap,
    platform: "browser",
    loader: {
        ".woff": fontLoader,
        ".woff2": fontLoader,
        ".ttf": fontLoader,
        ".grammar": "file"
    },
    minify
};

if (watch) {
    let ctx = await esbuild.context({...buildConfig, logLevel: "info"});
    await ctx.watch();
} else {
    esbuild.build(buildConfig).then(() => {
        console.log("[build] build finished");
    }).catch((error) => {
        console.error("[build] build failed");
    });
}