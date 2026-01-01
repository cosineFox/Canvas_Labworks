<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// Bluesky feed state with images
	interface BlueskyPost {
		id: string;
		text: string;
		createdAt: string;
		likes: number;
		images: string[];
	}

	// Steam state
	interface SteamGame {
		appid: number;
		name: string;
		playtime_2weeks?: number;
		playtime_forever: number;
		img_icon_url: string;
	}

	let allPosts = $state<BlueskyPost[]>([]);
	let techPosts = $state<BlueskyPost[]>([]);
	let recentGames = $state<SteamGame[]>([]);
	let steamProfile = $state<any>(null);
	let isLoadingFeed = $state(true);
	let isLoadingSteam = $state(true);
	let visitorCount = $state(1337);

	const TECH_HASHTAG = '#tech';
	const BLUESKY_HANDLE = 'cosinefox.bsky.social';
	const STEAM_ID = '76561198168606358'; // Your Steam ID

	async function fetchBlueskyFeeds() {
		isLoadingFeed = true;
		try {
			const response = await fetch(
				`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${BLUESKY_HANDLE}&limit=50`
			);
			if (!response.ok) throw new Error('Failed to fetch feed');
			const data = await response.json();

			const mapPost = (item: any): BlueskyPost => {
				const images: string[] = [];
				const embed = item.post.embed;
				if (embed?.images) {
					embed.images.forEach((img: any) => {
						if (img.thumb) images.push(img.thumb);
						else if (img.fullsize) images.push(img.fullsize);
					});
				}
				if (embed?.$type === 'app.bsky.embed.images#view') {
					embed.images?.forEach((img: any) => {
						if (img.thumb) images.push(img.thumb);
					});
				}
				return {
					id: item.post.cid,
					text: item.post.record?.text || '',
					createdAt: item.post.record?.createdAt,
					likes: item.post.likeCount || 0,
					images
				};
			};

			allPosts = data.feed.slice(0, 5).map(mapPost);
			techPosts = data.feed
				.filter((item: any) => {
					const text = item.post.record?.text?.toLowerCase() || '';
					return text.includes(TECH_HASHTAG.toLowerCase());
				})
				.slice(0, 5)
				.map(mapPost);
		} catch (err) {
			console.error('Bluesky feed error:', err);
		} finally {
			isLoadingFeed = false;
		}
	}

	async function fetchSteamData() {
		isLoadingSteam = true;
		try {
			// Fetch via our API route to hide the key
			const response = await fetch(`/api/steam?steamid=${STEAM_ID}`);
			if (response.ok) {
				const data = await response.json();
				recentGames = data.games || [];
				steamProfile = data.profile || null;
			}
		} catch (err) {
			console.error('Steam API error:', err);
		} finally {
			isLoadingSteam = false;
		}
	}

	async function fetchVisitorCount() {
		try {
			const response = await fetch('/api/counter');
			if (response.ok) {
				const data = await response.json();
				visitorCount = data.count;
			}
		} catch (err) {
			console.error('Counter error:', err);
		}
	}

	const webRingBadges = [
		'https://cyber.dabamos.de/88x31/gamercat.gif',
		'https://cyber.dabamos.de/88x31/gethtmlnow.gif',
		'https://cyber.dabamos.de/88x31/linux.gif',
		'https://cyber.dabamos.de/88x31/www.gif',
		'https://cyber.dabamos.de/88x31/zettai.gif',
		'https://cyber.dabamos.de/88x31/netscape.gif',
		'https://cyber.dabamos.de/88x31/ie_logo.gif'
	];

	const socialLinks = [
		{ name: 'GitHub', url: 'https://github.com/cosineFox' },
		{ name: 'Bluesky', url: `https://bsky.app/profile/${BLUESKY_HANDLE}` },
		{ name: 'Instagram', url: 'https://instagram.com/Canvas_Imageworks' }
	];

	function formatTime(dateStr: string): string {
		const date = new Date(dateStr);
		const now = new Date();
		const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
		if (diff < 60) return 'just now';
		if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
		if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
		return `${Math.floor(diff / 86400)}d ago`;
	}

	function formatPlaytime(minutes: number): string {
		const hours = Math.floor(minutes / 60);
		if (hours < 1) return `${minutes}m`;
		return `${hours}h`;
	}

	onMount(() => {
		if (browser) {
			fetchBlueskyFeeds();
			fetchSteamData();
			fetchVisitorCount();
		}
	});
