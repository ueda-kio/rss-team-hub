import { getServerSession } from 'next-auth';
import React from 'react';

const getSession = async () => {
	const session = await getServerSession();
	return session;
};

export default async function ServerSide() {
	const session = await getSession();

	return (
		<div>
			<p>serverSide</p>
			<div>{session?.user?.email}</div>
		</div>
	);
}
