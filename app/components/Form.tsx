'use client';

import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

export default function Form() {
	const { data: session } = useSession();
	const [qiitaValue, setQiitaValue] = useState('');
	const [zennValue, setZennValue] = useState('');
	const qiita = session?.user.qiita ?? '';
	const zenn = session?.user.zenn ?? '';

	useEffect(() => {
		setQiitaValue(() => qiita);
		setZennValue(() => zenn);
	}, [session]);

	const handleSubmitQiita = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const res = await fetch(`/api/qiita/${qiitaValue}`);
		const json = await res.json();
		console.log(json);

		const result = await fetch(`/api/user/${session?.user.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				qiita: qiitaValue,
			}),
		});

		if (result.ok) {
			console.log('qiita value is update');
		} else {
			console.error('error');
		}
	};

	const handleSubmitZenn = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const res = await fetch(`/api/zenn/${zennValue}`);
		const json = await res.json();
		console.log(json);

		const result = await fetch(`/api/user/${session?.user.id}`, {
			method: 'PUT',
			body: JSON.stringify({
				zenn: zennValue,
			}),
		});

		if (result.ok) {
			console.log('zenn value is update');
		} else {
			console.error('error');
		}
	};

	const onChangeQiita = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQiitaValue(() => e.target.value);
	};

	const onChangeZenn = (e: React.ChangeEvent<HTMLInputElement>) => {
		setZennValue(() => e.target.value);
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
		</>
	);
}
