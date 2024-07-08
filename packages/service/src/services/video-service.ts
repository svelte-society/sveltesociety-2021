import { Memorize, longTermCache, shortTermCache } from "../cache.js";
import { ComposedService, type ContentData, type ServiceInterface, type ServiceMetadata } from "./abstract.js";

export const TYPE = "video" as const;
export const YOUTUBE_TYPE = "youtube" as const;
export const VIMEO_TYPE = "vimeo" as const;

export class VideoService extends ComposedService<{ embed: string }> {
	constructor() {
		super([new YoutubeStrategy(), new VimeoStrategy()]);
	}
}

class YoutubeStrategy implements ServiceInterface<{ embed: string }> {
	@Memorize(shortTermCache)
	async canHandle(metadata: Partial<ServiceMetadata>): Promise<boolean> {
		if (metadata.type === YOUTUBE_TYPE) {
			return true;
		}
		if (metadata.type !== TYPE) {
			return false;
		}
		try {
			const response = await fetch(`https://www.youtube.com/oembed?url=/watch?v=${metadata.identifier}`);
			return response.ok;
		} catch {
			return false;
		}
	}
	@Memorize(longTermCache)
	getInformation(metadata: ServiceMetadata): Promise<ContentData & { embed: string }> {
		return fetch("https://www.youtube.com/youtubei/v1/player?prettyPrint=false", {
			body: JSON.stringify({
				context: { client: { clientName: "WEB", clientVersion: "2.20240628.01.00" } },
				videoId: metadata.identifier,
			}),
			method: "POST",
			headers: {
				"content-type": "application/json",
			},
		})
			.then((response) => response.json() as Promise<YoutubeInformationResponse>)
			.then((response) => ({
				type: TYPE,
				author: response.videoDetails.author,
				connected: false,
				description: response.videoDetails.shortDescription,
				embed: `https://www.youtube.com/embed/${metadata.identifier}?controls=0&modestbranding=1&color=white&showinfo=0`,
				keywords: response.videoDetails.keywords,
				lastUpdate: response.microformat.playerMicroformatRenderer.publishDate,
				name: response.videoDetails.title,
				url: `https://www.youtube.com/watch?v=${response.videoDetails.videoId}`
			}));
	}
}

class VimeoStrategy implements ServiceInterface<{ embed: string }> {
	@Memorize(longTermCache)
	private doRequest(videoId: string): Promise<VimeoOEmbedResponse> {
		return fetch(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`).then((response) =>
			response.json(),
		);
	}

	@Memorize(shortTermCache)
	async canHandle(metadata: ServiceMetadata): Promise<boolean> {
		if (metadata.type === VIMEO_TYPE) {
			return true;
		}
		if (metadata.type !== TYPE) {
			return false;
		}
		try {
			await this.doRequest(metadata.identifier);
			return true;
		} catch {
			return false;
		}
	}

	getInformation(metadata: ServiceMetadata): Promise<ContentData & { embed: string }> {
		return this.doRequest(metadata.identifier).then((response) => ({
			type: TYPE,
			author: response.author_name,
			description: response.description,
			embed: `https://player.vimeo.com/video/${metadata.identifier}`,
			keywords: [],
			lastUpdate: response.upload_date,
			name: response.title,
			url: `https://vimeo.com/${metadata.identifier}`
		}));
	}
}

