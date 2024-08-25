import { db } from './index';

export type Tag = {
	id: number;
	name: string;
	slug: string;
	color?: string | null;
	created_at: string;
};

export const get_tags = () => {
	console.warn('get_tags: No limit provided, risk of memory exhaustion');
	const stmt = db.prepare('SELECT * FROM tags');
	return stmt.all() as Tag[];
};

export const get_tag = (id: number) => {
	const stmt = db.prepare('SELECT * FROM tags WHERE id = ?');
	return stmt.get(id) as Tag | undefined;
};

export const delete_tag = (id: number) => {
	const stmt = db.prepare('DELETE FROM tags WHERE id = ?');
	const result = stmt.run(id);
	return result.changes > 0;
};

export const create_tag = (tag: Omit<Tag, 'id' | 'created_at' | 'color'>) => {
	const stmt = db.prepare('INSERT INTO tags (name, slug) VALUES (?, ?)');
	const result = stmt.run(tag.name, tag.slug);
	return result.lastInsertRowid as number;
};

export const update_tag = (tag: Omit<Tag, 'created_at'>) => {
	const stmt = db.prepare('UPDATE tags SET name = ?, slug = ? WHERE id = ?');
	const result = stmt.run(tag.name, tag.slug, tag.id);
	return result.changes > 0;
};
