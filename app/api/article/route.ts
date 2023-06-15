import { Article } from '@/@types';
import { prisma } from '@/lib/prisma';
import { connectToDatabase } from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const data = await (async () => {
			if (req.nextUrl.search === '') {
				return await prisma.article.findMany();
			} else {
				const query = req.nextUrl.searchParams;
				const findOption = Object.fromEntries(query.entries());
				return await prisma.article.findMany({
					where: {
						...findOption,
					},
				});
			}
		})();
		return NextResponse.json({ ok: true, data }, { status: 200 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ ok: false }, { status: 500 });
	}

	// const { db } = await connectToDatabase();
	// const itemsCollection = await db.collection('items');

	// const data = await (async () => {
	// 	if (req.nextUrl.search === '') {
	// 		return await itemsCollection.find().toArray();
	// 	} else {
	// 		const query = req.nextUrl.searchParams;
	// 		const findOption = Object.fromEntries(query.entries());
	// 		return await itemsCollection.find(findOption).toArray();
	// 	}
	// })();

	// return NextResponse.json({ ok: true, data }, { status: 200 });
}

export async function POST(req: NextRequest) {
	const { uid, username, site } = (await req.json()) as {
		uid: string;
		username: string;
		site: 'qiita' | 'zenn';
	};

	const fetchQiitaApi = async (username: string, uid: string) => {
		const BASE_URL = `https://qiita.com/api/v2`;
		const ENDPOINT = `${BASE_URL}/users/${username}/items?page=1&per_page=100`;

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

			const feed = (await res.json()) as {
				title?: string;
				url?: string;
				likes_count?: number;
			}[];
			const articles: Omit<Article, 'id'>[] = feed
				.map((post) => {
					const { title, url, likes_count } = post;
					if (typeof url !== 'string' || typeof title !== 'string' || typeof likes_count !== 'number') return false;

					return {
						site: 'qiita',
						title,
						url,
						likes_count,
						publish: true,
						creatorId: uid,
					} as const;
				})
				.filter((item): item is Exclude<typeof item, false> => item !== false);
			return articles;
		} catch (e) {
			return NextResponse.json({ ok: false }, { status: 500, statusText: `${e}` });
		}
	};

	const fetchZennApi = async (username: string, uid: string) => {
		const BASE_URL = 'https://zenn.dev/';
		const ENDPOINT = `https://zenn.dev/api/articles?username=${username}`;

		try {
			const feed = (await (await fetch(ENDPOINT)).json()) as {
				articles: {
					path?: string;
					title?: string;
					liked_count?: number;
				}[];
			};
			const articles: Omit<Article, 'id'>[] = feed.articles
				.map((item) => {
					const { path, title, liked_count } = item;
					if (typeof path !== 'string' || typeof title !== 'string' || typeof liked_count !== 'number') return false;

					return {
						site: 'zenn',
						title,
						url: `${BASE_URL}${path}`,
						likes_count: liked_count,
						publish: true,
						creatorId: uid,
					} as const;
				})
				.filter((item): item is Exclude<typeof item, false> => item !== false);

			return articles;
		} catch (e) {
			console.error(e);
			return NextResponse.json({ ok: false }, { status: 404 });
		}
	};

	try {
		// const { db } = await connectToDatabase();
		const articles = await (async () => {
			if (site === 'qiita') {
				return await fetchQiitaApi(username, uid);
			} else if (site === 'zenn') {
				return await fetchZennApi(username, uid);
			}
			return false;
		})();
		if (articles === false) throw new Error('"site"は"qiita"|"zenn"のみ');
		if (articles instanceof NextResponse) return articles;

		await prisma.article.deleteMany({
			where: {
				creatorId: uid,
				site,
			},
		});
		await prisma.article.createMany({
			data: articles,
		});

		// await db.collection('items').deleteMany({ creatorId: uid, site });
		// await db.collection('items').insertMany(articles);

		return NextResponse.json({ ok: true }, { status: 201 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ ok: false }, { status: 500 });
	}
}
