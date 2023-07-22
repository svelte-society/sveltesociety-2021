export const getPages = async (
	metaGlob: Record<
		string,
		() => Promise<{ metadata: { title: string; layout: string; date: string } }>
	>
) => {
	const pages = await Promise.all(
		Object.entries(metaGlob).map(async ([fullPath, page]) => {
			const { metadata } = (await page()) as {
				metadata: { title: string; layout: string; date: string };
			};
			const path = fullPath.replace('/+page.svx', '');
			const filename = path.split('/').pop();
			return { ...metadata, filename, path };
		})
	);
	return pages;
};
