import { Memorize, longTermCache } from "../cache.js";
import { ComposedService, type ContentData, type ServiceInterface, type ServiceMetadata } from "./abstract.js";

export const TYPE = "repository" as const;

/**
 * Code repository service.
 *
 * Get information about repository
 */
export class RepositoryService extends ComposedService<{ cover: string }> {
	constructor() {
		super([new GithubRepositoryService()], false);
	}
}

/**
 * Github repository service.
 *
 * Read information from a Github repository.
 *  - Repository name
 *  - Repository owner
 *  - Repository description
 *  - Date of the last commit on the default branch
 *  - List of topics
 *  - Cover picture of the repository
 *
 */
class GithubRepositoryService implements ServiceInterface<{ cover: string }> {
	canHandle(metadata: ServiceMetadata): Promise<boolean> {
		const isGithub = metadata.identifier.includes("github.com") ?? false;
		const matches = metadata.identifier.match(/github\.com\/([^\/]+)\/([^\/?#\.]+)/) ?? null;
		return Promise.resolve(isGithub && matches !== null);
	}
	@Memorize(longTermCache)
	getInformation(metadata: ServiceMetadata): Promise<(ContentData & { cover: string }) | never> {
		const matches = metadata.identifier.match(/github\.com\/([^\/]+)\/([^\/?#\.]+)/);
		if (matches === null) {
			throw new Error("Incompatible data service");
		}
		return this.getStats(matches[1], matches[2]).then((response) => ({
			name: response.name,
			description: response.description,
			type: TYPE,
			lastUpdate: response.updated_at,
			keywords: response.topics,
			author: response.owner.login,
			cover: `https://opengraph.githubassets.com/HEAD/${matches[1]}/${matches[2]}`,
			url: `https://github.com/${matches[1]}/${matches[2]}`
		}));
	}
	private async getStats(user: string, repo: string): Promise<GithubStatResponse> {
		return fetch(`https://api.github.com/repos/${user}/${repo}`).then((response) => response.json());
	}
}

type GithubStatResponse = {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	private: boolean;
	owner: {
		login: string;
		id: number;
		node_id: string;
		avatar_url: string;
		gravatar_id: string;
		url: string;
		html_url: string;
		followers_url: string;
		following_url: string;
		gists_url: string;
		starred_url: string;
		subscriptions_url: string;
		organizations_url: string;
		repos_url: string;
		events_url: string;
		received_events_url: string;
		type: string;
		site_admin: boolean;
	};
	html_url: string;
	description: string;
	fork: boolean;
	url: string;
	forks_url: string;
	keys_url: string;
	collaborators_url: string;
	teams_url: string;
	hooks_url: string;
	issue_events_url: string;
	events_url: string;
	assignees_url: string;
	branches_url: string;
	tags_url: string;
	blobs_url: string;
	git_tags_url: string;
	git_refs_url: string;
	trees_url: string;
	statuses_url: string;
	languages_url: string;
	stargazers_url: string;
	contributors_url: string;
	subscribers_url: string;
	subscription_url: string;
	commits_url: string;
	git_commits_url: string;
	comments_url: string;
	issue_comment_url: string;
	contents_url: string;
	compare_url: string;
	merges_url: string;
	archive_url: string;
	downloads_url: string;
	issues_url: string;
	pulls_url: string;
	milestones_url: string;
	notifications_url: string;
	labels_url: string;
	releases_url: string;
	deployments_url: string;
	created_at: string;
	updated_at: string;
	pushed_at: string;
	git_url: string;
	ssh_url: string;
	clone_url: string;
	svn_url: string;
	homepage: null | string;
	size: number;
	stargazers_count: number;
	watchers_count: number;
	language: string;
	has_issues: boolean;
	has_projects: boolean;
	has_downloads: boolean;
	has_wiki: boolean;
	has_pages: boolean;
	has_discussions: boolean;
	forks_count: number;
	mirror_url: null;
	archived: boolean;
	disabled: boolean;
	open_issues_count: number;
	license: {
		key: string;
		name: string;
		spdx_id: string;
		url: string;
		node_id: string;
	};
	allow_forking: boolean;
	is_template: boolean;
	web_commit_signoff_required: boolean;
	topics: Array<string>;
	visibility: string;
	forks: number;
	open_issues: number;
	watchers: number;
	default_branch: string;
	temp_clone_token: null | string;
	network_count: number;
	subscribers_count: number;
};
