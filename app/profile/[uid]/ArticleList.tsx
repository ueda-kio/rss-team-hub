'use client';

import useArticleSWR from '@/hooks/useArticleSWR';

export default function ArticleList({ uid, site }: { uid: string; site: 'qiita' | 'zenn' }) {
	const { articles, error, isLoading } = useArticleSWR(uid);
	const filteredArticles = articles?.filter((item) => item.site === site);

	return (
		<>
			<ul>
				{isLoading ? (
					<div>loading...</div>
				) : !filteredArticles || error ? (
					<div>記事の取得に失敗しました。</div>
				) : filteredArticles.length ? (
					// 上限数のみ表示
					filteredArticles.map((article) => (
						<li key={article._id}>
							<a href={article.url} target="_blank" rel="noopener noreferrer">
								{article.title}
							</a>
						</li>
					))
				) : (
					<>記事がありません。</>
				)}
			</ul>
		</>
	);
}
