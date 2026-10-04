// Builds the one-page A4 PDF CV from the same data as the homepage (src/data/cv.ts).
// Served at /PereSoler_CV.pdf by src/pages/PereSoler_CV.pdf.ts.
import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import { cv } from '../data/cv';

// Small copy of the profile photo; the website's full-size one would bloat the PDF.
const AVATAR = fs.readFileSync(path.join(process.cwd(), 'src/data/cv-avatar.jpg'));

const contacts = [
	[`• ${cv.location}`, `• ${cv.phone}`],
	[`• ${cv.email}`, `• ${cv.linkedin}`],
];
const about = cv.about.replaceAll('**', '');

// ── Style ──
const C = {
	ink: '#0f0e17',
	accent: '#6366f1',
	muted: '#6b7280',
	light: '#9ca3af',
	rule: '#e5e7eb',
};
const F = { reg: 'Helvetica', bold: 'Helvetica-Bold', ital: 'Helvetica-Oblique' };
const L = 46;
const R = 549.28;
const W = R - L;
const BULLET_X = 56;
const BULLET_W = R - BULLET_X;
const BULLET_STEP = 10.3; // between bullets
const WRAP_STEP = 9.6; // wrapped line inside a bullet

export function buildCvPdf(): Promise<Buffer> {
	const doc = new PDFDocument({ size: 'A4', margin: 0, info: { Title: `${cv.name} — CV`, Author: cv.name } });
	const chunks: Buffer[] = [];
	doc.on('data', (c: Buffer) => chunks.push(c));
	const done = new Promise<Buffer>((resolve, reject) => {
		doc.on('end', () => resolve(Buffer.concat(chunks)));
		doc.on('error', reject);
	});

	// Draw text with its alphabetic baseline at y.
	function text(str: string, x: number, y: number, font: string, size: number, color: string, opts: PDFKit.Mixins.TextOptions = {}) {
		doc.font(font).fontSize(size).fillColor(color);
		doc.text(str, x, y, { lineBreak: false, baseline: 'alphabetic', ...opts });
	}
	function textRight(str: string, y: number, font: string, size: number, color: string) {
		doc.font(font).fontSize(size);
		text(str, R - doc.widthOfString(str), y, font, size, color);
	}
	function wrap(str: string, width: number, font: string, size: number) {
		doc.font(font).fontSize(size);
		const lines: string[] = [];
		let line = '';
		for (const word of str.split(' ')) {
			const next = line ? `${line} ${word}` : word;
			if (line && doc.widthOfString(next) > width) {
				lines.push(line);
				line = word;
			} else line = next;
		}
		lines.push(line);
		return lines;
	}
	function hrule(y: number, width: number, color: string) {
		doc.moveTo(L, y).lineTo(R, y).lineWidth(width).strokeColor(color).stroke();
	}
	function label(str: string, x: number, y: number) {
		text(str.toUpperCase(), x, y, F.bold, 6.5, C.accent, { characterSpacing: 1.1 });
	}

	// ── Header ──
	const cx = 515.28, cy = 66, r = 34;
	doc.save().circle(cx, cy, r).clip().image(AVATAR, cx - r, cy - r, { width: 2 * r, height: 2 * r }).restore();
	doc.circle(cx, cy, r).lineWidth(1.8).strokeColor(C.accent).stroke();

	text(cv.name, L, 50.67, F.bold, 26, C.ink);
	text(cv.title, L, 70.26, F.bold, 11.5, C.accent);
	text(cv.tagline, L, 82.74, F.reg, 8, C.muted);
	contacts.forEach(([a, b], i) => {
		text(a, L, 96.38 + i * 11, F.reg, 7.5, C.muted);
		text(b, 257.64, 96.38 + i * 11, F.reg, 7.5, C.muted);
	});
	hrule(121, 1.2, C.accent);

	// ── About ──
	label('About', L, 131.67);
	let y = 143.05;
	const aboutLines = wrap(about, W, F.reg, 8.8);
	aboutLines.forEach((ln, i) => {
		const last = i === aboutLines.length - 1;
		doc.font(F.reg).fontSize(8.8);
		const words = ln.split(' ');
		const spacing = last ? 0 : (W - doc.widthOfString(ln)) / (words.length - 1);
		text(ln, L, y, F.reg, 8.8, C.muted, { wordSpacing: spacing });
		if (!last) y += 11.3;
	});
	y += 11.36;
	hrule(y, 0.4, C.rule);

	// ── Experience ──
	y += 9.67;
	label('Career', L, y);
	y += 14.4;
	text('Experience', L, y, F.bold, 13, C.ink);
	y += 15.5;
	cv.jobs.forEach((job, j) => {
		const top = y;
		text(job.company, 54, y, F.bold, 10, C.ink);
		textRight(job.period, y - 1.43, F.bold, 8, C.accent);
		text(job.role, 54, y + 11.2, F.ital, 8.5, C.muted);
		textRight(job.location, y + 10.5, F.reg, 7.5, C.light);
		y += 23.2;
		job.bullets.forEach((b, i) => {
			if (i) y += BULLET_STEP;
			doc.font(F.reg).fontSize(8.3);
			const indent = doc.widthOfString('• ');
			text('•', BULLET_X, y, F.reg, 8.3, C.muted);
			wrap(b, BULLET_W - indent, F.reg, 8.3).forEach((ln, k) => {
				if (k) y += WRAP_STEP;
				text(ln, BULLET_X + indent, y, F.reg, 8.3, C.muted);
			});
		});
		y += 12;
		doc.rect(L, top - 7.18, 2.5, y - 6 - (top - 7.18)).fill(C.accent);
		text(job.tags.map((t) => `[${t}]`).join('  '), BULLET_X, y, F.reg, 7, C.accent);
		y += 8;
		hrule(y, 0.35, C.rule);
		if (j < cv.jobs.length - 1) y += 9.5;
	});

	// ── Skills ──
	y += 8.67;
	label('Skills', L, y);
	y += 14.4;
	text('Technical Skills', L, y, F.bold, 13, C.ink);
	y += 15;
	cv.skills.forEach(({ name: k, items }, i) => {
		const v = items.join(' · ');
		if (i) y += 11.2;
		text(k, L, y, F.bold, 7.5, C.muted);
		text(v, 168, y + 0.36, F.reg, 8, C.ink);
	});
	y += 11.5;
	hrule(y, 0.4, C.rule);

	// ── Education & Languages ──
	y += 9.67;
	const colX = 337.77;
	label('Education', L, y);
	label('Languages', colX, y);
	let ey = y + 11.8;
	cv.education.forEach(({ year, degree, school }, i) => {
		if (i) ey += 14;
		text(year, L, ey, F.bold, 7.5, C.accent);
		text(degree, L + 24, ey, F.bold, 9, C.ink);
		text(school, L + 24, ey + 10.9, F.reg, 7.5, C.muted);
		ey += 10.9;
	});
	let ly = y + 11.8;
	cv.languages.forEach(({ name: lang, label: level }, i) => {
		if (i) ly += 12.4;
		text(lang, colX, ly, F.bold, 9, C.ink);
		text(level, colX + 48, ly, F.reg, 8, C.muted);
	});

	const bottom = Math.max(ey, ly);
	if (bottom > 841.89 - 20) {
		throw new Error(`The CV no longer fits on one A4 page (bottom baseline ${bottom.toFixed(1)}). Shorten src/data/cv.ts or tighten the layout in src/lib/cv-pdf.ts.`);
	}
	doc.end();
	return done;
}
