// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";
import cvPdf from "./src/integrations/cv-pdf";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [mdx(), sitemap(), cvPdf()],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
