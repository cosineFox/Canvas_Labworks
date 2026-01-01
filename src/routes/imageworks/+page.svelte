<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let gsap: any;
	let ScrollTrigger: any;
	let isLoaded = $state(false);

	// Commission status
	let isAvailable = $state(true);

	// Bluesky feed state
	interface BlueskyPost {
		id: string;
		text: string;
		images: string[];
		createdAt: string;
		likes: number;
	}

	let photos = $state<BlueskyPost[]>([]);
	let isLoadingFeed = $state(true);
	let feedError = $state<string | null>(null);

	const PHOTO_HASHTAG = '#photography';

	// Services offered
	const services = [
		{ name: 'Weddings', price: 'From RM 2,500' },
		{ name: 'Events', price: 'From RM 800' },
		{ name: 'Portraits', price: 'From RM 350' },
		{ name: 'Documentary', price: 'Contact' }
	];

	async function fetchBlueskyFeed() {
		isLoadingFeed = true;
		feedError = null;

		try {
			const handle = 'cosineFox.bsky.social';
			const response = await fetch(
				`https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed?actor=${handle}&limit=50`
			);

			if (!response.ok) throw new Error('Failed to fetch feed');

			const data = await response.json();

			const filteredPosts = data.feed
				.filter((item: any) => {
					const post = item.post;
					const hasImages = post.embed?.images?.length > 0;
					const hasHashtag = post.record?.text?.toLowerCase().includes(PHOTO_HASHTAG.toLowerCase());
					return hasImages && hasHashtag;
				})
				.map((item: any) => ({
					id: item.post.cid,
					text: item.post.record?.text || '',
					images: item.post.embed?.images?.map((img: any) => img.fullsize) || [],
					createdAt: item.post.record?.createdAt,
					likes: item.post.likeCount || 0
				}));

			photos = filteredPosts;
		} catch (err) {
			console.error('Bluesky feed error:', err);
			feedError = 'Could not load feed';
		} finally {
			isLoadingFeed = false;
		}
	}

	onMount(async () => {
		if (!browser) return;

		const [gsapModule, stModule] = await Promise.all([
			import('gsap'),
			import('gsap/ScrollTrigger')
		]);

		gsap = gsapModule.gsap;
		ScrollTrigger = stModule.ScrollTrigger;
		gsap.registerPlugin(ScrollTrigger);

		await fetchBlueskyFeed();
		isLoaded = true;

		setTimeout(initAnimations, 100);
	});

	function initAnimations() {
		if (!gsap || !ScrollTrigger) return;

		// Hero title reveal
		gsap.fromTo(
			'.hero-line',
			{ y: '100%', opacity: 0 },
			{
				y: '0%',
				opacity: 1,
				duration: 1.2,
				stagger: 0.15,
				ease: 'power4.out'
			}
		);

		// Hero subtitle fade
		gsap.fromTo(
			'.hero-meta',
			{ opacity: 0 },
			{ opacity: 1, duration: 1, delay: 0.8, ease: 'power2.out' }
		);

		// Parallax on hero background
		gsap.to('.hero-bg-image', {
			y: '30%',
			ease: 'none',
			scrollTrigger: {
				trigger: '.hero',
				start: 'top top',
				end: 'bottom top',
				scrub: true
			}
		});

		// Gallery items reveal
		gsap.utils.toArray('.gallery-item').forEach((item: any, i: number) => {
			gsap.fromTo(
				item,
				{ y: 100, opacity: 0 },
				{
					y: 0,
					opacity: 1,
					duration: 1,
					ease: 'power3.out',
					scrollTrigger: {
						trigger: item,
						start: 'top 90%',
						toggleActions: 'play none none reverse'
					}
				}
			);
		});

		// Services reveal
		gsap.fromTo(
			'.service-item',
			{ y: 40, opacity: 0 },
			{
				y: 0,
				opacity: 1,
				duration: 0.8,
				stagger: 0.1,
				ease: 'power3.out',
				scrollTrigger: {
					trigger: '.services',
					start: 'top 80%'
				}
			}
		);

		// Horizontal scroll text
		gsap.to('.scroll-text-inner', {
			x: '-50%',
			ease: 'none',
			scrollTrigger: {
				trigger: '.scroll-text',
				start: 'top bottom',
				end: 'bottom top',
				scrub: 1
			}
		});
	}
</script>

<svelte:head>
	<title>Imageworks - Clement | Klang Valley Photographer</title>
	<meta
		name="description"
		content="Authentic wedding, event, and portrait photography in Klang Valley, KL. Capturing real moments, raw emotions."
	/>
	<meta property="og:title" content="Imageworks - Clement Photography" />
	<meta property="og:description" content="Authentic photography for weddings, events, and portraits in Klang Valley." />
	<meta property="og:type" content="website" />

	{@html `<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		"name": "Imageworks - Clement Photography",
		"description": "Authentic wedding, event, and portrait photography in Klang Valley, Malaysia",
		"address": {
			"@type": "PostalAddress",
			"addressRegion": "Selangor",
			"addressLocality": "Klang Valley",
			"addressCountry": "MY"
		},
		"priceRange": "RM350-RM5000",
		"url": "https://canvas-labworks.com/imageworks",
		"sameAs": ["https://bsky.app/profile/cosineFox.bsky.social"]
	}
	</script>`}
