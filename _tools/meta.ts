import { BuildOptions } from "https://deno.land/x/dnt@0.33.1/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  compilerOptions: {
    lib: ["esnext", "dom"],
  },
  typeCheck: true,
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  package: {
    name: "@httpland/http-etag",
    version,
    description: "ETag middleware for standard Request and Response",
    keywords: [
      "http",
      "middleware",
      "etag",
      "hash",
      "entity",
      "handler",
      "request",
      "response",
    ],
    license: "MIT",
    homepage: "https://github.com/httpland/http-etag",
    repository: {
      type: "git",
      url: "git+https://github.com/httpland/http-etag.git",
    },
    bugs: {
      url: "https://github.com/httpland/http-etag/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: { access: "public" },
  },
  packageManager: "pnpm",
});
