import { db } from './index';

interface GitHubUserInfo {
	id: number;
	email?: string;
	name?: string;
	login: string;
	avatar_url?: string;
	bio?: string;
	location?: string;
	twitter_username?: string;
}

export interface User {
	id: string;
	github_id: number;
	email: string | null;
	username: string;
	name: string | null;
	avatar_url: string | null;
	bio: string | null;
	location: string | null;
	twitter: string | null;
	role: number;
}

export const get_user = (id: number): User | undefined => {
	const stmt = db.prepare(`
      SELECT * FROM users
      WHERE id = @id
    `);

	try {
		return stmt.get({ id }) as User;
	} catch (error) {
		console.error('Error getting user:', error);
		return undefined;
	}
};

export const get_user_by_ids = (ids: number[]): User[] => {
	const stmt = db.prepare(`
      SELECT * FROM users
      WHERE id IN (${ids.map((_) => '?').join(',')})
    `);

	try {
		return stmt.all(...ids) as User[];
	} catch (error) {
		console.error('Error getting user:', error);
		return [];
	}
};

export const get_users = (): User[] => {
	console.warn('get_users: No limit provided, risk of memory exhaustion');
	const stmt = db.prepare(`
      SELECT * FROM users
    `);

	try {
		return stmt.all() as User[];
	} catch (error) {
		console.error('Error getting users:', error);
		return [];
	}
};

export const get_user_count = (): Number => {
	const stmt = db.prepare(`
      SELECT COUNT(*) as count
      FROM users
    `);

	try {
		const result = stmt.get() as { count: number };
		return result.count;
	} catch (error) {
		console.error('Error getting user:', error);
		return 0;
	}
};

export const create_or_update_user = (githubInfo: GitHubUserInfo): User => {
	const userInfo = extractGithubUserInfo(githubInfo);

	const stmt = db.prepare(`
      INSERT INTO users (github_id, email, username, name, avatar_url, bio, location, twitter)
      VALUES (@github_id, @email, @username, @name, @avatar_url, @bio, @location, @twitter)
      ON CONFLICT (github_id) DO UPDATE SET
        email = @email,
        name = @name,
        username = @username,
        avatar_url = @avatar_url,
        bio = @bio,
        location = @location,
        twitter = @twitter
      RETURNING *
    `);

	try {
		return stmt.get(userInfo) as User;
	} catch (error) {
		console.error('Error upserting user:', error);
		throw error;
	}
};

export const update_user = (userId: number, updatedInfo: Partial<User>): User | null => {
	const updateFields = Object.keys(updatedInfo)
		.filter((key) => key !== 'id' && key !== 'github_id') // Exclude id and github_id from updates
		.map((key) => `${key} = @${key}`)
		.join(', ');

	if (!updateFields) {
		console.warn('No valid fields to update');
		return null;
	}

	const stmt = db.prepare(`
        UPDATE users
        SET ${updateFields}
        WHERE id = @userId
        RETURNING *
    `);

	try {
		const result = stmt.get({ ...updatedInfo, userId }) as User | undefined;
		return result || null;
	} catch (error) {
		console.error('Error updating user:', error);
		throw error;
	}
};

export const delete_user = (userId: number): boolean => {
	const stmt = db.prepare(`
      DELETE FROM users
      WHERE id = @userId
    `);

	try {
		const result = stmt.run({ userId });
		return result.changes > 0;
	} catch (error) {
		console.error('Error deleting user:', error);
		return false;
	}
};

function extractGithubUserInfo(info: GitHubUserInfo): Omit<User, 'id' | 'role'> {
	return {
		github_id: info.id,
		email: info.email || null,
		username: info.login,
		name: info.name || null,
		avatar_url: info.avatar_url || null,
		bio: info.bio || null,
		location: info.location || null,
		twitter: info.twitter_username || null
	};
}