</svelte:head>

<!-- Hero Section -->
<section class="hero">
	<div class="hero-bg">
		<div class="hero-bg-image"></div>
		<div class="hero-overlay"></div>
	</div>

	<div class="hero-content">
		<h1 class="hero-title">
			<span class="hero-line-wrapper"><span class="hero-line">Imageworks</span></span>
		</h1>
		<div class="hero-meta">
			<span class="hero-subtitle">Photography by Clement</span>
			<span class="hero-divider">/</span>
			<span class="hero-location">Klang Valley, MY</span>
		</div>

		<div class="availability" class:available={isAvailable}>
			<span class="status-dot"></span>
			<span>{isAvailable ? 'Available for bookings' : 'At University'}</span>
		</div>
	</div>

	<div class="scroll-indicator">
		<span>Scroll</span>
		<div class="scroll-line"></div>
	</div>
</section>

<!-- Horizontal Scroll Text -->
<div class="scroll-text">
	<div class="scroll-text-inner">
		<span>Weddings</span>
		<span class="dot">●</span>
		<span>Events</span>
		<span class="dot">●</span>
		<span>Portraits</span>
		<span class="dot">●</span>
		<span>Documentary</span>
		<span class="dot">●</span>
		<span>Weddings</span>
		<span class="dot">●</span>
		<span>Events</span>
		<span class="dot">●</span>
		<span>Portraits</span>
		<span class="dot">●</span>
		<span>Documentary</span>
		<span class="dot">●</span>
	</div>
</div>

<!-- About Section -->
<section class="about">
	<div class="about-content">
		<p class="about-text">
			I capture authentic moments with a raw, documentary approach.
			Every photograph tells a story—your story, unfiltered and genuine.
		</p>
	</div>
</section>

