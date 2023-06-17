'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import { User } from '@prisma/client';

export default async function Members() {
	const { data: users, error, isLoading } = useSWR('/api/user', fetcher<User[]>);

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
						<li key={user.id}>
							<Link href={`/profile/${user.id}`}>{user.name}</Link>
						</li>
					))
				) : (
					<>メンバーがいません。</>
				)}
			</ul>
		</>
	);
}
