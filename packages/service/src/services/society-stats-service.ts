import { Memorize, shortTermCache } from "../cache.js";
import type { ServiceMetadata } from "./abstract.js";

export class SocietyStatsService {
	@Memorize(shortTermCache)
	getInformation(metadata: ServiceMetadata): Promise<{ views: number; likes: number }> {
		return Promise.resolve({
			views: 1234,
			likes: 4567,
		});
	}
}

export class ConnectedService {
	constructor(private userId: string | undefined) {}

	getInformation(metadata: ServiceMetadata): Promise<{ connected: boolean; liked: boolean; saved: boolean }> {
		if (this.userId === undefined) {
			return Promise.resolve({
				connected: false,
				saved: false,
				liked: false,
			});
		}
		// TODO: Read user data from the database
		return Promise.resolve({
			connected: true,
			saved: false,
			liked: true,
		});
	}
}
