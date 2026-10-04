// Generates PereSoler_CV.pdf (one A4 page) from the same content as the website (src/pages/index.astro).
// Usage: cd cv && npm install && npm run build
import PDFDocument from 'pdfkit';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

// ── Content (keep in sync with src/pages/index.astro) ──
const cv = {
	name: 'Pere Soler',
	title: 'Full-Stack Software Developer',
	tagline: 'Frontend · Backend · API Design · Web Applications',
	contacts: [
		['• Catalonia, Spain', '• +34 608 760 927'],
		['• peree.sooler@gmail.com', '• linkedin.com/in/peresolerrigau'],
	],
	about:
		"Full-Stack Developer with hands-on experience building web applications end-to-end — from crafting responsive, user-facing interfaces to designing and shipping robust RESTful APIs and backend services in C# and .NET. I care deeply about clean architecture, SOLID principles, and writing code that's as maintainable as it is performant. Whether it's wiring up a front-end, architecting a database schema, or integrating LLM-powered features and AI tooling into backend services, I bring a full-stack mindset to every project.",
	jobs: [
		{
			company: 'Hitachi Energy',
			role: 'Technical Support Specialist — .NET & SQL',
			period: 'Mid 2026 – Present',
			location: 'Barcelona, Spain · Hybrid',
			bullets: [
				'Providing technical support and development expertise in .NET Framework and SQL across enterprise energy management systems.',
				'Diagnosing and resolving application issues in a hybrid environment, collaborating with cross-functional teams to ensure system reliability.',
				'Supporting internal tooling and backend services built on .NET, maintaining data integrity through SQL database management.',
			],
			tags: ['.NET Framework', 'SQL', 'Technical Support', 'Barcelona'],
		},
		{
			company: 'Concentrix',
			role: 'Support Engineer — Security & Compliance',
			period: '2025 – Mid 2026',
			location: 'Remote',
			bullets: [
				'Automated administrative tasks and compliance data reports using PowerShell scripting, reducing manual effort across daily security operations.',
				'Integrated with Microsoft Graph API to manage enterprise identities, permissions, and access controls at scale.',
				'Provided technical expertise in Microsoft Purview and Microsoft 365 security frameworks.',
				'Debugged and remediated compliance policies and information governance configurations.',
			],
			tags: ['PowerShell', 'Microsoft Graph API', 'Microsoft Purview', 'Microsoft 365'],
		},
		{
			company: 'Vueling Airlines / Vueling University',
			role: 'Backend .NET Developer',
			period: 'Late 2024',
			location: 'Viladecans, Spain',
			bullets: [
				'Developed high-performance WebAPIs using .NET Core and C# in a fast-paced airline tech environment.',
				'Applied SOLID design principles to deliver maintainable, scalable backend services.',
				'Utilized Entity Framework for database abstraction and ORM management.',
				'Implemented Unit Testing with xUnit/NUnit and Moq to enforce code quality standards.',
			],
			tags: ['.NET Core', 'C#', 'Entity Framework', 'xUnit', 'NUnit', 'Moq'],
		},
		{
			company: 'Garoina Comunicació',
			role: 'Software Programmer',
			period: '2023 – 2024',
			location: "Platja d'Aro, Spain",
			bullets: [
				'Developed and maintained full-stack applications with PHP, C#, and Angular across multiple client projects.',
				'Designed and optimized relational databases using SQL Server (SSMS) and MySQL.',
				'Documented and tested APIs using Swagger/OpenAPI, improving frontend-backend integration workflows.',
				'Managed version control and CI/CD pipelines via GitHub.',
			],
			tags: ['PHP', 'C#', 'Angular', 'SQL Server', 'MySQL', 'Swagger', 'CI/CD'],
		},
		{
			company: 'Cóndor Aretex SA',
			role: 'IT Programmer & Help Desk',
			period: 'Early 2022',
			location: 'Arenys de Mar, Spain',
			bullets: [
				'Built internal automation tools in Java and maintained legacy systems in COBOL.',
				'Provided technical troubleshooting and hardware/software support for company staff.',
			],
			tags: ['Java', 'COBOL', 'Help Desk'],
		},
	],
	skills: [
		['Backend & APIs', '.NET Core · C# · ASP.NET MVC · ASP.NET Core · Microsoft Graph API · REST · Swagger/OpenAPI'],
		['Databases & ORM', 'SQL Server (SSMS) · MySQL · Entity Framework · Data Modeling'],
		['Automation & DevOps', 'PowerShell · GitHub · CI/CD · xUnit · NUnit · Moq'],
		['Cloud & Security', 'Microsoft 365 · Microsoft Purview · Security & Compliance · Azure (basic)'],
		['AI & LLM Tooling', 'LLM API Integration · MCP (Model Context Protocol) · Prompt Engineering · AI-assisted Development'],
		['Languages', 'C# · PHP · Java · JavaScript · COBOL · SQL'],
	],
	education: [
		['2020', 'Desarrollo de Aplicaciones Multiplataforma', 'Escola Pia, Mataró'],
		['2014', 'Sistemas Microinformáticos y Redes', 'Escola Pia, Mataró'],
	],
	languages: [
		['Catalan', 'Native'],
		['Spanish', 'Native'],
		['English', 'C2 — Cambridge Proficiency'],
	],
};

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
const BULLET_STEP = 10.6; // between bullets
const WRAP_STEP = 9.6; // wrapped line inside a bullet

