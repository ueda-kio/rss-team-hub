'use client';

import Link from 'next/link';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import { fetcher } from '@/lib/fetcher';
import { User } from '@prisma/client';
import useUserSWR from '@/hooks/useUserSWR';

export default function MemberList() {
	const { user: users, error, isLoading } = useUserSWR(undefined);
	const MAX_LEN = 5;

	return (
		<>
			<h2>メンバー</h2>
			<ul>
				{isLoading ? (
					<div>loading...</div>
				) : !users || error ? (
					<div>メンバーの取得に失敗しました。</div>
				) : users.length ? (
					// 上限数のみ表示
					(users.length > MAX_LEN ? users.slice(0, MAX_LEN) : users).map((user) => (
						<li key={user.id}>
							<Link href={`/profile/${user.id}`}>{user.name}</Link>
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
