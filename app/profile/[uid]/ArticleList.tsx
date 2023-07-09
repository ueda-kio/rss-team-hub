'use client';

import { Article } from '@/@types';
import useArticleSWR from '@/hooks/useArticleSWR';
import { useEffect, useState } from 'react';
import useSWRMutation from 'swr/mutation';

export default function ArticleList({ uid, site }: { uid: string; site: 'qiita' | 'zenn' }) {
	const { articles, error, isLoading } = useArticleSWR(uid);
	const filteredArticles = articles?.filter((item) => item.site === site) ?? [];

	const [publishArticles, setPublishArticles] = useState<Article[]>([]);
	const [unPublishArticles, setUnPublishArticles] = useState<Article[]>([]);

	useEffect(() => {
		setPublishArticles(filteredArticles.filter((item) => item.publish));
		setUnPublishArticles(filteredArticles.filter((item) => !item.publish));
	}, [articles]);

	const { trigger, isMutating } = useSWRMutation(
		'/api/article/',
		async (url: string, { arg: { _id, isPublish } }: { arg: { _id: string; isPublish: boolean } }) => {
			console.log(_id);
			try {
				await fetch(`${url}${_id}`, {
					method: 'PATCH',
					body: JSON.stringify({ publish: isPublish }),
				});

				if (isPublish) {
					const target = unPublishArticles.find((article) => article._id === _id);
					if (!target) throw new Error('_idを持つ記事が見つかりません。');
					target.publish = isPublish;
					setUnPublishArticles((prev) => prev.filter((article) => article._id !== target._id));
					setPublishArticles((prev) => [...prev, target]);
				} else {
					const target = publishArticles.find((article) => article._id === _id);
					if (!target) throw new Error('_idを持つ記事が見つかりません。');
					target.publish = isPublish;
					setPublishArticles((prev) => prev.filter((article) => article._id !== target._id));
					setUnPublishArticles((prev) => [...prev, target]);
				}
			} catch (e) {
				console.error(e);
				return;
			}
		}
	);

	return (
		<>
			<h4>表示中の記事</h4>
			<ul>
				{isLoading ? (
					<div>loading...</div>
				) : !publishArticles || error ? (
					<div>記事の取得に失敗しました。</div>
				) : publishArticles.length ? (
					// 上限数のみ表示
					publishArticles.map((article) => (
						<li key={article._id}>
							<input type="hidden" value={article._id} />
							<button type="button" onClick={() => trigger({ _id: article._id, isPublish: false })}>
								非公開にする
							</button>
							<a href={article.url} target="_blank" rel="noopener noreferrer">
								{article.title}
							</a>
						</li>
					))
				) : (
					<>記事がありません。</>
				)}
			</ul>
			<h4>非表示中の記事</h4>
			<ul>
				{isLoading ? (
					<div>loading...</div>
				) : !unPublishArticles || error ? (
					<div>記事の取得に失敗しました。</div>
				) : unPublishArticles.length ? (
					// 上限数のみ表示
					unPublishArticles.map((article) => (
						<li key={article._id}>
							<input type="hidden" value={article._id} />
							<button type="button" onClick={() => trigger({ _id: article._id, isPublish: true })}>
								公開にする
							</button>
							<a href={article.url} target="_blank" rel="noopener noreferrer">
								{article.title}
							</a>
						</li>
					))
				) : (
					<>非公開の記事はありません。</>
				)}
			</ul>
		</>
	);
}
