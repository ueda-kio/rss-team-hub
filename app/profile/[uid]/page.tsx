import { Session, getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]/route';
import MyPage from '@/app/profile/[uid]/MyPage';
import Profile from '@/app/profile/[uid]/Profile';
import { isArticleArray } from '@/lib/typeGuard';

const getSession = async () => {
	const session = await getServerSession(authOptions);
	return session;
};

const getArticles = async (session: Session) => {
	try {
		const items = await fetch(`http://localhost:3000/api/item/?creatorId=${session.user.id}`, { cache: 'no-cache' })
			.then((res) => res.json())
			.then((json) => json.data);

		console.log(items);
		if (!isArticleArray(items)) throw new Error('記事の型に問題があります。');

		const qiitaArticles = items.filter((item) => item.site === 'qiita');
		const zennArticles = items.filter((item) => item.site === 'zenn');
		return { qiitaArticles, zennArticles };
	} catch (e) {
		console.error(e);
		return false;
	}
};

export default async function ProfilePage({ params }: { params: { uid: string } }) {
	const uid = decodeURI(params.uid);
	const session = await getSession();
	if (session === null) {
		return <>session is null</>;
	}

	const articles = await getArticles(session);
	if (articles === false) {
		return <>記事の取得に失敗しました。</>;
	}
	const { qiitaArticles, zennArticles } = articles;

	if (session.user.name === uid) {
		return (
			<>
				<h2>qiita</h2>
				<ul>
					{qiitaArticles.map((article) => (
						<li key={article._id}>{article.title}</li>
					))}
				</ul>

				<h2>zenn</h2>
				<ul>
					{zennArticles.map((article) => (
						<li key={article._id}>{article.title}</li>
					))}
				</ul>
				<MyPage uid={uid} />
			</>
		);
	} else {
		return (
			<>
				<h2>qiita</h2>
				<ul>
					{qiitaArticles.map((article) => (
						<li key={article._id}>{article.title}</li>
					))}
				</ul>
				<h2>zenn</h2>
				<ul>
					{zennArticles.map((article) => (
						<li key={article._id}>{article.title}</li>
					))}
				</ul>
				<Profile uid={uid} />
			</>
		);
	}
}