interface YoutubeInformationResponse {
	responseContext: {
		visitorData: string;
		serviceTrackingParams: Array<{
			service: string;
			params: Array<{ key: string; value: string }>;
		}>;
		maxAgeSeconds: number;
		mainAppWebResponseContext: {
			loggedOut: boolean;
			trackingParam: string;
		};
		webResponseContextExtensionData: {
			hasDecorated: boolean;
		};
	};
	playabilityStatus: {
		status: string;
		playableInEmbed: boolean;
		miniplayer: {
			miniplayerRenderer: {
				playbackMode: string;
			};
		};
		contextParams: string;
	};
	streamingData: {
		expiresInSeconds: string;
		formats: [
			{
				itag: number;
				url: string;
				mimeType: string;
				bitrate: number;
				width: number;
				height: number;
				lastModified: string;
				contentLength: string;
				quality: string;
				fps: number;
				qualityLabel: string;
				projectionType: string;
				averageBitrate: number;
				audioQuality: string;
				approxDurationMs: string;
				audioSampleRate: string;
				audioChannels: number;
			},
		];
		adaptiveFormats: Array<{
			itag: number;
			url: string;
			mimeType: string;
			bitrate: number;
			width: number;
			height: number;
			initRange: {
				start: string;
				end: string;
			};
			indexRange: {
				start: string;
				end: string;
			};
			lastModified: string;
			contentLength: string;
			quality: "small" | "tiny";
			fps: number;
			qualityLabel: "240p" | "144p";
			projectionType: "RECTANGULAR";
			averageBitrate: number;
			approxDurationMs: string;
			colorInfo?: {
				transferCharacteristics: string;
			};
			audioSampleRate?: string;
			audioChannels?: number;
			loudnessDb?: number;
			isDrc?: boolean;
			xtags?: string;
			highReplication?: boolean;
			audioQuality?: string;
		}>;
		serverAbrStreamingUrl: string;
	};
	playbackTracking: {
		videostatsPlaybackUrl: {
			baseUrl: string;
		};
		videostatsDelayplayUrl: {
			baseUrl: string;
		};
		videostatsWatchtimeUrl: {
			baseUrl: string;
		};
		ptrackingUrl: {
			baseUrl: string;
		};
		qoeUrl: {
			baseUrl: string;
		};
		atrUrl: {
			baseUrl: string;
			elapsedMediaTimeSeconds: number;
		};
		videostatsScheduledFlushWalltimeSeconds: Array<number>;
		videostatsDefaultFlushIntervalSeconds: number;
	};
	captions: {
		playerCaptionsTracklistRenderer: {
			captionTracks: Array<{
				baseUrl: string;
				name: {
					simpleText: string;
				};
				vssId: string;
				languageCode: string;
				rtl: boolean;
				isTranslatable: boolean;
				trackName: string;
			}>;
			audioTracks: [
				{
					captionTrackIndices: Array<number>;
					defaultCaptionTrackIndex: number;
					visibility: string;
					hasDefaultTrack: boolean;
					captionsInitialState: string;
				},
			];
			translationLanguages: Array<{
				languageCode: string;
				languageName: {
					simpleText: string;
				};
			}>;
			defaultAudioTrackIndex: number;
		};
	};
	videoDetails: {
		videoId: string;
		title: string;
		lengthSeconds: string;
		keywords: Array<string>;
		channelId: string;
		isOwnerViewing: boolean;
		shortDescription: string;
		isCrawlable: boolean;
		thumbnail: {
			thumbnails: Array<{
				url: string;
				width: number;
				height: number;
			}>;
		};
		allowRatings: boolean;
		viewCount: string;
		author: string;
		isPrivate: boolean;
		isUnpluggedCorpus: boolean;
		isLiveContent: boolean;
	};
	playerConfig: {
		audioConfig: {
			loudnessDb: number;
			perceptualLoudnessDb: number;
			enablePerFormatLoudness: boolean;
		};
		streamSelectionConfig: {
			maxBitrate: string;
		};
		mediaCommonConfig: {
			dynamicReadaheadConfig: {
				maxReadAheadMediaTimeMs: number;
				minReadAheadMediaTimeMs: number;
				readAheadGrowthRateMs: number;
			};
			mediaUstreamerRequestConfig: {
				videoPlaybackUstreamerConfig: string;
			};
			serverPlaybackStartConfig: {
				enable: boolean;
				playbackStartPolicy: {
					startMinReadaheadPolicy: [
						{
							minReadaheadMs: number;
						},
					];
				};
			};
		};
		webPlayerConfig: {
			useCobaltTvosDash: boolean;
			webPlayerActionsPorting: {
				[name: string]: {
					clickTrackingParams: string;
					commandMetadata: {
						webCommandMetadata: {
							sendPost: boolean;
							apiUrl: string;
						};
					};
					webPlayerShareEntityServiceEndpoint: {
						serializedShareEntity: string;
					};
					[param: string]: object | string;
				};
			};
		};
	};
	storyboards: {
		playerStoryboardSpecRenderer: {
			spec: string;
			recommendedLevel: number;
			highResolutionRecommendedLevel: number;
		};
	};
	microformat: {
		playerMicroformatRenderer: {
			thumbnail: {
				thumbnails: [
					{
						url: string;
						width: number;
						height: number;
					},
				];
			};
			embed: {
				iframeUrl: string;
				width: number;
				height: number;
			};
			title: {
				simpleText: string;
			};
			description: {
				simpleText: string;
			};
			lengthSeconds: string;
			ownerProfileUrl: string;
			externalChannelId: string;
			isFamilySafe: boolean;
			availableCountries: Array<string>;
			isUnlisted: boolean;
			hasYpcMetadata: boolean;
			viewCount: string;
			category: string;
			publishDate: string;
			ownerChannelName: string;
			uploadDate: string;
			isShortsEligible: boolean;
		};
	};
	trackingParams: string;
	attestation: {
		playerAttestationRenderer: {
			challenge: string;
			botguardData: {
				program: string;
				interpreterSafeUrl: {
					privateDoNotAccessOrElseTrustedResourceUrlWrappedValue: string;
				};
				serverEnvironment: number;
			};
		};
	};
	adBreakHeartbeatParams: string;
	frameworkUpdates: {
		entityBatchUpdate: {
			mutations: [
				{
					entityKey: string;
					type: string;
					payload: {
						offlineabilityEntity: {
							key: string;
							addToOfflineButtonState: string;
						};
					};
				},
			];
			timestamp: {
				seconds: string;
				nanos: number;
			};
		};
	};
}
interface VimeoOEmbedResponse {
	type: "video";
	version: "1.0";
	provider_name: "Vimeo";
	provider_url: "https://vimeo.com/";
	title: string;
	author_name: string;
	author_url: string;
	is_plus: string;
	account_type: string;
	html: string;
	width: number;
	height: number;
	duration: number;
	description: string;
	thumbnail_url: string;
	thumbnail_width: number;
	thumbnail_height: number;
	thumbnail_url_with_play_button: string;
	upload_date: string;
	video_id: number;
	uri: string;
}
