import { getServerSession } from '@/lib/getSession';
import { isUserArray } from '@/lib/typeGuard';
import Link from 'next/link';

const getAllArticles = async () => {
	try {
		const res = await (await fetch('http://localhost:3000/api/user')).json();
		if (!res.ok) throw new Error();

		const users = res.data;
		if (isUserArray(users)) {
			return users;
		}
	} catch (e) {
		console.error(e);
	}
};

export default async function MemberList() {
	const users = await getAllArticles();
	const MAX_LEN = 5;
	return (
		<>
			<h2>メンバー</h2>
			<ul>
				{users ? (
					(users.length > MAX_LEN ? users.slice(MAX_LEN) : users).map((user) => (
						<li key={user._id}>
							<Link href={`/profile/${user._id}`}>{user.username}</Link>
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
