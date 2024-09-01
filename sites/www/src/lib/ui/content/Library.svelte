<script lang="ts">
	import { formatRelativeDate } from '$lib/utils/date';

	type Props = { cover: string; updated_at: string; last: string; week_download: number };

	let { cover, updated_at, last, week_download }: Props = $props();
</script>

{#if last && updated_at}
	<dl>
		<dt>Last version</dt>
		<dd>{last}</dd>
		<dt>Last update</dt>
		<dd>{formatRelativeDate(updated_at)}</dd>
		<dt>Last week download</dt>
		<dd>{Intl.NumberFormat().format(week_download)}</dd>
	</dl>
{/if}
{#if cover}
	<figure>
		<img src={cover} />
	</figure>
{/if}

<style>
	figure {
		margin: 0;
		padding: 0;
	}
	figure img {
		width: 100%;
		border-radius: 8px;
	}

	dl {
		display: grid;
		grid-template-columns: 0fr 1fr;
		column-gap: 1rem;
		padding: 1rem;
	}
	dl dt {
		font-weight: bold;
		white-space: nowrap;
		text-align: right;
	}
</style>
