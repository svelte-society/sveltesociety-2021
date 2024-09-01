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

	interface ContentCardProps {
		id: string | number;
		title: string;
		description?: string;
		rendered_body?: string;
		body?: string;
		type: string;
		author: string;
		published_at: string;
		views: number;
		likes: number;
		liked: boolean;
		saves: number;
		saved: boolean;
		tags: string[];
		slug: string;
		child_content: any[];
		extra: any;
	}

	let {
		id,
		title,
		description,
		rendered_body,
		body,
		type,
		author,
		published_at,
		views,
		likes,
		liked,
		saves,
		saved,
		tags,
		slug,
		child_content,
		extra
	}: ContentCardProps = $props();

	let submitting_like_toggle = $state(false);
	let submitting_save_toggle = $state(false);

	const likeSubmit = ({ cancel }) => {
		if (!$page.data.user) {
			cancel();
			return;
		}
		submitting_like_toggle = true;
		likes = liked ? likes - 1 : likes + 1;
		liked = !liked;
		return async ({ result }) => {
			if (!result?.data?.success) {
				likes = liked ? likes + 1 : likes - 1;
				liked = !liked;
			}
			submitting_like_toggle = false;
		};
	};
	const saveSubmit = () => {
		if (!$page.data.user) {
			cancel();
			return;
		}
		submitting_save_toggle = true;
		saves = saved ? saves - 1 : saves + 1;
		saved = !saved;
		return async ({ result }) => {
			if (!result?.data?.success) {
				saves = saved ? saves + 1 : saves - 1;
				saved = !saved;
			}
			submitting_save_toggle = false;
		};
	};
</script>

