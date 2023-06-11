'use client';

import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function Form() {
	const { data: session } = useSession();
	const [qiita, setQiita] = useState('');
	const [zenn, setZenn] = useState('');
	const sessionQiita = session?.user.qiita ?? '';
	const sessionZenn = session?.user.zenn ?? '';

	useEffect(() => {
		setQiita(sessionQiita);
		setZenn(sessionZenn);
	}, [sessionQiita, sessionZenn]);

	const handleChangeUserName = async (e: React.FormEvent<HTMLFormElement>, site: 'qiita' | 'zenn') => {
		e.preventDefault();
		try {
			const uid = session?.user.id;
			if (typeof session === null || typeof uid === 'undefined') throw new Error();

			await fetch('/api/article', {
				method: 'POST',
				body: JSON.stringify({
					uid,
					username: site === 'qiita' ? qiita : zenn,
					site,
				}),
			}).catch((e) => e);

			await fetch(`/api/user/${uid}`, {
				method: 'PATCH',
				body: JSON.stringify(site === 'qiita' ? { qiita } : { zenn }),
			}).then(() => {
				if (session && session.user) {
					site === 'qiita' ? (session.user.qiita = qiita) : (session.user.zenn = zenn);
				}
			});
		} catch (e) {
			console.error(e);
			return;
		}
	};

	const onClick = async () => {
		// const item = await fetch(`/api/article/${session?.user.id}?test=hoge`);
		const item = await fetch(`/api/article/?creatorId=${session?.user.id}&site=qiita`);
		const j = await item.json();
		console.log(j);
	};

	return (
		<>
			<form onSubmit={(e) => handleChangeUserName(e, 'qiita')}>
				<p>
					<span>qiita: </span>
					<input type="text" value={qiita} onChange={(e) => setQiita(e.target.value)} />
					<button>登録</button>
				</p>
			</form>
			<form onSubmit={(e) => handleChangeUserName(e, 'zenn')}>
				<p>
					<span>zenn: </span>
					<input type="text" value={zenn} onChange={(e) => setZenn(e.target.value)} />
					<button>登録</button>
				</p>
			</form>
			<button onClick={() => signOut()}>Sign out</button>
			<button type="button" onClick={onClick}>
				button
			</button>
		</>
	);
}
