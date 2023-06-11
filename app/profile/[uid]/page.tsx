import { getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]/route';
import { isArticleArray, isUser } from '@/lib/typeGuard';
import Form from '@/app/components/Form';

const getSession = async () => {
	const session = await getServerSession(authOptions);
	return session;
};

const getArticles = async (uid: string) => {
	try {
		const items = await fetch(`http://localhost:3000/api/article/?creatorId=${uid}`, { cache: 'no-cache' })
			.then((res) => res.json())
			.then((json) => json.data);

		// console.log(items);
		if (!isArticleArray(items)) throw new Error('記事の型に問題があります。');

		const qiitaArticles = items.filter((item) => item.site === 'qiita');
		const zennArticles = items.filter((item) => item.site === 'zenn');
		return { qiitaArticles, zennArticles };
	} catch (e) {
		console.error(e);
		return false;
	}
};

const getUserData = async (uid: string) => {
	try {
		const res = await (await fetch(`http://localhost:3000/api/user/${uid}`)).json();
		const user = res.user;
		if (isUser(user)) {
			return user;
		}
	} catch (e) {
		console.error(e);
		return false;
	}
};

export default async function ProfilePage({ params }: { params: { uid: string } }) {
	const uid = decodeURI(params.uid);
	const session = await getSession();
	const articles = await getArticles(uid);
	const user = await getUserData(uid);

	if (session === null) {
		return <>session is null</>;
	} else if (articles === false) {
		return <>記事の取得に失敗しました。</>;
	} else if (user === false) {
		return <>ユーザーの取得に失敗しました。</>;
	}
	const { qiitaArticles, zennArticles } = articles;
	const isMyPage = uid === user?._id;

	return (
		<>
			<h1>{isMyPage ? <>マイページ</> : <>ここは${user?.username}のページです。</>}</h1>
			<h2>設定変更</h2>
			<Form />
			<h2>記事一覧</h2>
			<h3>qiita</h3>
			<ul>
				{qiitaArticles.map((article) => (
					<li key={article._id}>{article.title}</li>
				))}
			</ul>
			<h3>zenn</h3>
			<ul>
				{zennArticles.map((article) => (
					<li key={article._id}>{article.title}</li>
				))}
			</ul>
		</>
	);
}
