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
	const BASE_URL = 'https://zenn.dev';
	const ENDPOINT = `${BASE_URL}/${uid}/feed?all=1`;
	try {
		const feed = await parser.parseURL(ENDPOINT);
		// console.log(feed);
		return NextResponse.json(feed.items, { status: 200 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ ok: false }, { status: 404 });
	}
}
