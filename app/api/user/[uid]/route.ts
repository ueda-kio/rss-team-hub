import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';
import { isIncludeUserType } from '@/lib/typeGuard';
import { prisma } from '@/lib/prisma';

export async function GET(
	req: NextRequest,
	{
		params,
	}: {
		params: { uid: string };
	}
) {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: params.uid,
			},
		});
		if (user === null) throw new Error('ユーザーが見つかりませんでした。');
		// const { db } = await connectToDatabase();
		// const user = await db.collection('users').findOne({ _id: new ObjectId(params.uid) });
		return NextResponse.json({ user }, { status: 200 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ ok: false }, { status: 404 });
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
			console.log('patchData', patchData);
			throw new Error('payload異常');
		}

		console.log({ patchData });

		const changedUser = await prisma.user.update({
			where: {
				id: params.uid,
			},
			data: {
				...patchData,
			},
		});

		console.log('変更後のuser', changedUser);

		// const { db } = await connectToDatabase();
		// const re = await db.collection('users').updateMany({ _id: new ObjectId(params.uid) }, { $set: { ...patchData } });

		return NextResponse.json({ ok: 'ok' }, { status: 201 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: `Internal Server Error: ${e}` }, { status: 500 });
	}
}
