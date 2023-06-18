'use client';

import useUserSWR from '@/hooks/useUserSWR';
import Link from 'next/link';

export default async function Members() {
	const { user: users, error, isLoading } = useUserSWR(undefined);

	return (
		<>
			<h1>メンバー一覧画面</h1>
			<ul>
				{isLoading ? (
					<div>loading...</div>
				) : !users || error ? (
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
