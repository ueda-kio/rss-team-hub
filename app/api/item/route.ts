import { Data } from '@/@types/qiita';
import Item from '@/models/item';
import { connectToDatabase } from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{
		params,
	}: {
		params: { uid?: string; objectId?: string };
	}
) {
	const { db } = await connectToDatabase();
	const data = await db.collection('users').find().toArray();
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
		const data = items.map((doc) => ({ ...doc, creator: uid }));
		await db.collection('items').deleteMany({ creator: uid, site });
		await db.collection('items').insertMany(data);

		return NextResponse.json({ ok: true }, { status: 201 });
	} catch (e) {
		console.error(e);
	}
}
