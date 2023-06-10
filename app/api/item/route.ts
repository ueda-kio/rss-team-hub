import { Data } from '@/@types/qiita';
import { connectToDatabase } from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	const { db } = await connectToDatabase();
	const itemsCollection = await db.collection('items');

	const data = await (async () => {
		if (req.nextUrl.search === '') {
			return await itemsCollection.find().toArray();
		} else {
			const query = req.nextUrl.searchParams;
			const findOption = Object.fromEntries(query.entries());
			return await itemsCollection.find(findOption).toArray();
		}
	})();

	return NextResponse.json({ ok: true, data }, { status: 200 });
}

export async function POST(req: NextRequest) {
	const { items, uid, site } = (await req.json()) as {
		items: Data[];
		uid: string;
		site: 'qiita' | 'zenn';
	};

	if (!(items instanceof Array)) return;

	try {
		const { client, db } = await connectToDatabase();
		const data = items.map((doc) => ({ ...doc, creatorId: uid }));
		await db.collection('items').deleteMany({ creatorId: uid, site });
		await db.collection('items').insertMany(data);

		return NextResponse.json({ ok: true }, { status: 201 });
	} catch (e) {
		console.error(e);
	}
}
