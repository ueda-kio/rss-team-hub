import { apiRoot } from '@/lib/apiRoot';
import { getServerSession } from '@/lib/getSession';
import { isUserArray } from '@/lib/typeGuard';
import Link from 'next/link';

const getAllArticles = async () => {
	try {
		const res = await (await fetch(`${apiRoot}/api/user`)).json();
		if (!res.ok) throw new Error();

		const users = res.data;
		if (isUserArray(users)) {
			return users;
		}
	} catch (e) {
		console.error(e);
	}
};

export default async function Members() {
	const session = await getServerSession();
	const users = await getAllArticles();
	if (!users) {
		return <>ユーザーの取得に失敗しました</>;
	}

	return (
		<>
			<h1>メンバー一覧画面</h1>
			<ul>
				{users.length ? (
					users.map((user) => (
						<li key={user._id}>
							<Link href={`profile/${user._id}`}>{user.username}</Link>
						</li>
					))
				) : (
					<>メンバーはいません</>
				)}
			</ul>
		</>
	);
}
