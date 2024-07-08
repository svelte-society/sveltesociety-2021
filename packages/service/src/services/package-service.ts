import { Memorize, longTermCache } from "../cache.js";
import type { ContentData, ServiceInterface, ServiceMetadata } from "./abstract.js";
import { RepositoryService, TYPE as repoType } from "./repository-service.js";

export const TYPE = "package" as const;

export class PackageService implements ServiceInterface<{ cover: string}> {
	canHandle(metadata: Partial<ServiceMetadata>): Promise<boolean> {
		return Promise.resolve(metadata.type === TYPE);
	}

	@Memorize(longTermCache)
	async getInformation(metadata: ServiceMetadata): Promise<{ cover: string } & ContentData> {
		return fetch(`https://registry.npmjs.org/${metadata.identifier}`)
			.then((response) => response.json() as Promise<NpmResponse>)
			.then((response) => {
				const base: ContentData = {
					name: response.name,
					description: response.description,
					lastUpdate: response.time.modified,
					keywords: response.keywords,
					author: response.author?.name ?? response.maintainers?.map((item) => item.name).join(", "),
					url: `https://www.npmjs.com/package/${metadata.identifier}`,
					type: TYPE,
				};
				if (response.repository?.url !== undefined) {
					return new RepositoryService()
						.getInformation({ type: repoType, identifier: response.repository.url })
						.then((repo) => ({ ...repo, ...base }));
				}
				return {
					...base,
					cover: "",
				};
			});
	}
}

export interface NpmResponse {
	_id: string;
	_rev: string;
	name: string;
	description: string;
	"dist-tags": {
		latest: string;
	};
	versions: {
		[version: string]: {
			name: string;
			version: string;
			keywords?: Array<string>;
			author?: object;
			license?: string;
			_id: string;
			dist: {
				shasum: string;
				tarball: string;
				fileCount: number;
				integrity: string;
				signatures: Array<{
					sig: string;
					keyid: string;
				}>;
				unpackedSize: number;
			};
			_from: string;
			_npmUser: { name: string };
			_resolved: string;
			_integrity: string;
			repository: { url: string; type: string };
			_npmVersion: string;
			description: string;
			_nodeVersion: string;
			dependencies: object;
			_hasShrinkwrap: boolean;
			devDependencies: object;
			_npmOperationalInternal: object;
		};
	};
	time: {
		created: string;
		modified: string;
		[version: string]: string;
	};
	maintainers: Array<{ name: string }>;
	author: { name: string };
	repository: { url: string; type: string };
	keywords: Array<string>;
	license: string;
	homepage: string;
	readme: string;
	readmeFilename: string;
	contributors: Array<object>;
}
