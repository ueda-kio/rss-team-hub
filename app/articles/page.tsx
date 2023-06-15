import { apiRoot } from '@/lib/apiRoot';
import { getServerSession } from '@/lib/getSession';
import { isArticleArray } from '@/lib/typeGuard';

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

export default async function Articles() {
	const session = await getServerSession();
	const articles = await getAllArticles();
	if (!articles) {
		return <>記事の取得に失敗しました</>;
	}

	return (
		<>
			<h1>記事一覧画面</h1>
			<ul>
				{articles.length ? (
					articles.map((article) => (
						<li key={article.id}>
							<a href={article.url} target="_blank" rel="noopener noreferrer">
								{article.title}
							</a>
						</li>
					))
				) : (
					<>記事はありません</>
				)}
			</ul>
		</>
	);
}
