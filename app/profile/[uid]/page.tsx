import { getServerSession } from 'next-auth';
import { authOptions } from '@api/auth/[...nextauth]/route';
import { isArticleArray, isUser } from '@/lib/typeGuard';
import Form from '@/app/components/Form';
import Image from 'next/image';
import { apiRoot } from '@/lib/apiRoot';

const getSession = async () => {
	const session = await getServerSession(authOptions);
	return session;
};

const getArticles = async (uid: string) => {
	try {
		const items = await fetch(`${apiRoot}/api/article/?creatorId=${uid}`, { cache: 'no-cache' })
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
		const res = await (await fetch(`${apiRoot}/api/user/${uid}`)).json();
		const user = res.user;
		if (!isUser(user)) {
			console.log(user);
			throw new Error('userの型にエラーがあります。');
		}
		return user;
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

	if (!articles) {
		return <>記事の取得に失敗しました。</>;
	} else if (!user) {
		return <>ユーザーの取得に失敗しました。</>;
	}
	const { qiitaArticles, zennArticles } = articles;
	const isMyPage = uid === session?.user.id;

	return (
		<>
			<h1>{isMyPage ? <>マイページ</> : <>ここは {user.name} のページです。</>}</h1>
			<div style={{ display: 'flex', gap: '40px' }}>
				<Image src={user.image ?? ''} alt={user.name ?? ''} width={200} height={200} />
				{isMyPage && (
					<div>
						<h2>設定変更</h2>
						<Form />
					</div>
				)}
			</div>
			<h2>記事一覧</h2>
			<h3>qiita</h3>
			<ul>
				{qiitaArticles.length ? qiitaArticles.map((article) => <li key={article.id}>{article.title}</li>) : <>記事はありません。</>}
			</ul>
			<h3>zenn</h3>
			<ul>
				{zennArticles.length ? zennArticles.map((article) => <li key={article.id}>{article.title}</li>) : <>記事はありません。</>}
			</ul>
		</>
	);
}
