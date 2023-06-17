'use client';

import Link from 'next/link';
import useArticleSWR from '@/hooks/useArticleSWR';

export default function ArticleList() {
	const { articles, error, isLoading } = useArticleSWR();
	const MAX_LEN = 5;

	return (
		<>
			<h2>投稿記事</h2>
			<ul>
				{isLoading ? (
					<div>loading...</div>
				) : !articles || error ? (
					<div>記事の取得に失敗しました</div>
				) : articles.length ? (
					// 上限数のみ表示
					(articles.length > MAX_LEN ? articles.slice(0, MAX_LEN) : articles).map((article) => (
						<li key={article.id}>
							<a href={article.url} target="_blank" rel="noopener noreferrer">
								{article.title}
							</a>
						</li>
					))
				) : (
					<>記事がありません。</>
				)}
			</ul>
			<Link href="/articles">記事一覧へ→</Link>
		</>
	);
}
