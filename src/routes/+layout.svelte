<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<!-- Each page is its own website - no shared UI -->
{@render children()}
