'use client';

import Card from '@/components/Card/Card';
import useArticleSWR from '@/hooks/useArticleSWR';
import Link from 'next/link';

export default function ArticleList() {
	const { articles, error, isLoading } = useArticleSWR();
	const filteredArticles = articles?.filter((item) => item.publish) ?? [];
	const MAX_LEN = 6;

	return (
		<>
			<h2>投稿記事</h2>
			<ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '0', listStyle: 'none' }}>
				{isLoading ? (
					<div>loading...</div>
				) : !filteredArticles || error ? (
					<div>記事の取得に失敗しました</div>
				) : filteredArticles.length ? (
					// 上限数のみ表示
					(filteredArticles.length > MAX_LEN ? filteredArticles.slice(0, MAX_LEN) : filteredArticles).map((article) => (
						<li key={article._id} style={{ display: 'flex', flex: 'auto', flexFlow: 'column' }}>
							<Card props={article} />
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
