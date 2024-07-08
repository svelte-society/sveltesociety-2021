import { LRUCache } from "lru-cache";

export interface CacheService {
	save(ref: string, data: string): Promise<string>;
	get(ref: string): Promise<string | undefined>;
	has(ref: string): Promise<boolean>;
}

export class MemoryCache implements CacheService {
	private readonly cache = new LRUCache<string, string>({
		ttl: 3600 * 1000, // Keep in memory for 1h
		ttlAutopurge: true,
		max: 1000, // A maximum on 1000 item are keep in the cache
	});
	save(ref: string, data: string): Promise<string> {
		this.cache.set(ref, data);
		return Promise.resolve(data);
	}
	get(ref: string): Promise<string | undefined> {
		return Promise.resolve(this.cache.get(ref));
	}
	has(ref: string): Promise<boolean> {
		return Promise.resolve(this.cache.has(ref));
	}
}

export const shortTermCache: CacheService = new MemoryCache();

// TODO: Replace with DB or Redis or Memcached
export const longTermCache: CacheService = new MemoryCache();

export function Memorize(cacheService: CacheService): MethodDecorator {
	return (target, propertyKey, descriptor: PropertyDescriptor) => {
		// biome-ignore lint/complexity/noBannedTypes: We don't know the type at compilation time
		const original = descriptor.value as Function;
		// biome-ignore lint/suspicious/noExplicitAny: We don't know the type at compilation time
		descriptor.value = function (this: ThisType<any>, ...args: Array<any>) {
			const key = `${target.constructor.name}#${String(propertyKey)}#${JSON.stringify(args)}`;
			return cacheService
				.has(key)
				.then((inCache) => {
					if (inCache) {
						return cacheService.get(key);
					}
					return Promise.resolve(original.bind(this)(...args)).then((result) =>
						cacheService.save(key, JSON.stringify(result)),
					);
				})
				.then((saved) => JSON.parse(saved as string));
		};
		return descriptor;
	};
}
