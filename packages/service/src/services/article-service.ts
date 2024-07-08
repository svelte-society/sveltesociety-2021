import { Memorize, longTermCache } from "../cache.js";
import { ComposedService, type ContentData, type ServiceInterface, type ServiceMetadata } from "./abstract.js";

export const TYPE = "article";
export const RECIPE_TYPE = "recipe";

export class ArticleService extends ComposedService<{ preview: string }> {
	constructor() {
		super([new RecipeService()]);
	}
}

export class RecipeService implements ServiceInterface<{ preview: string }> {
	canHandle(metadata: ServiceMetadata): Promise<boolean> {
		return Promise.resolve([RECIPE_TYPE, TYPE].includes(metadata.type));
	}
	@Memorize(longTermCache)
	getInformation(metadata: ServiceMetadata): Promise<(ContentData & { preview: string }) | never> {
		return Promise.resolve({
			type: RECIPE_TYPE,
			name: "Reactivity",
			author: "John Doe",
			url: '/post/reactivity',
			description:
				"The reactivity system introduced in Svelte 3 has made it easier than ever to trigger updates to the DOM. Despite this, there are a few simple rules that you must always follow. This guide explains how Svelte’s reactivity system works, what you can and cannot do, as well a few pitfalls to avoid.",
			keywords: ["reactivity", "dom"],
			lastUpdate: "Monday, June 14, 2021",
			preview:
				"### Top-level variables\n" +
				"The simplest way to make your Svelte components reactive is by using an assignment operator. Any time Svelte sees an assignment to a top-level variable an update is scheduled. A 'top-level variable' is any variable that is defined inside the script element but is not a child of anything, meaning, it is not inside a function or a block. Incidentally, these are also the only variables that you can reference in the DOM. Let's look at some examples.\n" +
				"\n" +
				"The following works as expected and update the dom:\n" +
				"```html\n" +
				"<script>\n" +
				"\tlet num = 0;\n" +
				"\n" +
				"\tfunction updateNum() {\n" +
				"\t\tnum = 25;\n" +
				"\t}\n" +
				"</script>\n" +
				"\n" +
				"<button on:click={updateNum}>Update</button>\n" +
				"\n" +
				"<p>{num}</p>\n```\n" +
				"Svelte can see that there is an assignment to a top-level variable and knows to re-render after the num variable is modified.",
		});
	}
}
