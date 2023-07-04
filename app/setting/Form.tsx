'use client';

import { Article, User } from '@/@types';
import useArticleSWR from '@/hooks/useArticleSWR';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useSWRConfig } from 'swr';
import useSWRMutation from 'swr/mutation';

export default function Form() {
	const { data: session } = useSession();
	const [username, setUsername] = useState('');
	const [qiita, setQiita] = useState('');
	const [zenn, setZenn] = useState('');
	const [times, setTimes] = useState('');
	const sessionUsername = session?.user.name ?? '';
	const sessionQiita = session?.user.qiita ?? '';
	const sessionZenn = session?.user.zenn ?? '';
	const sessionUserTimes = session?.user.times ?? '';

	useEffect(() => {
		setUsername(sessionUsername);
		setQiita(sessionQiita);
		setZenn(sessionZenn);
		setTimes(sessionUserTimes);
	}, [sessionUsername, sessionQiita, sessionZenn, sessionUserTimes]);

	const handleChangeUserName: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		try {
			const uid = session?.user.id;
			await fetch(`/api/user/${uid}`, {
				method: 'PATCH',
				body: JSON.stringify({ name: username }),
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

	const handleChangeTimes: React.FormEventHandler<HTMLFormElement> = async (e) => {
		e.preventDefault();
		try {
			const uid = session?.user.id;
			await fetch(`/api/user/${uid}`, {
				method: 'PATCH',
				body: JSON.stringify({ times }),
			}).then(() => {
				if (session && session.user) {
					session.user.times = times;
					console.log('#times is changed.');
				}
			});
		} catch (e) {
			console.error(e);
			return;
		}
	};

	// const handleChangeRssUserName = async (e: React.FormEvent<HTMLFormElement>, site: 'qiita' | 'zenn') => {
	// 	e.preventDefault();
	// 	try {
	// 		const uid = session?.user.id;
	// 		if (typeof session === null || typeof uid === 'undefined') throw new Error();

	// 		const res: {
	// 			ok: boolean;
	// 			data: Article[];
	// 		} = await fetch('/api/article/', {
	// 			method: 'POST',
	// 			body: JSON.stringify({
	// 				uid,
	// 				username: site === 'qiita' ? qiita : zenn,
	// 				site,
	// 			}),
	// 		})
	// 			.then((res) => res.json())
	// 			.catch((e) => e);

	// 		// console.log(res);

	// 		// mutate({ ...articles, ...res.data });
	// 		mutate('/api/article/');

	// 		await fetch(`/api/user/${uid}`, {
	// 			method: 'PATCH',
	// 			body: JSON.stringify(site === 'qiita' ? { qiita } : { zenn }),
	// 		}).then(() => {
	// 			if (session && session.user) {
	// 				site === 'qiita' ? (session.user.qiita = qiita) : (session.user.zenn = zenn);
	// 			}
	// 		});
	// 	} catch (e) {
	// 		console.error(e);
	// 		return;
	// 	}
	// };

	const { trigger, isMutating } = useSWRMutation('/api/article/', async (url: string, { arg: site }: { arg: 'qiita' | 'zenn' }) => {
		try {
			const uid = session?.user.id;
			if (typeof session === null || typeof uid === 'undefined') throw new Error();

			const res = await fetch(url, {
				method: 'POST',
				body: JSON.stringify({
					uid,
					username: site === 'qiita' ? qiita : zenn,
					site,
				}),
			});

			// console.log(res);

			if (res.status === 404) {
				alert(res.statusText);
				return false;
			} else if (!res.ok) {
				throw new Error(res.statusText);
			}

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
			// return;
		}
	});

	const { mutate } = useSWRConfig();
	// const { articles, mutate } = useArticleSWR(undefined);
	const onClick = async () => {
		// const users: User[] = await (await fetch(`/api/postgl/`)).json();
		// console.log(users);
		// await mutate('/api/article/');
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
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					trigger('qiita');
					// handleChangeRssUserName(e, 'qiita');
					// await mutate();
				}}
			>
				<p>
					<span>qiita: </span>
					<input type="text" value={qiita} onChange={(e) => setQiita(e.target.value)} disabled={isMutating} />
					<button disabled={isMutating}>登録</button>
				</p>
			</form>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					trigger('zenn');
					// handleChangeRssUserName(e, 'zenn');
					// await mutate();
				}}
			>
				<p>
					<span>zenn: </span>
					<input type="text" value={zenn} onChange={(e) => setZenn(e.target.value)} disabled={isMutating} />
					<button disabled={isMutating}>登録</button>
				</p>
			</form>
			<form onSubmit={handleChangeTimes}>
				<p>
					<span>times_: </span>
					<input type="text" value={times} onChange={(e) => setTimes(e.target.value)} />
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
