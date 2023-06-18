import { User } from '@/@types';
import { apiRoot } from '@/lib/apiRoot';
import { authOptions } from '@api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import ArticleList from './ArticleList';

const getSession = async () => {
	const session = await getServerSession(authOptions);
	return session;
};

const getUserData = async (uid: string) => {
	try {
		const res = await (await fetch(`${apiRoot}/api/user/${uid}`)).json();
		const user: User = res.user;
		return user;
	} catch (e) {
		console.error(e);
		return false;
	}
};

async function ProfileImage({ uid }: { uid: string }) {
	const user = await getUserData(uid);
	if (!user) {
		return <>ユーザーの取得に失敗しました。</>;
	}

	return <Image src={user.image ?? ''} alt={user.username ?? ''} width={200} height={200} />;
}

export default async function ProfilePage({ params }: { params: { uid: string } }) {
	const uid = decodeURI(params.uid);
	const session = await getSession();
	const isMyPage = uid === session?.user.id;

	return (
		<>
			{/* <h1>{isMyPage ? <>マイページ</> : <>ここは {user.name} のページです。</>}</h1> */}
			<div style={{ display: 'flex', gap: '40px' }}>
				<Suspense fallback={<>loading...</>}>
					{/* @ts-expect-error Server Component */}
					<ProfileImage uid={uid} />
				</Suspense>
				{isMyPage && (
					<div>
						<h2>設定変更</h2>
						<Link href={'/setting'}>設定画面へ</Link>
					</div>
				)}
			</div>
			<h2>記事一覧</h2>
			<h3>qiita</h3>
			<ArticleList uid={uid} site="qiita" />
			<h3>zenn</h3>
			<ArticleList uid={uid} site="zenn" />
		</>
	);
}
