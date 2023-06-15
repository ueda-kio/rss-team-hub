import { apiRoot } from '@/lib/apiRoot';
import { getServerSession } from '@/lib/getSession';
import { isUserArray } from '@/lib/typeGuard';
import Link from 'next/link';

const getAllUsers = async () => {
	try {
		const res = await (await fetch(`${apiRoot}/api/user`)).json();
		if (!res.ok) throw new Error();

		const users = res.data;
		if (!isUserArray(users)) {
			console.log(users);
			throw new Error('userの型にエラーがあります。');
		}

		return users;
	} catch (e) {
		console.error(e);
	}
};

export default async function MemberList() {
	const users = await getAllUsers();
	const MAX_LEN = 5;

	return (
		<>
			<h2>メンバー</h2>
			<ul>
				{users && users.length ? (
					// 上限数のみ表示
					(users.length > MAX_LEN ? users.slice(0, MAX_LEN) : users).map((user) => (
						<li key={user.id}>
							<Link href={`/profile/${user.id}`}>{user.name}</Link>
						</li>
					))
				) : (
					<>メンバーいません</>
				)}
			</ul>
			<Link href="/members">メンバー一覧へ→</Link>
		</>
	);
}
