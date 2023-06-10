import { Article } from '@/@types';

export const isArticle = (obj: any): obj is Article => {
	const { _id, title, url, likes_count, publish, creatorId, site } = obj;
	const isSiteType = (str: string): str is 'qiita' | 'zenn' => (['qiita', 'zenn'] as const).some((el) => el === str);

	return (
		typeof _id === 'string' &&
		typeof title === 'string' &&
		typeof url === 'string' &&
		typeof likes_count === 'number' &&
		typeof publish === 'boolean' &&
		typeof creatorId === 'string' &&
		typeof site === 'string' &&
		isSiteType(site)
	);
};

export const isArticleArray = (arr: any[]): arr is Article[] => arr.every((el) => isArticle(el));
