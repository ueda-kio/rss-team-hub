import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/mongodb';

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
		// await connectToDB();

		const { client, db } = await connectToDatabase();
		// const user = await db.collection('users').findOne({ id: params.uid});

		// const user = await User.findById(params.uid);
		// if (user === null) {
		// 	notFound();
		// }

		if (typeof qiita === 'string') {
			// user;
			// user.set('qiita', qiita);
			// await user.save();
			// await db.collection('users').findOneAndUpdate({ id: params.uid }, { qiita });
			await db.collection('users').updateOne({ id: params.uid }, { $set: { qiita } });
		} else if (typeof zenn === 'string') {
			// user.set('zenn', zenn);
			// await user.save();

			// await db.collection('users').findOneAndUpdate({ id: params.uid }, { zenn });
			const res = await db.collection('users').updateOne({ id: params.uid }, { $set: { zenn } });
			console.log(res);
		}

		return NextResponse.json({ ok: 'ok' }, { status: 201 });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: `Internal Server Error: ${e}` }, { status: 500 });
	}
}
