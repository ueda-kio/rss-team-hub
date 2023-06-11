import { getServerSession } from '@/lib/getSession';
import { isUserArray } from '@/lib/typeGuard';
import React from 'react';

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

export default async function Members() {
	const session = await getServerSession();
	const users = await getAllArticles();
	return (
		<>
			<h1>members list</h1>
			<ul>{users ? users.map((user) => <li key={user._id}>{user.username}</li>) : <>メンバーいません</>}</ul>
		</>
	);
}
