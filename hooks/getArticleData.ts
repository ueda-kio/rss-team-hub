import { apiRoot } from '@/lib/apiRoot';
import { isArticleArray } from '@/lib/typeGuard';

export default async function getArticleData(creatorId?: string) {
	const creatorIdQuery = creatorId ? `?creatorId=${creatorId}` : '';
	const endpoint = `${apiRoot}/api/article/`;
	const url = `${endpoint}${creatorIdQuery}`;

	try {
		const json = await (await fetch(url)).json();
		const article = json.data;
		if (!isArticleArray(article)) throw Error('型エラー');

		return article;
	} catch (e) {
		console.error(e);
	}
}
