<script lang="ts">
	import ContentCard from '$lib/ui/ContentCard.svelte';
	import AuthorCard from '$lib/ui/AuthorCard.svelte';

	let { data } = $props();
</script>

<ContentCard {...data.content} extra={data.extra} />

{#if data.authors.length > 0}
	<h2 class="mt-2 mt-4 px-2 py-0.5 font-thin uppercase">Added by</h2>
	{#each data.authors as author}
		<AuthorCard {...author} />
	{/each}
{/if}
