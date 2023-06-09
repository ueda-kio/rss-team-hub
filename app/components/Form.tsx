'use client';

import { Article, Data } from '@/@types/qiita';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function Form() {
	const { data: session } = useSession();
	const [qiitaValue, setQiitaValue] = useState('');
	const [zennValue, setZennValue] = useState('');
	const qiita = session?.user.qiita ?? '';
	const zenn = session?.user.zenn ?? '';

	// TODO: 必要か？sessionの状態監視は誰がしている？
	useEffect(() => {
		setQiitaValue(() => qiita);
		setZennValue(() => zenn);
	}, [session]);

	const handleSubmitQiita = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// if (qiita === qiitaValue) return;

		const res = await fetch(`/api/qiita/${qiitaValue}`);
		const items = (await res.json()) as Data[];
		console.log(items);

		const result = await fetch(`/api/user/${session?.user.id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				qiita: qiitaValue,
			}),
		});

		if (result.ok) {
			console.log('qiita value is update');
			// TODO: ダサすぎ問題
			if (session && session.user) {
				session.user.qiita = qiitaValue;
			}
		} else {
			console.error('error');
		}

		const item = await fetch(`/api/item/`, {
			method: 'POST',
			body: JSON.stringify({
				items,
				uid: session?.user.id ?? '',
				site: 'qiita',
			}),
		});
	};

	const handleSubmitZenn = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// if (zenn === zennValue) return;

		try {
			const res = await fetch(`/api/zenn/${zennValue}`);
			const items = (await res.json()) as Data[];
			console.log(items);

			const result = await fetch(`/api/user/${session?.user.id}`, {
				method: 'PATCH',
				body: JSON.stringify({
					zenn: zennValue,
				}),
			});

			if (result.ok) {
				console.log('zenn value is update');
				if (session && session.user) {
					session.user.zenn = zennValue;
				}
			} else {
				throw new Error('result is not ok');
			}

			const item = await fetch(`/api/item/`, {
				method: 'POST',
				body: JSON.stringify({
					items,
					uid: session?.user.id ?? '',
					site: 'zenn',
				}),
			});
		} catch (e) {
			console.error(e);
		}
	};

	const onChangeQiita = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQiitaValue(() => e.target.value);
	};

	const onChangeZenn = (e: React.ChangeEvent<HTMLInputElement>) => {
		setZennValue(() => e.target.value);
	};

	const onClick = async () => {
		const item = await fetch(`/api/item/`);
		const j = await item.json();
		console.log(j);
	};

	return (
		<>
			<form onSubmit={handleSubmitQiita}>
				<p>
					<span>qiita: </span>
					<input type="text" value={qiitaValue} onChange={onChangeQiita} />
					<button>登録</button>
				</p>
			</form>
			<br />
			<form onSubmit={handleSubmitZenn}>
				<p>
					<span>zenn: </span>
					<input type="text" value={zennValue} onChange={onChangeZenn} />
					<button>登録</button>
				</p>
			</form>
			<button type="button" onClick={onClick}>
				button
			</button>
		</>
	);
}
