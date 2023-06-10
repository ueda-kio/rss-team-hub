import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

export async function GET(
	req: NextRequest,
	{
		params,
	}: {
		params: { uid: string };
	}
) {
	const uid = params.uid;
	const BASE_URL = 'https://zenn.dev/';
	const ENDPOINT = `https://zenn.dev/api/articles?username=${uid}`;

	try {
		const feed = (await (await fetch(ENDPOINT)).json()) as { articles: { path?: string; title?: string; liked_count?: number }[] };
		const items = feed.articles
			.map((item) => {
				const { path, title, liked_count } = item;
				if (typeof path !== 'string' || typeof title !== 'string' || typeof liked_count !== 'number') return false;

				return {
					site: 'zenn',
					url: `${BASE_URL}${path}`,
					title,
					likes_count: liked_count,
				};
			})
			.filter((item): item is Exclude<typeof item, false> => item !== false);

		return NextResponse.json(items, { status: 200 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ ok: false }, { status: 404 });
	}
}
