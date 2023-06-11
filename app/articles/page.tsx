import { getServerSession } from '@/lib/getSession';
import { isArticleArray } from '@/lib/typeGuard';

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

export default async function Articles() {
	const session = await getServerSession();
	const articles = await getAllArticles();
	return (
		<>
			<h1>記事一覧画面</h1>
			<ul>{articles ? articles.map((article) => <li key={article._id}>{article.title}</li>) : <>記事はありません</>}</ul>
		</>
	);
}
