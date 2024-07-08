export type ServiceMetadata = {
	type: string;
	identifier: string;
};

export type ContentData = {
	type: string;
	name: string;
	author: string;
	lastUpdate?: string;
	keywords: Array<string>;
	description: string;
	url: string
};

export interface ServiceInterface<ServiceData extends object> {
	canHandle(metadata: ServiceMetadata): Promise<boolean>;
	getInformation(metadata: ServiceMetadata): Promise<(ContentData & ServiceData) | never>;
}

export class ComposedService<Additional extends object> implements ServiceInterface<Additional> {
	constructor(
		private services: Array<ServiceInterface<Additional>>,
		private throwIfError = true,
	) {}

	canHandle(metadata: ServiceMetadata): Promise<boolean> {
		return Promise.all(this.services.map((service) => service.canHandle(metadata))).then((results) =>
			results.some(Boolean),
		);
	}
	async getInformation(metadata: ServiceMetadata): Promise<(ContentData & Additional) | never> {
		for (const service of this.services) {
			if (await service.canHandle(metadata)) {
				return service.getInformation(metadata);
			}
		}
		if (this.throwIfError) {
			throw new Error("Incompatible data service");
		}
		return {} as ContentData & Additional;
	}
}
