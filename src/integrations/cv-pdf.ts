// Generates /PereSoler_CV.pdf from src/data/cv.ts on every build, and serves it live in `astro dev`.
// Runs in Node outside the Vite bundle because pdfkit needs its font files from node_modules.
import type { AstroIntegration } from 'astro';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { buildCvPdf } from '../lib/cv-pdf';

const FILE = 'PereSoler_CV.pdf';

export default function cvPdf(): AstroIntegration {
	return {
		name: 'cv-pdf',
		hooks: {
			'astro:server:setup': ({ server }) => {
				server.middlewares.use(`/${FILE}`, async (_req, res, next) => {
					try {
						const pdf = await buildCvPdf();
						res.setHeader('Content-Type', 'application/pdf');
						res.end(pdf);
					} catch (err) {
						next(err);
					}
				});
			},
			'astro:build:done': async ({ dir, logger }) => {
				const out = new URL(FILE, dir);
				await fs.writeFile(out, await buildCvPdf());
				logger.info(`Wrote ${fileURLToPath(out)}`);
			},
		},
	};
}
