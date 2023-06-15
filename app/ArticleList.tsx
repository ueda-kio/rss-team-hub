import { apiRoot } from '@/lib/apiRoot';
import { getServerSession } from '@/lib/getSession';
import { isArticleArray } from '@/lib/typeGuard';
import Link from 'next/link';

const getAllArticles = async () => {
	try {
		const res = await (await fetch(`${apiRoot}/api/article`)).json();
		if (!res.ok) throw new Error();

		const articles = res.data;
		if (isArticleArray(articles)) {
			return articles;
		}
	} catch (e) {
		console.error(e);
	}
};

export default async function ArticleList() {
	const articles = await getAllArticles();
	const MAX_LEN = 5;

	return (
		<>
			<h2>投稿記事</h2>
			<ul>
				{articles && articles.length ? (
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
