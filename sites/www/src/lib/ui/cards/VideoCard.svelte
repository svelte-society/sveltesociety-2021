<script lang="ts">
	import Content from '../ContentCard.svelte';
	let { id, children, embed, ...props } = $props();
</script>

<Content {...props} type="Video">
	<iframe id="player" src={embed} style="border:none"></iframe>
</Content>

<style>
	iframe {
		border-radius: 8px;
		width: 100%;
		aspect-ratio: 16 / 9;
	}
</style>