</script>

<svelte:head>
	<title>~*~ CANVAS_LABWORKS ~*~ Welcome to my Homepage! ~*~</title>
</svelte:head>

<div class="page">
	<!-- Starfield Header -->
	<div class="header">
		<img src="https://web.archive.org/web/20090830095347/http://www.geocities.com/SiliconValley/Station/5765/star.gif" alt="star" class="star star1">
		<img src="https://web.archive.org/web/20090830095347/http://www.geocities.com/SiliconValley/Station/5765/star.gif" alt="star" class="star star2">
		<h1 class="title">
			<span class="rainbow-text">~*~ CANVAS_LABWORKS ~*~</span>
		</h1>
		<p class="subtitle">Welcome to Clement's Corner of the Web!</p>
		<img src="https://web.archive.org/web/20090830095347/http://www.geocities.com/SiliconValley/Station/5765/star.gif" alt="star" class="star star3">
	</div>

	<!-- Navigation -->
	<div class="nav-container">
		<table class="nav-table" cellpadding="5" cellspacing="0">
			<tr>
				<td class="nav-cell active"><a href="/main">HOME</a></td>
				<td class="nav-cell"><a href="/imageworks">IMAGEWORKS</a></td>
				<td class="nav-cell"><a href="/maker">MAKER</a></td>
				<td class="nav-cell"><a href="/maker/dashboard">WEATHER</a></td>
			</tr>
		</table>
	</div>

	<!-- Marquee -->
	<marquee class="marquee" scrollamount="3">
		*** WELCOME TO CANVAS_LABWORKS *** BEST VIEWED WITH NETSCAPE NAVIGATOR 4.0 @ 800x600 *** OPTIMIZED FOR 56K MODEM *** SIGN MY GUESTBOOK! *** DO NOT HOTLINK MY IMAGES ***
	</marquee>

	<!-- Main Content -->
	<div class="content">
		<!-- About Section -->
		<table class="section-table" cellpadding="10" cellspacing="0">
			<tr>
				<td class="section-header" colspan="2">
					<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/note.gif" alt="note"> ABOUT ME <img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/note.gif" alt="note">
				</td>
			</tr>
			<tr>
				<td class="about-avatar">
					<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/pc.gif" alt="computer" class="pixel-icon">
					<br>
					<span class="filename">clement.gif</span>
				</td>
				<td class="about-content">
					<p class="greeting">&gt;&gt; Hello World! &lt;&lt;</p>
					<p>My name is <b>Clement</b> and I am an IT Student at <font color="#0000FF">Uni Petronas</font>!</p>
					<p>I like <font color="#00AA00">Linux</font>, <font color="#FF6600">IoT</font>, and making things <span class="blink">BLINK!</span></p>
					<br>
					<table class="info-table" cellpadding="3">
						<tr><td><b>Email:</b></td><td><a href="mailto:clement_22008723@utp.edu.my">clement_22008723@utp.edu.my</a></td></tr>
						<tr><td><b>Status:</b></td><td><font color="#00AA00">Online</font> - Probably coding</td></tr>
						<tr><td><b>Location:</b></td><td>Malaysia</td></tr>
					</table>
				</td>
			</tr>
		</table>

		<!-- Two Column Layout -->
		<table class="two-column" cellpadding="10" cellspacing="10">
			<tr>
				<!-- Bluesky Feed -->
				<td class="column">
					<table class="section-table" cellpadding="5" cellspacing="0" width="100%">
						<tr>
							<td class="section-header">
								<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/mail.gif" alt="mail"> BLUESKY FEED
							</td>
						</tr>
						<tr>
							<td class="feed-content">
								{#if isLoadingFeed}
									<p class="loading"><img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/loading.gif" alt="loading"> Loading...</p>
								{:else if allPosts.length > 0}
									{#each allPosts as post}
										<div class="post">
											<div class="post-meta">{formatTime(post.createdAt)} | <font color="#FF0000">♥{post.likes}</font></div>
											<p>{post.text}</p>
											{#if post.images.length > 0}
												<div class="post-images">
													{#each post.images as img}
														<img src={img} alt="post image" class="post-img">
													{/each}
												</div>
											{/if}
										</div>
										<hr class="post-divider">
									{/each}
									<a href="https://bsky.app/profile/{BLUESKY_HANDLE}" target="_blank" class="more-link">&gt;&gt; View all posts &lt;&lt;</a>
								{:else}
									<p>No posts yet!</p>
								{/if}
							</td>
						</tr>
					</table>
				</td>

				<!-- Tech Feed -->
				<td class="column">
					<table class="section-table" cellpadding="5" cellspacing="0" width="100%">
						<tr>
							<td class="section-header">
								<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/pc.gif" alt="pc"> #TECH POSTS
							</td>
						</tr>
						<tr>
							<td class="feed-content">
								{#if isLoadingFeed}
									<p class="loading"><img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/loading.gif" alt="loading"> Loading...</p>
								{:else if techPosts.length > 0}
									{#each techPosts as post}
										<div class="post">
											<div class="post-meta">{formatTime(post.createdAt)} | <font color="#FF0000">♥{post.likes}</font></div>
											<p>{post.text}</p>
											{#if post.images.length > 0}
												<div class="post-images">
													{#each post.images as img}
														<img src={img} alt="post image" class="post-img">
													{/each}
												</div>
											{/if}
										</div>
										<hr class="post-divider">
									{/each}
								{:else}
									<p>No #tech posts yet!</p>
									<p><font color="#808080">Post with #tech on Bluesky to show here!</font></p>
								{/if}
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>

		<!-- Steam Section -->
		<table class="section-table" cellpadding="10" cellspacing="0">
			<tr>
				<td class="section-header">
					<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/game.gif" alt="game"> RECENTLY PLAYED GAMES
				</td>
			</tr>
			<tr>
				<td>
					{#if isLoadingSteam}
						<p class="loading"><img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/loading.gif" alt="loading"> Connecting to Steam...</p>
					{:else if recentGames.length > 0}
						<table class="games-table" cellpadding="5" cellspacing="2">
							{#each recentGames.slice(0, 5) as game}
								<tr class="game-row">
									<td class="game-icon">
										{#if game.img_icon_url}
											<img src="https://media.steampowered.com/steamcommunity/public/images/apps/{game.appid}/{game.img_icon_url}.jpg" alt={game.name}>
										{:else}
											<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/game.gif" alt="game">
										{/if}
									</td>
									<td class="game-name">{game.name}</td>
									<td class="game-time">
										{#if game.playtime_2weeks}
											<font color="#00AA00">{formatPlaytime(game.playtime_2weeks)}</font> (2 weeks)
										{/if}
										<br>
										<font color="#808080">{formatPlaytime(game.playtime_forever)} total</font>
									</td>
								</tr>
							{/each}
						</table>
						<a href="https://steamcommunity.com/profiles/{STEAM_ID}" target="_blank" class="more-link">&gt;&gt; View Steam Profile &lt;&lt;</a>
					{:else}
						<p><font color="#808080">No recent games or Steam API unavailable</font></p>
					{/if}
				</td>
			</tr>
		</table>

		<!-- Web Ring & Links -->
		<table class="section-table" cellpadding="10" cellspacing="0">
			<tr>
				<td class="section-header">
					<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/link.gif" alt="link"> COOL LINKS & WEB RING
				</td>
			</tr>
			<tr>
				<td align="center">
					<div class="badges">
						{#each webRingBadges as badge}
							<img src={badge} alt="88x31 badge" class="badge">
						{/each}
					</div>
					<br>
					<div class="social-links">
						{#each socialLinks as link}
							<a href={link.url} target="_blank" class="social-link">[{link.name}]</a>
						{/each}
					</div>
				</td>
			</tr>
		</table>

		<!-- Under Construction -->
		<div class="construction">
			<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/construction.gif" alt="construction">
			<span class="blink construction-text">** UNDER CONSTRUCTION **</span>
			<img src="https://web.archive.org/web/20091027065852/http://hk.geocities.com/nickyyk_01/icons/construction.gif" alt="construction">
		</div>

		<!-- Visitor Counter -->
		<div class="counter-section">
			<p>You are visitor number:</p>
			<div class="counter">
				{#each visitorCount.toString().padStart(6, '0').split('') as digit}
					<span class="digit">{digit}</span>
				{/each}
			</div>
		</div>

		<!-- Footer -->
		<div class="footer">
			<hr class="rainbow-hr">
			<p>This page was last updated: {new Date().toLocaleDateString()}</p>
			<p>Best viewed with <img src="https://cyber.dabamos.de/88x31/netscape.gif" alt="Netscape" class="inline-badge"> at 800x600</p>
			<p><font color="#808080">Copyright 2024 Clement @ canvas_labworks - All Rights Reserved</font></p>
			<hr class="rainbow-hr">
		</div>
	</div>
</div>

<style>
	/* Geocities / Web 1.0 Theme */
	.page {
		min-height: 100vh;
		background: #000033 url('data:image/gif;base64,R0lGODlhCgAKAIABAP///wAAACH5BAEKAAEALAAAAAAKAAoAAAIRjI+py+0Po5y02ouz3rz7DxYAOw==') repeat;
		color: #FFFFFF;
		font-family: 'Times New Roman', Times, serif;
		font-size: 14px;
	}

	/* Header */
	.header {
		text-align: center;
		padding: 20px;
		background: linear-gradient(to bottom, #000066, #000033);
		border-bottom: 3px solid #FFFF00;
		position: relative;
	}

	.star {
		position: absolute;
		width: 20px;
		animation: twinkle 1s ease-in-out infinite;
	}

	.star1 { top: 10px; left: 10%; }
	.star2 { top: 30px; right: 15%; animation-delay: 0.3s; }
	.star3 { bottom: 10px; left: 50%; animation-delay: 0.6s; }

	@keyframes twinkle {
		0%, 100% { opacity: 1; }
		50% { opacity: 0.3; }
	}

	.title {
		font-size: 32px;
		margin: 0;
		text-shadow: 2px 2px #FF00FF, -2px -2px #00FFFF;
	}

	.rainbow-text {
		background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF);
		-webkit-background-clip: text;
		background-clip: text;
		color: transparent;
		animation: rainbow 3s linear infinite;
	}

	@keyframes rainbow {
		0% { filter: hue-rotate(0deg); }
		100% { filter: hue-rotate(360deg); }
	}

	.subtitle {
		color: #FFFF00;
		font-size: 16px;
		margin-top: 10px;
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

	.nav-cell a:hover {
		color: #FFFF00;
		text-decoration: underline;
	}

	.nav-cell.active {
		background: #0066FF;
	}

	.nav-cell.active a {
		color: #FFFFFF;
	}

	/* Marquee */
	.marquee {
		background: #FF0000;
		color: #FFFF00;
		padding: 5px;
		font-weight: bold;
		border-top: 2px solid #FFFF00;
		border-bottom: 2px solid #FFFF00;
	}

	/* Content */
	.content {
		max-width: 800px;
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

	/* About Section */
	.about-avatar {
		text-align: center;
		vertical-align: top;
		width: 120px;
		background: #000033;
		border-right: 2px solid #0066FF;
	}

	.pixel-icon {
		width: 64px;
		image-rendering: pixelated;
	}

	.filename {
		font-size: 10px;
		color: #808080;
	}

	.about-content {
		vertical-align: top;
		padding: 10px;
	}

	.greeting {
		font-size: 20px;
		color: #00FF00;
		text-align: center;
		margin-bottom: 10px;
	}

	.info-table {
		margin-top: 10px;
		font-size: 12px;
	}

	.info-table td {
		padding: 3px;
	}

	.info-table a {
		color: #00FFFF;
	}

	/* Two Column */
	.two-column {
		width: 100%;
	}

	.column {
		width: 50%;
		vertical-align: top;
	}

	/* Feed */
	.feed-content {
		max-height: 300px;
		overflow-y: auto;
		background: #000033;
		padding: 10px;
	}

	.post {
		margin-bottom: 5px;
	}

	.post-meta {
		font-size: 10px;
		color: #808080;
	}

	.post p {
		margin: 5px 0;
	}

	.post-images {
		margin-top: 5px;
	}

	.post-img {
		max-width: 150px;
		max-height: 100px;
		border: 1px solid #0066FF;
		margin: 2px;
	}

	.post-divider {
		border: none;
		border-top: 1px dashed #0066FF;
		margin: 10px 0;
	}

	.more-link {
		display: block;
		text-align: center;
		color: #00FFFF;
		margin-top: 10px;
	}

	.more-link:hover {
		color: #FFFF00;
	}

	.loading {
		color: #FFFF00;
	}

	/* Games Table */
	.games-table {
		width: 100%;
		background: #000033;
	}

	.game-row:hover {
		background: #003366;
	}

	.game-icon img {
		width: 32px;
		height: 32px;
	}

	.game-name {
		font-weight: bold;
		color: #00FFFF;
	}

	.game-time {
		font-size: 11px;
		text-align: right;
	}

	/* Badges */
	.badges {
		display: flex;
		flex-wrap: wrap;
		gap: 5px;
		justify-content: center;
	}

	.badge {
		image-rendering: pixelated;
		border: 1px solid #0066FF;
	}

	.social-links {
		margin-top: 10px;
	}

	.social-link {
		color: #00FFFF;
		font-weight: bold;
		margin: 0 10px;
	}

	.social-link:hover {
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
		font-size: 20px;
		font-weight: bold;
		margin: 0 10px;
	}

	/* Counter */
	.counter-section {
		text-align: center;
		margin: 20px 0;
	}

	.counter {
		display: inline-flex;
		gap: 2px;
		margin-top: 10px;
	}

	.digit {
		display: inline-block;
		width: 20px;
		height: 30px;
		background: #000000;
		color: #00FF00;
		font-family: 'Courier New', monospace;
		font-size: 24px;
		font-weight: bold;
		text-align: center;
		line-height: 30px;
		border: 2px inset #333;
	}

	/* Footer */
	.footer {
		text-align: center;
		margin-top: 20px;
		font-size: 12px;
		color: #808080;
	}

	.rainbow-hr {
		height: 5px;
		border: none;
		background: linear-gradient(90deg, #FF0000, #FF7F00, #FFFF00, #00FF00, #0000FF, #8B00FF);
	}

	.inline-badge {
		vertical-align: middle;
		height: 15px;
	}

	/* Utility */
	.blink {
		animation: blink 1s step-end infinite;
	}

	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}

	/* Responsive */
	@media (max-width: 700px) {
		.two-column .column {
			display: block;
			width: 100%;
		}

		.title {
			font-size: 24px;
		}
	}
</style>
