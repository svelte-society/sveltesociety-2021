import github from '$lib/data/github.json';
import gitlab from '$lib/data/gitlab.json';
import npm from '$lib/data/npm.json';
import publint from '$lib/data/publint.json';
import type { z } from 'zod';
import type { componentsSchema } from '$lib/schemas';

export const injectGithubData = (input: z.infer<typeof componentsSchema>) => {
	const output = [];
	for (const item of input) {
		const index = Object.keys(github).find((key) => item.repository.toLowerCase().includes(key));
		const extra = github[index] ?? {};
		output.push({ ...item, ...extra });
	}
	return output;
};

export const injectGitlabData = (input: z.infer<typeof componentsSchema>) => {
	const output = [];
	for (const item of input) {
		const index = Object.keys(gitlab).find((key) => item.repository.toLowerCase().includes(key));
		const extra = gitlab[index] ?? {};
		output.push({ ...item, ...extra });
	}
	return output;
};

export const injectNpmData = (input: z.infer<typeof componentsSchema>) => {
	const output = [];
	for (const item of input) {
		const extra = npm[item.npm] ?? {};
		output.push({ ...item, ...extra });
	}
	return output;
};

export const injectPublintData = (input: z.infer<typeof componentsSchema>) => {
	const output = [];
	for (const item of input) {
		const extra = publint[item.npm] ?? false;
		output.push({ ...item, publint: extra });
	}
	return output;
};

export const injectData = (input: z.infer<typeof componentsSchema>) => {
	return injectGithubData(injectGitlabData(injectNpmData(injectPublintData(input))));
};
