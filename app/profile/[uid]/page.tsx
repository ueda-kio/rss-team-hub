import { User } from '@/@types';
import { apiRoot } from '@/lib/apiRoot';
import { getServerSession } from '@/lib/getSession';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import ArticleList from './ArticleList';

const getUserData = async (uid: string) => {
	try {
		const res = await (await fetch(`${apiRoot}/api/user/${uid}`)).json();
		const user: User = res.data;
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

async function Title({ uid }: { uid: string }) {
	const user = await getUserData(uid);
	if (!user) {
		return <>ユーザーの取得に失敗しました。</>;
	}

	return <>{user.username}</>;
}

export default async function ProfilePage({ params }: { params: { uid: string } }) {
	const uid = decodeURI(params.uid);
	const session = await getServerSession();
	const isMyPage = uid === session?.user.id;

	return (
		<>
			{/* @ts-expect-error Server Component */}
			<h1>{isMyPage ? <>マイページ</> : <Title uid={uid} />}</h1>
			<div style={{ display: 'flex', gap: '40px' }}>
				<Suspense fallback={<>loading...</>}>
					{/* @ts-expect-error Server Component */}
					<ProfileImage uid={uid} />
				</Suspense>
				<div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
					<ul>
						<li>qiita: </li>
						<li>zenn: </li>
					</ul>

					{isMyPage && (
						<div>
							<Link href={'/setting'}>設定画面へ</Link>
						</div>
					)}
				</div>
			</div>
			<h2>記事一覧</h2>
			<h3>qiita</h3>
			{/* @ts-expect-error Server Component */}
			<ArticleList uid={uid} site="qiita" />
			<h3>zenn</h3>
			{/* @ts-expect-error Server Component */}
			<ArticleList uid={uid} site="zenn" />
		</>
	);
}
