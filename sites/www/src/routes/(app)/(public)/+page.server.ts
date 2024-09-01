import type { PageServerLoad } from './$types';
import {
	get_content,
	get_content_by_ids,
	get_content_count,
	get_tags_for_content
} from '$lib/server/db/content';
import {
	get_user_likes_and_saves,
	add_interaction,
	remove_interaction
} from '$lib/server/db/interactions';
import { fail } from '@sveltejs/kit';
import { get_metadata } from '$lib/server/db/content_cache';

export const load: PageServerLoad = async ({ url, fetch, locals }) => {
	const searchQuery = url.searchParams.get('search');

	if (searchQuery) {
		const resp = await fetch(`/search/${searchQuery}`);
		const content = await resp.json();

		return {
			search_results: {
				content,
				count: content.length,
				query: searchQuery
			}
		};
	} else {
		const content = get_content();
		const tags = get_tags_for_content(content.map((c) => c.id));
		const content_with_tags = content.map((c, i) => ({ ...c, tags: tags[i] || [] }));
		const all_children = [
			...new Set(content.reduce((acc, c) => [...acc, ...JSON.parse(c.children ?? '[]')], []))
		] as string[];
		const children = get_content_by_ids(all_children);

		let content_with_tags_and_children = content_with_tags.map((c, i) => ({
			...c,
			children: JSON.parse(c.children ?? '[]').map((id) =>
				children.find((child) => child.id === id)
			)
		}));

		if (locals.user) {
			const { user_likes, user_saves } = get_user_likes_and_saves(
				locals.user.id,
				content.map((c) => c.id)
			);

			content_with_tags_and_children = content_with_tags_and_children.map((c, i) => ({
				...c,
				liked: user_likes.has(c.id),
				saved: user_saves.has(c.id)
			}));
		}

		return {
			content: await Promise.all(
				content_with_tags_and_children.map(async (item) => ({
					...item,
					extra: await get_metadata(item.id)
				}))
			),
			count: 0
		};
	}
};

export const actions = {
	interact: async ({ request, locals }) => {
		if (!locals.user) return;
		const data = await request.formData();
		const type = data.get('type') as 'like' | 'save';
		const contentId = (data.get('id') as string) || null;
		const action = data.get('action') as 'add' | 'remove';

		if (!['like', 'save'].includes(type) || !['add', 'remove'].includes(action) || !contentId) {
			return fail(400, { message: 'Invalid input' });
		}

		try {
			if (action === 'add') {
				add_interaction(type, locals.user.id, contentId);
			} else {
				remove_interaction(type, locals.user.id, contentId);
			}
			return { success: true };
		} catch (error) {
			return fail(500, { message: 'Server error' });
		}
	}
};
