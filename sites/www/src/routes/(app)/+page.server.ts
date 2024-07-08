import { CollectorService } from 'sveltesociety.dev-service/src/collector.js';
import { GuildService } from 'sveltesociety.dev-service/src/services/guild-service';
import { ConnectedService } from 'sveltesociety.dev-service/src/services/society-stats-service.js';
import type { PageServerLoad } from './$types';
import { GuildEventService } from 'sveltesociety.dev-service/src/services/guild-event-service';

export const load: PageServerLoad = async () => {
	// TODO: get user info from request (cookie?)
	const userId = undefined;

	const collectorService = new CollectorService(new ConnectedService(userId));

	return {
		items: await collectorService.getAllInformation([
			{ type: 'package', identifier: '@sveltejs/kit' },
			{ type: 'video', identifier: 'xCeYmdukOKI' },
			{ type: 'video', identifier: '330781388' },
			{ type: 'recipe', identifier: 'xxx' },
			{ type: 'package', identifier: 'svelte' },
			{ type: 'package', identifier: 'svelte-atoms' },
			{ type: 'guild', identifier: 'london-javascript' },
			...(await new GuildService().getAllServiceMetadata()),
			...(await new GuildEventService().getAllServiceMetadata())
		])
	};
};
