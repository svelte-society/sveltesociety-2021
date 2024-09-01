<script lang="ts">
	let { embed }: { embed: string } = $props();
</script>

{#if embed}
	<iframe id="player" src={embed} style="border:none"></iframe>
{/if}

<style>
	iframe {
		border-radius: 8px;
		width: 100%;
		aspect-ratio: 16 / 9;
	}
</style>
