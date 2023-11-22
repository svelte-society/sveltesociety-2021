import { error } from '@sveltejs/kit';
import { getPages } from '../pageList';

export async function load() {
	const events = await getPages(import.meta.glob('./**/*.svx'));

	if (events) {
		events.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

		return {
			events
		};
	}
	throw error(500);
}
