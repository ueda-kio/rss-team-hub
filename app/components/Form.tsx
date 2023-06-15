'use client';

import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function Form() {
	const { data: session } = useSession();
	const [qiita, setQiita] = useState('');
	const [zenn, setZenn] = useState('');
	const [username, setUsername] = useState('');
	const sessionQiita = session?.user.qiita ?? '';
	const sessionZenn = session?.user.zenn ?? '';
	const sessionUsername = session?.user.name ?? '';

	console.log(session?.user);

	useEffect(() => {
		setQiita(sessionQiita);
		setZenn(sessionZenn);
		setUsername(sessionUsername);
	}, [sessionQiita, sessionZenn, sessionUsername]);

	const handleChangeUserName: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		try {
			const uid = session?.user.id;
			await fetch(`/api/user/${uid}`, {
				method: 'PATCH',
				body: JSON.stringify({ username }),
			}).then(() => {
				if (session && session.user) {
					session.user.name = username;
					console.log('username is changed.');
				}
			});
		} catch (e) {
			console.error(e);
			return;
		}
	};

	const handleChangeRssUserName = async (e: React.FormEvent<HTMLFormElement>, site: 'qiita' | 'zenn') => {
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
			<form onSubmit={handleChangeUserName}>
				<p>
					<span>username: </span>
					<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
					<button>登録</button>
				</p>
			</form>
			<form onSubmit={(e) => handleChangeRssUserName(e, 'qiita')}>
				<p>
					<span>qiita: </span>
					<input type="text" value={qiita} onChange={(e) => setQiita(e.target.value)} />
					<button>登録</button>
				</p>
			</form>
			<form onSubmit={(e) => handleChangeRssUserName(e, 'zenn')}>
				<p>
					<span>zenn: </span>
					<input type="text" value={zenn} onChange={(e) => setZenn(e.target.value)} />
					<button>登録</button>
				</p>
			</form>
			<button onClick={() => signOut({ callbackUrl: '/' })}>Sign out</button>
			<button type="button" onClick={onClick}>
				button
			</button>
		</>
	);
}
