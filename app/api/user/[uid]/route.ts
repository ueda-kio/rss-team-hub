import User from '@/models/user';
import { connectToDB } from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

export async function PUT(
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
		await connectToDB();

		const user = await User.findById(params.uid);
		if (user === null) {
			notFound();
		}

		if (typeof qiita === 'string') {
			user.set('qiita', qiita);
			await user.save();
		} else {
			typeof zenn === 'string';
		}
		{
			user.set('zenn', zenn);
			await user.save();
		}

		return NextResponse.json({ ok: 'ok' });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: `Internal Server Error: ${e}` }, { status: 500 });
	}
}
