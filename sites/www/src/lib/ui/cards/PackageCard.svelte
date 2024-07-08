<script lang="ts">
	import Content from '../ContentCard.svelte';
	let { id, children, cover, ...props } = $props();
</script>

<Content {...props} type="Package">
	{#if cover}
		<figure>
			<img src={cover} />
		</figure>
	{/if}
</Content>

<style>
	figure {
		margin: 0;
		padding: 0;
	}

	figure img {
		width: 100%;
		border-radius: 8px;
	}
</style>
