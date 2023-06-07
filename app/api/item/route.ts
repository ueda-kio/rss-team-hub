import Item from '@/models/item';
import { connectToDB } from '@/utils/database';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{
		params,
	}: {
		params: { uid?: string; objectId?: string };
	}
) {
	// const { uid, objectId } = params;
	return NextResponse.json({ ok: true }, { status: 200 });
}

export async function POST(req: NextRequest) {
	const { item, uid } = await req.json();
	console.log(item);

	if (!(item instanceof Array)) return;

	try {
		await connectToDB();
		item.forEach(async (doc) => {
			// console.log(doc.title);
			const { title, url, likes_count } = doc;

			await Item.create({
				creator: uid,
				title,
				url,
				likes_count,
			});
		});

		return NextResponse.json({ ok: true }, { status: 201 });
	} catch (e) {}
}
