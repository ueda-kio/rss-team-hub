import { getServerSession } from '@/lib/getSession';
import { isArticleArray } from '@/lib/typeGuard';
import Link from 'next/link';

const getAllArticles = async () => {
	try {
		const res = await (await fetch('http://localhost:3000/api/article')).json();
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
				{articles &&
					articles.slice(MAX_LEN).map((article) => (
						<li key={article._id}>
							<a href={article.url} target="_blank" rel="noopener noreferrer">
								{article.title}
							</a>
						</li>
					))}
			</ul>
			<Link href="/articles">記事一覧へ→</Link>
		</>
	);
}
