<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';

	import type { PageData } from './$types';
	import GuildCard from '$lib/ui/cards/GuildCard.svelte';
	import PackageCard from '$lib/ui/cards/PackageCard.svelte';
	import RecipeCard from '$lib/ui/cards/RecipeCard.svelte';
	import VideoCard from '$lib/ui/cards/VideoCard.svelte';
	import GuildEventCard from '$lib/ui/cards/GuildEventCard.svelte';
	export let data: PageData;

	let tags = [
		{ id: 'svelte5', name: 'Svelte5' },
		{ id: 'runes', name: 'Runes' }
	];
</script>

<ContentCard
	title="Working with Actions in Svelte5"
	description="SvelteKit is a great tool for building modern web applications..."
	type="Recipe"
	author="John Doe"
	time={Date.now() - 2 * 24 * 3600 * 1000}
	views="11114"
	likes="10"
	{tags}
	url="/post/working-with-actions-in-svelte5"
>
	Placeholder children content</ContentCard
>

{#each data.items as item}
	{#if item.type === 'package'}
		<PackageCard
			{...item}
			title={item.name}
			time={item.lastUpdate}
			tags={item.keywords.map((i) => ({ id: i, name: i }))}
		/>
	{:else if item.type === 'video'}
		<VideoCard
			{...item}
			title={item.name}
			time={item.lastUpdate}
			tags={item.keywords.map((i) => ({ id: i, name: i }))}
		/>
	{:else if item.type === 'recipe'}
		<RecipeCard
			{...item}
			title={item.name}
			time={item.lastUpdate}
			tags={item.keywords.map((i) => ({ id: i, name: i }))}
		/>
	{:else if item.type === 'guild'}
		<GuildCard {...item} title={item.name} time={item.lastUpdate} tags={[]} />
	{:else if item.type === 'guild-event'}
		<GuildEventCard {...item} title={item.name} tags={[]} />
	{/if}
{/each}
