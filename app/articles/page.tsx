import Card from '@/components/Card/Card';
import { apiRoot } from '@/lib/apiRoot';
import { isArticleArray } from '@/lib/typeGuard';

const getArticles = async () => {
	try {
		const res = await fetch(`${apiRoot}/api/article`);
		if (!res.ok) throw Error();

		const json = await res.json();
		const articles = json.data;
		if (!isArticleArray(articles)) throw new Error('型がおかしいZOY');

		return articles;
	} catch (e) {
		console.error(e);
	}
};

export default async function ArticleListServer() {
	const articles = await getArticles();
	const filteredArticles = articles?.filter((item) => item.publish);

	return (
		<>
			<h2>投稿記事ページ</h2>
			<ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '0', listStyle: 'none' }}>
				{!filteredArticles ? (
					<div>記事の取得に失敗しました</div>
				) : filteredArticles.length ? (
					// 上限数のみ表示
					filteredArticles.map((article) => (
						<li key={article._id} style={{ display: 'flex', flex: 'auto', flexFlow: 'column' }}>
							{/* @ts-expect-error Server Component */}
							<Card props={article} />
						</li>
					))
				) : (
					<>記事がありません。</>
				)}
			</ul>
		</>
	);
}