<!-- Gallery Section -->
<section class="gallery">
	<div class="section-header">
		<span class="section-label">Selected Works</span>
		<h2 class="section-title">Portfolio</h2>
	</div>

	{#if isLoadingFeed}
		<div class="loading-state">
			<p>Loading...</p>
		</div>
	{:else if photos.length > 0}
		<div class="gallery-grid">
			{#each photos as photo, i}
				{#each photo.images as image, imgIndex}
					<div class="gallery-item" style="--delay: {i * 0.1}s">
						<div class="gallery-image">
							<img src={image} alt={photo.text.slice(0, 50)} loading="lazy" />
						</div>
					</div>
				{/each}
			{/each}
		</div>
	{:else}
		<div class="gallery-placeholder">
			<p class="placeholder-text">Portfolio coming soon</p>
			<p class="placeholder-hint">Photos tagged with #photography on Bluesky will appear here</p>
		</div>
	{/if}
</section>

<!-- Services Section -->
<section class="services">
	<div class="section-header">
		<span class="section-label">What I Offer</span>
		<h2 class="section-title">Services</h2>
	</div>

	<div class="services-list">
		{#each services as service, i}
			<div class="service-item">
				<span class="service-number">{String(i + 1).padStart(2, '0')}</span>
				<span class="service-name">{service.name}</span>
				<span class="service-line"></span>
				<span class="service-price">{service.price}</span>
			</div>
		{/each}
	</div>
</section>

<!-- Contact Section -->
<section class="contact">
	<div class="contact-content">
		<h2 class="contact-title">Let's Work Together</h2>
		<p class="contact-text">
			{#if isAvailable}
				Currently available for bookings in Klang Valley and surrounding areas.
			{:else}
				I'm at university, but feel free to reach out for future bookings.
			{/if}
		</p>

		<a href="mailto:clement_22008723@utp.edu.my" class="contact-button">
			Get in Touch
		</a>

		<div class="contact-links">
			<a href="https://bsky.app/profile/cosineFox.bsky.social" target="_blank" rel="noopener">Bluesky</a>
			<a href="https://instagram.com/Canvas_Imageworks" target="_blank" rel="noopener">Instagram</a>
		</div>
	</div>
</section>

<style>
	/* Hero */
	.hero {
		position: relative;
		height: 100vh;
		min-height: 600px;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
	}

	.hero-bg-image {
		position: absolute;
		inset: -10%;
		background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%);
		will-change: transform;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.4);
	}

	.hero-content {
		position: relative;
		z-index: 2;
		text-align: center;
		padding: 0 24px;
	}

	.hero-title {
		margin-bottom: 24px;
		overflow: hidden;
	}

	.hero-line-wrapper {
		display: block;
		overflow: hidden;
	}

	.hero-line {
		display: block;
		font-family: var(--font-serif);
		font-size: clamp(48px, 15vw, 180px);
		font-weight: 400;
		letter-spacing: -0.02em;
		line-height: 0.9;
	}

	.hero-meta {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 16px;
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.15em;
		color: var(--color-accent);
		margin-bottom: 32px;
	}

	.hero-divider {
		opacity: 0.4;
	}

	.availability {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 8px 16px;
		border: 1px solid rgba(255, 255, 255, 0.2);
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
	}

	.status-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #666;
	}

	.availability.available .status-dot {
		background: #4ade80;
		box-shadow: 0 0 8px #4ade80;
	}

	.scroll-indicator {
		position: absolute;
		bottom: 40px;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 8px;
		font-size: 10px;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--color-accent);
	}

	.scroll-line {
		width: 1px;
		height: 40px;
		background: linear-gradient(to bottom, var(--color-accent), transparent);
	}

	/* Scroll Text */
	.scroll-text {
		padding: 32px 0;
		overflow: hidden;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
	}

	.scroll-text-inner {
		display: flex;
		gap: 48px;
		font-family: var(--font-serif);
		font-size: clamp(32px, 8vw, 80px);
		color: rgba(255, 255, 255, 0.15);
		white-space: nowrap;
		will-change: transform;
	}

	.scroll-text-inner .dot {
		font-size: 0.5em;
		opacity: 0.5;
	}

	/* About */
	.about {
		padding: 120px 24px;
		display: flex;
		justify-content: center;
	}

	.about-content {
		max-width: 800px;
	}

	.about-text {
		font-family: var(--font-serif);
		font-size: clamp(24px, 4vw, 40px);
		line-height: 1.4;
		color: var(--color-text);
	}

	/* Section Headers */
	.section-header {
		margin-bottom: 48px;
		padding: 0 24px;
	}

	.section-label {
		display: block;
		font-size: 11px;
		text-transform: uppercase;
		letter-spacing: 0.2em;
		color: var(--color-accent);
		margin-bottom: 8px;
	}

	.section-title {
		font-family: var(--font-serif);
		font-size: clamp(32px, 6vw, 56px);
		font-weight: 400;
	}

	/* Gallery */
	.gallery {
		padding: 80px 0;
	}

	.loading-state,
	.gallery-placeholder {
		text-align: center;
		padding: 80px 24px;
		color: var(--color-accent);
	}

	.placeholder-hint {
		font-size: 12px;
		margin-top: 8px;
		opacity: 0.6;
	}

	.gallery-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 2px;
	}

	.gallery-item {
		position: relative;
		aspect-ratio: 1;
		overflow: hidden;
		will-change: transform, opacity;
	}

	.gallery-image {
		width: 100%;
		height: 100%;
	}

	.gallery-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s ease;
	}

	.gallery-item:hover .gallery-image img {
		transform: scale(1.05);
	}

	/* Services */
	.services {
		padding: 80px 24px 120px;
		max-width: 900px;
		margin: 0 auto;
	}

	.services-list {
		display: flex;
		flex-direction: column;
	}

	.service-item {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 24px 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		will-change: transform, opacity;
	}

	.service-number {
		font-size: 12px;
		color: var(--color-accent);
		font-family: var(--font-sans);
	}

	.service-name {
		font-family: var(--font-serif);
		font-size: clamp(24px, 4vw, 36px);
	}

	.service-line {
		flex: 1;
		height: 1px;
		background: rgba(255, 255, 255, 0.1);
	}

	.service-price {
		font-size: 14px;
		color: var(--color-accent);
	}

	/* Contact */
	.contact {
		padding: 120px 24px;
		background: var(--color-text);
		color: var(--color-bg);
		text-align: center;
	}

	.contact-content {
		max-width: 600px;
		margin: 0 auto;
	}

	.contact-title {
		font-family: var(--font-serif);
		font-size: clamp(32px, 6vw, 56px);
		font-weight: 400;
		margin-bottom: 16px;
	}

	.contact-text {
		color: var(--color-text-muted);
		margin-bottom: 32px;
	}

	.contact-button {
		display: inline-block;
		padding: 16px 48px;
		background: var(--color-bg);
		color: var(--color-text);
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		transition: transform 0.3s ease, opacity 0.3s ease;
	}

	.contact-button:hover {
		transform: scale(1.02);
		opacity: 0.9;
	}

	.contact-links {
		margin-top: 48px;
		display: flex;
		justify-content: center;
		gap: 32px;
	}

	.contact-links a {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--color-text-muted);
		transition: color 0.3s ease;
	}

	.contact-links a:hover {
		color: var(--color-bg);
	}

	/* Mobile */
	@media (max-width: 768px) {
		.hero {
			min-height: 100svh;
		}

		.hero-meta {
			flex-direction: column;
			gap: 8px;
		}

		.hero-divider {
			display: none;
		}

		.gallery-grid {
			grid-template-columns: repeat(2, 1fr);
		}

		.service-item {
			flex-wrap: wrap;
			gap: 12px;
		}

		.service-line {
			display: none;
		}

		.service-price {
			margin-left: auto;
		}

		.contact {
			padding: 80px 24px;
		}
	}
</style>
