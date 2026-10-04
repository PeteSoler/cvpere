// Single source of truth for the CV. The homepage (src/pages/index.astro) and the
// downloadable PDF (src/pages/PereSoler_CV.pdf.ts) are both built from this data,
// so editing it here updates both on the next deploy.

export interface Job {
	company: string;
	role: string;
	period: string;
	location: string;
	bullets: string[];
	tags: string[];
}

export const cv = {
	name: 'Pere Soler',
	title: 'Full-Stack Software Developer',
	tagline: 'Frontend · Backend · API Design · Web Applications',
	location: 'Catalonia, Spain',
	email: 'peree.sooler@gmail.com',
	linkedin: 'linkedin.com/in/peresolerrigau',
	// Shown on the PDF only, not on the website.
	phone: '+34 608 760 927',
	// Wrap phrases in **double asterisks** to highlight them on the website.
	about:
		"Full-Stack Developer with hands-on experience building **web applications end-to-end** — from crafting responsive, user-facing interfaces to designing and shipping robust **RESTful APIs and backend services** in C# and .NET. I care deeply about clean architecture, SOLID principles, and writing code that's as maintainable as it is performant. Whether it's wiring up a front-end, architecting a database schema, or **integrating LLM-powered features and AI tooling** into backend services, I bring a full-stack mindset to every project.",
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
				'Provided technical expertise in Microsoft Purview and Microsoft 365 security frameworks, supporting governance and regulatory alignment.',
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
	] as Job[],
	skills: [
		{ icon: '⚙️', name: 'Backend & APIs', items: ['.NET Core', 'C#', 'ASP.NET MVC', 'ASP.NET Core', 'Microsoft Graph API', 'REST', 'Swagger / OpenAPI'] },
		{ icon: '🗄️', name: 'Databases & ORM', items: ['SQL Server (SSMS)', 'MySQL', 'Entity Framework', 'Data Modeling'] },
		{ icon: '🚀', name: 'Automation & DevOps', items: ['PowerShell', 'GitHub', 'CI/CD', 'xUnit', 'NUnit', 'Moq'] },
		{ icon: '☁️', name: 'Cloud & Security', items: ['Microsoft 365', 'Microsoft Purview', 'Security & Compliance', 'Azure (basic)'] },
		{ icon: '🤖', name: 'AI & LLM Tooling', items: ['LLM API Integration', 'MCP (Model Context Protocol)', 'Prompt Engineering', 'AI-assisted Development'] },
		{ icon: '💻', name: 'Languages', items: ['C#', 'PHP', 'Java', 'JavaScript', 'COBOL', 'SQL'] },
	],
	education: [
		{ year: '2020', degree: 'Desarrollo de Aplicaciones Multiplataforma', school: 'Escola Pia, Mataró' },
		{ year: '2014', degree: 'Sistemas Microinformáticos y Redes', school: 'Escola Pia, Mataró' },
	],
	// level: the CSS badge style on the website (native, c1 or c2).
	languages: [
		{ name: 'Catalan', label: 'Native', level: 'native' },
		{ name: 'Spanish', label: 'Native', level: 'native' },
		{ name: 'English', label: 'C2 — Cambridge Proficiency', level: 'c2' },
	],
};

// Splits text with **bold** markers into segments for rendering.
export function richText(str: string): { text: string; bold: boolean }[] {
	return str.split('**').map((text, i) => ({ text, bold: i % 2 === 1 })).filter((s) => s.text);
}
