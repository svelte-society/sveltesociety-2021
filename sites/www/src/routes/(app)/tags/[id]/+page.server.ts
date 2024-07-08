import type { PageServerLoad } from './$types';
import { contentService } from '$lib/server/db/services/content';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
    const result = await contentService.get_content_by_tag(params.id);

    if (!result.success) {
        fail(400, { message: 'Error getting content' });
    }

    return { content: result?.data?.items, count: result?.data?.totalCount };
};