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
	console.log('creatorID', params.creatorID);
	const data = await db.collection('items').find({ creator: params.creatorID }).toArray();
	console.log('data', data);
	return NextResponse.json({ ok: true, data }, { status: 200 });
}
