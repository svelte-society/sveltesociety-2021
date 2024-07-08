<script lang="ts">
	import Content from '../ContentCard.svelte';
	let {
		id,
		children,
		cover,
		startAt,
		venue,
		title,
		...props
	}: {
		id: string;
		children: unknown;
		cover: undefined | string;
		startAt: string;
		venue: undefined | [number, number];
		title: string;
	} = $props();
</script>

<Content
	{...props}
	time={startAt}
	tags={[{ id: venue ? 'physical' : 'online', name: venue ? 'Physical' : 'Online' }]}
	{title}
	type="Event"
>
	{#if cover}
		<figure>
			<img src={cover} alt={title} />
		</figure>
	{/if}
	{#if Array.isArray(venue)}
		<section>
			<iframe
				title="Venue address"
				frameborder="0"
				src="https://www.google.com/maps/embed/v1/place?q={venue[1]},{venue[0]}&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
			></iframe>
		</section>
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
	iframe {
		max-width: 100%;
		overflow: hidden;
		aspect-ratio: 3/1;
		width: 100%;
		border: 0;
		border-radius: 8px;
	}
</style>
