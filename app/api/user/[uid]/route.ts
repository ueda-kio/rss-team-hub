import { isIncludeUserType } from '@/lib/typeGuard';
import { connectToDatabase } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

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
		const data = await db.collection('users').findOne({ _id: new ObjectId(params.uid) });
		return NextResponse.json({ data: [data] }, { status: 200 });
	} catch (e) {
		console.error('ユーザーデータの取得に失敗しました。', e);
		return NextResponse.json({}, { status: 500, statusText: `Internal Server Error: ${e}` });
	}
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
		const patchData = await req.json();
		if (!isIncludeUserType(patchData)) {
			throw new Error('payload異常');
		}

		const { db } = await connectToDatabase();
		const re = await db.collection('users').updateMany({ _id: new ObjectId(params.uid) }, { $set: { ...patchData } });
		if (re.modifiedCount === 0) {
			throw new Error('ユーザーが見つかりませんでした。');
		}

		return NextResponse.json({}, { status: 201 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({}, { status: 500, statusText: `Internal Server Error: ${e}` });
	}
}
