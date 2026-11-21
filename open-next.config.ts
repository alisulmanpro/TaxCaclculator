import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default config: the calculator pages are static, so no cache bindings (R2/KV) are needed.
export default defineCloudflareConfig();
