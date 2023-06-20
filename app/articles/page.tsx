'use client';

import useArticleSWR from '@/hooks/useArticleSWR';

export default async function Articles() {
	const { articles, error, isLoading } = useArticleSWR();
	const filteredArticles = articles?.filter((item) => item.publish) ?? [];

	return (
		<>
			<h1>記事一覧画面</h1>
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
