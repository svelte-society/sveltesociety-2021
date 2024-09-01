import { db } from './index';
import { type Content, get_content_by_id } from '$lib/server/db/content';
import { type Cache, cachified } from '@epic-web/cachified';

export type ContentCache = {
	content_id: string;
	content?: string;
};
export type FetchMetadata = { ttl: number; content: object };
const ONE_DAY = 24 * 3600 * 1000;
const FIVE_MINUTES = 300 * 1000;

const dbCache: Cache<object> = {
	get(key: string) {
		let query = `
        SELECT 
            content_id, 
            content
        FROM content_cache
        WHERE content_id = @content_id
    `;
		const value = (db.prepare(query).get({ content_id: key }) as ContentCache).content;
		return value ? JSON.parse(value).value : undefined;
	},
	set(key: string, value: object): void {
		const pendingStmt = db.prepare(`
		INSERT INTO content_cache (content_id, content) VALUES (@content_id, @content) ON CONFLICT DO UPDATE SET content = content
	`);
		pendingStmt.run({ content_id: key, content: JSON.stringify(value) });
	},
	delete(key: string): void {
		db.prepare('DELETE FROM content_cache WHERE content_id = @content_id').run({ content_id: key });
	}
};

export const get_metadata = (content_id: string): Promise<object> => {
	return cachified<object>({
		cache: dbCache,
		key: content_id,
		ttl: ONE_DAY,
		forceFresh: false,
		async getFreshValue(context) {
			const { ttl, content } = await get_content_metadata(content_id);
			context.metadata.ttl = ttl;
			return content;
		},
		staleWhileRevalidate: FIVE_MINUTES
	});
};

async function get_content_metadata(content_id: string): Promise<FetchMetadata> {
	const content = get_content_by_id(content_id);

	if (content?.type === 'video') {
		return get_video_metadata(content.metadata);
	}
	if (content?.type === 'library') {
		return get_npm_metadata(content.metadata);
	}

	return {
		content: {},
		ttl: FIVE_MINUTES
	};
}
async function get_video_metadata(metadata: Content['metadata']): Promise<FetchMetadata> {
	const youtubeResponse = await fetch(
		'https://www.youtube.com/youtubei/v1/player?prettyPrint=false',
		{
			body: JSON.stringify({
				context: { client: { clientName: 'WEB', clientVersion: '2.20240628.01.00' } },
				videoId: metadata.videoId
			}),
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			}
		}
	).then((response) => response.json());
	return {
		content: {
			embed: `https://www.youtube.com/embed/${metadata.videoId}?controls=0&modestbranding=1&color=white&showinfo=0`,
			author: youtubeResponse.videoDetails.author
		},
		ttl: 30 * ONE_DAY
	};
}

async function get_npm_metadata(metadata: Content['metadata']): Promise<FetchMetadata> {
	const npmResponse = (await fetch(`https://registry.npmjs.org/${metadata.npm}`).then((response) =>
		response.json()
	)) as NpmResponse;
	const npmDownload = (await fetch(
		`https://api.npmjs.org/downloads/point/last-week/${metadata.npm}`
	).then((response) => response.json())) as NpmDownloadResponse;

	const get_cover = (repository: string): string | undefined => {
		if (repository.startsWith('https://github.com/')) {
			return repository
				.replace('https://github.com/', 'https://opengraph.githubassets.com/HEAD/')
				.replace(/\.git$/, '');
		}
		if (repository.startsWith('git+https://github.com/')) {
			return repository
				.replace('git+https://github.com/', 'https://opengraph.githubassets.com/HEAD/')
				.replace(/\.git$/, '');
		}
		return undefined;
	};

	return {
		content: {
			updated_at: npmResponse.time?.modified,
			last: npmResponse['dist-tags']?.latest,
			repository: npmResponse.repository?.url,
			cover: get_cover(npmResponse.repository?.url ?? ''),
			week_download: npmDownload.downloads,
			author: npmResponse.maintainers?.map((item) => item.name).join(', ')
		},
		ttl: ONE_DAY
	};
}

interface NpmResponse {
	name: string;
	description: string;
	'dist-tags': {
		latest: string;
	};
	time: {
		created: string;
		modified: string;
		[version: string]: string;
	};
	maintainers: Array<{ name: string }>;
	repository: { url: string; type: string };
}
interface NpmDownloadResponse {
	downloads: number;
	start: string;
	end: string;
	package: string;
}
