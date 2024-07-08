import { Memorize, longTermCache } from "../cache.js";
import type { ContentData, ServiceInterface, ServiceMetadata } from "./abstract.js";

export const TYPE = "guild" as const;

export class GuildService implements ServiceInterface<{ cover: string; members: number }> {
	canHandle(metadata: ServiceMetadata): Promise<boolean> {
		return Promise.resolve(metadata.type === TYPE);
	}
	async getInformation(metadata: ServiceMetadata): Promise<(ContentData & { cover: string; members: number }) | never> {
		const guilds = await this.getGuilds();
		let guild: GuildHostGuildNodeResponse | undefined = guilds.data.nodeBySlugId.guilds.edges.find(
			(guild) => guild.node.slugId === metadata.identifier,
		)?.node;

		if (guild === undefined) {
			guild = (await this.getOneGuild(metadata.identifier))?.data.nodeBySlugId;
		}

		if (guild === undefined) {
			throw new Error("Invalid data service");
		}

		return {
			name: guild.name,
			description: guild.description,
			type: TYPE,
			author: "guild.host",
			keywords: [],
			members: guild.networkMembers.totalCount,
			url: `https://guild.host/${guild.slugId}`,
			cover: guild.backgroundPhoto
				? `https://ik.imagekit.io/guild/prod/tr:w-600,dpr-1/${guild.backgroundPhoto?.rowId}.${guild.backgroundPhoto?.contentType.toLowerCase()}`
				: "",
		};
	}

	@Memorize(longTermCache)
	private getOneGuild(id: string): Promise<GuildHostOneResponse> {
		return fetch("https://guild.host/graphql/1bab259132f26a669a0dbe5184260401be37f259bf888010711abab5438e8e51", {
			headers: {
				"X-Gqlvars": `{"id":"${id}"}`,
			},
		}).then((response) => response.json());
	}

	@Memorize(longTermCache)
	private getGuilds(): Promise<GuildHostResponse> {
		return fetch("https://guild.host/graphql/932d20dc08db4fb8d9f86e17908ba8ccb8b1de931ad51718689570c942c82c71", {
			headers: {
				"X-Gqlvars": '{"id":"svelte-society"}',
			},
		}).then((response) => response.json());
	}

	getAllServiceMetadata(): Promise<Array<ServiceMetadata>> {
		return this.getGuilds().then((response) =>
			response.data.nodeBySlugId.guilds.edges.map((guild) => ({
				type: TYPE,
				identifier: guild.node.slugId,
			})),
		);
	}
}

type GuildHostResponse = {
	data: {
		nodeBySlugId: {
			__typename: "Guild";
			name: string;
			slugId: string;
			description: string;
			networks: { edges: []; pageInfo: { endCursor: null; hasNextPage: boolean } };
			id: string;
			guilds: {
				edges: Array<{
					node: GuildHostGuildNodeResponse;
					cursor: string;
				}>;
				pageInfo: { endCursor: string; hasNextPage: boolean };
			};
			__isNode: "Guild";
		};
	};
};

type GuildHostGuildNodeResponse = {
	__typename: "Guild";
	id: string;
	slugId: string;
	type: "NETWORK" | "GUILD";
	myMembership: unknown;
	minimumDonationAmount?: number;
	donationCurrency?: "EUR";
	rowId: string;
	name: string;
	description: string;
	networkMembers: {
		totalCount: number;
	};
	primaryPhoto: {
		rowId: string;
		contentType: "PNG" | "WEBP" | "JPEG";
		id: string;
	} | null;
	backgroundPhoto: {
		rowId: string;
		contentType: "PNG" | "WEBP" | "JPEG";
		id: string;
	} | null;
	totalNetworks?: {
		edges: Array<unknown>;
	};
	totalGuilds?: {
		edges: Array<{
			cursor: string;
		}>;
	};
	totalEvents?: {
		edges: Array<{
			cursor: string;
		}>;
	};
	totalPresentations?: {
		edges: Array<{
			cursor: string;
		}>;
	};
	__isNode?: "Guild";
};

type GuildHostOneResponse = {
	data: {
		nodeBySlugId: GuildHostGuildNodeResponse;
	};
};
