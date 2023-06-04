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
	const feed = await parser.parseURL(ENDPOINT);
	return NextResponse.json(feed);
}
