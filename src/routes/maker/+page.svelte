<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	interface GitHubRepo {
		id: number;
		name: string;
		description: string | null;
		html_url: string;
		stargazers_count: number;
		forks_count: number;
		language: string | null;
		updated_at: string;
	}

	let repos = $state<GitHubRepo[]>([]);
	let isLoadingRepos = $state(true);
	let apiError = $state<string | null>(null);

	const GITHUB_USERNAME = 'cosineFox';

	const projects = [
		{
			id: 1,
			title: 'Audio ESP DAC',
			description: 'ESP32-based digital-to-analog converter for high-quality audio output',
			tags: ['ESP32', 'Audio', 'Hardware'],
			status: 'Planned',
			icon: '🔊'
		},
		{
			id: 2,
			title: 'Computer Museum',
			description: 'Collection and documentation of vintage computing hardware',
			tags: ['Retro', 'Hardware', 'Bluesky'],
			status: 'In Progress',
			icon: '🖥️'
		},
		{
			id: 3,
			title: 'Yuuna-chan Bot',
			description: 'Discord bot with various utility and entertainment features',
			tags: ['Discord', 'Bot', 'TypeScript'],
			status: 'Active',
			icon: '🤖'
		},
		{
			id: 4,
			title: 'This Website',
			description: 'canvas_labworks - My personal Geocities-style homepage',
			tags: ['SvelteKit', 'Meta', 'Documentation'],
			status: 'Ongoing',
			icon: '🌐'
		},
		{
			id: 5,
			title: 'Weather Dashboard',
			description: 'Real-time weather monitoring with 50+ meteorological data points',
			tags: ['API', 'Data Viz', 'Weather'],
			status: 'Live',
			icon: '🌤️',
			link: '/maker/dashboard'
		}
	];

	async function fetchGitHubRepos() {
		isLoadingRepos = true;
		apiError = null;
		try {
			const response = await fetch(
				`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=8&type=owner`
			);
			if (!response.ok) {
				if (response.status === 403) {
					apiError = 'GitHub API rate limit exceeded. Try again later!';
				} else {
					apiError = `GitHub API error: ${response.status}`;
				}
				throw new Error(apiError);
			}
			const data = await response.json();
			repos = data.filter((repo: GitHubRepo) => !repo.name.includes('.github'));
		} catch (err) {
			console.error('GitHub API error:', err);
		} finally {
			isLoadingRepos = false;
		}
	}

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { year: '2-digit', month: 'short', day: 'numeric' });
	}

	function getLanguageColor(lang: string | null): string {
		const colors: Record<string, string> = {
			JavaScript: '#f1e05a',
			TypeScript: '#3178c6',
			Python: '#3572A5',
			HTML: '#e34c26',
			CSS: '#563d7c',
			Svelte: '#ff3e00',
			Rust: '#dea584',
			Go: '#00ADD8',
			Shell: '#89e051',
			C: '#555555',
			'C++': '#f34b7d'
		};
		return colors[lang || ''] || '#858585';
	}

	onMount(() => {
		if (browser) {
			fetchGitHubRepos();
		}
	});
</script>

<svelte:head>
	<title>~*~ CANVAS-MAKER ~*~ Projects & Experiments ~*~</title>
</svelte:head>

