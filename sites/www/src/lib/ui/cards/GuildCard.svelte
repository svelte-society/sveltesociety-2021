<script lang="ts">
	import Content from '../ContentCard.svelte';
	let { id, children, members, cover, ...props } = $props();
</script>

<Content {...props} type="Guild">
	{#if cover}
		<figure>
			<img src={cover} />
		</figure>
	{/if}
	<section>
		<strong>{members}</strong> Members
	</section>
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
