'use client';

import getUserData from '@/hooks/getUserData';
import Link from 'next/link';

export default async function Members() {
	console.log('members/ Members Component');
	const users = await getUserData(undefined);

	return (
		<>
			<h1>メンバー一覧画面</h1>
			<ul>
				{!users ? (
					<div>メンバーの取得に失敗しました。</div>
				) : users.length ? (
					// 上限数のみ表示
					users.map((user) => (
						<li key={user._id}>
							<Link href={`/profile/${user._id}`}>{user.username}</Link>
						</li>
					))
				) : (
					<>メンバーがいません。</>
				)}
			</ul>
		</>
	);
}
