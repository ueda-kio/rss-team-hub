import { Article } from '@/@types';
import { connectToDatabase } from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	try {
		const { db } = await connectToDatabase();
		const itemsCollection = await db.collection('items');

		const data = await (async () => {
			if (req.nextUrl.search === '') {
				// queryがなければ全件検索
				return await itemsCollection.find().toArray();
			} else {
				// queryがあれば条件検索
				const query = req.nextUrl.searchParams;
				const findOption = Object.fromEntries(query.entries());
				return await itemsCollection.find(findOption).toArray();
			}
		})();

		return NextResponse.json({ data }, { status: 200 });
	} catch (e) {
		return NextResponse.json({}, { status: 500 });
	}
}

export async function POST(req: NextRequest) {
	const qiitaObj = {
		username: '',
		uid: '',
		BASE_URL: 'https://qiita.com/api/v2/users' as const,
		headers: {
			Authorization: `Bearer ${process.env.QIITA_TOKEN ?? ''}`,
			'Content-Type': 'application/json',
		},
		async isExistUser() {
			const ENDPOINT = `${this.BASE_URL}/${this.username}` as const;

			try {
				const res = await fetch(ENDPOINT, { headers: this.headers });
				return res.status === 200;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async fetchArticles() {
			const ENDPOINT = `${this.BASE_URL}/${this.username}/items?page=1&per_page=100` as const;

			try {
				const res = await fetch(ENDPOINT, { headers: this.headers });
				if (!res.ok) throw Error(res.statusText);

				const feed = (await res.json()) as {
					title?: string;
					url?: string;
					likes_count?: number;
					created_at: string;
				}[];
				const articles: Omit<Article, '_id'>[] = feed
					.map((post) => {
						const { title, url, likes_count, created_at } = post;
						if (typeof url !== 'string' || typeof title !== 'string' || typeof likes_count !== 'number') return false;

						return {
							site: 'qiita',
							title,
							url,
							likes_count,
							created_at,
							publish: true,
							creatorId: this.uid,
						} as const;
					})
					.filter((item): item is Exclude<typeof item, false> => item !== false);
				return articles;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		init(username: string, uid: string) {
			this.username = username;
			this.uid = uid;
		},
	};

	const zennObj = {
		username: '',
		uid: '',
		BASE_URL: 'https://zenn.dev/api' as const,
		async isExistUser() {
			const ENDPOINT = `${this.BASE_URL}/users/${this.username}` as const;

			try {
				const res = await fetch(ENDPOINT);
				return res.status === 200;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		async fetchArticles() {
			const ENDPOINT = `${this.BASE_URL}/articles?username=${this.username}` as const;

			try {
				const res = await fetch(ENDPOINT);
				if (!res.ok) throw Error(res.statusText);

				const feed = (await res.json()) as {
					articles: {
						path?: string;
						title?: string;
						liked_count?: number;
						published_at: string;
					}[];
				};
				const articles: Omit<Article, '_id'>[] = feed.articles
					.map((item) => {
						const { path, title, liked_count, published_at: created_at } = item;
						if (typeof path !== 'string' || typeof title !== 'string' || typeof liked_count !== 'number') return false;

						return {
							site: 'zenn',
							title,
							url: `https://zenn.dev/${path}`,
							likes_count: liked_count,
							created_at,
							publish: true,
							creatorId: this.uid,
						} as const;
					})
					.filter((item): item is Exclude<typeof item, false> => item !== false);

				return articles;
			} catch (e) {
				console.error(e);
				return false;
			}
		},
		init(username: string, uid: string) {
			this.username = username;
			this.uid = uid;
		},
	};

	try {
		const { uid, username, site } = (await req.json()) as {
			uid: string;
			username: string;
			site: 'qiita' | 'zenn';
		};

		const { db } = await connectToDatabase();

		let articles: Omit<Article, '_id'>[];
		if (site === 'qiita') {
			qiitaObj.init(username, uid);
			if (!(await qiitaObj.isExistUser())) {
				return NextResponse.json({}, { status: 404 });
			}

			const res = await qiitaObj.fetchArticles();
			if (res === false) throw new Error();

			articles = res;
		} else if (site === 'zenn') {
			zennObj.init(username, uid);
			if (!(await zennObj.isExistUser())) {
				return NextResponse.json({}, { status: 404 });
			}

			const res = await zennObj.fetchArticles();
			if (res === false) throw new Error();

			articles = res;
		} else {
			console.error('"site" は qiita | zenn のみ許容されています。');
			throw new Error();
		}

		await db.collection('items').deleteMany({ creatorId: uid, site });
		await db.collection('items').insertMany(articles);

		return NextResponse.json({ data: articles }, { status: 201 });
	} catch (e) {
		return NextResponse.json({}, { status: 500 });
	}
}
