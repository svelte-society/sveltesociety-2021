import { z } from 'zod';
import { packageNameRegex } from 'package-name-regex';

const PACKAGES_CATEGORIES = /** @type {const} */ ([
	'auth',
	'build-plugins',
	'data-fetching',
	'data-visualisation',
	'design-system',
	'forms-and-input',
	'icons',
	'images',
	'integrations',
	'internationalization',
	'markdown',
	'notifications',
	'official',
	'routers',
	'stores-and-state',
	'styling-and-layout',
	'sveltekit-adapters',
	'testing',
	'ui-components',
	'user-interaction'
]);

export const packagesSchema = z.array(
	z.object({
		title: z.string().max(50),
		npm: z.string().regex(packageNameRegex),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string().max(250),
		categories: z.array(z.enum(PACKAGES_CATEGORIES)).min(1).max(6)
	})
);

const TEMPLATES_CATEGORIES = /** @type {const} */ ([
	'blog',
	'code-splitting',
	'component-sets',
	'components-and-libraries',
	'database',
	'electron',
	'integrations',
	'lazy-loading',
	'markdown',
	'mdsvex',
	'mobile',
	'preprocessors',
	'seo',
	'ssr',
	'stores-and-state',
	'storybook',
	'svelte',
	'svelte-add',
	'sveltekit',
	'testing',
	'typescript',
	'webpack'
]);

export const templatesSchema = z.array(
	z.object({
		title: z.string().max(50),
		url: z.string().url().optional(),
		repository: z.string().url(),
		description: z.string().max(250),
		categories: z.array(z.enum(TEMPLATES_CATEGORIES)).min(1).max(6)
	})
);
