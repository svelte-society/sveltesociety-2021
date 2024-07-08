import {Memorize, shortTermCache} from "../cache.js";
import type { ContentData, ServiceInterface, ServiceMetadata } from "./abstract.js";

export const TYPE = "guild-event" as const;

export class GuildEventService implements ServiceInterface<{ cover: string, startAt: string, venue?: [number, number] }> {
	canHandle(metadata: ServiceMetadata): Promise<boolean> {
		return Promise.resolve(metadata.type === TYPE);
	}
	async getInformation(metadata: ServiceMetadata): Promise<(ContentData & { cover: string, startAt: string, venue?: [number, number] }) | never> {
		let event = (await this.getGuildEvents('svelte-society')).events.edges.find(event => event.node.id === metadata.identifier)?.node

		if (event === undefined) {
			event = await this.getOneEvent(metadata.identifier)
		}

		if (event) {
			return {
				type: TYPE,
				cover: event.generatedSocialCardURL,
				keywords: [],
				url: `http://guild.host/events/${event.prettyUrl}`,
				author: event.owner.name,
				venue: event.hasVenue && event.venue?.address.location !== null ? event.venue?.address.location.geojson.coordinates : undefined,
				description: event.description,
				name: event.name,
				startAt: event.startAt
			}
		}

		throw new Error("Event not found");
	}

	@Memorize(shortTermCache)
	private getGuildEvents(id: string): Promise<GuildHostGuildEventsResponse> {
		return fetch(`https://guild.host/api/next/${id}/events`).then(response => response.json())
	}

	@Memorize(shortTermCache)
	private getOneEvent(id: string): Promise<GuildHostEventResponse> {
		return fetch(`https://guild.host/api/next/node/${id}`).then(response => response.json())
	}

	async getAllServiceMetadata(): Promise<Array<ServiceMetadata>> {
		return this.getGuildEvents('svelte-society').then(response => response.events.edges.map(event => ({
			type: TYPE,
			identifier: event.node.id
		})))
	}
}

type GuildHostGuildEventsResponse = {
	"__typename": "Guild", "events": {
		"edges": Array<{
			"node": GuildHostEventResponse,
			"cursor": string
		}>,
		"pageInfo": {
			"hasPreviousPage": boolean,
			"hasNextPage": boolean,
			"startCursor": string,
			"endCursor": string
		}
	}, "__isNode": "Guild", "id": string
};

type GuildHostEventResponse = {
	"__typename"?: "Event",
	"id": string,
	"slug": string,
	"prettyUrl": string,
	"name": string,
	"description": string,
	"startAt": string,
	"endAt": string,
	"timeZone": string,
	"visibility": "PUBLIC",
	"hasVenue": boolean,
	"hasExternalUrl": boolean,
	"owner": {
		"__typename": "Guild",
		"id": string,
		"name": string,
		"__isNode": "Guild"
	},
	"uploadedSocialCard": null | {
		"url": string,
		"id": string
	},
	"generatedSocialCardURL": string,
	"presentations": { "edges": [] },
	"venue": null | {
		"address": {
			"location": null | {
				"__typename": "GeometryPoint",
				"geojson": { "type": "Point", "coordinates": [number, number] }
			},
			"id": string
		},
		"id": string
	},
	"createdAt": string,
	"updatedAt": string
}
