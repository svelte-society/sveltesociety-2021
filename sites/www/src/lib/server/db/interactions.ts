import { db } from './index';

export function get_user_likes_and_saves(
	user_id: number | undefined,
	content_ids: string[]
): { user_likes: Set<string>; user_saves: Set<string> } {
	if (!user_id || content_ids.length === 0) {
		return { user_likes: new Set<string>(), user_saves: new Set<string>() };
	}

	const user_likes = new Set<string>();
	const user_saves = new Set<string>();

	const likeStmt = db.prepare('SELECT 1 FROM likes WHERE user_id = ? AND target_id = ?');
	const saveStmt = db.prepare('SELECT 1 FROM saves WHERE user_id = ? AND target_id = ?');

	db.transaction(() => {
		for (const content_id of content_ids) {
			if (likeStmt.get(user_id, content_id)) {
				user_likes.add(content_id);
			}
			if (saveStmt.get(user_id, content_id)) {
				user_saves.add(content_id);
			}
		}
	})();

	return { user_likes, user_saves };
}

export function get_user_likes_and_saves_count(user_id: number | undefined): {
	user_likes: number;
	user_saves: number;
} {
	if (!user_id) {
		return { user_likes: 0, user_saves: 0 };
	}

	let user_likes = 0;
	let user_saves = 0;

	const likeStmt = db.prepare('SELECT COUNT(1) AS count FROM likes WHERE user_id = ?');
	const saveStmt = db.prepare('SELECT COUNT(1) AS count FROM saves WHERE user_id = ?');

	db.transaction(() => {
		user_likes = (likeStmt.get(user_id) as { count: number }).count;
		user_saves = (saveStmt.get(user_id) as { count: number }).count;
	})();

	return { user_likes, user_saves };
}

type InteractionType = 'like' | 'save';

export function add_interaction(type: InteractionType, userId: string, contentId: string): void {
	const table = `${type}s`;
	const query = `INSERT OR IGNORE INTO ${table} (user_id, target_id, created_at) VALUES (?, ?, CURRENT_TIMESTAMP)`;
	db.prepare(query).run(userId, contentId);
}

export function remove_interaction(type: InteractionType, userId: string, contentId: string): void {
	const table = `${type}s`;
	const query = `DELETE FROM ${table} WHERE user_id = ? AND target_id = ?`;
	db.prepare(query).run(userId, contentId);
}
