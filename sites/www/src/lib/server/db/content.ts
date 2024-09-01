import { db } from './index';
import { type Tag } from './tags';
import { Status } from '$lib/server/db/common';
import { get_user_by_ids, type User } from '$lib/server/db/user';

interface GetContentParams {
	limit?: number;
	offset?: number;
	types?: string[];
}

type ContentInput = {
	title: string;
	type: string;
	status?: string;
	body?: string;
	rendered_body?: string;
	slug: string;
	description?: string;
	metadata?: Record<string, any>;
	children?: number[];
	tags?: number[];
};

export type Content = {
	id: string;
	title: string;
	type: string;
	status: Status;
	body: string;
	rendered_body: string;
	slug: string;
	description: string;
	metadata: Record<string, any>;
	children: string;
	created_at: string;
	updated_at: string;
	published_at: string | null;
	likes: number;
	saves: number;
};

export type PreviewContent = Omit<Content, 'body' | 'rendered_body'>;

export const get_content = ({
	limit = 15,
	offset = 0,
	types = []
}: GetContentParams = {}): PreviewContent[] => {
	let query = `
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves 
        FROM published_content
        ORDER BY published_at ASC
    `;

	const params: Record<string, any> = { limit, offset };

	if (types.length > 0) {
		query += ' WHERE type IN (' + types.map((_, i) => `@type${i}`).join(', ') + ')';
		types.forEach((type, i) => {
			params[`@type${i}`] = type;
		});
	}

	query += ' LIMIT @limit OFFSET @offset';

	const stmt = db.prepare(query);
	return stmt.all(params) as PreviewContent[];
};

export const get_all_content = (): PreviewContent[] => {
	console.warn('get_all_content: No limit provided, risk of memory exhaustion');
	const stmt = db.prepare(`
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves,
            status
        FROM content_without_collections
    `);
	return stmt.all() as PreviewContent[];
};

export const get_content_by_type = (type: string): PreviewContent[] => {
	console.warn('get_content_by_type: No limit provided, risk of memory exhaustion');
	const stmt = db.prepare(`
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves
        FROM published_content
        WHERE type = ?
    `);
	return stmt.all(type) as PreviewContent[];
};

export const get_content_by_slug = (slug: string): PreviewContent => {
	const stmt = db.prepare(`
        SELECT *
        FROM published_content
        WHERE slug = ?
    `);
	return stmt.get(slug) as PreviewContent;
};

export const get_content_count = () => {
	const stmt = db.prepare('SELECT COUNT(*) as count FROM content');
	return (stmt.get() as { count: number }).count;
};

export const get_tags_for_content = (content_ids: string[]): Tag[][] => {
	const stmt = db.prepare(`
        SELECT t.id, t.name, t.slug, t.color
        FROM content_to_tags ct
        JOIN tags t ON ct.tag_id = t.id
        WHERE ct.content_id = ?
      `);

	const getManyTags = db.transaction((ids: string[]) => {
		const results: Tag[][] = [];
		for (const id of ids) {
			const tags = stmt.all(id) as Tag[];
			results.push(tags);
		}
		return results;
	});

	return getManyTags(content_ids);
};

export const get_content_by_ids = (contentIds: string[]): PreviewContent[] => {
	if (contentIds.length === 0) {
		return [];
	}

	const placeholders = contentIds.map(() => '?').join(',');
	const stmt = db.prepare(`
        SELECT 
            id, 
            title, 
            type, 
            slug, 
            description, 
            children, 
            created_at, 
            updated_at, 
            published_at, 
            likes, 
            saves 
        FROM published_content
        WHERE id IN (${placeholders})
    `);

	try {
		return stmt.all(...contentIds) as PreviewContent[];
	} catch (error) {
		console.error('Error fetching content:', error);
		return [];
	}
};

interface GetContentByTagOptions {
	slug: string;
	limit?: number;
	offset?: number;
}

export const get_content_by_tag = (options: GetContentByTagOptions): Content[] => {
	const { slug, limit = 10, offset = 0 } = options;

	const query = `
        SELECT 
            c.id, 
            c.title, 
            c.type, 
            c.slug, 
            c.description, 
            c.children, 
            c.created_at, 
            c.updated_at, 
            c.published_at, 
            c.likes, 
            c.saves
      FROM published_content c
      JOIN content_to_tags ct ON c.id = ct.content_id
      JOIN tags t ON ct.tag_id = t.id
      WHERE t.slug = @slug
      ORDER BY c.published_at DESC
      LIMIT @limit OFFSET @offset
    `;

	const stmt = db.prepare(query);
	return stmt.all({ slug, limit, offset }) as Content[];
};

export const get_content_by_tag_count = (slug: string): number => {
	const queryCount = `
        SELECT COUNT(*) as count
        FROM published_content c
        JOIN content_to_tags ct ON c.id = ct.content_id
        JOIN tags t ON ct.tag_id = t.id
        WHERE t.slug = ?
    `;

	const stmtCount = db.prepare(queryCount);

	const { count } = stmtCount.get(slug) as { count: number };

	return count;
};

