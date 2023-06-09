import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
	req: NextRequest,
	{
		params,
	}: {
		params: { uid: string };
	}
) {
	try {
		const { db } = await connectToDatabase();
		const user = await db.collection('users').findOne({ _id: new ObjectId(params.uid) });
		return NextResponse.json({ user }, { status: 200 });
	} catch (e) {}
}

export async function PATCH(
	req: NextRequest,
	{
		params,
	}: {
		params: { uid: string };
	}
) {
	try {
		// TODO: 型定義
		const { qiita, zenn } = await req.json();

		const { db } = await connectToDatabase();

		if (typeof qiita === 'string') {
			await db.collection('users').updateOne({ _id: new ObjectId(params.uid) }, { $set: { qiita } });
		} else if (typeof zenn === 'string') {
			const res = await db.collection('users').updateOne({ _id: new ObjectId(params.uid) }, { $set: { zenn } });
		} else {
			throw new Error('"site" must be either "qiita" or "zenn"');
		}

		return NextResponse.json({ ok: 'ok' }, { status: 201 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: `Internal Server Error: ${e}` }, { status: 500 });
	}
}