<article class="grid gap-2 rounded-lg bg-zinc-50 px-6 py-5">
	<div class="mb-2 grid grid-cols-[1fr_auto] items-start justify-between text-xs">
		<div class="flex">
			<span class="font-semibold capitalize">{type}&nbsp;</span>
			<span class="flex text-gray-500"
				><span>by {author ?? extra.author} • {formatRelativeDate(published_at)} •&nbsp;</span>
				<span class="flex items-center gap-1">
					{views}
					<svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
						<title>views</title>
						<path
							fill-rule="evenodd"
							clip-rule="evenodd"
							d="M1.25937 5.94874C1.56882 5.48321 2.19069 4.63614 3.03377 3.91108C3.882 3.18157 4.89578 2.625 6.00025 2.625C7.10472 2.625 8.11854 3.18157 8.96672 3.91108C9.80979 4.63614 10.4317 5.48321 10.7411 5.94874C10.7627 5.98125 10.7627 6.01875 10.7411 6.05126C10.4317 6.51679 9.80979 7.36386 8.96672 8.0889C8.11854 8.81843 7.10472 9.375 6.00025 9.375C4.89578 9.375 3.882 8.81843 3.03377 8.0889C2.19069 7.36386 1.56882 6.51679 1.25937 6.05126C1.23776 6.01875 1.23776 5.98125 1.25937 5.94874ZM6.00025 1.5C4.51423 1.5 3.24714 2.24375 2.30021 3.05813C1.34813 3.87695 0.660585 4.8173 0.32247 5.32597C0.0500614 5.73578 0.0500625 6.26422 0.32247 6.67403C0.660585 7.1827 1.34813 8.12302 2.30021 8.94187C3.24714 9.75622 4.51423 10.5 6.00025 10.5C7.48627 10.5 8.75334 9.75622 9.70029 8.94187C10.6523 8.12302 11.3399 7.1827 11.678 6.67403C11.9504 6.26422 11.9504 5.73578 11.678 5.32597C11.3399 4.8173 10.6523 3.87695 9.70029 3.05813C8.75334 2.24375 7.48627 1.5 6.00025 1.5ZM6.00024 7.5C6.82867 7.5 7.50024 6.82843 7.50024 6C7.50024 5.17157 6.82867 4.5 6.00024 4.5C5.17182 4.5 4.50024 5.17157 4.50024 6C4.50024 6.82843 5.17182 7.5 6.00024 7.5Z"
							fill="#64748B"
						/>
					</svg>
				</span>
			</span>
		</div>
		<div class="flex items-center space-x-4">
			<form method="POST" action="/?/interact" use:enhance={likeSubmit}>
				<input type="hidden" name="id" value={id} />
				<input type="hidden" name="action" value={liked ? 'remove' : 'add'} />
				<input type="hidden" id="type" name="type" value="like" />

				<button
					data-sveltekit-keepfocus
					disabled={submitting_like_toggle}
					aria-label="Like {type}"
					type="submit"
					class="-mx-2 -my-1 flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						xmlns="http://www.w3.org/2000/svg"
						class="mr-0.5"
					>
						<title>{liked ? 'Remove like' : 'Like'}</title>
						{#if liked}
							<path
								d="M6.62532 0.049567C5.62075 -0.0649162 4.87498 0.78591 4.87498 1.68679V2.06223C4.87498 3.05844 4.38994 3.6545 3.88685 4.02214C3.64068 4.20203 3.39161 4.32474 3.19794 4.40354C2.97064 4.01263 2.54726 3.74982 2.0625 3.74982H1.3125C0.587626 3.74982 0 4.33745 0 5.06232V10.6874C0 11.4122 0.587626 11.9999 1.3125 11.9999H2.0625C2.64352 11.9999 3.13637 11.6223 3.3091 11.0991C3.70246 11.1553 4.10958 11.2706 4.60301 11.4104L4.60316 11.4104C4.71683 11.4426 4.83508 11.4761 4.95881 11.5105C5.82428 11.7509 6.86444 11.9997 8.25 11.9997C9.52927 11.9997 10.4772 11.8855 11.0411 11.1453C11.306 10.7978 11.4439 10.3638 11.5427 9.89123C11.6307 9.47055 11.6986 8.95845 11.7771 8.3661L11.8075 8.1366C11.9944 6.73531 12.0063 5.64813 11.6661 4.89976C11.4831 4.49729 11.1996 4.1928 10.8137 3.99965C10.443 3.81409 10.0148 3.74973 9.5625 3.74973H8.49578L8.50702 3.66548V3.66547C8.5593 3.2768 8.625 2.78842 8.625 2.43723C8.625 1.74608 8.51153 1.14827 8.1333 0.71266C7.74983 0.270907 7.1979 0.114819 6.62532 0.049567Z"
								fill="currentColor"
							/>
						{:else}
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M6.62532 0.049567C5.62075 -0.0649162 4.87498 0.78591 4.87498 1.68679V2.06223C4.87498 3.05844 4.38994 3.6545 3.88685 4.02214C3.64068 4.20203 3.39161 4.32474 3.19794 4.40354C2.97064 4.01263 2.54726 3.74982 2.0625 3.74982H1.3125C0.587626 3.74982 0 4.33745 0 5.06232V10.6874C0 11.4122 0.587626 11.9999 1.3125 11.9999H2.0625C2.64352 11.9999 3.13637 11.6223 3.3091 11.0991C3.70246 11.1553 4.10958 11.2706 4.60301 11.4104L4.60316 11.4104C4.71683 11.4426 4.83508 11.4761 4.95881 11.5105C5.82428 11.7509 6.86444 11.9997 8.25 11.9997C9.52927 11.9997 10.4772 11.8855 11.0411 11.1453C11.306 10.7978 11.4439 10.3638 11.5427 9.89123C11.6307 9.47055 11.6986 8.95845 11.7771 8.3661L11.8075 8.1366C11.9944 6.73531 12.0063 5.64813 11.6661 4.89976C11.4831 4.49729 11.1996 4.1928 10.8137 3.99965C10.443 3.81409 10.0148 3.74973 9.5625 3.74973H8.49578L8.50702 3.66548V3.66547C8.5593 3.2768 8.625 2.78842 8.625 2.43723C8.625 1.74608 8.51153 1.14827 8.1333 0.71266C7.74983 0.270907 7.1979 0.114819 6.62532 0.049567ZM3.375 9.97388C3.90399 10.0403 4.41791 10.187 4.92908 10.3329H4.92908C5.03944 10.3644 5.14968 10.3959 5.25991 10.4265C6.08194 10.6549 7.01051 10.8747 8.25 10.8747C9.59565 10.8747 9.96023 10.7078 10.1463 10.4636C10.2565 10.3189 10.3529 10.0849 10.4416 9.66098C10.5204 9.28418 10.5822 8.8179 10.6625 8.21348L10.6924 7.98788C10.8806 6.57665 10.8345 5.78884 10.642 5.36534C10.5585 5.18186 10.4511 5.0762 10.3102 5.00567C10.1541 4.92756 9.91973 4.87473 9.5625 4.87473H8.2497C7.7358 4.87473 7.27876 4.442 7.34582 3.87279C7.36273 3.72929 7.38262 3.58106 7.40239 3.43371C7.45155 3.06737 7.49998 2.70649 7.49998 2.43723C7.49998 1.83079 7.39171 1.57446 7.28383 1.4502C7.18128 1.33208 6.98276 1.22258 6.49794 1.16733C6.26792 1.14112 5.99998 1.3451 5.99998 1.6868V2.06223C5.99998 3.50352 5.26628 4.40746 4.55062 4.93045C4.19808 5.18808 3.8487 5.35562 3.58861 5.45898C3.50911 5.49058 3.43716 5.5165 3.375 5.53739V9.97388ZM2.0625 4.87482C2.16605 4.87482 2.25 4.95876 2.25 5.06232V10.4997V10.6874C2.25 10.7909 2.16605 10.8749 2.0625 10.8749H1.3125C1.20895 10.8749 1.125 10.7909 1.125 10.6874V5.06232C1.125 4.95876 1.20895 4.87482 1.3125 4.87482H2.0625Z"
								fill="currentColor"
							/>
						{/if}
					</svg>
					{likes}
				</button>
			</form>
			<form use:enhance={saveSubmit} method="POST" action="/?/interact">
				<input type="hidden" name="id" value={id} />
				<input type="hidden" name="action" value={saved ? 'remove' : 'add'} />
				<input type="hidden" id="type" name="type" value="save" />
				<button
					disabled={submitting_save_toggle}
					aria-label="Like {type}"
					type="submit"
					class="-mx-2 -my-1 flex items-center gap-1 rounded-md px-2 py-1 text-gray-600 hover:bg-gray-200 hover:text-gray-700"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 12 12"
						xmlns="http://www.w3.org/2000/svg"
						class="mr-0.5"
					>
						<title>{saved ? 'Unsave' : 'Save'}</title>
						{#if saved}
							<path
								d="M3.5625 0.75C2.83763 0.75 2.25 1.33763 2.25 2.0625V10.6875C2.25 10.9052 2.37558 11.1033 2.57243 11.1962C2.76928 11.2891 3.00206 11.26 3.17008 11.1217L6 8.7912L8.8299 11.1217C8.99797 11.26 9.2307 11.2891 9.42758 11.1962C9.62445 11.1033 9.75 10.9052 9.75 10.6875V2.0625C9.75 1.33763 9.16237 0.75 8.4375 0.75H3.5625Z"
								fill="currentColor"
							/>
						{:else}
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M3.5625 1.875C3.45895 1.875 3.375 1.95895 3.375 2.0625V9.4956L5.64242 7.62832C5.85012 7.45723 6.14988 7.45723 6.35758 7.62832L8.625 9.4956V2.0625C8.625 1.95895 8.54108 1.875 8.4375 1.875H3.5625ZM2.25 2.0625C2.25 1.33763 2.83763 0.75 3.5625 0.75H8.4375C9.16237 0.75 9.75 1.33763 9.75 2.0625V10.6875C9.75 10.9052 9.62445 11.1033 9.42758 11.1962C9.2307 11.2891 8.99797 11.26 8.8299 11.1217L6 8.7912L3.17008 11.1217C3.00206 11.26 2.76928 11.2891 2.57243 11.1962C2.37558 11.1033 2.25 10.9052 2.25 10.6875V2.0625Z"
								fill="currentColor"
							/>
						{/if}
					</svg>
					{saves}
				</button>
			</form>
		</div>
	</div>

	<h2 class="mb-2 text-xl font-bold"><a href="/{type}/{slug}">{title}</a></h2>
	{description}

	<div>
		{#if type === 'recipe'}
			<Recipe />
		{:else if type === 'collection'}
			<Collection {type} {slug} {child_content} />
		{:else if type === 'video'}
			<Video {...extra} />
		{:else if type === 'library'}
			<Library {...extra} />
		{/if}
	</div>
	{#if $page.route.id === '/(app)/(public)/[type]/[slug]' && (rendered_body || body)}
		<section class="prose">
			{#if rendered_body}
				{@html rendered_body}
			{:else if body}
				<SvelteMarkdown source={body} />
			{/if}
		</section>
	{/if}

	<div class="mt-4 grid grid-cols-[1fr_auto] items-start justify-between">
		<div class="flex space-x-2">
			<Tags {tags} />
		</div>

		<div class="text-xs text-gray-500">{formatRelativeDate(published_at)}</div>
	</div>
</article>
