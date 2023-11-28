'use client';

import getUserData from '@/hooks/getUserData';
import Link from 'next/link';

export default async function MemberList() {
	console.log('/MemberList component');
	const users = await getUserData(undefined);
	const MAX_LEN = 5;

	return (
		<>
			<h2>メンバー</h2>
			<ul>
				{!users ? (
					<div>メンバーの取得に失敗しました。</div>
				) : users.length ? (
					// 上限数のみ表示
					(users.length > MAX_LEN ? users.slice(0, MAX_LEN) : users).map((user) => (
						<li key={user._id}>
							<Link href={`/profile/${user._id}`}>{user.username}</Link>
						</li>
					))
				) : (
					<>メンバーがいません。</>
				)}
			</ul>
			<Link href="/members">メンバー一覧へ→</Link>
		</>
	);
}
