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
	const ENDPOINT = `${BASE_URL}/users/${uid}/items?page=1&per_page=3`;
	console.log(process.env.QIITA_TOKEN);
	try {
		const token = process.env.QIITA_TOKEN;
		if (typeof token === 'undefined') throw Error('Access Token is undefined.');

		const res = await fetch(ENDPOINT, {
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
		});
		const json = (await res.json()) as { title: string; url: string }[];
		const posts = json.map((post) => {
			return {
				title: post.title,
				url: post.url,
			};
		});
		return NextResponse.json(posts);
	} catch (e) {
		console.error(e);
	}
}
