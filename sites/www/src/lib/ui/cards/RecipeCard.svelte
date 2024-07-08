<script lang="ts">
	import SvelteMarkdown from 'svelte-markdown';
	import Content from '../ContentCard.svelte';
	let { id, children, preview, slug, ...props } = $props();
</script>

<Content {...props} {slug} type="Recipe">
	<SvelteMarkdown source={preview} />
	<br />
	<a href={slug}>Read more...</a>
</Content>
