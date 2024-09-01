import {
	get_content_by_slug,
	get_content_users,
	get_tags_for_content
} from '$lib/server/db/content';
import { get_user_likes_and_saves } from '$lib/server/db/interactions';
import { fail } from '@sveltejs/kit';
import { get_metadata } from '$lib/server/db/content_cache';
import { get_user } from '$lib/server/db/user';

export const load = async ({ locals, params }) => {
	const content = get_content_by_slug(params.slug);
	const extra = await get_metadata(content.id);
	const authors = get_content_users(content.id);

	const tags = get_tags_for_content([content.id]);
	let content_with_tags = [content].map((c, i) => ({ ...c, tags: tags[i] || [] }));

	if (locals.user) {
		const { user_likes, user_saves } = get_user_likes_and_saves(
			locals.user.id,
			[content].map((c) => c.id)
		);

		content_with_tags = content_with_tags.map((c, i) => ({
			...c,
			liked: user_likes.has(c.id),
			saved: user_saves.has(c.id)
		}));
	}

	if (!content) {
		fail(400, { message: 'Error getting content' });
	}

	return { content: content_with_tags[0], extra, authors };
};
