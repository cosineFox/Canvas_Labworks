<script lang="ts">
	import { redirect } from '@sveltejs/kit';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/main');
	});
</script>

<!-- Loading state while redirecting -->
<div class="loading-screen">
	<div class="loading-box window">
		<div class="window-title-bar">
			<span>Loading...</span>
		</div>
		<div class="window-content">
			<p class="mono">Redirecting to Main...</p>
			<div class="progress-bar">
				<div class="progress-fill"></div>
			</div>
		</div>
	</div>
</div>

<style>
	.loading-screen {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
	}

	.loading-box {
		width: 300px;
	}

	.progress-bar {
		height: 20px;
		background: white;
		border: 2px solid;
		border-color: var(--bevel-dark) var(--bevel-light) var(--bevel-light) var(--bevel-dark);
		margin-top: 8px;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		width: 0%;
		background: var(--title-start);
		animation: load 1s ease-in-out forwards;
	}

	@keyframes load {
		0% { width: 0%; }
		100% { width: 100%; }
	}
</style>
