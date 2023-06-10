import { Data } from '@/@types/qiita';
import Item from '@/models/item';
import { connectToDatabase } from '@/utils/mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{
		params,
	}: {
		params: { creatorID: string };
	}
) {
	const { db } = await connectToDatabase();
	const data = await db.collection('items').find({ creator: params.creatorID }).toArray();
	return NextResponse.json({ ok: true, data }, { status: 200 });
}
