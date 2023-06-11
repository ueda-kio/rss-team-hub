import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{
		params,
	}: {
		params: { uid: string };
	}
) {
	const uid = params.uid;
	const BASE_URL = `https://qiita.com/api/v2`;
	const ENDPOINT = `${BASE_URL}/users/${uid}/items?page=1&per_page=100`;

	try {
		const token = process.env.QIITA_TOKEN;
		if (typeof token === 'undefined') throw Error('Access Token is undefined.');

		const res = await fetch(ENDPOINT, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});

		if (res.status === 404) {
			return NextResponse.json({ ok: false }, { status: 404 });
		}

		const json = (await res.json()) as { title: string; url: string; likes_count: number }[];
		const posts = json.map((post) => {
			const { title, url, likes_count } = post;
			return {
				site: 'qiita',
				title,
				url,
				likes_count,
			};
		});
		return NextResponse.json(posts, { status: 200 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ ok: false }, { status: 500 });
	}
}