<div class="page">
	<!-- Header -->
	<div class="header">
		<h1 class="title">
			<span class="rainbow-text">~*~ CANVAS-MAKER ~*~</span>
		</h1>
		<p class="subtitle">Projects & Experiments by Clement</p>
	</div>

	<!-- Navigation -->
	<div class="nav-container">
		<table class="nav-table" cellpadding="5" cellspacing="0">
			<tr>
				<td class="nav-cell"><a href="/main">HOME</a></td>
				<td class="nav-cell"><a href="/imageworks">IMAGEWORKS</a></td>
				<td class="nav-cell active"><a href="/maker">MAKER</a></td>
				<td class="nav-cell"><a href="/maker/dashboard">WEATHER</a></td>
			</tr>
		</table>
	</div>

	<!-- Marquee -->
	<marquee class="marquee" scrollamount="3">
		*** CANVAS-MAKER *** HARDWARE & SOFTWARE PROJECTS *** CHECK OUT MY GITHUB *** UNDER CONSTRUCTION ***
	</marquee>

	<!-- Content -->
	<div class="content">
		<!-- Projects Section -->
		<table class="section-table" cellpadding="10" cellspacing="0">
			<tr>
				<td class="section-header">
					<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/folder.gif" alt="folder"> MY PROJECTS
				</td>
			</tr>
			<tr>
				<td>
					<table class="projects-table" cellpadding="5" cellspacing="2" width="100%">
						<tr class="table-header">
							<th width="30"></th>
							<th>Name</th>
							<th>Description</th>
							<th width="80">Status</th>
						</tr>
						{#each projects as project}
							<tr class="project-row">
								<td class="project-icon">{project.icon}</td>
								<td class="project-name">
									{#if project.link}
										<a href={project.link}>{project.title}</a>
									{:else}
										{project.title}
									{/if}
								</td>
								<td class="project-desc">{project.description}</td>
								<td class="project-status" class:live={project.status === 'Live' || project.status === 'Active'}>
									{project.status}
								</td>
							</tr>
						{/each}
					</table>
				</td>
			</tr>
		</table>

		<!-- GitHub Section -->
		<table class="section-table" cellpadding="10" cellspacing="0">
			<tr>
				<td class="section-header">
					<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/pc.gif" alt="pc"> GITHUB REPOSITORIES - {GITHUB_USERNAME}
					<button class="refresh-btn" onclick={() => fetchGitHubRepos()}>[Refresh]</button>
				</td>
			</tr>
			<tr>
				<td>
					{#if isLoadingRepos}
						<p class="loading"><span class="blink">*** Connecting to GitHub... ***</span></p>
					{:else if apiError}
						<p class="error">{apiError}</p>
						<p><a href="https://github.com/{GITHUB_USERNAME}" target="_blank" class="github-link">&gt;&gt; Visit GitHub Profile directly &lt;&lt;</a></p>
					{:else if repos.length > 0}
						<table class="repos-table" cellpadding="5" cellspacing="2" width="100%">
							<tr class="table-header">
								<th>Repository</th>
								<th width="100">Language</th>
								<th width="60">Stars</th>
								<th width="100">Updated</th>
							</tr>
							{#each repos as repo}
								<tr class="repo-row">
									<td>
										<a href={repo.html_url} target="_blank" class="repo-link">
											📁 {repo.name}
										</a>
										{#if repo.description}
											<br><font color="#808080" size="1">{repo.description.slice(0, 60)}{repo.description.length > 60 ? '...' : ''}</font>
										{/if}
									</td>
									<td>
										{#if repo.language}
											<span class="lang-badge" style="background: {getLanguageColor(repo.language)}">{repo.language}</span>
										{:else}
											<font color="#808080">--</font>
										{/if}
									</td>
									<td class="stars">⭐ {repo.stargazers_count}</td>
									<td class="updated">{formatDate(repo.updated_at)}</td>
								</tr>
							{/each}
						</table>
						<br>
						<a href="https://github.com/{GITHUB_USERNAME}" target="_blank" class="github-link">&gt;&gt; View all repositories on GitHub &lt;&lt;</a>
					{:else}
						<p>No repositories found!</p>
					{/if}
				</td>
			</tr>
		</table>

		<!-- Quick Links -->
		<table class="section-table" cellpadding="10" cellspacing="0">
			<tr>
				<td class="section-header">
					<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/link.gif" alt="link"> QUICK LINKS
				</td>
			</tr>
			<tr>
				<td align="center">
					<a href="/maker/dashboard" class="quick-link">[Weather Dashboard]</a>
					<a href="/imageworks" class="quick-link">[Canvas_Imageworks]</a>
					<a href="/main" class="quick-link">[Main Page]</a>
					<a href="https://github.com/{GITHUB_USERNAME}" target="_blank" class="quick-link">[GitHub]</a>
				</td>
			</tr>
		</table>

		<!-- Under Construction -->
		<div class="construction">
			<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/construction.gif" alt="construction">
			<span class="blink construction-text">** MORE PROJECTS COMING SOON **</span>
			<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/construction.gif" alt="construction">
		</div>

		<!-- Footer -->
		<div class="footer">
			<hr class="rainbow-hr">
			<p><a href="/main">&lt;&lt; Back to Main Page</a></p>
			<hr class="rainbow-hr">
		</div>
	</div>
</div>

<style>
	/* Geocities Theme */
	.page {
		min-height: 100vh;
		background: #000033 url('data:image/gif;base64,R0lGODlhCgAKAIABAP///wAAACH5BAEKAAEALAAAAAAKAAoAAAIRjI+py+0Po5y02ouz3rz7DxYAOw==') repeat;
		color: #FFFFFF;
		font-family: 'Times New Roman', Times, serif;
		font-size: 14px;
	}

	.header {
		text-align: center;
		padding: 20px;
		background: linear-gradient(to bottom, #000066, #000033);
		border-bottom: 3px solid #FFFF00;
	}

	.title {
		font-size: 28px;
		margin: 0;
		text-shadow: 2px 2px #FF00FF, -2px -2px #00FFFF;
	}

	.rainbow-text {
		background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
	}

	.subtitle {
		color: #FFFF00;
		font-size: 14px;
		margin-top: 5px;
	}

	/* Navigation */
	.nav-container {
		text-align: center;
		padding: 10px;
		background: #000066;
	}

	.nav-table {
		margin: 0 auto;
		border: 2px solid #FFFF00;
		background: #000033;
	}

	.nav-cell {
		padding: 5px 15px;
		border: 1px solid #0066FF;
	}

	.nav-cell a {
		color: #00FFFF;
		font-weight: bold;
		text-decoration: none;
	}

	.nav-cell a:hover { color: #FFFF00; text-decoration: underline; }
	.nav-cell.active { background: #0066FF; }
	.nav-cell.active a { color: #FFFFFF; }

	.marquee {
		background: #FF0000;
		color: #FFFF00;
		padding: 5px;
		font-weight: bold;
		border-top: 2px solid #FFFF00;
		border-bottom: 2px solid #FFFF00;
	}

	.content {
		max-width: 850px;
		margin: 0 auto;
		padding: 20px;
	}

	/* Section Tables */
	.section-table {
		width: 100%;
		margin-bottom: 20px;
		border: 2px solid #0066FF;
		background: #000066;
	}

	.section-header {
		background: linear-gradient(to right, #0066FF, #000066);
		color: #FFFF00;
		font-weight: bold;
		font-size: 16px;
		padding: 8px;
		border-bottom: 2px solid #FFFF00;
	}

	.refresh-btn {
		float: right;
		background: #000033;
		color: #00FFFF;
		border: 1px solid #0066FF;
		cursor: pointer;
		font-size: 11px;
	}

	.refresh-btn:hover {
		background: #0066FF;
		color: #FFFFFF;
	}

	/* Projects Table */
	.projects-table, .repos-table {
		background: #000033;
		border-collapse: collapse;
	}

	.table-header th {
		background: #0066FF;
		color: #FFFFFF;
		padding: 5px;
		text-align: left;
		border: 1px solid #000066;
	}

	.project-row, .repo-row {
		border: 1px solid #003366;
	}

	.project-row:hover, .repo-row:hover {
		background: #003366;
	}

	.project-row td, .repo-row td {
		padding: 8px;
		border: 1px solid #003366;
	}

	.project-icon {
		text-align: center;
		font-size: 20px;
	}

	.project-name {
		font-weight: bold;
		color: #00FFFF;
	}

	.project-name a {
		color: #00FFFF;
	}

	.project-name a:hover {
		color: #FFFF00;
	}

	.project-desc {
		font-size: 12px;
		color: #CCCCCC;
	}

	.project-status {
		text-align: center;
		font-size: 11px;
		color: #808080;
	}

	.project-status.live {
		color: #00FF00;
		font-weight: bold;
	}

	/* Repos */
	.repo-link {
		color: #00FFFF;
		font-weight: bold;
	}

	.repo-link:hover {
		color: #FFFF00;
	}

	.lang-badge {
		display: inline-block;
		padding: 2px 6px;
		font-size: 10px;
		color: #000;
		border-radius: 3px;
	}

	.stars {
		color: #FFFF00;
		text-align: center;
	}

	.updated {
		font-size: 11px;
		color: #808080;
	}

	.loading {
		text-align: center;
		color: #FFFF00;
		padding: 20px;
	}

	.error {
		color: #FF6666;
		text-align: center;
	}

	.github-link {
		display: block;
		text-align: center;
		color: #00FFFF;
	}

	.github-link:hover {
		color: #FFFF00;
	}

	/* Quick Links */
	.quick-link {
		color: #00FFFF;
		font-weight: bold;
		margin: 0 15px;
	}

	.quick-link:hover {
		color: #FFFF00;
	}

	/* Construction */
	.construction {
		text-align: center;
		margin: 20px 0;
		padding: 10px;
	}

	.construction-text {
		color: #FFFF00;
		font-size: 18px;
		font-weight: bold;
		margin: 0 10px;
	}

	/* Footer */
	.footer {
		text-align: center;
		margin-top: 20px;
	}

	.footer a {
		color: #00FFFF;
	}

	.footer a:hover {
		color: #FFFF00;
	}

	.rainbow-hr {
		height: 5px;
		border: none;
		background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF);
	}

	.blink {
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}
</style>
