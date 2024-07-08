import { ComposedService, type ContentData, type ServiceMetadata } from "./services/abstract.js";
import { ArticleService } from "./services/article-service.js";
import { GuildService } from "./services/guild-service.js";
import { PackageService } from "./services/package-service.js";
import { type ConnectedService, SocietyStatsService } from "./services/society-stats-service.js";
import { VideoService } from "./services/video-service.js";
import {GuildEventService} from "./services/guild-event-service.js";

// biome-ignore lint/suspicious/noExplicitAny:
export class CollectorService extends ComposedService<any> {
	private readonly stats = new SocietyStatsService();
	constructor(private userService: ConnectedService) {
		super([new VideoService(), new PackageService(), new ArticleService(), new GuildService(), new GuildEventService()]);
	}

	async getInformation(metadata: ServiceMetadata): Promise<ContentData & StatsData & Record<string, unknown>> {
		const stats = this.stats.getInformation(metadata);
		const connected = this.userService.getInformation(metadata);
		const base = super.getInformation(metadata);
		return Promise.all([stats, connected, base]).then(([stats, connected, base]) => ({
			...base,
			...stats,
			...connected,
		}));
	}

	async getAllInformation(
		metadata: Array<ServiceMetadata>,
	): Promise<Array<ContentData & StatsData & Record<string, unknown>>> {
		return Promise.all(metadata.map((item) => this.getInformation(item)));
	}
}

export type StatsData = {
	likes: number;
	liked: boolean;
	saved: boolean;
	connected: boolean;
};