const doc = new PDFDocument({ size: 'A4', margin: 0, info: { Title: 'Pere Soler — CV', Author: 'Pere Soler' } });
const out = process.argv[2] ?? path.join(here, 'PereSoler_CV.pdf');
doc.pipe(fs.createWriteStream(out));

// Draw text with its alphabetic baseline at y.
function text(str, x, y, font, size, color, opts = {}) {
	doc.font(font).fontSize(size).fillColor(color);
	doc.text(str, x, y, { lineBreak: false, baseline: 'alphabetic', ...opts });
}
function textRight(str, y, font, size, color) {
	doc.font(font).fontSize(size);
	text(str, R - doc.widthOfString(str), y, font, size, color);
}
function wrap(str, width, font, size) {
	doc.font(font).fontSize(size);
	const lines = [];
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
function hrule(y, width, color) {
	doc.moveTo(L, y).lineTo(R, y).lineWidth(width).strokeColor(color).stroke();
}
function label(str, x, y) {
	text(str.toUpperCase(), x, y, F.bold, 6.5, C.accent, { characterSpacing: 1.1 });
}

// ── Header ──
const cx = 515.28, cy = 66, r = 34;
doc.save().circle(cx, cy, r).clip().image(path.join(here, 'avatar.jpg'), cx - r, cy - r, { width: 2 * r, height: 2 * r }).restore();
doc.circle(cx, cy, r).lineWidth(1.8).strokeColor(C.accent).stroke();

text(cv.name, L, 50.67, F.bold, 26, C.ink);
text(cv.title, L, 70.26, F.bold, 11.5, C.accent);
text(cv.tagline, L, 82.74, F.reg, 8, C.muted);
cv.contacts.forEach(([a, b], i) => {
	text(a, L, 96.38 + i * 11, F.reg, 7.5, C.muted);
	text(b, 257.64, 96.38 + i * 11, F.reg, 7.5, C.muted);
});
hrule(121, 1.2, C.accent);

// ── About ──
label('About', L, 131.67);
let y = 143.05;
const aboutLines = wrap(cv.about, W, F.reg, 8.8);
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
	if (j < cv.jobs.length - 1) y += 10;
});

// ── Skills ──
y += 8.67;
label('Skills', L, y);
y += 14.4;
text('Technical Skills', L, y, F.bold, 13, C.ink);
y += 15;
cv.skills.forEach(([k, v], i) => {
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
cv.education.forEach(([year, degree, school], i) => {
	if (i) ey += 14;
	text(year, L, ey, F.bold, 7.5, C.accent);
	text(degree, L + 24, ey, F.bold, 9, C.ink);
	text(school, L + 24, ey + 10.9, F.reg, 7.5, C.muted);
	ey += 10.9;
});
let ly = y + 11.8;
cv.languages.forEach(([lang, level], i) => {
	if (i) ly += 12.4;
	text(lang, colX, ly, F.bold, 9, C.ink);
	text(level, colX + 48, ly, F.reg, 8, C.muted);
});

const bottom = Math.max(ey, ly);
if (bottom > 841.89 - 20 && !process.env.NOCHECK) throw new Error(`Content overflows the page (bottom baseline ${bottom.toFixed(1)})`);
console.log(`Wrote ${out} (bottom baseline ${bottom.toFixed(1)})`);
doc.end();
