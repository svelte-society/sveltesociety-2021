<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { formatRelativeDate } from '$lib/utils/date';

	import Tags from './Tags.svelte';

	import Recipe from '$lib/ui/content/Recipe.svelte';
	import Collection from '$lib/ui/content/Collection.svelte';
	import Video from '$lib/ui/content/Video.svelte';
	import Library from '$lib/ui/content/Library.svelte';
	import SvelteMarkdown from 'svelte-markdown';

	interface AuthorCardProps {
		id: string | number;
		username: string;
		name?: string;
		avatar_url?: string;
		bio?: string;
		twitter?: string;
		created_at?: string;
		location?: string;
	}

	let { id, username, name, avatar_url, bio, twitter, created_at, location }: AuthorCardProps =
		$props();
</script>

<article class="grid gap-2 px-8 py-2">
	<div class="mb-2 grid grid-cols-[1fr_auto] items-start justify-between text-xs">
		<div class="flex flex-col items-center sm:flex-row sm:space-x-6">
			<div class="mb-4 h-24 w-24 overflow-hidden rounded-full bg-gray-200 sm:mb-0">
				<img src={avatar_url} alt="User avatar" class="h-full w-full object-cover" />
			</div>
			<div class="text-center sm:text-left">
				<h3 class="text-xl font-semibold text-gray-900">
					{name || username}
				</h3>
				<p class="text-sm text-gray-500">@{username}</p>
				<p class="mt-2 text-sm text-gray-600">{bio}</p>
			</div>
		</div>
	</div>
</article>
