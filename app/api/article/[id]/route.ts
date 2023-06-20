import { isIncludeArticleType } from '@/lib/typeGuard';
import { connectToDatabase } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
	req: NextRequest,
	{
		params,
	}: {
		params: { id: string };
	}
) {
	try {
		console.log(params.id);
		const patchData = await req.json();
		if (!isIncludeArticleType(patchData)) {
			console.log('patchData', patchData);
			throw new Error('payload異常');
		}

		const { db } = await connectToDatabase();
		const re = await db.collection('items').updateMany({ _id: new ObjectId(params.id) }, { $set: { ...patchData } });
		if (re.modifiedCount === 0) {
			throw new Error('記事が見つかりませんでした。');
		}
		return NextResponse.json({}, { status: 201 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({}, { status: 500, statusText: `Internal Server Error: ${e}` });
	}
}
