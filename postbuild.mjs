// postbuild.mjs
// Minimal post-build for Vercel SPA hosting.
// The Lovable TanStack template builds via Nitro to .output/ for Cloudflare.
// For a static Vercel deploy, this script copies the prerendered client
// assets to ./dist and ensures a SPA fallback index.html exists.
//
// NOTE: This is a best-effort static deploy. Server functions
// (createServerFn) require an SSR runtime and will not work on a static
// Vercel deployment without rewriting them as Vercel Functions.

import { existsSync, mkdirSync, cpSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const dist = join(root, "dist");

const candidates = [
  join(root, ".output", "public"),
  join(root, ".tanstack", "start", "build", "client-dist"),
  join(root, "dist", "client"),
];

const source = candidates.find((p) => existsSync(p));

if (!source) {
  console.warn("[postbuild] No build output found in:", candidates);
  process.exit(0);
}

if (!existsSync(dist)) mkdirSync(dist, { recursive: true });
cpSync(source, dist, { recursive: true });
console.log(`[postbuild] Copied ${source} -> ${dist}`);

// Ensure SPA fallback
const indexHtml = join(dist, "index.html");
if (!existsSync(indexHtml)) {
  const fallback =
    existsSync(join(source, "200.html")) ? readFileSync(join(source, "200.html"), "utf8") : null;
  if (fallback) {
    writeFileSync(indexHtml, fallback);
    console.log("[postbuild] Wrote SPA fallback index.html");
  }
}