interface GetSavedContentOptions {
	user_id: number;
	limit?: number;
	offset?: number;
}

export function get_user_saved_content(options: GetSavedContentOptions): Content[] {
	const { user_id, limit = 10, offset = 0 } = options;

	const queryContent = `
        SELECT 
            c.id, 
            c.title, 
            c.type, 
            c.slug, 
            c.description, 
            c.children, 
            c.created_at, 
            c.updated_at, 
            c.published_at, 
            c.likes, 
            c.saves
      FROM published_content c
      JOIN saves s ON c.id = s.target_id
      WHERE s.user_id = ?
      ORDER BY s.created_at DESC
      LIMIT ? OFFSET ?
    `;
	const stmtContent = db.prepare(queryContent);

	const content = stmtContent.all(user_id, limit, offset) as Content[];

	return content;
}

export const delete_content = (id: number): boolean => {
	const stmt = db.prepare(`
        DELETE FROM content
        WHERE id = ?
    `);

	try {
		const result = stmt.run(id);
		return result.changes > 0;
	} catch (error) {
		console.error('Error deleting content:', error);
		return false;
	}
};

export const create_content = (input: ContentInput): number | null => {
	const {
		title,
		type,
		status = Status.DRAFT,
		body = null,
		rendered_body = null,
		slug,
		description = null,
		metadata = null,
		children = null,
		tags = null
	} = input;

	const stmt = db.prepare(`
        INSERT INTO content (
            title,
            type,
            status,
            body,
            rendered_body,
            slug,
            description,
            metadata,
            children,
            created_at,
            updated_at
        ) VALUES (
            @title,
            @type,
            @status,
            @body,
            @rendered_body,
            @slug,
            @description,
            @metadata,
            @children,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP
        )
    `);

	try {
		const result = stmt.run({
			title,
			type,
			status,
			body,
			rendered_body,
			slug,
			description,
			metadata: metadata ? JSON.stringify(metadata) : null,
			children: children ? JSON.stringify(children) : null
		});
		update_content_tags(Number(result.lastInsertRowid), tags ?? []);

		// Return the ID of the newly inserted content
		return result.lastInsertRowid as number;
	} catch (error) {
		console.error('Error creating content:', error);
		return null;
	}
};

export const get_content_by_id = (id: string): Content | null => {
	const stmt = db.prepare(`
        SELECT *
        FROM content
        WHERE id = ?
    `);

	try {
		const result = stmt.get(id) as (Omit<Content, 'children'> & { children: string }) | undefined;

		if (!result) {
			return null;
		}

		const children = result.children ? JSON.parse(result.children) : [];

		return {
			...result,
			metadata: JSON.parse((result.metadata as unknown as string | undefined) ?? '{}'),
			children
		};
	} catch (error) {
		console.error('Error fetching content by id:', error);
		return null;
	}
};

export const update_content = (input: ContentInput & { id: number }): boolean => {
	const {
		id,
		title,
		type,
		status,
		body,
		rendered_body,
		slug,
		description,
		metadata,
		children,
		tags
	} = input;

	const stmt = db.prepare(`
        UPDATE content
        SET
            title = @title,
            type = @type,
            status = @status,
            body = @body,
            rendered_body = @rendered_body,
            slug = @slug,
            description = @description,
            metadata = @metadata,
            children = @children,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = @id
    `);

	try {
		const result = stmt.run({
			id,
			title,
			type,
			status,
			body,
			rendered_body,
			slug,
			description,
			metadata: metadata ? JSON.stringify(metadata) : null,
			children: children ? JSON.stringify(children) : null
		});
		update_content_tags(id, tags ?? []);

		return result.changes > 0;
	} catch (error) {
		console.error('Error updating content:', error);
		return false;
	}
};

const update_content_tags = (contentId: number, tags: number[]) => {
	const remove_tags = db.prepare(`
    DELETE FROM content_to_tags
           WHERE content_id = @contentId AND tag_id NOT IN (${tags.map((_) => '?').join(',')})
    `);
	const upsert_tags = db.prepare(`
    INSERT INTO content_to_tags (content_id, tag_id)
        SELECT @contentId AS content_id, tags.id AS tag_id 
        FROM tags 
        WHERE tags.id in (${tags.map((_) => '?').join(',')})
    ON CONFLICT DO NOTHING 

    `);

	try {
		remove_tags.run({ contentId }, ...tags);
		upsert_tags.run({ contentId }, ...tags);
	} catch (error) {
		console.error('Error updating content tags:', error);
	}
};

export function get_content_users(content_id: string): Array<User> {
	const relationStmt = db.prepare(`
	SELECT user_id from content_to_users WHERE content_id = @content_id
	`);
	const user_ids = relationStmt.all({ content_id }).map((item) => item.user_id) as Array<number>;
	return get_user_by_ids(user_ids);
}
