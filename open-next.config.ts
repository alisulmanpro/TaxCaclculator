import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default config: the calculator pages are static, so no cache bindings (R2/KV) are needed.
// `pnpm run build` runs `opennextjs-cloudflare build`, which calls this plain Next.js build first.
// (Without buildCommand it would call `pnpm run build` again and loop.)
const config = {
  ...defineCloudflareConfig(),
  buildCommand: "next build",
};

export default config;
