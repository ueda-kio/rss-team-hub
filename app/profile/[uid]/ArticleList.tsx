'use client';

import Link from 'next/link';
import useArticleSWR from '@/hooks/useArticleSWR';

export default function ArticleList({ uid, site }: { uid: string; site: 'qiita' | 'zenn' }) {
	const { articles, error, isLoading } = useArticleSWR(uid);
	const filteredArticles = articles?.filter((item) => item.site === site);
	const MAX_LEN = 5;

	return (
		<>
			<h2>投稿記事</h2>
			<ul>
				{isLoading ? (
					<div>loading...</div>
				) : !filteredArticles || error ? (
					<div>記事の取得に失敗しました。</div>
				) : filteredArticles.length ? (
					// 上限数のみ表示
					(filteredArticles.length > MAX_LEN ? filteredArticles.slice(0, MAX_LEN) : filteredArticles).map((article) => (
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
			<Link href="/articles">記事一覧へ→</Link>
		</>
	);
}
