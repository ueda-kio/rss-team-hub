import { Article } from '@/@types';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';

/**
 * 記事一覧を取得するHooks
 * @param {string | undefined} creatorId 単体で取得したい場合は`creatorId`を渡す
 */
export default function useArticleSWR(creatorId?: string) {
	const { data, error, isLoading, mutate } = useSWRImmutable<Article[]>({ key: '/api/article/', creatorId }, ({ key, creatorId }) => {
		const creatorIdQuery = creatorId ? `?creatorId=${creatorId}` : '';
		const url = `${key}${creatorIdQuery}`;
		return fetch(url)
			.then((res) => res.json())
			.then((json) => json.data);
	});

	return {
		articles: data,
		isLoading: !error && !data && isLoading,
		error,
		mutate,
	};
}
